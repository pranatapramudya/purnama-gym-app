# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.62 (Active Session Future Monitoring & Calendar UI)
**Module:** `ClassesClient.tsx` (Monitoring Sesi Tab)

## 1. Problem Statement
The "Monitoring Sesi" tab currently hardcodes the active session display strictly to "Hari Ini" (Today). If an admin creates a future PT schedule (e.g., for Wednesday), it completely disappears from the active monitoring view until that day arrives. This causes user panic ("missing data") and prevents cashiers from checking slot availability for upcoming days. 

## 2. Required Action Plan for AI Agent
Execute the following UI and data-fetching upgrades to enable future date monitoring. **Do NOT output raw code blocks; apply the fixes directly to the codebase.**

### A. Inject a Date Picker for Active Sessions
- Open `ClassesClient.tsx`.
- Locate the title `<h3>Sesi Hari Ini <Badge>{count}</Badge></h3>` inside the "Monitoring Sesi" tab.
- Add a Date Picker input component next to this title (or align it to the right side of the header). This allows admins to select any specific date to view its schedules.
- Create a local state (e.g., `monitoringDate`) initialized to `new Date()`.

### B. Dynamic UI & Query Sync
- **Dynamic Title:** Change the hardcoded "Sesi Hari Ini" text to be dynamic. If `monitoringDate` is today, show "Sesi Hari Ini". If it's another date, format it cleanly (e.g., "Sesi: 15 Jul 2026").
- **Timezone-Safe Data Fetching:** Pass this `monitoringDate` state to the active sessions fetching logic. Ensure you apply the strict `Asia/Jakarta` timezone boundaries (`startOfDay` to `endOfDay`) to fetch the available slots exactly for the selected date.
- Wrap the state update in `React.startTransition` so navigating between days feels instant and doesn't freeze the UI.

## 3. Expected Outcome
The "Monitoring Sesi" view is no longer trapped in the present day. Admins can seamlessly use the calendar date picker to look ahead to tomorrow, next week, or next month, and instantly see the correct active PT slots (like the Wednesday, 15 Jul 2026 slot) available for booking.