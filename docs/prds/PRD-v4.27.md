# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.27 (Pro UI Redesign & Dashboard Metric Wiring)
**Module:** Member PT UI & Admin Dashboard

## 1. Problem Statement
1. **Unprofessional/Bulky UI:** The current PT schedule cards are massive, chunky vertical blocks. The user wants a "Pro" look without having to design it themselves. The card needs to be converted into a sleek, premium horizontal list-view card (similar to modern flight/hotel booking apps).
2. **Dashboard Disconnected:** The Admin Dashboard shows "0 Sesi" under "Sesi PT Hari Ini" despite schedules existing in the database. The metric is either hardcoded or querying legacy decoupled data.

## 2. Required Action Plan for AI Agent
Execute the following updates strictly without outputting raw code:

### A. UI Redesign: Pro Horizontal Card (Member App)
- Open the Member PT Schedule UI component.
- **Change Card Container:** Convert the outer container to a full-width horizontal layout with a clean white background. 
  `className="relative flex flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 w-full mb-3"`
- **Left Column (Info):**
  - Create a flex-col container for the left side.
  - Date: `text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-1`
  - Time: `text-lg font-black text-gray-800`
  - Trainer: `text-xs font-medium text-gray-500 mt-1` (Example: "Trainer: Prana")
- **Right Column (Price & Action):**
  - Create a flex-col container for the right side, aligned to the right (`items-end`).
  - Strikethrough Price (if discount): `text-[10px] text-gray-400 line-through`
  - Final Price: `text-lg font-extrabold text-emerald-600`
  - Capacity Pill: `mt-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-100`
- **Discount Badge (Top Left Corner):**
  - Reposition the red discount badge to slightly overlap the top-left edge of the white card.
  - `absolute -top-2 -left-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm`

### B. Dashboard "Sesi" Metric Wiring
- Open the Admin Dashboard server component/action (e.g., `app/2026/dashboard/page.tsx` or wherever the dashboard metrics are fetched).
- Locate the query for "Sesi PT Hari Ini" (Today's PT Sessions).
- Wire it up using Prisma `count`:
  - Calculate `startOfDay` and `endOfDay` for the selected date filter (or just today).
  - Query: `const totalSesiHariIni = await prisma.pTScheduleSlot.count({ where: { targetDate: { gte: startOfDay, lte: endOfDay } } });`
- Pass this `totalSesiHariIni` variable into the Dashboard UI card to replace the hardcoded `0`.

## 3. Expected Outcome
The Member UI is instantly transformed into a highly professional, compact, and elegant list-view. It looks like a premium SaaS application. The Admin Dashboard "Sesi PT Hari Ini" accurately reflects the true count of PT slots created for that specific day, directly from the database.