# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.42 (PT Monitoring Mobile UI Polish & Compaction)
**Module:** `PersonalTrainerClient.tsx` (Monitoring Sesi Tab)

## 1. Problem Statement
The "Monitoring Sesi" tab is not fully optimized for mobile viewports.
1. **Oversized Typography:** Section headings ("Sesi Aktif", "Sesi Hari Ini", "Booking Baru") are too large, dominating vertical space.
2. **Excessive Spacing & Padding:** The gaps between sections and the internal padding of the data cards are set to desktop proportions, pushing content off-screen unnecessarily.
3. **Lingering Avatar:** The circular avatar initial (e.g., "P") is still present in the "Booking Baru" card, contradicting the previous minimalist design directive.

## 2. Required Action Plan for AI Agent
Execute the following UI/UX compacting strategies directly into the codebase. **Do NOT output raw code blocks; apply the Tailwind classes directly.**

### A. Apply Responsive Typography Scaling
- Open the component responsible for the "Monitoring Sesi" tab.
- Target all section headings (e.g., `Sesi Aktif`, `Sesi Hari Ini`, `Booking Baru`).
- Downgrade static large classes to responsive variants. 
  - Change `text-xl font-bold` or `text-2xl font-bold` to `text-base md:text-xl font-bold`.
- Reduce the size of the counter badges next to the titles to `text-xs md:text-sm`.

### B. Compact Spacing & Padding
- **Container Gaps:** Reduce the vertical spacing between the main sections. Change global `space-y-6` or `space-y-8` wrappers to `space-y-4 md:space-y-6`.
- **Card Padding:** Inside the empty state cards ("Tidak ada sesi...") and the active data cards, reduce the padding for mobile. Change `p-6` to `p-3 md:p-6`.
- **Text Sizes within Cards:** Ensure the primary text (Name) is `text-sm md:text-base` and secondary text (Date, Status) is `text-xs md:text-sm`.

### C. Remove Lingering Avatar (Booking Card)
- Inside the "Booking Baru (Menunggu Konfirmasi)" card loop, locate the UI element rendering the circular avatar (e.g., the gray circle with "P").
- **Completely remove it.**
- Rely solely on the Name, Date, and Status text. This will immediately free up horizontal space and make the card look much cleaner and tighter on mobile screens.

## 3. Expected Outcome
The "Monitoring Sesi" tab will look incredibly sleek and professional on mobile devices. More sections will fit simultaneously on a single phone screen without scrolling. The typography and padding will feel perfectly scaled for smaller viewports, and the bulky circular avatars are permanently removed from the booking cards.