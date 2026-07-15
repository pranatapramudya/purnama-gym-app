# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.96 (Isolated Package Views / "Separated Rooms" Hotfix)
**Modules Affected:** Member Dashboard Buttons & Member Package Selection Page.

## 1. Problem Statement
Currently, clicking either "VIP Membership" or "Visit Harian" on the Member Dashboard routes the user to a shared selection page that displays ALL available packages. The business requirement dictates strict UI isolation for members: clicking a specific category button must render a page displaying ONLY the packages belonging to that category. 
*Note: The Super Admin package management view must remain unified (all packages in one table) for ease of management.*

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code. Diagnose and implement the filtering logic directly in the existing frontend components.

### A. Add Category Params to Dashboard Links (Beranda)
- Locate the Member Dashboard component with the quick action buttons.
- Update the routes to pass a strict category filter parameter.
  - "VIP Membership" button: `<Link href="/member/paket?kategori=vip">`
  - "Visit Harian" button: `<Link href="/member/paket?kategori=visit">`

### B. Implement View Isolation on the Selection Page
- Open the Member Package Selection page (`app/member/paket/page.tsx` or similar).
- Read the `kategori` query parameter using `useSearchParams`.
- **Filtering Logic:**
  - If `kategori === 'vip'`, map and render ONLY the packages where the name/type matches VIP. Completely hide the "Visit Harian" card.
  - If `kategori === 'visit'`, map and render ONLY the packages where the name/type matches Visit Harian. Completely hide the VIP card.
- **Dynamic UI Update:** Dynamically change the page title based on the parameter (e.g., If VIP, title becomes "Paket VIP Membership" instead of "Paket & Visit Harian").

### C. Preserve Super Admin Unified View
- Do NOT touch the Super Admin (`/2026/...`) package management pages. The Admin must continue to see both VIP and Visit Harian combined in one table.

## 3. Expected Outcome
When a member clicks "VIP Membership" from the dashboard, they enter an isolated view showing only VIP options. When they click "Visit Harian", they see only the Daily Pass options. The Admin interface remains unchanged and unified.