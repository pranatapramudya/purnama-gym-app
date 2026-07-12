# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.29 (Member ID Sync & QR Scanner Biodata Integration)
**Module:** Member Profile UI, QR Generator, & Admin QR Scanner

## 1. Problem Statement
1. **ID Inconsistency:** The Member Profile page shows ID `M-RGAO`, while the QR Ticket page shows `PRN-K87VZ6`. The QR page is likely using a hardcoded string or the wrong database field.
2. **Raw Database ID Leak:** When scanning the QR code, it outputs a raw Prisma CUID (e.g., `cmr...`). The QR code is encoding the database Primary Key (`id`) instead of the Human-Readable Member Code.
3. **Missing Scanner Lookup Logic:** The Admin/Gym scanner just outputs the scanned raw string. It needs to take the scanned Member ID, look up the database, and display the member's full Biodata (Name, Member Type, Status).

## 2. Root Cause Analysis
- The frontend variables for displaying the ID are not unified. They must all point to a single source of truth (e.g., `user.memberCode` or `user.memberId`).
- The `<QRCode value={...} />` component is encoding `user.id` (the CUID) instead of `user.memberCode`.
- The Scanner component lacks a callback function to fetch user data post-scan.

## 3. Required Action Plan for AI Agent
Execute the following strict data-binding and logic updates without outputting raw code:

### A. Sync Member IDs (Frontend)
- Open the Profile Page (`Profil Saya`) and the QR Display Page (`QR Masuk`).
- Ensure BOTH components fetch and display the exact same human-readable ID field from the database (e.g., `user.memberCode`). 
- **Remove any hardcoded IDs** (like `PRN-K87VZ6`).

### B. Update QR Code Payload
- On the `QR Masuk` page, locate the QR code generator component.
- Change the encoded payload: `<QRCode value={user.memberCode} />` so the QR code specifically contains the beautiful ID (e.g., `M-RGAO`), NOT the `cmr...` raw ID.

### C. Build the Scanner Biodata Lookup (Admin)
- Open the Admin QR Scanner component.
- **Implement a Server Action or API route (`getUserByMemberCode`):**
  - Input: `memberCode` (string)
  - Query: `prisma.user.findUnique({ where: { memberCode: input } })`
  - Output: Returns Name, MemberCode, VIP/Non-VIP status, and profile image URL.
- **Update Scanner Logic:** 
  - Upon a successful scan event, pause the scanner temporarily.
  - Send the scanned text (which is now `M-RGAO`) to the `getUserByMemberCode` function.
  - Display a beautiful "Biodata Card" modal/alert on the screen showing the member's Name and VIP status based on the database response. 
  - Add a "Tutup" or "Scan Lagi" button to resume the scanner.

## 4. Expected Outcome
The Profile and QR pages display the exact same Member ID. Scanning the member's QR code on the admin side reads the correct ID, fetches the database, and pops up a clear Biodata card showing the user's name and VIP status, completely hiding the raw CUID from all interfaces.