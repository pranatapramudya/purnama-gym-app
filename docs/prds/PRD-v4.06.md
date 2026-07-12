# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.06 (Cashflow Feature, RBAC Inheritance & Data Segregation)
**Module:** Cashier Operations & User Management

## 1. Problem Statement
Following the recent dashboard layout fixes, QA testing revealed three critical logical gaps:
1. The "Download Excel" button on the dashboard is hidden from the `ADMIN_KASIR` role.
2. The system lacks a dedicated "Buku Kas" (Cashflow) feature for `ADMIN_KASIR` to record daily "Uang Masuk" (Cash In) and "Uang Keluar" (Cash Out), which also requires an export-to-Excel function with time filters (Daily, Weekly, Monthly).
3. The "Member" management page is currently rendering ALL users from the database, meaning staff accounts (`SUPER_ADMIN`, `ADMIN_KASIR`, `PT`) are incorrectly showing up in the gym members list.

## 2. Root Cause Analysis
- **UI RBAC:** The visibility condition for the Excel download button is strictly locked to `SUPER_ADMIN`, ignoring hierarchical inheritance.
- **Missing Feature:** There is no dedicated Prisma model/logic or UI for granular operational cashflow tracking.
- **Query Missing Filters:** The Prisma `findMany` query in the Member page lacks a `where` clause to filter out non-member roles.

## 3. Required Action Plan for AI Agent
Please execute the following updates without providing raw code to the user, just implement them in the codebase:

### A. Cashflow Feature (Uang Masuk & Uang Keluar)
- Create a new UI module (e.g., under `/2026/kasir` or integrated into the Dashboard) for "Arus Kas" (Cashflow).
- **Prisma Schema Update (if necessary):** Ensure there is a table to record cash transactions (`type: IN/OUT`, `amount`, `description`, `date`, `recordedBy`).
- **Excel Export:** Build a robust Excel export feature specifically for this cashflow data. The generated Excel file must be neatly formatted (accounting style) and support dynamic filtering (Harian, Mingguan, Bulanan).
- **RBAC Inheritance:** Ensure this entire feature, including the Excel download, is accessible to BOTH `ADMIN_KASIR` and `SUPER_ADMIN`.

### B. Restore Dashboard Excel Button for Cashier
- Update the condition for the main dashboard's "Download Excel" button so it is visible to `role === 'SUPER_ADMIN' || role === 'ADMIN_KASIR'`.

### C. Data Segregation (Member vs. Staff)
- **Member Page:** Update the Prisma query in the "Member" list page (e.g., `app/2026/member/page.tsx`). Add a strict filter: `where: { role: 'MEMBER' }`.
- **Employee Management Page:** Update the Prisma query in the "Manajemen Karyawan" page to fetch only staff roles: `where: { role: { in: ['SUPER_ADMIN', 'ADMIN_KASIR', 'PT'] } }`. This ensures staff accounts have their own dedicated room and don't pollute the customer list.

## 4. Expected Outcome
The `ADMIN_KASIR` can fully operate the cashflow system and download financial reports. The `SUPER_ADMIN` retains ultimate visibility over these financial features. The "Member" page cleanly displays only actual gym customers, while staff data is securely routed to the Employee Management page.