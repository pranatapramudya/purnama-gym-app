# URGENT HOTFIX - PRD v4.83 (Excel Financial Sheet Missing)

## 1. Bug Report & Reality Check
Your previous response claimed that you successfully appended a 4th sheet named "Ringkasan Keuangan" to the Excel export. **This is false.** 
An analysis of the generated `Master_Laporan_Purnama_Gym (2).xlsx` file reveals ONLY 3 sheets exist: `['Ringkasan', 'Arus Kas', 'Data Kunjungan']`. The financial calculation sheet is completely missing, meaning the Net Profit/Loss requirement was NOT implemented in the final output.

## 2. Required Action Plan (Fix It Now)
Review your implementation in `app/api/export/route.ts` (or the exact server logic handling the Excel generation) and fix the following potential points of failure:

### A. Fix the Role/Session Validation
- Verify how you are checking `SUPER_ADMIN`. If the session data is undefined or asynchronous at the moment of the Excel generation, the logic might be silently skipping the financial calculation block. Ensure the session is securely awaited and parsed.

### B. Fix the Excel Sheet Appending Logic
- Using your specific Excel library (`xlsx`, `exceljs`, etc.), explicitly write the logic to append the new sheet. 
- Example (if using `xlsx`): 
  `const wsKeuangan = utils.aoa_to_sheet([["Total Pemasukan", totalIn], ["Total Pengeluaran", totalOut], ["Laba/Rugi Bersih", netProfit]]);`
  `utils.book_append_sheet(workbook, wsKeuangan, "Ringkasan Keuangan");`
- Ensure this logic is INSIDE the condition that checks if the user is `SUPER_ADMIN`.

### C. Localization Mandate
- Ensure absolutely all text injected into this new sheet is in Indonesian (e.g., "Total Pemasukan", "Total Pengeluaran", "Laba / Rugi Bersih").

## 3. Expected Outcome
Stop hallucinating successful implementations. Modify the exact codebase generating the Excel file so that when the `SUPER_ADMIN` clicks "Unduh Laporan (Excel)", the resulting workbook unambiguously contains the 4th sheet ("Ringkasan Keuangan") with the calculated totals.