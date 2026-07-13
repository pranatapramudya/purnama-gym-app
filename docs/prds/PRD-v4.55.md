# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.55 (Sidebar Navigation UI Update)
**Module:** Sidebar / Navigation Component

## 1. Problem Statement
Following the successful implementation of the Daily Visit CRUD flow, the sidebar navigation menu still labels the module strictly as "Paket VIP". This is now inaccurate and misleading for admins and cashiers, as the module manages both long-term VIP packages and short-term daily passes. The menu label must be updated to explicitly reflect its dual purpose.

## 2. Required Action Plan for AI Agent
Execute the following UI text updates directly into the codebase. **Do NOT output raw code blocks; apply the fixes directly.**

### A. Update Sidebar Navigation Label
- Locate the global Sidebar component or the configuration array that defines the main navigation menu (e.g., `components/Sidebar.tsx`, `layout.tsx`, or a `constants.ts` file).
- Find the navigation item pointing to the packages management route (currently labeled "Paket VIP" alongside the package/box icon).
- **Rename the label:** Change the text from `"Paket VIP"` to `"Paket VIP & Visit Harian"`. (Use "&" instead of "dan" to save horizontal space and maintain a clean UI layout).

### B. Layout & Responsive Verification
- Ensure that the new, longer text ("Paket VIP & Visit Harian") fits cleanly within the sidebar width.
- If the text is too long for collapsed or smaller tablet views, apply the Tailwind `truncate` class to the text span so it cuts off gracefully with an ellipsis (`...`) rather than breaking into two messy lines or overflowing outside the sidebar container.

## 3. Expected Outcome
The sidebar navigation menu instantly reads "Paket VIP & Visit Harian", perfectly representing the module's newly expanded functionality. The UI remains clean, professional, and visually unbroken.