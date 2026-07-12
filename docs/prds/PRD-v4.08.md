# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.08 (Excel Aesthetic & Accounting Formatting Polish)
**Module:** Export Endpoints (`/api/export` & `/api/export-cashflow`)

## 1. Problem Statement
The Excel export logic for both the Cashier's "Buku Kas" and the Super Admin's "Master Dashboard" successfully retrieves all data (including Pemasukan and Pengeluaran). However, the generated Excel files output raw data strings. The user specifically requested: "format excel sudah rapi!" (The Excel format must be exceptionally neat and visually professional).

## 2. Root Cause Analysis
Libraries like `xlsx` output plain text by default unless specific cell formatting (Number Formats, Column Widths, Header Styles) is explicitly applied to the worksheet object before generating the buffer.

## 3. Required Action Plan for AI Agent
Please update the Excel generation logic in both `app/api/export/route.ts` (Master Export) and `app/api/export-cashflow/route.ts` (Cashier Ledger). Do not alter the Prisma queries; focus purely on the visual output of the Excel files.

### A. Apply Column Auto-Sizing (Widths)
- Inject a `!cols` property to all generated worksheets.
- Set generous column widths so text is never truncated. For example:
  - Date/Tanggal: ~20 width
  - Keterangan/Description: ~40 width
  - Nominal/Amount: ~25 width
  - Kasir/Staff: ~25 width

### B. Accounting & Currency Formatting
- Iterate through the "Nominal" or "Amount" columns in the Cashflow/Arus Kas sheets.
- Apply standard accounting number formats to these specific cells. If using `xlsx`, apply a `z` property to the cell object (e.g., `cell.z = '"Rp"#,##0.00'`) so it renders as Indonesian Rupiah automatically in Excel.

### C. Header Row Styling
- The first row (headers) of every sheet must be clearly distinguishable.
- Depending on the library limits, ensure headers are capitalized correctly (e.g., "TANGGAL", "TIPE", "KETERANGAN", "NOMINAL", "KASIR").
- Ensure the "TIPE" column clearly outputs legible string values: "Pemasukan" (for cash in) and "Pengeluaran" (for cash out).

### D. Consistency Across Roles
- Ensure these styling rules are applied identically to the standalone "Buku Kas" export used by the `ADMIN_KASIR` and the "Sheet 2 (Arus Kas)" in the `SUPER_ADMIN` Master Export.

## 4. Expected Outcome
When either the Super Admin or the Cashier clicks "Unduh Excel", the downloaded file opens with perfectly readable columns (no manual dragging required), headers are capitalized and distinct, and all financial figures are strictly formatted as currency (Rp) ready for accounting review.