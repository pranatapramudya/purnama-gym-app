# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.39 (Avatar Replacement, Z-Index Dropdown Fix, & Form Spacing Polish)
**Module:** `MembersClient.tsx` & Global Form/Card Components

## 1. Problem Statement
1. **Unwanted Avatar Initials:** The user wants to remove the circular avatar displaying the initial letter of the name (e.g., the pink "P" circle) in the data tables and mobile cards across all views (Desktop/Mobile/iOS). It should be replaced with a simple sequential index number (e.g., 1, 2, 3).
2. **Action Menu (Dropdown) Clipping:** When clicking the 3-dot action menu on the mobile card view, the resulting dropdown menu ("Edit Data") is getting clipped/hidden behind the card boundary or pushed underneath other elements. This makes the action buttons unclickable.
3. **Excessive Vertical Form Spacing:** Inside modal forms (like "Edit Profil"), the vertical spacing (`gap` or `space-y`) between input fields is too large. This causes the modal to become overly tall on mobile devices, often pushing the bottom action buttons ("Batal", "Simpan") off-screen or out of the visible viewport.

## 2. Required Action Plan for AI Agent
Execute the following fixes. **Do NOT output raw code blocks in your response; apply the UI adjustments directly to the codebase.**

### A. Replace Avatar with Sequential Number
- Open `app/2026/members/MembersClient.tsx` (and apply this logic to other similar listing components if applicable).
- Locate the UI element rendering the circular avatar containing the user's initial (e.g., the colored circle with "P").
- **Remove** the avatar component entirely.
- **Replace it** with a simple sequential number text (e.g., `index + 1` from the map function) formatted neatly, such as `#{index + 1}` or just the number aligned to the left before the Name text.

### B. Fix Dropdown Clipping (Z-Index & Position)
- Locate the 3-dot action button and its corresponding dropdown menu inside the mobile card layout.
- Ensure the parent container of the card does **not** have `overflow-hidden` if the dropdown relies on absolute positioning relative to it.
- Apply high `z-index` to the dropdown menu (e.g., `z-[99]`).
- **Best Practice Alternative:** If the parent must have `overflow-hidden`, switch the 3-dot menu behavior on mobile to trigger a bottom-sheet (Action Sheet) or a centered modal instead of a relative dropdown, ensuring it is always visible and accessible regardless of screen size.

### C. Optimize Modal Form Spacing (Global Fix)
- Open the "Edit Profil" modal component (and check other modal forms like "Registrasi Member Baru").
- Reduce the vertical spacing between form groups. 
  - If using `space-y-6` or `gap-6`, reduce it to `space-y-3` or `gap-4`.
- Ensure the modal's main container has a maximum height constraint and internal scrolling if necessary (`max-h-[85vh] overflow-y-auto`) so that the "Simpan/Batal" buttons are always accessible even on very small screens (like older iPhones).

## 3. Expected Outcome
The avatar circles are replaced by clean, sequential index numbers. The 3-dot action menu successfully pops out above all other elements without being clipped. All modal forms now use tighter vertical spacing, ensuring the entire form and its submit buttons fit comfortably on any mobile device screen.