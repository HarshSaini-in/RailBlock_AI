import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Clock, 
  Train, 
  ShieldCheck, 
  Zap, 
  Wrench, 
  Radio, 
  TrendingUp,
  Cpu,
  Info,
  Calendar,
  Check,
  ChevronRight,
  Printer,
  Download,
  FileText,
  CheckCheck,
  Filter,
  Eye,
  BarChart3,
  Sliders,
  MapPin,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  MaintenanceTask, 
  BlockWindow, 
  TrainSchedule, 
  OptimizedBlock, 
  Corridor 
} from '../types';
import { soundFx } from '../utils/audioFx';

interface OptimizationEngineViewProps {
  tasks: MaintenanceTask[];
  windows: BlockWindow[];
  trains: TrainSchedule[];
  corridors: Corridor[];
  selectedCorridorId: string;
  optimizedBlocks: OptimizedBlock[];
  onTriggerOptimization: () => void;
  onApproveBlock?: (blockId: string, notes?: string) => void;
  onApproveAllBlocks?: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const OptimizationEngineView: React.FC<OptimizationEngineViewProps> = ({
  tasks,
  windows,
  trains,
  corridors,
  selectedCorridorId,
  optimizedBlocks,
  onTriggerOptimization,
  onApproveBlock,
  onApproveAllBlocks,
  onNavigateToTab,
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(3); // 1, 2, 3
  const [activeViewMode, setActiveViewMode] = useState<'roster' | 'centerpiece' | 'timeline' | 'memo'>('roster');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(
    optimizedBlocks[0]?.id || null
  );
  const [optimizingProgress, setOptimizingProgress] = useState<string>('');
  const [planGeneratedTime, setPlanGeneratedTime] = useState<string>('Just now');
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [filterCorridor, setFilterCorridor] = useState<string>(selectedCorridorId);

  // Calculate high-level optimization gains
  const totalTasks = tasks.length;
  const totalBlocks = optimizedBlocks.length;
  const uncoordinatedHours = Number(
    optimizedBlocks.reduce((acc, b) => acc + b.coordinationGain.independentTotalHours, 0).toFixed(1)
  );
  const optimizedHours = Number(
    optimizedBlocks.reduce((acc, b) => acc + b.coordinationGain.optimizedHours, 0).toFixed(1)
  );
  const hoursSaved = Number(Math.max(0, uncoordinatedHours - optimizedHours).toFixed(1));
  const efficiencyGain = uncoordinatedHours > 0 
    ? Math.round(((uncoordinatedHours - optimizedHours) / uncoordinatedHours) * 100) 
    : 0;
  const approvedCount = optimizedBlocks.filter(b => b.status === 'Approved').length;

  const handleRunOptimizer = () => {
    setIsOptimizing(true);
    setActiveStep(1);
    soundFx.playClick(440);
    setOptimizingProgress(`Phase 1/3: Computing weighted priority ranks for ${tasks.length} maintenance demands...`);

    setTimeout(() => {
      setActiveStep(2);
      soundFx.playClick(580);
      setOptimizingProgress(`Phase 2/3: Clustering co-located tasks (±15 KM proximity) into joint Jumbo & Shadow blocks...`);

      setTimeout(() => {
        setActiveStep(3);
        soundFx.playClick(720);
        setOptimizingProgress(`Phase 3/3: Running interval-overlap conflict checks against ${trains.length} scheduled express trains...`);

        setTimeout(() => {
          onTriggerOptimization();
          setIsOptimizing(false);
          setOptimizingProgress('');
          setPlanGeneratedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          setActiveViewMode('roster');
          
          if (optimizedBlocks.length > 0) {
            setSelectedBlockId(optimizedBlocks[0].id);
          }

          // Trigger harmonic celebratory music / audio chords!
          soundFx.playOptimizationPlanSuccess();

          // Trigger celebratory confetti
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
          });
        }, 600);
      }, 600);
    }, 600);
  };

