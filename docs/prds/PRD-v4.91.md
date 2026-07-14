# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.91 (Documentation Sync: Testing Infrastructure)
**Target Files:** `README.md` and `architecture.md`.

## 1. Problem Statement
We have successfully implemented a comprehensive automated testing infrastructure (Jest for Unit Testing, Playwright for E2E, and RBAC auth mocking). The project documentation must be updated to reflect these architectural additions so future development and CI/CD pipelines can utilize them correctly.

## 2. Required Action Plan for AI Agent
Update the documentation files with the following details.

### A. Update `README.md`
- **Testing Section (New):** Add a dedicated section explaining the testing stack.
  - Mention **Jest & React Testing Library** for unit/component tests.
  - Mention **Playwright** for End-to-End (E2E) testing.
- **Available Commands:** List the new commands clearly:
  - `npm run test` (Runs Jest unit tests)
  - `npm run test:e2e` (Runs Playwright E2E suites)
- **Important Note:** Add a warning that the local dev server should either be stopped or fully compiled before running E2E tests, and mention the automatic test database seeding.

### B. Update `architecture.md`
- **Testing Architecture Section (New):** Document the E2E strategy.
  - **Auth Bypass:** Explain how we bypass Clerk authentication in E2E tests using the `playwright-role` cookie (`SUPER_ADMIN` and `MEMBER`) injected into the Next.js edge proxy and layouts.
  - **API Interception:** Document the strategy of using `page.route` in Playwright to intercept external API calls (like Cloudinary) to prevent junk data uploads during testing.
  - **Global Seeding:** Briefly explain `e2e/global-setup.ts` and how it uses `@next/env` and Prisma to ensure mock users exist in the database prior to test execution.

## 3. Expected Outcome
Both documentation files are updated professionally, accurately reflecting the new testing commands and the underlying engineering decisions for auth-mocking and API interception.