import mongoose from 'mongoose';
import { GDSession, IGDSession } from '../../models/GDSession';
import { Gamification } from '../../models/Gamification';
import { ReadinessScoringService } from '../readiness/readiness.service';
import {
  GDSessionDTO,
  GDParticipantDTO,
  GDTranscriptMessageDTO,
  GDEvaluationReportDTO,
  GDMetricsDTO,
  GDPersona
} from '@placementos/shared';

const AI_PERSONAS: GDParticipantDTO[] = [
  {
    participantId: 'agent-aarav',
    name: 'Aarav Sharma',
    persona: 'aggressive',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    roleDescription: 'Bold & assertive; challenges claims directly, tests if you can stand your ground with poise.',
    voicePitch: 0.9,
    voiceRate: 1.05,
    voiceGender: 'male'
  },
  {
    participantId: 'agent-priya',
    name: 'Priya Iyer',
    persona: 'logical',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
    roleDescription: 'Structured & analytical; evaluates arguments across economic, ethical, and operational pillars.',
    voicePitch: 1.1,
    voiceRate: 1.0,
    voiceGender: 'female'
  },
  {
    participantId: 'agent-rohan',
    name: 'Rohan Verma',
    persona: 'fact_based',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    roleDescription: 'Data-driven; brings in market statistics, real-world case studies, and asks for evidence.',
    voicePitch: 0.95,
    voiceRate: 0.98,
    voiceGender: 'male'
  },
  {
    participantId: 'agent-meera',
    name: 'Meera Sen',
    persona: 'quiet',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80',
    roleDescription: 'Observant & insightful; speaks concisely with high-impact synthesis; rewards inclusive leaders.',
    voicePitch: 1.15,
    voiceRate: 0.95,
    voiceGender: 'female'
  },
  {
    participantId: 'agent-vikram',
    name: 'Vikram Joshi (Moderator)',
    persona: 'dominating',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    roleDescription: 'Session Mediator; guides the conversation phases and enforces discussion decorum.',
    voicePitch: 0.85,
    voiceRate: 1.0,
    voiceGender: 'male'
  }
];

export class GDService {
  /**
   * Retrieves high-frequency campus placement GD topics.
   */
  static getTopics() {
    return [
      {
        id: 'topic-1',
        category: 'Technology & AI Ethics',
        title: 'Will Generative AI Eliminate Entry-Level Engineering Roles or Elevate Developer Productivity?',
        description: 'Discuss impact on campus hiring, entry-level salaries, and shifts toward system design vs syntax.',
        difficulty: 'Medium'
      },
      {
        id: 'topic-2',
        category: 'Economy & Business Strategy',
        title: 'Is the Indian Startup Ecosystem Maturing or Overvalued: Growth vs Profitability?',
        description: 'Debate unit economics, venture capital winter, and path-to-profitability mandates for unicorns.',
        difficulty: 'Hard'
      },
      {
        id: 'topic-3',
        category: 'Work Culture & Ethics',
        title: 'Moonlighting: Ethical Violation of Company Trust or Employee Free-Market Right?',
        description: 'Examine dual employment in tech, IP ownership, conflict of interest, and work-life boundaries.',
        difficulty: 'Medium'
      },
      {
        id: 'topic-4',
        category: 'Data & Privacy',
        title: 'Digital Personal Data Protection: Essential Privacy Right vs Friction for Tech Innovation?',
        description: 'Explore compliance costs, user sovereignty, government surveillance, and cross-border data transfer.',
        difficulty: 'Hard'
      },
      {
        id: 'topic-5',
        category: 'Campus & Career Readiness',
        title: 'Should College Degrees be Replaced by Skill-Based Micro-Credentials in Tech Placements?',
        description: 'Debate standard institutional rigor, networking, and foundation vs agile industry-aligned skills.',
        difficulty: 'Easy'
      }
    ];
  }

