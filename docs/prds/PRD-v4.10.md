# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.10 (Admin PT Slot Creation Redundancy & Specificity Fix)
**Module:** Admin Personal Trainer Management (`app/2026/personal-trainer`)

## 1. Problem Statement
The Admin UI for managing Personal Trainers is visually and logically redundant. Currently, both the "Pengaturan Master" (Global Settings) and the "Kelola Slot Jadwal PT" (Slot Creation) sections use generic Day-of-the-Week toggles (Senin-Minggu). The user explicitly requires the "Kelola Slot" section to use specific calendar dates (Date/Month/Year) instead of generic days to allow for precise PT shift scheduling, eliminating the redundancy.

## 2. Root Cause Analysis
The "Kelola Slot" UI was built on a recurring weekly template model rather than a specific date model. The AI updated the Member booking UI with a DatePicker previously, but neglected to update the Admin's Slot Creation UI to also operate on specific dates.

## 3. Required Action Plan for AI Agent
Please implement the following UI and logic changes immediately to resolve the redundancy:

### A. Remove Redundant UI in "Kelola Slot"
- Open the Admin PT management page (e.g., `app/2026/personal-trainer/ClassesClient.tsx` or similar).
- In the "Kelola Slot Jadwal PT" card, **completely remove** the "Pilih Hari" toggle buttons (Senin, Selasa, Rabu, etc.). Leave the top "Pengaturan Master" section untouched (it acts as the global operational template).

### B. Introduce Specific Date Picker
- Replace the removed Day toggles in the "Kelola Slot" section with a standard native `<input type="date" />` component.
- The Admin must now explicitly pick a specific calendar date (e.g., July 15, 2026) to create a PT slot, alongside the existing "Mulai", "Selesai", "Kuota", and "Nama PT" fields.

### C. Update the Display Table & DB Logic
- Ensure the state handler captures the specific date from the new `<input type="date" />`.
- Update the table at the bottom of the page: The "HARI" column should be renamed to "TANGGAL" (Date) and format the output to show the specific date (e.g., "Senin, 15 Jul 2026") instead of just the generic day name.
- Ensure the payload sent to the backend saves this exact `DateTime` to the database, ensuring perfect synchronization with the Member frontend (which is already filtering by specific target dates).

## 4. Expected Outcome
The redundancy is eliminated. The top section handles global gym availability templates, while the bottom section handles specific, date-based shift creation for PTs using a native calendar input. The created slots in the table clearly display specific dates.