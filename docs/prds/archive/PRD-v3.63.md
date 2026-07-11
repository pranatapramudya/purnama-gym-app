# PRD-v3.63.md
**Status:** Phase 3.63 - Hydration Fix & PT Slot Availability Management
**TUGAS ANDA:** Memperbaiki Hydration Error yang disebabkan oleh ekstensi browser, dan merancang fondasi arsitektur untuk pengaturan Jadwal Kosong (Slot) serta Harga Personal Trainer oleh Admin.

---

## 1. Patch: Hydration Error Handling
**Lokasi:** `app/layout.tsx`
**Analisis:** Terdapat ekstensi browser klien yang menyisipkan atribut `bis_register` ke dalam tag HTML/Body sebelum React melakukan proses hidrasi.
**Instruksi Eksekusi:**
- Tambahkan properti `suppressHydrationWarning={true}` (atau cukup `suppressHydrationWarning`) pada tag `<html>` ATAU `<body>` di dalam `RootLayout`. Ini akan menginstruksikan Next.js untuk mengabaikan peringatan perbedaan atribut yang disuntikkan oleh ekstensi browser klien.

## 2. Arsitektur Database: Master Ketersediaan & Harga PT
**Lokasi:** `prisma/schema.prisma`
**Analisis:** Admin memerlukan kontrol untuk menentukan harga sesi PT dan hari/jam berapa saja sesi tersebut tersedia (slot kosong) agar member tidak bisa memesan jadwal secara acak.
**Instruksi Pembaruan Skema:**
- Buat model baru bernama `PTSetting` (atau `PTAvailability`) yang berfungsi sebagai *Master Data*.
- **Kolom yang dibutuhkan:**
  - `id` (Primary Key)
  - `pricePerSession` (Int/Float: Harga per sesi 1 jam)
  - `availableDays` (Array of String atau JSON: Menyimpan hari aktif, misal ["Senin", "Rabu", "Jumat"])
  - `startTime` (String: misal "08:00")
  - `endTime` (String: misal "20:00")
- *(Catatan untuk AI: Asumsikan saat ini sistem berlaku secara global untuk gym, jika nanti dibutuhkan per-Trainer, kita bisa menambahkan `trainerId` opsional).*

## 3. UI Admin: Pengaturan Slot & Harga (Khusus Superadmin)
**Lokasi:** `app/admin/personal-trainer/page.tsx` (atau buat Tab/Sub-menu baru bernama "Pengaturan PT")
**Instruksi UI:**
- Terapkan *Conditional Rendering* agar fitur pengaturan ini HANYA dapat diakses oleh `role === 'superadmin'`.
- Buat form antarmuka sederhana yang memungkinkan Owner mengubah:
  1. Input Harga per Sesi.
  2. *Checkbox* Hari Operasional PT (Senin s/d Minggu).
  3. Input Jam Buka & Jam Tutup Sesi PT.
- Pastikan perubahan ini tersimpan ke database sehingga nantinya aplikasi Member dapat membaca slot waktu (interval 1 jam) yang tersedia berdasarkan batasan ini.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda. Silakan modifikasi `app/layout.tsx` terlebih dahulu untuk menyelesaikan *error* klien, lalu perbarui *schema database* dan siapkan UI-nya. Berikan perintah `npx prisma db push` jika modifikasi database telah selesai.