  /**
   * Initializes a live GD Room session with diverse AI participants.
   */
  static async createSession(userId: string, topic: string, timeLimitMinutes = 10): Promise<GDSessionDTO> {
    const participants = AI_PERSONAS.slice(0, 5);

    // Initial opening remarks from moderator and first participant to kick off discussion
    const initialTranscript = [
      {
        speakerId: 'agent-vikram',
        speakerName: 'Vikram Joshi (Moderator)',
        isStudent: false,
        message: `Welcome everyone to today's placement group discussion. The topic before the panel is: "${topic}". We have ${timeLimitMinutes} minutes. Please maintain decorum, build on each other's points, and present structured perspectives. You may begin now.`,
        timestamp: new Date().toISOString(),
        durationSeconds: 12
      },
      {
        speakerId: 'agent-priya',
        speakerName: 'Priya Iyer',
        isStudent: false,
        message: `Thank you, Vikram. To initiate the discussion, I believe we should look at "${topic}" from two critical angles: first, the macroeconomic reality, and second, the direct operational impact on young professionals.`,
        timestamp: new Date().toISOString(),
        durationSeconds: 10
      },
      {
        speakerId: 'agent-aarav',
        speakerName: 'Aarav Sharma',
        isStudent: false,
        message: `While Priya frames it conceptually, let us look at the ground truth. Companies are already changing hiring rubrics because efficiency is non-negotiable today. Anyone who ignores this will be left behind in campus placements.`,
        timestamp: new Date().toISOString(),
        durationSeconds: 11
      }
    ];

    const session = await GDSession.create({
      student: new mongoose.Types.ObjectId(userId),
      topic,
      timeLimitMinutes,
      aiParticipants: participants,
      transcript: initialTranscript.map((t) => ({
        speakerId: t.speakerId,
        speakerName: t.speakerName,
        isStudent: t.isStudent,
        message: t.message,
        timestamp: new Date(t.timestamp),
        durationSeconds: t.durationSeconds
      })),
      status: 'active'
    });

    return {
      id: session._id.toString(),
      topic: session.topic,
      timeLimitMinutes: session.timeLimitMinutes,
      aiParticipants: participants,
      transcript: initialTranscript,
      status: 'active',
      createdAt: session.createdAt?.toISOString() || new Date().toISOString()
    };
  }

  /**
   * Records student turn and generates responsive AI turns where participants debate the student and each other.
   */
  static async processStudentTurn(
    sessionId: string,
    studentMessage: string,
    durationSeconds = 15
  ): Promise<{
    studentTurn: GDTranscriptMessageDTO;
    aiResponses: GDTranscriptMessageDTO[];
    sessionStatus: string;
  }> {
    const session = await GDSession.findById(sessionId);
    if (!session) {
      throw new Error('GD session not found');
    }

    const studentRecord: GDTranscriptMessageDTO = {
      speakerId: 'student',
      speakerName: 'You (Student)',
      isStudent: true,
      message: studentMessage.trim(),
      timestamp: new Date().toISOString(),
      durationSeconds
    };

    // Append student turn
    session.transcript.push({
      speakerId: studentRecord.speakerId,
      speakerName: studentRecord.speakerName,
      isStudent: true,
      message: studentRecord.message,
      timestamp: new Date(),
      durationSeconds
    });

    // Generate responsive AI turns
    const aiResponses = this.generateDynamicAIResponses(
      session.topic,
      studentMessage,
      session.transcript.map((t) => ({
        speakerId: t.speakerId,
        speakerName: t.speakerName,
        isStudent: t.isStudent,
        message: t.message,
        timestamp: t.timestamp.toISOString()
      }))
    );

    // Append AI turns
    aiResponses.forEach((aiTurn) => {
      session.transcript.push({
        speakerId: aiTurn.speakerId,
        speakerName: aiTurn.speakerName,
        isStudent: false,
        message: aiTurn.message,
        timestamp: new Date(aiTurn.timestamp),
        durationSeconds: aiTurn.durationSeconds
      });
    });

    await session.save();

    return {
      studentTurn: studentRecord,
      aiResponses,
      sessionStatus: session.status
    };
  }

  /**
   * Generates AI participants talking to each other if the student is observing or waiting.
   */
  static async generateAutonomousAITurn(sessionId: string): Promise<GDTranscriptMessageDTO[]> {
    const session = await GDSession.findById(sessionId);
    if (!session) throw new Error('GD session not found');

    const lastSpeakerId = session.transcript[session.transcript.length - 1]?.speakerId;

    // Pick next AI participant different from last speaker
    const availableAgents = AI_PERSONAS.filter((a) => a.participantId !== lastSpeakerId && a.participantId !== 'agent-vikram');
    const selectedAgent = availableAgents[Math.floor(Math.random() * availableAgents.length)];

    let nextMessage = '';
    if (selectedAgent.persona === 'fact_based') {
      nextMessage = `Adding to what was just discussed, recent market reports show that over 65% of enterprise teams cite data reliability as their primary hurdle. We cannot overlook the quantitative side here.`;
    } else if (selectedAgent.persona === 'logical') {
      nextMessage = `I see merit in that perspective. However, let us also evaluate the long-term sustainability. If we look at the stakeholders involved, there are regulatory constraints we must consider.`;
    } else if (selectedAgent.persona === 'quiet') {
      nextMessage = `If I may add a quick point, we are focusing heavily on the immediate friction, but the core question is whether the fundamental value proposition holds true over a 3-year horizon.`;
    } else {
      nextMessage = `I see where you are coming from, but that is a conservative approach. In an aggressive competitive landscape, speed of execution always trumps premature optimization.`;
    }

    const aiTurn: GDTranscriptMessageDTO = {
      speakerId: selectedAgent.participantId,
      speakerName: selectedAgent.name,
      isStudent: false,
      message: nextMessage,
      timestamp: new Date().toISOString(),
      durationSeconds: 12
    };

    session.transcript.push({
      speakerId: aiTurn.speakerId,
      speakerName: aiTurn.speakerName,
      isStudent: false,
      message: aiTurn.message,
      timestamp: new Date(),
      durationSeconds: aiTurn.durationSeconds
    });

    await session.save();
    return [aiTurn];
  }

