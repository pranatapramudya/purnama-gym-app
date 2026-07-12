# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.18 (Percentage Discount & Dead Code Cleanup)
**Module:** Admin Master Settings & Member Booking UI

## 1. Problem Statement
1. **Discount Logic Change:** The user wants the discount to be a Percentage (e.g., 10%, 20%) rather than a fixed nominal Rupiah amount. The system must automatically calculate the final price based on this percentage.
2. **Server Action Crash (Critical):** Clicking "Simpan Pengaturan" throws a Zod/Prisma validation error. The server is still attempting to validate and update legacy fields (`operationalDays`, `openTime`, `closeTime`) that were removed from the UI in version 4.13.

## 2. Root Cause Analysis
- The frontend no longer sends the day/time data, but the Server Action's Zod schema and Prisma `update` payload were never cleaned up.
- The previous implementation used a fixed `discountPrice` instead of a `discountPercentage`.

## 3. Required Action Plan for AI Agent
Execute the following updates strictly without outputting raw code:

### A. Fix Server Action (Dead Code Cleanup)
- Open the server action handling the Master Settings save (e.g., `updateMasterSettings` in `app/actions/admin.ts`).
- **CRITICAL:** Remove ALL references to `operationalDays`, `openTime`, and `closeTime` from the Zod validation schema. 
- Remove those same fields from the Prisma `update` query payload. 
- The payload and validation should ONLY care about `price` and `discountPercentage`.

### B. Database & Admin UI Update (Percentage)
- **Database:** If you added `discountPrice` previously, change it to `discountPercentage` (Int, default 0) in the Prisma Schema and push to the DB.
- **Admin UI:** Change the label in `ClassesClient.tsx` from "Harga Diskon" to "Diskon Persen (%)". Update the input to strictly accept numbers from 0 to 100. Remove the "Rp" prefix icon and replace it with a "%" suffix or placeholder.

### C. Auto-Calculate in Frontend & Checkout
- Open the Member PT Schedule UI and the Checkout component.
- Calculate the final price dynamically: `finalPrice = price - (price * (discountPercentage / 100))`.
- **Card UI Logic:**
  - If `discountPercentage > 0`: Show the original `price` with a strikethrough (e.g., `<del>Rp 100.000</del>`) and display the calculated `finalPrice` prominently. Include a small badge/text showing the percentage (e.g., "Diskon 10%").
  - If `discountPercentage === 0`: Just show the normal `price`.
- **Checkout Logic:** Ensure the "Total Tagihan" string strictly reflects this calculated `finalPrice`.

## 4. Expected Outcome
The Admin can save the global price and percentage without any server crashes. The Member UI automatically calculates the math, showing an attractive slashed original price and the final discounted price based on the percentage provided.