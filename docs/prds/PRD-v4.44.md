# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.44 (Auto-Complete Sessions & Real-time Quota Tracking)
**Module:** `PersonalTrainerClient.tsx` & Session Server Logic

## 1. Problem Statement
1. **Missing Quota Visibility:** The "Sesi Hari Ini" cards currently display individual bookings but fail to show the relationship to the Master Schedule's capacity. The PT needs to see the real-time quota utilization (e.g., "1/10 Terdaftar") to know how full a specific time slot is based on confirmed incoming bookings.
2. **Manual Completion Bottleneck:** Sessions currently require the PT to manually click a "Selesai" (Complete) button. For operational efficiency, if the current real-world time surpasses the session's designated `endTime`, the system should automatically mark the session as completed without human intervention.

## 2. Required Action Plan for AI Agent
Execute the following advanced logic integrations. **Do NOT output raw code blocks; apply the logic seamlessly into the components and data fetching functions.**

### A. Implement Real-Time Quota Tracking
- Open the server-side query that fetches data for "Sesi Hari Ini".
- Ensure the query joins/includes the Master Schedule Slot data (which contains the `maxCapacity` or quota field).
- Calculate the `currentBookedCount` by counting how many active/confirmed bookings belong to that specific Master Slot for the current date.
- **UI Update:** Inject a visual badge or text on the "Sesi Hari Ini" card displaying the quota. Example: `Terdaftar: {currentBookedCount} / {maxCapacity}`. Place this near the time or status so the PT immediately knows the slot's occupancy.

### B. Implement Time-Based Auto-Completion (Auto-Selesai)
- Locate the mapping logic where the fetched sessions are prepared for the "Sesi Hari Ini" UI.
- **Time Comparison Logic:** Create a dynamic check comparing the current local time (WIB / Asia/Jakarta) against the session's `endTime`. 
  - `const isPastEndTime = currentTime > sessionEndTime;`
- **Dynamic Override:** If `isPastEndTime` evaluates to `true`:
  1. Dynamically override the display status of the card to `"Selesai"`.
  2. Hide the "Konfirmasi" or any action buttons (since the session is already over).
  3. *(Optional but Recommended)*: Trigger a silent background Prisma update to change the DB status to "COMPLETED" if it isn't already, ensuring data consistency.

## 3. Expected Outcome
The PT dashboard becomes highly automated. The "Sesi Hari Ini" cards now clearly show how many members are registered versus the maximum slot capacity. Furthermore, any session whose end time has passed will automatically transition to a "Selesai" state on the UI, removing the administrative burden from the Personal Trainers.