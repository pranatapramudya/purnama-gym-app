"use client";

import { PlayCircle, Sparkles, X, PlaySquare } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface GuideItem {
  id: string;
  title: string;
  url: string;
  category: string;
}

export default function GuideClient({ initialGuides }: { initialGuides: GuideItem[] }) {
  const [showToast, setShowToast] = useState(false);

  const dismissToast = useCallback(() => setShowToast(false), []);

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(dismissToast, 3000);
    return () => clearTimeout(timer);
  }, [showToast, dismissToast]);

  const handleStartProgram = () => {
    setShowToast(true);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Modern Toast */}
      {showToast && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm animate-[slideDown_0.35s_ease-out]"
        >
          <div className="bg-gradient-to-r from-emerald-500 to-pink-500 rounded-2xl p-[1.5px] shadow-xl shadow-emerald-500/20">
            <div className="bg-white rounded-[14px] px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-pink-400 flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 leading-tight">Program Pemula</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-tight">Mempersiapkan program pemula Anda...</p>
              </div>
              <button
                onClick={dismissToast}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -1rem); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>

      <header className="bg-gradient-to-br from-emerald-200 via-teal-300 to-emerald-400 px-6 pt-10 pb-8 rounded-b-[2.5rem] shadow-xl shadow-teal-900/10 border-b border-white/60 mb-6 relative overflow-hidden -mx-4 -mt-4">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Panduan Latihan</h1>
          <p className="text-sm font-medium text-slate-700/90 mt-1.5">Koleksi tutorial alat gym dan gerakan dasar untuk pemula.</p>
        </div>
      </header>

      <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-5 text-white shadow-sm">
        <h2 className="font-bold text-lg mb-2">Baru pertama kali nge-gym?</h2>
        <p className="text-sm text-rose-50 opacity-90 mb-4">
          Ikuti program &quot;First Week&quot; kami yang dirancang khusus untuk kenyamanan wanita.
        </p>
        <button
          onClick={handleStartProgram}
          className="bg-white text-rose-600 px-4 py-2 rounded-xl text-sm font-semibold w-full hover:bg-rose-50 active:scale-[0.98] transition-all cursor-pointer"
        >
          Mulai Program Pemula
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-900">Video Tutorial</h3>
        {initialGuides.map((g) => {
          return (
              <Link
                href={g.url}
                target="_blank"
                key={g.id} 
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 hover:border-rose-200 transition-colors block"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-600`}>
                  <PlaySquare className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-2 leading-tight">{g.title}</h4>
                  <div className="flex items-center text-xs text-slate-500 mt-1 gap-2">
                    <span className="font-semibold text-rose-500">{g.category}</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-rose-500 group-hover:bg-rose-50 transition-colors pointer-events-none">
                  <PlayCircle className="w-5 h-5" />
                </div>
              </Link>
          );
        })}
        
        {initialGuides.length === 0 && (
          <p className="text-center text-sm text-slate-500 py-8">Belum ada video panduan yang tersedia.</p>
        )}
      </div>
    </div>
  );
}
