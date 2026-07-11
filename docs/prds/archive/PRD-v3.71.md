# PRD-v3.71.md
**Status:** Phase 3.71 - UI Spacing Refinement & Frontend Checkout Integration
**TUGAS ANDA:** Memperbaiki styling form input agar lebih modern dan berjarak (spacious), merapikan tampilan harga di Frontend, dan membangun alur (flow) pembayaran (Tunai/Online) yang terintegrasi langsung dengan database Admin. 

---

## 1. Perbaikan UI/UX: Form Kelola Slot (Admin)
**Lokasi:** `app/admin/personal-trainer/page.tsx` (Form Kelola Slot Jadwal PT)
**Masalah:** Input "Hari" terlihat sangat jadul (native select bawaan browser), dan jarak antar kolom (Hari, Mulai, Selesai, Nama PT) sangat sempit.
**Instruksi Eksekusi:**
- **Spacing:** Ubah container form input dari yang sempit menjadi grid yang lega. Gunakan `grid-cols-1 md:grid-cols-5 gap-4` atau `flex gap-4 items-end` agar ada ruang bernapas.
- **Styling Dropdown "Hari":** Berikan styling Tailwind yang tebal pada elemen `<select>` (contoh: `py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500`). Jangan biarkan tampil polos.
- Lakukan hal yang sama pada input jam (`type="time"`) agar ukurannya seragam dan modern.

## 2. Perbaikan UI Frontend: Box Harga & Data Real
**Lokasi:** `app/(member)/jadwal/page.tsx`
**Instruksi Eksekusi:**
- **Harga:** Masukkan informasi "Harga Per Sesi" ke dalam sebuah Box/Card statis yang elegan di atas grid jadwal, jangan hanya berupa *pill* melayang.
- **Zero Dummy Data:** Pastikan seluruh kotak jadwal yang muncul murni hasil *mapping* dari database `PTScheduleSlot`. Jika database kosong, tampilkan *Empty State* (misal: "Belum ada jadwal tersedia").

## 3. Integrasi Alur Booking & Checkout (O2O)
**Lokasi:** Frontend Member (`app/(member)/jadwal/page.tsx` atau komponen Modal baru)
**Instruksi Eksekusi:**
- Ketika Member menekan salah satu kotak jadwal yang berstatus **Tersedia**, munculkan **Modal Konfirmasi Booking**.
- Di dalam Modal tersebut, tampilkan ringkasan (Hari, Jam, Nama PT, Harga).
- Berikan 2 opsi tombol aksi pembayaran:
  1. **"Bayar Tunai di Gym"**: Jika ini diklik, jalankan Server Action untuk membuat data di tabel `PTSession` dengan status `PENDING` dan metode bayar `CASH`.
  2. **"Bayar Online"**: (Beri placeholder UI untuk integrasi Payment Gateway nanti), jika diklik, buat data di `PTSession` dengan metode bayar `CASHLESS`.
- Setelah berhasil, ubah status kotak tersebut menjadi *Greyed Out* (abu-abu/Penuh), dan pastikan data ini langsung muncul di halaman Admin pada tab **"Booking Baru (Menunggu Konfirmasi)"**.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Fokus pada perbaikan *styling classes* Tailwind secara langsung di dalam *file*, pastikan tidak ada data statis/dummy, dan bangun Server Action untuk menyambungkan proses klik jadwal ke database `PTSession`.