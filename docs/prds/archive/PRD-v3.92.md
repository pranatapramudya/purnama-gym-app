# PRD-v3.92.md
**Status:** Phase 3.92 - Capacity Management: PT Slot Maximum Quota
**TUGAS ANDA:** Menambahkan field input "Maksimal Member" pada antarmuka Master Jadwal PT (khusus Super Admin), serta memperbarui skema database untuk menyimpan batas kuota orang per slot jadwal PT.

---

## 1. Pembaruan Skema Database (Prisma)
**Lokasi:** `prisma/schema.prisma`
**Instruksi Eksekusi Backend:**
- Temukan model yang mengatur ketersediaan slot jadwal PT (misalnya `PTAvailability`, `TrainerSchedule`, atau nama tabel terkait).
- Tambahkan satu kolom baru (field) bernama `maxCapacity` dengan tipe `Int` (Integer).
- Berikan nilai default yang masuk akal, misalnya `@default(1)` (asumsi standar PT adalah 1-on-1).
- Pastikan Anda memberikan instruksi agar saya menjalankan `npx prisma db push` (dan `generate`) setelah pembaruan skema ini.

## 2. Pembaruan UI: Input Kuota Maksimal
**Lokasi:** Komponen/Halaman Master Jadwal & Harga PT (Tab kelola slot PT).
**Instruksi Eksekusi UI/UX:**
- Di bagian form "Kelola Slot Jadwal PT", tepat di sebelah input "Mulai" dan "Selesai" (atau di bawah input "Ketik Nama PT"), tambahkan sebuah field input angka (`type="number"`).
- **Label Input:** "Maksimal Member (Kuota)".
- **Fungsi:** Form ini berfungsi untuk menentukan batas maksimal orang yang bisa melakukan *booking* pada slot waktu dan PT tersebut (misal: isi '1' untuk *private training*, atau '3' untuk *small group training*).
- Tambahkan validasi dasar: Nilai minimal (`min`) adalah 1.

## 3. Pembaruan Logika Server Action (Save Slot)
**Lokasi:** File Server Action yang mengatur penyimpanan data slot PT.
**Instruksi Eksekusi Logika:**
- Perbarui *payload* (data yang dikirim) saat menyimpan data slot baru ke database.
- Pastikan variabel angka dari form "Maksimal Member" ikut dikirim dan disimpan ke kolom `maxCapacity` yang baru dibuat di database.

## 4. Pembaruan Tabel Daftar Slot
**Lokasi:** Tabel "HARI | JAM | NAMA PT | AKSI" di bagian bawah layar.
**Instruksi Eksekusi UI:**
- Tambahkan satu kolom header baru bernama **"KUOTA"**.
- Tampilkan angka dari field `maxCapacity` pada kolom tersebut (misal: "1 Orang" atau "3 Orang").

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Terapkan perubahan ini langsung pada Schema Prisma, komponen form UI, dan logika *save* di Backend.