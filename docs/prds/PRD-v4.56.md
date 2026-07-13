# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.56 (Unified CRM Registration & Auto-Fill Sync)
**Module:** `MembersClient.tsx` & Registration Modal Component

## 1. Problem Statement
1. **Inaccurate UI Labels:** The current member registration button and modal title explicitly say "Registrasi Member Baru Khusus VIP". Since this module now handles "Visit Harian" (Daily Passes) and walk-in customers, the terminology is misleading for cashiers/admins.
2. **Data Redundancy (Manual Entry Bottleneck):** When a user has already signed up via the frontend app, their data (Email, Name, Phone) exists in the database. Currently, admins have to manually re-type this information during walk-in registration. There is no mechanism to pull/sync existing user data, leading to slow checkout times and potential Prisma unique constraint errors (P2002) if the admin tries to register an existing email as a new user.

## 2. Required Action Plan for AI Agent
Execute the following UI and logic upgrades directly into the codebase. **Do NOT output raw code blocks; apply the fixes directly.**

### A. UI Label Updates (Unified CRM)
- **Main Button:** Locate the `+ Registrasi Member Baru` button in the Member Management view. Change the text to `+ Registrasi VIP & Visit Harian`.
- **Modal Title:** Change the modal header title from `Registrasi Member Baru Khusus VIP` to `Registrasi VIP & Visit Harian`.
- **Submit Button:** Change the green submit button at the bottom of the modal from `Daftarkan Member & Bayar` to `Proses & Bayar`.

### B. Implement "Cek Data" (Auto-Fill Sync) Logic
- **UI Addition:** Inside the modal, modify the "Email" input field. Add a small, secondary button next to or inside the email input field labeled `Cek Data` (Search). 
- **Fetch Logic (Server Action/API):**
  - When the admin types an email and clicks `Cek Data`, trigger a fetch request to check if a user with that email already exists in the database.
  - Add a loading state (spinner or text change) to the button while fetching.
- **Success State (User Found):** 
  - Automatically populate the `Nama Lengkap` and `Nomor Telepon` fields with the fetched data.
  - *CRITICAL ARCHITECTURE:* Save the fetched user's `id` in a hidden state (e.g., `existingUserId`). When the form is submitted, the backend **must NOT** create a new user. Instead, it should just create the new Transaction/Membership record and link it to this existing `userId`.
- **Empty State (User Not Found):**
  - Show a subtle toast or helper text: *"Data tidak ditemukan. Silakan isi manual."* (Data not found. Please fill manually).
  - The form should proceed as a standard new user registration when submitted.

## 3. Expected Outcome
The Member Management portal now acts as a Unified CRM. Admins can instantly pull up existing registered users with the "Cek Data" button, drastically speeding up the checkout process for Daily Visits and VIP packages. The UI text accurately reflects that the modal is used for all types of transactions, not just VIPs, and backend unique email constraints are safely avoided.