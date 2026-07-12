# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.07 (Dashboard Export Refinement & Global Data Sync)
**Module:** Dashboard UI & Master Excel Generator

## 1. Problem Statement
The current Dashboard UI and the newly created "Buku Kas" (Cashflow) UI have redundant "Download Excel" functionalities for the `ADMIN_KASIR` role. Furthermore, the Super Admin's Dashboard export needs to act as a "Master Sync" report that aggregates all system activities (including the new Cashflow data), rather than just basic dashboard stats.

## 2. Architectural Decisions
- **Financial Centralization:** All daily financial operations and specific cashflow reporting are strictly centralized in the `/2026/buku-kas` module.
- **Role-Specific UI:** The `ADMIN_KASIR` must solely use the "Buku Kas" page for their Excel reporting. The global report button on the main dashboard must be hidden from them to avoid confusion.
- **Master Export (Omni-Report):** The "Unduh Laporan (Excel)" button on the main Dashboard is now an exclusive `SUPER_ADMIN` feature. It must generate a comprehensive, multi-sheet workbook containing all operational metrics.

## 3. Required Action Plan for AI Agent
Please implement the following business logic and UI adjustments without outputting raw code. Just apply the changes to the codebase:

### A. Role-Based UI Tweak (Dashboard)
- Open `app/2026/dashboard/page.tsx` (or wherever the Dashboard layout is defined).
- Locate the "Unduh Laporan (Excel)" button at the top right.
- Modify the conditional rendering so that this button is **ONLY visible to `SUPER_ADMIN`**. It must be strictly hidden if the user's role is `ADMIN_KASIR`.

### B. Super Admin Master Export Engine
- Upgrade the function triggered by the Dashboard's "Unduh Laporan (Excel)" button.
- Instead of downloading a simple single-sheet CSV/Excel, use your Excel library (e.g., `xlsx` or `exceljs`) to generate a multi-sheet Workbook.
- **Sync the data by querying the database for:**
  1. **Sheet 1 (Ringkasan/Stats):** Overall check-ins, active members, PT sessions.
  2. **Sheet 2 (Arus Kas):** Full sync of the `Cashflow` table data (Pemasukan, Pengeluaran, Saldo, Kasir in charge, Date).
  3. **Sheet 3 (Data Kunjungan):** Recent member check-ins log.
- Ensure dates are properly formatted to the local timezone.

### C. Verify "Buku Kas" Autonomy
- Ensure the `/2026/buku-kas` page remains fully accessible to both `ADMIN_KASIR` and `SUPER_ADMIN`.
- Ensure the "Unduh Excel" button inside the Buku Kas page remains strictly focused on downloading *only* the financial ledger data for that specific time filter.

## 4. Expected Outcome
When an `ADMIN_KASIR` logs into the Dashboard, they see a clean stats view without the global Excel download button. They do their reporting in Buku Kas. 
When a `SUPER_ADMIN` logs in, they see the "Unduh Laporan (Excel)" button on the Dashboard. Clicking it generates a master Excel file containing multiple organized tabs (Sheets) that perfectly syncs operations and finances into one unified report.