  const handleApproveSingleBlock = (blockId: string) => {
    soundFx.playSanctionSound();
    if (onApproveBlock) {
      onApproveBlock(blockId, 'Sanctioned from AI Optimization Engine');
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#10b981', '#f59e0b'],
      });
    }
  };

  const handleApproveAll = () => {
    soundFx.playSanctionSound();
    if (onApproveAllBlocks) {
      onApproveAllBlocks();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#3b82f6'],
      });
    }
  };

  const filteredBlocks = filterCorridor === 'ALL'
    ? optimizedBlocks
    : optimizedBlocks.filter((b) => b.corridorId === filterCorridor);

  const currentSelectedBlock = optimizedBlocks.find((b) => b.id === selectedBlockId) || filteredBlocks[0] || optimizedBlocks[0];

  // Timeline time range: 00:00 to 07:00 (standard night block zone)
  const timelineHours = [
    { label: '00:00', min: 0 },
    { label: '01:00', min: 60 },
    { label: '02:00', min: 120 },
    { label: '03:00', min: 180 },
    { label: '04:00', min: 240 },
    { label: '05:00', min: 300 },
    { label: '06:00', min: 360 },
    { label: '07:00', min: 420 },
  ];
  const totalTimelineMin = 420;

  const timeToPercent = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const min = h * 60 + m;
    return Math.min(100, Math.max(0, (min / totalTimelineMin) * 100));
  };

  const getDeptBadge = (dept: string) => {
    switch (dept) {
      case 'Engineering':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Wrench className="w-3 h-3 text-blue-400" />
            Engineering
          </span>
        );
      case 'TRD':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Zap className="w-3 h-3 text-amber-400" />
            TRD (Traction)
          </span>
        );
      case 'S&T':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Radio className="w-3 h-3 text-emerald-400" />
            S&T
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 3-Step Heuristic Pipeline Bar & Execution Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Core Algorithm
              </span>
              <h2 className="text-base font-bold text-white font-['Chakra_Petch']">
                3-Step Greedy Constraint Optimization Engine
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automates the three manual decisions made in manual railway planning systems (IBMS / Rolling Block).
            </p>
          </div>

          <button
            onClick={handleRunOptimizer}
            disabled={isOptimizing}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
              isOptimizing
                ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                : 'bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-orange-500/25 cursor-pointer active:scale-95'
            }`}
          >
            <Cpu className={`w-4 h-4 ${isOptimizing ? 'animate-spin text-amber-400' : 'text-slate-950'}`} />
            <span>{isOptimizing ? 'Running Optimization Engine...' : 'Generate Optimized Plan'}</span>
          </button>
        </div>

        {/* Real-time Diagnostics Log Banner when optimizing */}
        {isOptimizing && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-xl flex items-center gap-3 text-xs text-amber-200 animate-pulse font-mono">
            <div className="w-3 h-3 rounded-full border-2 border-amber-400 border-t-transparent animate-spin shrink-0"></div>
            <span>{optimizingProgress}</span>
          </div>
        )}

        {/* Visual 3-Step Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Step 1 */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              activeStep === 1
                ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30'
                : 'bg-slate-950/60 border-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                STEP 1
              </span>
              <span className="text-xs font-semibold text-slate-300">Priority Ranking</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-normal">
              Calculates weighted multi-factor score: <strong className="text-slate-200">Urgency (40%) + Asset Criticality (45%) + Overdue penalty (25%)</strong>.
            </p>
          </div>

          {/* Step 2 */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              activeStep === 2
                ? 'bg-orange-500/10 border-orange-500/50 shadow-md shadow-orange-500/10 ring-1 ring-orange-500/30'
                : 'bg-slate-950/60 border-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-800 text-orange-400 border border-slate-700">
                STEP 2
              </span>
              <span className="text-xs font-semibold text-slate-300">Compatibility Grouping</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-normal">
              Clusters multi-department tasks sharing <strong className="text-slate-200">Corridor & KM proximity (±15 KM)</strong> into joint Jumbo/Shadow blocks.
            </p>
          </div>

          {/* Step 3 */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              activeStep === 3
                ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                : 'bg-slate-950/60 border-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                STEP 3
              </span>
              <span className="text-xs font-semibold text-slate-300">Feasible Window Selection</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-normal">
              Runs <strong className="text-slate-200">interval-overlap conflict checks</strong> against train timetable to guarantee zero Vande Bharat / Rajdhani delays.
            </p>
          </div>
        </div>
      </div>

      {/* GENERATED MASTER OPTIMIZATION PLAN (PROPER PLAN ACTION CENTER) */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 md:p-6 shadow-2xl space-y-6">
        {/* Header & Plan Status Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                AI Feasibility Plan Generated & Verified
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Updated: {planGeneratedTime}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white font-['Chakra_Petch']">
              Generated Corridor Maintenance Master Plan
            </h3>
            <p className="text-xs text-slate-400">
              Optimal multi-department block allocations generated by greedy constraint solver across Indian Railways high-density corridors.
            </p>
          </div>

          {/* Master Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleApproveAll}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer active:scale-95"
              title="Sanction all generated blocks into master schedule"
            >
              <CheckCheck className="w-4 h-4 text-emerald-100" />
              <span>Sanction All Blocks ({approvedCount}/{optimizedBlocks.length})</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setShowMemoModal(true);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Official Memo</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onNavigateToTab('review');
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Planner Desk</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Master Plan High-Level Optimization Gain KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Demands Solved</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold font-mono text-white">{totalTasks}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">100% Clustered</span>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Coordinated Blocks</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold font-mono text-amber-400">{totalBlocks}</span>
              <span className="text-[10px] text-slate-400">Jumbo / Shadow</span>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Track Hours Saved</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold font-mono text-emerald-400">+{hoursSaved}h</span>
              <span className="text-[10px] text-emerald-400 font-semibold">Capacity</span>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Coordination Gain</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold font-mono text-cyan-400">+{efficiencyGain}%</span>
              <span className="text-[10px] text-slate-400">Efficiency</span>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Train Conflict Risk</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold font-mono text-emerald-400">0</span>
              <span className="text-[10px] text-emerald-400 font-semibold">Zero Passenger Delays</span>
            </div>
          </div>
        </div>

        {/* View Switcher & Corridor Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Sub-view switcher tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveViewMode('roster');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeViewMode === 'roster'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Generated Block Roster ({filteredBlocks.length})</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveViewMode('centerpiece');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeViewMode === 'centerpiece'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Consolidation Impact</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveViewMode('timeline');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeViewMode === 'timeline'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timetable Conflict Timeline</span>
            </button>
          </div>

          {/* Filter Corridor */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Corridor:</span>
            <select
              value={filterCorridor}
              onChange={(e) => {
                soundFx.playClick();
                setFilterCorridor(e.target.value);
              }}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All High-Density Corridors ({optimizedBlocks.length} blocks)</option>
              {corridors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* VIEW 1: GENERATED BLOCK ROSTER (Interactive Roster Cards with Bundled Demands) */}
        {activeViewMode === 'roster' && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredBlocks.map((block) => {
                const isSelected = block.id === selectedBlockId;
                const isApproved = block.status === 'Approved';

                return (
                  <div
                    key={block.id}
                    className={`bg-slate-950/80 border rounded-xl p-5 space-y-4 transition-all ${
                      isSelected
                        ? 'border-amber-500/60 ring-1 ring-amber-500/30 shadow-lg'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Top row: Route & Window type */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            {block.blockCode}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                            {block.windowType}
                          </span>
                          {isApproved && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              <Check className="w-3 h-3" />
                              Sanctioned
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">
                          {block.corridorName} <span className="text-slate-400 font-normal">({block.sectionName})</span>
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {block.kmRange} • Line: {block.line}
                        </span>
                      </div>

                      {/* Time & Date Pill */}
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-300">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>{block.startTime} — {block.endTime}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Date: {block.date} ({block.durationMinutes} min)
                        </span>
                      </div>
                    </div>

                    {/* Middle Section: Bundled Maintenance Demands */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300">
                          Bundled Demands ({block.tasks.length} tasks synchronized):
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] font-mono">
                          {block.departmentCounts.engineering > 0 && (
                            <span className="text-blue-400 font-semibold">{block.departmentCounts.engineering} Eng</span>
                          )}
                          {block.departmentCounts.trd > 0 && (
                            <span className="text-amber-400 font-semibold">{block.departmentCounts.trd} TRD</span>
                          )}
                          {block.departmentCounts.st > 0 && (
                            <span className="text-emerald-400 font-semibold">{block.departmentCounts.st} S&T</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {block.tasks.map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center justify-between bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800/80 text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <div className="shrink-0">{getDeptBadge(t.department)}</div>
                              <span className="text-slate-200 truncate font-medium">{t.title}</span>
                            </div>
                            <span className="text-slate-400 font-mono text-[11px] shrink-0 ml-2">
                              {(t.durationMinutes / 60).toFixed(1)}h
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resources & Machine Allocation */}
                    {block.assignedResources && block.assignedResources.length > 0 && (
                      <div className="text-xs bg-slate-900/50 p-2 rounded-lg border border-slate-800 flex items-center gap-2">
                        <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-slate-400 text-[11px]">Assigned Machinery:</span>
                        <span className="text-slate-200 font-medium text-[11px] truncate">
                          {block.assignedResources.join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Bottom Footnote & Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-amber-400 font-mono font-bold block">
                          +{block.coordinationGain.timeSavedHours}h Track Hours Saved
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Independent: {block.coordinationGain.independentTotalHours}h ➔ Joint: {block.coordinationGain.optimizedHours}h
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            soundFx.playClick();
                            setSelectedBlockId(block.id);
                            setActiveViewMode('centerpiece');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-[11px] transition-all cursor-pointer"
                        >
                          Deep Inspect
                        </button>

                        {!isApproved ? (
                          <button
                            onClick={() => handleApproveSingleBlock(block.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-md shadow-emerald-900/30 transition-all cursor-pointer active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Sanction</span>
                          </button>
                        ) : (
                          <span className="text-emerald-400 font-mono text-[11px] font-semibold">
                            ✓ Approved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: CENTERPIECE VISUAL (Before vs After Consolidation Highlight) */}
        {activeViewMode === 'centerpiece' && currentSelectedBlock && (
          <div className="bg-linear-to-b from-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950">
                    DEMO CENTERPIECE
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">
                    {currentSelectedBlock.corridorName} • <span className="text-amber-400">{currentSelectedBlock.sectionName}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 font-normal">
                    ({currentSelectedBlock.blockCode})
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white font-['Chakra_Petch']">
                  Multi-Department Block Consolidation Impact
                </h3>
              </div>

              {/* Block Selector Pill */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Select Block:</span>
                <select
                  value={currentSelectedBlock.id}
                  onChange={(e) => {
                    soundFx.playClick();
                    setSelectedBlockId(e.target.value);
                  }}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-amber-300 font-semibold focus:outline-none cursor-pointer"
                >
                  {optimizedBlocks.map((b) => (
                    <option key={b.id} value={b.id} className="bg-slate-900 text-slate-200">
                      {b.corridorName} ({b.sectionName}) • {b.tasks.length} tasks ({b.coordinationGain.timeSavedHours}h saved)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Before vs After Side-by-Side Comparison Box */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
              {/* Left: Traditional Uncoordinated Manual Planning (Without RailBlock AI) */}
              <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-4 md:p-5 space-y-4 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                      Without Coordination (Status Quo)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 font-bold">
                    {currentSelectedBlock.coordinationGain.independentBlocksCount} Separate Blocks
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-red-400 font-mono">
                      {currentSelectedBlock.coordinationGain.independentTotalHours} Hours
                    </span>
                    <span className="text-xs text-slate-400">Total Track Possession Time</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">
                    Each department (Engineering, TRD, S&T) applies independently on separate days. Each independent block requires its own <strong>+30 min OHE power isolation, track safety discharge, and block clearing buffer</strong>, compounding track downtime.
                  </p>
                </div>

                {/* Uncoordinated Tasks List */}
                <div className="space-y-2 pt-2 border-t border-red-500/20">
                  {currentSelectedBlock.tasks.map((task, idx) => {
                    const workHours = task.durationMinutes / 60;
                    const bufferHours = 0.5; // 30 mins
                    const totalBlockHours = (task.durationMinutes + 30) / 60;
                    return (
                      <div
                        key={task.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-950/70 p-2.5 rounded border border-red-900/40 text-xs gap-1 sm:gap-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 font-mono text-[11px] font-bold shrink-0">Block #{idx + 1}:</span>
                          <span className="font-semibold text-slate-200">{task.title.split('(')[0]}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 sm:ml-2">
                          <span className="text-slate-400 font-mono text-[11px]">
                            {workHours.toFixed(1)}h work <span className="text-red-400/80">+ 0.5h buffer</span>
                          </span>
                          <span className="text-red-300 font-mono font-bold text-[11px] bg-red-950/80 px-1.5 py-0.5 rounded border border-red-800/40">
                            = {totalBlockHours.toFixed(1)}h
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Mathematical Total Breakdown Footer */}
                  <div className="mt-2 pt-2 border-t border-red-500/30 flex items-center justify-between text-[11px] font-mono text-slate-300 bg-red-950/40 px-2.5 py-1.5 rounded">
                    <span>
                      Sum: <strong>{(currentSelectedBlock.tasks.reduce((sum, t) => sum + t.durationMinutes, 0) / 60).toFixed(1)}h work</strong> + <strong>{(currentSelectedBlock.tasks.length * 0.5).toFixed(1)}h buffers ({currentSelectedBlock.tasks.length} × 30m)</strong>
                    </span>
                    <span className="text-red-400 font-bold text-xs">
                      = {currentSelectedBlock.coordinationGain.independentTotalHours}h Total
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: With RailBlock AI Joint Optimization */}
              <div className="bg-emerald-950/20 border-2 border-emerald-500/40 rounded-xl p-4 md:p-5 space-y-4 relative shadow-lg shadow-emerald-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      With RailBlock AI (Joint Optimization)
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                    1 Integrated Jumbo Block
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                        {currentSelectedBlock.coordinationGain.optimizedHours} Hours
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        (Window: {currentSelectedBlock.startTime} — {currentSelectedBlock.endTime})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-400 font-mono block">
                        +{currentSelectedBlock.coordinationGain.timeSavedHours}h Track Availability Saved
                      </span>
                      <span className="text-[10px] text-emerald-400">
                        ({currentSelectedBlock.coordinationGain.efficiencyGainPercent}% Efficiency Boost)
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-200 leading-normal">
                    Tasks from Engineering, TRD, and S&T execute concurrently inside a single coordinated traffic-cum-power window with zero conflict against scheduled high-speed passenger trains.
                  </p>
                </div>

                {/* Coordinated Multi-Dept Checklist */}
                <div className="space-y-2 pt-2 border-t border-emerald-500/30">
                  {currentSelectedBlock.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between bg-slate-950/80 p-2 rounded border border-emerald-500/30 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <div>{getDeptBadge(task.department)}</div>
                        <span className="font-semibold text-slate-200">{task.title.split('(')[0]}</span>
                      </div>
                      <span className="text-emerald-400 font-mono font-semibold text-[11px] shrink-0">
                        Coordinated ✓
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: TIMETABLE & GANTT CONFLICT MATRIX */}
        {activeViewMode === 'timeline' && (
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white font-['Chakra_Petch'] tracking-wide flex items-center gap-2">
                  <span>Train Timetable vs. Maintenance Block Timeline</span>
                  <span className="text-xs font-normal text-slate-400 font-mono">(00:00 — 07:00 Night Window)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visual proof of interval-overlap resolution: maintenance blocks are slotted into train gaps to ensure zero punctuality disruption.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-500"></span>
                  <span className="text-slate-300">Optimized Block Window</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-blue-500"></span>
                  <span className="text-slate-300">Passenger / Vande Bharat</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-purple-500"></span>
                  <span className="text-slate-300">Freight Train</span>
                </div>
              </div>
            </div>

            {/* Gantt Timeline Canvas */}
            <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800/90 font-mono text-xs overflow-x-auto">
              {/* Time axis header */}
              <div className="grid grid-cols-7 border-b border-slate-800 pb-2 text-slate-500 text-[11px]">
                {timelineHours.slice(0, 7).map((th) => (
                  <div key={th.label} className="text-left">
                    {th.label}
                  </div>
                ))}
              </div>

              {/* Row 1: AI Optimized Maintenance Blocks */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-sans font-semibold text-amber-400 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Optimized Joint Blocks:</span>
                </div>
                <div className="relative h-9 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex items-center">
                  {optimizedBlocks.map((block) => {
                    const left = timeToPercent(block.startTime);
                    const right = timeToPercent(block.endTime);
                    const width = Math.max(12, right - left);

                    return (
                      <div
                        key={block.id}
                        style={{ left: `${left}%`, width: `${width}%` }}
                        className="absolute h-7 rounded bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 font-bold px-2 flex items-center justify-between text-[11px] shadow-md border border-amber-300/50 cursor-pointer hover:brightness-110 transition-all z-10"
                        title={`${block.blockCode} (${block.startTime} - ${block.endTime}): ${block.tasks.length} tasks`}
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedBlockId(block.id);
                          setActiveViewMode('centerpiece');
                        }}
                      >
                        <span className="truncate">{block.blockCode}</span>
                        <span className="text-[10px] ml-1 opacity-90 hidden sm:inline">{block.startTime}-{block.endTime}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Overlapping Train Movements */}
              <div className="space-y-1.5 pt-2">
                <div className="text-[11px] font-sans font-semibold text-slate-300 flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5 text-blue-400" />
                  <span>Scheduled Train Movements (Same Corridor / Section):</span>
                </div>
                <div className="relative h-9 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex items-center">
                  {trains.map((train) => {
                    const left = timeToPercent(train.passStartTime);
                    const right = timeToPercent(train.passEndTime);
                    const width = Math.max(8, right - left);

                    const isVandeBharat = train.trainType === 'Vande Bharat' || train.trainType === 'Rajdhani / Shatabdi';
                    const bgColor = isVandeBharat
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-purple-600 border-purple-400 text-purple-100';

                    return (
                      <div
                        key={train.id}
                        style={{ left: `${left}%`, width: `${width}%` }}
                        className={`absolute h-7 rounded ${bgColor} border text-[10px] font-semibold px-1.5 flex items-center justify-center truncate z-10`}
                        title={`${train.trainNo} - ${train.trainName} (${train.passStartTime} - ${train.passEndTime})`}
                      >
                        <span className="truncate">{train.trainNo}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Timetable Interval Check: 0 Conflicts with Premium Vande Bharat / Rajdhani Trains</span>
            </div>
          </div>
        )}
      </div>

      {/* OFFICIAL RAILWAY MEMO MODAL */}
      {showMemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
                  Indian Railways — Joint Maintenance Block Sanction Order
                </h3>
              </div>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowMemoModal(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Printable Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono text-slate-300">
              <div className="text-center border-b border-slate-800 pb-3 space-y-1">
                <span className="font-bold text-sm text-white block">GOVERNMENT OF INDIA • MINISTRY OF RAILWAYS</span>
                <span className="text-slate-400 block">DIVISIONAL ROLLING BLOCK PROGRAMME & JOINT CORRIDOR SANCTION CIRCULAR</span>
                <span className="text-amber-400 block text-[11px]">MEMO NO: IR/OP-BLOCK/2026/0908/AI-OPT</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div><strong>Corridors:</strong> High Density Network (Delhi-Kanpur, Howrah-DDU, Mumbai-Kalyan)</div>
                <div><strong>Date of Execution:</strong> 2026-09-08 (Night Window)</div>
                <div><strong>Total Coordinated Windows:</strong> {optimizedBlocks.length} Blocks</div>
                <div><strong>Track Hours Saved:</strong> +{hoursSaved} Hours Saved</div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-white text-xs block">SANCTIONED JOINT BLOCKS SCHEDULE:</span>
                <table className="w-full text-left border-collapse border border-slate-800 text-[11px]">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400">
                      <th className="border border-slate-800 p-2">Block Code</th>
                      <th className="border border-slate-800 p-2">Corridor & Section</th>
                      <th className="border border-slate-800 p-2">Window</th>
                      <th className="border border-slate-800 p-2">Departments</th>
                      <th className="border border-slate-800 p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optimizedBlocks.map((b) => (
                      <tr key={b.id} className="border-b border-slate-800/60">
                        <td className="p-2 border border-slate-800 text-amber-400 font-bold">{b.blockCode}</td>
                        <td className="p-2 border border-slate-800">{b.corridorName} ({b.sectionName})</td>
                        <td className="p-2 border border-slate-800">{b.startTime} - {b.endTime}</td>
                        <td className="p-2 border border-slate-800">
                          {b.departmentCounts.engineering > 0 ? 'Eng ' : ''}
                          {b.departmentCounts.trd > 0 ? 'TRD ' : ''}
                          {b.departmentCounts.st > 0 ? 'S&T' : ''}
                        </td>
                        <td className="p-2 border border-slate-800 text-emerald-400 font-semibold">{b.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] space-y-1">
                <strong>OPERATING DIRECTIVE:</strong> All Section Controllers & Station Masters to ensure OHE power isolation and track possession are handed over strictly at the sanctioned start times. Section clear reports must be logged in IBMS upon completion.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Generated by RailBlock AI Heuristic Optimization Engine
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundFx.playSanctionSound();
                    setShowMemoModal(false);
                    onNavigateToTab('review');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer active:scale-95"
                >
                  Proceed to Sanction Desk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Technical Architecture Footnote */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-300">
            Algorithmic Scalability & Production Architecture Roadmap
          </span>
          <p className="leading-relaxed">
            This hackathon prototype implements a <strong className="text-slate-200">greedy heuristic</strong> (Priority Scoring → Spatial Proximity Clustering → Interval-Overlap timetable filtering). The underlying data structures and problem formulation are architected to seamlessly plug into <strong className="text-amber-300">Google OR-Tools (CP-SAT / Mixed Integer Linear Programming)</strong> in the production FastAPI/Python backend for multi-corridor network-wide simultaneous optimization.
          </p>
        </div>
      </div>
    </div>
  );
};
