'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { DEFAULT_GD_TOPICS, GDTopic } from '@/lib/gd-topics';
import {
  GDSessionDTO,
  GDParticipantDTO,
  GDTranscriptMessageDTO,
  GDEvaluationReportDTO,
  GDMetricsDTO
} from '@placementos/shared';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  Users,
  MessageSquare,
  Award,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  Flame,
  ChevronRight,
  Send,
  Zap,
  Radio,
  BookOpen,
  Compass,
  Smile,
  BarChart3,
  Layers,
  Info
} from 'lucide-react';

const PREVIEW_PERSONAS = [
  {
    id: 'agent-aarav',
    name: 'Aarav Sharma',
    persona: 'Aggressive Challenger',
    color: 'from-rose-500 to-red-600',
    borderColor: 'border-rose-500/40',
    bgColor: 'bg-rose-500/10',
    badgeColor: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    style: 'Direct, rapid-fire, challenges assumptions instantly. Tests emotional poise under pressure.'
  },
  {
    id: 'agent-priya',
    name: 'Priya Iyer',
    persona: 'Structured Analyst',
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500/40',
    bgColor: 'bg-blue-500/10',
    badgeColor: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
    style: 'Analytical frameworks, economic vs social lenses. Values balanced multi-pillar reasoning.'
  },
  {
    id: 'agent-rohan',
    name: 'Rohan Verma',
    persona: 'Data & Case Machine',
    color: 'from-amber-500 to-yellow-600',
    borderColor: 'border-amber-500/40',
    bgColor: 'bg-amber-500/10',
    badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    style: 'Cites market stats, company precedents, and GDP percentages. Demands factual substantiation.'
  },
  {
    id: 'agent-meera',
    name: 'Meera Sen',
    persona: 'Empathetic Synthesizer',
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-500/10',
    badgeColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80',
    style: 'Quiet, observant, high-impact interventions. Rewards candidates who bridge opposing views.'
  },
  {
    id: 'agent-vikram',
    name: 'Vikram Joshi',
    persona: 'Session Moderator',
    color: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-500/40',
    bgColor: 'bg-purple-500/10',
    badgeColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    style: 'Campus panel chair. Introduces the prompt, monitors turn-taking, and calls for final conclusions.'
  }
];

const INTERJECTION_PROMPTS = [
  'Building on Priya\'s point about operational reality...',
  'I see where Aarav is coming from, but looking at long-term data...',
  'To substantiate Rohan\'s observation with another industry precedent...',
  'While we have looked at the economic side, we must also consider the ethical dimension...',
  'To summarize our consensus before we conclude...'
];

