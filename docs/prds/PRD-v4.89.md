# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.89 (Automated Testing Infrastructure Setup)
**Modules Affected:** Global Project Configuration (Jest & Playwright).

## 1. Problem Statement
As the application scales with complex features (Cloudinary integrations, RBAC Excel exports, dynamic dynamic charting), relying solely on manual End-to-End (E2E) and User Acceptance Testing (UAT) is no longer viable. We need a robust, automated testing infrastructure to catch regressions early before pushing to Vercel production.

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code for the user to copy. Execute the installation and configuration directly in the repository.

### A. Set Up Unit Testing (Jest & React Testing Library)
- **Install Dependencies:** Install `jest`, `jest-environment-jsdom`, `@testing-library/react`, and `@testing-library/jest-dom` as dev dependencies.
- **Configuration:** Create `jest.config.mjs` (or `.ts`) configured specifically for the Next.js App Router environment.
- **Initial Test Case:** Create a `__tests__` folder. Write a basic unit test for a simple utility function or an isolated component (e.g., test that the `DateRangePicker` renders the correct placeholder text in Indonesian).

### B. Set Up E2E Testing (Playwright)
- **Install Dependencies:** Initialize Playwright testing via `npx create-playwright` (configure it to run quietly/headless and point to the Next.js dev server url, usually `http://localhost:3000`).
- **Configuration:** Update `playwright.config.ts` to ensure it automatically starts the local dev server before running tests.
- **Initial E2E Test Case (Cashier Flow):** 
  - Create a test file `e2e/cashflow.spec.ts`.
  - Write a test that simulates a cashier navigating to the "Buku Kas" page, opening the "Catat Transaksi" modal, filling out an Income/Expense form, and clicking save.
  - **CRITICAL:** Mock or intercept the Cloudinary API fetch request in the Playwright test so that automated tests DO NOT actually upload dummy images to the real Cloudinary bucket.

### C. NPM Scripts
- Update `package.json` with the following scripts:
  - `"test": "jest"`
  - `"test:e2e": "playwright test"`

## 3. Expected Outcome
The repository is fully equipped with both Unit/Integration testing (Jest) and E2E testing (Playwright). The developer can run `npm run test` or `npm run test:e2e` in the terminal to automatically verify the integrity of the application without breaking the production database or external API quotas.