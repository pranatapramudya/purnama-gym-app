# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.97 (Transaction Report Print & Export Feature)
**Modules Affected:** Transaction Management Page (`/2026/transaksi` or equivalent) and Print Stylesheets.

## 1. Problem Statement
The Transaction Management dashboard currently features a Date Range Picker and Status filter tabs. However, it lacks an export or print functionality. Both `SUPER_ADMIN` and `ADMIN_KASIR` roles require the ability to generate a daily or periodic transaction report (Rekapan Transaksi) based on the currently applied filters.

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code. Implement the feature directly into the relevant transaction table component.

### A. UI Addition: "Cetak Laporan" Button
- Locate the Transaction Management page component (referencing the UI with the "Pilih Rentang Tanggal" picker).
- Add a new primary or secondary button labeled **"Cetak Laporan"** (Print Report) adjacent to the Date Range Picker.
- Ensure this button is fully visible and accessible to both `SUPER_ADMIN` and `ADMIN_KASIR` roles.

### B. Implement Print / Export Logic
Implement one (or both) of the following reporting methods depending on the current table architecture:
1. **Direct Browser Print (`window.print()`):**
   - Bind an `onClick` event to trigger `window.print()`.
   - **Crucial:** Inject a `@media print` CSS utility (e.g., using Tailwind's `print:` modifiers) to ensure the printed document is clean.
   - Hide the sidebar navigation, top navigation, and filter buttons during printing (`print:hidden`).
   - Only print the Page Title, the active Date Range text, and the Transaction Table itself.
   - Ensure the table expands to full width on paper (`print:w-full`).
2. **CSV Export (Alternative/Addition):**
   - If direct printing is complex due to layout constraints, implement a CSV export function.
   - The function must map over the *currently filtered* data array (respecting the selected date and active tab) and generate a `.csv` file.
   - Name the file dynamically, e.g., `Laporan_Transaksi_Purnama_Gym_[DATE].csv`.

### C. Data Context Awareness
- The print or export function MUST respect the active filters. If the user selects "Pending" and a specific week, only those specific rows should be sent to the printer or CSV.

## 3. Expected Outcome
The admin or cashier can filter transactions by a specific date range, click the "Cetak Laporan" button, and immediately receive a clean, physical-ready printout or a CSV file containing only the relevant filtered data.