# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.98 (Excel Export functionality for Transactions)
**Modules Affected:** Transaction Management Page (`/2026/transaksi`).

## 1. Problem Statement
The current "Cetak Laporan" button utilizes the browser's native `window.print()` method. As seen in recent testing, the print stylesheet renders the data in a stacked/responsive card format rather than a clean data table, making it unsuitable for financial reporting. The business requirement is to export the currently filtered transactions directly into a structured Excel (`.xlsx`) file.

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code in your response. Implement the logic directly into the project using client-side Excel generation.

### A. Setup Excel Export Library
- Install the `xlsx` library (SheetJS) via npm/pnpm if it is not already installed (`npm install xlsx`).

### B. Update "Cetak Laporan" Button Logic
- Locate the "Cetak Laporan" button in the Transaction Management component.
- Replace the existing `window.print()` onClick handler with a new function: `handleExportExcel`.

### C. Implement `handleExportExcel` Function
- Capture the **currently filtered** transactions array (respecting the selected date range and active status tab).
- Map the data into a flat array of objects suitable for an Excel sheet. Use clear, professional column headers.
  - **Headers mapping example:**
    - `No`: Index + 1
    - `ID Transaksi`: Transaction ID
    - `Nama Member`: Member Name
    - `Paket`: Package Name
    - `Nominal`: Formatted amount (e.g., 150500)
    - `Metode`: Payment Method (Tunai/Transfer)
    - `Status`: Transaction Status
    - `Tanggal`: Formatted Date
- Create a new workbook and worksheet using `XLSX.utils.json_to_sheet`.
- Auto-size the columns if possible for better readability.
- Trigger the file download using `XLSX.writeFile`.
- Dynamically name the file (e.g., `Laporan_Transaksi_Purnama_Gym_[YYYY-MM-DD].xlsx`).

## 3. Expected Outcome
When the user clicks "Cetak Laporan", the application will instantly generate and download an `.xlsx` file containing a cleanly structured table of the currently filtered transactions, completely bypassing the messy browser print dialog.