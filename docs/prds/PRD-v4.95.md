# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.95 (User Journey & Routing Flow Hotfix)
**Modules Affected:** Member Dashboard Buttons & Package Selection Menu.

## 1. Problem Statement
There is a user journey bypass bug on the Member Dashboard (Beranda). Clicking the "VIP Membership" quick action button routes the user directly to the Checkout/Payment page (`/member/pembayaran`). The correct and intended flow requires the user to be routed to the Package Selection Menu ("Paket & Visit Harian") first, allowing them to view available options before explicitly clicking a "Pilih" button to proceed to checkout.

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code. Diagnose and fix the routing logic directly in the frontend components.

### A. Fix Dashboard Routing (Beranda)
- Locate the Member Dashboard component containing the quick action buttons.
- **Action:** Change the `href` or `router.push()` destination for the "VIP Membership" button. It must **NOT** point to the checkout/payment route.
- It must point to the Package Selection page (e.g., `<Link href="/member/paket">`).

### B. Standardize the Package Selection Page (Menu Pemilihan)
- Open the component responsible for rendering the "Paket & Visit Harian" page (as seen in the provided UI screenshots).
- Ensure that the "Pilih" (Select) buttons on this page are the *only* triggers that route the user to the Payment/Checkout page (`/member/pembayaran`).
- Ensure each "Pilih" button correctly passes its specific package ID (e.g., `?paketId=...`) so the checkout page fetches the correct pricing for either "Visit 1 Hari" or "VIP MEMBERSHIP".

### C. Verify "Visit Harian" Button Consistency
- Double-check the "Visit Harian" quick action button on the Dashboard. If the intended design is for both buttons to lead to the Selection Menu, update its route to `/member/paket` as well. 

## 3. Expected Outcome
A standardized e-commerce flow is established:
1. User clicks "VIP Membership" on Dashboard.
2. User is taken to the Package Selection Menu ("Paket & Visit Harian").
3. User clicks the red "Pilih" button on the VIP card.
4. User arrives at the Payment page with the correct Rp 150.500 price.
Direct jumping from Dashboard to Checkout is eliminated.