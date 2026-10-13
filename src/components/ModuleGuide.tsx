import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Copy,
  Check,
  Terminal,
  AlertTriangle,
  Lightbulb,
  FileCode,
  ArrowRight,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';
import { LAB_MODULES } from '../data/labModules';
import { LabModule, LabStep, DistroType } from '../types';

interface ModuleGuideProps {
  completedSteps: Set<string>;
  onToggleStep: (stepId: string) => void;
  onExecuteInTerminal: (command: string) => void;
}

export const ModuleGuide: React.FC<ModuleGuideProps> = ({
  completedSteps,
  onToggleStep,
  onExecuteInTerminal,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(LAB_MODULES[0].id);
  const [distroFilter, setDistroFilter] = useState<DistroType>('both');
  const [copiedStepId, setCopiedStepId] = useState<string | null>(null);

  const activeModule = LAB_MODULES.find((m) => m.id === selectedModuleId) || LAB_MODULES[0];

  const filteredSteps = activeModule.steps.filter((step) => {
    if (distroFilter === 'both') return true;
    return step.distro === 'both' || step.distro === distroFilter;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStepId(id);
    setTimeout(() => setCopiedStepId(null), 2000);
  };

  const getModuleProgress = (mod: LabModule) => {
    const total = mod.steps.length;
    const completed = mod.steps.filter((s) => completedSteps.has(s.id)).length;
    return { completed, total, isComplete: total > 0 && completed === total };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Sidebar: Module Index & Progress */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Kurikulum Modul Lab
            </span>
            <span className="text-xs font-mono text-cyan-400">6 Modul Praktik</span>
          </div>

          <div className="mt-3 space-y-2">
            {LAB_MODULES.map((mod) => {
              const { completed, total, isComplete } = getModuleProgress(mod);
              const isSelected = mod.id === activeModule.id;

              return (
                <button
                  key={mod.id}
                  onClick={() => setSelectedModuleId(mod.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500/50 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-cyan-400 font-bold">
                        MODUL {mod.moduleNumber}
                      </span>
                      <span className="text-slate-500 text-[11px]">·</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {mod.estimatedMinutes}m
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-100 truncate">{mod.title}</h3>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 pt-1">
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="text-[11px] font-mono text-slate-400">
                        {completed}/{total}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Distro Focus Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Filter Tampilan Distro:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDistroFilter('both')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                distroFilter === 'both'
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua Distro
            </button>
            <button
              onClick={() => setDistroFilter('ubuntu')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                distroFilter === 'ubuntu'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Ubuntu Focus
            </button>
            <button
              onClick={() => setDistroFilter('debian')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                distroFilter === 'debian'
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Debian Focus
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Module Active Steps & Documentation */}
      <div className="lg:col-span-8 space-y-6">
        {/* Module Header Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold">
            <span>MODUL {activeModule.moduleNumber} DARI 6</span>
            <span>·</span>
            <span className="text-slate-400">{activeModule.difficulty}</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1 tracking-tight">{activeModule.title}</h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">{activeModule.shortDesc}</p>
        </div>

        {/* Steps List */}
        <div className="space-y-6">
          {filteredSteps.map((step) => {
            const isCompleted = completedSteps.has(step.id);

            return (
              <div
                key={step.id}
                className={`bg-slate-950 border rounded-xl p-6 transition-all ${
                  isCompleted
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Step Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleStep(step.id)}
                      className="mt-0.5 p-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                      title={isCompleted ? 'Tandai belum selesai' : 'Tandai selesai'}
                    >
                      <CheckCircle2
                        className={`w-5 h-5 ${isCompleted ? 'text-emerald-400 fill-emerald-950' : 'text-slate-600'}`}
                      />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          LANGKAH {step.stepNumber}
                        </span>
                        {step.distro !== 'both' && (
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                              step.distro === 'ubuntu'
                                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                            }`}
                          >
                            {step.distro === 'ubuntu' ? 'Khusus Ubuntu' : 'Khusus Debian'}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">{step.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">{step.description}</p>

                {/* Concept / Analogy Callout */}
                {step.conceptNote && (
                  <div className="mt-4 p-4 rounded-lg bg-cyan-950/20 border border-cyan-500/20 flex items-start gap-3 text-xs text-cyan-200">
                    <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="whitespace-pre-line leading-relaxed">{step.conceptNote}</div>
                  </div>
                )}

                {/* Warning / Caution */}
                {step.warningNote && (
                  <div className="mt-4 p-4 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">{step.warningNote}</div>
                  </div>
                )}

                {/* Config File Preview if applicable */}
                {step.configFilePath && step.configFileContent && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-1.5">
                      <span className="flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                        {step.configFilePath}
                      </span>
                      <button
                        onClick={() => handleCopy(step.id + '-cfg', step.configFileContent!)}
                        className="text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1"
                      >
                        {copiedStepId === step.id + '-cfg' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin Konfigurasi</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                      {step.configFileContent}
                    </pre>
                  </div>
                )}

                {/* Command Block */}
                {step.command && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-1.5 font-mono">
                      <span>Perintah Terminal:</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCopy(step.id, step.command!)}
                          className="hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedStepId === step.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => onExecuteInTerminal(step.command!)}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer font-semibold"
                        >
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Jalankan di Simulator</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                      <code className="text-xs font-mono text-emerald-300 font-semibold break-all">
                        {step.command}
                      </code>
                    </div>
                  </div>
                )}

                {/* Expected Output */}
                {step.expectedOutput && (
                  <div className="mt-3">
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                      Output yang Diharapkan:
                    </span>
                    <pre className="p-3 bg-slate-900/60 border border-slate-850 rounded-lg text-xs font-mono text-slate-400 overflow-x-auto leading-relaxed">
                      {step.expectedOutput}
                    </pre>
                  </div>
                )}

                {/* Explanation */}
                <div className="mt-4 pt-4 border-t border-slate-850 flex items-start gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300 shrink-0">Penjelasan Pemula:</span>
                  <span className="leading-relaxed">{step.explanation}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
