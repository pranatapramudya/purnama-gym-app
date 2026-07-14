# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.87 (Next.js Client-Side Environment Variables Hotfix)
**Module:** `CashflowClient.tsx` and Cloudinary Upload Utility.

## 1. Problem Statement
The Cloudinary image upload works in local development but fails in the Vercel production environment with the error: `Cloudinary credentials are not configured in environment variables`. 
This occurs because the application is attempting to access `process.env.CLOUDINARY_CLOUD_NAME` and `process.env.CLOUDINARY_UPLOAD_PRESET` from a Client Component (`CashflowClient.tsx` or its utility). In Next.js, environment variables are only exposed to the browser if they are prefixed with `NEXT_PUBLIC_`.

## 2. Required Action Plan for AI Agent
Do not generate raw code blocks. Apply this fix directly to the codebase.

### A. Update Codebase Environment Variable References
- Scan the codebase (specifically `CashflowClient.tsx` or the utility function handling the `fetch` to the Cloudinary API).
- Change all references of `process.env.CLOUDINARY_CLOUD_NAME` to `process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
- Change all references of `process.env.CLOUDINARY_UPLOAD_PRESET` to `process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
- Ensure the validation check that throws the missing credentials error is also updated to check the `NEXT_PUBLIC_` prefixed variables.

## 3. Expected Outcome
The client-side upload function will correctly read the exposed environment variables in production, allowing the Cloudinary API call to succeed without throwing the configuration error.