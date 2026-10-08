'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import {
  Timer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Brain,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';

interface QuestionItem {
  id: string;
  category: string;
  topic: string;
  subTopic?: string;
  questionType: string;
  difficulty: string;
  prompt: string;
  scenarioContext?: string;
  options: Array<{ optionId: string; text: string }>;
}

export default function AssessmentRunnerPage() {
  const router = useRouter();
  const [assessment, setAssessment] = useState<{
    assessmentId: string;
    title: string;
    description: string;
    totalQuestions: number;
    timeLimitMinutes: number;
    questions: QuestionItem[];
  } | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(1200); // 20 mins
  const [isLoading, setIsLoading] = useState(true);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [error, setError] = useState('');

  // Diagnostic result state
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    // Start initial assessment
    apiClient
      .post<any>('/assessments/initial/start')
      .then((data) => {
        setAssessment(data);
        setTimeRemaining(data.timeLimitMinutes * 60);
        setQuestionStartTime(Date.now());
      })
      .catch((err) => {
        setError(err.message || 'Failed to start initial assessment');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!assessment || result) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalize();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [assessment, result]);

  const currentQuestion = assessment?.questions[currentIndex];

  const handleOptionToggle = (optionId: string) => {
    if (currentQuestion?.questionType === 'multi_choice') {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
      } else {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleNext = async () => {
    if (!assessment || !currentQuestion) return;
    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));

    // Submit answer turn to API
    try {
      await apiClient.post(`/assessments/${assessment.assessmentId}/submit-answer`, {
        questionId: currentQuestion.id,
        selectedOptionIds: selectedOptions.length > 0 ? selectedOptions : ['A'],
        timeSpentSeconds: timeSpent
      });
    } catch (e) {
      console.error('Failed to record answer turn:', e);
    }

    if (currentIndex + 1 < assessment.questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOptions([]);
      setQuestionStartTime(Date.now());
    } else {
      handleFinalize();
    }
  };

  const handleFinalize = async () => {
    if (!assessment) return;
    setIsFinalizing(true);
    try {
      const res = await apiClient.post<any>(`/assessments/${assessment.assessmentId}/finalize`);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Error scoring assessment');
    } finally {
      setIsFinalizing(false);
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  if (isLoading) {
    return (
      <div className="workspace-page min-h-screen bg-[#090D16] flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4" />
        <p className="text-sm text-slate-400">Calibrating your initial placement diagnostic...</p>
      </div>
    );
  }

  // --- RESULT VIEW ---
  if (result) {
    return (
      <div className="workspace-page min-h-screen bg-[#090D16] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider">
              Diagnostic Complete
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
              Placement Readiness Diagnostic Report
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
              Your responses have been deterministically scored across all technical, aptitude, and communication dimensions.
            </p>
          </div>

          {/* Top Score Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Diagnostic Score</span>
              <div className="mt-2 text-4xl font-extrabold text-white">
                {result.percentageScore}%
              </div>
              <p className="text-xs text-slate-500 mt-1">{result.totalScore} / {result.maxScore} points</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-blue-500/30 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Calibrated Readiness</span>
              <div className="mt-2 text-4xl font-extrabold text-blue-400">
                {result.readiness?.overallScore || result.percentageScore}%
              </div>
              <p className="text-xs text-slate-400 mt-1">Tier: {result.readiness?.tier || 'Emerging'}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Time</span>
              <div className="mt-2 text-4xl font-extrabold text-white">
                {Math.round(result.totalTimeSpentSeconds / 60)}m
              </div>
              <p className="text-xs text-slate-500 mt-1">{result.totalTimeSpentSeconds} seconds total</p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Diagnostic Category Breakdown</span>
            </h3>
            <div className="space-y-4">
              {result.categoryBreakdown?.map((cat: any) => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300 capitalize">{cat.category}</span>
                    <span className="text-slate-400">{cat.accuracy}% Accuracy ({cat.score}/{cat.maxScore} pts)</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${cat.accuracy >= 70 ? 'bg-emerald-500' : cat.accuracy >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${cat.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strong vs Weak Topics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/20">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5 mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Strengths</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {result.strongTopics?.length > 0 ? (
                  result.strongTopics.map((topic: string) => (
                    <span key={topic} className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                      {topic}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">Continue practicing to verify mastery topics</span>
                )}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/20">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5 mb-3">
                <AlertTriangle className="w-4 h-4" />
                <span>Identified Improvement Areas</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {result.weakTopics?.length > 0 ? (
                  result.weakTopics.map((topic: string) => (
                    <span key={topic} className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
                      {topic}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">No critical weak topics identified</span>
                )}
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 via-slate-900 to-indigo-900/30 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white">Recommended Next Action:</h4>
              <p className="text-xs text-slate-300 mt-1">{result.recommendedNextAction}</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/30 shrink-0"
            >
              <span>Go to Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIVE RUNNER VIEW ---
  if (!currentQuestion) {
    return (
      <div className="workspace-page min-h-screen bg-[#090D16] flex items-center justify-center p-4">
        <p className="text-slate-400">No questions available.</p>
      </div>
    );
  }

  return (
    <div className="workspace-page min-h-screen bg-[#090D16] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Placement Diagnostic
            </span>
            <div className="text-sm font-bold text-white mt-0.5">
              Question {currentIndex + 1} of {assessment?.totalQuestions}
            </div>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-blue-400 text-xs font-mono font-bold">
            <Timer className="w-4 h-4 text-blue-400" />
            <span>{formatTimer(timeRemaining)}</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
              {currentQuestion.category} • {currentQuestion.topic}
            </span>
            <span className="text-xs text-slate-400 capitalize">
              Difficulty: {currentQuestion.difficulty}
            </span>
          </div>

          {currentQuestion.scenarioContext && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 italic leading-relaxed">
              {currentQuestion.scenarioContext}
            </div>
          )}

          <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {currentQuestion.prompt}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOptions.includes(opt.optionId);
              return (
                <button
                  key={opt.optionId}
                  type="button"
                  onClick={() => handleOptionToggle(opt.optionId)}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-start space-x-3 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 text-white shadow-md shadow-blue-500/10'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span
                    className={`h-6 w-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {opt.optionId}
                  </span>
                  <span className="leading-snug">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {currentQuestion.questionType === 'multi_choice' ? 'Select all that apply' : 'Select one option'}
            </span>

            <button
              type="button"
              disabled={selectedOptions.length === 0 || isFinalizing}
              onClick={handleNext}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm flex items-center space-x-2 transition-all disabled:opacity-40 shadow-lg shadow-blue-600/20"
            >
              <span>
                {currentIndex + 1 === assessment?.totalQuestions
                  ? isFinalizing
                    ? 'Scoring...'
                    : 'Submit & Finalize'
                  : 'Next Question'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
