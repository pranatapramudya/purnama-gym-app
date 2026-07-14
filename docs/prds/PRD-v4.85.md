# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.85 (Mobile UX & Responsive Layout Hotfix for DateRangePicker)
**Modules Affected:** `components/ui/date-range-picker.tsx` and Page Headers (Dashboard, Scanner, PT, Transaksi, Buku Kas).

## 1. Problem Statement
The newly implemented global `DateRangePicker` is breaking the mobile UX. 
1. The header action buttons (Live, Refresh, Export, and Date Picker) are horizontally cramped on mobile screens.
2. Inside the Popover, the preset shortcut buttons ("Hari Ini", "7 Hari Terakhir", etc.) are stacked vertically, pushing the actual calendar out of the mobile viewport. 
3. The Popover itself is overflowing the mobile screen width.

## 2. Required Action Plan for AI Agent
Do not generate raw code blocks for me to copy. Apply these Tailwind CSS and structural changes directly to the UI components.

### A. Responsive Header Layouts (Across 5 Pages)
- Locate the wrapper `div` containing the header actions (e.g., the row with "Unduh Laporan", "Live", and the `<DateRangePicker />`) in the 5 affected modules.
- **Mobile First:** Change the wrapper to a flex-column layout on mobile, and flex-row on desktop (e.g., `flex flex-col md:flex-row gap-2 md:gap-4`).
- **Full Width Trigger:** Pass a prop or styling to the `<DateRangePicker />` trigger button so it becomes `w-full` on mobile (filling the screen width) and `md:w-auto` on desktop.

### B. Popover Constraints & Scrolling (`date-range-picker.tsx`)
- Constrain the `PopoverContent` width to prevent horizontal overflow on small screens (e.g., `w-[calc(100vw-2rem)] sm:w-auto`).
- Ensure the popover aligns correctly on mobile (usually `align="center"` or `align="end"` works best depending on the header position).
- Add max-height and scrolling to the popover content so users on small screens can scroll down to see the calendar if needed (e.g., `max-h-[80vh] overflow-y-auto`).

### C. Restructure Preset Shortcuts for Mobile
- Currently, the preset shortcuts (Hari Ini, Bulan Ini) are stacked vertically. Change their container layout to be responsive.
- On mobile: Display the presets as a horizontal scrollable row (e.g., `flex overflow-x-auto whitespace-nowrap pb-2`), OR a compact 2x2 grid (`grid grid-cols-2 gap-2`) above the calendar to save vertical space.
- On desktop: They can remain a vertical sidebar (`flex-col`) next to the calendar.

### D. Calendar Month Constraint
- Ensure the `Calendar` component strictly displays `numberOfMonths={1}` on mobile devices to prevent the UI from blowing out horizontally. (If you must show 2 months on desktop, use a responsive hook, otherwise default to 1 for safety).

## 3. Expected Outcome
On a mobile device, the Date Picker button will sit neatly stacked at full width. When clicked, the Popover fits perfectly within the screen width. The preset buttons are compactly arranged (grid or horizontal scroll) so the user can see both the shortcuts and the calendar without layout breakage. Desktop layouts remain unaffected and spacious.