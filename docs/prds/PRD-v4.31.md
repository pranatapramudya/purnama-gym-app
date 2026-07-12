# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.31 (TypeScript Build Hotfix - Dead Code Removal)
**Module:** Admin PT Management Route (`page.tsx` & Client Component)

## 1. Problem Statement
Vercel deployment failed during `npm run build` with the following TypeScript error:
`Type error: Cannot find name 'PTSettingItem'.` at line 44.
The prop `ptSetting: PTSettingItem | null;` is still lingering in the component's props interface, even though the Global Master Settings feature was completely deprecated and removed in previous versions.

## 2. Root Cause Analysis
During the removal of the Global PT Settings (PRD-v4.21), the `PTSettingItem` interface and its related UI were deleted, but the `ptSetting` prop was left behind in the parent component's prop definitions. Next.js strictly enforces type checking during the build step, causing the deployment to crash.

## 3. Required Action Plan for AI Agent
Execute the following cleanup:

### A. Remove Lingering TypeScript Props
- Open the file causing the error (likely the Admin PT Client Component or Page where `initialSessions`, `userRole`, `initialSlots` are defined).
- **Delete** the line: `ptSetting: PTSettingItem | null;` from the Props interface.
- **Delete** any destructuring of `ptSetting` in the component's function signature.

### B. Clean Up Server Component Fetching
- Open the parent Server Component (likely `app/2026/personal-trainer/page.tsx`).
- Locate the database query that was fetching the global setting (e.g., `const ptSetting = await prisma.pTSetting.findFirst(...)`).
- **Delete** this query entirely. It is dead code.
- Remove `ptSetting` from the payload being passed to the child Client Component.

## 4. Expected Outcome
The dead `ptSetting` code is completely eradicated. Running `npm run build` locally will succeed without any TypeScript "Cannot find name" errors, ensuring a flawless Vercel deployment.