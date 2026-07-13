# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.64 (Registration UX Cleanup & Safe Hard-Delete Architecture)
**Module:** `MembersClient.tsx` (Registration Modal) & Employee Management (Server Actions)

## 1. Problem Statement
1. **Redundant UI / Missing Fields:** The Registration Modal currently includes a "Cek Data" button which is redundant, as profile viewing is now handled directly via the Member Table. The modal should function strictly as a manual data-entry form for walk-in customers. Furthermore, the essential "Alamat" (Address) field is missing from the data entry step.
2. **Improper Staff Deletion Flow:** The previous "Soft Delete" (role downgrade) approach for fired staff clutters the Member database. Admins require a true "Hard Delete" for terminated employees so they can reuse credentials/names. However, a naive hard delete triggers Prisma `RESTRICT` foreign key errors because the system must absolutely preserve historical financial transactions processed by that employee.

## 2. Required Action Plan for AI Agent
Execute the following UI changes and Database logic upgrades. **Do NOT output raw code blocks; apply the fixes directly to the codebase.**

### A. Refactor Registration Modal (Manual Entry UX)
- Open the component handling the `Registrasi VIP & Visit Harian` modal.
- **Remove** the `Cek Data` button and its associated loading states/fetch logic completely from this modal.
- **Add** a new input field for `Alamat` (Address) as a `<textarea>` or standard `<input>` directly below the "Nomor Telepon" field. Ensure this maps correctly to the Prisma database upon submission.
- Ensure the form is fully optimized for fast, manual typing by cashiers.

### B. Implement "Safe Hard-Delete" (Relational Unlinking)
- Open the Server Action responsible for deleting a Staff/Employee (e.g., `deleteStaffAccount`).
- **Step 1: Unlink Financial Records (Data Preservation).** 
  - Before calling `prisma.user.delete()`, you must detach the user from their historical records to bypass the Foreign Key constraint without losing the financial data.
  - Execute an `updateMany` command on the `Transaction` (and `Cashflow` or `PTSession` if applicable) tables. 
  - *Logic:* `await prisma.transaction.updateMany({ where: { userId: targetId }, data: { userId: null } })` 
  - *(Note: If your Prisma schema requires `userId` to be a non-null String, either update the schema to `String?` with `onDelete: SetNull`, OR re-assign those transactions to a static system admin ID).*
- **Step 2: Hard Delete Auth Provider.**
  - Keep the `clerkClient.users.deleteUser(id)` inside the `try...catch` block to completely wipe their login access.
- **Step 3: Hard Delete Prisma Record.**
  - Replace the role downgrade logic (`update: { role: 'MEMBER' }`) with a true Hard Delete: `await prisma.user.delete({ where: { id: targetId } })`.

## 3. Expected Outcome
The Registration modal is now a clean, straightforward manual entry form containing Name, Email, Phone, and Address. When an admin deletes a fired employee, the system gracefully unlinks their historical financial transactions (keeping the gym's accounting perfectly intact) and permanently wipes the employee's account from both the database and the UI, leaving no trace behind.