# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.40 (Scanner Timezone Sync & Delete Member Implementation)
**Module:** `ScannerClient.tsx` (or similar Scanner component) & `MembersClient.tsx`

## 1. Problem Statement
1. **Scanner Time Formatting Bug:** The "Riwayat Check-in Hari Ini" list on the Scanner QR page displays incorrect times (e.g., "00.00 WIB") instead of the actual real-time check-in timestamp in WIB (Asia/Jakarta), unlike the Dashboard which works perfectly.
2. **Incomplete Delete Feature:** Clicking "Hapus Member" from the 3-dot action menu simply shows an "under development" toast. It needs a full implementation including a safety confirmation modal and actual database deletion logic.

## 2. Required Action Plan for AI Agent
Execute the following features and fixes strictly without outputting raw code blocks in your response. Apply the changes directly to the project files.

### A. Fix Scanner Check-in Timezone (WIB)
- Open the component rendering the Scanner's Check-in History.
- Locate the date/time formatting function applied to the check-in timestamps.
- **Sync with Dashboard Logic:** Ensure the time is explicitly formatted using `Intl.DateTimeFormat` or `date-fns` to the `Asia/Jakarta` timezone, appending "WIB". 
- Fix any Server-Side Rendering (SSR) vs Client-Side mismatch (Hydration error) that might be forcing the time to reset to `00.00`. Ensure the date parsing handles the ISO string from Prisma correctly before converting to local time.

### B. Implement Delete Member Confirmation Modal
- Open `app/2026/members/MembersClient.tsx`.
- **Remove** the temporary toast notification for the Delete action.
- **Create Modal State:** Introduce a new state (e.g., `memberToDelete`) to track which member the user intends to delete.
- **Build the UI Modal:** When `memberToDelete` is not null, render a Confirmation Modal overlay (with a high z-index and blurred backdrop).
  - Include a warning icon/text: "Hapus Member?"
  - Include a subtext: "Apakah Anda yakin ingin menghapus member ini? Tindakan ini tidak dapat dibatalkan."
  - Include two buttons: "Batal" (closes modal) and "Yakin Hapus" (red/danger button to execute).

### C. Execute Database Deletion Logic
- Create or connect the "Yakin Hapus" button to an asynchronous Server Action or API route (e.g., `deleteUser(userId)`).
- Execute the Prisma deletion query.
- Upon success: 
  1. Close the modal.
  2. Show a success toast ("Member berhasil dihapus").
  3. Trigger `router.refresh()` to update the UI list instantly.
- Upon failure: Show an error toast.

## 3. Expected Outcome
The Scanner history accurately reflects the exact real-time check-in in WIB. The Delete Member action now strictly requires user confirmation via a safe modal overlay before permanently removing the record from the database and updating the UI seamlessly.