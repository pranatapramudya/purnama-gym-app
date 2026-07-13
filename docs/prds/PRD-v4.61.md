# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.61 (Global Sequential Numbering & Pagination-Aware Indexing)
**Module:** `TransaksiClient.tsx`, `CashflowClient.tsx` (Buku Kas), & `ClassesClient.tsx` (Personal Trainer)

## 1. Problem Statement
1. **Lack of List Readability:** The financial tables (Manajemen Transaksi & Buku Kas) lack a sequential numbering column ("NO"). In the Transaksi table, reading the raw Prisma CUIDs (e.g., `cmrhw2...`) is visually overwhelming for cashiers.
2. **Missing Ordering in PT Module:** The Personal Trainer lists (sessions/trainers) do not indicate their creation order. When multiple trainers exist, the Super User cannot easily distinguish them sequentially.
3. **Pagination Constraint:** Since global pagination is active, a naive `index + 1` mapping will incorrectly reset to 1 on page 2. The numbering must be mathematically aware of the current page.

## 2. Required Action Plan for AI Agent
Execute the following UI updates and mathematical implementations directly into the codebase. **Do NOT output raw code blocks; apply the logic systematically.**

### A. Implement Pagination-Aware Numbering Logic
- In any mapped array that utilizes the `useResponsivePagination` hook, the numbering calculation MUST follow this exact formula:
  `const displayIndex = (currentPage - 1) * itemsPerPage + index + 1;`

### B. Update Financial Tables (Transaksi & Buku Kas)
- **Table Headers:** Open `TransaksiClient.tsx` and `CashflowClient.tsx`. Add a new table header `<th>NO</th>` at the very beginning of the table (leftmost column).
- **Table Body:** Inside the `paginatedData.map((item, index) => ...)` loop, inject a new `<td>` as the first column.
- Render the `displayIndex` calculated using the formula above.
- Make the number slightly muted or bold (e.g., `text-slate-500 font-medium`) so it looks clean.

### C. Update Personal Trainer Module
- Open the component managing the Personal Trainer lists (e.g., `ClassesClient.tsx` or the Master Jadwal component).
- Locate the mapped lists for Trainers and Sessions.
- Prepend the sequential number directly next to the Trainer's or Session's Name. 
- Example format: `#{displayIndex}. Pranata Pramudya` or `1. Pranata Pramudya`.
- Ensure this numbering applies to both the desktop table views and the mobile card views.

## 3. Expected Outcome
All financial tables now feature a clean "NO" column at the far left, allowing admins to instantly see the row count. The Personal Trainer module now clearly labels trainers and sessions with numbers based on their input order. Most importantly, navigating to Page 2 or Page 3 of any list will seamlessly continue the numbering (e.g., 11, 12, 13...) without resetting to 1, providing a flawless Enterprise UX.