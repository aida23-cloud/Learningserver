# Virtual Server Lab & AI Learning Studio (Debian & Ubuntu)

Platform edukasi interaktif berbasis web untuk pemula dalam membangun dan mengelola server virtual (VMware Workstation/ESXi) dengan sistem operasi Debian dan Ubuntu Server, dilengkapi simulasi terminal interaktif, topologi jaringan visual, panduan langkah demi langkah, komparasi sintaks antar-distro, modul troubleshooting, serta asisten AI Tutor & Error Diagnostik cerdas.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Ringkasan preferensi pembelajaran yang telah dikonfirmasi pada tahap klarifikasi:

- **Fitur Praktik Interaktif Utama**: Simulator terminal interaktif dan panduan lab bertahap (step-by-step guided lab) dengan verifikasi output langsung di browser.
- **Peran AI**: Tutor AI personal interaktif dan pemeriksa/pendeteksi error konfigurasi sistem Linux & jaringan (analisis error log, syntax checker, panduan perbaikan yang ramah pemula).
- **Distribusi Linux**: Pembahasan seimbang antara Debian Server dan Ubuntu Server dengan fitur perbandingan langsung (side-by-side syntax comparison, e.g., Netplan di Ubuntu vs `/etc/network/interfaces` di Debian, paket Apache/Nginx, SSH, firewall UFW vs iptables/nftables).

---

## 1. Overview & Core Concept

- **Apa Layanan Ini**: Platform laboratorium virtual interaktif yang memandu siswa, teknisi pemula, dan staf TI skala kecil dari nol: mulai dari persiapan hardware & virtualisasi (VMware Workstation / VirtualBox), konfigurasi adapter jaringan virtual (Host-Only, NAT, Bridged), instalasi OS Linux (Debian & Ubuntu Server), setup layanan server penting (DHCP, DNS, Web Server Nginx/Apache, SSH, Firewall), hingga pengujian konektivitas end-to-end dari komputer Client (Windows/Linux) ke Server.
- **Target Pengguna**: Pemula tingkat dasar (siswa SMK Jurusan TKJ/SIJA, mahasiswa informatika, staf administrasi sistem pemula) yang membutuhkan penjelasan teknis tanpa jargon yang membingungkan, disertai istilah analogi yang mudah dicerna.
- **Nilai Utama**:
  1. *Hands-on Safe Simulation*: Berlatih mengeksekusi perintah CLI Linux di simulator terminal web tanpa takut merusak sistem operasi asli.
  2. *Dual-Distro Comparison*: Mengerti kapan menggunakan Debian vs Ubuntu dan perbedaan sintaks konfigurasi jaringan & package management.
  3. *AI Personal Tutor & Diagnostic*: Jika pengguna menemui error saat praktik mandiri di lab nyata atau di simulator, mereka dapat menempelkan pesan error atau menanyakan konsep ke AI untuk mendapatkan diagnosis dan solusi konkret seketika.
  4. *Visual Topology Sandbox*: Peta skema topologi interaktif yang memperlihatkan segmentasi IP Address, subnet mask, gateway, DNS, dan alur paket pengujian ping/curl client-server.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Jalur Belajar Bertahap (Guided Learning Track)**:
   - *Fase 1: Konsep & Persiapan*: Pemilihan spesifikasi VM (CPU, RAM, Disk) dan konsep virtualisasi VMware.
   - *Fase 2: Instalasi Jaringan & Topologi*: Pilihan mode jaringan VMware (Bridged vs NAT vs Host-Only), perencanaan skema IP skala kecil (e.g. `192.168.10.0/24`).
   - *Fase 3: Instalasi OS & Konfigurasi Dasar*: Langkah instalasi minimal Debian & Ubuntu, pembuatan user sudo, konfigurasi repositori apt.
   - *Fase 4: Konfigurasi Layanan Server*: IP Statis (Netplan vs ifupdown), SSH Server aman, Web Server (Nginx), dan pengamanan dasar (UFW).
   - *Fase 5: Testing Jaringan Client-Server*: Uji Ping, Traceroute, Telnet/NC port test, Curl HTTP, dan verifikasi firewall dari sudut pandang Client.
2. **Terminal Simulator & Command Sandbox**:
   - Konsol terminal Linux interaktif dengan dukungan autocompletion tab, history perintah, dan output realistis untuk perintah penting (`ip addr`, `nano`, `systemctl`, `ping`, `ufw status`, `cat /etc/netplan/*`).
   - Tombol "Verifikasi Langkah" yang memeriksa apakah pengguna telah memasukkan perintah yang benar sebelum melangkah ke tahap berikutnya.
3. **Papan Perbandingan Distro (Debian vs Ubuntu)**:
   - Tab komparasi instan: Perbedaan file konfigurasi network, repositori PPA, tool firewall, dan siklus update.
