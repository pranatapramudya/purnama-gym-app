# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.80 (Enterprise Cashflow Audit & PWA Force-Standalone)
**Module:** `CashflowClient.tsx` (Buku Kas), Prisma Schema, & `next.config.js`

## 1. Problem Statement
1. **PWA Standalone Failure:** The application still shows the Chrome address bar on mobile devices. A Service Worker integration is required to force mobile browsers to recognize the app as a fully installable PWA.
2. **Missing Audit Trail in Cashflow:** The "Buku Kas" (Cashflow) table currently lacks strict auditing capabilities. Expenses ("Keluar") must include uploaded photographic evidence (receipts/kwitansi). 
3. **Missing CRUD & RBAC:** Cashiers cannot edit mistakes, and there is no UI to modify or delete transactions. Furthermore, deleting or modifying a cashflow record must be strictly guarded and only visible/executable by a `SUPER_ADMIN` (Super User/Owner).

## 2. Required Action Plan for AI Agent
Execute the following updates directly into the codebase. **All UI text MUST be generated in Indonesian.** Do not output raw code blocks; apply the logic systematically.

### A. Force PWA via Service Worker
- Install a PWA wrapper for Next.js (e.g., `@ducanh2912/next-pwa` or `next-pwa`).
- Update `next.config.js` to wrap the configuration with the PWA plugin, pointing to the `public` directory and enabling `register: true` and `skipWaiting: true`.

### B. Database Schema Update (Prisma)
- Open `schema.prisma`.
- Locate the model handling Buku Kas / Cashflow.
- Add a new field: `buktiKwitansi String?` (to store the image URL of the receipt).
- Run `npx prisma db push` and `npx prisma generate` to sync the database.

### C. Update Buku Kas UI & Roles (`CashflowClient.tsx`)
- **Table Columns:** Based on `image_7be463.png`, add two new columns to the far right: `BUKTI` and `AKSI`.
- **Receipt Upload (Bukti Kwitansi):** 
  - In the "Catat Transaksi" modal, dynamically show a File Upload input **only if** the transaction type is "Pengeluaran" (Keluar).
  - In the table, if `buktiKwitansi` exists, display a small "Lihat Bukti" button/icon that opens the image in a modal.
- **Edit & Delete Actions (RBAC Guard):**
  - Fetch the current user's role from the session/Clerk.
  - In the `AKSI` column, render an "Edit" (icon pencil) button for all users to fix minor input mistakes.
  - Render a "Hapus/Batal" (icon trash) button **ONLY IF** the user's role is `SUPER_ADMIN`. If the role is `MEMBER` or `STAFF`, hide the delete button completely to prevent unauthorized data removal.

### D. Server Actions
- Create/update server actions to handle the editing of `nominal` and `keterangan`.
- Enforce backend role validation inside the "Delete" server action: `if (userRole !== 'SUPER_ADMIN') throw new Error('Akses ditolak: Hanya Owner yang bisa menghapus data.');`

## 3. Expected Outcome
The application installs perfectly without a browser UI. The Buku Kas is upgraded to corporate standards: expenses require receipt photos, mistakes can be edited, and transaction deletion is strictly locked behind a Super User approval layer, preventing cashier fraud.