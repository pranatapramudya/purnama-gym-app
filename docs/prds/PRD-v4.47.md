# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.47 (Employee Management Mobile UX: Table-to-Card & Avatar Cleanup)
**Module:** `ManajemenKaryawanClient.tsx` (or corresponding Employee table component)

## 1. Problem Statement
1. **Poor Mobile Table UX (Horizontal Scroll):** The Employee Management ("Manajemen Karyawan") data table forces horizontal scrolling on mobile viewports. Key columns like "JABATAN" (Role) and the action/edit buttons are hidden off-screen.
2. **Inconsistent Avatar Design:** The table still utilizes circular initial avatars (e.g., "PR", "KU"). This violates the global minimalist design directive established in previous versions, which mandates using simple sequential index numbers instead.

## 2. Required Action Plan for AI Agent
Execute the following Tailwind CSS optimizations. **Do NOT output raw code blocks; apply the structural and class changes directly into the codebase.**

### A. Transform Employee Table to "Mobile Cards"
- Locate the `<table>` element displaying the employee data.
- **Hide Headers on Mobile:** Add `hidden md:table-header-group` to the `<thead>` element.
- **Row Transformation:** Add `block md:table-row` to the `<tbody>` and all internal `<tr>` elements. Add styling to the `<tr>` elements to make them look like distinct cards on mobile (e.g., `mb-4 border rounded-lg p-4 md:mb-0 md:border-none md:rounded-none md:p-0`).
- **Cell Transformation:** Add `flex justify-between items-center block border-b last:border-b-0 py-3 md:table-cell md:border-none md:py-4` to the `<td>` elements.
- **Mobile Data Labels:** Within each `<td>`, ensure there is a conditionally rendered label that only appears on mobile screens to identify the data. 
  - Example: `<td><span className="md:hidden font-bold text-gray-500 text-sm">Jabatan: </span> <span className="text-right">{employee.role}</span></td>`.
- **Remove Container Overflow:** Remove `overflow-x-auto` or `whitespace-nowrap` from the parent `<div>` wrapping the table so the mobile cards can expand to the full width of the screen.

### B. Global Consistency: Avatar Cleanup
- Inside the Employee table row mapping, locate the UI element rendering the circular avatar (the circle containing the user's initials).
- **Completely remove the avatar component.**
- Replace it with a clean, sequential index number (e.g., `#1`, `#2`) using the array map index `(index + 1)`. Align this number to the left of the Employee Name and Email stack. Ensure the Name and Email text use `break-words whitespace-normal` so long emails don't break the mobile flex layout.

## 3. Expected Outcome
The Employee Management table now perfectly mirrors the responsive behavior of the Cashbook and Master Schedule modules. On mobile, it transforms into a vertical list of clean, swipe-free cards. All circular avatars are completely eradicated from the module, replaced by professional sequential numbering.