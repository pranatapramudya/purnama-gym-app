"use client";

import { Calendar, Clock, MapPin, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cancelBooking } from "@/app/actions/member";

interface MyClassItem {
  id: string; // Booking ID
  classId: string;
  title: string;
  instructor: string;
  schedule: string;
  location: string;
  tag: string;
}

export default function ScheduleClient({ initialClasses }: { initialClasses: MyClassItem[] }) {
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use state to optimistically remove cancelled classes
  const [myClasses, setMyClasses] = useState(initialClasses);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingId) return;
    
    setIsLoading(true);
    // Determine the classId for the booking we are cancelling
    const classId = myClasses.find(c => c.id === selectedBookingId)?.classId;
    if (!classId) {
       setIsLoading(false);
       setIsModalOpen(false);
       return;
    }
    
    const res = await cancelBooking(classId);
    setIsLoading(false);
    setIsModalOpen(false);

    if (res.success) {
      setMyClasses(prev => prev.filter(c => c.id !== selectedBookingId));
      showToast("Booking berhasil dibatalkan.", "error"); // Red toast for cancel
    } else {
      showToast(res.error || "Gagal membatalkan booking.", "error");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <header className="bg-gradient-to-br from-emerald-200 via-teal-300 to-emerald-400 px-6 pt-10 pb-8 rounded-b-[2.5rem] shadow-xl shadow-teal-900/10 border-b border-white/60 mb-6 relative overflow-hidden -mx-4 -mt-4">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Jadwal Pribadi</h1>
          <p className="text-sm font-medium text-slate-700/90 mt-1.5">Daftar sesi PT yang sudah kamu booking</p>
        </div>
      </header>

      {myClasses.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm mb-4">Kamu belum booking sesi PT apapun.</p>
          <Link href="/member/booking" className="inline-block bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-sm font-semibold">
            Cari Jadwal PT
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myClasses.map((c) => {
            const d = new Date(c.schedule);
            const dateStr = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
            const timeStr = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
            
            return (
              <div key={c.id} className="bg-white rounded-2xl p-4 shadow-sm border border-rose-100 flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-rose-500" />
                <div className="flex justify-between items-start pr-4">
                  <div>
                    <div className="inline-block px-2 py-1 bg-rose-50 text-rose-600 text-xs font-semibold rounded-md mb-2">
                      {c.tag}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
                    <p className="text-sm text-slate-500">{c.instructor}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center mr-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Calendar className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="text-xs font-medium text-slate-700">{dateStr}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Clock className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="text-xs font-medium text-slate-700">{timeStr} WIB</div>
                  </div>
                </div>

                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                  {c.location}
                </div>
                
                <button 
                  onClick={() => {
                    setSelectedBookingId(c.id);
                    setIsModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 active:scale-[0.98]"
                >
                  Batal Booking
                </button>
              </div>
            );
          })}
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
                onClick={() => !isLoading && setIsModalOpen(false)}
                disabled={isLoading}
                className="flex-1 py-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Kembali
              </button>
              <div className="w-[1px] bg-slate-100"></div>
              <button 
                onClick={handleConfirmCancel}
                disabled={isLoading}
                className="flex-1 py-4 text-sm font-bold text-rose-600 flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Batalkan"}
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
