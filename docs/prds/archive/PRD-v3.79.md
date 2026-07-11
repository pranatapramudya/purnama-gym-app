# PRD-v3.79.md
**Status:** Phase 3.79 - VIP-Only Offline Registration & Dropdown Cleanup
**TUGAS ANDA:** Membersihkan opsi non-membership pada form Registrasi Member Baru, menjadikannya eksklusif hanya untuk pendaftaran VIP dari Master Data, serta memastikan data member baru langsung muncul di tabel Manajemen Member.

---

## 1. Cleanup: Eksklusivitas Dropdown Paket VIP
**Lokasi:** Dropdown "Pilih Paket Membership" di Modal Registrasi Member (`app/admin/members/MembersClient.tsx`).
**Instruksi Eksekusi UI:**
- Hapus secara permanen opsi statis / *hardcoded* seperti **"Harian (Manual)"** dan **"Lainnya / Minuman"**.
- Dropdown ini sekarang **HANYA BOLEH** berisi daftar paket yang di-fetch dari database Master Paket VIP (misal: "VIP 1 Bulan", "VIP 3 Bulan", dst).
- Pastikan logika *read-only* pada field "Nominal Pembayaran" tetap aktif. Saat kasir memilih paket VIP, harga langsung terisi otomatis sesuai database tanpa bisa diubah manual oleh kasir.

## 2. Jaminan Persistensi Database (User & Transaksi)
**Lokasi:** Server Action (misal: `app/actions/admin.ts` -> fungsi registrasi & bayar).
**Instruksi Eksekusi Backend:**
- Pastikan fungsi ini menggunakan Prisma `$transaction` untuk mengeksekusi dua hal sekaligus secara *atomic*:
  1. **Insert Tabel User:** Buat data User baru berdasarkan inputan kasir (Nama, Email, No HP). Set `role` ke 'VIP' (atau sesuai struktur role membership). Kalkulasi dan set `endDate` berdasarkan durasi paket VIP yang dipilih (Tanggal Hari Ini + Durasi Bulan).
  2. **Insert Tabel Transaksi:** Buat data Transaksi baru yang berelasi dengan ID User yang baru saja dibuat. Masukkan nominal harga paket dan metode pembayarannya.
- Alur ini menjamin bahwa pengunjung yang didaftarkan lewat form ini akan **seketika muncul di daftar tabel halaman Member**, dan uangnya tercatat di laporan keuangan.

## 3. UX Polish: Notifikasi & Refresh
**Lokasi:** Client Component (Modal Registrasi).
**Instruksi Eksekusi UX:**
- Setelah Server Action berhasil (return success), pastikan Modal otomatis tertutup (`setIsOpen(false)`).
- Panggil `router.refresh()` agar tabel di halaman Member langsung memuat ulang dan menampilkan nama member yang baru saja didaftarkan tersebut tanpa perlu menekan F5/Refresh browser secara manual.
- Tampilkan *Toast/Notifikasi* sukses (misal: "Member VIP berhasil didaftarkan!").

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Lakukan pembersihan *dropdown* dan perbaikan logika *refresh* ini secara langsung pada Client Component dan Server Actions di proyek Next.js.