import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, HelpCircle, FileText, Check, Bot, Copy } from 'lucide-react';
import { TerminalOutputItem } from '../types';

interface TerminalSimulatorProps {
  initialCommand?: string;
  onSendToAI?: (errorText: string, context: string) => void;
}

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({
  initialCommand,
  onSendToAI,
}) => {
  const [distro, setDistro] = useState<'ubuntu' | 'debian' | 'client'>('ubuntu');
  const [input, setInput] = useState(initialCommand || '');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Simulated server state
  const [serverState, setServerState] = useState({
    serverIp: '192.168.10.10',
    netplanApplied: true,
    nginxRunning: true,
    sshRunning: true,
    ufwActive: true,
    ufwAllowedPorts: [22, 80],
  });

  const [outputs, setOutputs] = useState<TerminalOutputItem[]>([
    {
      id: 'init-1',
      type: 'info',
      text: 'Selamat datang di Linux Virtual Lab Simulator.\nKetik "help" untuk melihat daftar perintah yang didukung, atau gunakan tombol bantuan di bawah.',
    },
    {
      id: 'init-2',
      type: 'command',
      prompt: 'ubuntu@ubuntu-server:~$ ',
      text: 'ip -brief addr',
    },
    {
      id: 'init-3',
      type: 'output',
      text: 'lo               UNKNOWN        127.0.0.1/8 ::1/128\nens33            UP             192.168.10.10/24 fe80::20c:29ff:feab:cdef/64',
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialCommand) {
      setInput(initialCommand);
      inputRef.current?.focus();
    }
  }, [initialCommand]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputs]);

  const getPrompt = () => {
    if (distro === 'ubuntu') return 'ubuntu@ubuntu-server:~$ ';
    if (distro === 'debian') return 'root@debian-server:~# ';
    return 'client@workstation:~$ ';
  };

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    // Add to history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const currentPrompt = getPrompt();
    const newOutputs: TerminalOutputItem[] = [
      ...outputs,
      {
        id: `cmd-${Date.now()}`,
        type: 'command',
        prompt: currentPrompt,
        text: trimmed,
      },
    ];

    const lower = trimmed.toLowerCase();

    // 1. CLEAR
    if (lower === 'clear') {
      setOutputs([]);
      setInput('');
      return;
    }

    // 2. HELP
    if (lower === 'help') {
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'info',
        text: `Daftar Perintah Laboratorium yang Didukung:
• ip a / ip addr / ip -br link  : Memeriksa interface dan alamat IP
• sudo netplan apply / try     : Menerapkan konfigurasi IP di Ubuntu
• sudo systemctl restart networking : Menerapkan konfigurasi IP di Debian
• sudo systemctl status nginx  : Memeriksa status Web Server Nginx
• sudo systemctl start/stop nginx : Menyalakan/mematikan Web Server
• sudo ufw status / ufw enable : Memeriksa dan mengelola firewall
• sudo ufw allow 80/tcp        : Membuka port HTTP pada firewall
• ping 192.168.10.10 / 192.168.10.1 : Menguji konektivitas ICMP
• curl -I http://192.168.10.10 : Menguji respon HTTP dari web server
• cat /etc/netplan/*          : Melihat berkas Netplan Ubuntu
• cat /etc/network/interfaces : Melihat berkas konfigurasi Debian
• whoami / uname -a / clear    : Perintah informasi dasar sistem`,
      });
    }

    // 3. IP ADDR / IFCONFIG
    else if (lower.startsWith('ip a') || lower.startsWith('ip addr') || lower === 'ifconfig') {
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 00:0c:29:4a:92:bc brd ff:ff:ff:ff:ff:ff
    altname enp2s1
    inet ${serverState.serverIp}/24 brd 192.168.10.255 scope global ens33
       valid_lft forever preferred_lft forever
    inet6 fe80::20c:29ff:fe4a:92bc/64 scope link
       valid_lft forever preferred_lft forever`,
      });
    } else if (lower.startsWith('ip -br') || lower.startsWith('ip -brief')) {
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `lo               UNKNOWN        127.0.0.1/8 ::1/128\nens33            UP             ${serverState.serverIp}/24 fe80::20c:29ff:fe4a:92bc/64`,
      });
    }

    // 4. NETPLAN (Ubuntu)
    else if (lower.includes('netplan apply')) {
      if (distro === 'debian') {
        newOutputs.push({
          id: `out-${Date.now()}`,
          type: 'error',
          text: 'bash: netplan: command not found (Debian menggunakan /etc/network/interfaces dan ifupdown, bukan Netplan!)',
        });
      } else {
        setServerState((prev) => ({ ...prev, netplanApplied: true, serverIp: '192.168.10.10' }));
        newOutputs.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: '[OK] Netplan configuration applied successfully to systemd-networkd backend.\nInterface ens33 is now configured with IP 192.168.10.10/24.',
        });
      }
    } else if (lower.includes('netplan try')) {
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'success',
        text: 'Configuration accepted by kernel. Reverting in 120 seconds if ENTER is not pressed. Press ENTER to accept.',
      });
    }

    // 5. DEBIAN NETWORKING
    else if (lower.includes('restart networking')) {
      setServerState((prev) => ({ ...prev, serverIp: '192.168.10.10' }));
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'success',
        text: '[OK] networking.service restarted. Subnet 192.168.10.0/24 bound to ens33 successfully.',
      });
    }

    // 6. CAT CONFIG FILES
    else if (lower.includes('cat /etc/netplan') || lower.includes('cat /etc/netplan/')) {
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `# /etc/netplan/50-cloud-init.yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    ens33:
      dhcp4: no
      addresses:
        - 192.168.10.10/24
      routes:
        - to: default
          via: 192.168.10.1
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]`,
      });
    } else if (lower.includes('cat /etc/network/interfaces')) {
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `# /etc/network/interfaces
auto lo
iface lo inet loopback

