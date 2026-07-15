# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 5.12 (Mobile Navbar Micro-copy Stack)
**Modules Affected:** Landing Page Navbar (Mobile View).

## 1. Problem Statement
The client specifically requested the return of the "Belum punya akun?" conversational text on the mobile Navbar. However, to maintain a slim header height, this text must be implemented as a "micro-copy" stacked directly above the "Daftar" button, rather than occupying its own distinct layout row or breaking the horizontal flow.

## 2. Required Action Plan for AI Agent
Do not generate raw blocks of code. Apply the structural and utility class changes directly to the Navbar component.

### A. Create a Stacked Group for "Daftar"
- Locate the "Daftar" button in the mobile Navbar view.
- Wrap this button in a new `div` container.
- Apply Flexbox column classes to this wrapper: `flex flex-col items-center justify-center`.

### B. Inject and Style the Micro-copy
- Inside this new wrapper, immediately *above* the "Daftar" button, insert a `<span>` containing the text: `Belum punya akun?`
- **Crucial Typography Classes:** Apply micro-typography classes to ensure it doesn't expand the header height: `text-[10px] text-slate-500 leading-none mb-1`. 
- Ensure the font weight is normal or light so it doesn't compete with the button text.

### C. Align with "Masuk"
- Ensure the parent container holding both "Masuk" and this new "Daftar" stack has `flex flex-row items-center gap-3` (or similar).
- The "Masuk" text link should be vertically centered relative to the entire "Daftar" stack block.

## 3. Expected Outcome
The mobile Navbar remains on a single, slim row. The right side will feature the "Masuk" link, and next to it, a compact block containing the tiny text "Belum punya akun?" sitting perfectly on top of the green "Daftar" button.