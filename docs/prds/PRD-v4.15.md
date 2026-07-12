# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.15 (Real-time Capacity Tracking & UI Polish)
**Module:** Member PT Booking Frontend & Server Actions

## 1. Problem Statement
The PT Booking UI is looking great, but requires two final adjustments:
1. **Redundant Label:** The label "Pilih Tanggal Sesi PT" directly above the calendar input is visually redundant and takes up unnecessary vertical space. The user wants it removed for a cleaner UI.
2. **Missing Real-time Capacity:** The Admin sets a `maxCapacity` (Kuota) for each PT slot, but the frontend currently does not display how many people have actually booked that slot. The user wants a real-time indicator on the green schedule card showing the current fill rate (e.g., "Terisi 1/5" or "Sisa Kuota: 4"), ensuring it perfectly mirrors the real-time database state.

## 2. Root Cause Analysis
- The frontend UI component simply hardcoded or left the label above the DatePicker.
- The `getAvailablePTSlots` server action fetches the schedule data but is likely not joining/counting the active `Booking` or `Transaction` relations tied to that specific slot to calculate the current occupancy.

## 3. Required Action Plan for AI Agent
Execute the following updates directly into the codebase without outputting raw code to the user:

### A. UI Polish (Label Removal)
- Open the Member PT Schedule UI component.
- Locate the `<input type="date" />` component.
- **Remove** the text label/header "Pilih Tanggal Sesi PT" (and its associated icon if any) that sits right above the date input to achieve a cleaner, minimalist card look.

### B. Backend Capacity Query
- Open the server action `getAvailablePTSlots` (likely in `app/actions/pt.ts`).
- Update the Prisma `findMany` query for the slots. Include a relational count to tally how many successful/active bookings exist for each slot.
  - *Hint:* Use `include: { _count: { select: { bookings: true } } }` or similar, depending on your exact Prisma schema, ensuring you only count valid/paid bookings if applicable.

### C. Frontend Card Real-time Display
- Pass the calculated `currentBookings` (or `_count.bookings`) and the `maxCapacity` down to the green slot card UI.
- On the green card, add a small, legible text indicator reflecting the capacity. Example format: `Terisi: 1/5 Orang`.
- **Full Capacity State:** Add conditional styling. If `currentBookings >= maxCapacity`, visually disable the card (e.g., turn it gray or red, lower opacity), change the text to "KOUTA PENUH", and disable the `onClick` event so the user cannot proceed to checkout.

### D. Server-Side Protection
- In your `bookPTSession` or checkout server action, add a strict validation check right before creating the database record: Query the current booking count for the targeted slot. If it has reached `maxCapacity`, throw an error (`"Mohon maaf, slot ini baru saja penuh."`) to prevent race-condition overbooking.

## 4. Expected Outcome
The Member UI is cleaner without the redundant date label. Every PT slot card displays real-time capacity (e.g., 2/5). When a slot fills up, it automatically becomes unclickable and displays a "Full" state, strictly enforced by backend validation.