auto ens33
iface ens33 inet static
    address 192.168.10.10
    netmask 255.255.255.0
    gateway 192.168.10.1
    dns-nameservers 8.8.8.8 1.1.1.1`,
      });
    }

    // 7. SYSTEMCTL NGINX
    else if (lower.includes('systemctl status nginx')) {
      if (serverState.nginxRunning) {
        newOutputs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; preset: enabled)
     Active: active (running) since Mon 2026-10-12 10:14:02 WIB; 2h 45min ago
   Main PID: 1842 (nginx)
      Tasks: 2 (limit: 2328)
     Memory: 6.8M
        CPU: 18ms
     CGroup: /system.slice/nginx.service
             ├─1842 "nginx: master process /usr/sbin/nginx -g daemon on; master_process on;"
             └─1843 "nginx: worker process"

Oct 12 10:14:02 server systemd[1]: Starting nginx.service...
Oct 12 10:14:02 server systemd[1]: Started nginx.service.`,
        });
      } else {
        newOutputs.push({
          id: `out-${Date.now()}`,
          type: 'error',
          text: `● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; preset: enabled)
     Active: inactive (dead) since Mon 2026-10-12 11:00:15 WIB; 5min ago`,
        });
      }
    } else if (lower.includes('systemctl start nginx') || lower.includes('systemctl restart nginx')) {
      setServerState((prev) => ({ ...prev, nginxRunning: true }));
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'success',
        text: '[OK] nginx.service started and listening on 0.0.0.0:80.',
      });
    } else if (lower.includes('systemctl stop nginx')) {
      setServerState((prev) => ({ ...prev, nginxRunning: false }));
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: '[OK] nginx.service stopped.',
      });
    }

    // 8. SSH STATUS
    else if (lower.includes('systemctl status ssh') || lower.includes('systemctl status sshd')) {
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `● ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/usr/lib/systemd/system/ssh.service; enabled; preset: enabled)
     Active: active (running)
   Main PID: 842 (sshd)
     Listening on 0.0.0.0 port 22, [::] port 22.`,
      });
    }

    // 9. UFW FIREWALL
    else if (lower.includes('ufw status')) {
      if (!serverState.ufwActive) {
        newOutputs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: 'Status: inactive',
        });
      } else {
        const rules = serverState.ufwAllowedPorts
          .map((p) => `${p}/tcp                     ALLOW       Anywhere\n${p}/tcp (v6)                ALLOW       Anywhere (v6)`)
          .join('\n');
        newOutputs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Status: active

To                         Action      From
--                         ------      ----
${rules}`,
        });
      }
    } else if (lower.includes('ufw allow 80')) {
      setServerState((prev) => ({
        ...prev,
        ufwAllowedPorts: Array.from(new Set([...prev.ufwAllowedPorts, 80])),
      }));
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'success',
        text: 'Rule added\nRule added (v6)',
      });
    } else if (lower.includes('ufw allow 22')) {
      setServerState((prev) => ({
        ...prev,
        ufwAllowedPorts: Array.from(new Set([...prev.ufwAllowedPorts, 22])),
      }));
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'success',
        text: 'Rule added\nRule added (v6)',
      });
    } else if (lower.includes('ufw enable')) {
      setServerState((prev) => ({ ...prev, ufwActive: true }));
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'success',
        text: 'Command may disrupt existing ssh connections. Proceed with operation (y|n)? y\nFirewall is active and enabled on system startup.',
      });
    } else if (lower.includes('ufw disable')) {
      setServerState((prev) => ({ ...prev, ufwActive: false }));
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: 'Firewall stopped and disabled on system startup.',
      });
    }

    // 10. PING
    else if (lower.startsWith('ping')) {
      const target = lower.split(' ')[1] || '192.168.10.10';
      if (target.includes('192.168.10.10') || target.includes('192.168.10.1') || target.includes('8.8.8.8')) {
        newOutputs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `PING ${target} (${target}) 56(84) bytes of data.
64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.312 ms
64 bytes from ${target}: icmp_seq=2 ttl=64 time=0.284 ms
64 bytes from ${target}: icmp_seq=3 ttl=64 time=0.298 ms
64 bytes from ${target}: icmp_seq=4 ttl=64 time=0.305 ms

--- ${target} ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3072ms
rtt min/avg/max/mdev = 0.284/0.299/0.312/0.010 ms`,
        });
      } else {
        newOutputs.push({
          id: `out-${Date.now()}`,
          type: 'error',
          text: `PING ${target} (${target}) 56(84) bytes of data.
From 192.168.10.50 icmp_seq=1 Destination Host Unreachable
From 192.168.10.50 icmp_seq=2 Destination Host Unreachable
--- ${target} ping statistics ---
4 packets transmitted, 0 received, +2 errors, 100% packet loss`,
        });
      }
    }

    // 11. CURL
    else if (lower.startsWith('curl')) {
      if (!serverState.nginxRunning) {
        newOutputs.push({
          id: `out-${Date.now()}`,
          type: 'error',
          text: 'curl: (7) Failed to connect to 192.168.10.10 port 80: Connection refused (Layanan Nginx sedang mati atau port 80 tidak aktif).',
        });
      } else if (serverState.ufwActive && !serverState.ufwAllowedPorts.includes(80)) {
        newOutputs.push({
          id: `out-${Date.now()}`,
          type: 'error',
          text: 'curl: (28) Failed to connect to 192.168.10.10 port 80 after 3000 ms: Connection timed out (Paket diblokir oleh UFW firewall!).',
        });
      } else {
        if (lower.includes('-i') || lower.includes('-head')) {
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'output',
            text: `HTTP/1.1 200 OK
Server: nginx/1.24.0 (Ubuntu)
Date: Mon, 12 Oct 2026 12:00:00 GMT
Content-Type: text/html
Content-Length: 612
Last-Modified: Mon, 12 Oct 2026 10:00:00 GMT
Connection: keep-alive
ETag: "66f-264"
Accept-Ranges: bytes`,
          });
        } else {
          newOutputs.push({
            id: `out-${Date.now()}`,
            type: 'output',
            text: `<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>
</body>
</html>`,
          });
        }
      }
    }

    // 12. APT COMMANDS
    else if (lower.startsWith('apt') || lower.startsWith('sudo apt')) {
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `Hit:1 http://id.archive.ubuntu.com/ubuntu noble InRelease
Get:2 http://id.archive.ubuntu.com/ubuntu noble-updates InRelease [126 kB]
Get:3 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]
Fetched 252 kB in 1s (210 kB/s)
Reading package lists... Done
Building dependency tree... Done
All packages are up to date.`,
      });
    }

    // 13. BASIC UTILS
    else if (lower === 'whoami') {
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: distro === 'debian' ? 'root' : distro === 'ubuntu' ? 'ubuntu' : 'client',
      });
    } else if (lower === 'hostname') {
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: distro === 'debian' ? 'debian-server' : distro === 'ubuntu' ? 'ubuntu-server' : 'workstation',
      });
    } else if (lower.includes('uname')) {
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: 'Linux lab-server 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
      });
    } else {
      newOutputs.push({
        id: `out-${Date.now()}`,
        type: 'error',
        text: `bash: ${trimmed.split(' ')[0]}: command not found (Ketik "help" untuk panduan perintah yang tersedia di simulator).`,
      });
    }

    setOutputs(newOutputs);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // basic autocompletion
      const commonCmds = [
        'ip addr',
        'ip -brief addr',
        'sudo netplan apply',
        'sudo systemctl restart networking',
        'sudo systemctl status nginx',
        'sudo systemctl restart nginx',
        'sudo ufw status',
        'sudo ufw allow 80/tcp',
        'sudo ufw allow 22/tcp',
        'sudo ufw enable',
        'ping 192.168.10.10',
        'curl -I http://192.168.10.10',
        'cat /etc/netplan/50-cloud-init.yaml',
        'cat /etc/network/interfaces',
        'clear',
        'help',
      ];
      const match = commonCmds.find((c) => c.startsWith(input));
      if (match) setInput(match);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Find last error if any for quick AI analysis
  const lastError = [...outputs].reverse().find((o) => o.type === 'error');

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="h-4 w-px bg-slate-700 mx-1" />
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Bash Shell Emulator</span>
          </div>
        </div>

        {/* Machine Distro Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setDistro('ubuntu')}
            className={`px-2.5 py-1 rounded transition-colors ${
              distro === 'ubuntu'
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ubuntu Server
          </button>
          <button
            onClick={() => setDistro('debian')}
            className={`px-2.5 py-1 rounded transition-colors ${
              distro === 'debian'
                ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Debian Server
          </button>
          <button
            onClick={() => setDistro('client')}
            className={`px-2.5 py-1 rounded transition-colors ${
              distro === 'client'
                ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Client PC
          </button>
        </div>

        {/* Clear & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOutputs([])}
            title="Bersihkan Terminal (clear)"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Screen Body */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex-1 p-4 overflow-y-auto font-mono text-sm leading-relaxed space-y-2 select-text bg-slate-950/90"
        style={{ minHeight: '380px', maxHeight: '520px' }}
      >
        {outputs.map((item) => (
          <div key={item.id} className="group relative">
            {item.type === 'command' && (
              <div className="flex items-baseline gap-2 text-slate-200">
                <span className="text-emerald-400 select-none shrink-0 font-semibold">
                  {item.prompt}
                </span>
                <span className="text-white font-medium break-all">{item.text}</span>
              </div>
            )}

            {item.type === 'output' && (
              <pre className="text-slate-300 whitespace-pre-wrap break-all pl-2 font-mono text-xs sm:text-sm">
                {item.text}
              </pre>
            )}

            {item.type === 'error' && (
              <pre className="text-rose-400 whitespace-pre-wrap break-all pl-2 bg-rose-950/20 border-l-2 border-rose-500 py-1 font-mono text-xs sm:text-sm">
                {item.text}
              </pre>
            )}

            {item.type === 'success' && (
              <pre className="text-emerald-400 whitespace-pre-wrap break-all pl-2 bg-emerald-950/20 border-l-2 border-emerald-500 py-1 font-mono text-xs sm:text-sm">
                {item.text}
              </pre>
            )}

            {item.type === 'info' && (
              <pre className="text-cyan-300 whitespace-pre-wrap break-all pl-2 bg-cyan-950/20 border-l-2 border-cyan-500 py-1 font-mono text-xs sm:text-sm">
                {item.text}
              </pre>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(item.id, item.text);
              }}
              className="absolute right-1 top-0 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-200 bg-slate-800 rounded transition-opacity"
              title="Salin output"
            >
              {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        ))}

        {/* Active Command Input Line */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-emerald-400 select-none shrink-0 font-semibold">
            {getPrompt()}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Ketik perintah Linux (misal: "ip a", "netplan apply", "help")...'
            className="flex-1 bg-transparent text-white font-mono outline-none border-none focus:ring-0 p-0 text-sm"
            autoFocus
            spellCheck={false}
          />
        </div>

        <div ref={terminalEndRef} />
      </div>

      {/* Quick Interactive Command Bar */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 text-xs hidden sm:inline">Perintah Cepat:</span>
          <button
            onClick={() => executeCommand('ip a')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono transition-colors cursor-pointer"
          >
            ip a
          </button>
          {distro === 'ubuntu' ? (
            <button
              onClick={() => executeCommand('sudo netplan apply')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded font-mono transition-colors cursor-pointer"
            >
              netplan apply
            </button>
          ) : distro === 'debian' ? (
            <button
              onClick={() => executeCommand('sudo systemctl restart networking')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded font-mono transition-colors cursor-pointer"
            >
              restart networking
            </button>
          ) : null}
          <button
            onClick={() => executeCommand('sudo systemctl status nginx')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono transition-colors cursor-pointer"
          >
            status nginx
          </button>
          <button
            onClick={() => executeCommand('sudo ufw status')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono transition-colors cursor-pointer"
          >
            ufw status
          </button>
          <button
            onClick={() => executeCommand('ping -c 4 192.168.10.10')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono transition-colors cursor-pointer"
          >
            ping server
          </button>
          <button
            onClick={() => executeCommand('curl -I http://192.168.10.10')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono transition-colors cursor-pointer"
          >
            curl HTTP
          </button>
        </div>

        {/* AI Troubleshoot Quick Button if error occurred */}
        {lastError && onSendToAI && (
          <button
            onClick={() => onSendToAI(lastError.text, `Simulator terminal (${distro})`)}
            className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded font-medium transition-colors cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Minta Solusi AI untuk Error Ini</span>
          </button>
        )}
      </div>
    </div>
  );
};
