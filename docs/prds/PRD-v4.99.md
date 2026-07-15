# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.99 (Structured PDF Auto-Print for Transactions)
**Modules Affected:** Transaction Management Page (`/2026/transaksi`).

## 1. Problem Statement
The client requires a transaction report that has the structured, tabular layout of an Excel file, but is generated as a PDF that automatically opens the browser's print preview. The native `window.print()` renders responsive mobile cards (which is messy for physical reports), and the Excel export requires an extra step to open. We need a direct-to-PDF table generation.

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code in your response. Implement the logic directly using PDF generation libraries.

### A. Setup PDF Libraries
- Install the required libraries: `npm install jspdf jspdf-autotable`.

### B. Update "Cetak Laporan" Button Logic
- Revert the button from the Excel export function and bind it to a new function: `handlePrintPDF`.

### C. Implement `handlePrintPDF` Function
- Capture the **currently filtered** transactions array (respecting the Date Range and active Status tab).
- Initialize a new jsPDF document: `const doc = new jsPDF();`
- Add a professional header text to the document (e.g., "Laporan Transaksi Purnama Gym" and the selected Date Range).
- Map the filtered data into an array of arrays for the table body.
- Use `autoTable` from `jspdf-autotable` to generate a clean, structured table.
  - **Headers:** `['No', 'ID Transaksi', 'Member', 'Paket', 'Nominal', 'Metode', 'Status', 'Waktu']`
  - Ensure the table styling is professional (e.g., using a clean grid theme).
- **Crucial UX Step:** Instead of just saving the file (`doc.save`), output the PDF to a Blob URL and open it in a new tab, OR use `doc.autoPrint()` followed by `doc.output('dataurlnewwindow')` so it instantly triggers the browser's native print dialog with the clean table layout.

## 3. Expected Outcome
When "Cetak Laporan" is clicked, a PDF containing a perfectly formatted table (bypassing the frontend responsive UI) is generated on the fly. It immediately opens in a new tab or triggers the print dialog, providing the cashier/admin with a 1-click print experience.