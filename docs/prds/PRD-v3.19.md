# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.19  
**Status:** Phase 3.19 - Missing Header Fix & Premium UI Elevation

---

## 1. Objektif Utama
Menambahkan desain *banner header* yang tertinggal pada halaman "Booking Kelas", sekaligus meningkatkan seluruh desain *header* halaman menjadi versi "Premium" dengan efek kedalaman (shadow berwarna), *glossy border*, dan tipografi yang lebih padat.

---

## 2. Penambahan Header di Halaman Booking
Tugas Agen: Buka halaman `app/member/booking/page.tsx` (atau file *Client* terkait yang merender judul halaman tersebut).
- Bungkus judul "Jadwal Kelas" dan sub-judulnya menggunakan *container header* yang sama seperti halaman Beranda dan Profil.

---

## 3. Peningkatan "Premium Look" pada Seluruh Header
Tugas Agen: Revisi seluruh *class* Tailwind pada elemen pembungkus *Header* di SEMUA halaman (Beranda, Jadwal, Panduan, Profil, dan Booking).

**A. Upgrade Container Pembungkus (Banner):**
- Ganti *class* Tailwind lama Anda dengan racikan desain premium berikut:
  `bg-gradient-to-br from-emerald-200 via-teal-300 to-emerald-400 px-6 pt-10 pb-8 rounded-b-[2.5rem] shadow-xl shadow-teal-900/10 border-b border-white/60 mb-6 relative overflow-hidden`
- *Penjelasan efek:* Penambahan `shadow-teal-900/10` memberikan bayangan warna (bukan hitam kotor) yang memberi kesan melayang elegan. `border-white/60` memberikan efek pantulan cahaya (*glossy edge*).

**B. Upgrade Tipografi Teks (Judul & Sub-judul):**
- Pada teks Judul (`<h1>`), gunakan *class* ini untuk membuatnya padat dan tegas:
  `text-3xl font-extrabold text-slate-900 tracking-tight`
- Pada teks Sub-judul (`<p>`), gunakan *class* ini agar terlihat berkelas:
  `text-sm font-medium text-slate-700/90 mt-1.5`

**C. Efek Ornamen (Opsional tapi Direkomendasikan):**
- Tambahkan elemen dekoratif statis di dalam *container banner* (dengan *absolute positioning*) berupa lingkaran blur putih halus di pojok kanan atas untuk memberikan efek pencahayaan dinamis. Contoh ditambahkan tepat di atas tag `<h1>`:
  `<div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>`

---

## 4. Standar Eksekusi
- Pastikan perubahan ini diaplikasikan secara merata di Halaman Beranda, Booking, Jadwal Pribadi, Panduan Latihan, dan Profil Saya.
- Lakukan eksekusi secara cermat tanpa mengubah struktur fungsional *state* atau *props*!