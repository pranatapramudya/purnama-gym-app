# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.13 (Frontend Date Binding Force-Fix & Admin Master UI Simplification)
**Module:** Member PT Booking Frontend & Admin Settings

## 1. Problem Statement
1. **Admin UI Redundancy:** The "Pengaturan Master Ketersediaan & Harga PT" section currently displays toggles for "Hari Operasional PT" and inputs for "Jam Buka/Tutup Sesi". Since scheduling is now strictly handled by specific dates in the "Kelola Slot" section below it, these global day/time master settings are redundant and confusing. The user wants them removed entirely, leaving ONLY the "Harga Per Sesi" (Price) setting in this top section.
2. **Frontend UI Bug:** The Member PT Schedule cards and the Checkout modal are STILL displaying the legacy generic `dayOfWeek` (e.g., "MINGGU") instead of the specific `targetDate` (e.g., "Minggu, 15 Juli 2026"). The previous frontend data binding failed.

## 2. Required Action Plan for AI Agent
Please execute the following strict updates directly in the codebase:

### A. Admin UI Simplification (App/2026/personal-trainer)
- Open the Master Settings component (e.g., `ClassesClient.tsx` or similar).
- Locate the "Pengaturan Master Ketersediaan & Harga PT" card.
- **DELETE** the UI elements for "Hari Operasional PT" (the Monday-Sunday toggles).
- **DELETE** the UI elements for "Jam Buka Sesi" and "Jam Tutup Sesi".
- Keep **ONLY** the "Harga Per Sesi" input field and the "Simpan Pengaturan" button.
- Update the server action triggered by this save button so it only updates the master price, completely ignoring the deleted day/time fields.

### B. Frontend Schedule Cards Date Forcing (Member App)
- Open the Member PT Schedule UI where the cards are rendered.
- Replace the legacy day rendering (`slot.dayOfWeek`) with the actual specific date.
- Parse `slot.targetDate` and format it locally in Indonesian (e.g., `Minggu, 15 Juli 2026`). If `slot.targetDate` is somehow null, gracefully fallback to `slot.dayOfWeek`, but prioritize `targetDate`.
- Example format output requirement: "15 JULI 2026" or "Senin, 15 Jul 2026".

### C. Checkout Modal Fix
- Open the `Checkout Booking` modal component.
- Ensure the selected slot's `targetDate` is correctly passed into this modal.
- Change the row `Jadwal: Minggu, 09:00 - 18:00` to correctly output the specific date: `Jadwal: Minggu, 15 Juli 2026, 09:00 - 18:00`.

## 3. Expected Outcome
The Admin top section acts purely as a Global Price setter. The Member app schedule cards clearly state the exact specific dates available. The Checkout modal mirrors this exact specific date to avoid any customer confusion.