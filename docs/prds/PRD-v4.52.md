# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.52 (Aggregated Period Filters for Scanner & PT History)
**Module:** `ScannerClient.tsx` & `PersonalTrainerClient.tsx`

## 1. Problem Statement
The history sections in the Scanner QR module ("Riwayat Check-in Hari Ini") and Personal Trainer module ("Sesi Hari Ini" / "Sesi Selesai") are strictly hardcoded to display only the current day's data. To perform proper operational reporting and payroll calculations, the user requires an aggregated "Period Filter" (Hari Ini, Minggu Ini, Bulan Ini) to instantly view historical data summaries and lists for broader timeframes.

## 2. Required Action Plan for AI Agent
Execute the following feature implementations seamlessly. **Do NOT output raw code blocks; apply the structural and data-fetching logic directly to the codebase.**

### A. Inject Period Filter UI
- Open `ScannerClient.tsx` and `PersonalTrainerClient.tsx`.
- Near the title of the history lists (e.g., above "Riwayat Check-in" or "Sesi Selesai"), inject a UI Filter Dropdown or a Button Group (Tabs) with the following options:
  1. **Hari Ini** (Today)
  2. **Minggu Ini** (This Week)
  3. **Bulan Ini** (This Month)
  4. **Semua** (All Time)
- Create a local React state (e.g., `activePeriod`) to track the selected filter.
- **Performance:** Use `React.useTransition` when updating this state to ensure the UI doesn't freeze when the user clicks a new period that requires fetching a large amount of data (like a whole month).

### B. Dynamic Prisma Query Logic
- Update the data fetching functions (Server Actions or API Routes) that supply data to these two pages. They must now accept the `activePeriod` parameter.
- Utilize a date library (like `date-fns` or native JS dates) strictly localized to `Asia/Jakarta` (WIB) to construct the query boundaries:
  - `Hari Ini`: `startOfToday` to `endOfToday`.
  - `Minggu Ini`: `startOfWeek` (Monday) to `endOfWeek` (Sunday).
  - `Bulan Ini`: `startOfMonth` to `endOfMonth`.
  - `Semua`: No date boundary filters.
- Ensure the Prisma query returns all records matching these extended ranges.

### C. Dynamic UI Updates
- **Dynamic Titles:** The section titles must react to the state. Example: If "Bulan Ini" is selected, the title should dynamically change to "Riwayat Check-in Bulan Ini" or "Sesi Selesai Bulan Ini".
- **Dynamic Counters:** Explicitly show the total count of the fetched array at the top of the list (e.g., "Total: 145 scan tercatat" or "Total: 30 sesi selesai").
- Ensure the Global Pagination (implemented previously) remains intact and paginates this newly expanded data properly (5 items on mobile, 10 on desktop).

## 3. Expected Outcome
Supervisors and Admins can now instantly toggle between Today, This Week, This Month, and All-Time views within the Scanner and PT modules. The UI will instantly reflect the aggregated total counts and paginate the historical lists accurately, transforming the modules into powerful operational reporting tools.