# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.84 (Global Modern Date Range Picker Integration)
**Modules Affected:** Dashboard, Scanner QR, Personal Trainer, Transaksi, Buku Kas.

## 1. Problem Statement
The current date filtering mechanism relies on fragmented static components (dropdowns and segmented pill buttons like "Hari Ini", "Minggu Ini", "Bulan Ini", "Semua"). This limits user flexibility for custom date ranges and creates an inconsistent UI across different pages. We need to replace all of these with a unified, modern, interactive Calendar Date Range Picker.

## 2. Required Action Plan for AI Agent
Do not generate raw code blocks in your response. Apply these architectural changes directly to the codebase. **Ensure all UI text, calendar months, and days are localized to Indonesian (id).**

### A. Create a Reusable Modern Component
- Implement a modern `<DateRangePicker />` component. (Highly recommended to use `shadcn/ui` Date Picker with Range, which utilizes `react-day-picker` and `date-fns`).
- The component must allow the user to select a `from` and `to` date on a visual calendar popup.
- Set the `date-fns` locale to `id` (Indonesian) so the months read as "Januari, Februari" etc.
- When no date is selected, display a placeholder like: "Pilih Rentang Tanggal" accompanied by a Calendar Icon (`lucide-react`).

### B. Global UI Replacement
Locate the existing simple date filters (dropdowns and segmented buttons) and replace them with the new `<DateRangePicker />` in the following specific client components:
1. `DashboardClient.tsx` (Dashboard)
2. `ScannerClient.tsx` (Scanner QR)
3. `TrainerClient.tsx` or equivalent (Personal Trainer - Sesi Selesai Hari Ini)
4. `TransactionClient.tsx` (Transaksi)
5. `CashflowClient.tsx` (Buku Kas)

### C. State Management & Data Fetching Updates
- Update the local state or URL Search Parameters in each module to handle a date range object `{ from: Date | undefined, to: Date | undefined }` instead of a static string.
- **CRITICAL BACKEND FIX:** Update the corresponding data fetching logic (Prisma queries) in every module to filter by this new exact range. Use Prisma's `gte` (greater than or equal to `from` date at 00:00:00) and `lte` (less than or equal to `to` date at 23:59:59).

### D. UX Enhancements (Optional but expected)
- Implement quick-select preset buttons *inside* the calendar popover sidebar (e.g., "Hari Ini", "7 Hari Terakhir", "Bulan Ini", "Semua Waktu") to retain the speed of the old UI while offering the flexibility of the new one.

## 3. Expected Outcome
Across all 5 specified pages, the old date selectors are completely removed and replaced by a sleek, modern calendar button. Clicking it opens a visual calendar allowing precise start and end date selections. The charts, tables, and data dynamically react to the chosen custom date range with total accuracy.