  /**
   * Concludes the GD session and deterministically computes the 11-dimension feedback report.
   */
  static async concludeSession(sessionId: string, userId: string): Promise<GDEvaluationReportDTO> {
    const session = await GDSession.findById(sessionId);
    if (!session) throw new Error('GD session not found');

    const studentTurns = session.transcript.filter((t) => t.isStudent);
    const totalTurns = session.transcript.length;

    // Total time calculations
    const studentSpeakingTimeSec = studentTurns.reduce((acc, t) => acc + (t.durationSeconds || 15), 0);
    const totalSpeakingTimeSec = session.transcript.reduce((acc, t) => acc + (t.durationSeconds || 12), 0);
    const speakingTimePercentage = totalSpeakingTimeSec > 0
      ? Math.round((studentSpeakingTimeSec / totalSpeakingTimeSec) * 100)
      : 20;

    // Deterministic metrics evaluation
    const studentWords = studentTurns.map((t) => t.message.toLowerCase()).join(' ');
    const turnCount = studentTurns.length;

    // 1. Listening & Building on others (checks mentions of peers like Priya, Aarav, Rohan, Meera)
    const mentionsOthers = studentWords.includes('priya') || studentWords.includes('aarav') || studentWords.includes('rohan') || studentWords.includes('meera') || studentWords.includes('agree') || studentWords.includes('point');
    const listeningScore = mentionsOthers ? 82 : turnCount > 1 ? 65 : 45;

    // 2. Leadership & Initiation
    const leadershipScore = turnCount >= 3 ? 85 : turnCount === 2 ? 70 : 50;

    // 3. Argument Quality & Structured Reasoning
    const hasStructuredPhrasing = studentWords.includes('first') || studentWords.includes('because') || studentWords.includes('for example') || studentWords.includes('perspective') || studentWords.includes('evidence');
    const argumentQuality = hasStructuredPhrasing ? 84 : 68;
    const reasoning = hasStructuredPhrasing ? 86 : 65;

    // 4. Clarity & Communication
    const avgLength = turnCount > 0 ? studentWords.split(' ').length / turnCount : 0;
    const clarity = avgLength > 15 && avgLength < 80 ? 88 : 70;
    const communication = turnCount > 0 ? 80 : 40;

    // 5. Interruption Control & Courtesy
    const interruptionControl = speakingTimePercentage >= 15 && speakingTimePercentage <= 30 ? 88 : speakingTimePercentage > 40 ? 55 : 75;

    // 6. Confidence & Relevance
    const confidence = turnCount >= 2 ? 82 : 60;
    const relevance = studentWords.length > 30 ? 85 : 55;

    // 7. Vocabulary & Tone
    const vocabulary = 78;
    const conclusionQuality = studentTurns.some((t) => t.message.toLowerCase().includes('conclusion') || t.message.toLowerCase().includes('summar') || t.message.toLowerCase().includes('finally')) ? 85 : 62;

    const metrics: GDMetricsDTO = {
      communication,
      confidence,
      clarity,
      relevance,
      leadership: leadershipScore,
      listening: listeningScore,
      interruptionControl,
      vocabulary,
      argumentQuality,
      reasoning,
      conclusionQuality
    };

    // Calculate deterministic average score
    const scoresArray = Object.values(metrics);
    const overallScore = Math.round(scoresArray.reduce((acc, s) => acc + s, 0) / scoresArray.length);

    let tier: 'Needs Practice' | 'Developing' | 'GD Competent' | 'Placement Ready' = 'Developing';
    if (overallScore >= 85) tier = 'Placement Ready';
    else if (overallScore >= 72) tier = 'GD Competent';
    else if (overallScore >= 55) tier = 'Developing';
    else tier = 'Needs Practice';

    const keyStrengths: string[] = [];
    const priorityFixes: string[] = [];

    if (speakingTimePercentage >= 15 && speakingTimePercentage <= 28) {
      keyStrengths.push(`Optimal Share of Voice: spoke for ${speakingTimePercentage}% of total discussion time (ideal benchmark is 18-25%).`);
    } else if (speakingTimePercentage < 12) {
      priorityFixes.push(`Low Share of Voice (${speakingTimePercentage}%): you were too passive. Recruiters look for candidates who intervene proactively at least 2-3 times.`);
    } else {
      priorityFixes.push(`Monopolizing the floor (${speakingTimePercentage}%): spoke for too long in single stretches without allowing peers to respond.`);
    }

    if (mentionsOthers) {
      keyStrengths.push('Active Listening & Collaborative Synthesis: explicitly referenced teammates points, establishing diplomatic leadership.');
    } else {
      priorityFixes.push('Acknowledge Teammates Points: start interventions with phrases like "Building on Priya’s point..." to demonstrate active listening.');
    }

    if (hasStructuredPhrasing) {
      keyStrengths.push('Structured Multi-Pillar Reasoning: presented arguments with clear logical sequencing.');
    } else {
      priorityFixes.push('Frame arguments with structural markers: use "From an operational lens..." or "Two key drivers to consider are..." rather than unstructured opinions.');
    }

    const report: GDEvaluationReportDTO = {
      overallScore,
      tier,
      metrics,
      keyStrengths,
      priorityFixes,
      studentSpeakingTimeSec,
      totalSpeakingTimeSec,
      speakingTimePercentage,
      turnCount,
      coachingAction: priorityFixes[0] || 'Continue practicing with aggressive personas to refine polite interjections.'
    };

    session.report = {
      overallScore: report.overallScore,
      metrics: report.metrics,
      keyStrengths: report.keyStrengths,
      priorityFixes: report.priorityFixes
    };
    session.status = 'concluded';
    session.completedAt = new Date();
    await session.save();

    // Award XP
    await Gamification.findOneAndUpdate(
      { student: userId },
      {
        $inc: { totalXP: 100 },
        $push: {
          unlockedBadges: {
            badgeId: 'gd_gladiator',
            badgeName: 'GD Room Champion',
            category: 'gd',
            unlockedAt: new Date()
          }
        }
      }
    );

    // Recalculate deterministic placement readiness score!
    try {
      await ReadinessScoringService.calculateAndSaveReadiness(userId, 'interview_completed');
    } catch (e) {
      console.error('Error recalculating readiness after GD:', e);
    }

    return report;
  }

