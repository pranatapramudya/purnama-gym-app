# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.26 (Card Typography Overhaul & UX Context Fix)
**Module:** Member PT Booking Frontend

## 1. Problem Statement
1. **Missing UX Context:** The trainer's name is displayed raw (e.g., "prana"). Users without context do not know what this text represents. It needs a descriptive prefix.
2. **Flat Typography:** The PT schedule card looks visually flat. The text elements lack hierarchy, making it hard to distinguish between the Date, Time, Trainer, and Price at a glance. Everything blends together.

## 2. Required Action Plan for AI Agent
Execute the following UI/UX polish directly in the Member PT Schedule component using Tailwind CSS:

### A. Add UX Context (Trainer Label)
- Locate the code rendering the trainer's name (`slot.trainerName`).
- Update the UI to clearly label it. Example structure:
  `<p className="text-sm text-white/90 font-medium">Trainer: <span className="capitalize font-bold text-white">{slot.trainerName}</span></p>`

### B. Implement Typographic Hierarchy (Tailwind Polish)
- Overhaul the text classes inside the green/gray card to create a strong visual hierarchy. Use this exact styling guide:
  - **Date:** Make it subtle but legible. `text-xs font-semibold tracking-widest uppercase text-white/80 mb-1`
  - **Time:** Make it the focal point of the top section. `text-2xl font-black text-white mb-2`
  - **Divider (Optional):** Add a subtle line to separate time/trainer from price: `<hr className="border-white/20 w-full my-3" />`
  - **Strikethrough Price:** Ensure it's readable but clearly deactivated. `text-xs font-medium text-white/60 line-through mb-1`
  - **Final Price:** Make it pop. `text-3xl font-extrabold text-white tracking-tight` (Ensure the "IDR" is slightly smaller, e.g., `<span className="text-lg font-bold opacity-80">IDR</span> 90.000`).
  - **Capacity Pill:** Keep it clean at the bottom. `mt-4 bg-black/15 px-4 py-1.5 rounded-full text-xs font-bold text-white w-full text-center backdrop-blur-sm`

### C. Refine the Discount Badge
- The red "Diskon 10%" badge currently floats awkwardly on the left. 
- Reposition it to the top-right corner of the card using absolute positioning: `absolute -top-3 -right-3 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg border-2 border-white`. Ensure the parent card has `relative` class.

## 3. Expected Outcome
The PT cards look incredibly polished and premium. Information is naturally guided by text size and opacity (Date -> Time -> Trainer -> Price). The trainer's name is intuitively labeled, and the discount badge looks like a deliberate promotional sticker on the top right.