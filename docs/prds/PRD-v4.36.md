# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.36 (UI Polish & Timezone Hydration Fix)
**Module:** Top Header, Mobile Sidebar Overlay, & Scanner History UI

## 1. Problem Statement
1. **Unwanted Logo:** The pink "PG" logo in the top header looks unpolished. The user wants it completely removed.
2. **Missing Overlay:** When the mobile sidebar (drawer) is opened, the background content remains clear. It needs a darkened, blurred overlay to focus attention on the menu and indicate the background is unclickable.
3. **Timezone Bug (Mobile):** In the Mobile Scanner "Riwayat Check-in" list, the time displayed is exactly 7 hours behind the actual time (e.g., showing 03:16 instead of 10:16 WIB). The frontend is rendering raw UTC time from the database without converting it to the local timezone (WIB/GMT+7).

## 2. Required Action Plan for AI Agent
Execute the following fixes strictly without outputting any raw code blocks:

### A. Remove the PG Logo
- Open the Mobile Header component.
- Locate the `<div ...>PG</div>` or the specific `<Image>`/SVG tag representing the pink "PG" logo.
- **Delete** the logo entirely. Adjust the flexbox spacing if necessary so the "Hamburger" menu icon and "PURNAMA GYM" text sit naturally next to each other.

### B. Add Mobile Sidebar Backdrop (Overlay)
- Open the component managing the mobile sidebar drawer.
- Add an overlay `div` that renders conditionally *only* when the sidebar is open.
- Position the overlay fixed behind the sidebar but above the main content.
- Use Tailwind classes for a dark, blurred effect: `fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity`. Ensure clicking this overlay closes the sidebar.

### C. Fix UTC Time Formatting (Scanner History)
- Open the Scanner component or the specific component rendering the "Riwayat Check-in" list items.
- Locate where the `checkInTime` (or `createdAt`) is formatted for display.
- **Fix the Timezone:** Ensure you are formatting the `Date` object to explicitly use the local timezone. 
  - If using standard JS: `new Date(item.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })`.
  - Alternatively, if using `date-fns`, ensure you are adding the offset or using the correct formatting function that respects the browser's local timezone instead of returning the raw UTC string.

## 3. Expected Outcome
The header is clean without the "PG" logo. Opening the mobile sidebar dims and blurs the background. Most importantly, the check-in history times on mobile accurately reflect WIB (e.g., 10:16) instead of raw UTC.