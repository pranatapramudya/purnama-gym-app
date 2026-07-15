"use client";

import { PlaySquare } from "lucide-react";
import { useState } from "react";
interface GuideItem {
  id: string;
  title: string;
  url: string;
  category: string;
}

function getYouTubeEmbedUrl(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url;
}

export default function GuideClient({ initialGuides }: { initialGuides: GuideItem[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  const totalPages = Math.ceil(initialGuides.length / ITEMS_PER_PAGE);
  const indexOfLastVideo = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstVideo = indexOfLastVideo - ITEMS_PER_PAGE;
  const currentVideos = initialGuides.slice(indexOfFirstVideo, indexOfLastVideo);

  return (
    <div className="p-4 space-y-6">
      <header className="bg-gradient-to-br from-emerald-200 via-teal-300 to-emerald-400 px-6 pt-10 pb-8 rounded-b-[2.5rem] shadow-xl shadow-teal-900/10 border-b border-white/60 mb-6 relative overflow-hidden -mx-4 -mt-4">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Panduan Latihan</h1>
          <p className="text-sm font-medium text-slate-700/90 mt-1.5">Koleksi tutorial alat gym dan gerakan dasar untuk pemula.</p>
        </div>
      </header>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-900">Video Tutorial</h3>
        {currentVideos.map((g) => {
          return (
            <div
              key={g.id} 
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-600">
                  <PlaySquare className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">{g.title}</h4>
                  <span className="font-semibold text-xs text-rose-500 mt-1 inline-block">{g.category}</span>
                </div>
              </div>
              <iframe
                src={getYouTubeEmbedUrl(g.url)}
                className="w-full aspect-video rounded-xl bg-slate-900"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
          );
        })}
        
        {initialGuides.length === 0 && (
          <p className="text-center text-sm text-slate-500 py-8">Belum ada video panduan yang tersedia.</p>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-slate-200"
            >
              Sebelumnya
            </button>
            <span className="text-sm font-semibold text-slate-500">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-slate-200"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
