# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.93 (Documentation Sync: Full RBAC E2E Coverage)
**Target Files:** `README.md` and `architecture.md`.

## 1. Problem Statement
The E2E testing infrastructure has been successfully expanded to cover the complete Role-Based Access Control (RBAC) architecture, including `SUPER_ADMIN`, `MEMBER`, `ADMIN_KASIR`, and `PERSONAL_TRAINER` roles. The documentation must be updated to reflect this 100% critical path coverage so future maintainers understand the testing boundaries and auth-mocking mechanisms.

## 2. Required Action Plan for AI Agent
Update the documentation files comprehensively without generating raw code blocks in your response. Apply the updates directly to the files.

### A. Update `README.md`
- **Testing Section Enhancement:** Expand the testing section to explicitly list the four distinct test suites currently running via Playwright.
- Highlight that the E2E tests validate complete data isolation (e.g., Trainers cannot access Kasir modules, Members cannot access Admin panels).
- Reinforce the command `npm run test:e2e` and note that it uses mock data to bypass Clerk authentication seamlessly.

### B. Update `architecture.md`
- **RBAC Testing Architecture:** Add a detailed subsection explaining the multi-role testing strategy.
- Document the `playwright-role` cookie implementation used in `proxy.ts`, layouts, and pages to dynamically inject mock `userId`s based on the role being tested (`test-kasir-clerk-id`, `test-trainer-clerk-id`, etc.).
- Explain the database seeding strategy in `global-setup.ts`, noting that mock users are pre-filled with onboarding data (phone, address) to prevent redirect loops during automated testing.

## 3. Expected Outcome
The project documentation accurately serves as a source of truth for the newly implemented enterprise-grade security and testing architecture, ensuring any future API routes or pages added to the SaaS adhere to these established testing protocols.