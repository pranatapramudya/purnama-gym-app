# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.25 (Frontend Ghost Pricing Data Binding Fix)
**Module:** Member PT Booking Frontend & Checkout

## 1. Problem Statement
The Admin successfully creates a slot with a specific price and discount (e.g., IDR 100.000 with 10% discount = IDR 90.000). The Admin table reflects this correctly. However, the Member UI completely ignores this and displays a stale "ghost" price (IDR 130.000), which was the old Global Master Setting price before the architecture migration.

## 2. Root Cause Analysis
The frontend React component for the Member schedule (and likely the checkout modal) is still mapping its pricing variables to the deprecated global `ptSetting.price` instead of the newly implemented `slot.price` and `slot.discountPercentage` from the `PTScheduleSlot` database model.

## 3. Required Action Plan for AI Agent
Execute the following strict data-binding fixes on the frontend:

### A. Update Schedule Cards Data Binding
- Open the Member PT Schedule UI component (`app/(member)/jadwal-pt/page.tsx` or similar where the cards are mapped).
- Completely remove any dependency or fetching logic for the old global master settings.
- Inside the `.map((slot) => ...)` loop, update the pricing variables:
  - Base Price: Use `slot.price`.
  - Discount: Use `slot.discountPercentage`.
- Calculate the final price locally: 
  `const finalPrice = slot.price - (slot.price * (slot.discountPercentage / 100))`
- Display the formatted `finalPrice` prominently.
- If `slot.discountPercentage > 0`, display the original `slot.price` with a strikethrough.

### B. Update Checkout Modal Data Binding
- Open the Checkout component.
- Ensure the selected slot passes its specific `slot.price` and `slot.discountPercentage` to the checkout state.
- The "Total Tagihan" must calculate and display based strictly on the specific slot's data, NOT the old global state.

## 4. Expected Outcome
The Member app instantly drops the ghost 130k price. The green schedule cards will accurately display the IDR 90.000 calculated price, perfectly mirroring what the Admin set in the dashboard for that exact slot.