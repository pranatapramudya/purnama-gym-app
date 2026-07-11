"use client";

import { Clock, MapPin, CheckCircle2, AlertTriangle, Loader2, User } from "lucide-react";
import { useState } from "react";
// We need to call a new server action to book a PT session
import { bookPTSession } from "@/app/actions/member";

interface PTSlotItem {
  id: string;
  dayOfWeek: string;
  targetDate: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  price: number;
  trainerName: string;
}

export default function BookingClient({ initialSlots, ptSetting }: { initialSlots: PTSlotItem[], ptSetting: any }) {
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  // Optional optimistic UI
  const [slots, setSlots] = useState<PTSlotItem[]>(initialSlots);

  const [selectedSlot, setSelectedSlot] = useState<PTSlotItem | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBook = async (slotId: string, startTime: string, targetDate: string, method: string) => {
    setIsLoading(slotId);
    setSelectedSlot(null);
    
    // Convert targetDate + startTime into a Date object for the backend
    const [hours, minutes] = startTime.split(":");
    const d = new Date(targetDate);
    d.setHours(Number(hours), Number(minutes), 0, 0);

    const res = await bookPTSession(slotId, d.toISOString(), method);
    setIsLoading(null);
    if (res.success) {
      showToast("Sukses! Anda berhasil mem-booking sesi PT ini.", "success");
      setSlots(prev => prev.map(s => s.id === slotId ? { ...s, isBooked: true } : s));
    } else {
      showToast(res.error || "Gagal mem-booking sesi PT.", "error");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <header className="bg-gradient-to-br from-emerald-200 via-teal-300 to-emerald-400 px-6 pt-10 pb-8 rounded-b-[2.5rem] shadow-xl shadow-teal-900/10 border-b border-white/60 mb-6 relative overflow-hidden -mx-4 -mt-4">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Jadwal PT</h1>
          <p className="text-sm font-medium text-slate-700/90 mt-1.5">Pilih dan booking jadwal PT favoritmu</p>
        </div>
      </header>

      {ptSetting?.pricePerSession && (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <AlertTriangle className="w-5 h-5 rotate-180" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tarif Personal Trainer</p>
              <p className="text-sm font-semibold text-slate-700">Harga per sesi (1 jam) untuk semua jadwal.</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-slate-900">Rp {ptSetting.pricePerSession.toLocaleString("id-ID")}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {slots.length === 0 ? (
          <p className="col-span-full text-center text-sm text-slate-500 py-8">Belum ada jadwal yang disediakan oleh Admin saat ini.</p>
        ) : (
          slots.map((c) => {
            const isBooked = c.isBooked;
            return (
              <button
                key={`${c.id}-${c.targetDate}`}
                onClick={() => !isBooked && setSelectedSlot(c)}
                disabled={isBooked || isLoading === c.id}
                className={`relative flex flex-col items-center justify-center p-4 min-h-[100px] rounded-2xl transition-all ${
                  isBooked
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-md active:scale-[0.97] cursor-pointer'
                }`}
              >
                {isLoading === c.id ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span className="text-xs font-semibold mb-1 opacity-90 uppercase tracking-wider">
                      {c.dayOfWeek}
                    </span>
                    <span className="text-base font-extrabold tracking-tight">
                      {c.startTime} - {c.endTime}
                    </span>
                    
                    {c.trainerName && (
                      <span className={`text-[11px] font-medium mt-1 truncate w-full text-center px-2 ${isBooked ? 'text-gray-400' : 'text-emerald-100'}`}>
                        {c.trainerName}
                      </span>
                    )}

                    {isBooked && (
                      <span className="mt-2 text-[10px] font-bold uppercase tracking-wider bg-white/50 px-2 py-0.5 rounded-md">
                        Penuh
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })
        )}
      </div>

      {selectedSlot && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 sm:p-0 transition-opacity">
          <div className="bg-white w-full sm:max-w-sm rounded-[2rem] p-6 shadow-2xl relative animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-4 zoom-in-95">
            <button 
              onClick={() => setSelectedSlot(null)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              ✕
            </button>
            <h2 className="text-xl font-extrabold text-slate-900 mb-1">Checkout Booking</h2>
            <p className="text-sm font-medium text-slate-500 mb-6">Silakan pilih metode pembayaran.</p>
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Jadwal</span>
                <span className="font-bold text-slate-900">{selectedSlot.dayOfWeek}, {selectedSlot.startTime} - {selectedSlot.endTime}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Trainer</span>
                <span className="font-bold text-emerald-600">{selectedSlot.trainerName}</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-200/80">
                <span className="text-slate-500 font-medium">Total Tagihan</span>
                <span className="font-extrabold text-slate-900">Rp {(ptSetting?.pricePerSession || 100000).toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => handleBook(selectedSlot.id, selectedSlot.startTime, selectedSlot.targetDate, "TUNAI")}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm shadow-emerald-200 transition-all active:scale-[0.98]"
              >
                Bayar Tunai di Gym
              </button>
              <button 
                onClick={() => handleBook(selectedSlot.id, selectedSlot.startTime, selectedSlot.targetDate, "TRANSFER")}
                className="w-full py-3.5 bg-slate-900 hover:bg-black active:bg-black text-white font-bold text-sm rounded-xl shadow-sm transition-all active:scale-[0.98]"
              >
                Bayar Online (Cashless)
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 w-[90%] max-w-sm rounded-xl shadow-lg border text-sm font-semibold flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-4 ${toast.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {toast.message}
        </div>
      )}
    </div>
  );
}
