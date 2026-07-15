# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 5.04 (UI Polish: Notification Header Standardization)
**Modules Affected:** Member Notifications Page (`/member/notifikasi` or equivalent).

## 1. Problem Statement
The Member Notifications page is currently using a plain/light background for its header, which breaks the visual consistency established across other member pages (Beranda, Profil, Paket, Riwayat Transaksi). Even though the notification data is currently static (mockup) for the MVP phase, the UI wrapper must adhere strictly to the application's design system.

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code in your response. Apply the CSS utility classes directly to the component structure.

### A. Standardize "Notifikasi" Header
- Locate the Member Notifications page component.
- Find the top header wrapper (containing the back button, "Notifikasi" title, and subtitle).
- Apply the exact same signature green gradient classes used across the app (e.g., `bg-gradient-to-r from-emerald-400 to-teal-500`, along with the bottom rounded corners like `rounded-b-3xl` or matching class).
- **Contrast Verification:** Update the title text ("Notifikasi"), the subtitle text, and the back arrow icon color to white (`text-white`) to ensure perfect high contrast and readability against the new green gradient background.

## 3. Expected Outcome
The Notifications page header will seamlessly match the visual identity of the rest of the application, completing the global UI standardization for the member frontend.