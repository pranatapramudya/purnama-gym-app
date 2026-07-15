# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 5.00 (UI/UX Consistency & Polish)
**Modules Affected:** Member Package Selection (`/member/paket`), Member Checkout (`/member/pembayaran`), and Member Profile (`/member/profil`).

## 1. Problem Statement
During UI/UX review, two inconsistencies were identified in the Member frontend:
1. The header sections for the Package Selection ("Paket VIP Membership" / "Visit Harian") and Payment ("Pembayaran") pages lack the standard green gradient background used in the Beranda and Profil pages. 
2. The "Profil Saya" header contains a settings (gear) icon that is currently redundant and clutters the UI.

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code in your response. Apply the CSS and component changes directly to the files.

### A. Standardize Header Backgrounds
- Locate the page components or layouts responsible for `/member/paket` and `/member/pembayaran`.
- Find the top header wrapper (which currently has a plain or white background and contains the back button and page title).
- Apply the exact same background utility classes used in the `Beranda` or `Profil` headers (e.g., the Tailwind classes for the green gradient, typically something like `bg-gradient-to-r from-emerald-400 to-teal-500`, along with the bottom rounded corners `rounded-b-[...]`).
- **Contrast Check:** Ensure that the text color and back button icon color inside this header are adjusted to white (or a highly legible color) to contrast properly against the new green gradient background.

### B. Remove Settings Icon from Profile
- Locate the Member Profile component (`/member/profil/page.tsx` or similar).
- Find the header section rendering the "Profil Saya" text.
- Locate the `<Settings />` or gear icon button element on the far right of this header.
- **Action:** Completely remove this icon/button element from the DOM to achieve a cleaner look.

## 3. Expected Outcome
The application will have a completely unified visual language. All top-level member pages will feature the signature green gradient header. The Profile page will look cleaner without the unused settings icon.