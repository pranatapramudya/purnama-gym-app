# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 5.06 (PDF AutoTable Turbopack Hotfix & Empty State Guard)
**Modules Affected:** `app/2026/personal-trainer/ClassesClient.tsx`.

## 1. Problem Statement
The `handlePrintPTSessions` function is throwing a `Runtime TypeError: doc.autoTable is not a function`. This is caused by using the deprecated monkey-patched invocation `(doc as any).autoTable` which conflicts with Next.js strict module resolution (Turbopack). Furthermore, the function attempts to generate a PDF even when the filtered sessions array is empty, which is illogical and causes silent failures or wasted processing.

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code. Apply the fixes directly to the specified file.

### A. Fix jsPDF-AutoTable Import & Invocation
- At the top of `ClassesClient.tsx`, ensure `autoTable` is explicitly imported: `import autoTable from 'jspdf-autotable';`.
- Locate the `handlePrintPTSessions` function.
- **Action:** Remove the `(doc as any).autoTable({ ... })` block entirely.
- Replace it with the standard, modern functional invocation: 
  `autoTable(doc, { head: [tableColumn], body: tableRows, startY: 28 });`

### B. Implement Empty State Guard Clause
- At the very beginning of the `handlePrintPTSessions` function (before initializing `new jsPDF()`), add a strict check to evaluate the length of the filtered data array.
- **Action:** If the data array is empty (`length === 0`), trigger a UI toast notification (if a toast library is available) or a standard `alert('Tidak ada data sesi untuk dicetak pada rentang tanggal ini.')`.
- Immediately `return;` after the alert to exit the function, preventing the PDF generation from executing on empty data.

## 3. Expected Outcome
The PDF generation works flawlessly under Turbopack without TypeErrors. If a Super Admin attempts to print a date range with zero completed sessions, they receive a polite alert instead of an application crash.