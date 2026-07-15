# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 5.01 (UI Polish & Inline Video Player Integration)
**Modules Affected:** Member Transaction History (`/member/riwayat`), and Member Guide/Tutorials (`/member/panduan`).

## 1. Problem Statement
Three distinct UX improvements are required before final deployment:
1. The "Riwayat Transaksi" header is missing the unified green gradient background, causing visual inconsistency.
2. The "Program Pemula" banner on the Panduan page is currently out of scope and clutters the UI.
3. Video tutorials redirect users outside the app to YouTube. To maintain user retention and immersion, videos must be playable inline directly within the application.

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code in your response. Apply the logical and UI changes directly to the project files.

### A. Standardize "Riwayat Transaksi" Header
- Locate the Member Transaction History component.
- Find the top header wrapper and apply the exact same signature green gradient classes used in the Profile and Beranda headers (e.g., `bg-gradient-to-r from-emerald-400 to-teal-500`).
- Ensure the text and back icon colors are adjusted to white for high contrast.

### B. Remove "Program Pemula" Banner
- Locate the Guide/Tutorials component (`/member/panduan`).
- Find the UI block rendering the pink/red "Baru pertama kali nge-gym?" card and the "Mulai Program Pemula" button.
- **Action:** Completely remove or comment out this entire component/block. The page should immediately start with the "Video Tutorial" section.

### C. Implement Inline Video Player (YouTube Embed)
- In the `Video Tutorial` mapping section of the Panduan component, locate where the video links (inputted by the Super Admin) are rendered.
- **Action:** Replace external link anchor tags (`<a target="_blank">`) with a responsive `<iframe>` element.
- **URL Parsing Logic:** Implement a helper function to convert standard YouTube URLs (e.g., `https://www.youtube.com/watch?v=VIDEO_ID` or `https://youtu.be/VIDEO_ID`) into YouTube Embed URLs (`https://www.youtube.com/embed/VIDEO_ID`). 
- **Iframe Implementation:**
  - Pass the parsed embed URL to the `src` attribute of the iframe.
  - Set the iframe width to `100%` and apply an `aspect-video` Tailwind class to maintain a perfect 16:9 aspect ratio.
  - Add `allowFullScreen` and `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"` attributes to ensure smooth inline playback.

## 3. Expected Outcome
The transaction history page matches the app's visual identity. The Guide page is cleaner without the beginner program banner. Users can now watch Super Admin-uploaded YouTube tutorials directly inside the app without being redirected to an external browser.