# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.59 (Member Biodata View & Mobile UX Optimization)
**Module:** `MembersClient.tsx` & Data Sync

## 1. Problem Statement
1. **Misaligned "Cek Data" Concept:** The requirement is not to auto-fill the registration form, but to provide a robust "Profile/Biodata View" for existing members within the Management Table. Admins need to instantly view data synced from the user's mobile sign-up process (specifically Phone Number and Address).
2. **Poor Mobile UX (Hidden Actions):** The current action button in the table is a generic three-dots menu (`...`). On mobile devices, this is bad UX—it hides crucial actions, requires multiple taps, and often causes horizontal scrolling or clipping. It needs to be replaced with a clear, direct action button.

## 2. Required Action Plan for AI Agent
Execute the following UI/UX and data-fetching upgrades. **Do NOT output raw code blocks; apply the fixes directly to the codebase.**

### A. Revamp the Action Button (Remove Kebab Menu)
- Open `MembersClient.tsx` (the Member Management table).
- Locate the "AKSI" column rendering the three-dots dropdown menu (e.g., `<MoreHorizontal />` or DropdownMenu component).
- **Remove the dropdown entirely.** 
- Replace it with a single, highly visible button: `<Button variant="outline" size="sm">🔍 Cek Biodata</Button>`.

### B. Implement "Cek Biodata" Modal/Drawer (Data Sync)
- Create a new state to manage the selected member for viewing (e.g., `selectedMember`).
- When the `Cek Biodata` button is clicked, open a Modal (on Desktop) or a Drawer/Bottom Sheet (on Mobile) to display the member's full profile.
- **Data to Display:** Synchronize and pull the following fields from the Prisma `User` model:
  1. Nama Lengkap (Name)
  2. Email
  3. Nomor Telepon (Phone)
  4. Alamat (Address) - *Ensure this field is queried from Prisma.*
  5. Status Member (VIP / Regular) & Masa Aktif
- Style the data display using clean, read-only UI components (e.g., Tailwind grids, muted text for labels, bold text for values).

### C. Mobile-First Optimization (Pro UX)
- Ensure the Member Table uses the "Mobile Cards" transformation pattern (similar to the previously optimized Employee table using `block md:table-row`).
- On mobile viewports (`< 768px`), the `Cek Biodata` button must expand to full width (`w-full mt-4`) at the bottom of each member's card, making it extremely easy to tap with a thumb. 
- Ensure the Biodata Modal has adequate padding and does not feel cramped on a small iPhone screen.

## 3. Expected Outcome
The Member Management page now features a direct, intuitive "Cek Biodata" button instead of a hidden three-dots menu. Clicking it reveals a beautifully formatted, mobile-responsive view of the user's full synced profile (including Address and Phone). The mobile experience is spacious, utilizing thumb-friendly buttons and card layouts.