# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.12 (Frontend TargetDate Binding & Master Settings State Fix)
**Module:** Member PT Booking Frontend & Admin Master Settings

## 1. Problem Statement
The recent backend migration to specific dates (`targetDate`) for PT slots was successful in the database and Admin creation UI, but created three downstream bugs:
1. **Frontend Display:** The member-facing PT schedule list still renders the legacy generic day string (e.g., "Senin") instead of formatting and displaying the new `targetDate` (e.g., "15 Juli 2026").
2. **Checkout Bug:** The booking checkout flow relies on the old data structure, causing bugs/failures when confirming the transaction because it is not passing or displaying the specific `targetDate`.
3. **Admin Master Settings Missing Data:** In the "Pengaturan Master Ketersediaan & Harga PT", upon page load, only the "Harga" (Price) successfully populates the UI. The operational days (Senin-Minggu) and Operational Hours (Jam Buka/Tutup) do not display their saved states.

## 2. Root Cause Analysis
- **Frontend:** The mapping function in the frontend UI is still targeting `slot.dayOfWeek` instead of checking for and formatting `slot.targetDate`. The checkout payload is structurally mismatched with the new strict date requirement.
- **Admin Settings:** The `useEffect` or initial state hydration logic that loads the Master Settings from the database into the client component is failing to bind the `operationalDays`, `openTime`, and `closeTime` variables to the UI inputs, likely due to a missing property mapping or state initialization error.

## 3. Required Action Plan for AI Agent
Execute the following fixes across the frontend and admin panels:

### A. Frontend Data Binding & Formatting
- Open the Member PT Schedule UI (`app/(member)/jadwal-pt/...`).
- Update the render logic: If a slot has a `targetDate`, format it cleanly in Indonesian (e.g., using `date-fns` with `id` locale, or native `Intl.DateTimeFormat` to show "Senin, 15 Juli 2026").
- **Checkout Flow:** Ensure the data passed into the Checkout component (and ultimately sent to the `bookPTSession` Server Action) strictly references the slot's ID and accurately displays the exact `targetDate` to the user so there is no ambiguity.

### B. Admin Master Settings State Hydration
- Open `app/2026/personal-trainer/ClassesClient.tsx` (or where the Master Settings form lives).
- Inspect the function that fetches the master settings on component mount (e.g., `fetchMasterSettings`).
- Ensure that the response from the server is correctly setting ALL states, not just `setPrice(data.price)`.
- You must explicitly bind the state setters for the days and times:
  - e.g., `setSelectedDays(data.operationalDays)`
  - e.g., `setOpenTime(data.openTime)`
  - e.g., `setCloseTime(data.closeTime)`
- Ensure the server action that saves this form also successfully saves all 4 fields to the database.

## 4. Expected Outcome
When a member views the PT schedule and goes to checkout, they see the exact specific date and time they are booking, and the transaction completes without invalid payload errors. When the Admin reloads the PT Management page, the Master Settings section fully repopulates the previously saved Price, Active Days, and Open/Close times correctly.