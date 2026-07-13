# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.48 (Global Responsive Pagination System)
**Module:** System-Wide (Member, PT, Buku Kas, Manajemen Karyawan, Scanner History)

## 1. Problem Statement
As the SaaS scales, data lists (tables and mobile cards) will grow infinitely long, destroying user experience (UX) by requiring endless scrolling. 
The user requires a Global Pagination system implemented across all major modules. To ensure optimal UX on different devices, the pagination must be responsive:
- **Desktop/Tablet View:** Max 10 items per page.
- **Mobile View:** Max 5 items per page.

## 2. Required Action Plan for AI Agent
Execute the following architectural upgrades. **Do NOT output raw code blocks; apply the logic systematically directly into the codebase.**

### A. Create a Reusable Global Pagination Component
- Create a new UI component (e.g., `components/ui/Pagination.tsx`).
- The component must accept props such as `currentPage`, `totalPages`, `onPageChange`.
- **UI Requirements:** 
  - Render "Previous" and "Next" buttons (disable them if on the first or last page).
  - Render page numbers cleanly. Use Tailwind for styling (e.g., active page gets a primary color background, inactive gets gray).
  - Ensure the buttons are easy to tap on mobile (adequate padding).

### B. Implement Responsive "Items Per Page" Logic
- Create a custom hook (e.g., `useResponsivePagination`) or implement `useEffect` logic inside the Client Components to detect window width.
- **Logic:** 
  - If `window.innerWidth < 768` (mobile), set `ITEMS_PER_PAGE = 5`.
  - Else (desktop), set `ITEMS_PER_PAGE = 10`.
- Ensure this value updates dynamically or gracefully handles the initial SSR (Server-Side Rendering) mismatch by defaulting to 5 or 10 before hydration completes.

### C. System-Wide Integration (Data Slicing)
Inject this pagination logic and the `<Pagination />` component into the following Client Components:
1. **`MembersClient.tsx`:** Apply to the main Member list.
2. **`PersonalTrainerClient.tsx`:** Apply to the "Master Jadwal & Harga" list and "Sesi Selesai (Terbaru)" history.
3. **`BukuKasClient.tsx`:** Apply to the "Riwayat Transaksi" list.
4. **`ManajemenKaryawanClient.tsx`:** Apply to the Employee list.
5. **`ScannerClient.tsx`:** Apply to the "Riwayat Check-in" list.

**Implementation Steps per Component:**
- Track `currentPage` in local state (default `1`).
- Calculate `totalPages = Math.ceil(data.length / ITEMS_PER_PAGE)`.
- Slice the data array before mapping it to the UI: 
  `const paginatedData = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)`.
- Render `paginatedData` in the table/cards.
- Render the `<Pagination />` component below the table/cards container.
- Reset `currentPage` to `1` if a search filter or tab change occurs.

## 3. Expected Outcome
Every single data list across the admin portal is now neatly paginated. Mobile users will only ever see a maximum of 5 cards per page before tapping "Next", while Desktop users will see 10 rows. This eliminates endless scrolling, dramatically improves rendering performance, and elevates the SaaS to a professional Enterprise standard.