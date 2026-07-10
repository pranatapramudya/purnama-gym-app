# PRD-v3.32.md
**Status:** Phase 3.32 - Authentication Pages UI/UX Revamp (Split-Screen Branding)
**TUGAS ANDA:** Mengembalikan dan memperbaiki antarmuka halaman Sign In dan Sign Up agar tidak hanya menampilkan komponen Clerk bawaan, tetapi dibungkus dengan layout *split-screen* yang memuat *branding* "Purnama Gym".

---

## 1. Analisis UI/UX yang Hilang
**Masalah:** File `app/sign-in/[[...sign-in]]/page.tsx` dan `app/sign-up/[[...sign-up]]/page.tsx` saat ini hanya mengembalikan `<SignIn />` dan `<SignUp />` secara telanjang, sehingga *branding* "Purnama Gym Woman" dan elemen UI lainnya hilang.

## 2. Instruksi Arsitektur Layout (Wajib Diikuti!)
Rombak kedua file tersebut (`sign-in` dan `sign-up`) menggunakan arsitektur *layout* Tailwind CSS berikut ini:

1. **Bungkus Utama (Wrapper):**
   - Gunakan `min-h-screen w-full flex lg:grid lg:grid-cols-2` agar di layar HP/Mobile form-nya penuh, tapi di layar laptop layarnya terbelah dua.

2. **Sisi Kiri (Branding Section - Hanya muncul di layar besar/lg):**
   - Buat sebuah `div` dengan latar belakang gradasi premium hijau tosca (misal: `bg-gradient-to-br from-emerald-500 to-teal-900`).
   - Tambahkan tipografi tebal (Heading) dengan teks: **"PURNAMA GYM"**.
   - Tambahkan sub-heading dengan teks: **"Fasilitas Gym Khusus Wanita Terbaik di Sumedang."**
   - Tambahkan deskripsi singkat berbahasa Indonesia yang menjual (contoh: "Bergabunglah sekarang dan mulai perjalanan sehatmu dengan privasi dan kenyamanan penuh.")
   - Pastikan teks menggunakan warna putih/terang agar kontras dengan latar belakang.

3. **Sisi Kanan (Clerk Auth Section):**
   - Buat `div` yang menjadi tempat peletakan komponen Clerk.
   - Posisikan ke tengah menggunakan Flexbox (`flex items-center justify-center`).
   - Letakkan `<SignIn />` (atau `<SignUp />` sesuai halamannya) di tengah area ini.

**ATURAN KETAT:**
DILARANG merusak fungsionalitas komponen Clerk. Pastikan seluruh teks *branding* tambahan di sisi kiri murni menggunakan Bahasa Indonesia. Berikan kode perbaikan untuk kedua rute tersebut sekarang!