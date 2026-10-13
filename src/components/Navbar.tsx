import React from 'react';
import { Terminal, Network, BookOpen, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';

export type ActiveTab = 'modules' | 'terminal' | 'topology' | 'comparison' | 'troubleshooting';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  completedStepsCount: number;
  totalStepsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  completedStepsCount,
  totalStepsCount,
}) => {
  const percent = totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
            VS
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            VirtualServer Lab AI
          </span>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
          <button
            onClick={() => onSelectTab('modules')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'modules'
                ? 'bg-slate-800 text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Modul Panduan</span>
          </button>

          <button
            onClick={() => onSelectTab('terminal')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'terminal'
                ? 'bg-slate-800 text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Simulator Terminal</span>
          </button>

          <button
            onClick={() => onSelectTab('topology')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'topology'
                ? 'bg-slate-800 text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Topologi Jaringan</span>
          </button>

          <button
            onClick={() => onSelectTab('comparison')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'comparison'
                ? 'bg-slate-800 text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Komparasi Distro</span>
          </button>

          <button
            onClick={() => onSelectTab('troubleshooting')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'troubleshooting'
                ? 'bg-slate-800 text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Troubleshooting & AI</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action with progress indicator */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Progres Lab:</span>
            <span className="font-mono font-medium text-slate-200 tabular-nums">
              {completedStepsCount}/{totalStepsCount} ({percent}%)
            </span>
          </div>

          <button
            onClick={() => onSelectTab(activeTab === 'terminal' ? 'modules' : 'terminal')}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm cursor-pointer"
          >
            {activeTab === 'terminal' ? 'Lihat Panduan' : 'Buka Terminal'}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-between overflow-x-auto px-4 py-2 bg-slate-900/90 border-t border-slate-800/80 text-xs">
        <button
          onClick={() => onSelectTab('modules')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${activeTab === 'modules' ? 'text-cyan-400 font-semibold bg-slate-800' : 'text-slate-400'}`}
        >
          Modul
        </button>
        <button
          onClick={() => onSelectTab('terminal')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${activeTab === 'terminal' ? 'text-cyan-400 font-semibold bg-slate-800' : 'text-slate-400'}`}
        >
          Terminal
        </button>
        <button
          onClick={() => onSelectTab('topology')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${activeTab === 'topology' ? 'text-cyan-400 font-semibold bg-slate-800' : 'text-slate-400'}`}
        >
          Topologi
        </button>
        <button
          onClick={() => onSelectTab('comparison')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${activeTab === 'comparison' ? 'text-cyan-400 font-semibold bg-slate-800' : 'text-slate-400'}`}
        >
          Komparasi
        </button>
        <button
          onClick={() => onSelectTab('troubleshooting')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${activeTab === 'troubleshooting' ? 'text-cyan-400 font-semibold bg-slate-800' : 'text-slate-400'}`}
        >
          Troubleshooting
        </button>
      </div>
    </header>
  );
};
