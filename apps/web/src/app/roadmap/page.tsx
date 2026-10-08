'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import {
  CareerRoadmapDTO,
  RoadmapNodeDTO,
  RoadmapComparisonDTO,
  PrecedentProfileDTO
} from '@placementos/shared';
import {
  Compass,
  Sparkles,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Lock,
  Unlock,
  CheckCircle2,
  FolderGit2,
  HelpCircle,
  Award,
  Layers,
  Clock,
  Calendar,
  Users,
  GitCompare,
  Share2,
  Download,
  Flame,
  ChevronRight,
  X,
  ExternalLink,
  Laptop,
  Lightbulb,
  Search,
  Code
} from 'lucide-react';

export default function CareerRoadmapperPage() {
  const [targetDreamJob, setTargetDreamJob] = useState('Full Stack Developer at a climate tech startup');
  const [weeklyHours, setWeeklyHours] = useState(12);
  const [targetMonths, setTargetMonths] = useState(6);
  const [roadmap, setRoadmap] = useState<CareerRoadmapDTO | null>(null);
  const [selectedNode, setSelectedNode] = useState<RoadmapNodeDTO | null>(null);
  const [activeTab, setActiveTab] = useState<'canvas' | 'precedents' | 'compare'>('canvas');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingNode, setIsUpdatingNode] = useState(false);

  // Comparator state
  const [compareRoleA, setCompareRoleA] = useState('Full Stack Developer at a climate tech startup');
  const [compareRoleB, setCompareRoleB] = useState('UI/UX Designer for high-frequency fintech apps');
  const [comparison, setComparison] = useState<RoadmapComparisonDTO | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Canvas Pan & Zoom State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Generate on initial load
  useEffect(() => {
    handleGenerate(targetDreamJob);
  }, []);

  const handleGenerate = async (roleQuery: string) => {
    setIsLoading(true);
    setSelectedNode(null);
    try {
      const data = await apiClient.post<CareerRoadmapDTO>('/roadmap/generate', {
        targetDreamJob: roleQuery,
        weeklyHours,
        targetMonths
      });
      setRoadmap(data);
      // Auto-select first unlocked node for inspector preview
      const firstUnlocked = data.nodes.find((n) => n.status === 'unlocked') || data.nodes[0];
      setSelectedNode(firstUnlocked || null);
    } catch (e) {
      console.error('Failed to generate career roadmap:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleNode = async (nodeId: string, currentStatus: string) => {
    if (!roadmap) return;
    setIsUpdatingNode(true);

    const newStatus = currentStatus === 'completed' ? 'unlocked' : 'completed';

    try {
      const updated = await apiClient.post<any>(`/roadmap/${roadmap.id}/toggle-node`, {
        nodeId,
        status: newStatus
      });

      // Update state with newly unlocked downstream branches
      setRoadmap((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          nodes: updated.nodes,
          completionPercentage: updated.completionPercentage
        };
      });

      // Update selected node in drawer
      const updatedNode = updated.nodes.find((n: any) => n.id === nodeId);
      if (updatedNode) setSelectedNode(updatedNode);
    } catch (e) {
      console.error('Failed to toggle node:', e);
    } finally {
      setIsUpdatingNode(false);
    }
  };

  const handleRunComparison = async () => {
    setIsComparing(true);
    try {
      const comp = await apiClient.post<RoadmapComparisonDTO>('/roadmap/compare', {
        roleA: compareRoleA,
        roleB: compareRoleB
      });
      setComparison(comp);
    } catch (e) {
      console.error(e);
    } finally {
      setIsComparing(false);
    }
  };

  // Pan event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== canvasRef.current && !(e.target as HTMLElement).classList.contains('canvas-background')) {
      return;
    }
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const presets = [
    { label: 'Climate Tech Full Stack', query: 'Full Stack Developer at a climate tech startup' },
    { label: 'Fintech UI/UX Designer', query: 'UI/UX Designer for high-frequency fintech apps' },
    { label: 'Health Robotics AI Engineer', query: 'AI/ML Platform Engineer at a healthcare robotics company' },
    { label: 'Distributed Systems Unicorn', query: 'Backend Distributed Systems Engineer at a global unicorn' }
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <span className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-blue-500/20">
                P
              </span>
              <span className="font-bold text-lg text-white">PlacementOS</span>
            </Link>
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              <Compass className="w-3.5 h-3.5" />
              <span>Reverse-Engineered Career Roadmapper</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Command Center
            </Link>
            <Link
              href="/assessment"
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/20 transition-colors"
            >
              Diagnostic Drill
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner & Search Console */}
      <section className="border-b border-slate-800/80 bg-slate-950/60 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
                <span>Reverse-Engineer Any Hyper-Specific Dream Job</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Break past generic advice like "learn React". Uncover the exact micro-credentials, niche weekend projects, intermediate stepping-stone roles, and precedent career paths.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setTargetDreamJob(p.query);
                    handleGenerate(p.query);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    targetDreamJob === p.query
                      ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar & Constraint Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={targetDreamJob}
                onChange={(e) => setTargetDreamJob(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate(targetDreamJob)}
                placeholder="e.g. Full Stack Developer at a climate tech startup, UI/UX Designer for fintech apps..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2 flex items-center space-x-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="w-full">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Pacing</span>
                  <span className="font-bold text-slate-200">{weeklyHours}h/wk</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1 mt-1"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex items-center space-x-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="w-full">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Timeline</span>
                  <span className="font-bold text-slate-200">{targetMonths} mos</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="18"
                  step="3"
                  value={targetMonths}
                  onChange={(e) => setTargetMonths(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1 mt-1"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleGenerate(targetDreamJob)}
                className="w-full h-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Synthesizing...' : 'Re-engineer Path'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* View Switcher Tabs & Progress Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('canvas')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-colors ${
                activeTab === 'canvas'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive Skill Tree</span>
            </button>

            <button
              onClick={() => setActiveTab('precedents')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-colors ${
                activeTab === 'precedents'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>People Who Walked This Path</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('compare');
                if (!comparison) handleRunComparison();
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-colors ${
                activeTab === 'compare'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Side-by-Side Role Overlap</span>
            </button>
          </div>

          {/* Gamification Progress Bar */}
          {roadmap && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Tree Completion:</span>
                <span className="font-bold text-emerald-400">{roadmap.completionPercentage}%</span>
              </div>
              <div className="w-32 bg-slate-800 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${roadmap.completionPercentage}%` }}
                />
              </div>
              <div className="text-slate-400">
                Total Budget: <span className="text-slate-200 font-semibold">{roadmap.totalEstimatedHours}h</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MAIN VIEW CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* TAB 1: INTERACTIVE SKILL TREE CANVAS */}
        {activeTab === 'canvas' && (
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
            {/* Visual Canvas Area */}
            <div
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="flex-1 relative bg-[#090D16] canvas-background overflow-hidden cursor-grab active:cursor-grabbing select-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, #1E293B 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }}
            >
              {/* Floating Canvas Controls */}
              <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-lg backdrop-blur">
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.min(prev + 0.15, 1.8))}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.max(prev - 0.15, 0.5))}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={resetView}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Reset View"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-slate-500 px-2 font-mono">{Math.round(zoom * 100)}%</span>
              </div>

              {/* Legend Overlay */}
              <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center space-x-3 px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-[11px] text-slate-400 backdrop-blur shadow-lg">
                <span className="flex items-center space-x-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Mastered</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>Unlocked</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="h-2 w-2 rounded-full bg-slate-600" />
                  <span>Locked</span>
                </span>
                <span className="text-slate-600">|</span>
                <span>Drag to pan canvas • Click node to inspect</span>
              </div>

              {/* Skill Tree Transform Container */}
              <div
                className="w-full h-full min-h-[900px] relative transition-transform duration-75 origin-top-left"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
                }}
              >
                {/* SVG Conduit Connection Wires */}
                <svg className="absolute inset-0 w-full h-[950px] pointer-events-none z-0">
                  <defs>
                    <linearGradient id="activeBranch" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="inactiveBranch" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#334155" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#1E293B" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>

                  {/* SVG Paths connecting nodes */}
                  {roadmap?.edges.map((edge) => {
                    const srcNode = roadmap.nodes.find((n) => n.id === edge.source);
                    const tgtNode = roadmap.nodes.find((n) => n.id === edge.target);
                    if (!srcNode || !tgtNode) return null;

                    const sx = (srcNode.x || 200) + 120;
                    const sy = (srcNode.y || 80) + 70;
                    const tx = (tgtNode.x || 200) + 120;
                    const ty = (tgtNode.y || 200) + 10;

                    const isMastered = srcNode.status === 'completed';

                    return (
                      <g key={edge.id}>
                        <path
                          d={`M ${sx} ${sy} C ${sx} ${(sy + ty) / 2}, ${tx} ${(sy + ty) / 2}, ${tx} ${ty}`}
                          fill="none"
                          stroke={isMastered ? 'url(#activeBranch)' : 'url(#inactiveBranch)'}
                          strokeWidth={isMastered ? 3 : 2}
                          strokeDasharray={isMastered ? 'none' : '4,4'}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Render Interactive Nodes */}
                {roadmap?.nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isMastered = node.status === 'completed';
                  const isUnlocked = node.status === 'unlocked';
                  const isLocked = node.status === 'locked';

                  return (
                    <div
                      key={node.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNode(node);
                      }}
                      className={`absolute w-60 rounded-2xl p-4 border transition-all cursor-pointer z-10 ${
                        isSelected
                          ? 'ring-2 ring-blue-500 scale-105 shadow-2xl shadow-blue-500/25 bg-slate-900 border-blue-400'
                          : isMastered
                          ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                          : isUnlocked
                          ? 'bg-slate-900/95 border-blue-500/50 hover:border-blue-400 hover:shadow-xl shadow-blue-500/10'
                          : 'bg-slate-950/70 border-slate-800 opacity-60 hover:opacity-80'
                      }`}
                      style={{
                        left: `${node.x || 200}px`,
                        top: `${node.y || 80}px`
                      }}
                    >
                      {/* Node Top Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isMastered
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isUnlocked
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          Tier {node.tier} • {node.category.replace('_', ' ')}
                        </span>

                        <div className="flex items-center space-x-1">
                          {isMastered ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isUnlocked ? (
                            <Unlock className="w-4 h-4 text-blue-400" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <h4 className="text-sm font-bold text-white line-clamp-1">{node.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{node.subtitle}</p>

                      {/* Realistic Deliverable Tag */}
                      <div className="mt-3 p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[10px] text-slate-300 flex items-center space-x-1.5">
                        <Laptop className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{node.realisticProject.title}</span>
                      </div>

                      {/* Footer: Hours */}
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500">
                        <span>{node.estimatedHours} hrs estimated</span>
                        {isMastered && <span className="text-emerald-400 font-bold">Mastered ✅</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ACTIONABLE MILESTONE INSPECTOR DRAWER */}
            <div className="w-full md:w-[450px] border-l border-slate-800 bg-slate-900/95 overflow-y-auto p-6 flex flex-col justify-between space-y-6">
              {selectedNode ? (
                <div className="space-y-6">
                  {/* Drawer Header */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Tier {selectedNode.tier} • {selectedNode.category.replace('_', ' ')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleNode(selectedNode.id, selectedNode.status)}
                        disabled={isUpdatingNode}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                          selectedNode.status === 'completed'
                            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{selectedNode.status === 'completed' ? 'Mastered (Click to Undo)' : 'Mark as Known / Mastered'}</span>
                      </button>
                    </div>

                    <h2 className="text-xl font-black text-white mt-3">{selectedNode.title}</h2>
                    <p className="text-xs text-slate-400 mt-1">{selectedNode.subtitle}</p>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedNode.summary}</p>
                  </div>

                  {/* Concrete Weekend Project Blueprint */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                      <Laptop className="w-4 h-4" />
                      <span>Custom Weekend Project Blueprint</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{selectedNode.realisticProject.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{selectedNode.realisticProject.description}</p>
                    </div>
                    <div className="text-[11px] text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-amber-400 font-semibold">Architecture Spec: </span>
                      {selectedNode.realisticProject.architectureNotes}
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Deliverables Checklist:</span>
                      <ul className="mt-1.5 space-y-1">
                        {selectedNode.realisticProject.deliverables.map((deliv, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span>{deliv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Real Curated GitHub Inspirations */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                      <FolderGit2 className="w-4 h-4" />
                      <span>Curated GitHub Repo Inspirations</span>
                    </div>
                    <div className="space-y-2">
                      {selectedNode.githubInspirations.map((repo, i) => (
                        <a
                          key={i}
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-blue-400">
                            <span>{repo.repoName}</span>
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{repo.description}</p>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Technical Interview Questions & Answers */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                      <HelpCircle className="w-4 h-4" />
                      <span>Technical Bar-Raiser Interview Questions</span>
                    </div>
                    <div className="space-y-2.5">
                      {selectedNode.interviewQuestions.map((q, i) => (
                        <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-white leading-snug">{q.question}</span>
                            <span className="text-[9px] uppercase font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                              {q.difficulty}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 italic mt-1">{q.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Micro-Credentials & Certifications */}
                  {selectedNode.certifications && selectedNode.certifications.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        <Award className="w-4 h-4" />
                        <span>Recognized Industry Micro-Credentials</span>
                      </div>
                      {selectedNode.certifications.map((cert, i) => (
                        <div key={i} className="text-xs text-slate-300 flex items-center justify-between p-2 rounded-lg bg-slate-900">
                          <div>
                            <span className="font-bold text-white">{cert.name}</span>
                            <span className="text-slate-500 text-[10px] block">Issued by {cert.issuer}</span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-semibold">{cert.relevance}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                  <Compass className="w-8 h-8 text-slate-600 animate-pulse" />
                  <p className="text-sm font-semibold">Click on any node in the skill tree</p>
                  <p className="text-xs text-slate-600">Inspect custom weekend projects, GitHub repos, and interview defenses.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PEOPLE WHO WALKED THIS PATH */}
        {activeTab === 'precedents' && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Real Career Precedents
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                People Who Actually Landed This Exact Role
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Deconstruct the stepping stone roles, non-traditional beginnings, and breakthrough portfolio projects of candidates who already made this transition.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roadmap?.precedentProfiles.map((p) => (
                <div key={p.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">{p.name}</h3>
                      <p className="text-xs text-blue-400 font-semibold">{p.currentRole} @ {p.company}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                      {p.timeTakenMonths} months
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 font-semibold">Starting Background: </span>
                    {p.startingPoint}
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Stepping Stone Roles:</span>
                    <div className="mt-1.5 space-y-1">
                      {p.steppingStoneRoles.map((step, idx) => (
                        <div key={idx} className="text-xs text-slate-300 flex items-center space-x-1.5">
                          <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
                    <span className="font-bold text-amber-400 block mb-1">Key Breakthrough Project:</span>
                    <span className="text-slate-300">{p.keyBreakthroughProject}</span>
                  </div>

                  <blockquote className="text-xs text-slate-400 italic border-l-2 border-blue-500 pl-3">
                    {p.quote}
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SIDE-BY-SIDE ROLE OVERLAP COMPARATOR */}
        {activeTab === 'compare' && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                Career Pivot Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                Side-by-Side Dream Role Overlap
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Considering two paths? Compare where their skill trees overlap so you can build shared foundations and pivot in weeks, not years.
              </p>
            </div>

            {/* Role Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Role A (Current Target)</label>
                <input
                  type="text"
                  value={compareRoleA}
                  onChange={(e) => setCompareRoleA(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Role B (Pivot Option)</label>
                <input
                  type="text"
                  value={compareRoleB}
                  onChange={(e) => setCompareRoleB(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                disabled={isComparing}
                onClick={handleRunComparison}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs inline-flex items-center space-x-1.5 shadow-md shadow-purple-600/25"
              >
                <GitCompare className="w-4 h-4" />
                <span>{isComparing ? 'Analyzing Overlap...' : 'Compare Overlap & Pivot Path'}</span>
              </button>
            </div>

            {/* Comparison Results */}
            {comparison && (
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <div>
                    <span className="text-xs uppercase font-bold text-purple-400">Foundation Overlap</span>
                    <div className="text-3xl font-black text-white mt-1">{comparison.overlapPercentage}% Shared DNA</div>
                  </div>
                  <div className="text-xs text-slate-300 max-w-md">
                    {comparison.recommendation}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Common Core */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Shared Common Core</span>
                    </span>
                    <ul className="space-y-1.5 mt-2">
                      {comparison.commonCoreSkills.map((s, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-center space-x-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Unique to Role A */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      Unique to Role A
                    </span>
                    <ul className="space-y-1.5 mt-2">
                      {comparison.uniqueSkillsA.map((s, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-center space-x-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Unique to Role B */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Unique to Role B
                    </span>
                    <ul className="space-y-1.5 mt-2">
                      {comparison.uniqueSkillsB.map((s, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-center space-x-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
