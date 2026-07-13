# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.38 (Member Mobile Layout Fix & React Key Duplication Resolution)
**Module:** `app/2026/members/MembersClient.tsx` (Mobile Card View & Edit Modal)

## 1. Problem Statement
1. **Mobile Text Truncation:** In the mobile view (Card layout) of the Member Management page, the "NAMA" column is cut off. Long names and emails overflow the card boundaries and are hidden.
2. **React Duplicate Key Error:** Clicking the 3-dot action button triggers a React console error: `Encountered two children with the same key, 'MEMBER'`. This breaks the UI update cycle.
3. **Unclear Action Menu:** The 3-dot button lacks clear functionality/UI indicating what actions are available (e.g., Edit, Delete) when tapped on mobile.

## 2. Required Action Plan for AI Agent
Execute the following fixes seamlessly in the codebase. **Do NOT output raw code blocks in your response; apply the fixes directly.**

### A. Resolve React Duplicate Key Error
- Open `app/2026/members/MembersClient.tsx`.
- Locate line 309 (or the surrounding area) where the role selection array is mapped: `["MEMBER", "MEMBER", ...]`.
- **Fix the Array:** Remove the duplicate string. Ensure the array only contains unique role identifiers (e.g., `["MEMBER", "VIP", "KASIR", "PT"]`).
- Ensure the `key` prop in the mapped `.map((role) => ...)` uses this unique string so React can maintain element identity properly.

### B. Fix Mobile Layout Truncation (Card View)
- Locate the mobile card layout section inside `MembersClient.tsx` (the responsive UI meant for small screens).
- Find the flex container holding the User Avatar and the Name/Email text block.
- Apply `min-w-0` to the flex item holding the text to allow it to shrink properly.
- Ensure the text elements (Name and Email) have the classes `break-words` and `whitespace-normal` so that long emails or names wrap to the next line instead of pushing off the right edge of the screen.

### C. Implement Clear 3-Dot Action Menu
- Ensure that clicking the 3-dot button opens a properly positioned dropdown menu or action sheet.
- The menu must explicitly contain actionable labels, such as "Edit Data" and "Hapus Member".
- Attach the existing edit/delete handler functions to these visible buttons so the user knows exactly what the 3-dot menu does.

## 3. Expected Outcome
The React console error is completely eliminated. On mobile devices, long member names and emails will wrap neatly within the card without horizontal overflow. Clicking the 3-dot button will smoothly present a clear menu of actions (Edit/Delete) without crashing the application.