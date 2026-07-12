# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.23 (Prisma Invocation Fix & IDR Currency Formatting)
**Module:** Database, Admin UI, & Member UI

## 1. Problem Statement
1. **Database Prisma Crash:** Submitting the "Tambah Slot" form throws an `Invalid prisma... invocation` error. The payload contains the new `price` field, but Prisma rejects it. This means the Prisma schema was either not successfully pushed to the database, the Prisma Client is outdated, or the payload contains an unmapped relational field.
2. **Currency UX Formatting:** The user wants to use "IDR" instead of "Rp", and explicitly requested that the numbers are separated by thousands (not squished together) to improve readability (e.g., `IDR 100.000` instead of `Rp100000`).

## 2. Root Cause Analysis
- The Next.js server is likely caching an older version of the Prisma Client, or `npx prisma generate` failed.
- The UI currently renders the price directly from the integer or uses a basic string concatenation without proper `Intl.NumberFormat`.

## 3. Required Action Plan for AI Agent
Execute the following strict steps without outputting raw code:

### A. Resolve Prisma Invocation Error
- Open `prisma/schema.prisma`. Verify that `PTScheduleSlot` strictly contains:
  - `price Int @default(0)`
  - `discountPercentage Int @default(0)`
- **CRITICAL TERMINAL COMMANDS:** You must execute `npx prisma db push` AND `npx prisma generate`.
- Open `app/actions/admin.ts` (the server action). Ensure the `create` payload only passes fields that actually exist on the Prisma model. Ensure `price` and `discountPercentage` are cast to `Number()` before passing to Prisma.

### B. Implement "IDR" Currency Formatting
- Create a simple formatting utility function (or apply inline) wherever prices are displayed (Admin Table, Member PT Schedule Cards, and Checkout).
- Use `Intl.NumberFormat` to format the integer into Indonesian locale, but replace "Rp" with "IDR ".
  - *Example output required:* `IDR 100.000` (Notice the space between IDR and the number, and the dot separating thousands).
- **Admin UI (`ClassesClient.tsx`):** Update the "HARGA" column in the table to render this formatted IDR string. If there is a discount, format it clearly (e.g., `IDR 100.000 (Disc 10%)`).
- **Member UI & Checkout:** Apply the exact same `IDR 100.000` formatting to the final calculated prices and strikethrough prices.

## 4. Expected Outcome
The Admin can successfully create a slot without Prisma throwing an invocation error. Everywhere in the application where money is displayed, it is beautifully formatted as `IDR 100.000`, making it highly readable for both admins and members.