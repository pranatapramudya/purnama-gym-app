# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 5.08 (Landing Page UI Cleanup: Redundant Auth CTA Removal)
**Modules Affected:** Landing Page Hero Section & Navbar.

## 1. Problem Statement
The previous conversational auth update resulted in a redundant and oversized CTA card ("Belum punya akun member? Daftar Sekarang") being placed in the middle of the Hero section. This clutters the center of the screen on both desktop and mobile views. The business requirement is to keep the center Hero section clean and restrict all authentication actions (Login/Register) strictly to the top-right corner of the Navbar.

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code. Apply the structural layout fixes directly to the UI components.

### A. Remove Hero Section Auth Card
- Locate the Landing Page Hero component (the section containing the "Ruang Kebugaran Eksklusif di Sumedang" heading).
- Find the floating card element at the bottom of this section containing the text "Belum punya akun member?" and the large "Daftar Sekarang" button.
- **Action:** Completely delete or comment out this entire card element. The Hero section should only contain the headline and the sub-headline (description).

### B. Consolidate Auth in Top-Right Navbar
- Locate the main Navbar component.
- **Desktop:** Ensure the conversational auth group ("Sudah punya akun? Masuk" and "Belum punya akun? Daftar") is anchored securely to the far right of the top navigation bar.
- **Mobile:** Ensure the mobile header also contains a clean, accessible entry point for Login/Register in the top right. If space is tight on mobile, a simplified "Masuk" button or a dropdown/hamburger menu in the top right containing the Auth links is acceptable. Do NOT place it in the center of the screen.

## 3. Expected Outcome
The landing page will look clean and premium. The center of the page will focus entirely on the marketing copy, while all authentication flows are intuitively located exclusively in the top-right corner across all device sizes.