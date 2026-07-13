# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.45 (Master Schedule Mobile UX: Form Compaction & Table-to-Card Transformation)
**Module:** `PersonalTrainerClient.tsx` (Master Jadwal & Harga Tab)

## 1. Problem Statement
1. **Oversized Form Spacing:** In the "Kelola Slot Jadwal PT" form, the vertical spacing between input fields (`Pilih Tanggal`, `Mulai`, `Selesai`, etc.) is too large on mobile devices, forcing the user to scroll down excessively to reach the submit button.
2. **Poor Mobile Table UX (Horizontal Scroll):** The data table displaying the created schedules requires horizontal scrolling on mobile viewports. This hides critical information (like Price or Actions) off-screen and creates a frustrating user experience. All data must be visible at a glance without horizontal swiping.

## 2. Required Action Plan for AI Agent
Execute the following Tailwind CSS responsive optimizations. **Do NOT output raw code blocks; apply the structural and class changes directly to the codebase.**

### A. Compact Form Spacing (Mobile-First)
- Open the component rendering the "Kelola Slot Jadwal PT" form.
- Locate the main container holding the input fields.
- **Reduce Vertical Gap:** Change the static spacing class (e.g., `space-y-6`) to a responsive one: `space-y-3 md:space-y-6`.
- **Adjust Padding:** Reduce the internal padding of the form's wrapper card for mobile: `p-4 md:p-6`.
- **Input Sizing:** Ensure the input fields themselves aren't overly tall on mobile (use standard `py-2` or `py-3`).

### B. Transform Table to "Mobile Cards" Layout
- Locate the `<table>` element displaying the master schedules.
- **Responsive Table Structure:** We need the table to act as a normal table on desktop (`md:`), but transform into a stacked list of cards on mobile.
- **Hide Headers on Mobile:** Add `hidden md:table-header-group` to the `<thead>` so column titles disappear on phones.
- **Block Display for Rows:** Add `block md:table-row` to the `<tbody>` and `<tr>` elements. Add a border and margin to `<tr>` on mobile so they look like individual cards (e.g., `mb-4 border rounded-lg md:mb-0 md:border-none md:rounded-none`).
- **Flex Display for Cells:** Add `flex justify-between items-center block md:table-cell` to the `<td>` elements. 
- **Mobile Labels (Optional but recommended):** If using pseudo-elements isn't feasible, conditionally render a span inside the `<td>` that only shows on mobile to label the data (e.g., `<span className="md:hidden font-bold">Harga: </span>`).
- **Remove Horizontal Overflow:** Remove `overflow-x-auto` or `whitespace-nowrap` from the table wrapper if it forces the mobile card to widen beyond the screen. Ensure text wraps nicely inside the new mobile card format.

## 3. Expected Outcome
On mobile devices, the input form will look tight and professional, fitting more fields onto a single screen. Most importantly, the data table will seamlessly transform into a vertical list of easy-to-read cards, eliminating the need for horizontal scrolling while keeping all schedule data (Date, Time, Price, Actions) immediately visible. On desktop, the traditional table layout will remain intact.