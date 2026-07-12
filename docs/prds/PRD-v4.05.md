# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.05 (Dashboard Restoration & Sidebar Cleanup)
**Module:** Admin Portal Dashboard (`app/2026/dashboard`)

## 1. Problem Statement
There was a miscommunication in the previous update. The user does NOT want a separate "Analitik" menu. Instead, the main Dashboard page (`/2026/dashboard` or `/2026/page.tsx`) has been incorrectly overwritten with a simplified template. The original rich dashboard features—specifically the comprehensive charts, the daily/weekly/monthly/yearly filters, and the "Download Excel" functionality—are missing from the main view.

## 2. Root Cause Analysis
During the folder restructuring to `/2026`, the AI agent likely replaced the primary dashboard file with a basic boilerplate UI (showing only "0 Sesi" and "0 Check-in"). The rich analytics components were either moved to a new isolated `/2026/analitik` route or temporarily displaced in the component tree.

## 3. Required Action Plan for AI Agent
Please execute the following UI restoration strictly without breaking the newly established RBAC logic:

### A. Restore the Rich Dashboard Components
- Locate the original code for the advanced dashboard (search your workspace for the chart components, time-based filter logic, and the Excel download function). It might be currently sitting in `app/2026/analitik/page.tsx` or an older backup component.
- **Merge** these rich components back into the main `app/2026/dashboard/page.tsx` file.
- The final Dashboard view should have BOTH the quick stat cards (Sesi & Check-in) at the top, followed immediately by the detailed charts, filters, and Excel export buttons below them on the exact same page.

### B. Remove the Redundant "Analitik" Route
- Delete the `app/2026/analitik` directory entirely if it was created in the previous step. We want a single, powerful command center.

### C. Clean Up the Sidebar Navigation
- Open the Sidebar component (e.g., `components/Sidebar.tsx` or similar).
- Remove the "Analitik" menu item completely from the navigation array/JSX. 
- Ensure "Dashboard" is the primary active route.

## 4. Expected Outcome
The "Analitik" menu is gone from the Sidebar. Clicking on "Dashboard" loads a unified, comprehensive page containing the real-time summary cards alongside the fully functional charts, time filters, and the Download Excel feature.