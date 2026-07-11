# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.13  
**Status:** Phase 3.13 - Authentication UI/UX Customization (Clerk Appearance)  

---

## 1. Objektif Utama
Mengubah tampilan *default* halaman autentikasi Clerk (Sign In & Sign Up) yang gelap/ungu menjadi desain yang selaras dengan *branding* Purnama Gym: Modern, cerah, elegan, dengan sentuhan warna hijau lembut (tidak silau).

---

## 2. Kustomisasi Background Halaman Autentikasi
Tugas Agen: 
- Buka file halaman otentikasi Anda (misalnya `app/sign-in/[[...sign-in]]/page.tsx` dan `app/sign-up/[[...sign-up]]/page.tsx`).
- Ubah *container* pembungkus utama (`<main>` atau `<div>` paling luar) agar memenuhi layar penuh (`min-h-screen flex items-center justify-center`).
- Berikan *background* gradasi hijau lembut yang sangat elegan. Rekomendasi Tailwind: `bg-gradient-to-br from-emerald-50 via-white to-teal-100`. (Pastikan *background* gelap bawaan dihapus).

---

## 3. Modifikasi Clerk Appearance Prop
Tugas Agen: Untuk menghilangkan warna ungu bawaan Clerk dan menggantinya dengan tema Gym, terapkan prop `appearance` pada komponen `<SignIn />` dan `<SignUp />` (atau terapkan secara global di `<ClerkProvider>` pada `layout.tsx`).

Gunakan konfigurasi *Appearance* berikut sebagai patokan dasar:
```javascript
appearance={{
  variables: {
    colorPrimary: '#059669', // Warna Emerald 600 (Hijau elegan, tidak silau)
    colorText: '#1f2937', // Teks abu-abu gelap agar nyaman dibaca
    colorBackground: '#ffffff', // Latar belakang form putih bersih
    colorDanger: '#ef4444', 
    borderRadius: '0.75rem', // Membuat sudut card lebih modern (rounded-xl)
  },
  elements: {
    formButtonPrimary: 
      "bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition-colors",
    card: "shadow-xl border border-emerald-100/50",
    headerTitle: "text-emerald-900 font-bold",
    headerSubtitle: "text-slate-500",
    socialButtonsBlockButton: "border border-slate-200 hover:bg-slate-50 transition-colors",
  }
}}

4. Standar Eksekusi
Pastikan tidak ada lagi elemen berwarna ungu dari Clerk yang tersisa.

Pastikan kontras teks terhadap tombol tetap nyaman dibaca (Accessibility).

Terapkan perubahan ini segera dan pastikan tidak merusak alur pengalihan (redirect) yang sudah diperbaiki pada fase sebelumnya.