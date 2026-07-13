# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.54 (Branding Cleanup & Daily Visit CRUD Implementation)
**Module:** Landing Page, Auth Pages, & `PaketVIPClient.tsx` (Package Management)

## 1. Problem Statement
1. **Unoriginal Branding:** The landing page and authentication pages (Sign In / Sign Up) currently display a placeholder spark/star icon (resembling the Gemini logo) next to the "PURNAMA GYM" text. This dilutes the brand identity and needs to be completely removed.
2. **Incomplete Package Management:** The "Manajemen Paket" module only has a generic "+ Tambah Paket" button. The gym needs to distinctly manage two types of access: "Paket VIP" (monthly/yearly memberships) and "Visit Harian" (1-day daily passes). The UI lacks a specific button and CRUD workflow for Daily Visits.

## 2. Required Action Plan for AI Agent
Execute the following UI and CRUD logic updates directly into the codebase. **Do NOT output raw code blocks; apply the fixes directly.**

### A. Eradicate Placeholder Logos (Branding Cleanup)
- **Landing Page (Header/Navbar):** Locate the component rendering the public landing page navigation. Find the SVG icon (likely a `Sparkles` icon from Lucide-react or similar) positioned next to the "PURNAMA GYM" brand text. **Delete the icon completely.**
- **Auth Pages (Sign In / Sign Up):** Locate the layout wrapper or the specific pages for Authentication. Remove the large icon inside the rounded green box above the "PURNAMA GYM" heading. Only keep the brand text.

### B. UI Update: Package Management Buttons
- Open the component managing the VIP Packages (e.g., `PaketVIPClient.tsx`).
- Locate the "+ Tambah Paket" button in the top right corner.
- **Rename:** Change the text from `+ Tambah Paket` to `+ Tambah Paket VIP`.
- **Add New Button:** Inject a secondary button directly next to it: `+ Tambah Visit Harian`. Use a distinct variant (e.g., an outline button or a different color like blue/gray) to differentiate it from the primary VIP button.

### C. Implement "Visit Harian" CRUD Logic
- **Database/Prisma Architecture:** Ensure the backend can distinguish between a VIP Package and a Daily Visit. If using a unified `Package` model, utilize a `type` or `category` field (e.g., `VIP` vs `DAILY_VISIT`), or base it on a hardcoded 1-day duration. 
- **Creation Modal (Create):** When `+ Tambah Visit Harian` is clicked, open a modal specifically tailored for daily visits. It should require less input than VIP (e.g., just Name like "Visit 1 Hari" and Price).
- **Table Integration (Read, Update, Delete):** 
  - The newly created "Visit Harian" data must be fetched and displayed in the management table alongside or in a separate tab from the VIP packages.
  - Ensure the Edit and Delete functions work perfectly for this Daily Visit item.
- **Frontend Sync:** Ensure that any active "Visit Harian" created via this new CRUD flow is automatically exposed via the API so it instantly syncs and renders on the public frontend (Member app) for users to purchase.

## 3. Expected Outcome
The public-facing pages look significantly more professional with a clean, text-only "PURNAMA GYM" brand identity. The Admin portal now clearly differentiates between adding long-term VIP packages and short-term Daily Visits, with a fully functioning end-to-end CRUD pipeline for both that syncs perfectly with the user frontend.