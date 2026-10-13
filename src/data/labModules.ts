import { LabModule } from '../types';

export const LAB_MODULES: LabModule[] = [
  {
    id: 'mod-1',
    moduleNumber: 1,
    title: 'Persiapan & Konsep Virtualisasi Server',
    shortDesc: 'Memahami dasar virtualisasi Type-2 (VMware Workstation), alokasi resource CPU & RAM, serta pembuatan template Virtual Machine.',
    category: 'persiapan',
    estimatedMinutes: 20,
    difficulty: 'Pemula',
    steps: [
      {
        id: 'm1-s1',
        stepNumber: 1,
        title: 'Memahami Konsep Virtualisasi untuk Server TI Skala Kecil',
        distro: 'both',
        description: 'Server fisik biasanya memerlukan biaya tinggi dan konsumsi listrik konstan. Dengan VMware Workstation atau ESXi, kita dapat membagi 1 komputer fisik (Host) menjadi beberapa komputer virtual (Guest) yang berjalan mandiri.',
        conceptNote: 'Analogi Sederhana: Komputer fisik seperti sebuah gedung apartemen. Virtual Machine adalah unit-unit kamar di dalamnya yang memiliki kunci, listrik, dan penghuni (OS) sendiri tanpa saling mengganggu.',
        explanation: 'Untuk server skala kecil (kantor kecil/sekolah), alokasi standar yang disarankan untuk Debian/Ubuntu Server headless (tanpa GUI desktop): CPU: 1-2 vCPU, RAM: 1024 MB - 2048 MB, Disk: 20 GB (Thin Provisioning).'
      },
      {
        id: 'm1-s2',
        stepNumber: 2,
        title: 'Unduh ISO Installer Linux Resmi',
        distro: 'both',
        description: 'Pastikan mengunduh image ISO resmi Netinst (Network Installer) atau Minimal Server untuk efisiensi resource.',
        explanation: 'Debian menggunakan ISO "debian-xx.x.x-amd64-netinst.iso" (~600MB), sedangkan Ubuntu menggunakan "ubuntu-24.04-live-server-amd64.iso" (~2.5GB). Simpan file ISO di folder yang mudah dijangkau di komputer Anda.'
      },
      {
        id: 'm1-s3',
        stepNumber: 3,
        title: 'Pembuatan Virtual Machine di VMware Workstation',
        distro: 'both',
        description: 'Buka VMware Workstation -> File -> New Virtual Machine -> Pilih "Custom (Advanced)" atau "Typical". Masukkan alokasi hardware yang telah dirancang.',
        warningNote: 'Penting: Saat memilih disk provisioning, pilih "Store virtual disk as a single file" dan JANGAN centang "Allocate all disk space now" agar tidak memakan ruang harddisk fisik Anda secara sekaligus.',
        explanation: 'Atur CD/DVD drive virtual untuk membaca file ISO Debian atau Ubuntu yang telah diunduh.'
      }
    ]
  },
  {
    id: 'mod-2',
    moduleNumber: 2,
    title: 'Arsitektur Jaringan Virtual & Topologi Skala Kecil',
    shortDesc: 'Menentukan mode adapter jaringan di VMware (Host-Only vs NAT vs Bridged) dan merancang skema pengalamatan IP statis.',
    category: 'jaringan',
    estimatedMinutes: 25,
    difficulty: 'Pemula',
    steps: [
      {
        id: 'm2-s1',
        stepNumber: 1,
        title: 'Membedakan 3 Mode Jaringan Virtual VMware',
        distro: 'both',
        description: 'VMware menyediakan beberapa virtual switch (VMnet). Memilih jenis adapter yang tepat adalah kunci agar client bisa terhubung ke server.',
        conceptNote: '1. Bridged (VMnet0): VM dianggap seperti komputer fisik baru yang menancap ke switch/router WiFi rumah. IP satu segmen dengan router asli.\n2. NAT (VMnet8): VM berada di jaringan tersembunyi di balik komputer host. VM bisa internetan, host bisa mengakses VM, namun komputer luar tidak bisa.\n3. Host-Only (VMnet1): Jaringan laboratorium privat terisolasi penuh. Hanya host dan VM di dalamnya yang bisa saling berkomunikasi (aman untuk uji coba praktikum).',
        explanation: 'Untuk simulasi lab mandiri yang aman dan stabil tanpa terganggu perubahan WiFi, mode NAT (VMnet8) atau Custom VMnet sangat direkomendasikan.'
      },
      {
        id: 'm2-s2',
        stepNumber: 2,
        title: 'Perancangan Skema IP Address (Topologi Lab)',
        distro: 'both',
        description: 'Buat rencana pengalamatan IP agar Client dan Server berada dalam satu subnet yang sama.',
        conceptNote: 'Subnet Lab: 192.168.10.0/24 (Netmask 255.255.255.0)\n• Gateway / Host Router: 192.168.10.1\n• Virtual Server (Linux): 192.168.10.10 (Statis)\n• Client Computer: 192.168.10.50 (Statis atau DHCP)',
        explanation: 'Karena subnet mask adalah /24, ketiga perangkat memiliki 3 blok angka pertama yang identik (192.168.10.x). Ini syarat wajib agar komunikasi layer 3 dapat terjadi secara langsung.'
      },
      {
        id: 'm2-s3',
        stepNumber: 3,
        title: 'Konfigurasi Virtual Network Editor di VMware',
        distro: 'both',
        description: 'Buka menu Edit -> Virtual Network Editor di VMware. Pastikan subnet IP pada VMnet8 atau adapter yang digunakan diatur ke 192.168.10.0.',
        command: 'Virtual Network Editor -> VMnet8 -> Subnet IP: 192.168.10.0 -> Subnet mask: 255.255.255.0',
        explanation: 'Klik tombol "NAT Settings..." untuk memastikan Gateway IP tercantum sebagai 192.168.10.1 atau 192.168.10.2 sesuai konfigurasi VMware.'
      }
    ]
  },
  {
    id: 'mod-3',
    moduleNumber: 3,
    title: 'Instalasi OS Linux Server (Debian vs Ubuntu)',
    shortDesc: 'Panduan instalasi langkah-demi-langkah, konfigurasi hostname, partisi disk, dan pembuatan akun administrator.',
    category: 'instalasi',
    estimatedMinutes: 30,
    difficulty: 'Pemula',
    steps: [
      {
        id: 'm3-s1',
        stepNumber: 1,
        title: 'Proses Booting & Pemilihan Bahasa',
        distro: 'both',
        description: 'Nyalakan VM, tekan Enter pada menu "Install" (Debian) atau "Try or Install Ubuntu Server" (Ubuntu).',
        explanation: 'Pilih bahasa "English" untuk memudahkan troubleshooting jika terjadi pesan kesalahan di terminal. Pilih layout keyboard standar "English (US)".'
      },
      {
        id: 'm3-s2',
        stepNumber: 2,
        title: 'Partisi Disk (Guided / Default LVM)',
        distro: 'both',
        description: 'Gunakan seluruh disk (Guided - use entire disk). Pada Ubuntu Server, default menggunakan LVM (Logical Volume Manager) yang memudahkan penambahan kapasitas partisi di masa depan.',
        explanation: 'Sistem Linux membutuhkan minimal partisi root ("/") dan swap (opsional jika RAM memadai, namun 1-2GB swap sangat disarankan untuk pencegahan memori penuh).'
      },
      {
        id: 'm3-s3',
        stepNumber: 3,
        title: 'Pembuatan Akun User & Hak Akses Sudo',
        distro: 'debian',
        description: 'Pada Debian, jika Anda mengosongkan password root, maka user biasa yang dibuat otomatis diberikan hak sudo.',
        conceptNote: 'Tips Praktik Pemula: Di Debian, jika Anda mengisi password root, user biasa TIDAK otomatis masuk grup sudo! Lebih baik kosongkan password root saat instalasi agar user Anda langsung menjadi sudoer seperti Ubuntu.',
        explanation: 'Beri nama user misalnya "adminlab" atau "siswa" dengan password yang mudah diingat untuk laboratorium praktik.'
      },
      {
        id: 'm3-s4',
        stepNumber: 4,
        title: 'Seleksi Perangkat Lunak (Software Selection)',
        distro: 'both',
        description: 'Pilih paket dasar yang ingin diinstal saat installer meminta pilihan software.',
        conceptNote: 'Wajib Centang:\n[ * ] SSH server\n[ * ] standard system utilities\n\nHindari mencentang [ ] Desktop Environment (GNOME/XFCE) pada server produksi agar server tetap ringan dan hemat RAM!',
        explanation: 'Memilih hanya utilitas sistem dasar dan server SSH menjaga penggunaan RAM tetap di bawah 250 MB saat server baru menyala.'
      }
    ]
  },
  {
    id: 'mod-4',
    moduleNumber: 4,
    title: 'Konfigurasi Jaringan & IP Statis Server',
    shortDesc: 'Mengatur IP Address permanen (Statis) pada Linux: Netplan YAML (Ubuntu) vs /etc/network/interfaces (Debian).',
    category: 'jaringan',
    estimatedMinutes: 25,
    difficulty: 'Pemula',
    steps: [
      {
        id: 'm4-s1',
        stepNumber: 1,
        title: 'Cek Nama Interface Jaringan yang Aktif',
        distro: 'both',
        description: 'Ketahui nama adapter ethernet virtual Anda (misal: ens33, enp0s3, atau eth0) sebelum mengedit konfigurasi.',
        command: 'ip addr',
        expectedOutput: '2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 ...\n    link/ether 00:0c:29:ab:cd:ef brd ff:ff:ff:ff:ff:ff\n    inet 192.168.10.128/24 ...',
        explanation: 'Perhatikan nomor interface di baris kedua. Di VMware biasanya bernama "ens33". Catat nama ini!'
      },
      {
        id: 'm4-s2',
        stepNumber: 2,
        title: 'Konfigurasi IP Statis di Ubuntu Server (Netplan)',
        distro: 'ubuntu',
        description: 'Ubuntu modern menggunakan Netplan dengan berkas format YAML di folder /etc/netplan/.',
        command: 'sudo nano /etc/netplan/50-cloud-init.yaml',
        configFilePath: '/etc/netplan/50-cloud-init.yaml',
        configFileContent: `network:
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
        warningNote: 'Penting pada YAML: DILARANG menggunakan tombol TAB! Gunakan spasi murni (2 spasi per indentasi). Spasi yang salah akan menyebabkan Netplan error saat apply.',
        explanation: 'Setelah menyimpan file (Ctrl+O lalu Enter, lalu Ctrl+X), terapkan konfigurasi dengan perintah: sudo netplan apply'
      },
      {
        id: 'm4-s3',
        stepNumber: 3,
        title: 'Konfigurasi IP Statis di Debian Server (/etc/network/interfaces)',
        distro: 'debian',
        description: 'Debian secara default menggunakan ifupdown klasik yang dikonfigurasi melalui /etc/network/interfaces.',
        command: 'sudo nano /etc/network/interfaces',
        configFilePath: '/etc/network/interfaces',
        configFileContent: `# Konfigurasi Loopback
auto lo
iface lo inet loopback

# Konfigurasi IP Statis Server
auto ens33
iface ens33 inet static
    address 192.168.10.10
    netmask 255.255.255.0
    gateway 192.168.10.1
    dns-nameservers 8.8.8.8 1.1.1.1`,
        explanation: 'Terapkan konfigurasi di Debian dengan me-restart service networking: sudo systemctl restart networking'
      },
      {
        id: 'm4-s4',
        stepNumber: 4,
        title: 'Verifikasi Penerapan IP Statis',
        distro: 'both',
        description: 'Pastikan interface ens33 kini telah memegang IP statis 192.168.10.10/24.',
        command: 'ip addr show ens33',
        expectedOutput: '2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 ...\n    inet 192.168.10.10/24 brd 192.168.10.255 scope global ens33',
        explanation: 'Jika IP 192.168.10.10 sudah tercantum, konfigurasi layer 3 server Anda telah sukses.'
      }
    ]
  },
  {
    id: 'mod-5',
    moduleNumber: 5,
    title: 'Konfigurasi Layanan Sistem (Web Nginx, SSH & Firewall)',
    shortDesc: 'Menginstal dan menjalankan web server Nginx, mengamankan OpenSSH, serta mengaktifkan firewall UFW.',
    category: 'layanan',
    estimatedMinutes: 30,
    difficulty: 'Menengah',
    steps: [
      {
        id: 'm5-s1',
        stepNumber: 1,
        title: 'Update Repositori & Instal Web Server Nginx',
        distro: 'both',
        description: 'Nginx adalah server HTTP berkinerja tinggi yang sangat efisien untuk server skala kecil.',
        command: 'sudo apt update && sudo apt install -y nginx',
        expectedOutput: 'Setting up nginx (1.24.0) ...\nProcessing triggers for systemd ...',
        explanation: 'Perintah apt update menyegarkan daftar paket software dari server mirror resmi, kemudian mengunduh dan memasang Nginx.'
      },
      {
        id: 'm5-s2',
        stepNumber: 2,
        title: 'Cek Status Layanan Nginx',
        distro: 'both',
        description: 'Pastikan Nginx berjalan (Active: active (running)) dan listen pada port 80.',
        command: 'sudo systemctl status nginx',
        expectedOutput: '● nginx.service - A high performance web server and a reverse proxy server\n     Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; preset: enabled)\n     Active: active (running)',
        explanation: 'Status "active (running)" menandakan server HTTP telah siap melayani permintaan halaman web.'
      },
      {
        id: 'm5-s3',
        stepNumber: 3,
        title: 'Konfigurasi Firewall UFW (Uncomplicated Firewall)',
        distro: 'both',
        description: 'Firewall bertugas membatasi port apa saja yang boleh diakses dari luar. Kita wajib mengizinkan port SSH (22) dan Web (80) sebelum menyalakan firewall.',
        warningNote: 'AWAS! Jangan pernah mengaktifkan UFW sebelum membuka port 22 (SSH), jika tidak Anda akan terkunci dari server!',
        command: 'sudo ufw allow 22/tcp && sudo ufw allow 80/tcp && sudo ufw enable',
        expectedOutput: 'Rule added\nRule added\nFirewall is active and enabled on system startup',
        explanation: 'Periksa status aturan yang aktif dengan mengetikkan: sudo ufw status'
      }
    ]
  },
  {
    id: 'mod-6',
    moduleNumber: 6,
    title: 'Testing Jaringan Komprehensif (Client ke Server)',
    shortDesc: 'Melakukan uji konektivitas ICMP, tes port TCP, permintaan HTTP dari komputer client, serta audit keamanan.',
    category: 'testing',
    estimatedMinutes: 20,
    difficulty: 'Pemula',
    steps: [
      {
        id: 'm6-s1',
        stepNumber: 1,
        title: 'Pengaturan IP Komputer Client',
        distro: 'both',
        description: 'Pastikan komputer Client (misal: Windows host Anda atau VM Client lain) berada pada subnet yang sama.',
        conceptNote: 'Setting Client:\n• IP Address: 192.168.10.50\n• Subnet Mask: 255.255.255.0 (/24)\n• Gateway: 192.168.10.1',
        explanation: 'Di Windows: Buka Control Panel -> Network and Sharing Center -> Change adapter settings -> Klik kanan VMware Network Adapter VMnet8 -> Properties -> IPv4.'
      },
      {
        id: 'm6-s2',
        stepNumber: 2,
        title: 'Uji Konektivitas ICMP (Ping Test)',
        distro: 'both',
        description: 'Buka Command Prompt (CMD) di Windows atau Terminal di Linux Client, lakukan tes ping ke IP server.',
        command: 'ping 192.168.10.10',
        expectedOutput: 'Pinging 192.168.10.10 with 32 bytes of data:\nReply from 192.168.10.10: bytes=32 time<1ms TTL=64\nReply from 192.168.10.10: bytes=32 time<1ms TTL=64\n\nPing statistics for 192.168.10.10:\n    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)',
        explanation: 'Reply dengan time < 1ms dan 0% packet loss membuktikan bahwa kabel virtual, adapter, dan routing layer 3 berfungsi sempurna.'
      },
      {
        id: 'm6-s3',
        stepNumber: 3,
        title: 'Uji Layanan Web HTTP dari Web Browser Client',
        distro: 'both',
        description: 'Buka browser (Google Chrome / Firefox) di komputer Client, lalu ketikkan URL http://192.168.10.10 pada address bar.',
        expectedOutput: 'Welcome to nginx!\nIf you see this page, the nginx web server is successfully installed and working.',
        explanation: 'Munculnya halaman "Welcome to nginx!" membuktikan port 80 terbuka di UFW dan Nginx berhasil melayani request HTTP dari komputer Client.'
      },
      {
        id: 'm6-s4',
        stepNumber: 4,
        title: 'Uji Remote SSH dari Client ke Server',
        distro: 'both',
        description: 'Gunakan aplikasi PuTTY atau terminal Command Prompt / PowerShell untuk login remote ke server.',
        command: 'ssh adminlab@192.168.10.10',
        expectedOutput: 'adminlab@192.168.10.10 password:\nWelcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-xx-generic x86_64)\nadminlab@ubuntu-server:~$',
        explanation: 'Jika berhasil login ke shell prompt server, Anda telah sukses mengelola server virtual secara headless dari komputer client!'
      }
    ]
  }
];
