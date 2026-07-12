# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.09 (PT Booking Flow Specificity & Admin UI Consistency)
**Module:** Member PT Booking & Admin Personal Trainer Settings

## 1. Problem Statement
There are two critical user experience issues in the Personal Trainer booking flow:
1. **Frontend (Member App):** When a member selects a PT schedule and proceeds to checkout, the system only displays the generic day (e.g., "Senin, 06:30 - 21:00"). It lacks a specific calendar date selection (Date, Month, Year). This causes ambiguity regarding which exact date the booking is for.
2. **Admin Portal (Kelola Slot Jadwal PT):** The time input fields ("Mulai" and "Selesai") use a basic time input model. The user prefers the advanced, visually appealing circular clock picker UI currently being used in the "Pengaturan Master Ketersediaan" section ("Jam Buka Sesi" & "Jam Tutup Sesi").

## 2. Root Cause Analysis
- **Data Model/UI Missing:** The booking flow relies on a weekly recurring schedule template (Days of the week) but lacks a calendar DatePicker on the frontend to map that generic day to a specific operational date.
- **Inconsistent UI Components:** Different time input components were used in the same module. The "Kelola Slot" section did not reuse the premium TimePicker component implemented in the Master Settings.

## 3. Required Action Plan for AI Agent
Please execute the following updates without outputting raw code. Implement the logic and UI changes directly in the codebase:

### A. Frontend Booking Specificity (Date Picker Integration)
- Update the Member's PT Schedule page (`app/(member)/jadwal-pt` or similar).
- Before or during the selection of a PT schedule slot, introduce a **Calendar / Date Picker** component.
- The member must select an exact date (e.g., 15 Juli 2026).
- The system should dynamically filter the available PT slots based on the selected specific date (mapping the date to the correct day of the week, e.g., showing Monday slots if the selected date is a Monday).
- Pass this exact specific date to the Checkout UI and save it to the database during the transaction, so the final receipt shows: `Senin, 15 Juli 2026, 06:30 - 21:00`.

### B. Admin Time Picker UI Upgrade
- Open the Admin Personal Trainer management page (`app/2026/personal-trainer/page.tsx` or similar).
- Identify the UI component used for "Jam Buka Sesi" and "Jam Tutup Sesi" (the one featuring the circular clock interface).
- Replace the basic time inputs for "Mulai" and "Selesai" in the "Kelola Slot Jadwal PT" card with this exact same premium TimePicker component.
- Ensure the state management (`onChange` handlers) for these new time pickers correctly updates the slot creation payload.

### C. Backend Database Sync
- Ensure the Prisma model for `Booking` or `Transaction` is updated (if not already) to accept a specific `DateTime` representing the exact booked date, rather than just a string of the day.

## 4. Expected Outcome
Members will now select a specific calendar date (Hari, Tanggal, Bulan, Tahun) before booking, eliminating scheduling confusion at checkout. On the Admin side, creating specific slots uses the premium, consistent circular clock picker UI, creating a highly polished experience.