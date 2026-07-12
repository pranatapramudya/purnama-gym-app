# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.28 (Dashboard Analytics Wiring & Timezone Fix)
**Module:** Admin Dashboard (`app/2026/dashboard/page.tsx` or similar)

## 1. Problem Statement
The Admin Dashboard currently displays "0 Sesi" under the PT Sessions metric. The user is unsure if this is accurately reflecting the database (e.g., 0 sessions *strictly today*) or if the component is just rendering a hardcoded static `0`. 

## 2. Root Cause Analysis
1. **Hardcoded State:** The UI component might still have `<p>0 Sesi</p>` hardcoded instead of dynamically evaluating the fetched data.
2. **Timezone/Query Mismatch:** Prisma stores `DateTime` in UTC. If the dashboard is fetching "Hari Ini" (Today) without properly shifting the start/end bounds to the local timezone (WIB/GMT+7), it might miss slots created for the local day.
3. **Filter Disconnect:** The dashboard likely has a filter dropdown (Hari Ini, Bulan Ini). The query must dynamically respond to this filter.

## 3. Required Action Plan for AI Agent
Execute the following updates directly into the Dashboard server component:

### A. Dynamic Query Integration
- Open the file handling the Dashboard metrics.
- Locate the variable calculating the PT slots. Ensure it uses `prisma.pTScheduleSlot.count()`.
- **Timezone Safety:** When calculating `startOfDay` and `endOfDay` for the filter, ensure you are using a robust date library (like `date-fns` or standard JS `Date`) configured to match the local server time or explicitly shifting it to avoid UTC-offset misses.

### B. UI Wiring
- Pass the calculated `count` variable into the React component.
- **CRITICAL:** Remove any hardcoded `0` in the UI. 
  - Change `<p>0 Sesi</p>` to `<p>{totalSesi} Sesi</p>`.
- Make sure the text dynamically reflects the active filter. If the user selects "Hari Ini", the query counts today's bounds. If "Semua" or "Bulan Ini" is selected, the query bounds should adjust, and the count should increase accordingly.

## 4. Expected Outcome
The Admin Dashboard dynamically injects the true count of `PTScheduleSlot` records from the database based on the selected date filter. If the Admin creates a slot specifically for *today*, the dashboard will instantly update from 0 to 1 upon page refresh.