"use client";

import { ChevronDown, Inbox } from "lucide-react";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  emptyDescription?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  emptyMessage = "Tidak ada data",
  emptyDescription = "Data yang Anda cari belum tersedia.",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Inbox className="w-7 h-7 text-slate-400" />
        </div>
        <p className="text-base font-bold text-slate-700">{emptyMessage}</p>
        <p className="text-sm text-slate-500 mt-1">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead>
            <tr className="bg-slate-50/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider ${col.className || ""}`}
                >
                  <span className="inline-flex items-center gap-1 cursor-default">
                    {col.label}
                    <ChevronDown className="w-3 h-3 opacity-40" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-50/60 transition-colors group"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-5 py-4 text-sm text-slate-700 whitespace-nowrap ${col.className || ""}`}
                  >
                    {col.render ? col.render(item) : String(item[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
