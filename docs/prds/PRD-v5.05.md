# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 5.05 (Structured PDF Auto-Print for Completed PT Sessions)
**Modules Affected:** PT Session Management Dashboard (`/2026/sesi-pt` or equivalent).

## 1. Problem Statement
The PT Session Management dashboard includes a Date Range Picker for the "Sesi Selesai" (Completed Sessions) widget. However, administrators lack a way to export this data. A PDF report is strictly required for HR and payroll purposes (calculating trainer commissions based on completed sessions). 

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code. Implement the logic using the exact same `jspdf` and `jspdf-autotable` architecture previously successfully deployed for financial transactions.

### A. UI Addition: "Cetak Laporan PT" Button
- Locate the "Sesi Selesai" section in the PT Session Dashboard.
- Add a new "Cetak Laporan" button adjacent to the Date Range Picker for this specific section.

### B. Implement `handlePrintPTSessions` Function
- Capture the **currently filtered** array of *completed* PT sessions based on the active date range.
- Initialize a new jsPDF document.
- Add a professional header: "Laporan Sesi Personal Trainer - Purnama Gym" along with the selected Date Range.
- Map the data into an array of arrays for the table body.
- Use `autoTable` to generate a structured grid.
  - **Recommended Headers:** `['No', 'ID Booking', 'Nama Member', 'Nama Trainer', 'Paket Latihan', 'Waktu Selesai']`
- Execute the same direct-to-print logic used in the Transaction page: Use `doc.autoPrint()` and output the Blob URL to instantly open the browser's native print preview with the tabular data.

## 3. Expected Outcome
Administrators can filter completed PT sessions by a specific week or month, click "Cetak Laporan", and immediately receive a clean, tabular PDF ready for printing. This standardizes the reporting flow across both financial and operational modules.