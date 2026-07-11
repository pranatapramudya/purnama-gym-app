# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.12  
**Status:** Phase 3.12 - Core Features Data Binding (EXCLUDING Payment Gateway)  
**Target Pasar:** Khusus Wanita (Sumedang)  

---

## 1. Direktif Kritis: TUNDA Integrasi Payment Gateway Otomatis
**Keputusan Bisnis:** Menunggu persetujuan manajemen/owner terkait penggunaan pihak ketiga.
**Tugas Agen AI:** 
- **DILARANG KERAS** mengintegrasikan sistem pihak ketiga seperti Midtrans, Xendit, atau Stripe pada fase ini.
- **Alur Pembayaran Saat Ini (Manual Kasir):** Ketika pengguna (Member) memilih "Beli Visit Harian" atau "Perpanjang Paket VIP", sistem hanya perlu membuat data di tabel `Transaction` dengan status `PENDING`. 
- Tampilkan instruksi di UI kepada pengguna: "Silakan lakukan pembayaran melalui QRIS di meja Kasir dan tunjukkan layar ini."
- Status akan diubah menjadi `SUCCESS` secara manual oleh Admin melalui tombol "Verifikasi" di halaman `/admin/transactions` (sesuai instruksi pada PRD sebelumnya).

---

## 2. Prioritas Pengerjaan Saat Ini (Selesaikan yang Tersisa)
Daripada memikirkan Payment Gateway, fokuskan pengerjaan Anda pada penyelesaian 3 pilar fungsionalitas berikut secara berurutan:

**A. Sistem Booking Kelas (`app/member/booking/...`)**
- Pastikan daftar kelas yang ditarik dari database bisa di-klik untuk *booking*.
- Ketika tombol "Daftar" ditekan, jalankan *Server Action* untuk menambahkan pengguna ke kelas tersebut.
- Kurangi sisa kuota/slot kelas secara dinamis. Pastikan validasi *Double-Booking* (tidak boleh daftar kelas yang sama dua kali) sudah berjalan aktif dan memunculkan *Toast Error* jika dilanggar.

**B. Fitur Riwayat Transaksi (`app/member/transactions/...`)**
- Hapus tampilan *Placeholder* / "Halaman Sedang Dibangun".
- Buat *Server Component* yang menarik data `Transaction` riil milik pengguna yang sedang *login* (berdasarkan ID Clerk mereka).
- Tampilkan daftar riwayat tersebut dengan rapi (menampilkan Tanggal, Nama Paket/Visit, Nominal, dan Status: Pending/Success).

**C. Fitur Notifikasi (`app/member/notifications/...`)**
- Hapus tampilan *Placeholder*.
- Hubungkan dengan tabel `Notification` (atau sejenisnya di Prisma). Tampilkan daftar notifikasi riil (seperti pengingat kelas atau promo).
- Jika tabel notifikasi belum ada, buat struktur UI statisnya terlebih dahulu dengan desain *list* modern, namun pastikan UI-nya sudah siap menerima data dinamis (berupa *array of objects*).

---

## 3. Instruksi Eksekusi
Terapkan perbaikan ini secara bertahap. Mulailah dari menyelesaikan **Alur Pembayaran Manual** dan **Sistem Booking Kelas** terlebih dahulu. Pastikan Anda tetap menggunakan Bahasa Indonesia di seluruh elemen UI dan pesan *error*.