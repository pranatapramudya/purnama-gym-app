# Product Requirements Document (PRD) - Purnama Gym
**Version:** 4.24 (Input Scroll Removal & IDR Real-time Formatting)
**Module:** Admin PT Slot Management UI

## 1. Problem Statement
1. **Input Scroll/Spinner Issue:** The "Harga (Rp)" and "Diskon (%)" inputs are currently using `<input type="number">`. This causes web browsers to display ugly up/down spin buttons, allowing the user to accidentally scroll the values. The user explicitly wants to type the numbers without any scroll behavior.
2. **Missing Real-time Currency Formatting:** The user wants the "Harga" input to automatically format with thousand separators (dots) as they type (e.g., typing `100000` should visually format to `100.000` in the input box), but the backend must still receive the raw integer.

## 2. Root Cause Analysis
- `<input type="number">` natively includes spinners in WebKit browsers.
- Managing formatted strings in inputs requires decoupling the display value (string with dots) from the actual state value (integer).

## 3. Required Action Plan for AI Agent
Execute the following updates directly in the Admin UI (`ClassesClient.tsx` or similar):

### A. Fix Input Spinners & Implement Formatter
- Locate the "Harga" and "Diskon" input fields.
- **Change the input type:** Change `type="number"` to `type="text" inputMode="numeric"`. This triggers the numeric keypad on mobile but acts as a raw text field, eliminating browser spinners entirely.
- **Implement Real-time Formatting (Harga):**
  - Create a local state for the display value of the price, OR handle it inline in the `onChange` handler.
  - When the user types, strip all non-numeric characters: `const rawValue = e.target.value.replace(/\D/g, '')`.
  - Update the Prisma submission state with `Number(rawValue)`.
  - Update the input's visual `value` using a formatter: `Number(rawValue).toLocaleString('id-ID')`. This will inject the dots (e.g., `100.000`).
- **Implement Diskon Fix:**
  - Change to `type="text" inputMode="numeric"`.
  - Strip non-numeric chars, ensure the parsed number doesn't exceed 100, and update state.

### B. IDR Prefix
- For the "Harga" input, if your UI component supports a prefix (like a left icon or addon), ensure it displays `IDR` nicely next to the input, or format the input value to include it dynamically if preferred.

## 4. Expected Outcome
The Admin can type seamlessly into the Harga and Diskon fields. No scroll arrows appear. When typing `100000` into the Harga field, it instantly formats to `100.000`. Submitting the form cleanly parses this back to `100000` for Prisma to save.