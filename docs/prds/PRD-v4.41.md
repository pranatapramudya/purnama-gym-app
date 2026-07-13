# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.41 (Scanner Time Formatting Sync & Avatar Cleanup)
**Module:** `ScannerClient.tsx` (Scanner History) & Dashboard Check-in List

## 1. Problem Statement
1. **Formatting Mismatch:** The recent check-in list on the Dashboard component correctly displays the exact time (e.g., "10.18"). However, the exact same records displayed in the Scanner component's history show "00.00 WIB". This indicates the database holds the correct timestamp, but the Scanner component is incorrectly parsing, fetching, or formatting the time data.
2. **Lingering Avatars:** The circular avatar initials (e.g., "P") are still visible in the check-in lists on both the Scanner and Dashboard pages, despite a previous directive to replace them with sequential index numbers globally.

## 2. Required Action Plan for AI Agent
Execute the following fixes. **Do NOT output raw code blocks in your response; apply the fixes directly to the codebase.**

### A. Sync Scanner Time Formatting with Dashboard
- Open the Dashboard component and inspect how the time is being fetched and formatted for the "Check-in Terkini" list (which successfully shows correct times like "10.16").
- Open `ScannerClient.tsx` (or the respective server action fetching its history).
- **Verify the Query:** Ensure the database query for the Scanner history is selecting the full, unmodified `createdAt` or `checkInTime` timestamp (do not group or truncate by date in a way that drops the time).
- **Copy the Formatter:** Apply the exact same date-formatting logic/library used in the Dashboard to the Scanner component.
- Ensure the output format is `HH.mm WIB` (e.g., `10.18 WIB`).

### B. Global Cleanup: Remove Circular Avatars
- Inspect the list item components inside the Scanner History and Dashboard Check-in lists.
- Completely remove the UI component rendering the circular initial avatar.
- Replace it with a clean, sequential index number (e.g., `#1`, `#2`) based on the array map index, aligning with the design update previously applied to the Member Management page.

## 3. Expected Outcome
The Scanner history list perfectly mirrors the Dashboard's accuracy, showing the exact real-time check-in hour and minute. Additionally, all circular avatars in these quick-view lists are eradicated and replaced by clean sequential numbering, finalizing the minimalist UI overhaul.