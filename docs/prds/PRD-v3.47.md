# PRD-v3.47.md
**Status:** Phase 3.47 - VIP Black Card (Conditional UI Rendering)
**TUGAS ANDA:** Memodifikasi antarmuka komponen QR E-Card agar secara dinamis berubah menjadi tema "Black Card" (Kartu Hitam Premium) jika pengguna memiliki status VIP yang aktif.

---

## 1. Analisis UI Target
**Masalah saat ini:** E-Card masih menggunakan warna statis (latar putih dengan elemen merah/pink) terlepas dari apakah pengguna tersebut VIP atau Non-Member.
**Solusi:** Terapkan *Conditional ClassNames* menggunakan Tailwind CSS berdasarkan variabel `isVip` (yang sudah diverifikasi masa aktifnya).

## 2. Instruksi Refactoring UI (app/member/qr/page.tsx)
**Tugas:** Cari kontainer utama kartu QR (elemen `<div>` yang membungkus nama dan gambar QR) dan modifikasi *class*-nya:

**A. Skema Warna Kartu (Container):**
- Jika **VIP**: Gunakan latar belakang hitam elegan dengan gradasi halus, misalnya: `bg-gradient-to-br from-slate-900 to-black text-white border-amber-500/50 shadow-amber-500/20`.
- Jika **Non-Member**: Pertahankan desain awal (latar putih), misalnya: `bg-white text-slate-800 border-gray-200`.
- *Implementasi Code:* 
  `className={\`p-6 rounded-2xl shadow-xl border \${isVip ? 'bg-gradient-to-br from-slate-900 to-black text-white border-amber-500/50 shadow-amber-500/20' : 'bg-white text-slate-800 border-gray-200'}\`}`

**B. Skema Warna Teks & Badge:**
- **Teks Nama:** Jika VIP, buat sedikit bercahaya atau kontras (`text-amber-400` atau `text-white`). Jika Non-Member, `text-slate-800`.
- **Badge Status:** 
  - VIP: `bg-amber-500 text-black font-extrabold` (Warna Emas).
  - Non-Member: `bg-gray-200 text-gray-500 font-bold` (Warna Abu-abu).

**C. Siku Pemindai QR (Scanner Brackets):**
- Jika ada elemen siku pemindai di sudut QR (yang saat ini berwarna merah/pink), ubah warnanya secara dinamis.
- VIP: Ubah menjadi warna emas (`border-amber-400`).
- Non-Member: Ubah menjadi hijau tosca (`border-emerald-500`) agar senada dengan merek Purnama Gym, HAPUS sisa warna pink/merah!

**ATURAN KETAT:**
DILARANG menyentuh atau merusak logika pengambilan data Prisma yang sudah berfungsi dari fase sebelumnya. Anda HANYA diizinkan merombak *class* Tailwind dengan *template literals* (`${...}`). Terapkan sekarang!