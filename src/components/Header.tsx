import React, { useState, useEffect } from 'react';
import { 
  Train, 
  Cpu, 
  Sparkles, 
  Layers, 
  Radio,
  Plus,
  Volume2,
  VolumeX,
  FileDown
} from 'lucide-react';
import { Corridor } from '../types';
import { soundFx } from '../utils/audioFx';

interface HeaderProps {
  corridors: Corridor[];
  selectedCorridorId: string;
  onSelectCorridor: (id: string) => void;
  onOpenNewTaskModal: () => void;
  onTriggerOptimization: () => void;
  hasOptimizedBlocks: boolean;
  approvedBlocksCount: number;
  totalTasksCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  corridors,
  selectedCorridorId,
  onSelectCorridor,
  onOpenNewTaskModal,
  onTriggerOptimization,
  hasOptimizedBlocks,
  approvedBlocksCount,
  totalTasksCount,
}) => {
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getMuted());

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format Indian Standard Time (IST)
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kolkata',
      };
      setTime(now.toLocaleTimeString('en-IN', options) + ' IST');
      
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
      };
      setDateStr(now.toLocaleDateString('en-IN', dateOptions));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 lg:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left Brand / Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 ring-1 ring-amber-400/40">
            <Train className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-linear-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent font-['Chakra_Petch']">
                RailBlock AI
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                SIH DEMO
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                Indian Railways Decision Support
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>Automatic Multi-Department Maintenance Coordination Engine</span>
            </p>
          </div>
        </div>

        {/* Center & Right Control Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Corridor Filter Select */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-500 hidden sm:inline">Corridor:</span>
            <select
              value={selectedCorridorId}
              onChange={(e) => onSelectCorridor(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">
                All Corridors ({corridors.length} HDN/Trunk Routes)
              </option>
              {corridors.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Live Control Room Clock */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-950/80 border border-slate-800/80 rounded-lg px-3 py-1.5 font-mono text-xs text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <div>
              <span className="text-emerald-400 font-semibold">{time}</span>
              <span className="text-slate-500 ml-1.5 text-[10px]">{dateStr}</span>
            </div>
          </div>

          {/* Sound FX Audio Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
              !isMuted 
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25' 
                : 'bg-slate-950/80 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={isMuted ? 'Unmute Audio & Feature Sound Effects' : 'Mute Sound Effects'}
          >
            {!isMuted ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Quick Action CTA */}
          <div className="flex items-center gap-2">
            <a
              href="/RailBlock_AI_Complete_Documentation.docx"
              download="RailBlock_AI_Complete_Documentation.docx"
              onClick={() => soundFx.playClick(650)}
              className="px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 active:scale-95 text-blue-300 hover:text-blue-100 text-xs font-semibold border border-blue-800/60 hover:border-blue-500 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer group"
              title="Download Complete Technical Dossier & Viva Guide in Microsoft Word / Google Docs (.docx) format"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-400 group-hover:animate-bounce" />
              <span className="hidden sm:inline">Docs File (.docx)</span>
              <span className="sm:hidden">Docs</span>
            </a>

            <button
              onClick={() => {
                soundFx.playClick();
                onOpenNewTaskModal();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-100 text-xs font-semibold border border-slate-700/80 hover:border-amber-500/50 shadow-sm hover:shadow-amber-500/10 transition-all flex items-center gap-1.5 cursor-pointer group"
              title="Add a maintenance requirement from Engineering, TRD, or S&T"
            >
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                <Plus className="w-3 h-3" />
              </span>
              <span className="font-semibold">New Task</span>
            </button>

            <button
              onClick={() => {
                soundFx.playOptimizationPlanSuccess();
                onTriggerOptimization();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Cpu className="w-3.5 h-3.5 text-slate-950" />
              <span>Run AI Optimizer</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
