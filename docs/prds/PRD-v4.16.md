# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.16 (Frontend Calendar Removal & Global Schedule Feed)
**Module:** Member PT Booking Frontend & Server Actions

## 1. Problem Statement
The capacity tracking and "KUOTA PENUH" UI are working perfectly. However, the user wants to completely remove the `<input type="date">` (Calendar Picker) from the Member frontend. Instead of forcing members to filter by a specific date, the application should simply display a continuous, scrollable feed of all upcoming available PT schedules, starting from today onwards.

## 2. Root Cause Analysis
The current frontend architecture forces a date state (e.g., `selectedDate`) and passes it to the backend to fetch slots strictly for that one day. By removing the date picker, the query must be updated to handle a broader time horizon (all upcoming slots).

## 3. Required Action Plan for AI Agent
Execute the following updates directly into the codebase without outputting raw code to the user:

### A. Frontend UI Polish (Remove Calendar)
- Open the Member PT Schedule UI component (`app/(member)/jadwal-pt/...`).
- Completely **DELETE** the `<input type="date">` element and its wrapping card container. 
- Remove any local state management (e.g., `useState`) that was holding the selected date for this calendar.

### B. Modify Frontend Fetch Logic
- Update the `useEffect` or data-fetching call in the frontend. It should no longer pass a specific day to the server action. 
- Call `getAvailablePTSlots()` without restrictive single-day parameters.

### C. Backend Query Upgrade (Global Feed)
- Open `app/actions/pt.ts` (or wherever `getAvailablePTSlots` is located).
- Update the Prisma `findMany` query:
  - If no specific date is passed, set the query to fetch **ALL** slots where the `targetDate` is greater than or equal to the start of the CURRENT day (`targetDate: { gte: startOfToday }`).
  - **CRITICAL:** Add an `orderBy` clause to sort the results chronologically so they display neatly for the user.
    - Sort primarily by `targetDate` (ASC).
    - Sort secondarily by `startTime` (ASC).
- Maintain the relational `_count` logic for the bookings so the "KUOTA PENUH" feature continues to work perfectly.

## 4. Expected Outcome
When a member visits the "Jadwal PT" page, there is no calendar input. They immediately see a beautifully sorted list of green schedule cards for all upcoming dates (e.g., July 12, July 13, July 15) sorted perfectly by day and time. The "KUOTA PENUH" logic remains intact.