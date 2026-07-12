# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.11 (Zod Validation Hotfix & Number Input UI Polish)
**Module:** Admin PT Slot Management & Server Actions

## 1. Problem Statement
The user reported two issues after the recent V4.10 implementation:
1. **Validation Crash:** Submitting the "Tambah Slot" form throws a server error: `Invalid... data: { dayOfWeek: "Senin", targetDate: ... }`. The payload is being rejected by the Server Action's schema validator because the new `targetDate` field is not recognized.
2. **UI/UX Input Annoyance:** The "Maksimal Member (Kuota)" field forces the user to use the browser's default scroll/spin buttons (up/down arrows) instead of allowing clean, direct numeric typing. 

## 2. Root Cause Analysis
- **Crash:** The AI updated the Prisma schema with `targetDate`, but forgot to update the corresponding Zod validation schema inside the Server Action (`app/actions/admin.ts` or similar). The strict validator is rejecting the unknown field.
- **UI:** The input uses `<input type="number">` without CSS rules to hide the default webkit spin buttons.

## 3. Required Action Plan for AI Agent
Please execute the following fixes immediately without outputting raw code:

### A. Fix Server Action Validation (Zod)
- Open the file handling the PT Slot creation (e.g., `app/actions/admin.ts` or wherever `createPTScheduleSlot` is located).
- Locate the Zod schema used to validate the incoming form data (e.g., `const CreateSlotSchema = z.object({ ... })`).
- Add `targetDate: z.string().optional()` or `targetDate: z.date().optional()` (depending on how the frontend sends it) to the schema so it perfectly matches the new payload.
- *Self-Correction Check:* If you haven't run `npx prisma generate` after the last schema update, please ensure the local Prisma Client is updated so it recognizes the new field natively.

### B. Polish the Kuota Input (Remove Spinners)
- Open `app/2026/personal-trainer/ClassesClient.tsx` (or the relevant UI file).
- Locate the "Maksimal Member (Kuota)" input field.
- **Fix Option 1 (CSS):** Keep `type="number"` but add Tailwind classes to hide the arrows: `[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`.
- **Fix Option 2 (Text Mode):** Change it to `<input type="text" inputMode="numeric" pattern="[0-9]*" />` so it behaves like a clean text box that only accepts numbers (and triggers the numpad on mobile).
- Apply whichever option works best with your current UI library to ensure the user can just type the number directly without seeing arrows.

## 4. Expected Outcome
The Admin can seamlessly type a number into the Kuota field without any scrolling arrows appearing. Clicking "Tambah Slot" successfully validates the `targetDate`, saves the record to the database, and reloads the table without throwing an `Invalid` server error.