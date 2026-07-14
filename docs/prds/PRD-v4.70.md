# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.70 (Progressive Web App / PWA Implementation)
**Module:** App Layout & Static Assets (PWA Configuration)

## 1. Problem Statement
Currently, when the Next.js application is accessed or added to the mobile home screen, it launches within standard browser frames (showing the URL address bar and navigation controls). To provide a premium, native-like SaaS experience for gym cashiers and admins, the application must be configured as a Progressive Web App (PWA) running in `standalone` mode, which completely hides the browser UI on both Android and iOS.

## 2. Required Action Plan for AI Agent
Execute the following implementation using Next.js App Router standards. **Do NOT output raw code blocks in your response; apply the code directly to the files.**

### A. Create the Web Manifest
- Create a new file named `manifest.json` inside the `public` directory.
- Define the standard PWA JSON structure. 
- **CRITICAL:** Set `"display": "standalone"`. (This is the strict requirement to remove the browser UI).
- Define `"name": "Purnama Gym"`, `"short_name": "Purnama"`, and `"start_url": "/"`.
- Define the `"background_color"` and `"theme_color"` to match the SaaS branding (e.g., `#ffffff`).
- *Note for AI:* Assume standard 192x192 and 512x512 icons exist in the public folder (e.g., `/icon-192x192.png`). Generate the JSON array for these icons.

### B. Update Next.js Metadata & Viewport (iOS Support)
- Open `app/layout.tsx`.
- Update the `viewport` export (or metadata, depending on the exact Next.js 14/15 version conventions) to include standard PWA theme colors.
- Inject Apple-specific meta tags to ensure iOS Safari respects the standalone mode:
  - Add `appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Purnama Gym' }` to the exported `metadata` object.
- Ensure the `manifest` property is linked in the metadata: `manifest: '/manifest.json'`.

### C. Offline Support / Service Worker (Optional but Recommended)
- If necessary to trigger the Android "Install App" prompt, implement a basic service worker or setup `next-pwa` / `@serwist/next` configurations in `next.config.js`. (Prioritize the manifest and metadata first for immediate UI fixing).

## 3. Expected Outcome
When users open the URL on Android (Chrome) or iOS (Safari) and select "Add to Home Screen", the resulting home screen icon launches a fully standalone application. The browser URL bar, navigation buttons, and Chrome wrappers are entirely invisible, rendering a 100% native app experience.