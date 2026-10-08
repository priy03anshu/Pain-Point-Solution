'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Brain,
  ShieldCheck,
  Target,
  Sparkles,
  BarChart3,
  Clock,
  Compass,
  FileText,
  Users
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 selection:bg-blue-600">
      {/* Navigation Header */}
      <nav className="border-b border-slate-800/80 bg-[#090D16]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              P
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              PlacementOS
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <Link href="/gd" className="text-purple-400 font-semibold flex items-center space-x-1 hover:text-purple-300 transition-colors">
              <Users className="w-3.5 h-3.5" />
              <span>AI GD Room</span>
            </Link>
            <Link href="/roadmap" className="text-amber-400 font-semibold flex items-center space-x-1 hover:text-amber-300 transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Roadmapper</span>
            </Link>
            <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-blue-400 transition-colors">Core Features</a>
            <a href="#readiness" className="hover:text-blue-400 transition-colors">Readiness Formula</a>
            <a href="#faq" className="hover:text-blue-400 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-md transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-blue-600/25 transition-all flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Intelligence & Placement Command Center</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Prepare Smarter.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Get Placement Ready.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Not another passive video course. A closed-loop diagnostic coach that diagnoses your weaknesses, computes your deterministic readiness score, and tells you exactly what to prepare today.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-xl shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/gd"
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-purple-800/80 to-indigo-800/80 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl border border-purple-500/40 flex items-center justify-center space-x-2 transition-all shadow-lg shadow-purple-600/25 transform hover:-translate-y-0.5"
            >
              <Users className="w-4 h-4 text-purple-300" />
              <span>AI GD Practice Room</span>
            </Link>
            <Link
              href="/roadmap"
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-semibold rounded-xl border border-amber-500/30 flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/10"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Career Roadmapper</span>
            </Link>
          </div>

          {/* Core Loop Indicators */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur text-xs font-medium text-slate-300">
            <div className="flex items-center space-x-2 justify-center py-2">
              <Compass className="w-4 h-4 text-blue-400" />
              <span>1. Diagnosis</span>
            </div>
            <div className="flex items-center space-x-2 justify-center py-2">
              <Target className="w-4 h-4 text-indigo-400" />
              <span>2. Guidance</span>
            </div>
            <div className="flex items-center space-x-2 justify-center py-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>3. Daily Plan</span>
            </div>
            <div className="flex items-center space-x-2 justify-center py-2">
              <Brain className="w-4 h-4 text-pink-400" />
              <span>4. AI Feedback</span>
            </div>
            <div className="col-span-2 md:col-span-1 flex items-center space-x-2 justify-center py-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>5. Progress</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 bg-slate-950/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-white">Why 80% of Students Struggle in Placements</h2>
            <p className="mt-4 text-slate-400 text-base">
              Students waste months bingeing content tutorials without knowing if they are actually improving where companies test them.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-bold mb-4">
                01
              </div>
              <h3 className="text-lg font-semibold text-white">Blind Practice Without Diagnosis</h3>
              <p className="mt-2 text-slate-400 text-sm leading-relaxed">
                Solving 300 random problems without knowing whether your biggest failure risk is behavioral communication, system design, or speed in quantitative logic.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-4">
                02
              </div>
              <h3 className="text-lg font-semibold text-white">Rigid Degrees & Generic LMS</h3>
              <p className="mt-2 text-slate-400 text-sm leading-relaxed">
                Generic course platforms force everyone through identical syllabi regardless of whether you are BTech, BCA, MCA, MBA, or BSc.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold mb-4">
                03
              </div>
              <h3 className="text-lg font-semibold text-white">No Single Truth Metric</h3>
              <p className="mt-2 text-slate-400 text-sm leading-relaxed">
                Students walk into interviews guessing if they are ready. PlacementOS answers the 5 critical questions deterministically with data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Command Center Preview */}
      <section id="preview" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Command Center Experience</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">Opening Your Dashboard Feels Like Mission Control</h2>
            <p className="mt-4 text-slate-400">
              Clear hierarchy answering: Where am I now? What is stopping me? What should I do next?
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Readiness Score Card */}
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Placement Readiness</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Job Ready
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline space-x-2">
                    <span className="text-5xl font-extrabold text-white">68%</span>
                    <span className="text-sm text-emerald-400 font-semibold">+8% this week</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">Target Role: Full Stack Software Engineer</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800">
                  <div className="text-xs text-slate-400">Next Assessment: 4 days remaining</div>
                  <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
                    <div className="bg-blue-500 h-2 rounded-full w-[68%]" />
                  </div>
                </div>
              </div>

              {/* Biggest Risk Alert */}
              <div className="p-6 rounded-xl bg-slate-950 border border-amber-500/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Biggest Placement Risk</span>
                  </div>
                  <h4 className="mt-3 text-lg font-semibold text-white">
                    Situational Communication Under Pressure
                  </h4>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    Diagnostic shows 40% accuracy in structured conflict framing. Communication is currently your primary bottleneck, not technical DSA.
                  </p>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-amber-500/10 text-amber-300 text-xs font-medium">
                  Recommendation: Complete 15-min STAR Method Practice Drill
                </div>
              </div>

              {/* Today's Tasks */}
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Focus Tasks</span>
                  <span className="text-xs text-blue-400 font-semibold">60 min budget</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">Hash Tables & Trees Drill</span>
                    <span className="text-slate-400">25 min</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">Logical Reasoning Speed Test</span>
                    <span className="text-slate-400">20 min</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">STAR Behavioral Reflection</span>
                    <span className="text-slate-400">15 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8-Dimension Readiness Model */}
      <section id="readiness" className="py-20 bg-slate-950/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Deterministic Intelligence</span>
            <h2 className="text-3xl font-bold text-white mt-2">The 8-Dimension Placement Readiness Model</h2>
            <p className="mt-4 text-slate-400 text-sm">
              No black-box guesses. Scores are computed deterministically via backend business logic.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: '1. Technical Competency', weight: '25%', desc: 'Difficulty-weighted coding & domain concepts' },
              { title: '2. Problem Solving & Logic', weight: '20%', desc: 'Quantitative aptitude, speed & accuracy' },
              { title: '3. Target Role Match', weight: '15%', desc: 'Inventory of verified role requirements' },
              { title: '4. Communication', weight: '10%', desc: 'Verbal clarity, situational judgment' },
              { title: '5. Interview Performance', weight: '10%', desc: 'Trailing average across AI mock interviews' },
              { title: '6. Resume & ATS Score', weight: '10%', desc: 'ATS readability, bullet impact & keywords' },
              { title: '7. Profile & Portfolio', weight: '5%', desc: 'Verified projects, credentials & links' },
              { title: '8. Consistency & Streak', weight: '5%', desc: '14-day rolling prep velocity & discipline' },
            ].map((dim, i) => (
              <div key={i} className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{dim.title}</span>
                  <span className="text-xs font-bold text-blue-400">{dim.weight}</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">{dim.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="text-base font-semibold text-white">Can I use PlacementOS if I am not from a CS / B.Tech background?</h3>
              <p className="mt-2 text-sm text-slate-400">
                Yes! PlacementOS is completely degree-independent. Whether you are BBA, MBA, BCom, BCA, MCA, BSc, or a custom diploma, all diagnostic questions, scoring weights, and daily plans automatically adapt to your chosen target role.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="text-base font-semibold text-white">How does the initial diagnostic work?</h3>
              <p className="mt-2 text-sm text-slate-400">
                After setting up your profile, you take a 10-question adaptive diagnostic. It tests technical skills, aptitude logic, and communication. It identifies your weak topics and generates your baseline readiness score.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="text-base font-semibold text-white">Does the AI make up arbitrary test scores?</h3>
              <p className="mt-2 text-sm text-slate-400">
                No. All scores, weights, streaks, XP, and readiness calculations are deterministic backend business logic. The AI assists in question framing and semantic feedback, while backend code evaluates the mathematical score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 bg-gradient-to-b from-blue-950/20 to-slate-950 border-t border-slate-800 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Ready to Know Your Real Placement Readiness?</h2>
          <p className="mt-4 text-slate-400 text-sm">
            Join thousands of students diagnosed and prepared across top engineering and management companies.
          </p>
          <div className="mt-8">
            <Link
              href="/register"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-xl shadow-blue-600/30 transition-all"
            >
              <span>Start Diagnostic Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <p>© 2026 PlacementOS. Built with modern career intelligence architecture.</p>
      </footer>
    </div>
  );
}
