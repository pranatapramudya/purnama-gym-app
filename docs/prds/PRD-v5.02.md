# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 5.02 (Video Tutorial Pagination)
**Modules Affected:** Member Guide/Tutorials Page (`/member/panduan`).

## 1. Problem Statement
The video tutorial section successfully embeds YouTube videos inline. However, as the Super Admin adds more videos, rendering all of them simultaneously will cause infinite scrolling and degrade frontend performance. The business requirement dictates a strict pagination limit of **3 videos per page** to maintain a clean UI and optimal user experience.

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code in your response. Implement the pagination logic directly into the frontend component using React state.

### A. Implement Pagination State Logic
- Locate the Member Guide/Tutorial component where the video array is mapped and rendered.
- Introduce React `useState` to track the current page: `const [currentPage, setCurrentPage] = useState(1);`.
- Define a constant for the maximum items per page: `const ITEMS_PER_PAGE = 3;`.
- Calculate the slice indices based on the current page:
  - `indexOfLastVideo = currentPage * ITEMS_PER_PAGE;`
  - `indexOfFirstVideo = indexOfLastVideo - ITEMS_PER_PAGE;`
- Slice the original video array to create `currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);`.
- Update the JSX to map over `currentVideos` instead of the entire `videos` array.

### B. Add UI Pagination Controls
- Add a new pagination control UI immediately below the mapped video list.
- Create two buttons: **"Sebelumnya"** (Previous) and **"Selanjutnya"** (Next).
- **Styling:** Style the buttons cleanly (e.g., using Tailwind's outline or subtle solid button styles) to match the application's aesthetic.
- **State Handlers:** 
  - `onClick` for Previous decreases `currentPage` by 1.
  - `onClick` for Next increases `currentPage` by 1.
- **Disabled States (Crucial):**
  - Disable the "Sebelumnya" button if `currentPage === 1`. Apply a visual disabled state (e.g., `opacity-50 cursor-not-allowed`).
  - Calculate `totalPages = Math.ceil(videos.length / ITEMS_PER_PAGE);`.
  - Disable the "Selanjutnya" button if `currentPage === totalPages` (or if `videos.length <= ITEMS_PER_PAGE`).

## 3. Expected Outcome
The tutorial page will now display a maximum of 3 videos at a time. Users can seamlessly navigate back and forth through the video catalog using the Previous and Next buttons, maintaining a compact and performant user interface.