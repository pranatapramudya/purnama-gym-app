# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.58 (Foreign Key Constraint Fix: Staff Role Downgrade)
**Module:** Employee Management (`deleteStaffAccount` Server Action)

## 1. Problem Statement
The backend successfully bypasses the Clerk Auth synchronization error, but now crashes at the Prisma execution step with the following error:
`update or delete on table "User" violates RESTRICT setting of foreign key constraint "Transaction_userId_fkey" on table "Transaction"`.
This occurs because the AI agent is attempting a hard delete (`prisma.user.delete()`) on an account that has linked historical financial transactions or bookings. Wiping this user would destroy the gym's accounting integrity, which Prisma rightfully prevents.

## 2. Required Action Plan for AI Agent
Execute the following architectural fix in the backend. **Do NOT output raw code blocks; apply the fixes directly to the server action.**

### A. Convert "Hard Delete" to "Role Downgrade"
- Locate the Server Action responsible for deleting staff (e.g., `deleteStaffAccount` or similar).
- Find the line where the agent previously implemented: `prisma.user.delete({ where: { id: ... } })`.
- **Remove** the `prisma.user.delete()` command completely.
- **Replace** it with a Prisma `update` command that changes the user's role back to a standard member.
  - *Implementation Logic:*
    ```javascript
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'MEMBER' } // or 'USER', depending on your standard member role enum
    });
    ```

### B. Handle the Auth Provider (Clerk) State
- Maintain the `try...catch` block around the Clerk deletion `clerkClient.users.deleteUser(id)`. 
- By deleting the Clerk identity but keeping the Prisma `User` record (downgraded to `MEMBER`), we successfully achieve a "Soft Delete": The user is permanently locked out of the system (credentials destroyed), they are removed from the Staff/Trainer tables, but their historical financial transactions remain fully intact for accounting purposes.

## 3. Expected Outcome
When an admin clicks to delete a staff member who has existing transactions, the system will effortlessly revoke their access by dropping their role to `MEMBER` and deleting their auth credentials. The Prisma Foreign Key constraint error will be entirely avoided, and the staff member will instantly disappear from the "Manajemen Karyawan" UI.