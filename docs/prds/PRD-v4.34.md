# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.34 (JSX Syntax Hotfix - AdminSidebar)
**Module:** `components/admin/AdminSidebar.tsx`

## 1. Problem Statement
The recent sidebar refactoring introduced a fatal Next.js build error: `Expected ',', got 'ident'`. The build is failing at line 71 in `AdminSidebar.tsx`. 

## 2. Root Cause Analysis
This is a strict JSX syntax parsing error. A JSX comment (`{/* Brand & User Profile */}`) was placed directly inside the parentheses of `const sidebarContent = (` without being enclosed within a valid React Fragment (`<>...</>`) or a parent HTML element. The compiler attempts to parse the `{` as a JavaScript block/object, causing it to crash when it immediately encounters the `<div` tag on the next line.

## 3. Required Action Plan for AI Agent
Execute the following hotfix strictly without outputting any raw code blocks in your response:

### A. Fix JSX Syntax Structure
- Open `components/admin/AdminSidebar.tsx`.
- Locate the declaration `const sidebarContent = (`.
- **Remove** the improperly placed JSX comment (`{/* Brand & User Profile */}`) that sits directly outside the root HTML node.
- If you need to keep the comment, you **must** move it inside the root `<div ...>` or wrap the entire assigned value in a React Fragment (`<> ... </>`).
- Ensure that whatever is assigned to `sidebarContent` is a single, perfectly valid JSX node.

## 4. Expected Outcome
The JSX parsing error is completely resolved. Running the application will no longer throw the `Expected ',', got 'ident'` error, and the UI will render the newly refactored sidebar smoothly.