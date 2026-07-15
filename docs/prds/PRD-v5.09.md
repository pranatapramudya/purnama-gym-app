# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 5.09 (Mobile-First Auth CTA Consistency)
**Modules Affected:** Landing Page Navbar / Main Header.

## 1. Problem Statement
The conversational authentication text ("Sudah punya akun? Masuk" and "Belum punya akun? Daftar") is currently restricted to desktop views (likely using responsive `hidden` utility classes). A Mobile-First approach is strictly required for this project. The conversational CTA is highly critical for conversion and MUST be fully visible on mobile devices, identically to the desktop experience.

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code. Apply the layout and CSS changes directly to the Navbar component.

### A. Remove Responsive Hiding
- Locate the Navbar component containing the Auth CTA group.
- Find the `<span>` or text elements rendering "Sudah punya akun?" and "Belum punya akun?".
- **Action:** Remove any responsive hiding classes (e.g., `hidden md:inline`, `hidden sm:block`, etc.) from these text elements so they render on all screen sizes.

### B. Mobile Layout Optimization
Because rendering this full text on a small mobile screen in a single row with the logo will cause horizontal overflow, redesign the mobile Navbar layout dynamically:
- **Option 1 (Flex Wrap/Stacking):** Allow the Auth CTA group to wrap below the Logo on mobile screens. 
  - Use `flex-wrap` on the main Navbar container.
  - Set the Auth group container to `w-full md:w-auto mt-2 md:mt-0 justify-between md:justify-end`.
- **Option 2 (Compact Column inside Right Flex):** If keeping it on the same line as the logo, stack the text and buttons vertically on the right side.
  - Make the CTA group a flex column on mobile: `flex flex-col items-end gap-1 md:flex-row md:items-center`.
  - Adjust text size for mobile (e.g., `text-xs md:text-sm`).

### C. Visual Separation
- Ensure the divider (the vertical line `|`) between the "Masuk" and "Daftar" sections behaves correctly. If using a stacked mobile layout (Option 2), hide the vertical divider on mobile or change it to a horizontal margin.

## 3. Expected Outcome
When viewing the landing page on a mobile device, the user will explicitly see the texts "Sudah punya akun?" and "Belum punya akun?". The UI will intelligently wrap or stack to accommodate this text without breaking the page width or creating horizontal scrollbars.