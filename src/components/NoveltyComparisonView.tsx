import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  Building2, 
  ShieldCheck, 
  Cpu,
  ArrowRight
} from 'lucide-react';

interface NoveltyComparisonViewProps {
  onNavigateToTab: (tab: string) => void;
}

export const NoveltyComparisonView: React.FC<NoveltyComparisonViewProps> = ({
  onNavigateToTab,
}) => {
  const comparisonRows = [
    {
      capability: 'Multi-Department Task Grouping',
      ibms: { text: 'Manual', status: 'manual' },
      rollingBlock: { text: 'Manual', status: 'manual' },
      railBlockAI: { text: 'Automatic (AI Proximity Clustering)', status: 'ai' },
      impact: 'Eliminates redundant track closures by uniting Engineering, TRD, and S&T co-located jobs.',
    },
    {
      capability: 'Priority Ranking Matrix',
      ibms: { text: 'Not Available', status: 'none' },
      rollingBlock: { text: 'Partial (Heuristic list)', status: 'partial' },
      railBlockAI: { text: 'Automatic (Weighted Multi-Factor Scoring)', status: 'ai' },
      impact: 'Combines asset criticality (45%), urgency (40%), and overdue status (25%) objectively.',
    },
    {
      capability: 'Train Timetable Conflict Check',
      ibms: { text: 'Not Available', status: 'none' },
      rollingBlock: { text: 'Not Available (Visual lookups)', status: 'none' },
      railBlockAI: { text: 'Automatic (Interval-Overlap Timetable Engine)', status: 'ai' },
      impact: 'Guarantees zero conflict against premium trains (Vande Bharat / Rajdhani Express).',
    },
    {
      capability: 'Dynamic What-If Simulation',
      ibms: { text: 'Not Available', status: 'none' },
      rollingBlock: { text: 'Not Available (Static plans)', status: 'none' },
      railBlockAI: { text: 'Yes (Instant Real-Time Re-run)', status: 'ai' },
      impact: 'Recalculates whole schedule in <500ms when emergency tasks or train surges arise.',
    },
    {
      capability: 'Decision Authority Flow',
      ibms: { text: 'Human (Chief Controller)', status: 'manual' },
      rollingBlock: { text: 'Human (Block Planner)', status: 'manual' },
      railBlockAI: { text: 'AI Suggests → Human Controller Approves', status: 'ai' },
      impact: 'Human-in-the-loop design keeps railway operating hierarchy intact while removing cognitive strain.',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Pitch Deck Novelty Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Award className="w-3 h-3" />
            Hackathon Pitch Feature
          </span>
          <span className="text-xs text-slate-400">Competitive Architecture Comparison</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white font-['Chakra_Petch']">
          How RailBlock AI Goes Beyond Existing Indian Railways Systems
        </h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
          While deployed precedents like <strong>IBMS (South Central Railway)</strong> and the <strong>Rolling Block Programme (East Coast Railway)</strong> digitized request collection, they still require human planners to manually group tasks, score priorities, and cross-reference train schedules. RailBlock AI automates those manual steps.
        </p>
      </div>

      {/* Comparison Table Card (Direct Pitch Deck Lift) */}
      <div className="bg-slate-900/90 border-2 border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              System Capability Matrix (Side-by-Side)
            </span>
          </div>
          <span className="text-[11px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
            SIH Evaluation Standard
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5 font-semibold w-1/4">Capability Dimension</th>
                <th className="py-3.5 px-4 font-semibold text-slate-400">IBMS (South Central)</th>
                <th className="py-3.5 px-4 font-semibold text-slate-400">Rolling Block (East Coast)</th>
                <th className="py-3.5 px-5 font-bold text-amber-400 bg-amber-500/10 border-l border-r border-amber-500/20">
                  RailBlock AI (SIH Solution)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-5 align-top">
                    <div className="font-bold text-slate-200 text-sm">{row.capability}</div>
                    <div className="text-[11px] text-slate-400 mt-1 leading-normal">{row.impact}</div>
                  </td>

                  <td className="py-4 px-4 align-top">
                    <div className="flex items-center gap-1.5 font-medium text-slate-400">
                      {row.ibms.status === 'none' ? (
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0"></span>
                      )}
                      <span>{row.ibms.text}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 align-top">
                    <div className="flex items-center gap-1.5 font-medium text-slate-300">
                      {row.rollingBlock.status === 'none' ? (
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      ) : row.rollingBlock.status === 'partial' ? (
                        <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0"></span>
                      )}
                      <span>{row.rollingBlock.text}</span>
                    </div>
                  </td>

                  <td className="py-4 px-5 align-top bg-amber-500/5 border-l border-r border-amber-500/20">
                    <div className="flex items-start gap-2 font-bold text-amber-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span>{row.railBlockAI.text}</span>
                        <span className="block text-[10px] text-emerald-400 font-normal mt-0.5">
                          Instant execution • Automated
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Target Impact & Deployment Evidence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white font-['Chakra_Petch']">
              Precedent Validation: IBMS (SCR)
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            South Central Railway's deployment proved that when departments digitize block requisitions, track machine output increases by <strong className="text-white">+24%</strong> and block availability jumps by <strong className="text-white">+33%</strong>.
          </p>
          <div className="pt-2 text-[11px] text-slate-400 font-mono">
            Key lesson: Aggregation works, but needs AI to automate grouping decisions.
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-['Chakra_Petch']">
              Precedent Validation: Rolling Block Programme (ECoR)
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            East Coast Railway demonstrated that rolling 52-week forward planning lifted granted-to-demand block utilization from <strong className="text-white">~60% to ~73%</strong> with <strong className="text-white">~94% planning consistency</strong>.
          </p>
          <div className="pt-2 text-[11px] text-slate-400 font-mono">
            RailBlock AI target: Exceed 75% utilization with dynamic conflict checking.
          </div>
        </div>
      </div>

      {/* Demo Call to Action */}
      <div className="p-4 rounded-xl bg-linear-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white font-['Chakra_Petch']">
            Experience the 3-Step Optimizer in Action
          </h3>
          <p className="text-xs text-slate-400">
            See how the greedy constraint algorithm merges tasks and resolves train overlaps in seconds.
          </p>
        </div>

        <button
          onClick={() => onNavigateToTab('engine')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
          <span>Go to AI Planning Engine</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
