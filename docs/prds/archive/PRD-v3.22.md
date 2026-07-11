# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.22  
**Status:** Phase 3.22 - Delete Server Action & Frontend Verification

---

## 1. Penyelesaian Bug Kritis: Fitur Hapus Jadwal PT (Admin)
**Analisis:** Tombol hapus (ikon tempat sampah) pada baris jadwal PT di halaman Admin saat ini belum berfungsi karena belum terhubung dengan *Server Action* untuk menghapus data di database Prisma.
**Tugas Agen AI:**
- Buka file UI komponen jadwal admin (`app/admin/classes/ClassesClient.tsx` atau nama file yang setara setelah *refactor* PT).
- Buka file *Server Actions* untuk admin (`app/actions/admin.ts`).
- **Buat Fungsi Delete:** Buat fungsi `deletePT(id: string)` di dalam *Server Actions* yang menjalankan fungsi `prisma.gymClass.delete({ where: { id } })` (Sesuaikan nama model Prisma Anda). Pastikan fungsi ini memanggil `revalidatePath` setelah berhasil.
- **Implementasi UI:** Hubungkan tombol ikon tempat sampah ke fungsi `deletePT` tersebut. 
- **WAJIB TAMBAHKAN KONFIRMASI:** Sebelum memanggil fungsi hapus, gunakan fungsi bawaan browser `window.confirm("Apakah Anda yakin ingin menghapus jadwal PT ini?")` atau *modal alert* kustom. Jika *user* membatalkan, hentikan eksekusi hapus.

## 2. Pengecekan Logika H+1 (Frontend Member)
**Analisis:** Memastikan bahwa jadwal yang tidak muncul di *frontend* murni karena logika filter H+1 yang kita terapkan sebelumnya.
**Tugas Agen AI:**
- Pastikan logika pemanggilan data (Fetch) di halaman Booking PT Member hanya menampilkan jadwal dengan kriteria: `waktuJadwal > akhirHariIni` (hanya menampilkan jadwal mulai besok/H+1 ke depan).
- Jika logika ini sudah benar, pertahankan! Tidak ada perbaikan *error* yang perlu dilakukan di sisi ini.

**Standar Eksekusi:**
Kerjakan perbaikan tombol Hapus sekarang juga dan pastikan seluruh *alert* menggunakan Bahasa Indonesia!