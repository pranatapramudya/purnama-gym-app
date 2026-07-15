# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 5.10 (Mobile Layout Precision & Text Clipping Hotfix)
**Modules Affected:** Landing Page Navbar & Hero Section.

## 1. Problem Statement
The recent mobile-first update introduced two frontend rendering issues on mobile viewports:
1. **Navbar Alignment:** The authentication CTA group wrapped to a new line but failed to align strictly to the far right. It is currently rendering with awkward left/center alignment.
2. **Text Clipping:** In the Hero section, the right edge of the italicized text "di" is being clipped/cut off by the viewport boundary.

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code. Apply the CSS utility classes directly to the component structure.

### A. Force Strict Right-Alignment for Mobile Navbar
- Locate the main Navbar component and the specific container holding the Auth CTA group ("Masuk" / "Daftar" and their helper texts).
- **Redesign the Mobile Auth Layout:** To fit the conversational text neatly on the far right without breaking the layout, structure the Auth container as a right-aligned column on mobile, and a row on desktop.
- **Implementation:**
  - Apply the following wrapper classes to the Auth group: `flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4 w-full md:w-auto mt-3 md:mt-0`.
  - Structure the inner items so they stack neatly on mobile:
    - Row 1 (Mobile): `Sudah punya akun? Masuk` (Apply `text-right text-sm` and right-align the elements).
    - Row 2 (Mobile): `Belum punya akun? [Button Daftar]` (Apply `text-right text-sm` and right-align the elements).
  - Hide the vertical divider (`|`) on mobile screens using `hidden md:block` to prevent layout breaking when stacked.

### B. Fix Clipped Italic Text in Hero Section
- Locate the Hero component and find the heading text `Ruang Kebugaran Eksklusif di Sumedang.`.
- Identify the `<span>` or specific element wrapping the italicized word `"di"` or the entire colored string `"di Sumedang."`.
- **Action:** The clipping occurs because italic characters overflow their bounding boxes on tight mobile screens. Add a right padding utility class (e.g., `pr-2` or `pr-4`) directly to that `<span>`. 
- Ensure the parent container of this heading has adequate horizontal padding (e.g., `px-4` or `px-6`) and `break-words` to prevent any text from touching the absolute edge of the viewport.

## 3. Expected Outcome
On mobile devices, the Auth CTA text and buttons will stack elegantly and anchor absolutely to the bottom-right of the navbar space. In the Hero section, the italicized "di" will render perfectly with sufficient breathing room, eliminating the visual clipping.