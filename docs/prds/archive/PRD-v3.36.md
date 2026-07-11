# PRD-v3.36.md
**Status:** Phase 3.36 - Hidden Admin Entry Point (Copyright Footer Trigger)
**TUGAS:** Mengubah elemen *copyright* pada footer menjadi pintu masuk rahasia ke halaman admin.

---

## 1. Instruksi Implementasi (app/components/Footer.tsx atau layout utama)
**Tugas:**
- Cari komponen Footer yang menampilkan teks: `© 2026 Purnama Gym Sumedang. Hak cipta dilindungi.`
- **Transformasi Elemen:**
  - Bungkus teks tersebut (atau bagian tahun "2026") dengan komponen `<Link href="/admin/dashboard">`.
  - Hapus *underline* atau *styling* mencolok agar tetap terlihat seperti teks biasa (tidak mengundang kecurigaan member).
  - Gunakan *class* Tailwind: `cursor-pointer hover:opacity-80 transition-opacity`.
- **Tambahan Keamanan:** Pastikan halaman `/admin/dashboard` sudah diproteksi oleh *middleware* agar hanya *user* dengan *role* admin yang bisa melihat konten di dalamnya.

## 2. Instruksi Role-Based Routing (middleware.ts)
**Tugas:**
- Pastikan di `middleware.ts` sudah ada logika pengecekan *role*.
- Jika `user` yang login BUKAN admin, maka akses ke `/admin/(.*)` harus otomatis di-*redirect* kembali ke `/member/dashboard` (atau akses ditolak).
- *Pastikan sinkronisasi dengan Clerk Metadata atau User Roles yang sudah Anda atur sebelumnya.*

**ATURAN KETAT:**
- Jangan mengubah tampilan footer secara drastis, tetap biarkan minimalis.
- Pastikan pintu masuk rahasia ini benar-benar mengarah ke dasbor admin yang aman.
- Berikan kode revisi untuk Footer dan sedikit *hint* (tips) jika ada konfigurasi *role* yang harus disesuaikan di Clerk.