import React, { useState } from 'react';
import {
  AlertCircle,
  Bot,
  Search,
  Check,
  Copy,
  Terminal,
  Send,
  Loader2,
  Sparkles,
  HelpCircle,
  FileText,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { TROUBLESHOOTING_GUIDE } from '../data/troubleshootingGuide';
import { TroubleshootingItem } from '../types';

interface TroubleshootingCenterProps {
  initialErrorToAnalyze?: string;
  initialContext?: string;
  onExecuteCommandInTerminal?: (cmd: string) => void;
}

export const TroubleshootingCenter: React.FC<TroubleshootingCenterProps> = ({
  initialErrorToAnalyze,
  initialContext,
  onExecuteCommandInTerminal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'quick-guide' | 'ai-diagnostic' | 'ai-mentor'>('ai-diagnostic');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // AI Diagnostic State
  const [errorInput, setErrorInput] = useState<string>(
    initialErrorToAnalyze ||
      'Invalid YAML at //etc/netplan/50-cloud-init.yaml line 6 column 8: did not find expected key'
  );
  const [distroSelection, setDistroSelection] = useState<string>('Ubuntu Server');
  const [serviceSelection, setServiceSelection] = useState<string>('Jaringan (Netplan / ifupdown)');
  const [aiDiagnosis, setAiDiagnosis] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [diagError, setDiagError] = useState<string | null>(null);

  // AI Mentor Chat State
  const [mentorQuestion, setMentorQuestion] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: 'user' | 'assistant'; text: string; time: string }>
  >([
    {
      role: 'assistant',
      text: 'Halo! Saya AI Lab Mentor Anda. Ada kendala dalam konfigurasi jaringan VMware, perintah Linux di Debian/Ubuntu, atau pengujian koneksi client ke server? Tanyakan apa saja dengan bahasa santai!',
      time: 'Baru saja',
    },
  ]);
  const [isAskingMentor, setIsAskingMentor] = useState<boolean>(false);

  const sampleErrors = [
    {
      label: 'Error Indentasi Netplan YAML',
      distro: 'Ubuntu Server',
      service: 'Jaringan Netplan',
      text: 'Invalid YAML at //etc/netplan/50-cloud-init.yaml line 6 column 8: did not find expected key',
    },
    {
      label: 'Ping Host Unreachable',
      distro: 'Debian / Ubuntu',
      service: 'Adapter VMware',
      text: 'From 192.168.10.50 icmp_seq=1 Destination Host Unreachable. 100% packet loss.',
    },
    {
      label: 'Web Nginx Port 80 Connection Refused',
      distro: 'Ubuntu Server',
      service: 'Nginx Web Server',
      text: 'curl: (7) Failed to connect to 192.168.10.10 port 80: Connection refused',
    },
    {
      label: 'Debian: sudo command not found',
      distro: 'Debian Server',
      service: 'Hak Akses Sudo',
      text: 'bash: sudo: command not found. adminlab is not in the sudoers file.',
    },
  ];

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const runAiDiagnostic = async () => {
    if (!errorInput.trim()) return;
    setIsDiagnosing(true);
    setDiagError(null);
    setAiDiagnosis(null);

    try {
      const res = await fetch('/api/ai/troubleshoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          errorText: errorInput,
          distro: distroSelection,
          service: serviceSelection,
          context: initialContext || 'Praktik Lab Virtual Server',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses diagnosis error.');
      }

      setAiDiagnosis(data.diagnosis);
    } catch (err: any) {
      setDiagError(err.message || 'Terjadi gangguan jaringan.');
    } finally {
      setIsDiagnosing(false);
    }
  };

  const askMentor = async (queryText?: string) => {
    const q = queryText || mentorQuestion;
    if (!q.trim()) return;

    const userMsg = {
      role: 'user' as const,
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setMentorQuestion('');
    setIsAskingMentor(true);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          distro: distroSelection,
          context: 'Laboratorium Praktikum Server Debian & Ubuntu',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menerima tanggapan tutor.');
      }

      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Maaf, terjadi kendala: ${err.message}. Pastikan GEMINI_API_KEY telah terkonfigurasi.`,
          time: 'Gagal',
        },
      ]);
    } finally {
      setIsAskingMentor(false);
    }
  };

  const filteredGuides = TROUBLESHOOTING_GUIDE.filter((item) => {
    const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cause.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Sub Tabs Selection */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl max-w-xl">
        <button
          onClick={() => setActiveSubTab('ai-diagnostic')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            activeSubTab === 'ai-diagnostic'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4 text-cyan-400" />
          <span>AI Error Diagnostic</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ai-mentor')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            activeSubTab === 'ai-mentor'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>AI Lab Mentor (Tanya Jawab)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quick-guide')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            activeSubTab === 'quick-guide'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-cyan-400" />
          <span>Pustaka Solusi Cepat</span>
        </button>
      </div>

      {/* TAB 1: AI DIAGNOSTIC */}
      {activeSubTab === 'ai-diagnostic' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-cyan-400" />
                  Pemeriksa & Diagnosa Error Sistem
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Tempelkan pesan kesalahan dari terminal Linux atau VMware untuk dianalisis oleh AI dengan solusi konkret.
                </p>
              </div>

              {/* Sample Chips */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Contoh Kasus Error Umum:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sampleErrors.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setErrorInput(s.text);
                        setDistroSelection(s.distro);
                        setServiceSelection(s.service);
                      }}
                      className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-800 transition-colors cursor-pointer"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dropdowns */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Distribusi Terkait:</label>
                  <select
                    value={distroSelection}
                    onChange={(e) => setDistroSelection(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="Ubuntu Server">Ubuntu Server</option>
                    <option value="Debian Server">Debian Server</option>
                    <option value="Keduanya / VMware">Keduanya / VMware</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Komponen:</label>
                  <select
                    value={serviceSelection}
                    onChange={(e) => setServiceSelection(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="Jaringan (Netplan / ifupdown)">Jaringan (Netplan / ifupdown)</option>
                    <option value="Web Server Nginx">Web Server Nginx</option>
                    <option value="SSH Remote Access">SSH Remote Access</option>
                    <option value="UFW Firewall">UFW Firewall</option>
                    <option value="VMware Virtual Adapter">VMware Virtual Adapter</option>
                  </select>
                </div>
              </div>

              {/* Error Textarea */}
              <div>
                <label className="text-slate-300 text-xs font-semibold block mb-1.5">
                  Pesan Error / Log Terminal:
                </label>
                <textarea
                  rows={5}
                  value={errorInput}
                  onChange={(e) => setErrorInput(e.target.value)}
                  placeholder="Tempel teks error di sini..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-rose-300 placeholder-slate-600 outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              <button
                onClick={runAiDiagnostic}
                disabled={isDiagnosing || !errorInput.trim()}
                className="w-full py-2.5 px-4 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isDiagnosing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menganalisis Error dengan Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>Diagnosa Error & Berikan Solusi</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Result Panel */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 min-h-[420px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Hasil Analisis AI
                  </span>
                  {aiDiagnosis && (
                    <button
                      onClick={() => handleCopy('ai-diag', aiDiagnosis)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'ai-diag' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin Solusi</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {isDiagnosing && (
                  <div className="py-16 text-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
                    <p className="text-xs text-slate-400">
                      AI sedang meneliti kode error, penyebab jaringan, dan menyusun panduan perbaikan ramah pemula...
                    </p>
                  </div>
                )}

                {diagError && (
                  <div className="p-4 mt-4 bg-rose-950/30 border border-rose-500/40 rounded-lg text-xs text-rose-300">
                    <p className="font-bold">Gagal Mendiagnosa:</p>
                    <p className="mt-1">{diagError}</p>
                  </div>
                )}

                {aiDiagnosis && !isDiagnosing && (
                  <div className="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800/80 text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
                    {aiDiagnosis}
                  </div>
                )}

                {!aiDiagnosis && !isDiagnosing && !diagError && (
                  <div className="py-16 text-center text-slate-500 text-xs space-y-2">
                    <HelpCircle className="w-8 h-8 mx-auto text-slate-600" />
                    <p>Hasil diagnosa terstruktur akan muncul di sini setelah Anda mengklik tombol analisa.</p>
                  </div>
                )}
              </div>

              {aiDiagnosis && onExecuteCommandInTerminal && (
                <div className="mt-4 pt-4 border-t border-slate-800 text-right">
                  <button
                    onClick={() => onExecuteCommandInTerminal('sudo netplan try')}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 ml-auto cursor-pointer"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Uji Perbaikan di Simulator Terminal</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI MENTOR CHAT */}
      {activeSubTab === 'ai-mentor' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                AI Lab Mentor
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Tanyakan penjelasan konsep virtualisasi, arti perintah Linux, subnetting, atau tips praktikum.
              </p>
            </div>
          </div>

          {/* Quick Questions Chips */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-slate-400 self-center">Pertanyaan Cepat:</span>
            {[
              'Mengapa adapter VMware lebih baik NAT daripada Bridged untuk lab?',
              'Apa perbedaan port 80 (HTTP) dan port 22 (SSH)?',
              'Bagaimana cara agar IP Linux tidak berubah-ubah saat restart?',
              'Apa yang terjadi jika saya salah mengatur subnet mask?',
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => askMentor(q)}
                className="bg-slate-950 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors cursor-pointer text-left"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[340px] max-h-[460px] overflow-y-auto space-y-4">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs leading-relaxed ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-xl max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-cyan-600 text-white font-medium'
                      : 'bg-slate-900 border border-slate-800 text-slate-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className="text-[10px] text-slate-400 block text-right mt-1.5">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isAskingMentor && (
              <div className="flex gap-3 items-center text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>AI Lab Mentor sedang mengetik penjelasan...</span>
              </div>
            )}
          </div>

          {/* Question Input Box */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={mentorQuestion}
              onChange={(e) => setMentorQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askMentor()}
              placeholder="Tanyakan konsep server virtual atau perintah Linux di sini..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              onClick={() => askMentor()}
              disabled={isAskingMentor || !mentorQuestion.trim()}
              className="p-2.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Kirim Pertanyaan"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: QUICK SOLUTION LIBRARY */}
      {activeSubTab === 'quick-guide' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 border border-slate-800 rounded-xl">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'Semua Kategori' },
                { id: 'network', label: 'Jaringan & Ping' },
                { id: 'syntax', label: 'YAML & Syntax' },
                { id: 'permission', label: 'Sudo & Permission' },
                { id: 'service', label: 'Layanan Nginx & SSH' },
                { id: 'vmware', label: 'VMware Adapter' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    categoryFilter === c.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari solusi masalah..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {filteredGuides.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-cyan-400 uppercase font-semibold">
                      {item.category} · {item.distro === 'both' ? 'Debian & Ubuntu' : item.distro}
                    </span>
                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                  </div>
                </div>

                <div className="space-y-1 bg-slate-900/60 p-3 rounded-lg border border-slate-850 text-xs">
                  <span className="font-semibold text-rose-400 block mb-1">Gejala Masalah (Symptoms):</span>
                  {item.symptoms.map((sym, sIdx) => (
                    <p key={sIdx} className="text-slate-300 font-mono text-[11px]">
                      • {sym}
                    </p>
                  ))}
                </div>

                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-amber-400">Akar Penyebab:</span> {item.cause}
                </div>

                <div className="text-xs text-slate-300 space-y-1 pt-2 border-t border-slate-850">
                  <span className="font-semibold text-emerald-400 block mb-1">Langkah Solusi Terverifikasi:</span>
                  {item.solutionSteps.map((step, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {step}
                    </p>
                  ))}
                </div>

                {item.quickFixCommand && (
                  <div className="pt-2 flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px]">Perintah Solusi:</span>
                      <code className="text-cyan-300 font-semibold">{item.quickFixCommand}</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(item.id, item.quickFixCommand!)}
                        className="text-slate-400 hover:text-white cursor-pointer"
                        title="Salin"
                      >
                        {copiedKey === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      {onExecuteCommandInTerminal && (
                        <button
                          onClick={() => onExecuteCommandInTerminal(item.quickFixCommand!)}
                          className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                        >
                          Eksekusi
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
