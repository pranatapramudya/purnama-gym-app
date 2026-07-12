# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.04 (Sidebar Navigation & RBAC UI Hotfix)
**Module:** Admin Portal Sidebar (`app/2026`)

## 1. Problem Statement
Following the directory rename from `/admin` to `/2026` and the Prisma role enum update to `SUPER_ADMIN`, the "Analytics" (Analitik) menu item is completely missing from the Sidebar navigation. Additionally, the user noted that the URLs in the sidebar might still be pointing to legacy paths.

## 2. Root Cause Analysis
- **Pathing:** Navigation items in the Sidebar component (likely located in `components/` or `app/2026/layout.tsx`) may still contain hardcoded `href="/admin/..."` strings.
- **RBAC Visibility:** The conditional rendering logic controlling which menu items are visible based on the user's role was not updated to include the new `SUPER_ADMIN` enum for high-level pages like Analytics.

## 3. Required Action Plan for AI Agent
Please locate the Sidebar navigation configuration (often an array of route objects or hardcoded `<Link>` components) and apply the following fixes:

### A. Global Path Update
- Scan the Sidebar component and replace any instances of `/admin/` with `/2026/`. Ensure all navigation links point to the newly renamed closed-door portal.

### B. Fix Menu Visibility (RBAC)
- Locate the "Analytics" (Analitik) menu item in the navigation configuration.
- Update its visibility condition to ensure it is rendered for `dbUser.role === 'SUPER_ADMIN'`.
- Review other high-level management menus (e.g., Manajemen Karyawan) to ensure they are also accessible to the `SUPER_ADMIN`.

### C. Route Verification
- Briefly verify that the page file for analytics (e.g., `app/2026/analytics/page.tsx` or similar) actually exists in the directory tree so the updated link does not throw a 404 error. Do not write the page logic if it exists, just ensure the routing connects.

## 4. Expected Outcome
When logging in as a `SUPER_ADMIN`, the "Analitik" menu should instantly appear in the sidebar, and clicking it should correctly route the user to `/2026/analytics` (or the respective Indonesian path equivalent) without a 404 error.