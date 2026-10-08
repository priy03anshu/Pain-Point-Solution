'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import {
  GraduationCap,
  Briefcase,
  Target,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Degree & College
  const [degree, setDegree] = useState('B.Tech Computer Science & Engineering');
  const [college, setCollege] = useState('Engineering Institute');
  const [graduationYear, setGraduationYear] = useState(2026);
  const [currentSemester, setCurrentSemester] = useState(7);

  // Skills
  const [skills, setSkills] = useState<Array<{ name: string; proficiency: number }>>([
    { name: 'Data Structures', proficiency: 4 },
    { name: 'JavaScript / TypeScript', proficiency: 4 },
    { name: 'SQL', proficiency: 3 }
  ]);
  const [newSkillName, setNewSkillName] = useState('');

  // Target Roles & Companies
  const [targetRoles, setTargetRoles] = useState<string[]>(['Software Engineer', 'Full Stack Developer']);
  const [newRole, setNewRole] = useState('');
  const [targetCompanies, setTargetCompanies] = useState<string[]>(['Google', 'Microsoft', 'Razorpay']);
  const [newCompany, setNewCompany] = useState('');

  // Commitment & Timeline
  const [experienceLevel, setExperienceLevel] = useState<'fresher' | 'internship' | '0-1_years' | '1-3_years'>('fresher');
  const [expectedPackageLPA, setExpectedPackageLPA] = useState(14);
  const [dailyPrepTimeMinutes, setDailyPrepTimeMinutes] = useState(60);
  const [placementDeadline, setPlacementDeadline] = useState(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Projects
  const [projectTitle, setProjectTitle] = useState('Campus Collaboration Web App');
  const [projectTech, setProjectTech] = useState('React, Node.js, MongoDB');

  const addSkill = () => {
    if (newSkillName.trim() && !skills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      setSkills([...skills, { name: newSkillName.trim(), proficiency: 3 }]);
      setNewSkillName('');
    }
  };

  const removeSkill = (name: string) => {
    setSkills(skills.filter((s) => s.name !== name));
  };

  const addRole = () => {
    if (newRole.trim() && !targetRoles.includes(newRole.trim())) {
      setTargetRoles([...targetRoles, newRole.trim()]);
      setNewRole('');
    }
  };

  const addCompany = () => {
    if (newCompany.trim() && !targetCompanies.includes(newCompany.trim())) {
      setTargetCompanies([...targetCompanies, newCompany.trim()]);
      setNewCompany('');
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        degree,
        college,
        graduationYear: Number(graduationYear),
        currentSemester: Number(currentSemester),
        skills: skills.map((s) => ({ name: s.name, category: 'technical', proficiency: s.proficiency })),
        interests: ['Software Development', 'Problem Solving'],
        targetRoles,
        targetCompanies,
        expectedPackageLPA: Number(expectedPackageLPA),
        experienceLevel,
        dailyPrepTimeMinutes: Number(dailyPrepTimeMinutes),
        placementDeadline: new Date(placementDeadline).toISOString(),
        projects: [
          {
            title: projectTitle,
            description: 'Full-stack application demonstrating key target role proficiencies',
            techStack: projectTech.split(',').map((t) => t.trim())
          }
        ],
        certifications: []
      };

      await apiClient.post('/onboarding/complete', payload);

      // Successfully onboarded -> Proceed directly to initial diagnostic assessment
      router.push('/assessment');
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Wizard Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            <span>Step {step} of 4: {step === 1 ? 'Academics' : step === 2 ? 'Skills' : step === 3 ? 'Target Roles' : 'Review & Goals'}</span>
            <span>{step * 25}% Completed</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${step * 25}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* STEP 1: Academic Background */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Degree & Academic Background</h2>
                  <p className="text-xs text-slate-400">Open to any degree (BTech, BCA, MCA, BBA, MBA, BCom, etc.)</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Degree / Program (Free Text)
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science, BCA, BBA, MBA, BSc Physics..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                />
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                  <span className="text-slate-500">Suggestions:</span>
                  {['B.Tech CSE', 'BCA', 'MCA', 'BBA', 'MBA Finance', 'B.Sc Data Science'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setDegree(s)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  College / University
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. National Institute of Technology, Delhi University..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Current Semester
                  </label>
                  <input
                    type="number"
                    value={currentSemester}
                    onChange={(e) => setCurrentSemester(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Skills & Proficiency */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Your Skills & Experience Level</h2>
                  <p className="text-xs text-slate-400">Add technical and domain skills to calibrate diagnostic difficulty</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Experience Tier
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['fresher', 'internship', '0-1_years', '1-3_years'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperienceLevel(lvl)}
                      className={`p-2.5 text-xs font-medium rounded-xl border transition-all ${
                        experienceLevel === lvl
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {lvl.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Add Skills
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="e.g. Python, SQL, React, Excel, Problem Solving..."
                    className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Skill Roster</span>
                <div className="space-y-2">
                  {skills.map((s) => (
                    <div key={s.name} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <span className="text-sm font-medium text-slate-200">{s.name}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-slate-400">Proficiency: {s.proficiency}/5</span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={s.proficiency}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setSkills(skills.map((item) => (item.name === s.name ? { ...item, proficiency: val } : item)));
                          }}
                          className="w-20 accent-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeSkill(s.name)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Target Roles & Companies */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Target Roles & Companies</h2>
                  <p className="text-xs text-slate-400">Scoring weights and assessments adapt automatically to these targets</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Job Roles
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                    placeholder="e.g. SDE 1, Full Stack Developer, Product Manager, Business Analyst..."
                    className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addRole}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {targetRoles.map((role) => (
                    <span
                      key={role}
                      className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium flex items-center space-x-2"
                    >
                      <span>{role}</span>
                      <button type="button" onClick={() => setTargetRoles(targetRoles.filter((r) => r !== role))}>
                        <X className="w-3 h-3 hover:text-white" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Dream & Target Companies
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCompany())}
                    placeholder="e.g. Google, Microsoft, Amazon, CRED, Deloitte..."
                    className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addCompany}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {targetCompanies.map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center space-x-2"
                    >
                      <span>{c}</span>
                      <button type="button" onClick={() => setTargetCompanies(targetCompanies.filter((item) => item !== c))}>
                        <X className="w-3 h-3 hover:text-white" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Daily Goals */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Daily Commitment & Target Deadline</h2>
                  <p className="text-xs text-slate-400">Configure your daily time budget and target placement timeline</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Daily Prep Time Budget
                  </label>
                  <select
                    value={dailyPrepTimeMinutes}
                    onChange={(e) => setDailyPrepTimeMinutes(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value={30}>30 Minutes / day</option>
                    <option value={45}>45 Minutes / day</option>
                    <option value={60}>60 Minutes / day (Recommended)</option>
                    <option value={90}>90 Minutes / day</option>
                    <option value={120}>120 Minutes / day</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Placement Deadline
                  </label>
                  <input
                    type="date"
                    value={placementDeadline}
                    onChange={(e) => setPlacementDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Expected Package (LPA)
                  </label>
                  <input
                    type="number"
                    value={expectedPackageLPA}
                    onChange={(e) => setExpectedPackageLPA(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Featured Project Title
                  </label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Ready notice */}
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-center space-x-3">
                <Sparkles className="w-5 h-5 shrink-0 text-blue-400" />
                <span>
                  Submitting will unlock your initial diagnostic assessment to determine your baseline placement readiness score!
                </span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl flex items-center space-x-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/20"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-emerald-600/25 disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{isSubmitting ? 'Finalizing Profile...' : 'Complete & Start Diagnostic'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
