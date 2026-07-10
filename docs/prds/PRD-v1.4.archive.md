# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 1.4  
**Status:** Final Layout Specification (Mobile Wrapper)  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+ (PgAdapter), Neon DB, Clerk Authentication, Lucide React.

---

## 1-6. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Untuk ringkasan, peran pengguna, fitur utama, skema Prisma, dan alur Webhook Clerk tidak ada perubahan dan tetap mengacu pada spesifikasi v1.3 sebelumnya.*

---

## 7. Design System & UI/UX Guidelines
*   **Tema Utama:** "Clean & Elegant Light Mode" (Premium Women-Only).
*   **Palet Warna:** Putih Bersih (`bg-slate-50` / `bg-white`), Aksen Pink/Rose Gold, Teks Gelap (`text-slate-900`).
*   **Constraint Layout (Mobile-First):** 
    *   Aplikasi **wajib** dibungkus dalam *container* maksimal sebesar layar ponsel standar (`max-w-md mx-auto`) di seluruh halaman Member.
    *   Hal ini memastikan jika aplikasi dibuka di Desktop/Tablet, UI tetap berada di tengah layar berbentuk seperti aplikasi *smartphone* (memberikan ilusi PWA / *Native App*).
    *   Semua elemen *fixed* seperti Bottom Navigation harus memiliki batas lebar maksimal yang sama (`max-w-md`).

---

## 8. Alur Frontend Saat Ini (Fokus Member)
1.  **Landing Page (`app/page.tsx`):** *Bypass/redirect* ke `/member/dashboard` jika *user* sudah login.
2.  **Auth (Clerk):** Halaman login/register.
3.  **Member Dashboard & Fitur:** 
    *   Beranda (`/dashboard`): Kartu digital & menu QR.
    *   Jadwal (`/classes`): Katalog kelas & booking.
    *   Panduan (`/guide`): Tutorial alat gym untuk pemula.
    *   Profil (`/profile`): Masa aktif, riwayat transaksi, dan *logout*.

---

## 9. Frontend Implementation Tracker
Daftar checklist progres pengerjaan UI Halaman Member:

- [x] **Setup & Routing Utama:** Autentikasi Clerk dan proteksi Middleware selesai.
- [x] **UI Komponen Statis:** Halaman Beranda, Jadwal, Panduan, dan Profil berhasil dirender.
- [x] **Mobile Wrapper Layout:** Membungkus `app/member/layout.tsx` dan `<BottomNav/>` dengan batas `max-w-md mx-auto`.
- [ ] **Interaktivitas UI:** Menyambungkan *routing* antar menu `<BottomNav/>` agar bisa diklik dan berpindah halaman dengan mulus.

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v1.0:** Inisiasi PRD dan rancangan arsitektur database.
* **v1.1:** Setup Clerk Webhook untuk sinkronisasi otomatis user ke Neon DB.
* **v1.2:** Pembersihan sisa *template boilerplate* lama.
* **v1.3:** Transisi ke Light Mode UI dan penambahan fitur *Guide*.
* **v1.4 (Current):** Penegasan *Mobile Wrapper Constraints* agar aplikasi berwujud murni *mobile-app* meskipun dibuka melalui browser Desktop/Tablet.