import React, { useState } from 'react';
import { Network, Laptop, Server, Router, Shield, Activity, CheckCircle, XCircle, ArrowRight, Info, Play } from 'lucide-react';

interface NodeDetail {
  id: string;
  name: string;
  type: 'client' | 'switch' | 'server' | 'gateway';
  ip: string;
  netmask: string;
  gateway?: string;
  mac: string;
  role: string;
  activePorts?: string[];
  description: string;
}

export const TopologyCanvas: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('server');
  const [activeSimulation, setActiveSimulation] = useState<'none' | 'ping' | 'http' | 'firewall-block'>('none');
  const [simStep, setSimStep] = useState<number>(0);
  const [isFirewallBlockingPort80, setIsFirewallBlockingPort80] = useState<boolean>(false);

  const nodes: Record<string, NodeDetail> = {
    client: {
      id: 'client',
      name: 'Client PC (Windows / Linux Host)',
      type: 'client',
      ip: '192.168.10.50',
      netmask: '255.255.255.0 (/24)',
      gateway: '192.168.10.1',
      mac: '00:50:56:C0:00:08',
      role: 'Komputer Penguji & Administrator',
      activePorts: ['Port Dinamis (e.g. 54321)', 'ICMP Echo Client'],
      description: 'Komputer kerja tempat Anda membuka web browser atau PuTTY SSH untuk mengakses server secara remote melalui adapter virtual VMware VMnet8.',
    },
    switch: {
      id: 'switch',
      name: 'VMware Virtual Switch (VMnet8)',
      type: 'switch',
      ip: '192.168.10.0 (Network ID)',
      netmask: '255.255.255.0 (/24)',
      mac: 'VMware Virtual Bridge Hub',
      role: 'Virtual Layer 2 Switch',
      description: 'Switch virtual internal yang menghubungkan antarmuka jaringan fisik Host dengan kartu jaringan virtual (vNIC) dari VM Debian/Ubuntu.',
    },
    server: {
      id: 'server',
      name: 'Linux Virtual Server (Debian / Ubuntu)',
      type: 'server',
      ip: '192.168.10.10 (Statis)',
      netmask: '255.255.255.0 (/24)',
      gateway: '192.168.10.1',
      mac: '00:0C:29:4A:92:BC',
      role: 'Server Layanan TI Utama',
      activePorts: ['Port 22/tcp (OpenSSH Server)', 'Port 80/tcp (Nginx Web Server)'],
      description: 'Mesin virtual Linux headless yang diinstal pada VMware. Berfungsi melayani permintaan halaman web internal dan akses remote command-line.',
    },
    gateway: {
      id: 'gateway',
      name: 'Virtual NAT Gateway / Router',
      type: 'gateway',
      ip: '192.168.10.1 / 192.168.10.2',
      netmask: '255.255.255.0 (/24)',
      mac: '00:50:56:E8:4A:92',
      role: 'Default Gateway & DNS Forwarder',
      description: 'Pintu gerbang yang menjembatani paket data laboratorium internal ke jaringan internet luar untuk proses update paket apt repository.',
    },
  };

  const runSimulation = (type: 'ping' | 'http' | 'firewall-block') => {
    setActiveSimulation(type);
    setSimStep(1);

    setTimeout(() => setSimStep(2), 700);
    setTimeout(() => setSimStep(3), 1400);
    setTimeout(() => setSimStep(4), 2100);
    setTimeout(() => {
      setSimStep(5);
    }, 2800);
  };

  const selectedNode = nodes[selectedNodeId] || nodes.server;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-400" />
              Skema Topologi Jaringan Lab Virtual Server
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Topologi segmentasi Subnet <span className="font-mono text-cyan-300">192.168.10.0/24</span> berbasis adapter VMware Workstation (VMnet8).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => runSimulation('ping')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Simulasi Ping (ICMP)</span>
            </button>
            <button
              onClick={() => runSimulation(isFirewallBlockingPort80 ? 'firewall-block' : 'http')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Simulasi Web HTTP (:80)</span>
            </button>
            <button
              onClick={() => setIsFirewallBlockingPort80(!isFirewallBlockingPort80)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                isFirewallBlockingPort80
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isFirewallBlockingPort80 ? 'UFW: Port 80 DIBLOKIR' : 'UFW: Port 80 DIIZINKAN'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Topology Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-500 flex items-center justify-between pb-4 border-b border-slate-850">
            <span>SUBNET: 192.168.10.0/24 (MASK: 255.255.255.0)</span>
            <span>SWITCH: VMware VMnet8 NAT Hub</span>
          </div>

          {/* Topology Canvas Schematic */}
          <div className="py-10 px-4 relative flex flex-col md:flex-row items-center justify-between gap-8 my-auto">
            {/* 1. Client Node */}
            <div
              onClick={() => setSelectedNodeId('client')}
              className={`relative z-10 w-full md:w-52 p-4 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                selectedNodeId === 'client'
                  ? 'bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                <Laptop className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-white text-sm">Client PC</h4>
              <p className="text-xs font-mono text-cyan-400 font-semibold mt-1">192.168.10.50</p>
              <span className="text-[11px] text-slate-400 mt-1">Windows / Linux Host</span>

              {activeSimulation !== 'none' && (simStep === 1 || simStep === 5) && (
                <span className="absolute -top-3 px-2 py-0.5 bg-cyan-500 text-slate-950 text-[10px] font-bold rounded-full animate-bounce">
                  {simStep === 1 ? 'Mengirim Request' : 'Paket Diterima'}
                </span>
              )}
            </div>

            {/* Connecting Line 1 */}
            <div className="hidden md:flex flex-col items-center justify-center flex-1 relative">
              <div className="w-full h-0.5 bg-slate-800 relative">
                {activeSimulation !== 'none' && simStep >= 2 && simStep <= 4 && (
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-md transition-all duration-500 ${
                      activeSimulation === 'firewall-block' && simStep === 3
                        ? 'bg-rose-500 shadow-rose-500/50'
                        : 'bg-emerald-400 shadow-emerald-400/50'
                    }`}
                    style={{
                      left: simStep === 2 ? '20%' : simStep === 3 ? '80%' : '50%',
                    }}
                  />
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-2">Virtual Link 1000 Mbps</span>
            </div>

            {/* 2. Virtual Switch / Center Hub */}
            <div
              onClick={() => setSelectedNodeId('switch')}
              className={`relative z-10 p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                selectedNodeId === 'switch'
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2">
                <Network className="w-5 h-5" />
              </div>
              <h5 className="font-semibold text-white text-xs">VMnet8 Switch</h5>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">L2 Virtual Hub</span>
            </div>

            {/* Connecting Line 2 */}
            <div className="hidden md:flex flex-col items-center justify-center flex-1 relative">
              <div className="w-full h-0.5 bg-slate-800" />
              <span className="text-[10px] font-mono text-slate-500 mt-2">vNIC ens33 Link</span>
            </div>

            {/* 3. Virtual Server Node */}
            <div
              onClick={() => setSelectedNodeId('server')}
              className={`relative z-10 w-full md:w-52 p-4 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                selectedNodeId === 'server'
                  ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                <Server className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-white text-sm">Linux Virtual Server</h4>
              <p className="text-xs font-mono text-emerald-400 font-semibold mt-1">192.168.10.10</p>
              <span className="text-[11px] text-slate-400 mt-1">Debian / Ubuntu (Nginx + SSH)</span>

              {/* Firewall Shield Indicator */}
              <div
                className={`mt-2 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border ${
                  isFirewallBlockingPort80
                    ? 'bg-rose-950/50 border-rose-500/40 text-rose-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <Shield className="w-3 h-3 text-cyan-400" />
                <span>UFW {isFirewallBlockingPort80 ? 'Port 80 Blokir' : 'Port 80 Terbuka'}</span>
              </div>

              {activeSimulation !== 'none' && (simStep === 3 || simStep === 4) && (
                <span
                  className={`absolute -top-3 px-2 py-0.5 text-slate-950 text-[10px] font-bold rounded-full animate-pulse ${
                    activeSimulation === 'firewall-block' ? 'bg-rose-400 text-white' : 'bg-emerald-400'
                  }`}
                >
                  {activeSimulation === 'firewall-block' ? 'DROP Paket (:80)' : 'Memproses Respons'}
                </span>
              )}
            </div>
          </div>

          {/* Gateway Subnode Anchor */}
          <div className="mt-4 pt-4 border-t border-slate-850 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={() => setSelectedNodeId('gateway')}
              className="flex items-center gap-2 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <Router className="w-4 h-4 text-amber-400" />
              <span>Default Gateway / Internet Forwarder:</span>
              <span className="font-mono text-slate-300">192.168.10.1</span>
            </button>
            <span className="text-slate-500 text-[11px]">Klik node untuk inspeksi detail konfigurasi</span>
          </div>
        </div>

        {/* Node Inspector Details Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Detail Perangkat
              </span>
              <span className="text-xs font-mono text-cyan-400 font-medium">{selectedNode.type}</span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">{selectedNode.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{selectedNode.description}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">IP Address:</span>
                  <span className="text-cyan-300 font-semibold">{selectedNode.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subnet Mask:</span>
                  <span className="text-slate-300">{selectedNode.netmask}</span>
                </div>
                {selectedNode.gateway && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Default Gateway:</span>
                    <span className="text-slate-300">{selectedNode.gateway}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">MAC / vNIC:</span>
                  <span className="text-slate-300">{selectedNode.mac}</span>
                </div>
              </div>

              {selectedNode.activePorts && (
                <div>
                  <span className="text-xs font-semibold text-slate-300 block mb-2">Layanan & Port Aktif:</span>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    {selectedNode.activePorts.map((port, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-mono text-slate-200">{port}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Simulation Output Box */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-300 block mb-2">Status Simulasi Aktif:</span>
            {activeSimulation === 'none' && (
              <p className="text-xs text-slate-500 italic">
                Klik tombol &quot;Simulasi Ping&quot; atau &quot;Simulasi Web HTTP&quot; di atas untuk menguji alur transmisi paket.
              </p>
            )}

            {activeSimulation === 'ping' && (
              <div className="p-3 bg-slate-950 rounded-lg border border-cyan-500/30 text-xs font-mono space-y-1 text-slate-300">
                <p className="text-cyan-400 font-semibold">ICMP Echo Request (Client ➔ Server):</p>
                <p>• Packet: 64 bytes to 192.168.10.10</p>
                <p className="text-emerald-400">• Reply: bytes=64 ttl=64 time=0.29ms (0% Loss)</p>
                <p className="text-slate-400 text-[11px] pt-1">Status: Konektivitas layer 3 berhasil.</p>
              </div>
            )}

            {activeSimulation === 'http' && (
              <div className="p-3 bg-slate-950 rounded-lg border border-emerald-500/30 text-xs font-mono space-y-1 text-slate-300">
                <p className="text-emerald-400 font-semibold">HTTP GET Request (Port 80):</p>
                <p>• TCP 3-Way Handshake: SYN ➔ SYN-ACK ➔ ACK</p>
                <p>• Request: GET / HTTP/1.1</p>
                <p className="text-cyan-300">• Response: HTTP/1.1 200 OK (Nginx Default Page)</p>
                <p className="text-slate-400 text-[11px] pt-1">Status: Layanan web server sukses diakses client.</p>
              </div>
            )}

            {activeSimulation === 'firewall-block' && (
              <div className="p-3 bg-slate-950 rounded-lg border border-rose-500/30 text-xs font-mono space-y-1 text-rose-300">
                <p className="text-rose-400 font-semibold">HTTP GET Request Terblokir!</p>
                <p className="text-slate-400">• TCP SYN sent to 192.168.10.10:80</p>
                <p className="text-rose-400">• UFW Firewall Rule: Port 80 DROP / REJECT</p>
                <p className="text-slate-400 text-[11px] pt-1">
                  Solusi: Jalankan &quot;sudo ufw allow 80/tcp&quot; di terminal server.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
