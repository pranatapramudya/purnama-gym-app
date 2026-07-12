# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.01
**Module:** Core Authentication, Role-Based Access Control (RBAC), and Red-Carpet Routing
**Tech Stack:** Next.js (App Router), Clerk Auth, Prisma ORM, PostgreSQL (Neon)

## 1. Objective
Membangun sistem autentikasi dan otorisasi multi-jalur yang aman. Sistem harus memisahkan akses antara Member publik dan Staff internal (Super Admin, Kasir, Personal Trainer). Fokus utama adalah memastikan "Super Admin" mendapatkan akses otomatis tanpa hambatan (Red-Carpet flow), sementara data Staff dibuat secara tertutup untuk mencegah pendaftaran tidak sah, guna menjaga keamanan aset bisnis.

## 2. Role Definitions
Sistem menggunakan Enum `Role` di Prisma dengan tingkatan sebagai berikut:
1.  **SUPER_ADMIN**: Hak akses penuh. Ditetapkan melalui validasi Environment Variables (`.env`).
2.  **ADMIN_KASIR**: Akses ke modul transaksi dan manajemen member. Dibuat oleh SUPER_ADMIN.
3.  **TRAINER**: Akses ke jadwal Personal Training. Dibuat oleh SUPER_ADMIN.
4.  **MEMBER**: Akses default untuk publik. Memerlukan kelengkapan biodata (No HP & Alamat).

## 3. Authentication Flows

### A. The "Red-Carpet" Super Admin Flow
- **Trigger:** Sign-Up via Clerk (Portal Internal `/2026` atau Utama).
- **Webhook Logic:** 
  - Mengekstrak email pendaftar.
  - Memeriksa kecocokan dengan `process.env.SUPER_ADMIN_EMAILS` (comma-separated string).
  - Jika cocok, simpan ke database dengan `role: 'SUPER_ADMIN'`.
- **Routing Logic:** Pasca-login, sistem mendeteksi role `SUPER_ADMIN` dan langsung mengarahkan (redirect) pengguna ke `/2026/dashboard`. Bypass form kelengkapan biodata secara mutlak.

### B. The Public Member Flow
- **Trigger:** Sign-Up via Halaman Publik (Landing Page).
- **Webhook Logic:** Email tidak ada di `.env`, otomatis mendapatkan `role: 'MEMBER'`.
- **Routing Logic:** Pasca-login, sistem mendeteksi role `MEMBER`.
  - Check database: Jika `phone` atau `address` bernilai `null`.
  - Redirect ke `/lengkapi-biodata`.
  - Jika sudah lengkap, redirect ke `/member/dashboard`.

### C. The Closed-Door Staff Flow (Kasir & PT)
- **Trigger:** Pembuatan akun HANYA dilakukan melalui Dashboard SUPER_ADMIN menggunakan Clerk Backend API (User Creation).
- **Portal Akses:** `/2026`.
- **Flow:** Staff hanya melakukan **Sign-In**. Tidak ada jalur Sign-Up untuk role ini. Pasca-login, redirect sesuai dashboard role masing-masing (e.g., `/2026/kasir` atau `/2026/trainer`).

## 4. Technical Implementation Tasks for AI Agent
1.  **Update Prisma Schema:** Pastikan tabel `User` memiliki enum Role dan field `phone`, `address` (nullable).
2.  **Create Clerk Webhook Handler:** Buat file `api/webhooks/clerk/route.ts` untuk menangani event `user.created`. Implementasikan logika split string `.env` untuk validasi `SUPER_ADMIN`.
3.  **Implement Smart Router:** Buat Middleware atau penengah di route `/` (setelah sukses login) yang bertugas sebagai "Traffic Light" pengecek role database dan melakukan redirect ke URL yang tepat sesuai ketentuan di atas.
4.  **Guard Internal Routes:** Lindungi layout `/2026` agar jika `MEMBER` mencoba mengakses URL tersebut, mereka otomatis di-redirect kembali ke halaman publik dengan gracefully (tanpa error crash).