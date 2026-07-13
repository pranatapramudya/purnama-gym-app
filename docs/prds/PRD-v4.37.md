# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.37 (Mobile Typography Scaling & Table Overflow Fix)
**Module:** Member Management & PT Management Pages

## 1. Problem Statement
1. **Oversized Typography on Mobile:** The heading texts (e.g., "Manajemen Member", "Manajemen Sesi PT", "Sesi Aktif", "Booking Baru") are statically sized too large for mobile screens, taking up excessive vertical space and creating a cramped UX.
2. **Table Layout Breakage (Horizontal Overflow):** On the "Master Jadwal & Harga" tab, the data table contains too many columns to fit on a mobile screen. It overflows the viewport, hiding data and breaking the app's overall width constraints. Additionally, text inside cells (like the time "06:30 - 18:00") is wrapping awkwardly.

## 2. Required Action Plan for AI Agent
Execute the following Tailwind CSS optimizations. **Apply the changes directly to the components without outputting raw code blocks.**

### A. Implement Responsive Typography
- Open the pages/components for Member Management and Personal Trainer Management.
- Locate all major headings (`h1`, `h2`) and subheadings.
- Replace static large text classes (e.g., `text-3xl` or `text-4xl`) with Tailwind responsive variants.
- **Example Fix:** Change `text-3xl font-bold` to `text-xl md:text-2xl lg:text-3xl font-bold`.
- Ensure this scaling is applied to section titles like "Sesi Aktif (Sedang Berjalan)" and "Booking Baru (Menunggu Konfirmasi)" so they look proportional on mobile devices.

### B. Fix Table Horizontal Overflow & Wrapping
- Open the component rendering the Table in "Master Jadwal & Harga".
- **Wrap the Table:** Ensure the `<table>` element is wrapped inside a responsive container `div` that allows horizontal scrolling.
  - Add these classes to the wrapper `div`: `w-full overflow-x-auto no-scrollbar rounded-lg border border-gray-100`.
- **Prevent Awkward Wrapping:** Add `whitespace-nowrap` to the `<th>` and `<td>` elements (especially for Date, Time, and Price columns) so the content stays on a single line instead of stacking unreadably.
- Ensure the main page container still has `overflow-hidden` or `w-full` so the table's scrollable area doesn't force the entire mobile site to scroll horizontally.

## 3. Expected Outcome
Headings across the admin panel automatically scale down to a comfortable, proportionate size on mobile devices while remaining large on desktop. The data table can now be smoothly swiped horizontally on mobile to view hidden columns without breaking the main page layout, and cell contents display cleanly on single lines.