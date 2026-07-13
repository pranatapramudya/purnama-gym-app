# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.57 (Orphaned Staff Deletion Bug Fix / Auth Sync Error Handling)
**Module:** Employee Management (`ManajemenKaryawanClient.tsx` & corresponding Server Action)

## 1. Problem Statement
When attempting to delete an employee/trainer from the "Manajemen Karyawan" portal, the system throws an error: `No user was found with id user_[ID]`. This occurs because the user's authentication record in the third-party auth provider (e.g., Clerk) has been altered, deleted, or is out of sync. 
Because the Server Action fails at the Auth Provider API call step, it completely aborts the local Prisma database deletion. This traps "orphaned" records in the UI, making them impossible to delete.

## 2. Required Action Plan for AI Agent
Execute the following backend logic upgrades to ensure fault-tolerant deletion. **Do NOT output raw code blocks; apply the fixes directly to the server actions/API routes.**

### A. Isolate the Auth Provider Deletion Logic
- Locate the Server Action or API route responsible for deleting/revoking staff access (e.g., `deleteStaff`, `removeEmployeeAccess`, or similar within your `actions` folder or `route.ts`).
- Find the specific line where the application calls the Auth Provider's API (e.g., `clerkClient.users.deleteUser(id)` or `clerkClient.users.updateUserMetadata(id)`).

### B. Implement Fault-Tolerant `try...catch`
- Wrap **ONLY** the Auth Provider API call inside a dedicated `try...catch` block.
- Inside the `catch` block, intercept the error. Check if the error is related to "User not found" (usually a 404 status).
- **CRITICAL FIX:** Instead of throwing the error back to the client and aborting the execution, simply log the error to the console (e.g., `console.warn("User already missing from Auth provider, proceeding with local DB cleanup");`) and **allow the code execution to continue**.

### C. Ensure Local Database Cleanup
- Immediately after the Auth Provider `try...catch` block, ensure the Prisma deletion query (e.g., `prisma.user.update({ where: { id }, data: { role: 'MEMBER' } })` or `prisma.staff.delete({ where: { id } })`) executes normally.
- Return a standard success response (`{ success: true }`) so the frontend client cleanly removes the row from the table and closes the deletion modal without showing an alert box.

## 3. Expected Outcome
The system becomes fault-tolerant against orphaned accounts. When an admin clicks "Menghapus...", the system will gracefully ignore any "User Not Found" errors from the Auth provider and forcefully remove the dangling record from the local Prisma database, successfully clearing the UI.