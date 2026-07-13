# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.43 (Session UI Consolidation & Today's Schedule Hydration)
**Module:** `PersonalTrainerClient.tsx` & Corresponding Server Data Fetching

## 1. Problem Statement
1. **Redundant UI Sections:** The "Monitoring Sesi" tab currently displays both "Sesi Aktif (Sedang Berjalan)" and "Sesi Hari Ini". This is visually redundant and confusing. The user wants to merge this concept: retain ONLY "Sesi Hari Ini" as the single source of truth for the daily schedule.
2. **Missing Data / Query Not Hooked Up:** The "Sesi Hari Ini" section always shows `0` and an empty state, even when the Super User has actively created PT schedule slots for the current date. Only the "Booking Baru" section is correctly fetching data. The Prisma query for today's existing schedules is either missing, misconfigured, or failing timezone boundaries.

## 2. Required Action Plan for AI Agent
Execute the following logic and UI updates. **Do NOT output raw code blocks in your response; apply the fixes directly to the codebase.**

### A. Eliminate Redundancy (UI Cleanup)
- Open the `PersonalTrainerClient.tsx` (or the specific component handling the "Monitoring Sesi" tab).
- **Completely delete** the "Sesi Aktif (Sedang Berjalan)" section, including its heading, counter badge, and empty state card.
- Keep "Sesi Hari Ini" as the primary section at the top of the tab, followed by "Booking Baru".

### B. Fix Prisma Query for "Sesi Hari Ini"
- Open the Server Component (`page.tsx`) that fetches data for the Personal Trainer management view.
- Ensure there is a specific Prisma query fetching schedules/sessions intended for today.
- **Timezone Safety (WIB):** To accurately fetch "Today's" schedules, construct the query using the start and end boundaries of the current date in the local timezone (`Asia/Jakarta`). 
  - Example logic: Find records where the schedule date is `>= startOfToday` and `<= endOfToday`.
- Include related data in the query (e.g., if a member has booked the slot, include the member's details).

### C. Hydrate the UI
- Pass the fetched array of today's schedules down to the Client Component as a prop (e.g., `todaySessions`).
- Update the "Sesi Hari Ini" section to map over this `todaySessions` array instead of displaying the hardcoded empty state.
- For each item, display:
  - The time of the session (e.g., `08:00 - 09:00 WIB`).
  - The Member's name (if booked) or a "Slot Tersedia" status.
  - A dynamic status badge (e.g., "Selesai", "Menunggu", or "Sedang Berjalan" if the current time falls within the slot).

## 3. Expected Outcome
The "Monitoring Sesi" tab is now streamlined, displaying only "Sesi Hari Ini" and "Booking Baru". "Sesi Hari Ini" accurately fetches and displays any schedule created by the Super User for the current day, mapping the real data seamlessly into the UI.