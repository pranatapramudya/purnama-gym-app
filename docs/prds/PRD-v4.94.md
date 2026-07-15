# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.94 (Frontend-to-Database Routing Sync Hotfix)
**Modules Affected:** Member Dashboard Buttons & Package Checkout Flow.

## 1. Problem Statement
The Admin dashboard correctly shows that "Visit 1 Hari" and "VIP MEMBERSHIP" are completely distinct entities in the database. However, on the Member app Frontend (Beranda), clicking the "Visit Harian" quick action button incorrectly routes the user into the VIP Membership flow/checkout. The frontend buttons must pass strict identifiers to the checkout page so it fetches the correct package from the database.

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code. Diagnose and fix the routing logic in the frontend components directly.

### A. Update Member Dashboard Links (Beranda)
- Locate the Member Dashboard component containing the "VIP Membership" and "Visit Harian" quick action buttons.
- Modify the `href` or `router.push()` for both buttons to include a specific query parameter or slug that maps to the database entity.
- **Example:**
  - Visit Harian Button: `<Link href="/member/paket?type=visit">`
  - VIP Membership Button: `<Link href="/member/paket?type=vip">`

### B. Update Package Selection / Checkout Page
- Go to the page that handles the package display/checkout (e.g., `app/member/paket/page.tsx` or similar).
- Read the URL search parameter (`useSearchParams` or `searchParams` prop).
- Use this parameter to **automatically select** the correct package fetched from the database. 
- If `type=visit` is present, the UI must strictly default to showing the "Visit 1 Hari" package details (Rp 25.000). 
- If `type=vip` is present, default to the "VIP MEMBERSHIP" package details.

### C. Eliminate Hardcoded Fallbacks
- Ensure that the checkout flow is not hardcoded to default to the VIP package ID. The fetched data must match the user's intent from the Beranda button click.

## 3. Expected Outcome
The routing is logically synced with the database structure. Clicking "Visit Harian" guarantees the user sees the Rp 25.000 daily pass checkout flow. Clicking "VIP Membership" guarantees the VIP flow.