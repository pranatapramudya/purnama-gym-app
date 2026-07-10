# PRD-v3.50.md
**Status:** Phase 3.50 - Dashboard Card Conditional Rendering & Profile Edit State
**TUGAS ANDA:** Menyembunyikan informasi masa berlaku bagi pengguna Non-Member di halaman Beranda, serta merombak UX halaman Profil dengan mengimplementasikan mode "Edit" dan status tombol dinamis (Read-Only by default).

---

## 1. Perbaikan UI Kartu Beranda (Dashboard)
**Lokasi:** `app/member/(dashboard)/page.tsx`
**Instruksi:**
- Cari elemen teks `BERLAKU SAMPAI` beserta tanggalnya di dalam kartu keanggotaan utama.
- Bungkus elemen tersebut dengan logika *conditional rendering* berdasarkan status VIP (`isVipActive`).
- **Logika:** Teks dan tanggal "Berlaku Sampai" HANYA BISA dirender/ditampilkan jika `isVipActive` bernilai `true`. Jika `false` (Non-Member), hilangkan sama sekali bagian teks tersebut agar bagian bawah kartu terlihat lebih bersih.

## 2. Implementasi UX "Edit Mode" pada Halaman Profil
**Lokasi:** `app/member/profil/page.tsx` (atau file form profil Anda)
**Analisis:** Form profil saat ini selalu dalam keadaan aktif dan tombol simpan dapat ditekan kapan saja, yang rentan terhadap ketidaksengajaan klik (accidental submit).
**Instruksi:**
- Jika komponen form profil ini belum menjadi *Client Component*, pastikan bagian form-nya diubah atau diekstrak menjadi komponen klien (`"use client"`).
- **State Management:** Buat state React baru: `const [isEditing, setIsEditing] = useState(false);`
- **Perilaku Input Field:** Ikat properti `disabled` atau `readOnly` pada input Nomor HP dan Alamat dengan nilai `!isEditing`. (Input terkunci secara default).
- **Perombakan Area Tombol:**
  - Buat sebuah kontainer flex (sejajar/berdampingan) untuk tombol.
  - **Tombol Kiri (Edit/Batal):** 
    - Jika `isEditing` false: Tampilkan tombol "Edit Profil" (warna *outline* atau sekunder). Jika diklik, ubah `isEditing` menjadi true.
    - Jika `isEditing` true: Tampilkan tombol "Batal" (warna merah/abu-abu). Jika diklik, kembalikan state ke false dan *reset* nilai input ke data asli.
  - **Tombol Kanan (Simpan):** 
    - Jika `isEditing` false: Tampilkan tombol sebagai "Selesai" atau "Simpan", namun dalam kondisi `disabled` (Class warna abu-abu: `bg-gray-300 text-gray-500 cursor-not-allowed`).
    - Jika `isEditing` true: Aktifkan tombol (warna hitam/utama) dengan tulisan "Simpan Profil", yang mana jika ditekan akan mengeksekusi fungsi simpan ke database dan mengembalikan `isEditing` ke false.

**ATURAN KETAT:**
TIDAK BOLEH merusak fungsi *Server Action* penyimpan data yang sudah berjalan. Hanya tambahkan lapisan State UI (Client-side) untuk mode Edit. Berikan implementasi kodenya sekarang!