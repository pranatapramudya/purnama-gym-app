# Urgent Bug Fix PRD - Purnama Gym SaaS
**Version:** 4.81 (Cloudinary Slash Error & FormData Sanitization Hotfix)
**Module:** `CashflowClient.tsx` (Buku Kas) - `uploadToCloudinary` utility.

## 1. Root Cause Analysis
The application is throwing a `Display name cannot contain slashes` error at runtime during the image upload process. This occurs because the Cloudinary REST API is receiving a payload where the implicit or explicit `filename`, `public_id`, or `display_name` contains slash characters (`/`). This usually happens when appending a `File` or `Blob` object to `FormData` directly using `file.name` from mobile devices or absolute paths.

## 2. Required Action Plan for AI Agent
Do not generate raw code blocks for the user to copy. Apply these fixes directly to the codebase. **Ensure all UI text and error alerts remain strictly in Indonesian.**

### A. Sanitize FormData Filename (CRITICAL FIX)
Locate the `uploadToCloudinary` function or the exact location where the `FormData` object is constructed before the `fetch` call to `api.cloudinary.com`.
- **Action:** When appending the file to the `FormData` (e.g., `formData.append('file', fileBase64OrBlob, file.name)`), you MUST NOT use the original `file.name`.
- **Replacement:** Hardcode a safe, slash-free filename string (e.g., `'receipt.jpg'`) OR dynamically generate a slash-free string using a timestamp (e.g., `const safeName = "bukti-" + Date.now() + ".jpg";`).
- **Example Logic to implement:** `formData.append('file', compressedFile, safeName);`
- Ensure absolutely no custom parameters like `public_id` or `folder` containing slashes are being passed in the payload. Let the Unsigned Preset handle the directory routing.

### B. Verify Client-Side Compression
- Confirm that the HTML5 Canvas compression utility (scaling the image down to max 800px width/height and 70% quality) is fully implemented *before* the sanitized file is sent to Cloudinary. 

### C. Error Handling & UI Feedback
- Ensure the `catch` block in `handleSubmit` properly catches the error and displays a readable Indonesian alert (e.g., "Gagal mengunggah bukti kwitansi. Silakan coba lagi.").
- Maintain the loading state ("Mengunggah...") on the submit button so the user cannot spam the button during the Cloudinary fetch request.

## 3. Expected Outcome
The Cloudinary API will receive a strictly sanitized file name (e.g., `bukti-123456.jpg`) without any slash characters. The upload will succeed instantly, the image will be compressed, and the `secureUrl` will be saved to the database.