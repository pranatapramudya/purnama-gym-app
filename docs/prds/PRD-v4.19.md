# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.19 (Prisma Sync & Discount Type Coercion Hotfix)
**Module:** Admin Master Settings & Database

## 1. Problem Statement
The Admin gets a server crash (Red Toast Error) when trying to save the Master Settings. The error log specifically throws an invalid argument error complaining about `'discountPercentage'`. This indicates that the generated Prisma Client does not recognize the field, or the data type being sent (e.g., an empty string from a blank input) is violating the database schema.

## 2. Root Cause Analysis
1. **Prisma Client Out of Sync:** The `discountPercentage` field might have been added to `schema.prisma`, but `npx prisma db push` and `npx prisma generate` were not executed successfully, or the Next.js dev server has cached the old Prisma client.
2. **Empty Input Handling:** If the Admin leaves the "Diskon Persen (%)" input blank, the frontend might be sending an empty string `""`, `null`, or `undefined`. If the Zod schema or Prisma expects an integer, it will crash.

## 3. Required Action Plan for AI Agent
Execute these strict steps to stabilize the backend:

### A. Force Database Synchronization
- Verify that `discountPercentage Int @default(0)` exists in the correct model in `prisma/schema.prisma`.
- Run `npx prisma db push` to update the actual database.
- Run `npx prisma generate` to refresh the Prisma Client.
- *(Self-Correction)*: If you are doing this in the background, ensure you explicitly restart the Next.js development server to clear any Turbopack/Next.js cache holding the old Prisma Client.

### B. Bulletproof the Zod Schema & Server Action
- Open the server action (`app/actions/admin.ts` or similar) handling the Master Settings.
- Update the Zod schema for `discountPercentage`. It must safely coerce empty strings or undefined values into `0`.
  - Example: `discountPercentage: z.coerce.number().min(0).max(100).optional().default(0)`
- In the Prisma update payload, ensure `discountPercentage` is passed safely as a number.

### C. Frontend Input Fix
- Open `ClassesClient.tsx` (the Admin UI).
- Ensure the state for the discount defaults to `0` or an empty string, but when submitting the form, explicitly convert it: `Number(discount) || 0` before sending it to the server action.

## 4. Expected Outcome
The Admin can leave the discount field blank (which saves as `0`) or input a number (e.g., `10`), click "Simpan Pengaturan", and see a success message without any Prisma validation crashes.