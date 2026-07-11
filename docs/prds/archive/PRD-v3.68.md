# 📋 PRD: Purnama Gym - V3.68 (Fix Server Actions & Data Parser Logic)

## 1. Ringkasan Eksekutif
Dokumen ini adalah lanjutan kritis dari `PRD-v3.67.md`. Meskipun antarmuka (UI) dan skema database sudah diperbarui sesuai permintaan (Input Rupiah tanpa scroll & fleksibilitas `trainerName`), implementasi **Server Actions di dalam folder `app/actions/`** (khususnya `pt.ts` dan `admin.ts`) belum disesuaikan. Akibatnya, saat data dikirim, terjadi error parse dan mismatch tipe data. PRD ini mewajibkan AI Agent untuk merombak logika *backend action* tersebut agar selaras dengan struktur baru.

## 2. Error & Akar Masalah Saat Ini
Berdasarkan struktur folder yang ditinjau, error terjadi di lapisan *Server Action*.
- **Akar Masalah 1 (Input Harga):** Frontend mengirimkan string harga dengan format "100.000" (karena fitur format Rupiah otomatis), namun Server Action (`pt.ts`) masih mengharapkan angka mentah (integer), sehingga terjadi error `Invalid input type for Price`.
- **Akar Masalah 2 (Nama PT):** Server Action masih melakukan validasi ketat yang mengharuskan `trainerId` wajib diisi (terikat dengan tabel User). Padahal di PRD sebelumnya, `trainerId` sudah diubah menjadi opsional dan ada kolom baru `trainerName`. Server Action menolak penyimpanan jika hanya mengirim `trainerName` tanpa `trainerId`.
- **Akar Masalah 3 (Query Frontend):** Fungsi pengambilan data untuk halaman Member (`/member/schedule`) di `app/actions/member...ts` mungkin masih belum meng-include field `trainerName` dan `price` yang benar, sehingga data kosong di frontend.

## 3. Spesifikasi Tugas (Action Items untuk AI Agent)

AI Agent wajib membuka dan mengubah file-file berikut di dalam folder `app/actions/` secara spesifik:

### A. Perbaikan Parser Input Harga di `pt.ts` & `admin.ts` (Prioritas 1)
Agent harus menemukan fungsi `createSchedule`, `updateSchedule`, atau yang menangani penyimpanan master harga.
- **Tindakan Logika:** Tambahkan parser di dalam *Server Action* sebelum data dikirim ke Prisma.
- **Instruksi:** Ubah format string Rupiah (contoh: "100.000") menjadi Integer (100000) menggunakan fungsi `.replace(/\./g, '')` atau `parseInt()`. Pastikan *Server Action* siap menerima input harga sebagai string dari Frontend, lalu mengubahnya menjadi `Int` untuk disimpan ke database.

### B. Modifikasi Validasi & Input `trainerName` di Server Action (Prioritas 2)
Hapus batasan wajib `trainerId` pada fungsi *create/update* di `pt.ts`.
- **Tindakan Logika:** Buat logika kondisional (*Conditional Logic*).
- **Instruksi:**
  - Jika Super Admin mengirim `trainerId` (berisi angka ID), simpan ID tersebut.
  - Jika Super Admin tidak mengirim `trainerId`, tapi mengirim string `trainerName`, simpan `trainerName` tersebut ke dalam field database `trainerName`, dan set `trainerId` menjadi `null`.
  - *Peringatan:* Hapus *TypeScript type validation* ketat yang memaksa `trainerId` wajib `number`. Gunakan tipe data `string | number | null` untuk `trainerId`.

### C. Perbaikan Query Tampilan Member di `app/actions/member...ts` (Prioritas 3)
Buka fungsi yang mengambil data jadwal untuk halaman `/member/schedule`.
- **Tindakan Logika:** Pastikan fungsi `.findMany()` atau `.findUnique()` pada Prisma men-select field `price`, `startTime`, `endTime`, `trainerId`, **DAN** field baru `trainerName` secara eksplisit.
- **Instruksi:** Karena sumber nama PT bisa berasal dari `trainerName` (teks bebas) atau relasi `trainer` (dari tabel User), pastikan di Frontend Member, mapping nama PT dilakukan dengan logika prioritas: 
  `return data.trainerName || data.trainer?.fullName || "Tanpa PT"`.

## 4. Panduan Testing Akhir (Validasi)
Sebelum menyatakan selesai, AI Agent harus memastikan alur berikut bekerja tanpa error di konsol developer (Network Tab):

1. **Simpan Data:** Super Admin mengisi harga "100.000", mengetik nama PT bebas "Trainer Baru", lalu klik "Simpan Pengaturan". Pastikan Network Status 200 OK (tidak ada error 500 atau Prisma error).
2. **Validasi Database:** Buka database (Neon / Prisma Studio). Pastikan di tabel `PTScheduleSlot`, kolom `price` berisi angka `100000` (bukan string), dan kolom `trainerName` berisi "Trainer Baru".
3. **Tampil di Member:** Buka aplikasi Member. Refresh halaman Jadwal PT. Pastikan "Trainer Baru" dan harga "Rp 100.000" muncul pada list jadwal yang tersedia.

---
**Instruksi Akhir untuk AI Agent:**
Jangan fokus pada merombak UI Frontend atau HTML. Saat ini, **fokuskan pekerjaan 100% pada file `app/actions/pt.ts` dan `app/actions/admin.ts`**. Perbaiki logika parse datanya (Ubah String Rupiah ke Integer, dan ubah logika trainer dari Required menjadi Optional). Eksekusi langsung.