"use client";

import { Clock, MapPin, Users, ChevronDown, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { bookClass, cancelBooking } from "@/app/actions/member";

interface GymClassItem {
  id: string;
  name: string;
  description: string;
  category: string;
  schedule: string;
  capacity: number;
  booked: number;
  isBooked: boolean;
}

export default function BookingClient({ initialClasses, categories }: { initialClasses: GymClassItem[], categories: string[] }) {
  const [category, setCategory] = useState("Semua");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCancelId, setSelectedCancelId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const uniqueCategories = categories;

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBook = async (id: string) => {
    setIsLoading(id);
    const res = await bookClass(id);
    setIsLoading(null);
    if (res.success) {
      showToast("Sukses! Anda berhasil mem-booking PT ini.", "success");
    } else {
      showToast(res.error || "Gagal mem-booking PT.", "error");
    }
  };

  const handleCancelClick = (id: string) => {
    setSelectedCancelId(id);
    setIsModalOpen(true);
  };

  const confirmCancel = async () => {
    if (selectedCancelId !== null) {
      setIsLoading(selectedCancelId);
      setIsModalOpen(false);
      const res = await cancelBooking(selectedCancelId);
      setIsLoading(null);
      if (res.success) {
        showToast("Booking berhasil dibatalkan.", "error");
      } else {
        showToast(res.error || "Gagal membatalkan booking.", "error");
      }
    }
  };

  const filteredPT = initialClasses.filter((pt) => {
    if (category === "Semua") return true;
    
    const kategoriDB = String(pt.category || "").trim().toLowerCase();
    const kategoriPilihan = String(category).trim().toLowerCase();

    return kategoriDB === kategoriPilihan;
  });

  return (
    <>
      <div className="p-4 space-y-6">
        <header className="bg-gradient-to-br from-emerald-200 via-teal-300 to-emerald-400 px-6 pt-10 pb-8 rounded-b-[2.5rem] shadow-xl shadow-teal-900/10 border-b border-white/60 mb-6 relative overflow-hidden -mx-4 -mt-4">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Jadwal PT</h1>
            <p className="text-sm font-medium text-slate-700/90 mt-1.5">Pilih dan booking jadwal PT favoritmu</p>
          </div>
        </header>

        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between bg-white border border-slate-200 text-slate-700 py-3.5 px-4 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-rose-500/20 font-semibold text-sm transition-colors hover:bg-slate-50"
          >
            {category}
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 z-10 w-full bg-white shadow-lg rounded-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
              {uniqueCategories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCategory(cat);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-rose-50 ${
                    category === cat ? "bg-rose-50 text-rose-600" : "text-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {filteredPT.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-8">Belum ada jadwal PT yang tersedia untuk kategori ini.</p>
          ) : (
            filteredPT.map((c) => {
              const isFull = c.booked >= c.capacity;
              const d = new Date(c.schedule);
              return (
                <div key={c.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="inline-block px-2 py-1 bg-rose-50 text-rose-600 text-xs font-semibold rounded-md mb-2">
                        {c.category}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{c.name}</h3>
                      <p className="text-sm text-slate-500">{c.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-slate-500 block mb-1">
                        {d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                      </span>
                      <div className="flex items-center text-rose-500 font-semibold text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-600 border-t border-slate-50 pt-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                        Gym
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-slate-400" />
                        <span className={isFull ? "text-rose-500 font-medium" : ""}>
                          {c.booked}/{c.capacity}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {c.isBooked ? (
                    <div className="grid grid-cols-2 gap-3">
                      <button disabled className="w-full py-3 rounded-xl font-semibold text-sm bg-green-50 text-green-600 border border-transparent cursor-default flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Terdaftar
                      </button>
                      <button 
                        onClick={() => handleCancelClick(c.id)}
                        disabled={isLoading === c.id}
                        className="w-full py-3 rounded-xl flex items-center justify-center font-semibold text-sm transition-all bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 active:scale-[0.98] disabled:opacity-50"
                      >
                        {isLoading === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Batal"}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBook(c.id)}
                      disabled={isFull || isLoading === c.id}
                      className={`w-full py-3 flex items-center justify-center rounded-xl font-semibold text-sm transition-all ${
                        isFull
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent"
                          : "bg-rose-50 text-rose-600 border border-transparent hover:bg-rose-100 hover:shadow-sm active:scale-[0.98] active:bg-rose-200 disabled:opacity-50"
                      }`}
                    >
                      {isLoading === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (isFull ? "Kuota Penuh" : "Daftar")}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {toast && (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 w-[90%] max-w-sm rounded-xl shadow-lg border text-sm font-semibold flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-4 ${toast.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {toast.message}
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Batalkan Booking?</h3>
              <p className="text-sm text-slate-500">
                Apakah Anda yakin ingin membatalkan kehadiran di sesi PT ini? Kuota Anda akan dikembalikan untuk orang lain.
              </p>
            </div>
            <div className="flex border-t border-slate-100">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Kembali
              </button>
              <div className="w-[1px] bg-slate-100"></div>
              <button 
                onClick={confirmCancel}
                className="flex-1 py-4 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
