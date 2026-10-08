'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import {
  TrendingUp,
  ShieldAlert,
  Target,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BarChart3,
  BookOpen,
  LogOut,
  RefreshCw,
  Compass,
  AlertTriangle,
  Users,
  Radio
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);

  const fetchSummary = async () => {
    try {
      const summary = await apiClient.get<any>('/dashboard/summary');
      setData(summary);
    } catch (err: any) {
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    try {
      await apiClient.post('/readiness/recalculate');
      await fetchSummary();
    } catch (e) {
      console.error(e);
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    if (completedTaskIds.includes(taskId)) return;
    try {
      await apiClient.post(`/dashboard/tasks/${taskId}/complete`);
      setCompletedTaskIds([...completedTaskIds, taskId]);
      setData((prev: any) => ({
        ...prev,
        xpPoints: (prev?.xpPoints || 0) + 25
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    apiClient.clearTokens();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="workspace-page min-h-screen bg-[#090D16] flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4" />
        <p className="text-sm text-slate-400">Loading your command center...</p>
      </div>
    );
  }

  const readiness = data?.readiness;
  const dimensionScores = readiness?.dimensionScores || {};

  const chartData = [
    { name: 'Technical', score: dimensionScores.technical || 45, full: 'Technical Competency' },
    { name: 'Logic', score: dimensionScores.problemSolving || 50, full: 'Quantitative Aptitude' },
    { name: 'Role Match', score: dimensionScores.roleMatch || 60, full: 'Role Skills Alignment' },
    { name: 'Comm', score: dimensionScores.communication || 55, full: 'Communication' },
    { name: 'Interview', score: dimensionScores.interview || 50, full: 'Interview Readiness' },
    { name: 'Resume', score: dimensionScores.resume || 40, full: 'Resume & ATS Quality' },
    { name: 'Profile', score: dimensionScores.profile || 65, full: 'Profile & Portfolio' },
    { name: 'Streak', score: dimensionScores.consistency || 70, full: 'Preparation Consistency' }
  ];

  return (
    <div className="workspace-page min-h-screen bg-[#090D16] text-slate-100">
      {/* Top Command Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <span className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-blue-500/20">
                P
              </span>
              <span className="font-bold text-lg text-white">PlacementOS</span>
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Command Center
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Streak & XP */}
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>{data?.streakDays || 1}d Streak</span>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{data?.xpPoints || 50} XP</span>
            </div>

            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Command Center Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome & Target Role Subheader */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {data?.user?.fullName || 'Student'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Target Role: <span className="text-blue-400 font-semibold">{data?.profile?.targetRoles?.[0] || 'Software Engineer'}</span> •
              Targeting: <span className="text-slate-300 font-medium">{data?.profile?.targetCompanies?.join(', ') || 'Top Tech Companies'}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/gd"
              className="px-3.5 py-2 bg-gradient-to-r from-purple-800/80 to-indigo-800/80 hover:from-purple-700 hover:to-indigo-700 text-purple-200 text-xs font-semibold rounded-xl border border-purple-500/40 flex items-center space-x-1.5 transition-all shadow-md shadow-purple-500/10"
            >
              <Users className="w-3.5 h-3.5 text-purple-300" />
              <span>AI GD Room</span>
            </Link>

            <Link
              href="/roadmap"
              className="px-3.5 py-2 bg-gradient-to-r from-amber-900/60 to-orange-900/60 hover:from-amber-900 hover:to-orange-900 text-amber-200 text-xs font-semibold rounded-xl border border-amber-500/40 flex items-center space-x-1.5 transition-all shadow-md shadow-amber-500/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Roadmapper</span>
            </Link>

            <button
              onClick={handleRecalculate}
              disabled={isRecalculating}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
              <span>Recalculate</span>
            </button>

            <Link
              href="/assessment"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 flex items-center space-x-1.5 transition-all"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Diagnostic Drill</span>
            </Link>
          </div>
        </div>

        {/* Feature Spotlight Banner: AI Group Discussion Simulator */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Radio className="w-6 h-6 text-purple-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  New Simulation
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Voice-First
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                AI Group Discussion Practice Room
              </h3>
              <p className="text-xs text-slate-400">
                Join a live round-table with 5 AI participants (Aarav, Priya, Rohan, Meera, Vikram) who debate each other and give honest 11-dimension feedback.
              </p>
            </div>
          </div>
          <Link
            href="/gd"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center space-x-2 transition-all shrink-0"
          >
            <span>Enter GD Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* PRIMARY COMMAND ROW: Readiness Score + Biggest Risks + Today's Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. Placement Readiness Score Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Placement Readiness Score
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {readiness?.tier || 'Job Ready'}
                </span>
              </div>

              <div className="mt-4 flex items-baseline space-x-3">
                <span className="text-6xl font-black text-white tracking-tight">
                  {readiness?.overallScore ?? 65}%
                </span>
                <span className="text-sm font-semibold text-emerald-400 flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 inline" />
                  <span>+{readiness?.deltaFromPrevious ?? 5}%</span>
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                Deterministic mathematical evaluation across verified technical tests, aptitude logic, role overlap, and interview readiness.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <div className="flex justify-between text-xs font-medium text-slate-400 mb-1.5">
                <span>Distance to Top 10% Placement Benchmark</span>
                <span className="text-slate-200">85% Goal</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${readiness?.overallScore ?? 65}%` }}
                />
              </div>
            </div>
          </div>

          {/* 2. Biggest Placement Risks */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/20 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Primary Placement Blocker</span>
              </div>

              {readiness?.biggestRisks && readiness.biggestRisks.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {readiness.biggestRisks[0].insight}
                  </h3>
                  <div className="mt-3 inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                    Urgency: {readiness.biggestRisks[0].urgency}
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-white leading-snug">
                    Situational Communication Under Pressure
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    Diagnostic shows lower confidence framing structured answers. Communication is currently your biggest placement blocker.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium leading-relaxed">
              Immediate Recommendation: Complete 15 minutes of STAR structured behavioral practice drills today.
            </div>
          </div>

          {/* 3. Today's Tasks */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Today's Tasks
                  </span>
                </div>
                <span className="text-xs text-blue-400 font-semibold">
                  {data?.profile?.dailyPrepTimeMinutes || 60}m budget
                </span>
              </div>

              <div className="space-y-2.5">
                {data?.todayTasks?.map((task: any) => {
                  const isDone = completedTaskIds.includes(task.id) || task.status === 'completed';
                  return (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start space-x-3 ${
                        isDone
                          ? 'border-emerald-500/30 bg-emerald-500/5 text-slate-400 line-through'
                          : 'border-slate-800 bg-slate-950 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${isDone ? 'text-emerald-400' : 'text-slate-600'}`}
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{task.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {task.estimatedMinutes} min • {task.category}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
              Completing daily tasks automatically maintains your streak & rebalances tomorrow's schedule.
            </div>
          </div>
        </div>

        {/* SECONDARY ROW: 8-Dimension Breakdown + Top 3 Improvement Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 8-Dimension Bar Chart */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">8-Dimension Category Competency Breakdown</h3>
              </div>
              <span className="text-xs text-slate-400">Deterministic Model (Max 100)</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B1120', borderColor: '#1F2937', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: any) => [`${val}%`, 'Score']}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.score >= 70 ? '#10B981' : entry.score >= 50 ? '#3B82F6' : '#F59E0B'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top 3 Improvement Opportunities */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-bold text-white">Top Improvement Opportunities</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Ranked by potential gain points to maximize readiness return on time invested:
            </p>

            <div className="space-y-3">
              {readiness?.topImprovementOpportunities?.slice(0, 3).map((opp: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{opp.area}</span>
                    <span className="text-xs font-bold text-emerald-400">+{opp.potentialGainPoints} pts</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">{opp.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
