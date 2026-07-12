# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.21 (Dynamic Slot Pricing & Global Master Removal)
**Module:** Admin PT Management UI & Server Actions

## 1. Problem Statement
1. **UX Bottleneck (Rigid Pricing):** The current architecture uses a "Global Master Setting" for Price and Discount. The user realized this is terrible for business operations. If they want a specific discount ONLY for tomorrow's schedule, changing the global setting is clunky and error-prone. They want **Dynamic Pricing per Slot**.
2. **Server Action Crash:** Creating a slot currently throws a Zod/Validation error because it attempts to fetch or validate against the decoupled global master pricing logic, which is out of sync.

## 2. Root Cause Analysis
The pricing logic is separated from the slot creation logic. By moving `price` and `discountPercentage` directly into the `createPTScheduleSlot` form and payload, we eliminate the need for global state fetching and resolve the validation crash entirely.

## 3. Required Action Plan for AI Agent
Execute the following structural changes without outputting raw code:

### A. UI Simplification: Kill the Master Settings
- Open `app/2026/personal-trainer/ClassesClient.tsx` (or the relevant Admin UI).
- **Completely DELETE** the entire top card: "Pengaturan Master Ketersediaan & Harga PT".
- Remove all states, fetch logic (`useEffect`), and Server Actions related strictly to updating this global master setting. It is now deprecated.

### B. UI Enhancement: Dynamic Slot Form
- In the "Kelola Slot Jadwal PT" card, add two new input fields to the form (placed logically before the "Tambah Slot" button):
  1. **Harga (Rp):** `type="number"`, default to a sensible base (e.g., `100000`).
  2. **Diskon (%):** `type="number"`, default to `0`. Max `100`.
- The Admin will now define the exact price and discount *at the moment of creating that specific slot*.

### C. Backend: Fix Zod Validation & Creation Logic
- Open `app/actions/admin.ts` (or where `createPTScheduleSlot` is).
- Update the Zod Schema for slot creation to EXPLICITLY require the two new fields from the frontend:
  - `price: z.coerce.number().min(0)`
  - `discountPercentage: z.coerce.number().min(0).max(100).optional().default(0)`
- Update the Prisma `create` payload: Instead of fetching the global master price, just pass the `price` and `discountPercentage` directly from the validated frontend input into the `prisma.pTScheduleSlot.create` function.

### D. Update Admin Table Display
- In the Admin table at the bottom, update the columns to show the Pricing info so the Admin can review what they set.
- Add a "HARGA" column displaying the final calculated price or a format like `Rp100rb (Disc 10%)`.

## 4. Expected Outcome
The redundant Global Master card is gone. The Admin has fine-grained control to set unique prices and promos for every individual PT schedule they create. Submitting the "Tambah Slot" form works flawlessly without Zod validation errors because the data is perfectly scoped and validated in a single payload.