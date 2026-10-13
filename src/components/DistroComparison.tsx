import React, { useState } from 'react';
import { Layers, Search, Check, Copy, ArrowRight, HelpCircle } from 'lucide-react';
import { DISTRO_COMPARISONS } from '../data/distroComparison';

export const DistroComparison: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredItems = DISTRO_COMPARISONS.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.feature.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.ubuntu.title.toLowerCase().includes(q) ||
      item.debian.title.toLowerCase().includes(q) ||
      item.keyTakeaway.toLowerCase().includes(q)
    );
  });

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Komparasi Langsung: Debian Server vs Ubuntu Server
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Panduan pemula untuk memahami perbedaan arsitektur, sintaks konfigurasi jaringan, dan perilaku sistem antara kedua distro Linux terpopuler.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari fitur, Netplan, sudo..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Quick Decision Helper */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-500/30">
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <span>Ubuntu Server: Terbaik untuk Pemula & Cloud</span>
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Direkomendasikan jika Anda ingin kemudahan instalasi, dokumentasi komunitas melimpah, dukungan paket software versi terbaru, dan firewall UFW yang langsung aktif.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-500/30">
            <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
              <span>Debian Server: Terbaik untuk Stabilitas Ekstrem</span>
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Direkomendasikan jika Anda membutuhkan server yang sangat hemat RAM (ringan), minim bug, dan tidak pernah memerlukan reboot berkala untuk infrastruktur TI permanen.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="space-y-6">
        {filteredItems.map((item, idx) => (
          <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            {/* Row Category Header */}
            <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-white tracking-wide">{item.feature}</span>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
                {item.category}
              </span>
            </div>

            {/* Side-by-side Distro Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-850">
              {/* Ubuntu Column */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                    Ubuntu Server
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">{item.ubuntu.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.ubuntu.description}</p>

                {item.ubuntu.codeSnippet && (
                  <div className="relative">
                    <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-amber-200 overflow-x-auto border border-slate-800">
                      {item.ubuntu.codeSnippet}
                    </pre>
                    <button
                      onClick={() => handleCopy(`u-${idx}`, item.ubuntu.codeSnippet!)}
                      className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white bg-slate-800/80 rounded transition-colors cursor-pointer"
                      title="Salin sintaks"
                    >
                      {copiedKey === `u-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Debian Column */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
                    Debian Server
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">{item.debian.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.debian.description}</p>

                {item.debian.codeSnippet && (
                  <div className="relative">
                    <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-rose-200 overflow-x-auto border border-slate-800">
                      {item.debian.codeSnippet}
                    </pre>
                    <button
                      onClick={() => handleCopy(`d-${idx}`, item.debian.codeSnippet!)}
                      className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white bg-slate-800/80 rounded transition-colors cursor-pointer"
                      title="Salin sintaks"
                    >
                      {copiedKey === `d-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Key Takeaway Bar */}
            <div className="px-5 py-3 bg-slate-900/60 border-t border-slate-850 flex items-start gap-2 text-xs text-slate-400">
              <span className="font-semibold text-cyan-400 shrink-0">Kesimpulan Praktis:</span>
              <span className="leading-relaxed">{item.keyTakeaway}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
