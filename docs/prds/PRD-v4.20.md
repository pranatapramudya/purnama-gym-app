# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.20 (Historical Pricing Snapshot & Card UI Overhaul)
**Module:** Backend Schema, Server Actions, & Member Frontend

## 1. Problem Statement
1. **Critical Data Integrity Bug:** The frontend currently calculates the PT schedule price dynamically based on the *Global Master Settings*. This causes a dangerous retroactive bug where changing the global discount/price alters the displayed price of older/previously created slots. 
2. **UI/UX Clutter:** The PT schedule cards on the Member frontend look unaligned and cramped. The discount badge clashes with the pricing text, and the flex layout lacks hierarchy and clean spacing.

## 2. Root Cause Analysis
- **Backend:** `PTScheduleSlot` does not store its own price. It relies on a relational or global fetch.
- **Frontend:** The card uses basic stacking without strict Tailwind Flexbox spacing, causing the elements (Strikethrough price, final price, discount badge, capacity) to visually collide.

## 3. Required Action Plan for AI Agent
Execute the following updates strictly without outputting raw code:

### A. Database: Implement Snapshot Pricing
- **Prisma Schema:** Update the `PTScheduleSlot` model. Add two new fields to act as historical snapshots:
  - `price Int @default(0)`
  - `discountPercentage Int @default(0)`
- Run `npx prisma db push` and `npx prisma generate`.

### B. Server Action: Freeze Pricing on Slot Creation
- Open `app/actions/admin.ts` (where `createPTScheduleSlot` is located).
- When creating a new slot, first fetch the CURRENT price and discount from the Global Master Settings.
- Inject these current values into the `prisma.pTScheduleSlot.create` payload. 
- *Result:* The created slot now permanently owns its pricing data at the time of creation.

### C. Frontend UI Overhaul (Card Polish)
- Open the Member PT Schedule UI where the cards are rendered.
- **Data Source:** Ensure the frontend now reads `slot.price` and `slot.discountPercentage` directly from the slot object, NOT the global settings.
- **Tailwind Restyling (The Card):**
  - Make the card a `relative` container: `relative flex flex-col items-center justify-between p-4 rounded-2xl shadow-sm border border-gray-100`.
  - **Badge Re-positioning:** Move the red "Diskon 10%" badge to the top-right corner using absolute positioning: `absolute -top-3 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md`. Show this badge ONLY if `discountPercentage > 0`.
  - **Content Stack:**
    - *Row 1 (Date/Time):* Clear, semi-bold text.
    - *Row 2 (Trainer):* Subtle text, maybe a smaller font.
    - *Row 3 (Pricing):* Use `flex flex-col items-center mt-2`. If there is a discount, display the strikethrough price subtly (`text-xs text-gray-400 line-through mb-1`). Display the Final Price prominently (`text-xl font-extrabold text-white` for green cards, or dark text for gray cards).
    - *Row 4 (Capacity):* Clean text with a subtle background pill: `mt-3 bg-black/10 px-3 py-1 rounded-full text-xs font-semibold`.

## 4. Expected Outcome
The pricing bug is solved: changing the Master price/discount will ONLY affect newly created PT slots going forward. The old slots retain their original snapshot prices. The frontend UI is drastically improved; the cards look uniform, the red discount badge pops nicely in the corner without breaking the layout, and the pricing text is hierarchical and easy to read.