4. **Interactive Network Topology Explorer**:
   - Diagram topologi interaktif: Komputer Client (`192.168.10.50`), Virtual Switch (VMnet), dan Virtual Server (`192.168.10.10`).
   - Simulator alur pengujian: Klik "Test Ping" atau "Test HTTP Service" untuk melihat animasi transmisi paket data dan respons terminal client.
5. **Pusat Troubleshooting & AI Diagnostic Desk**:
   - Katalog solusi cepat masalah umum (Network unreachable, Permission denied, Service failed to start, Port 80 connection refused, SSH connection timed out).
   - Kotak "Analisis Error AI": Siswa dapat menempelkan error log atau pesan error VMware/Linux untuk dianalisis oleh AI dengan penjelasan bahasa sederhana dan solusi langkah demi langkah.
   - Fitur tanya jawab "AI Lab Mentor" yang siap menjawab pertanyaan seputar materi lab secara real-time.

### Visual Identity & Theme

- **Aesthetic Direction**: *Utilitarian Lab & Modern Systems Engineering* — bersih, terstruktur, fokus pada keterbacaan instruksi teknis dan kejelasan visual diagram arsitektur.
- **Color Palette & Discipline (60-30-10)**:
  - *60% Dominant Neutral*: Slate canvas gelap untuk simulator terminal (`#0B0F17`) dan panel latar belakang slate modern (`#0F172A` / `#1E293B`) yang nyaman untuk sesi membaca panjang.
  - *30% Structural Surfaces*: Panel kartu bersudut rapi dengan border halus (`border-slate-800`), teks primer (`#F8FAFC`), dan teks sekunder bersih (`#94A3B8`).
  - *10% Semantic Focal Accents*:
    - Ubuntu Accent: Warm Amber/Orange (`#EA580C` / `#F97316`)
    - Debian Accent: Crimson Rose (`#E11D48` / `#F43F5E`)
    - Network Link / Success: Emerald Teal (`#10B981`)
    - Terminal Prompt & Interactive: Electric Cyan (`#06B6D4` / `#38BDF8`)
- **Typography & Hierarchy**:
  - Headings: `Plus Jakarta Sans` / font sans-serif modern dengan visual hierarchy tegas.
  - Body Text: `Plus Jakarta Sans` dengan ukuran proporsional (15–16px, line-height seimbang).
  - Terminal & Config Files: `JetBrains Mono` / `monospace` dengan tabular figures (`font-mono tabular-nums`) untuk sintaks command line dan berkas konfigurasi.
- **Anti-Slop Discipline**:
  - Tidak ada pill badges statis yang menumpuk. Metadata disajikan dengan separator tipis (`·`).
  - Tidak ada komentar sintaks palsu di judul (`// 01 ARCHITECTURE` dilarang).
  - Tidak ada status dot yang berkedip tanpa fungsi nyata.
  - Semua tombol memiliki event handler fungsional (bukan stub dummy).

---

## 3. Key Product Decisions & Trade-Offs

- **Simulasi Terminal Web vs Mesin Eksekusi Nyata**:
  - *Keputusan*: Mengimplementasikan simulator terminal Linux virtual client-side yang responsif dengan emulasi command set Debian & Ubuntu (`ip`, `systemctl`, `cat`, `nano`, `ping`, `ufw`, `curl`, `apt`, `service`) dikombinasikan dengan backend Gemini 3.8 Flash untuk pertanyaan terbuka dan analisis error.
  - *Alasan*: Menjamin aplikasi instan dimuat dalam hitungan milidetik tanpa memerlukan server backend berat atau risiko keamanan eksekusi perintah shell berbahaya, sementara tetap memberikan pengalaman belajar langsung yang sangat realistis bagi pemula.
- **AI Integration via Server-Side Proxy**:
  - *Keputusan*: Membuat rute Express server `/api/ai/tutor` dan `/api/ai/troubleshoot` menggunakan `@google/genai` dengan model `gemini-3.8-flash`.
  - *Alasan*: Menjaga API key tetap aman di server side sesuai instruksi arsitektur, dengan prompt system yang diatur khusus untuk bahasa Indonesia yang ramah pemula SMK/mahasiswa tingkat awal.
