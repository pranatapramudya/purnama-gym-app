# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.17 (Hotfix)  
**Status:** Phase 3.17 - Recharts Rendering Fix & Modern Sync UI

---

## 1. Penyelesaian Bug Kritis: Grafik Recharts Kosong
**Analisis:** Komponen grafik tidak muncul (kosong) meskipun terdapat data pendapatan. Hal ini umumnya disebabkan oleh tidak adanya properti `height` eksplisit pada kontainer grafik, atau format data yang belum dipetakan (*mapping*) dengan benar ke komponen `<AreaChart>` / `<BarChart>`.
**Tugas Agen AI:**
- Buka file komponen Client untuk grafik (`DashboardClient.tsx` atau sejenisnya).
- Bungkus komponen `<ResponsiveContainer>` dengan `div` yang memiliki tinggi tetap, misalnya: `<div className="h-[300px] w-full">`. Jangan biarkan tinggi kontainer bernilai dinamis/auto yang menyebabkan grafik *collapse*.
- Pastikan data yang dimasukkan ke atribut `data={...}` pada grafik benar-benar memiliki nilai, contoh: `[{ name: 'Sen', total: 0 }, ... , { name: 'Jum', total: 20000 }]`.

## 2. Pembaruan Opsi "Tahun Ini" & Sumbu X Grafik
**Analisis:** Opsi "Tahun Ini" tidak ada di UI Dropdown, dan sumbu X (X-Axis) grafik belum dinamis menyesuaikan rentang waktu.
**Tugas Agen AI:**
- Tambahkan opsi `"Tahun Ini"` secara eksplisit ke dalam *state* opsi *Dropdown* Anda.
- **Logika Sumbu X (X-Axis):** 
  - Jika "Minggu Ini" dipilih, label sumbu X adalah Hari (Sen, Sel, Rab...).
  - Jika "Bulan Ini" dipilih, label sumbu X adalah Tanggal (1, 5, 10, 15...).
  - Jika "Tahun Ini" dipilih, label sumbu X adalah Bulan (Jan, Feb, Mar... Des).
- Lakukan pemetaan data transaksi dari *Server* agar didistribusikan dengan benar sesuai label sumbu X tersebut.

## 3. Modernisasi UI Auto-Refresh (Toggle Switch)
**Analisis:** Teks indikator "Diperbarui otomatis setiap 30 detik" terlihat usang dan tidak interaktif.
**Tugas Agen AI:**
- Hapus teks indikator lama tersebut.
- Ganti dengan UI **Toggle Switch** (Tombol Geser) bergaya modern ala iOS/Tailwind, bersebelahan dengan label teks "Auto-Sync (30s)".
- Buat *state* `isAutoSync` (boolean) untuk mengontrol apakah interval 30 detik (fitur *polling* `router.refresh()`) berjalan atau dijeda (*paused*).
- Tambahkan juga tombol "Refresh Manual" (ikon `<RefreshCw />`) di sebelahnya yang bisa diklik pengguna untuk menarik data secara instan kapan saja.

## 4. Standar Eksekusi
Seluruh komponen UI baru (Toggle, Dropdown, Label Sumbu X) WAJIB menggunakan Bahasa Indonesia yang profesional. Pastikan grafik merender batang/garis hijau (`#10b981`) yang terlihat jelas saat *page load*!