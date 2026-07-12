# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.30 (Production URL Migration & Documentation Finalization)
**Module:** QR Generator & Project Documentation

## 1. Problem Statement
1. **Production URL Hardcoding:** The QR generator is currently pointing to `localhost:3000`. This will fail in production. It must dynamically detect the base URL of the Vercel deployment (`https://purnama-gym.vercel.app`).
2. **Missing Project Documentation:** The project documentation (`README.md` and `ARCHITECTURE.md`) needs to be finalized to reflect the current robust production-ready state of the system.

## 2. Required Action Plan for AI Agent
Execute the following updates:

### A. Dynamic URL Fix (QR Generator)
- Open the QR code generation component.
- Remove the hardcoded string `http://localhost:3000`.
- Use a dynamic approach: 
  - If available, use `process.env.NEXT_PUBLIC_APP_URL`.
  - Fallback to `window.location.origin` if the code runs in the browser context.
  - *Resulting URL format:* `${baseUrl}/verify/${memberCode}`.

### B. Documentation Update
- **Update README.md:** Replace the placeholder features with the content provided in the previous audit (PRD v4.28/4.29).
- **Update ARCHITECTURE.md:** Add the final system flow summary:
  - Mention the shift from `Global Master Pricing` to `Snapshot Slot Pricing`.
  - Document the `QR -> URL -> Scanner -> Biodata Lookup` flow as the core verification engine.
- Ensure the language is professional and in Indonesian as requested previously.

## 3. Expected Outcome
The QR codes generated for members will now correctly point to `https://purnama-gym.vercel.app/verify/[code]`. The project's documentation is now a comprehensive record of the robust, dynamic, and pro-level system you have built today.