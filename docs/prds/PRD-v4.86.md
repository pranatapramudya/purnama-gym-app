# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.86 (Documentation Sync: README & Architecture)
**Target Files:** `README.md` and `architecture.md` (or create them if they don't exist).

## 1. Problem Statement
Significant foundational, UI, and infrastructure changes have been implemented in the recent sprint (v4.80 - v4.85). The project documentation is currently out of sync and needs to accurately reflect the new tech stack, environment variables, and architectural decisions to maintain a professional standard.

## 2. Required Action Plan for AI Agent
Update the documentation files with the following technical details. **Write the documentation professionally.**

### A. Update `README.md`
- **Features Section:** Add the newly integrated features:
  - Secure Cloud Image Storage (Receipts/Kwitansi) with Client-Side Canvas Compression.
  - Advanced Financial Reporting (Excel generation with Net Profit/Loss) secured by RBAC (`SUPER_ADMIN` only).
  - Modern, localized (Indonesian) Global Date Range Picker with Dynamic Chart grouping (Hour/Day/Month).
- **Environment Variables:** Clearly list the new required `.env` variables:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_UPLOAD_PRESET` (Note that it must be an Unsigned preset).

### B. Update `architecture.md`
- **Storage Strategy (Cloudinary):** Document the decision to use Cloudinary's REST API over heavy client SDKs. Explain the flow: Client-side compression (< 300KB) -> Sanitize filename (remove slashes) -> Upload via Unsigned Preset -> Store `secureUrl` in PostgreSQL via Prisma.
- **UI & Component Architecture:** Document the adoption of `shadcn/ui` (Popover, Calendar) coupled with `react-day-picker` and `date-fns` (id locale). Explain the responsive strategy implemented for the DatePicker (mobile-first full-width trigger, horizontal scrolling/grid for preset shortcuts).
- **Security & Data Handling:** Document the strict separation of concerns in the Cashflow module: Cashiers only see Income/Expense/Balance, while Net Profit/Loss is calculated purely on the server-side during Excel generation for Super Admins.

## 3. Expected Outcome
The `README.md` and `architecture.md` files are fully updated, providing a clear, accurate, and professional overview of the current system state, infrastructure dependencies, and UI architecture.