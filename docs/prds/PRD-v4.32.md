# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.32 (Mobile Checkout UI Fix & Public Verification Page)
**Module:** Member Checkout UI & Public `/verify/[id]` Route

## 1. Problem Statement
1. **Z-Index/Padding Bug on Mobile:** The Checkout Modal on the mobile view has its bottom buttons (specifically "Bayar Online") obscured by the fixed Bottom Navigation Bar. 
2. **404 on QR External Scan:** The QR code correctly contains the production URL (e.g., `.../verify/PRN-K87VZ6`). However, scanning this with a standard phone camera opens the browser to a 404 page because the dynamic `/verify/[memberCode]` route does not exist yet.

## 2. Required Action Plan for AI Agent
Execute the following updates to ensure mobile responsiveness and route completeness:

### A. Fix Mobile Checkout Modal
- Open the Checkout Modal component (`BookingClient` or similar).
- Add sufficient bottom padding to the modal's container to ensure the buttons sit above the bottom navigation bar. 
- Example fix: Add `pb-24` to the modal content container, OR ensure the modal wrapper has a `z-[9999]` index so it sits on top of the bottom navigation bar if it's meant to be a full-screen or bottom-sheet overlay.

### B. Create Public Verification Route
- Create a new directory and page: `app/verify/[memberCode]/page.tsx`.
- **Server-Side Logic:**
  - This is a public page. Receive `params.memberCode`.
  - Query the database: `prisma.user.findUnique({ where: { memberCode: params.memberCode } })`.
- **UI Implementation (Digital Member Card):**
  - If the user is NOT found: Return a sleek 404-style centered UI saying "Data Member Tidak Ditemukan atau Tidak Valid."
  - If the user IS found: Render a premium, standalone "Digital Biodata Card".
  - Use a dark theme container. Display the Gym's Logo/Name at the top.
  - Display the `memberCode` prominently.
  - Display the User's Name (`name`).
  - Display a shiny badge for their role/status (e.g., VIP Member).
  - Add a button at the bottom: "Kembali ke Aplikasi" which redirects to the homepage `/`.

## 3. Expected Outcome
On mobile, the Checkout Modal buttons are fully clickable and no longer blocked by the navigation bar. Scanning a member's QR code with a standard iOS/Android camera will redirect to a beautiful, public-facing digital profile card, acting as a valid external verification method for the gym.