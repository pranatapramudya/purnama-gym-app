# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.51 (Dashboard Dropdown Performance & React Transition Optimization)
**Module:** `DashboardClient.tsx` (Date Filter Dropdown Component)

## 1. Problem Statement
The "Hari Ini" date filter dropdown on the Dashboard experiences a noticeable input delay/UI freeze when clicked. The lag is caused by state coupling: toggling the dropdown's visibility (or selecting an option) triggers a synchronous re-render of the entire heavy Dashboard component (including charts, stat cards, and recent lists). This blocks the main thread, resulting in a poor, unresponsive user experience.

## 2. Required Action Plan for AI Agent
Execute the following React performance optimizations directly into the codebase. **Do NOT output raw code blocks; apply the fixes directly to the files.**

### A. Decouple Dropdown UI State
- Locate the Date Filter Dropdown component within the Dashboard.
- If the dropdown visibility state (e.g., `isOpen`, `setIsOpen`) is currently sitting in the parent `DashboardClient` component, extract the dropdown into its own isolated client component (e.g., `<DateFilterDropdown />`).
- Ensure that toggling `isOpen` strictly re-renders ONLY the dropdown menu overlay, not the parent dashboard.

### B. Implement `React.useTransition` for Filtering
- When a user selects a new date range (e.g., changing from "Hari Ini" to "Bulan Ini"), the UI should immediately close the dropdown overlay.
- Import `useTransition` from `react`.
- Wrap the state update that triggers the heavy data fetching/filtering in `startTransition`.
  - Example logic flow:
    ```javascript
    const handleSelect = (filter) => {
       setIsOpen(false); // Immediate UI update (High Priority)
       startTransition(() => {
          setActiveFilter(filter); // Heavy update (Low Priority)
       });
    }
    ```

### C. Z-Index & Positioning Check
- Ensure the dropdown menu absolute wrapper has a high `z-index` (e.g., `z-50`) so it cleanly overlays the stat cards (like the "Member Aktif" card) without clipping, as shown in the visual reference.
- Add a subtle backdrop shadow or border to the dropdown menu to match the clean SaaS aesthetic.

## 3. Expected Outcome
The dropdown menu will open instantly upon clicking without any perceivable lag or main-thread blocking. When an option is selected, the menu will close immediately, and the dashboard data will seamlessly update in the background without freezing the UI.