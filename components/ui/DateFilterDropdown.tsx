"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Calendar, ChevronDown } from "lucide-react";

export default function DateFilterDropdown({ currentFilter, onFilterChange }: { currentFilter: string, onFilterChange: (filter: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (filter: string) => {
    setIsOpen(false);
    startTransition(() => {
      onFilterChange(filter);
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <Calendar className="w-4 h-4 text-emerald-500" />
        <span>
          {currentFilter === "today" && "Hari Ini"}
          {currentFilter === "week" && "Minggu Ini"}
          {currentFilter === "month" && "Bulan Ini"}
          {currentFilter === "last_month" && "Bulan Lalu"}
          {currentFilter === "year" && "Tahun Ini"}
          {currentFilter === "all" && "Semua Waktu"}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-1.5">
            {(["today", "week", "month", "all"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => handleSelect(filter)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentFilter === filter 
                    ? 'bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100/50' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {filter === "today" && "Hari Ini"}
                {filter === "week" && "Minggu Ini"}
                {filter === "month" && "Bulan Ini"}
                {filter === "all" && "Semua Waktu"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
