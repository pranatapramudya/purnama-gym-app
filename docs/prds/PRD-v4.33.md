# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.33 (Sidebar Categorization, Branding & Mobile Nav Polish)
**Module:** Layout & Navigation (Sidebar Desktop & Mobile Bottom Nav)

## 1. Problem Statement
1. **Sidebar Clutter:** The current sidebar is a single flat list. As features grow, it becomes hard to scan. The user wants static category headers (not dropdowns) to group menus logically (e.g., Main, Transactions, Management) based on the active role (Super User, Kasir, PT).
2. **Header Branding & Profile Placement:** The user wants the Clerk User Profile/Avatar moved from the bottom of the sidebar to the top-left, aligned with the "PURNAMA GYM" logo. Additionally, the sub-text "ADMIN PORTAL" needs to dynamically display "SUPER USER" (or the respective role).
3. **Mobile Bottom Nav Scrolling:** The horizontal scroll for the bottom navigation on mobile (specifically for the Kasir role) is not precise or neat. It lacks proper snapping and scrollbar hiding.

## 2. Required Action Plan for AI Agent
Execute the following UI/UX refactoring using Tailwind CSS:

### A. Sidebar Categorization & Grouping
- Open the Sidebar component (e.g., `Sidebar.tsx` or `AdminLayout.tsx`).
- Refactor the menu array to support categories. Iterate over these categories to render static headers.
- **Header Styling:** Use a small, subtle uppercase font for the category titles. 
  Example: `<p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-6 mb-2 px-4">Manajemen Operasional</p>`
- **Suggested Grouping for Super User:**
  - **Menu Utama:** Dashboard, Scanner QR
  - **Operasional:** Member, Personal Trainer, Paket VIP
  - **Keuangan:** Transaksi, Buku Kas
  - **Sistem:** Panduan Pemula, Manajemen Karyawan

### B. Logo & Avatar Repositioning
- Move the `<UserButton />` (from Clerk) to the top of the sidebar.
- Create a flex container at the top left: 
  `<div className="flex items-center gap-3 px-4 py-6">`
  Inside, place the `<UserButton />` on the left, and the text "PURNAMA GYM" on the right.
- Change the subtitle text below "PURNAMA GYM" from "ADMIN PORTAL" to "SUPER USER" (ensure this label matches the logged-in user's role: Super User, Kasir, or Trainer).

### C. Mobile Bottom Navigation Polish (Horizontal Scroll)
- Open the Mobile Bottom Navigation component.
- Fix the wrapper container to ensure a smooth, native-like horizontal scroll without an ugly scrollbar.
- **Tailwind Classes Needed:**
  - On the container: `flex overflow-x-auto overflow-y-hidden whitespace-nowrap snap-x snap-mandatory no-scrollbar w-full px-2`
  - On each nav item link: `snap-center shrink-0`
- Ensure you add a custom CSS rule or a Tailwind plugin utility to hide the scrollbar (`.no-scrollbar::-webkit-scrollbar { display: none; }`).

## 3. Expected Outcome
The desktop sidebar is cleanly divided into logical sections with subtle uppercase headers, making it highly scannable for Super Users, Kasirs, and PTs. The user avatar is neatly placed at the top next to the brand name. On mobile, the bottom menu for Kasir scrolls horizontally with perfect precision, snapping securely into place without displaying a messy scrollbar.