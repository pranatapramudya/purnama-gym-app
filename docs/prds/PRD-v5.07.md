# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 5.07 (Authentication UX / Conversational CTA Polish)
**Modules Affected:** Landing Page Navbar, Hero Section, or Main Auth Wrapper.

## 1. Problem Statement
The current authentication UI (as seen in the navbar/header with standalone "Masuk" and "Daftar" buttons) lacks conversational context. To improve user onboarding and conversion rates, the UI must explicitly guide the user with standard SaaS onboarding copy (e.g., "Belum punya akun? Daftar" and "Sudah punya akun? Masuk"). 

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code in your response. Apply the UI/UX changes directly to the relevant components.

### A. Refactor Auth CTA Group (Desktop & Mobile)
- Locate the component rendering the "Masuk" and "Daftar" buttons (likely in `Navbar.tsx`, `Header.tsx`, or the landing page Hero component).
- **Redesign the layout** of these buttons to include descriptive helper text. 
- **Implementation for Desktop (Navbar):** 
  - If space permits, group them intelligently. Example: `<span className="text-sm text-gray-600">Belum punya akun?</span> <Button>Daftar</Button>` alongside a clean `Masuk` link.
- **Implementation for Mobile Menu / Auth Modal:**
  - Create a stacked layout. 
  - Block 1: "Sudah punya akun? **Masuk**" (Make "Masuk" a clickable link/button).
  - Block 2: "Belum punya akun member? **Daftar Sekarang**" (Highlight "Daftar" with the primary green theme).

### B. Clerk Auth Flow Sync (If Applicable)
- Ensure that clicking "Masuk" correctly triggers the Clerk `<SignIn />` flow or routes to `/sign-in`.
- Ensure that clicking "Daftar" correctly triggers the Clerk `<SignUp />` flow or routes to `/sign-up`.

### C. Styling & Polish
- Use appropriate typography (`text-sm` or `text-base`).
- Use muted colors for the question text (e.g., `text-gray-500` or `text-slate-500`) to ensure the actual actionable buttons ("Masuk" / "Daftar") remain the primary focal points.
- Maintain the existing primary green color for the "Daftar" button to keep brand consistency.

## 3. Expected Outcome
New visitors will be greeted with clear, conversational prompts guiding them to either create a new member account or log into an existing one, significantly improving the first-impression UX of the application.