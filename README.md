# 🚀 Purnama Gym - Sistem Manajemen Keanggotaan & Kasir
Sistem informasi manajemen gym modern khusus wanita di Sumedang, dilengkapi dengan fitur booking kelas, membership VIP, dan pemindai QR Code.

## 🛠 Tech Stack
- Framework: Next.js 15+ (App Router)
- Styling: Tailwind CSS
- Authentication: Clerk (Social Login, MFA Ready)
- Database: Neon DB (Serverless PostgreSQL)
- ORM: Prisma 7+ with PgAdapter
- Icons: Lucide React

## 🚀 Quick Start
Follow these steps to get your project up and running:

### 1. Installation
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and add your credentials (refer to `.env.example`):

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database (Neon DB - Use Pooled Connection)
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"

# Clerk Webhook (Required for User Sync)
CLERK_WEBHOOK_SECRET=whsec_...

# Cloudinary (Secure Cloud Image Storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset # Must be an Unsigned preset
```

### 3. Database Sync (Wajib dilakukan setelah update skema)
Sangat penting untuk menjalankan perintah berikut agar Prisma Client tersinkronisasi dengan skema `shortId` dan `maxCapacity` terbaru, serta memperbarui struktur tabel di database Anda:
```bash
npx prisma format
npx prisma generate
npx prisma db push
```

### 4. Clerk Webhook Setup (Crucial)
To ensure user data synchronizes automatically with your database:
- Navigate to Clerk Dashboard > Webhooks.
- Add a new Endpoint: `https://your-domain.com/api/webhooks/clerk`.
- Select the following events: `user.created`, `user.updated`.
- Copy the Signing Secret and paste it into `CLERK_WEBHOOK_SECRET` in your `.env`.

### 5. Run Development Server
```bash
npm run dev
```

## 🧪 Testing Infrastructure
Purnama Gym utilizes a robust, dual-layered automated testing strategy to guarantee software quality and prevent regressions.

### Unit & Component Testing
We use **Jest** and **React Testing Library** for isolated, fast execution of component rendering and utility logic.
- **Run Unit Tests:** `npm run test`

### End-to-End (E2E) & RBAC Testing
We use **Playwright** to simulate real user flows, including complex Role-Based Access Control (RBAC) boundaries (e.g., verifying `MEMBER` vs `SUPER_ADMIN` restrictions) and API interceptions.
- **Run E2E Tests:** `npm run test:e2e`

> **⚠️ IMPORTANT:** 
> - Before running E2E tests, ensure your local development server (port 3000) is either stopped or running a fully clean build (delete `.next` cache if you recently modified `proxy.ts`). Playwright will automatically spin up a test instance.
> - The framework uses `@next/env` and Prisma in `e2e/global-setup.ts` to automatically seed mock user profiles into your database before tests begin.

## 📁 Folder Structure
- `/app` - Next.js App Router (Pages, API, Webhooks)
- `/components` - Reusable UI components (Shadcn UI ready)
- `/docs/prds` - Dokumentasi PRD
- `/lib` - Core configurations (Prisma Client, dll.)
- `/prisma` - Database schema and configurations

## 🌟 Fitur Utama & Pembaruan Terkini (Versi 4.86)
*Sistem kini beroperasi penuh dengan skalabilitas tingkat Enterprise:*
**User Roles yang Didukung:** Member, Admin, Superadmin, dan Trainer.

### 📱 Enterprise UI/UX & Arsitektur Responsif
1. **Mobile-First Data Architecture:** Data tables dynamically transform into stacked cards on mobile devices to prevent horizontal scrolling.
2. **Global Responsive Pagination:** Intelligent data slicing adapting to screen sizes (10 rows on desktop, 5 on mobile) to ensure optimal DOM performance.
3. **Smart Session Lifecycle:** Automated, time-based session completion (`Auto-Selesai`) using server-side local timezone validation (Asia/Jakarta).
4. **Real-Time Quota Tracking:** Immediate visual feedback on schedule capacity versus active bookings.

### ⚡ Core Features

