import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: AI Tutor for Linux Server & Networking Concepts
app.post('/api/ai/tutor', async (req, res) => {
  try {
    const { question, context, distro } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Pertanyaan tidak boleh kosong.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Layanan AI belum terhubung dengan API key. Silakan pastikan GEMINI_API_KEY tersedia di konfigurasi.',
      });
    }

    const systemInstruction = `Anda adalah "AI Lab Mentor" yang ramah, sabar, dan terstruktur untuk siswa pemula SMK dan teknisi TI junior di Indonesia.
Topik spesialisasi Anda: Membangun server virtual (VMware Workstation/ESXi/VirtualBox), Jaringan komputer (Bridged, NAT, Host-Only, Subnetting, IP statis, gateway, DNS), Administrasi Linux (Debian & Ubuntu Server), Konfigurasi layanan (SSH, Nginx/Apache Web Server, DHCP, UFW Firewall), dan Pengujian Client ke Server (Ping, Curl, Nmap, Telnet).

Pedoman Jawaban:
1. Gunakan bahasa Indonesia yang mudah dipahami, ringkas, santun, dan hindari istilah teknis rumit tanpa penjelasan sederhana/analogi.
2. Jika ada perbedaan antara Debian dan Ubuntu, jelaskan secara eksplisit perbedaan sintaksnya (misal: Netplan YAML di Ubuntu vs /etc/network/interfaces di Debian).
3. Sertakan contoh perintah CLI dalam format rapi yang siap dicoba di terminal.
4. Berikan tips keamanan atau best practice praktis untuk skala kecil.`;

    const prompt = `Distribusi Linux yang sedang dipelajari: ${distro || 'Debian & Ubuntu'}.
Konteks materi/lab saat ini: ${context || 'Laboratorium Server Virtual TI'}.
Pertanyaan pengguna:
"${question}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in /api/ai/tutor:', error);
    return res.status(500).json({
      error: error?.message || 'Terjadi kesalahan saat memproses jawaban AI tutor.',
    });
  }
});

// API: AI Troubleshooting & Error Diagnostics
app.post('/api/ai/troubleshoot', async (req, res) => {
  try {
    const { errorText, distro, context, service } = req.body;
    if (!errorText) {
      return res.status(400).json({ error: 'Pesan error tidak boleh kosong.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Layanan AI belum terhubung dengan API key. Silakan pastikan GEMINI_API_KEY tersedia di konfigurasi.',
      });
    }

    const systemInstruction = `Anda adalah "Linux & Network Troubleshooting Specialist" untuk pemula.
Tugas Anda mendiagnosis pesan error, log kesalahan, atau kegagalan koneksi di Linux Debian/Ubuntu dan VMware.
Format respons Anda WAJIB terstruktur rapi:
1. 🔍 **Penyebab Masalah (Root Cause)**: Penjelasan 1-2 kalimat mengapa error ini terjadi dalam bahasa manusia yang ramah pemula.
2. 🛠️ **Solusi Langkah Demi Langkah**: Perintah CLI konkret dan langkah perbaikan yang tepat sasaran.
3. 💡 **Langkah Pencegahan & Verifikasi**: Cara mengetes apakah masalah sudah teratasi (misal: systemctl status, ip a, ping, journalctl).
Bedakan jelas perintah untuk Debian atau Ubuntu jika ada perbedaan.`;

    const prompt = `Distro: ${distro || 'Debian / Ubuntu'}
Layanan/Komponen: ${service || 'Jaringan / VM / Server'}
Konteks Praktik: ${context || 'Setup Lab Server Virtual'}
Pesan Error / Gejala Masalah:
\`\`\`
${errorText}
\`\`\``;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    return res.json({ diagnosis: response.text });
  } catch (error: any) {
    console.error('Error in /api/ai/troubleshoot:', error);
    return res.status(500).json({
      error: error?.message || 'Terjadi kegagalan saat menganalisis error.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
