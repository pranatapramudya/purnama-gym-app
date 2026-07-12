# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.03 (TypeScript Strict Null-Check Hotfix)
**Module:** Authentication Sync Routing (`app/auth-sync`)

## 1. Problem Statement
The Next.js application fails during the Vercel deployment build step (`npm run build`) with a TypeScript strict error: `Type error: 'dbUser' is possibly 'null'`. This occurs in the routing logic where the system evaluates `dbUser.role` for redirection. 

## 2. Root Cause Analysis
The Prisma query `prisma.user.findUnique()` explicitly returns `User | null`. In the current implementation, the code attempts to access the `.role` property of `dbUser` without first verifying if the `dbUser` object exists in memory. TypeScript strictly prohibits accessing properties of potentially `null` objects during the build phase to prevent runtime crashes.

## 3. Required Action Plan for AI Agent
Please refactor the specific file causing the error (likely `app/auth-sync/page.tsx` or wherever the post-login routing resides). Do not change the core architecture; just satisfy the TypeScript compiler using the following steps:

### A. Implement a Type Guard (Null Check)
- Locate the condition where `dbUser.role` is evaluated (around line 29 based on the error log).
- Immediately BEFORE evaluating the `role`, insert a strict check to see if `dbUser` is falsy (`null` or `undefined`).
- If `dbUser` is `null`, the code must safely exit that block (e.g., return a loading state, continue the polling loop, or wait for the next attempt). It should not proceed to the role evaluation.

### B. Safe Property Access
- Ensure that the routing logic (e.g., `if (dbUser.role === "ADMIN_KASIR"...)`) is placed securely inside a block where TypeScript guarantees `dbUser` is defined.
- Alternatively, utilize Optional Chaining (`dbUser?.role`) if it fits the polling retry logic gracefully, though an explicit early return for `!dbUser` is preferred for clarity in routing.

## 4. Expected Outcome
The codebase must successfully pass the `npm run build` and `npm run lint` commands locally without throwing any TypeScript TypeErrors related to `dbUser`. Once this compiles successfully locally, it will deploy flawlessly on Vercel.