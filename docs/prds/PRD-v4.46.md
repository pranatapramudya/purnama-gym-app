# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.46 (Cashbook Mobile UX: Table-to-Card Transformation)
**Module:** `BukuKasClient.tsx` (Riwayat Transaksi Table)

## 1. Problem Statement
The "Riwayat Transaksi" (Transaction History) data table within the Buku Kas (Cashbook) module currently forces a horizontal scroll on mobile devices. This provides a poor user experience, hiding critical columns like "TIPE", "KETERANGAN", "KASIR", and "NOMINAL" off-screen. It needs the same responsive mobile-card transformation successfully implemented in the Master Schedule module.

## 2. Required Action Plan for AI Agent
Execute the following Tailwind CSS optimizations. **Do NOT output raw code blocks; apply the structural and class changes directly into the codebase.**

### A. Transform Cashbook Table to "Mobile Cards"
- Open the component rendering the "Buku Kas" interface (e.g., `BukuKasClient.tsx` or its specific table sub-component).
- Locate the `<table>` element displaying the transaction history ("Riwayat Transaksi").
- **Desktop vs. Mobile Structure:** Ensure the table displays as a standard table on screens `md:` and larger, but stacks as individual cards on smaller screens.
- **Hide Headers on Mobile:** Add `hidden md:table-header-group` to the `<thead>` element.
- **Row Transformation:** Add `block md:table-row` to the `<tbody>` and all internal `<tr>` elements. Add styling to the `<tr>` elements to make them look like distinct cards on mobile (e.g., `mb-4 border rounded-lg p-3 md:mb-0 md:border-none md:rounded-none md:p-0`).
- **Cell Transformation:** Add `flex justify-between items-center block border-b last:border-b-0 py-2 md:py-4 md:border-b md:table-cell` to the `<td>` elements.
- **Mobile Data Labels:** Within each `<td>`, ensure there is a conditionally rendered label that only appears on mobile screens to identify the data. 
  - Example: `<td><span className="md:hidden font-bold text-gray-500">Keterangan: </span> <span className="text-right">{transaction.description}</span></td>`.
- **Remove Container Overflow:** Remove `overflow-x-auto` or `whitespace-nowrap` from the parent `<div>` wrapping the table if it is forcing the mobile view to break width constraints.

## 3. Expected Outcome
The "Buku Kas" transaction history table will provide a seamless responsive experience. On mobile devices, transactions will stack as clean, easily readable vertical cards showing the Type, Description, Cashier, and Amount without requiring any horizontal scrolling. On desktop devices, it will continue to render as a traditional data table.