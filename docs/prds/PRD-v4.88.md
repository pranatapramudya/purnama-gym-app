# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.88 (Ephemeral Image & Persistence Hotfix)
**Module:** `CashflowClient.tsx`, Transaction Server Action/API, and Next.js Config.

## 1. Problem Statement
The uploaded Cloudinary receipt image is experiencing a "view once" bug. After uploading, the user can view the receipt once, but upon reopening or refreshing the page, the image becomes inaccessible or disappears. This indicates a critical failure in either database persistence (optimistic UI update without backend sync) or Next.js Image host blocking.

## 2. Required Action Plan for AI Agent
Do not generate raw code blocks. Diagnose and apply fixes directly to the underlying architecture based on these strict directives:

### A. Fix Database Persistence (Prisma)
- Locate the Server Action or API Route responsible for creating a new transaction (e.g., `createTransaction(data)`).
- **Verify Payload:** Ensure that the `buktiKwitansi` string (the Cloudinary `secureUrl`) is actively being passed from the frontend form submission into the backend API.
- **Verify Prisma Query:** Ensure the Prisma query (`db.transaction.create` or `update`) explicitly maps the `buktiKwitansi` field into the database schema. If the backend is ignoring this field, the UI will lose the image upon page reload.

### B. Whitelist Cloudinary Domain (Next.js Config)
- Locate `next.config.js`, `next.config.mjs`, or `next.config.ts`.
- If the application uses the Next.js `<Image>` component to render the receipt, you MUST add `res.cloudinary.com` to the `remotePatterns` configuration.
- Configuration syntax example:
  `remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }]`

### C. UI Dialog State Management
- Check the `Dialog` or `Modal` component used to view the receipt.
- Ensure that the state managing the currently selected image (e.g., `setSelectedImage(null)`) is properly reset when the modal is closed via the `onOpenChange` handler. If the state gets stuck, subsequent clicks on "Lihat Bukti" might fail to trigger the modal.

## 3. Expected Outcome
The `secureUrl` is permanently saved to the PostgreSQL database. The Next.js configuration allows images from Cloudinary to be rendered. The user can view the receipt multiple times, and the image survives a hard page refresh.