# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.35 (Mobile Pro Navigation & Dropdown Performance Optimization)
**Module:** Mobile Layout & Dashboard Filter Component

## 1. Problem Statement
1. **Limited Mobile Navigation:** The mobile view currently relies entirely on a Bottom Navigation bar. Since this is an Enterprise SaaS with multiple categories (Operations, Finance, System), the bottom nav cannot fit all menus. It lacks the "Pro" categorized feel of the desktop web version.
2. **Filter Dropdown UI Lag:** The "Hari Ini" date filter dropdown on the Dashboard experiences noticeable input delay/lag when clicked. It does not feel responsive or snappy across the Super User and Kasir panels.

## 2. Required Action Plan for AI Agent
Execute the following UI/UX and Performance optimizations. **DO NOT output raw code blocks in your response, just apply the changes to the codebase.**

### A. Implement "Pro" Mobile Navigation (Hamburger Drawer)
- **Keep the Bottom Nav** only for the 4 most critical quick actions (e.g., Dashboard, Scanner QR, Member, Transaksi).
- **Update Mobile Top Header:** Add a "Hamburger" menu icon (3 horizontal lines) to the top header, positioned on the far left or right of the "PURNAMA GYM" text.
- **Implement Slide-out Drawer (Sheet):** When the hamburger menu is clicked, open a sleek slide-out mobile sidebar.
- **Mirror Desktop Categories:** Inside this mobile drawer, render the exact same categorized menu list used in the Desktop Sidebar (Main, Operasional, Keuangan, Sistem). This gives mobile users full access to the premium categorized UI without cluttering the screen.

### B. Optimize Dashboard Dropdown Performance (Lag Fix)
- Open the Dashboard component containing the date filter dropdown ("Hari Ini").
- **Identify the Bottleneck:** The delay is likely caused by the dropdown state change triggering a massive re-render of the heavy chart components simultaneously.
- **Decouple UI State:** Ensure the dropdown's "open/close" state is decoupled from the data-fetching or chart-rendering state. The dropdown menu must open instantly (using CSS or lightweight local state) before any heavy data processing happens.
- **Use React Optimizations:** If necessary, wrap the filter change event in `React.startTransition` or a debounced function so the UI remains perfectly responsive and doesn't block the main thread.

## 3. Expected Outcome
Mobile users will experience a premium navigation flow: a bottom nav for quick tasks and a smooth slide-out drawer for the full categorized SaaS menu. Additionally, the dashboard date filter will open and respond instantly without any UI freezing or lag.