# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.02 (Bug Fix & Webhook Refinement)
**Module:** Clerk Webhook Role Assignment Logic

## 1. Problem Statement
The core authentication flow is successfully receiving data and inserting new users into the Prisma database. However, the Role-Based Access Control (RBAC) assignment logic is failing. Emails explicitly listed in the `SUPER_ADMIN_EMAILS` environment variable are still being assigned the default `MEMBER` role instead of the expected `SUPER_ADMIN` role.

## 2. Root Cause Analysis
The issue is isolated within the Next.js API Route handling the Clerk webhook (`app/api/webhooks/clerk/route.ts`). The comparison logic between the incoming Clerk email payload and the `.env` string is returning false. Potential points of failure include:
- Incorrect extraction of the email string from Clerk's `email_addresses` array (Clerk sends an array of objects, not a flat string).
- Case sensitivity mismatches between the user input and the `.env` file.
- Whitespace issues during the `.split(',')` operation on the `.env` string.

## 3. Required Action Plan for AI Agent
Please refactor the Clerk webhook handler focusing ONLY on the role assignment logic. Do not alter the existing working Prisma `create` structure. Implement the following strict validations:

### A. Robust Email Extraction
- Safely extract the primary email address from the incoming Clerk webhook payload (`evt.data.email_addresses[0].email_address`).
- Convert the extracted email to lowercase to ensure a secure, case-insensitive comparison.

### B. Bulletproof Environment Variable Parsing
- Read `process.env.SUPER_ADMIN_EMAILS`. Fallback to an empty string if undefined.
- Split the string by commas (`,`).
- Map through the resulting array to explicitly `.trim()` any accidental whitespace and convert each registered VIP email to lowercase.

### C. Role Assignment Logic
- Perform a strict inclusion check: does the sanitized VIP list array contain the sanitized incoming email?
- If `true`, assign the Prisma enum `SUPER_ADMIN`.
- If `false`, assign the Prisma enum `MEMBER`.
- Ensure this calculated role is passed into the Prisma payload.

### D. Observability & Logging (Crucial)
- Inject `console.log` statements immediately before the Prisma `create` query. 
- Log the following values so the developer can trace the logic in the local terminal:
  1. `[WEBHOOK] Incoming Email:` (The extracted string)
  2. `[WEBHOOK] Parsed VIP List:` (The array of parsed emails)
  3. `[WEBHOOK] Assigned Role:` (The final calculated enum)

## 4. Expected Outcome
When a user registers using an email present in the `.env` file, the webhook will accurately log the matching process and insert the user into the database with the `SUPER_ADMIN` role. This will allow the existing `/auth-sync` routing logic to correctly forward the user to `/2026/dashboard`.