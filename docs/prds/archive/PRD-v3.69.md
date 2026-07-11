# PRD-v3.69.md
**Status:** Phase 3.69 - Super User UI/UX Overhaul & Frontend Cinema-Style Slot Booking
**TUGAS ANDA:** Memperbaiki bug visual (Autofill artifact) pada dropdown form Super User, merapikan layout manajemen PT menggunakan sistem Tab, dan merancang antarmuka pemilihan jadwal di sisi Member (Frontend) menggunakan konsep "Cinema Booking" (Grid layout kotak-kotak).

---

## 1. UI/UX Fix: Bug "Bekas Nama" di Form Admin
**Lokasi:** Komponen UI `PTSetting` atau `PTScheduleSlot` di Admin.
**Masalah:** Saat Super Admin memilih nama Trainer, muncul *artifact* (bekas popover hitam) dari native browser autofill yang menumpuk.
**Instruksi:**
- Ubah elemen input/combobox pencarian nama PT tersebut menjadi elemen `<select>` native HTML yang bersih, ATAU tambahkan atribut `autoComplete="off"` dan `name="random-string"` pada input text jika menggunakan custom dropdown.
- Pastikan tampilan *dropdown* bersih, menggunakan styling Tailwind standar (misal: `bg-white border-gray-300 rounded-md shadow-sm`), tanpa ada popover hitam bawaan browser yang menumpuk.

## 2. UI/UX Fix: Layout Super User (Sistem Tab)
**Lokasi:** `app/admin/personal-trainer/page.tsx`
**Masalah:** Tampilan Super User terlalu padat karena menggabungkan fitur "Manajemen Sesi PT (Monitoring)" dan "Pengaturan Master (CRUD)".
**Instruksi:**
- Implementasikan sistem **Tab Navigation** sederhana di bagian atas halaman khusus untuk `role === 'superadmin'`.
- **Tab 1: "Monitoring Sesi"** (Isinya: Sesi Aktif, Booking Baru, Sesi Hari Ini, Sesi Selesai - sama seperti tampilan Admin biasa).
- **Tab 2: "Master Jadwal & Harga"** (Isinya: Form CRUD Harga dan penambahan Slot Waktu).
- Jika yang login adalah `admin` biasa, sembunyikan navigasi Tab ini dan langsung tampilkan isi Tab 1 saja.

## 3. Frontend Member: "Cinema-Style" Time Slot Grid
**Lokasi:** Halaman booking PT di sisi Frontend Member (misalnya `app/(member)/jadwal/page.tsx`).
**Instruksi:**
- **Fetch Data:** Panggil Server Action yang mengambil slot Master sekaligus mengecek ketersediaannya di tabel Transaksi (`PTSession`). Data harus mengembalikan boolean `isBooked`.
- **Layout UI:** Gunakan CSS Grid (`grid-cols-2` atau `grid-cols-3` pada mobile, `gap-4`).
- **Render Kotak Jam (Slots):**
  - Buat setiap slot menjadi bentuk *Card/Button* kotak.
  - Tampilkan teks Jam (contoh: "09:00 - 10:00") di tengah kotak.
  - **Jika `isBooked === false` (Tersedia):** Beri warna cerah (misal `bg-emerald-500 text-white`), berikan efek hover, dan buat *clickable* untuk memicu form booking.
  - **Jika `isBooked === true` (Sudah Terisi):** Beri warna abu-abu (misal `bg-gray-200 text-gray-400`), tambahkan teks kecil "Penuh", ubah kursor menjadi `cursor-not-allowed`, dan pastikan tombol berstatus `disabled`.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Langsung terapkan perbaikan *styling* dan logika UI ini pada *environment* proyek. Pastikan transisi Tab berjalan mulus tanpa *reload* halaman (gunakan React State).