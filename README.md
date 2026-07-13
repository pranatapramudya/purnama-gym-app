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

## 📁 Folder Structure
- `/app` - Next.js App Router (Pages, API, Webhooks)
- `/components` - Reusable UI components (Shadcn UI ready)
- `/docs/prds` - Dokumentasi PRD
- `/lib` - Core configurations (Prisma Client, dll.)
- `/prisma` - Database schema and configurations

## 🌟 Fitur Utama & Pembaruan Terkini (Versi 4.49)
*Sistem kini beroperasi penuh dengan skalabilitas tingkat Enterprise:*
**User Roles yang Didukung:** Member, Admin, Superadmin, dan Trainer.

### 📱 Enterprise UI/UX & Arsitektur Responsif
1. **Mobile-First Data Architecture:** Data tables dynamically transform into stacked cards on mobile devices to prevent horizontal scrolling.
2. **Global Responsive Pagination:** Intelligent data slicing adapting to screen sizes (10 rows on desktop, 5 on mobile) to ensure optimal DOM performance.
3. **Smart Session Lifecycle:** Automated, time-based session completion (`Auto-Selesai`) using server-side local timezone validation (Asia/Jakarta).
4. **Real-Time Quota Tracking:** Immediate visual feedback on schedule capacity versus active bookings.

### ⚡ Core Features

1. **Sistem Harga Dinamis (Snapshot Slot Pricing):** Manajemen harga PT tidak lagi menggunakan master global. Setiap slot memiliki harga dan diskon independen yang disimpan sebagai *snapshot* (Immutable Pricing), mencegah kebocoran data harga (*Ghost Pricing*) di frontend.
2. **Universal QR Code & Pemindai Biodata Pintar:** ID Member (misal: `M-RGAO`) dipetakan dalam QR Code dinamis berbasis URL. Scanner internal cerdas mendeteksi QR, melakukan pencarian ke *database* (`endsWith` fallback), dan memunculkan Kartu Biodata interaktif (Nama, Status VIP, Notifikasi Sesi PT) sekaligus mencatat riwayat Check-in.
3. **Analitik Dashboard Real-Time (Zona Waktu WIB):** Metrik operasional (Pendapatan, Jumlah Check-in, Sesi PT) dihitung sangat akurat dengan kalibrasi batas zona waktu (`Asia/Jakarta`), mencegah *bug offset* UTC pada larut malam.
4. **Antarmuka (UI/UX) Pro-Level:** Kartu Member PT dengan hierarki tipografi premium, transisi desain list-view modern, *backdrop blur*, dan stiker diskon interaktif.
5. **Autentikasi & Routing Cerdas:** *Hidden Trigger* di *footer* publik untuk login rahasia admin. Pemisahan tata letak (Nested Layout B2B SaaS) antara portal kasir dan dasbor *mobile-first* member.
6. **Bypass Keterbatasan IAM (Clerk):** *Custom Onboarding Flow* menyimpan atribut krusial (`phoneNumber`, `address`) langsung ke Neon DB menggunakan operasi *Atomic Upsert* yang tangguh terhadap `Unique constraint failed`.
7. **Modul Point-of-Sale (POS) Hibrida:** Proses *checkout* paket langganan dan kelas PT dikelola secara *Offline-First*. Pembayaran diproses di meja Kasir untuk menekan biaya potongan *Payment Gateway*.
8. **Proteksi Anti Double-Booking & Anti-Looping:** Logika backend mengunci tombol pembelian jika status VIP aktif, dan *greyed-out* slot waktu PT jika kuota maksimum (`maxCapacity`) telah terpenuhi.

## 🛡 License
Premium License - Personal and Commercial use for your own SaaS products.

Built with ❤️ by S.Kom Dev in Sumedang | 2026