# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 5.11 (Mobile Navbar Auth Layout Refactor)
**Modules Affected:** Landing Page Navbar.

## 1. Problem Statement
The previous attempt to include conversational auth text ("Sudah punya akun?" / "Belum punya akun?") on mobile viewports resulted in a stacked layout that drastically increases the height of the Navbar. This creates a bloated, unbalanced UI on small screens. For mobile viewports, the Navbar must be slim and minimalist, displaying only the essential actionable CTAs.

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code. Apply the layout and responsive CSS classes directly to the Navbar component.

### A. Hide Conversational Text on Mobile
- Locate the `<span>` or text elements rendering "Sudah punya akun?" and "Belum punya akun?" inside the Auth CTA group.
- **Action:** Add the Tailwind class `hidden md:inline-block` (or `md:block`) to these text elements so they completely disappear on mobile viewports but remain visible on desktop.

### B. Simplify Mobile Layout (Single Row)
- Reset the Auth CTA wrapper container to a strict single-row flex layout for all screen sizes.
- **Implementation:**
  - Remove the stacking classes applied previously (`flex-col`, `items-end`, etc.).
  - Apply: `flex flex-row items-center gap-3 md:gap-4`.
  - Ensure the "Masuk" text link and the "Daftar" button sit side-by-side on the same horizontal line.

### C. Navbar Container Polish
- Ensure the main Navbar container (`header` or `nav`) maintains a standard, compact height (e.g., `h-16` or `py-4`) and uses `flex items-center justify-between`.
- The layout on mobile should simply be: `[Logo (Left)] <---- Space ----> [Masuk] [Button Daftar] (Right)`.

## 3. Expected Outcome
The mobile Navbar will be slim, professional, and perfectly balanced. The clutter of conversational text will be removed on mobile, leaving only the "Masuk" link and the green "Daftar" button neatly aligned to the right, on the same line as the logo. Desktop view remains unchanged.