1. **Unified Member CRM:** Centralized management for both long-term VIPs and 1-Day Daily Visits ("Visit Harian") with an integrated profile sync/biodata viewer to prevent data entry redundancy at the cashier.
2. **Future Session Monitoring:** Advanced calendar integration in the Personal Trainer module, allowing admins to break out of the "Today-only" view and monitor/manage slot availability for future dates.
3. **Dynamic Sales Channels:** Dedicated CRUD pipeline for "Visit Harian" alongside VIP packages, mapped seamlessly to the frontend Member app.
4. **Advanced Operational Reporting:** Dynamic period filters (Hari Ini, Minggu Ini, Bulan Ini, Semua) for Scanner and PT modules, providing instant historical summaries and aggregated counts.
2. **Timezone Resiliency:** Strict server-side `Asia/Jakarta` (UTC+7) enforcement to prevent data-bleeding and date-offset bugs typical in UTC-default serverless environments (like Vercel).
3. **Sistem Harga Dinamis (Snapshot Slot Pricing):** Manajemen harga PT tidak lagi menggunakan master global. Setiap slot memiliki harga dan diskon independen yang disimpan sebagai *snapshot* (Immutable Pricing), mencegah kebocoran data harga (*Ghost Pricing*) di frontend.
4. **Universal QR Code & Pemindai Biodata Pintar:** ID Member (misal: `M-RGAO`) dipetakan dalam QR Code dinamis berbasis URL. Scanner internal cerdas mendeteksi QR, melakukan pencarian ke *database* (`endsWith` fallback), dan memunculkan Kartu Biodata interaktif (Nama, Status VIP, Notifikasi Sesi PT) sekaligus mencatat riwayat Check-in.
5. **Analitik Dashboard Real-Time (Zona Waktu WIB):** Metrik operasional (Pendapatan, Jumlah Check-in, Sesi PT) dihitung sangat akurat dengan kalibrasi batas zona waktu (`Asia/Jakarta`), mencegah *bug offset* UTC pada larut malam.
6. **Antarmuka (UI/UX) Pro-Level:** Kartu Member PT dengan hierarki tipografi premium, transisi desain list-view modern, *backdrop blur*, dan stiker diskon interaktif.
7. **Autentikasi & Routing Cerdas:** *Hidden Trigger* di *footer* publik untuk login rahasia admin. Pemisahan tata letak (Nested Layout B2B SaaS) antara portal kasir dan dasbor *mobile-first* member.
8. **Bypass Keterbatasan IAM (Clerk):** *Custom Onboarding Flow* menyimpan atribut krusial (`phoneNumber`, `address`) langsung ke Neon DB menggunakan operasi *Atomic Upsert* yang tangguh terhadap `Unique constraint failed`.
9. **Modul Point-of-Sale (POS) Hibrida:** Proses *checkout* paket langganan dan kelas PT dikelola secara *Offline-First*. Pembayaran diproses di meja Kasir untuk menekan biaya potongan *Payment Gateway*.
10. **Proteksi Anti Double-Booking & Anti-Looping:** Logika backend mengunci tombol pembelian jika status VIP aktif, dan *greyed-out* slot waktu PT jika kuota maksimum (`maxCapacity`) telah terpenuhi.
11. **Secure Cloud Image Storage (Receipts/Kwitansi):** Penyimpanan bukti transaksi yang aman menggunakan Cloudinary REST API, dilengkapi dengan kompresi Canvas di sisi klien untuk efisiensi penyimpanan (< 300KB).
12. **Advanced Financial Reporting:** Pembuatan laporan Excel dinamis yang mengkalkulasi Laba/Rugi Bersih (Net Profit/Loss). Fitur ini diamankan oleh RBAC ketat (Hanya bisa diakses `SUPER_ADMIN`).
13. **Modern Global Date Range Picker:** Implementasi *date picker* lokal (Bahasa Indonesia) yang responsif dengan filter dinamis dan grafik otomatis yang beradaptasi (berdasarkan Jam/Hari/Bulan).

## 🛡 License
Premium License - Personal and Commercial use for your own SaaS products.

Built with ❤️ by S.Kom Dev in Sumedang | 2026