# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.60 (Table UI/UX Refinement & Pixel-Perfect Alignment)
**Module:** `MembersClient.tsx` (Table Data Presentation)

## 1. Problem Statement
The newly implemented "Cek Biodata" button and its column header ("AKSI") lack visual precision. 
1. **Naming:** The column header "AKSI" feels archaic and overly technical for a modern SaaS interface. 
2. **Alignment:** The button is vertically misaligned compared to the first column (which contains two lines of text: Name and Email). This breaks the horizontal rhythm of the table row, making it look unpolished.

## 2. Required Action Plan for AI Agent
Execute the following Tailwind CSS and UI label updates directly into the codebase. **Do NOT output raw code blocks; apply the fixes directly.**

### A. Update Column Header & Button Text
- **Table Header:** Locate the `<th>` or table header definition for the "AKSI" column. Change the text from `"AKSI"` to `"DETAIL"` (or remove the text entirely, leaving an empty header, which is a standard modern UI pattern).
- **Button Text:** To make the button look sleeker and more proportional, update the text from `"🔍 Cek Biodata"` to `"🔍 Lihat Profil"` or simply `"Detail"`. 

### B. Fix Vertical Alignment (Pixel-Perfect UI)
- **Flexbox Centering:** The root cause of the misalignment is differing row heights. Ensure the `<td>` or container holding the button has the correct Tailwind classes for absolute vertical centering.
- Add `flex items-center justify-end h-full` (or apply `align-middle` if using native `display: table-cell`) to the button's parent container. 
- Ensure the button size is strictly set to `size="sm"` to prevent it from stretching the row height artificially.

### C. Hover & Polish States
- Add a subtle hover effect to the row itself (e.g., `hover:bg-slate-50` or `hover:bg-gray-50/50` on the `<tr>`) so the user clearly sees which member's data they are about to click.
- Ensure the gap between the search bar (`Cari nama atau email...`) and the table is properly spaced (e.g., `mb-6`).

## 3. Expected Outcome
The Member Management table looks pixel-perfect. The archaic "AKSI" text is replaced with a cleaner approach, and the profile viewing button is perfectly vertically aligned with the two-line Name/Email block. The UI now matches the premium feel of the Biodata Modal.