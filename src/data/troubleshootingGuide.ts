import { TroubleshootingItem } from '../types';

export const TROUBLESHOOTING_GUIDE: TroubleshootingItem[] = [
  {
    id: 'tb-1',
    category: 'network',
    title: 'Destination Host Unreachable / Request Timed Out Saat Ping',
    symptoms: [
      'Komputer Client mengetik "ping 192.168.10.10" dan muncul "Destination Host Unreachable" atau "Request timed out".',
      'Client tidak bisa membuka halaman web server.'
    ],
    cause: 'Client dan Server berada di segmen virtual switch yang berbeda (misal: Server di VMnet8 sedangkan Client di VMnet1), atau adapter VMware Host di Windows ter-disable.',
    distro: 'both',
    solutionSteps: [
      '1. Pastikan kedua VM diatur ke VMnet yang sama (misal VMnet8 - NAT) di VMware VM Settings -> Network Adapter.',
      '2. Di Windows Client, buka "Network Connections" (ncpa.cpl) dan pastikan adapter "VMware Network Adapter VMnet8" dalam status Enabled.',
      '3. Cek apakah IP server aktif dengan perintah "ip a". Jika interface DOWN, hidupkan dengan "sudo ip link set ens33 up".',
      '4. Periksa apakah firewall Windows atau antivirus di Host memblokir paket ICMP.'
    ],
    quickFixCommand: 'sudo ip link set ens33 up && ip a',
    verificationCommand: 'ping -c 3 192.168.10.1'
  },
  {
    id: 'tb-2',
    category: 'syntax',
    title: 'Error Indentasi YAML di Ubuntu Netplan ("Invalid YAML at line ...")',
    symptoms: [
      'Muncul pesan: "Invalid YAML at //etc/netplan/... line X column Y: did not find expected key"',
      'Perintah "sudo netplan apply" gagal dieksekusi.'
    ],
    cause: 'Anda menggunakan tombol TAB untuk merapikan baris, atau jumlah spasi indentasi tidak seragam. Standar YAML hanya menerima spasi murni (biasanya 2 spasi per level hierarki).',
    distro: 'ubuntu',
    solutionSteps: [
      '1. Buka kembali file dengan "sudo nano /etc/netplan/50-cloud-init.yaml".',
      '2. Hapus semua karakter TAB dan gantikan dengan 2 spasi konsisten.',
      '3. Pastikan tanda titik dua (:) selalu diikuti oleh spasi, misal "addresses: [192.168.10.10/24]".',
      '4. Gunakan perintah "sudo netplan try" untuk menguji validitas file konfigurasi dengan aman.'
    ],
    quickFixCommand: 'sudo netplan try',
    verificationCommand: 'sudo netplan apply && ip a show ens33'
  },
  {
    id: 'tb-3',
    category: 'permission',
    title: 'Debian: "bash: sudo: command not found" atau "User is not in sudoers file"',
    symptoms: [
      'Mengetik "sudo apt update" menghasilkan "bash: sudo: command not found".',
      'Atau muncul pesan: "namauser is not in the sudoers file. This incident will be reported."'
    ],
    cause: 'Saat instalasi Debian Anda mengisi password root, sehingga Debian tidak otomatis memasang paket sudo dan tidak memasukkan user biasa ke grup sudoers.',
    distro: 'debian',
    solutionSteps: [
      '1. Masuk ke akun root dengan perintah: su -',
      '2. Masukkan password root yang Anda tentukan saat instalasi.',
      '3. Pasang paket sudo: apt update && apt install -y sudo',
      '4. Masukkan user Anda ke grup sudo: usermod -aG sudo namauser',
      '5. Ketik "exit" lalu logout dan login kembali agar hak akses sudo aktif.'
    ],
    quickFixCommand: 'su - -c "apt install -y sudo && usermod -aG sudo $USER"',
    verificationCommand: 'sudo whoami'
  },
  {
    id: 'tb-4',
    category: 'service',
    title: 'Web Server Error: "Connection Refused on Port 80"',
    symptoms: [
      'Browser client menampilkan "ERR_CONNECTION_REFUSED".',
      'Perintah "curl http://192.168.10.10" menghasilkan "Failed to connect to 192.168.10.10 port 80: Connection refused".'
    ],
    cause: 'Layanan Nginx belum dijalankan (inactive/dead) atau crash akibat kesalahan konfigurasi port.',
    distro: 'both',
    solutionSteps: [
      '1. Cek status Nginx di server dengan: sudo systemctl status nginx',
      '2. Jika status "inactive" atau "failed", jalankan: sudo systemctl start nginx',
      '3. Jika gagal start, cek log kesalahan dengan: sudo nginx -t dan journalctl -u nginx -e',
      '4. Pastikan tidak ada aplikasi web server lain (seperti Apache) yang memperebutkan port 80.'
    ],
    quickFixCommand: 'sudo systemctl start nginx && sudo systemctl enable nginx',
    verificationCommand: 'sudo systemctl status nginx'
  },
  {
    id: 'tb-5',
    category: 'network',
    title: 'Terjebak Firewall: SSH atau Port 80 Tidak Bisa Diakses',
    symptoms: [
      'Ping ke server berhasil, tetapi membuka http://192.168.10.10 di browser loading tanpa henti atau timed out.',
      'Koneksi SSH ke port 22 hang (Operation timed out).'
    ],
    cause: 'UFW Firewall diaktifkan tanpa membuka port 80 (HTTP) atau port 22 (SSH).',
    distro: 'both',
    solutionSteps: [
      '1. Langsung akses konsol fisik/VMware display server.',
      '2. Periksa status firewall dengan: sudo ufw status verbose',
      '3. Tambahkan izin port yang dibutuhkan: sudo ufw allow 80/tcp && sudo ufw allow 22/tcp',
      '4. Muat ulang firewall: sudo ufw reload'
    ],
    quickFixCommand: 'sudo ufw allow 80/tcp && sudo ufw allow 22/tcp && sudo ufw reload',
    verificationCommand: 'sudo ufw status'
  },
  {
    id: 'tb-6',
    category: 'vmware',
    title: 'Nama Interface Berubah (Bukan ens33, Tapi enp0s3 / eth0)',
    symptoms: [
      'Perintah "ip addr show ens33" menghasilkan "Device \"ens33\" does not exist".',
      'Konfigurasi Netplan atau /etc/network/interfaces gagal diterapkan.'
    ],
    cause: 'Penamaan interface jaringan di Linux modern (Predictable Network Interface Names) bergantung pada chipset motherboard virtual dan jenis hypervisor (VMware menggunakan ens33/ens32, VirtualBox menggunakan enp0s3).',
    distro: 'both',
    solutionSteps: [
      '1. Jalankan perintah: ip -br link atau ip a',
      '2. Cari nama interface ethernet selain "lo" (loopback), misalnya "ens32" atau "enp0s3".',
      '3. Buka berkas konfigurasi jaringan Anda dan sesuaikan nama interface dengan yang terdeteksi di langkah 1.'
    ],
    quickFixCommand: 'ip -br link',
    verificationCommand: 'ip addr'
  }
];