export default function GDPracticeRoomPage() {
  // Session setup state
  const topics = DEFAULT_GD_TOPICS;
  const [selectedTopic, setSelectedTopic] = useState<string>(DEFAULT_GD_TOPICS[0].title);
  const [customTopic, setCustomTopic] = useState('');
  const [timeLimit, setTimeLimit] = useState<number>(10);
  const [isInitializing, setIsInitializing] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);

  // Active Session state
  const [session, setSession] = useState<GDSessionDTO | null>(null);
  const [currentSpeakerId, setCurrentSpeakerId] = useState<string | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(600);
  const [isSendingTurn, setIsSendingTurn] = useState(false);
  const [isGeneratingPeerTurn, setIsGeneratingPeerTurn] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isAutoDebateActive, setIsAutoDebateActive] = useState(true);

  // Speech input state
  const [studentInput, setStudentInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Evaluation Report state
  const [isConcluding, setIsConcluding] = useState(false);
  const [report, setReport] = useState<GDEvaluationReportDTO | null>(null);

  // Refs
  const recognitionRef = useRef<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoDebateTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Static prompts keep the public practice preview available without a backend.
  useEffect(() => {
    // Check Speech Recognition capability
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoDebateTimerRef.current) clearInterval(autoDebateTimerRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (session && session.status === 'active') {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            handleConcludeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session?.id, session?.status]);

  // Scroll transcript to bottom on new messages
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session?.transcript]);

  // Speech Synthesis helper
  const speakUtterance = (text: string, speakerId: string) => {
    if (!isAudioEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Map speaker to voice tuning
    const persona = PREVIEW_PERSONAS.find((p) => p.id === speakerId);
    if (speakerId === 'agent-aarav') {
      utterance.pitch = 0.9;
      utterance.rate = 1.05;
    } else if (speakerId === 'agent-priya') {
      utterance.pitch = 1.1;
      utterance.rate = 1.0;
    } else if (speakerId === 'agent-rohan') {
      utterance.pitch = 0.95;
      utterance.rate = 1.0;
    } else if (speakerId === 'agent-meera') {
      utterance.pitch = 1.2;
      utterance.rate = 0.92;
    } else {
      utterance.pitch = 0.85;
      utterance.rate = 0.98;
    }

    setCurrentSpeakerId(speakerId);
    utterance.onend = () => {
      setCurrentSpeakerId(null);
    };
    utterance.onerror = () => {
      setCurrentSpeakerId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Start GD Session
  const handleStartSession = async () => {
    const topicToUse = customTopic.trim() ? customTopic.trim() : selectedTopic;
    if (!topicToUse) return;

    setServiceError(null);
    setIsInitializing(true);
    try {
      const data = await apiClient.post<GDSessionDTO>('/gd/session', {
        topic: topicToUse,
        timeLimitMinutes: timeLimit
      });

      setSession(data);
      setTimeLeftSeconds(data.timeLimitMinutes * 60);

      // Play moderator opening utterance
      if (data.transcript.length > 0) {
        const opening = data.transcript[0];
        speakUtterance(opening.message, opening.speakerId);
      }
    } catch (e) {
      console.error('Failed to initialize GD session:', e);
      setServiceError(
        e instanceof Error
          ? e.message
          : 'Live discussion sessions are temporarily unavailable.'
      );
    } finally {
      setIsInitializing(false);
    }
  };

  // Autonomous peer debate trigger
  const triggerPeerDebate = async () => {
    if (!session || session.status !== 'active' || isGeneratingPeerTurn) return;
    setIsGeneratingPeerTurn(true);
    try {
      const turns = await apiClient.post<GDTranscriptMessageDTO[]>(
        `/gd/session/${session.id}/ai-turn`
      );
      if (turns && turns.length > 0) {
        const newTurn = turns[0];
        setSession((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            transcript: [...prev.transcript, newTurn]
          };
        });
        speakUtterance(newTurn.message, newTurn.speakerId);
      }
    } catch (e) {
      console.error('Failed to generate peer turn:', e);
    } finally {
      setIsGeneratingPeerTurn(false);
    }
  };

  // Send Student turn
  const handleSendStudentTurn = async () => {
    if (!session || !studentInput.trim() || isSendingTurn) return;

    const messageText = studentInput.trim();
    setStudentInput('');
    setIsSendingTurn(true);

    // Stop speech recognition if listening
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    try {
      const result = await apiClient.post<{
        studentTurn: GDTranscriptMessageDTO;
        aiResponses: GDTranscriptMessageDTO[];
        sessionStatus: string;
      }>(`/gd/session/${session.id}/turn`, {
        message: messageText,
        durationSeconds: Math.max(10, Math.min(60, Math.round(messageText.split(' ').length * 0.4)))
      });

      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          transcript: [...prev.transcript, result.studentTurn, ...result.aiResponses]
        };
      });

      // Speak first AI response
      if (result.aiResponses.length > 0) {
        const firstAI = result.aiResponses[0];
        speakUtterance(firstAI.message, firstAI.speakerId);
      }
    } catch (e) {
      console.error('Failed to send turn:', e);
    } finally {
      setIsSendingTurn(false);
    }
  };

  // Toggle Voice Recognition (Speech-to-Text)
  const toggleListening = () => {
    if (!speechSupported) {
      setSpeechError('Speech recognition is not supported in this browser. Please type your intervention below.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setStudentInput((prev) => (prev ? `${prev} ${currentTranscript}` : currentTranscript));
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission was denied. Please allow microphone access or use text input.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.error('Could not start recognition:', e);
      setSpeechError(e.message || 'Error starting speech recognition');
      setIsListening(false);
    }
  };

  // Conclude GD and calculate report
  const handleConcludeSession = async () => {
    if (!session || isConcluding) return;
    setIsConcluding(true);

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    try {
      const evaluation = await apiClient.post<GDEvaluationReportDTO>(
        `/gd/session/${session.id}/conclude`
      );
      setReport(evaluation);
      setSession((prev) => (prev ? { ...prev, status: 'concluded', report: evaluation } : null));
    } catch (e) {
      console.error('Failed to conclude GD session:', e);
    } finally {
      setIsConcluding(false);
    }
  };

  // Restart / New GD
  const handleReset = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSession(null);
    setReport(null);
    setCurrentSpeakerId(null);
    setStudentInput('');
    setIsListening(false);
    setTimeLeftSeconds(600);
  };

  // Compute live Share of Voice
  const computeLiveShareOfVoice = () => {
    if (!session) return 20;
    const studentCount = session.transcript.filter((t) => t.isStudent).length;
    const totalCount = session.transcript.length;
    if (totalCount === 0) return 20;
    return Math.round((studentCount / totalCount) * 100);
  };

  const liveShare = computeLiveShareOfVoice();

  // Helper for formatting time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="workspace-page min-h-screen bg-[#070A12] text-slate-100 flex flex-col selection:bg-purple-600">
      {/* Navigation Header */}
      <nav className="border-b border-slate-800/80 bg-[#070A12]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
                P
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                PlacementOS
              </span>
            </Link>
            <div className="hidden sm:flex items-center space-x-2 pl-3 border-l border-slate-800">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center space-x-1">
                <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
                <span>AI Group Discussion Room</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              title={isAudioEnabled ? 'Mute AI Voices' : 'Unmute AI Voices'}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                isAudioEnabled
                  ? 'bg-purple-600/15 border-purple-500/30 text-purple-300 hover:bg-purple-600/25'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {isAudioEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-purple-400" />
                  <span className="hidden md:inline">Voice Engine Active</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span className="hidden md:inline">Muted</span>
                </>
              )}
            </button>

            <Link
              href="/roadmap"
              className="text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800/50 transition-all flex items-center space-x-1"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Roadmap</span>
            </Link>

            <Link
              href="/dashboard"
              className="text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800/50 transition-all"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Body */}
      <main className="flex-1 flex flex-col">
        {/* ========================================================= */}
        {/* VIEW 1: LOBBY & SETUP (Before session starts)             */}
        {/* ========================================================= */}
        {!session && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
            {/* Hero / Intro */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero-Judgment AI Placement Round</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Master the Campus Group Discussion with{' '}
                <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                  Live Multi-Agent Peers
                </span>
              </h1>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                Step into a voice-first virtual round table where 5 AI participants with distinct debate personalities challenge you, debate each other, and evaluate your presence across 11 deterministic placement competencies.
              </p>
            </div>

            {/* Grid: Topic Selection & Participant Roster */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Topics & Config (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-purple-400" />
                      <span>1. Choose Discussion Topic</span>
                    </h2>
                    <span className="text-xs text-slate-400">Curated Campus Prompts</span>
                  </div>

                  {/* Curated list */}
                  <div className="space-y-3">
                    {topics.map((t) => {
                      const isSelected = selectedTopic === t.title && !customTopic;
                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            setSelectedTopic(t.title);
                            setCustomTopic('');
                          }}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-purple-950/30 border-purple-500/50 shadow-lg shadow-purple-500/10'
                              : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                              {t.category}
                            </span>
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                t.difficulty === 'Hard'
                                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                  : t.difficulty === 'Medium'
                                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {t.difficulty}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-100 leading-snug">
                            {t.title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {t.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom Topic Option */}
                  <div className="pt-4 border-t border-slate-800/80 space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <span>Or Enter a Custom Discussion Prompt</span>
                    </label>
                    <input
                      type="text"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="e.g. Impact of EV Subsidies on Indian Manufacturing, 4-Day Work Week..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  {/* Time Limit Selector */}
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-300 block">Session Duration</span>
                      <span className="text-[11px] text-slate-500">Realistic placement rounds are 10–15 mins</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {[5, 10, 15].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => setTimeLimit(mins)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            timeLimit === mins
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                              : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                          }`}
                        >
                          {mins} mins
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={handleStartSession}
                    disabled={isInitializing}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-base shadow-xl shadow-purple-600/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {isInitializing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        <span>Seating Participants at Round Table...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-current" />
                        <span>Join Live GD Room</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  {serviceError && (
                    <div
                      role="alert"
                      className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200"
                    >
                      {serviceError}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Participant Roster (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                      <Users className="w-5 h-5 text-indigo-400" />
                      <span>2. Panel & Participant Personas</span>
                    </h2>
                    <span className="text-xs text-emerald-400 font-semibold">5 AI Co-Discussants</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Just like an authentic campus placement round, you won&apos;t just be talking to an AI bot—these participants debate each other, interrupt, and challenge your claims.
                  </p>

                  <div className="space-y-3 pt-2">
                    {PREVIEW_PERSONAS.map((p) => (
                      <div
                        key={p.id}
                        className={`p-3.5 rounded-xl border ${p.borderColor} ${p.bgColor} flex items-start space-x-3.5`}
                      >
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-11 h-11 rounded-full object-cover border-2 border-slate-700/80 shadow-md shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-100">{p.name}</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.badgeColor}`}>
                              {p.persona}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            {p.style}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <Mic className="w-3.5 h-3.5 text-purple-400" />
                      <span>Voice-First Experience</span>
                    </div>
                    <span>Push-to-Talk or Real-Time Mic</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: ACTIVE 360° ROUND TABLE DISCUSSION ROOM           */}
        {/* ========================================================= */}
        {session && session.status === 'active' && (
          <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 space-y-4">
            {/* Top Command Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur shadow-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Radio className="w-5 h-5 text-purple-400 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                      Live Round Table
                    </span>
                    <span className="text-xs text-slate-400">
                      {session.transcript.length} turns spoken
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-md sm:max-w-xl">
                    {session.topic}
                  </h2>
                </div>
              </div>

              {/* Status Indicators & Conclude Button */}
              <div className="flex items-center space-x-3 ml-auto">
                {/* Timer Badge */}
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-mono font-bold text-amber-300">
                    {formatTime(timeLeftSeconds)}
                  </span>
                </div>

                {/* Share of Voice Gauge */}
                <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <span className="text-slate-400">Your Share:</span>
                  <span
                    className={`font-bold ${
                      liveShare >= 18 && liveShare <= 28
                        ? 'text-emerald-400'
                        : liveShare < 15
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {liveShare}%
                  </span>
                  <span className="text-[10px] text-slate-500">(18-25% ideal)</span>
                </div>

                {/* End & Evaluate Button */}
                <button
                  onClick={handleConcludeSession}
                  disabled={isConcluding}
                  className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-lg shadow-rose-600/10"
                >
                  {isConcluding ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-rose-400 border-t-transparent" />
                      <span>Grading...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Conclude & Evaluate</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Split Screen Layout: Virtual Round Table (Left 7 cols) & Live Transcript (Right 5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-stretch">
              {/* Virtual Conference Stage */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                {/* 360° Circular Table Visualization */}
                <div className="relative flex-1 min-h-[460px] p-6 rounded-3xl bg-gradient-to-b from-[#0B0F1C] to-[#080C16] border border-slate-800 shadow-2xl flex flex-col items-center justify-between overflow-hidden">
                  {/* Subtle Background Radial Glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/15 via-transparent to-transparent pointer-events-none" />

                  {/* Virtual Center Table */}
                  <div className="absolute inset-x-16 top-28 bottom-28 rounded-full border border-slate-800/80 bg-slate-900/40 shadow-inner flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                    <div className="h-14 w-14 rounded-full bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mb-2">
                      <Radio className="w-6 h-6 text-purple-400 animate-pulse" />
                    </div>
                    <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">
                      Placement Round Table
                    </span>
                    <span className="text-[11px] text-slate-500 max-w-xs mt-0.5 line-clamp-2">
                      {session.topic}
                    </span>
                  </div>

                  {/* Participant Seats Arranged Around Table */}
                  {/* Top: Vikram (Moderator) */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={`relative p-1 rounded-full transition-all duration-300 ${
                        currentSpeakerId === 'agent-vikram'
                          ? 'ring-4 ring-purple-500 shadow-xl shadow-purple-500/50 scale-110'
                          : ''
                      }`}
                    >
                      <img
                        src={PREVIEW_PERSONAS[4].avatar}
                        alt="Vikram"
                        className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/50"
                      />
                      {currentSpeakerId === 'agent-vikram' && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-500" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-purple-300 mt-1">Vikram (Moderator)</span>
                    <span className="text-[10px] text-slate-400">Chair</span>
                  </div>

                  {/* Middle Row: Left: Aarav | Right: Priya */}
                  <div className="relative z-10 w-full flex items-center justify-between px-2 sm:px-8">
                    {/* Aarav Sharma (Left) */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`relative p-1 rounded-full transition-all duration-300 ${
                          currentSpeakerId === 'agent-aarav'
                            ? 'ring-4 ring-rose-500 shadow-xl shadow-rose-500/50 scale-110'
                            : ''
                        }`}
                      >
                        <img
                          src={PREVIEW_PERSONAS[0].avatar}
                          alt="Aarav"
                          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-rose-500/50"
                        />
                        {currentSpeakerId === 'agent-aarav' && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-rose-300 mt-1">Aarav</span>
                      <span className="text-[10px] text-slate-400">Challenger</span>
                    </div>

                    {/* Priya Iyer (Right) */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`relative p-1 rounded-full transition-all duration-300 ${
                          currentSpeakerId === 'agent-priya'
                            ? 'ring-4 ring-blue-500 shadow-xl shadow-blue-500/50 scale-110'
                            : ''
                        }`}
                      >
                        <img
                          src={PREVIEW_PERSONAS[1].avatar}
                          alt="Priya"
                          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-blue-500/50"
                        />
                        {currentSpeakerId === 'agent-priya' && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-blue-300 mt-1">Priya</span>
                      <span className="text-[10px] text-slate-400">Logical</span>
                    </div>
                  </div>

                  {/* Lower Row: Left: Meera | Right: Rohan */}
                  <div className="relative z-10 w-full flex items-center justify-between px-10 sm:px-20 mb-2">
                    {/* Meera Sen */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`relative p-1 rounded-full transition-all duration-300 ${
                          currentSpeakerId === 'agent-meera'
                            ? 'ring-4 ring-emerald-500 shadow-xl shadow-emerald-500/50 scale-110'
                            : ''
                        }`}
                      >
                        <img
                          src={PREVIEW_PERSONAS[3].avatar}
                          alt="Meera"
                          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full object-cover border-2 border-emerald-500/50"
                        />
                        {currentSpeakerId === 'agent-meera' && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-emerald-300 mt-1">Meera</span>
                      <span className="text-[10px] text-slate-400">Synthesizer</span>
                    </div>

                    {/* Rohan Verma */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`relative p-1 rounded-full transition-all duration-300 ${
                          currentSpeakerId === 'agent-rohan'
                            ? 'ring-4 ring-amber-500 shadow-xl shadow-amber-500/50 scale-110'
                            : ''
                        }`}
                      >
                        <img
                          src={PREVIEW_PERSONAS[2].avatar}
                          alt="Rohan"
                          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full object-cover border-2 border-amber-500/50"
                        />
                        {currentSpeakerId === 'agent-rohan' && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-amber-300 mt-1">Rohan</span>
                      <span className="text-[10px] text-slate-400">Data-driven</span>
                    </div>
                  </div>

                  {/* Bottom Center: You (The Candidate) */}
                  <div className="relative z-10 flex flex-col items-center mt-2">
                    <div
                      className={`relative p-1.5 rounded-full transition-all duration-300 ${
                        isListening
                          ? 'ring-4 ring-emerald-400 shadow-2xl shadow-emerald-400/50 scale-115'
                          : 'ring-2 ring-purple-500/50'
                      }`}
                    >
                      <div className="w-15 h-15 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        YOU
                      </div>
                      {isListening && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-extrabold text-white mt-1">Candidate (You)</span>
                    <span className="text-[10px] text-purple-300 font-semibold">
                      {isListening ? '🎤 Speaking...' : 'Ready to Intervene'}
                    </span>
                  </div>

                  {/* Active Speaker Floating Subtitle Bubble */}
                  {currentSpeakerId && (
                    <div className="absolute top-16 inset-x-8 max-w-xl mx-auto z-20 bg-slate-900/95 border border-purple-500/50 shadow-2xl rounded-2xl p-3.5 backdrop-blur animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping" />
                        <span className="text-xs font-bold text-purple-300">
                          {PREVIEW_PERSONAS.find((p) => p.id === currentSpeakerId)?.name || 'Participant'} is speaking:
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 italic line-clamp-2">
                        &ldquo;{session.transcript[session.transcript.length - 1]?.message}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {/* Candidate Interactive Audio & Speech Console */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                  {/* Quick Interjection Starters (Placement etiquette) */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Placement Interjection Frameworks (Click to Pre-fill):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {INTERJECTION_PROMPTS.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => setStudentInput((prev) => (prev ? `${prev} ${prompt}` : prompt))}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 hover:text-purple-300 hover:border-purple-500/40 border border-slate-800 text-[11px] font-medium transition-all"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input area: Speech Mic + Textarea + Send */}
                  <div className="flex items-center space-x-2 pt-1">
                    {/* Voice Mic Button */}
                    <button
                      onClick={toggleListening}
                      title={isListening ? 'Stop Speaking' : 'Click to Speak via Microphone'}
                      className={`p-3 rounded-xl border flex items-center justify-center transition-all shadow-lg ${
                        isListening
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/30 animate-pulse'
                          : 'bg-slate-800/80 text-purple-400 border-purple-500/30 hover:bg-purple-600/20'
                      }`}
                    >
                      {isListening ? <Mic className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5" />}
                    </button>

                    {/* Text input for speech fallback */}
                    <input
                      type="text"
                      value={studentInput}
                      onChange={(e) => setStudentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendStudentTurn();
                      }}
                      placeholder={isListening ? 'Listening to your voice...' : 'Speak into mic or type your argument... (Enter to speak)'}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />

                    {/* Send Button */}
                    <button
                      onClick={handleSendStudentTurn}
                      disabled={!studentInput.trim() || isSendingTurn}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center space-x-1.5 transition-all disabled:opacity-40"
                    >
                      {isSendingTurn ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <span>Speak</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Mic Error Alert */}
                  {speechError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{speechError}</span>
                    </div>
                  )}

                  {/* Auxiliary Actions: Autonomous Peer Debate Button */}
                  <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
                    <span>Want to observe peer debate?</span>
                    <button
                      onClick={triggerPeerDebate}
                      disabled={isGeneratingPeerTurn}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-all disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Let Peers Debate (Next Speaker)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Transcript & Feedback Feed (Right 5 cols) */}
              <div className="lg:col-span-5 flex flex-col p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl min-h-[500px]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <span>Live GD Transcript</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    {session.transcript.length} remarks recorded
                  </span>
                </div>

                {/* Messages scroll box */}
                <div className="flex-1 overflow-y-auto space-y-3.5 py-4 pr-1 max-h-[580px]">
                  {session.transcript.map((msg, index) => {
                    const isStudent = msg.isStudent;
                    const persona = PREVIEW_PERSONAS.find((p) => p.id === msg.speakerId);

                    return (
                      <div
                        key={index}
                        className={`p-3.5 rounded-2xl border text-xs leading-relaxed transition-all ${
                          isStudent
                            ? 'bg-purple-950/30 border-purple-500/40 text-purple-100 ml-4'
                            : 'bg-slate-950/60 border-slate-800/90 text-slate-300 mr-2'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`font-bold ${
                                isStudent
                                  ? 'text-purple-300'
                                  : persona?.id === 'agent-aarav'
                                  ? 'text-rose-400'
                                  : persona?.id === 'agent-priya'
                                  ? 'text-blue-400'
                                  : persona?.id === 'agent-rohan'
                                  ? 'text-amber-400'
                                  : persona?.id === 'agent-meera'
                                  ? 'text-emerald-400'
                                  : 'text-purple-400'
                              }`}
                            >
                              {msg.speakerName}
                            </span>
                            {isStudent && (
                              <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                                Candidate
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <p className="whitespace-pre-line text-slate-200">
                          {msg.message}
                        </p>

                        {!isStudent && (
                          <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                            <span>{persona?.persona || 'Participant'}</span>
                            <button
                              onClick={() => speakUtterance(msg.message, msg.speakerId)}
                              className="text-slate-400 hover:text-purple-400 flex items-center space-x-1"
                            >
                              <Volume2 className="w-3 h-3" />
                              <span>Replay</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div ref={transcriptEndRef} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: 11-DIMENSION HONEST POST-GD FEEDBACK REPORT       */}
        {/* ========================================================= */}
        {report && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 animate-in fade-in duration-500">
            {/* Header Banner: Score & Readiness Tier */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0E1324] to-slate-900 border border-purple-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  <span>Official GD Assessment Card</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                  Group Discussion Diagnostic Report
                </h1>
                <p className="text-slate-400 text-sm max-w-xl">
                  {session?.topic}
                </p>
              </div>

              {/* Overall Score Circle */}
              <div className="flex items-center space-x-6 bg-slate-950/70 p-5 rounded-2xl border border-slate-800 shadow-xl">
                <div className="text-center">
                  <span className="text-5xl font-black text-white tracking-tight">
                    {report.overallScore}
                  </span>
                  <span className="text-xs text-slate-500 block uppercase font-bold mt-0.5">
                    / 100 Score
                  </span>
                </div>
                <div className="h-12 w-px bg-slate-800" />
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                      report.tier === 'Placement Ready'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : report.tier === 'GD Competent'
                        ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                        : report.tier === 'Developing'
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {report.tier}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[140px]">
                    Evaluated across 11 campus hiring rubrics
                  </p>
                </div>
              </div>
            </div>

            {/* Share of Voice & Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Strengths, Priority Fixes & Share of Voice (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Share of Voice Gauge */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span>Share of Voice & Airtime Dynamics</span>
                    </h3>
                    <span className="text-xs font-bold text-purple-300">
                      {report.speakingTimePercentage}% of total discussion time
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-slate-950 rounded-full h-3.5 overflow-hidden flex border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-700"
                        style={{ width: `${Math.min(100, report.speakingTimePercentage)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>0% (Passive)</span>
                      <span className="text-emerald-400 font-bold">18–25% (Ideal Recruiter Benchmark)</span>
                      <span>50%+ (Dominating)</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    {report.speakingTimePercentage < 15
                      ? '⚠️ You were too passive. Recruiters look for candidates who intervene proactively at least 2–3 times without waiting for direct invitations.'
                      : report.speakingTimePercentage > 35
                      ? '⚠️ You monopolized excessive airtime. Remember: a GD is an exercise in collaborative problem solving, not a solo debate.'
                      : '✅ Balanced airtime: You contributed meaningfully while giving peers ample space to build and counter.'}
                  </p>
                </div>

                {/* Key Strengths */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/20 shadow-xl space-y-4">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center space-x-2 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Key Demonstrated Strengths</span>
                  </h3>
                  <div className="space-y-2.5">
                    {report.keyStrengths.map((str, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-100 flex items-start space-x-2.5"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Critical Priority Fixes */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-rose-500/20 shadow-xl space-y-4">
                  <h3 className="text-sm font-bold text-rose-400 flex items-center space-x-2 uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Critical Placement Fixes (Recruiter Feedback)</span>
                  </h3>
                  <div className="space-y-2.5">
                    {report.priorityFixes.map((fix, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-100 flex items-start space-x-2.5"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span>{fix}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: 11 Competency Rubrics (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                      <span>11 Placement Competencies</span>
                    </h3>
                    <span className="text-xs text-slate-400">Deterministic Scoring</span>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    {Object.entries(report.metrics).map(([key, score]) => {
                      const label = key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase());

                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-300 font-medium">{label}</span>
                            <span
                              className={`font-bold ${
                                score >= 80
                                  ? 'text-emerald-400'
                                  : score >= 65
                                  ? 'text-blue-400'
                                  : 'text-amber-400'
                              }`}
                            >
                              {score}/100
                            </span>
                          </div>
                          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                score >= 80
                                  ? 'bg-emerald-500'
                                  : score >= 65
                                  ? 'bg-blue-500'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Action Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-tr from-purple-950/40 to-slate-900 border border-purple-500/30 shadow-xl space-y-4 text-center">
                  <h4 className="text-sm font-bold text-white">
                    Ready for Another Round?
                  </h4>
                  <p className="text-xs text-slate-400">
                    Consistent multi-topic practice builds automatic reflexive poise for real placement day.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      onClick={handleReset}
                      className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Start New GD</span>
                    </button>
                    <Link
                      href="/dashboard"
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <span>Return to Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
