# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.92 (Role-Based E2E Testing Expansion: Kasir & Trainer)
**Modules Affected:** E2E Auth Mocking, `global-setup.ts`, and new test suites.

## 1. Problem Statement
The current E2E testing framework successfully validates the `SUPER_ADMIN` and `MEMBER` roles. To achieve 100% Critical Path coverage for our RBAC (Role-Based Access Control) architecture before our first B2B deployment, we must expand the test suite to include the `ADMIN_KASIR` (Cashier) and `PERSONAL_TRAINER` roles. We need to verify that these mid-level roles have strict access to their respective modules and are blocked from unauthorized areas.

## 2. Required Action Plan for AI Agent
Do not generate raw code blocks. Integrate these requirements directly into the existing Playwright infrastructure.

### A. Seed Additional Mock Users (`e2e/global-setup.ts`)
- Expand the database seeding logic to upsert two new test users:
  1. Role: `ADMIN_KASIR` (e.g., `clerkUserId: 'test-kasir-clerk-id'`)
  2. Role: `PERSONAL_TRAINER` (e.g., `clerkUserId: 'test-trainer-clerk-id'`)
- Ensure both users have default `phoneNumber` and `address` values to bypass any onboarding middleware.

### B. Expand Auth Mocking Logic
- Update the mock authentication injection (in `proxy.ts`, Edge middleware, and the relevant `layout.tsx` or `page.tsx` files) to recognize two new values for the `playwright-role` cookie:
  - If `playwright-role=ADMIN_KASIR`, inject the Kasir mock `userId`.
  - If `playwright-role=PERSONAL_TRAINER`, inject the Trainer mock `userId`.

### C. Create Kasir Test Suite (`e2e/kasir.spec.ts`)
- Set the browser context to inject the `playwright-role=ADMIN_KASIR` cookie.
- **Positive Test:** Navigate to the POS/Cashflow module. Assert that the Kasir can view the income/expense form and successfully submit a transaction.
- **Negative Test:** Attempt to navigate to a Super Admin exclusive route (e.g., deleting a report, accessing global settings, or viewing Net Profit). Assert that the system blocks access (redirects or displays a 403 Forbidden UI).

### D. Create Trainer Test Suite (`e2e/trainer.spec.ts`)
- Set the browser context to inject the `playwright-role=PERSONAL_TRAINER` cookie.
- **Positive Test:** Navigate to the Trainer module (e.g., schedule or member list). Assert the page loads successfully with the correct UI elements.
- **Negative Test:** Attempt to navigate to `/2026/kasir`. Assert that the system immediately blocks the Trainer and redirects them away, validating strict financial data isolation.

## 3. Expected Outcome
Running `npm run test:e2e` will execute four distinct test suites (`cashflow`, `member`, `kasir`, `trainer`). The tests will definitively prove that all four roles are perfectly sandboxed within their authorized modules, ensuring a highly secure multi-tenant environment.