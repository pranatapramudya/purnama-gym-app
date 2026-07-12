# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.14 (TargetDate Prisma Query Range Fix)
**Module:** Server Actions (`app/actions/pt.ts`)

## 1. Problem Statement
The Admin successfully creates a PT slot mapped to a specific `targetDate` (e.g., July 12, 2026). However, when the Member selects that exact same date on the frontend DatePicker, the schedule does not render. The UI displays the fallback empty state: "Belum ada jadwal yang disediakan...". 

## 2. Root Cause Analysis
This is a classic timezone/DateTime exact-match bug. 
When the frontend passes a date string (e.g., `"2026-07-12"`) to the `getAvailablePTSlots` server action, the Prisma query is likely attempting an exact match (e.g., `where: { targetDate: new Date(dateString) }`). Because Prisma's `DateTime` includes hours, minutes, and UTC offsets, the exact match fails to find the record saved by the Admin.

## 3. Required Action Plan for AI Agent
Please update the Prisma query logic inside the server action without outputting raw code to the user:

### A. Implement Start-of-Day and End-of-Day Range Query
- Open the server action responsible for fetching slots for the member (likely `getAvailablePTSlots` in `app/actions/pt.ts`).
- When parsing the incoming `targetDate` string from the frontend, construct two variables:
  - `startOfDay`: The very beginning of that specific date (00:00:00).
  - `endOfDay`: The very end of that specific date (23:59:59).
- Update the Prisma `findMany` query. Instead of an exact match, use the `gte` (greater than or equal to) and `lte` (less than or equal to) operators for the `targetDate`.
  - Example logic: `where: { targetDate: { gte: startOfDay, lte: endOfDay } }`.

### B. Ignore "Past Time" Strict Filtering for Now
- If there is logic in the query that hides slots where `startTime` is before `new Date()` (the exact current time), please disable it temporarily or ensure it operates correctly within the local timezone context so that slots created for testing purposes (like a 01:00 AM slot) still show up during development testing.

## 4. Expected Outcome
When the member selects "12/07/2026" on the frontend calendar, the system accurately queries the 24-hour range of that date and successfully retrieves the slot created by the Admin, rendering it instantly on the screen for booking.