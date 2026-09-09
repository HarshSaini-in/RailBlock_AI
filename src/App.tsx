import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Cpu, 
  UserCheck, 
  Sliders, 
  Calendar, 
  Award, 
  Sparkles,
  Train,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  MaintenanceTask, 
  BlockWindow, 
  TrainSchedule, 
  OptimizedBlock, 
  Corridor 
} from './types';
import { 
  INITIAL_TASKS, 
  INITIAL_BLOCK_WINDOWS, 
  INITIAL_TRAIN_SCHEDULES, 
  INITIAL_CORRIDORS 
} from './data/mockData';
import { runOptimization } from './utils/optimizationEngine';
import { soundFx } from './utils/audioFx';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TaskQueueView } from './components/TaskQueueView';
import { OptimizationEngineView } from './components/OptimizationEngineView';
import { PlannerReviewView } from './components/PlannerReviewView';
import { WhatIfSimulatorView } from './components/WhatIfSimulatorView';
import { WeeklyScheduleView } from './components/WeeklyScheduleView';
import { NoveltyComparisonView } from './components/NoveltyComparisonView';
import { NewTaskModal } from './components/NewTaskModal';

export default function App() {
  // Application Data States
  const [tasks, setTasks] = useState<MaintenanceTask[]>(INITIAL_TASKS);
  const [windows, setWindows] = useState<BlockWindow[]>(INITIAL_BLOCK_WINDOWS);
  const [trains, setTrains] = useState<TrainSchedule[]>(INITIAL_TRAIN_SCHEDULES);
  const [corridors] = useState<Corridor[]>(INITIAL_CORRIDORS);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'tasks' | 'engine' | 'review' | 'whatif' | 'weekly' | 'novelty'
  >('dashboard');

  // Selected Corridor Filter across all tabs
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('ALL');

  // Modal State for New Task
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Initial Auto-run Optimization so the user immediately sees ready data
  const [optimizedBlocks, setOptimizedBlocks] = useState<OptimizedBlock[]>(() => {
    const { optimizedBlocks: initialBlocks } = runOptimization(
      INITIAL_TASKS,
      INITIAL_BLOCK_WINDOWS,
      INITIAL_TRAIN_SCHEDULES
    );
    return initialBlocks;
  });

  // Master optimization handler
  const handleTriggerOptimization = () => {
    const { optimizedBlocks: newBlocks, summary } = runOptimization(tasks, windows, trains);
    setOptimizedBlocks(newBlocks);
    showToast(`Optimization complete: ${newBlocks.length} joint blocks generated! Saved ${summary.hoursSaved}h track capacity.`);
  };

  // Add Task handler
  const handleAddTask = (newTask: MaintenanceTask) => {
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    // Re-run optimization with new task
    const { optimizedBlocks: newBlocks } = runOptimization(updatedTasks, windows, trains);
    setOptimizedBlocks(newBlocks);
    showToast(`Task ${newTask.id} added with priority score ${newTask.computedScore}/100.`);
  };

  // Approve Block handler
  const handleApproveBlock = (blockId: string, notes?: string) => {
    setOptimizedBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? {
              ...b,
              status: 'Approved',
              plannerNotes: notes || b.plannerNotes,
              approvedAt: new Date().toISOString(),
              approvedBy: 'Chief Controller (Operating)',
            }
          : b
      )
    );
    showToast(`Block ${blockId} officially sanctioned for master schedule!`, 'success');
  };

  // Approve All Blocks handler
  const handleApproveAllBlocks = () => {
    setOptimizedBlocks((prev) =>
      prev.map((b) => ({
        ...b,
        status: 'Approved',
        plannerNotes: 'Sanctioned during Master Joint Optimization run',
        approvedAt: new Date().toISOString(),
        approvedBy: 'Chief Controller (Operating)',
      }))
    );
    showToast(`All generated blocks sanctioned into official Master Schedule!`, 'success');
  };

  // Reject Block handler
  const handleRejectBlock = (blockId: string, reason?: string) => {
    setOptimizedBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? {
              ...b,
              status: 'Rejected',
              plannerNotes: reason ? `Rejected: ${reason}` : 'Rejected by controller',
            }
          : b
      )
    );
    showToast(`Block ${blockId} rejected and queued for rescheduling.`, 'info');
  };

  // Modify Block handler
  const handleModifyBlock = (updatedBlock: OptimizedBlock) => {
    setOptimizedBlocks((prev) =>
      prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b))
    );
    showToast(`Block ${updatedBlock.blockCode} timing modified.`, 'info');
  };

  // Apply Simulated Plan from What-If Simulator
  const handleApplySimulatedPlan = (newTasks: MaintenanceTask[], newBlocks: OptimizedBlock[]) => {
    setTasks(newTasks);
    setOptimizedBlocks(newBlocks);
    showToast(`Simulated scenario plan adopted into review queue!`);
  };

  const pendingReviewCount = optimizedBlocks.filter((b) => b.status === 'Awaiting Review').length;
  const approvedBlocksCount = optimizedBlocks.filter((b) => b.status === 'Approved').length;

  const navTabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'tasks',
      label: 'Task Queue',
      icon: Layers,
      badge: tasks.length,
    },
    {
      id: 'engine',
      label: 'AI Planning Engine',
      icon: Cpu,
      badge: '3-Step Heuristic',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'review',
      label: 'Planner Review',
      icon: UserCheck,
      badge: pendingReviewCount > 0 ? `${pendingReviewCount} Pending` : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'whatif',
      label: 'What-If Simulator',
      icon: Sliders,
      badge: 'Scenarios',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'weekly',
      label: 'Weekly Schedule',
      icon: Calendar,
      badge: `${approvedBlocksCount} Sanctioned`,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'novelty',
      label: 'Novelty & Benchmarks',
      icon: Award,
      badge: 'Pitch Table',
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top App Header */}
      <Header
        corridors={corridors}
        selectedCorridorId={selectedCorridorId}
        onSelectCorridor={setSelectedCorridorId}
        onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
        onTriggerOptimization={handleTriggerOptimization}
        hasOptimizedBlocks={optimizedBlocks.length > 0}
        approvedBlocksCount={approvedBlocksCount}
        totalTasksCount={tasks.length}
      />

      {/* Navigation Sub-Header Bar */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-[60px] z-20 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto py-1.5 scrollbar-none">
          <div className="flex items-center gap-1 sm:gap-2">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab(tab.id as any);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                        isActive
                          ? 'bg-slate-950 text-amber-300 border-slate-950'
                          : tab.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Body Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            tasks={tasks}
            windows={windows}
            optimizedBlocks={optimizedBlocks}
            onNavigateToTab={(t) => setActiveTab(t as any)}
            onTriggerOptimization={handleTriggerOptimization}
            onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskQueueView
            tasks={tasks}
            corridors={corridors}
            selectedCorridorId={selectedCorridorId}
            onAddTask={handleAddTask}
            isNewTaskModalOpen={isNewTaskModalOpen}
            onCloseNewTaskModal={() => setIsNewTaskModalOpen(false)}
            onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
            onTriggerOptimization={() => {
              handleTriggerOptimization();
              setActiveTab('engine');
            }}
          />
        )}

        {activeTab === 'engine' && (
          <OptimizationEngineView
            tasks={tasks}
            windows={windows}
            trains={trains}
            corridors={corridors}
            selectedCorridorId={selectedCorridorId}
            optimizedBlocks={optimizedBlocks}
            onTriggerOptimization={handleTriggerOptimization}
            onApproveBlock={handleApproveBlock}
            onApproveAllBlocks={handleApproveAllBlocks}
            onNavigateToTab={(t) => setActiveTab(t as any)}
          />
        )}

        {activeTab === 'review' && (
          <PlannerReviewView
            optimizedBlocks={optimizedBlocks}
            onApproveBlock={handleApproveBlock}
            onRejectBlock={handleRejectBlock}
            onModifyBlock={handleModifyBlock}
            corridors={corridors}
            onNavigateToTab={(t) => setActiveTab(t as any)}
          />
        )}

        {activeTab === 'whatif' && (
          <WhatIfSimulatorView
            baseTasks={tasks}
            baseWindows={windows}
            baseTrains={trains}
            corridors={corridors}
            onApplySimulatedPlan={handleApplySimulatedPlan}
            onNavigateToTab={(t) => setActiveTab(t as any)}
          />
        )}

        {activeTab === 'weekly' && (
          <WeeklyScheduleView
            optimizedBlocks={optimizedBlocks}
            corridors={corridors}
            selectedCorridorId={selectedCorridorId}
          />
        )}

        {activeTab === 'novelty' && (
          <NoveltyComparisonView
            onNavigateToTab={(t) => setActiveTab(t as any)}
          />
        )}
      </main>

      {/* Global New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAddTask={handleAddTask}
        corridors={corridors}
      />

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="bg-slate-900 border border-amber-500/50 text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900/90 border-t border-slate-800 py-4 px-4 lg:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="font-semibold text-slate-400">RailBlock AI Prototype</span>
            <span>• Smart India Hackathon (SIH) Decision-Support System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Model Precedents: South Central (IBMS) & East Coast (Rolling Block)</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-mono">Status: Ready for Demo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
