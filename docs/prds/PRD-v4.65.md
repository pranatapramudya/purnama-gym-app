# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.65 (Member Archiving / Soft Delete Architecture)
**Module:** `MembersClient.tsx` (Biodata Modal) & Prisma Schema

## 1. Problem Statement
Attempting to delete a member via the "Hapus Member" button in the Biodata Modal throws a Prisma `RESTRICT` foreign key error (`Transaction_userId_fkey`). This occurs because the member has existing financial transactions. Hard-deleting members with financial histories destroys accounting integrity and is bad practice for a CRM. 
The system needs a "Soft Delete" (Archiving) mechanism so admins can hide inactive/deleted members without corrupting the historical transaction database, with the ability to restore them later.

## 2. Required Action Plan for AI Agent
Execute the following Database Schema, Backend, and UI upgrades. **Do NOT output raw code blocks; apply the fixes directly.**

### A. Database Schema Update (Prisma)
- Open `schema.prisma`.
- Locate the `User` model.
- Add a new boolean field: `isArchived Boolean @default(false)`
- Run the necessary Prisma db push/migration command (e.g., `npx prisma db push`) to apply this to the local database and generate the Prisma client.

### B. Backend Action Refactoring (Soft Delete)
- Locate the Server Action responsible for deleting a member.
- Replace the `prisma.user.delete(...)` logic with an `update` logic:
  `await prisma.user.update({ where: { id: memberId }, data: { isArchived: true } })`
- Create a corresponding action to restore the member:
  `await prisma.user.update({ where: { id: memberId }, data: { isArchived: false } })`

### C. UI Upgrades (Members Table & Modal)
- **Biodata Modal:** 
  - Change the red "Hapus Member" button to "Arsipkan Member" (Archive Member) with a warning/orange color scheme.
  - If the member is already archived (i.e., viewing an archived member's profile), change the button to a green "Pulihkan Member" (Restore Member) that triggers the restore action.
- **Member Table (`MembersClient.tsx`):**
  - Update the data fetching/filtering logic. The default table view must **ONLY** display users where `isArchived` is `false` (or undefined).
  - Add a Filter Toggle or Tab above the table (e.g., next to the Search bar) that says: `[ Member Aktif ] [ Arsip Member ]`. 
  - When "Arsip Member" is clicked, the table should display users where `isArchived === true`.

## 3. Expected Outcome
The "Hapus Member" functionality is replaced by a professional Archiving system. Admins can archive members to clean up the main table without triggering Prisma Foreign Key crashes or breaking financial reports. Archived members are moved to a separate "Arsip" view, where they can be viewed and seamlessly restored to active status if they return to the gym.