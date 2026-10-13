import React, { useState, useEffect } from 'react';
import {
  Navbar,
  ActiveTab,
} from './components/Navbar';
import { ModuleGuide } from './components/ModuleGuide';
import { TerminalSimulator } from './components/TerminalSimulator';
import { TopologyCanvas } from './components/TopologyCanvas';
import { DistroComparison } from './components/DistroComparison';
import { TroubleshootingCenter } from './components/TroubleshootingCenter';
import { LAB_MODULES } from './data/labModules';
import {
  Server,
  Terminal,
  Network,
  Bot,
  Layers,
  CheckCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('modules');
  const [terminalInitialCmd, setTerminalInitialCmd] = useState<string>('');
  const [errorForAI, setErrorForAI] = useState<{ errorText: string; context: string } | null>(null);

  // Completed steps saved in localStorage
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('vslab_completed_steps');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    return new Set<string>();
  });

  const totalStepsCount = LAB_MODULES.reduce((acc, m) => acc + m.steps.length, 0);

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      try {
        localStorage.setItem('vslab_completed_steps', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleExecuteInTerminal = (command: string) => {
    setTerminalInitialCmd(command);
    setActiveTab('terminal');
  };

  const handleSendErrorToAI = (errorText: string, context: string) => {
    setErrorForAI({ errorText, context });
    setActiveTab('troubleshooting');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        completedStepsCount={completedSteps.size}
        totalStepsCount={totalStepsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Banner with Metric Highlights (Anti-slop compliant) */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
                <span>LAB INFRASTRUKTUR TI PEMULA</span>
                <span>·</span>
                <span>VMWARE VIRTUALIZATION</span>
                <span>·</span>
                <span>DEBIAN & UBUNTU</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Membangun Server Virtual Skala Kecil dengan Linux
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Pelajari persiapan hardware, setup jaringan adapter virtual di VMware, konfigurasi IP statis, web server Nginx, OpenSSH, firewall UFW, serta pengujian konektivitas komprehensif dari komputer client ke server.
              </p>
            </div>

            {/* Quick Strip KPI */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 block">Kurikulum</span>
                <span className="text-lg font-bold text-white font-mono">6 Modul</span>
                <span className="text-[11px] text-cyan-400 block mt-0.5">Langkah bertahap</span>
              </div>
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 block">Distro Linux</span>
                <span className="text-lg font-bold text-white font-mono">2 OS</span>
                <span className="text-[11px] text-amber-400 block mt-0.5">Debian & Ubuntu</span>
              </div>
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 block">Praktik CLI</span>
                <span className="text-lg font-bold text-white font-mono">Terminal</span>
                <span className="text-[11px] text-emerald-400 block mt-0.5">Simulator realtime</span>
              </div>
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 block">Bantuan AI</span>
                <span className="text-lg font-bold text-white font-mono">Gemini</span>
                <span className="text-[11px] text-cyan-400 block mt-0.5">Diagnostik error</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Viewport */}
        {activeTab === 'modules' && (
          <ModuleGuide
            completedSteps={completedSteps}
            onToggleStep={toggleStep}
            onExecuteInTerminal={handleExecuteInTerminal}
          />
        )}

        {activeTab === 'terminal' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  Simulator Terminal Linux Virtual
                </h2>
                <p className="text-sm text-slate-400 mt-0.5">
                  Lakukan simulasi eksekusi perintah administrasi server Debian & Ubuntu secara aman langsung di browser.
                </p>
              </div>
            </div>
            <TerminalSimulator
              initialCommand={terminalInitialCmd}
              onSendToAI={handleSendErrorToAI}
            />
          </div>
        )}

        {activeTab === 'topology' && <TopologyCanvas />}

        {activeTab === 'comparison' && <DistroComparison />}

        {activeTab === 'troubleshooting' && (
          <TroubleshootingCenter
            initialErrorToAnalyze={errorForAI?.errorText}
            initialContext={errorForAI?.context}
            onExecuteCommandInTerminal={handleExecuteInTerminal}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-6 text-xs text-slate-500 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 VirtualServer Lab AI · Panduan Lengkap Membangun Server Virtual Linux untuk Pemula</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Subnet: 192.168.10.0/24</span>
            <span>·</span>
            <span>VMware Workstation</span>
            <span>·</span>
            <span>Debian 12 / Ubuntu 24.04 LTS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
