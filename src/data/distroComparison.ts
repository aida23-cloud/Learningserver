import { DistroComparisonItem } from '../types';

export const DISTRO_COMPARISONS: DistroComparisonItem[] = [
  {
    feature: 'Konfigurasi Jaringan Statis (Network Stack)',
    category: 'Jaringan & Interface',
    ubuntu: {
      title: 'Netplan (YAML)',
      description: 'Ubuntu menggunakan Netplan yang mengompilasi file YAML ke backend systemd-networkd atau NetworkManager. Berkas berada di /etc/netplan/*.yaml.',
      codeSnippet: `# /etc/netplan/01-netcfg.yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    ens33:
      addresses: [192.168.10.10/24]
      routes:
        - to: default
          via: 192.168.10.1
      nameservers:
        addresses: [8.8.8.8]`
    },
    debian: {
      title: 'ifupdown (/etc/network/interfaces)',
      description: 'Debian menggunakan ifupdown klasik berbasis teks deklaratif sederhana. Sangat stabil dan minim dependensi abstrak.',
      codeSnippet: `# /etc/network/interfaces
auto ens33
iface ens33 inet static
    address 192.168.10.10
    netmask 255.255.255.0
    gateway 192.168.10.1
    dns-nameservers 8.8.8.8`
    },
    keyTakeaway: 'Ubuntu lebih modern untuk cloud-init dan otomasi, tetapi sensitif terhadap indentasi spasi YAML. Debian lebih toleran dan mudah dipahami oleh pemula.'
  },
  {
    feature: 'Penerapan Perubahan Jaringan (Apply Network)',
    category: 'Jaringan & Interface',
    ubuntu: {
      title: 'sudo netplan apply',
      description: 'Menerapkan berkas YAML secara langsung ke backend systemd-networkd tanpa perlu reboot.'
    },
    debian: {
      title: 'sudo systemctl restart networking',
      description: 'Merestart daemon networking sistem, atau menggunakan perintah ifdown ens33 && ifup ens33.'
    },
    keyTakeaway: 'Di Ubuntu jangan restart networking service manual; selalu gunakan "netplan apply" atau "netplan try" untuk tes aman.'
  },
  {
    feature: 'Firewall Default & Kemudahan Konfigurasi',
    category: 'Keamanan & Port',
    ubuntu: {
      title: 'UFW (Uncomplicated Firewall)',
      description: 'Sudah terpasang secara bawaan di Ubuntu Server. Sangat ramah pemula dengan sintaks seperti "sudo ufw allow 80/tcp".',
      codeSnippet: `sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw enable
sudo ufw status`
    },
    debian: {
      title: 'nftables / iptables murni (UFW opsional)',
      description: 'Debian menyertakan nftables secara bawaan. UFW dapat dipasang dengan mudah melalui "sudo apt install ufw".',
      codeSnippet: `sudo apt install ufw
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw enable`
    },
    keyTakeaway: 'Di Debian pemula disarankan langsung menginstal UFW agar memiliki sintaks perintah perlindungan firewall yang sama persis dengan Ubuntu.'
  },
  {
    feature: 'Akun Sudo vs Root User Saat Instalasi',
    category: 'Manajemen User',
    ubuntu: {
      title: 'Root Dinonaktifkan, User Utama = Sudoer',
      description: 'Secara bawaan akun root tidak memiliki password (disabled). Pengguna utama otomatis dimasukkan ke grup sudo.',
      codeSnippet: `sudo usermod -aG sudo namauser`
    },
    debian: {
      title: 'Pilihan Password Root Terpisah',
      description: 'Jika Anda memasukkan password root saat instalasi, akun user biasa TIDAK masuk ke grup sudo dan paket sudo sering belum aktif.',
      codeSnippet: `# Jika terjebak di Debian:
su -
apt install sudo
usermod -aG sudo namauser`
    },
    keyTakeaway: 'Tips emas Debian untuk pemula: Kosongkan kolom password root saat instalasi agar installer otomatis mengaktifkan sudo untuk user biasa.'
  },
  {
    feature: 'Siklus Rilis & Stabilitas Paket Software',
    category: 'Sistem & Pemeliharaan',
    ubuntu: {
      title: 'LTS (Long Term Support) Setiap 2 Tahun',
      description: 'Versi LTS (seperti 22.04 LTS, 24.04 LTS) mendapat dukungan 5 tahun. Menyediakan versi software dan kernel yang lebih baru.',
      codeSnippet: `lsb_release -a`
    },
    debian: {
      title: 'Debian Stable (Konservatif & Rock-Solid)',
      description: 'Siklus rilis sekitar 2-3 tahun sekali. Mengutamakan kestabilan mutlak di atas kebaruan versi software.',
      codeSnippet: `cat /etc/debian_version`
    },
    keyTakeaway: 'Pilih Ubuntu jika Anda membutuhkan versi PHP, Node.js, atau driver kernel terbaru. Pilih Debian jika prioritas Anda adalah server yang tidak pernah crash selama bertahun-tahun.'
  },
  {
    feature: 'Dukungan Repositori & Software Pihak Ketiga',
    category: 'Manajemen Paket',
    ubuntu: {
      title: 'APT + PPA (Personal Package Archive) & Snap',
      description: 'Mendukung penambahan PPA resmi untuk software versi mutakhir serta integrasi Snap.',
      codeSnippet: `sudo add-apt-repository ppa:ondrej/php
sudo apt update`
    },
    debian: {
      title: 'APT Murni (Official + Backports)',
      description: 'Mengandalkan repositori resmi Debian dan Debian Backports. Tidak menggunakan PPA demi menjaga integritas sistem.',
      codeSnippet: `sudo nano /etc/apt/sources.list
sudo apt update`
    },
    keyTakeaway: 'Debian menjamin tidak ada konflik pustaka antar paket, sedangkan Ubuntu menawarkan fleksibilitas software terkini.'
  }
];
