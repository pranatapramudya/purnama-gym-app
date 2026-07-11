# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.0  
**Status:** Phase 2 - Frontend Interactivity & Routing System  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React, `react-qr-code`.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi inti, database, Clerk, dan UI Guidelines (Strict Mobile Wrapper) sudah final dan (*locked*).*

---

## 8. Peta Navigasi & Interaktivitas (Routing Map)
Semua tombol di aplikasi harus memiliki respons interaktif (klik/hover/loading) dan mengarah ke rute yang tepat:

**A. Navigasi Utama (BottomNav)**
- Beranda (`/member/dashboard`)
- Jadwal (`/member/schedule`)
- Panduan (`/member/guide`)
- Profil (`/member/profile`)

**B. Rute Fungsional (Dari Beranda & Profil)**
- Tampilkan QR (`/member/qr` atau via Modal).
- Katalog Kelas (`/member/booking`).
- Katalog Paket VIP (`/member/packages`).
- Checkout Harian (`/member/payment?type=daily`).
- Riwayat Transaksi (`/member/history`).

**C. Aksi Spesifik (State/Actions)**
- **Logout:** Menggunakan integrasi Clerk Auth.
- **Batal Booking:** Memerlukan konfirmasi (Dialog/Toast) berbahasa Indonesia.
- **Tonton Panduan:** Membuka Modal Video.

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1: UI Static & Layouting:** Selesai (Mobile Wrapper presisi).
- [ ] **Phase 2: Interactivity & Routing:** (Fokus Saat Ini) Menyambungkan semua tautan (`<Link>`), merender *toast/modals*, dan mengaktifkan tombol *Logout* Clerk.
- [ ] **Phase 3: Backend & Database Sync:** Mengubah *dummy data* menjadi data dinamis dari PostgreSQL.

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v1.6 - v1.9:** Fokus pada perombakan tata letak (UI layouting), presisi *mobile*, dan pemisahan logika paket langganan.
* **v2.0 (Current):** Transisi dari UI statis ke aplikasi interaktif. Pembuatan sistem *routing* antar halaman dan penerapan *state* UI sementara (modals/toasts) sebelum integrasi *backend*.