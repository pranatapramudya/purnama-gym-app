# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.90 (Role-Based E2E Testing: Member Flow)
**Modules Affected:** E2E Auth Mocking, `global-setup.ts`, and new test file.

## 1. Problem Statement
The current E2E testing infrastructure successfully mocks authentication for the `SUPER_ADMIN` role. However, we need to validate the application from the perspective of a `MEMBER` to ensure proper Role-Based Access Control (RBAC). The testing framework must support switching roles dynamically during test execution.

## 2. Required Action Plan for AI Agent
Do not generate raw code blocks. Implement these changes directly into the testing architecture.

### A. Refactor E2E Auth Mocking for Multiple Roles
- Modify the existing Clerk bypass logic (in `proxy.ts`, middleware, or layout) to read the desired role from the Playwright test context. 
- *Strategy:* Instead of a generic `playwright-test` cookie, update the test setup to set a specific cookie value (e.g., `playwright-role=MEMBER` vs `playwright-role=SUPER_ADMIN`). The backend mock should read this cookie and inject the corresponding mock `userId` and role.

### B. Seed a Mock Member User
- Open `e2e/global-setup.ts`.
- In addition to the test admin user, add a Prisma query to upsert a test user with the `MEMBER` role (e.g., `clerkUserId: 'test-member-clerk-id'`).

### C. Create Member E2E Test Suite
- Create a new file: `e2e/member.spec.ts`.
- Set the browser context in this file to inject the `MEMBER` auth cookie.
- **Write Two Test Cases:**
  1. **Positive Test (Member Access):** Navigate to a member-specific page (e.g., Member Dashboard or Class Schedule) and assert that the page loads correctly and displays member-relevant data.
  2. **Negative Test (RBAC Verification):** Attempt to navigate to an admin-restricted route (e.g., `/2026/kasir` or the Dashboard Export function) and assert that the application properly blocks access (e.g., redirects to unauthorized, shows a 403 error, or hides the restricted UI elements).

## 3. Expected Outcome
Running `npm run test:e2e` will now execute both `cashflow.spec.ts` (as an Admin) and `member.spec.ts` (as a Member). The framework will definitively prove that standard members cannot access sensitive financial modules.