- **Struktur Materi Terbuka & Modular**:
  - *Keputusan*: Materi dibagi ke dalam 6 modul utama dengan navigasi bebas dan indikator kemajuan (progress tracker) yang disimpan di local state/storage.
  - *Alasan*: Pengguna bisa langsung melompat ke bagian yang mereka butuhkan (misalnya hanya ingin troubleshooting koneksi client-server atau hanya ingin melihat konfigurasi Netplan vs Debian).

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AI Studio Web Applet Client                     │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Top Bar: Brand, 4 Single-line Nav Links, Lab Progress Tracker  │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                │                                       │
│   ┌────────────────────────────┴───────────────────────────────────┐   │
│   │                        Navigation Tabs                         │   │
│   │  [1. Modul Panduan]  [2. Simulator Terminal]  [3. Topologi]    │   │
│   │  [4. Komparasi Distro]  [5. Troubleshooting & AI Diagnostik]   │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                │                                       │
│   ┌────────────────────────────┼───────────────────────────────────┐   │
│   ▼                            ▼                                   ▼   │
│ ┌───────────────┐      ┌───────────────┐               ┌─────────────┐ │
│ │ Step-by-Step  │      │ Interactive   │               │ Visual      │ │
│ │ Lab Modules   │      │ Terminal CLI  │               │ Network     │ │
│ │ & Checkpoints │      │ Simulation    │               │ Topology    │ │
│ └───────────────┘      └───────────────┘               └─────────────┘ │
│                                │                                       │
│                                ▼                                       │
│                        ┌───────────────┐                               │
│                        │ AI Tutor &    │                               │
│                        │ Error Fixer   │                               │
│                        └───────┬───────┘                               │
│                                │ fetch POST                            │
└────────────────────────────────┼───────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Express Server (server.ts)                        │
│                                                                        │
│   ┌────────────────────────────┴───────────────────────────────────┐   │
│   │   Endpoints:                                                   │   │
│   │   • POST /api/ai/tutor (Tanya jawab materi & konsep Linux)     │   │
│   │   • POST /api/ai/troubleshoot (Analisis pesan error sistem/VM) │   │
│   │   • Vite Dev/Static middleware                                 │   │
│   └────────────────────────────┬───────────────────────────────────┘   │
│                                │                                       │
│                                ▼                                       │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │   GoogleGenAI SDK (model: gemini-3.8-flash)                    │   │
│   │   Headers: User-Agent 'aistudio-build'                         │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State Architecture

- **`LabModule`**:
  - `id`: string
  - `title`: string (e.g. "Persiapan & Virtualisasi VMware", "Konfigurasi Jaringan Linux", "Instalasi Layanan Web & SSH", "Testing Jaringan Client-Server")
  - `distro`: `'debian' | 'ubuntu' | 'both'`
  - `steps`: array of `LabStep` (`instruction`, `command`, `expectedOutput`, `tips`, `explanation`)
- **`TopologyNode`**:
  - Virtual Server (Debian/Ubuntu: IP `192.168.10.10/24`, Gateway, Active Services)
  - Virtual Switch (VMnet8 / VMnet1: Subnet `192.168.10.0/24`)
  - Client PC (Windows/Linux Client: IP `192.168.10.50/24`)
  - Interactive Ping / HTTP probe state machine
- **`TerminalHistory`**:
  - Riwayat input dan output dengan respons realistis untuk command Ubuntu/Debian
- **`AITroubleshootSession`**:
  - Riwayat dialog tanya jawab error dan diagnosa solusi

### Komponen Utama yang Akan Dibangun

1. **`Navbar`**: Menampilkan nama aplikasi "VirtualServer Lab AI", navigasi modul ringkas, indikator progress selesai, dan tombol switch mode praktis.
2. **`ModuleViewer`**: Modul pembelajaran komprehensif langkah-demi-langkah dengan tab perbandingan sintaks Debian vs Ubuntu, tips pemula, dan tombol "Kirim ke Terminal".
3. **`InteractiveTerminal`**: Simulator CLI Linux dengan prompt berwarna (`user@debian-server:~$` / `user@ubuntu-server:~$`), dukungan autocompletion, riwayat panah atas/bawah, dan respon dinamis.
4. **`NetworkTopologyViewer`**: Kanvas visual skema jaringan interaktif yang menampilkan adapter VMware, IP address, subnet, gateway, dan simulasi paket data interaktif saat pengujian client-ke-server.
5. **`DistroComparisonTable`**: Papan perbandingan terstruktur antara Debian Server dan Ubuntu Server untuk pemula (Netplan vs ifupdown, APT repo, UFW vs nftables, stabilitas vs fitur terbaru).
6. **`TroubleshootingCenter`**:
   - Pustaka solusi cepat error umum di VM dan Linux
   - Interactive Error Analyzer (paste error log -> dapatkan solusi dari AI)
   - Chat Tutor AI untuk tanya konsep dan bantuan langsung.
7. **`Server & Backend Proxy`**: Setup Express server dengan endpoint `/api/ai/tutor` dan `/api/ai/troubleshoot` yang mengintegrasikan `@google/genai` dengan model `gemini-3.8-flash`.
