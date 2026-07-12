"use client";

import { Clock, MapPin, CheckCircle2, AlertTriangle, Loader2, User, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
// We need to call a new server action to book a PT session
import { bookPTSession } from "@/app/actions/member";
import { getAvailablePTSlots } from "@/app/actions/pt";

interface PTSlotItem {
  id: string;
  dayOfWeek: string;
  targetDate: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  price: number;
  trainerName: string;
  currentBookings: number;
  maxCapacity: number;
  discountPercentage?: number;
}

export default function BookingClient({ initialSlots, ptSetting }: { initialSlots: PTSlotItem[], ptSetting: any }) {
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [slots, setSlots] = useState<PTSlotItem[]>(initialSlots);
  const [selectedSlot, setSelectedSlot] = useState<PTSlotItem | null>(null);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);

  const formatSlotDate = (targetDateStr: string | null | undefined, fallbackDay: string, uppercase = false) => {
    if (targetDateStr) {
      const d = new Date(targetDateStr);
      const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
      const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const formatted = `${uppercase ? "" : days[d.getDay()] + ", "}${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      return uppercase ? formatted.toUpperCase() : formatted;
    }
    return uppercase ? fallbackDay.toUpperCase() : fallbackDay;
  };

  useEffect(() => {
    let isMounted = true;
    const fetchSlots = async () => {
      setIsFetchingSlots(true);
      const res = await getAvailablePTSlots();
      if (isMounted) {
        if (res.success) {
          setSlots(res.slots as PTSlotItem[]);
        } else {
          showToast(res.error || "Gagal memuat jadwal PT", "error");
        }
        setIsFetchingSlots(false);
      }
    };
    fetchSlots();
    return () => { isMounted = false; };
  }, []);

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



      {isFetchingSlots ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-emerald-500" />
          <p className="text-sm font-medium">Memuat jadwal...</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {slots.length === 0 ? (
            <p className="col-span-full text-center text-sm text-slate-500 py-8">Belum ada jadwal yang disediakan oleh Admin pada tanggal ini.</p>
          ) : (
            slots.map((c) => {
              const isBooked = c.isBooked;
              const slotPrice = c.price || 0;
              const slotDiscount = c.discountPercentage || 0;
              const slotHasDiscount = slotDiscount > 0;
              const slotFinalPrice = slotHasDiscount ? slotPrice - (slotPrice * (slotDiscount / 100)) : slotPrice;

              return (
                <button
                  key={`${c.id}-${c.targetDate}`}
                  onClick={() => !isBooked && setSelectedSlot(c)}
                  disabled={isBooked || isLoading === c.id}
                  className={`relative flex flex-row justify-between items-center p-4 rounded-2xl shadow-sm border w-full mb-3 transition-all ${
                    isBooked
                      ? 'bg-gray-50 border-gray-200 opacity-70 cursor-not-allowed'
                      : 'bg-white border-gray-100 hover:border-emerald-200 hover:shadow-md active:scale-[0.98] cursor-pointer'
                  }`}
                >
                  {slotHasDiscount && !isBooked && (
                    <span className="absolute -top-2 -left-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm z-10">
                      Diskon {slotDiscount}%
                    </span>
                  )}
                  {isLoading === c.id ? (
                    <div className="flex w-full justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col items-start text-left">
                        <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-1">
                          {formatSlotDate(c.targetDate, c.dayOfWeek, true)}
                        </span>
                        <span className={`text-lg font-black ${isBooked ? 'text-gray-500' : 'text-gray-800'}`}>
                          {c.startTime} - {c.endTime}
                        </span>
                        {c.trainerName && (
                          <span className="text-xs font-medium text-gray-500 mt-1">
                            Trainer: {c.trainerName}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col items-end text-right">
                        {slotHasDiscount ? (
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-400 line-through">
                              IDR {slotPrice.toLocaleString("id-ID")}
                            </span>
                            <span className={`text-lg font-extrabold ${isBooked ? 'text-gray-400' : 'text-emerald-600'}`}>
                              IDR {slotFinalPrice.toLocaleString("id-ID")}
                            </span>
                          </div>
                        ) : (
                          <span className={`text-lg font-extrabold ${isBooked ? 'text-gray-400' : 'text-emerald-600'}`}>
                            IDR {slotFinalPrice.toLocaleString("id-ID")}
                          </span>
                        )}
                        
                        <div className={`mt-2 px-3 py-1 rounded-full text-[10px] font-bold border ${isBooked ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                          {isBooked ? "KOUTA PENUH" : `Terisi: ${c.currentBookings}/${c.maxCapacity} Orang`}
                        </div>
                      </div>
                    </>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}

      {selectedSlot && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-4 sm:p-0 pb-24 sm:pb-0 transition-opacity">
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
                <span className="font-bold text-slate-900 text-right">
                  {formatSlotDate(selectedSlot.targetDate, selectedSlot.dayOfWeek, false)}<br/>
                  <span className="text-emerald-600">{selectedSlot.startTime} - {selectedSlot.endTime}</span>
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Trainer</span>
                <span className="font-bold text-emerald-600">{selectedSlot.trainerName}</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-200/80">
                <span className="text-slate-500 font-medium">Total Tagihan</span>
                <span className="font-extrabold text-slate-900">
                  {(() => {
                    const price = selectedSlot.price || 0;
                    const discount = selectedSlot.discountPercentage || 0;
                    const finalCheckoutPrice = discount > 0 ? price - (price * (discount / 100)) : price;
                    return `IDR ${finalCheckoutPrice.toLocaleString("id-ID")}`;
                  })()}
                </span>
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
