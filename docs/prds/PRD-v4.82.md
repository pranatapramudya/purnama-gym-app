# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.82 (Super User Excel Financial Report & Profit/Loss Calculation)
**Module:** `DashboardClient.tsx` (Dashboard) & Excel Generation Service/Action

## 1. Problem Statement
The current Excel export function from the Dashboard ("Unduh Laporan (Excel)") needs to provide a comprehensive financial bottom line (Net Profit/Loss). However, this sensitive financial data must be strictly isolated: 
1. Only the `SUPER_ADMIN` (Owner) should have access to the Profit/Loss calculation via the downloaded Excel file.
2. The frontend "Buku Kas" (Cashflow) UI must **NOT** display the Net Profit/Loss to prevent cashiers from viewing the gym's net margins.

## 2. Required Action Plan for AI Agent
Do not generate raw code blocks. Implement the logic directly into the application based on these strict directives. **All UI and Excel text must be in Indonesian.**

### A. RBAC Security on Export API / Server Action
- Locate the server-side logic responsible for generating the Excel file (triggered by the "Unduh Laporan (Excel)" button on the Dashboard).
- Implement a strict Role-Based Access Control (RBAC) check: verify the session user is `SUPER_ADMIN`. (If other roles are allowed to download basic reports, ensure the Profit/Loss summary is ONLY injected if the user is `SUPER_ADMIN`).

### B. Excel Generation & Profit/Loss Calculation Logic
Using your current Excel generation library (e.g., `xlsx` or `exceljs`), construct the report with the following structure:
- **Transaction Data:** Fetch all cashflow records (Masuk & Keluar) based on the selected date range.
- **Calculate Totals:** 
  - Compute `Total Pemasukan` (Sum of all INCOME nominals).
  - Compute `Total Pengeluaran` (Sum of all EXPENSE nominals).
  - Compute `Laba / Rugi Bersih` (Net Profit = Total Pemasukan - Total Pengeluaran).
- **Inject into Excel:** Append a "Summary" section at the bottom of the Excel sheet (or on a dedicated second sheet named "Ringkasan Keuangan").
  - Row 1: `Total Pemasukan: [Value]`
  - Row 2: `Total Pengeluaran: [Value]`
  - Row 3: `Laba/Rugi Bersih: [Value]` (Format as Currency/Rupiah).

### C. Strict Negative Constraint (Frontend UI)
- **DO NOT** modify the `CashflowClient.tsx` (Buku Kas) UI to show Profit/Loss. Keep the current design exactly as it is (showing only Pemasukan, Pengeluaran, and Saldo Bersih from the till). The Profit/Loss metric is strictly for the Excel report exported from the Dashboard.

## 3. Expected Outcome
When a Super User clicks "Unduh Laporan (Excel)" on the Dashboard, the resulting `.xlsx` file cleanly lists all transactions and includes an accurate financial summary at the bottom detailing Total Income, Total Expense, and Net Profit/Loss. The frontend Cashflow UI remains securely abstracted from cashiers.