  // --- Dynamic AI Response Helper ---
  private static generateDynamicAIResponses(
    topic: string,
    studentMessage: string,
    transcript: any[]
  ): GDTranscriptMessageDTO[] {
    const responses: GDTranscriptMessageDTO[] = [];
    const lower = studentMessage.toLowerCase();

    // Response 1: Aarav (Challenges) or Rohan (Data)
    if (lower.includes('cost') || lower.includes('money') || lower.includes('revenue') || lower.includes('market')) {
      responses.push({
        speakerId: 'agent-rohan',
        speakerName: 'Rohan Verma',
        isStudent: false,
        message: `I appreciate that point regarding costs, but let us look at the macroeconomic data. Companies investing in automation have reported up to 35% margin expansion over two fiscal quarters. That changes the capital equation completely.`,
        timestamp: new Date().toISOString(),
        durationSeconds: 14
      });
      responses.push({
        speakerId: 'agent-aarav',
        speakerName: 'Aarav Sharma',
        isStudent: false,
        message: `Rohan is right on the numbers, but I would challenge the panel here: margins mean nothing if customer churn increases. So what is our concrete counter-measure?`,
        timestamp: new Date().toISOString(),
        durationSeconds: 11
      });
    } else {
      responses.push({
        speakerId: 'agent-priya',
        speakerName: 'Priya Iyer',
        isStudent: false,
        message: `That is an interesting observation brought up by our peer. If we connect that to the human capital side, workforce upskilling becomes the true differentiator rather than just adoption.`,
        timestamp: new Date().toISOString(),
        durationSeconds: 13
      });
      responses.push({
        speakerId: 'agent-aarav',
        speakerName: 'Aarav Sharma',
        isStudent: false,
        message: `I disagree with Priya's idealistic view. In reality, retraining 10,000 employees is far too slow. Startups will outpace traditional firms by hiring specialist talent directly.`,
        timestamp: new Date().toISOString(),
        durationSeconds: 11
      });
    }

    return responses;
  }
}
