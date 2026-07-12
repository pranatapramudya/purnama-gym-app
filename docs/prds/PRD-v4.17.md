# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.17 (Promotional Pricing & Card UI Integration)
**Module:** Admin Master Settings & Member Booking UI

## 1. Problem Statement
1. **Marketing Feature Missing:** The system lacks a promotional pricing feature. The Admin wants the ability to set a "Harga Diskon" (Discount Price) alongside the normal price to attract new members. 
2. **UI Optimization:** The frontend currently displays the price in a large, separate global banner at the top of the screen. The user wants this global banner removed and the price seamlessly integrated directly inside each individual PT schedule card (the green/gray boxes) for a cleaner, higher-converting user experience.

## 2. Root Cause Analysis
- The database currently only holds a single `price` field in the master settings.
- The UI component for the price was built as a standalone global header rather than a localized property inside the schedule card component.

## 3. Required Action Plan for AI Agent
Execute the following updates to database, backend, and frontend without outputting raw code:

### A. Database & Admin Settings Update
- **Prisma Schema:** Update the Master Settings or Global PT configuration model to include a new integer field: `discountPrice` (optional, default to `0` or `null`). Run the Prisma DB push.
- **Admin UI (`app/2026/personal-trainer/ClassesClient.tsx`):** Add a new input field directly below "Harga Per Sesi" labeled "Harga Diskon (Opsional)". 
- **Server Action:** Update the save logic to correctly persist this `discountPrice` to the database alongside the normal price. Ensure it hydratres correctly on page reload.

### B. Frontend UI Polish (Remove Banner & Update Card)
- **Delete Banner:** In the Member PT Schedule page, completely remove the top white card component containing the text "TARIF PERSONAL TRAINER... Rp 90.000".
- **Update Schedule Card:** Inject the pricing data directly into the PT slot card UI. 
- **Visual Logic for Pricing:**
  - *If a `discountPrice` exists (and is greater than 0):* Display the original price with a clear strikethrough line (e.g., `<del>Rp 150.000</del>`) and display the `discountPrice` prominently (e.g., **Rp 90.000**). Consider adding a small "PROMO" text or badge if space allows.
  - *If NO discount exists:* Simply display the normal price natively inside the card.
  - *Placement:* Place the price elegantly at the bottom of the card or right below the PT name, ensuring the card's dimensions remain balanced.

### C. Checkout Calculation Fix
- **Checkout Modal:** Update the Checkout UI and the subsequent payment logic/server action. Ensure the "Total Tagihan" strictly uses the `discountPrice` if one is active. Do not charge the user the normal price if a promo is running.

## 4. Expected Outcome
The Admin can easily set up promos via the new "Harga Diskon" field. The Member app looks incredibly clean because the bulky price banner is gone. Instead, members see a feed of schedules where each card clearly displays the price, complete with an attractive "strikethrough" effect for discounted sessions, immediately driving conversions.