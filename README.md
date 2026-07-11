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

## 🌟 Recent Updates (Phase 3.95 - Final Sprint)
*Pembaruan arsitektur dan optimasi fitur terbaru untuk skala Enterprise:*
**User Roles yang Didukung:** Member, Admin, Super User, dan Trainer.
1. **Autentikasi & Routing:** Perbaikan *redirect* pasca-login (langsung menuju Dashboard) dan implementasi *Hidden Trigger* (pintu masuk tersembunyi via Footer) untuk akses Login Admin (*Split-Screen*).
2. **Arsitektur Layout:** Pemisahan total *Nested Layout* (B2B SaaS Sidebar) antara area Member dan Admin.
3. **Optimasi Performa Frontend:** Transisi global dari tag HTML `<a>` menuju komponen `next/link` untuk navigasi bebas *reload* super cepat, dilengkapi dengan *Skeleton Loading* (`loading.tsx`).
4. **UI/UX Responsif (Admin):** Pola adaptif "Table-to-Card" untuk seluruh tabel data agar ramah seluler (*mobile-friendly*) tanpa *horizontal scroll* yang mengganggu.
5. **Database & Bypass Clerk Pro:** Penambahan kolom profil spesifik (`phoneNumber` & `address`) dengan alur *Custom Onboarding Flow* adaptif, menghilangkan ketergantungan pada fitur berbayar Clerk.
6. **Robust Data Sync (Upsert):** Imunisasi terhadap error `Unique constraint failed` melalui sinkronisasi database (Prisma) berbasis `upsert` dan injeksi Nama lengkap secara otomatis.
7. **Dynamic UI & Business Logic:**
   - E-Card QR Code dinamis berbasis "Black Card" eksklusif untuk keanggotaan VIP.
   - Proteksi *Anti-Looping* pintar (disabling button otomatis) untuk menghindari transaksi berulang saat status VIP masih aktif.
   - *Conditional rendering* super rapi di UI Beranda (menyembunyikan atribut kedaluwarsa untuk Non-Member).
   - Mode aman "Edit/Read-Only" interaktif pada formulir Profil pengguna.
8. **Modul Personal Trainer (O2O Lifecycle):** Sistem manajemen jadwal PT dengan siklus PENDING -> CONFIRMED -> ONGOING -> COMPLETED, didukung form *Point of Sale* (POS) untuk input pembayaran manual kasir.
9. **Manajemen Ketersediaan & Slot PT:** Superadmin memiliki kendali atas Master Jadwal PT (Hari, Jam, Harga, & Assignment Trainer) yang secara cerdas mengubah UI ketersediaan di Frontend (*greyed out* jika bentrok/terisi).

## 🛡 License
Premium License - Personal and Commercial use for your own SaaS products.

Built with ❤️ by S.Kom Dev in Sumedang | 2026