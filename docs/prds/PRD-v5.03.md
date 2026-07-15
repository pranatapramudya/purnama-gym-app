# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 5.03 (Dashboard Widget Overflow Management)
**Modules Affected:** PT Session Management Dashboard (`/2026/sesi-pt` or equivalent).

## 1. Problem Statement
The PT Session Management dashboard contains three primary data lists: "Sesi Hari Ini", "Booking Baru", and "Sesi Selesai". As data grows, rendering all items will cause the UI to stretch vertically, pushing bottom elements off-screen and ruining the grid layout. Instead of traditional pagination buttons, we need fixed-height scrollable containers (widgets) to maintain a compact, unified dashboard view.

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code. Apply the UI/CSS modifications directly to the component structure.

### A. Implement Scrollable Container for "Sesi Hari Ini" (Left Column)
- Locate the container mapping the "Sesi Hari Ini" items.
- Wrap the mapped items list in a `div` with a fixed maximum height and vertical scrolling.
- **Tailwind Classes:** Apply `max-h-[500px] overflow-y-auto pr-2` (Adjust `500px` to comfortably fit roughly 5 items before scrolling).
- **Scrollbar Styling:** Apply custom scrollbar styling (e.g., `scrollbar-thin scrollbar-thumb-gray-300`) if supported by the project configuration to keep it looking clean.

### B. Implement Scrollable Containers for Right Column ("Booking Baru" & "Sesi Selesai")
- Locate the containers mapping "Booking Baru" and "Sesi Selesai".
- Wrap both lists in individual `div` elements with a shorter maximum height.
- **Tailwind Classes:** Apply `max-h-[300px] overflow-y-auto pr-2` to both containers. This ensures roughly 3 items fit perfectly, and any excess items can be scrolled without pushing the bottom container off the screen.

## 3. Expected Outcome
The dashboard layout remains locked and visually balanced regardless of the data volume. If there are 10 new bookings, the admin simply scrolls within the "Booking Baru" widget box. No external pagination buttons are needed, maintaining a clean, modern SaaS aesthetic.