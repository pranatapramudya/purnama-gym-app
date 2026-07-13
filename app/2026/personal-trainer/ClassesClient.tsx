"use client";

import { useState, useEffect } from "react";
import { AdminToast, ToastType } from "@/components/admin/AdminToast";
import { useResponsivePagination } from "@/hooks/useResponsivePagination";
import { Pagination } from "@/components/ui/Pagination";
import { CheckCircle2, Play, CheckSquare, Loader2, CalendarClock, Clock, Trash2 } from "lucide-react";
import { confirmPTSession, startPTSession, finishPTSession } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import DateFilterDropdown from "@/components/ui/DateFilterDropdown";

const timeOptions: string[] = [];
for (let h = 6; h <= 22; h++) {
  const hour = h.toString().padStart(2, '0');
  timeOptions.push(`${hour}:00`);
  timeOptions.push(`${hour}:30`);
}

interface PTSessionItem {
  id: string;
  memberName: string;
  trainerName: string;
  schedule: string;
  status: string; // PENDING, CONFIRMED, ONGOING, COMPLETED
}

interface PTScheduleSlotItem {
  id: string;
  dayOfWeek: string;
  targetDate?: Date | string | null;
  startTime: string;
  endTime: string;
  trainerId: string | null;
  trainerName: string | null;
  trainer: { name: string | null } | null;
  maxCapacity: number;
  price: number;
  discountPercentage: number;
}

export default function ClassesClient({ 
  initialSessions,
  userRole,
  initialSlots,
  trainers,
  todaySessions = [],
  activePeriod
}: { 
  initialSessions: PTSessionItem[];
  userRole: string;
  initialSlots: PTScheduleSlotItem[];
  trainers: { id: string; name: string | null; email: string }[];
  todaySessions?: any[];
  activePeriod?: string;
}) { 
  const router = useRouter();
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as ToastType });
  const [sessions, setSessions] = useState<PTSessionItem[]>(initialSessions);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Tabs: "JADWAL" | "PENGATURAN"
  const [activeTab, setActiveTab] = useState<"JADWAL" | "PENGATURAN">("JADWAL");

  // Slots CRUD state
  const [slots, setSlots] = useState<PTScheduleSlotItem[]>(initialSlots);
  const todayStr = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
  const [slotDate, setSlotDate] = useState(todayStr);
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");
  const [slotTrainerInput, setSlotTrainerInput] = useState("");
  const [slotMaxCapacity, setSlotMaxCapacity] = useState(1);
  const [slotPrice, setSlotPrice] = useState<number | string>(100000);
  const [slotDiscount, setSlotDiscount] = useState<number | string>(0);
  const [isAddingSlot, setIsAddingSlot] = useState(false);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ visible: true, message, type });
  };

  const handleConfirm = async (id: string) => {
    setProcessingId(id);
    const res = await confirmPTSession(id);
    setProcessingId(null);
    if (res.success) {
      showToast("Sesi berhasil dikonfirmasi.", "success");
      setSessions(prev => prev.map(s => s.id === id ? { ...s, status: "CONFIRMED" } : s));
    } else {
      showToast(res.error || "Gagal mengkonfirmasi", "error");
    }
  };

  const handleStart = async (id: string) => {
    setProcessingId(id);
    const res = await startPTSession(id);
    setProcessingId(null);
    if (res.success) {
      showToast("Sesi berhasil dimulai.", "success");
      setSessions(prev => prev.map(s => s.id === id ? { ...s, status: "ONGOING" } : s));
    } else {
      showToast(res.error || "Gagal memulai sesi", "error");
    }
  };

  const handleFinish = async (id: string) => {
    setProcessingId(id);
    const res = await finishPTSession(id);
    setProcessingId(null);
    if (res.success) {
      showToast("Sesi berhasil diakhiri.", "success");
      setSessions(prev => prev.map(s => s.id === id ? { ...s, status: "COMPLETED" } : s));
    } else {
      showToast(res.error || "Gagal mengakhiri sesi", "error");
    }
  };

  useEffect(() => {
    setSessions(initialSessions);
    setCompletedPage(1);
  }, [initialSessions]);

  const handlePeriodChange = (newPeriod: string) => {
    router.push(`?period=${newPeriod}`);
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotStart || !slotEnd) {
      showToast("Jam mulai dan selesai wajib diisi", "error");
      return;
    }
    setIsAddingSlot(true);
    const { createPTScheduleSlot } = await import("@/app/actions/admin");
    
    const dateObj = new Date(slotDate);
    const dayMap: Record<number, string> = { 0: "Minggu", 1: "Senin", 2: "Selasa", 3: "Rabu", 4: "Kamis", 5: "Jumat", 6: "Sabtu" };
    const calculatedDay = dayMap[dateObj.getDay()];

    const res = await createPTScheduleSlot({ 
      dayOfWeek: calculatedDay, 
      targetDate: slotDate, 
      startTime: slotStart, 
      endTime: slotEnd, 
      trainerInput: slotTrainerInput || undefined, 
      maxCapacity: slotMaxCapacity,
      price: Number(slotPrice) || 0,
      discountPercentage: Number(slotDiscount) || 0
    });
    setIsAddingSlot(false);
    if (res.success) {
      showToast("Slot berhasil ditambahkan.", "success");
      // Find if it matches a trainer to display their name
      const trainerObj = trainers.find(t => t.name === slotTrainerInput || t.id === slotTrainerInput);
      setSlots([...slots, { 
        id: Date.now().toString(), 
        dayOfWeek: calculatedDay, 
        targetDate: slotDate,
        startTime: slotStart, 
        endTime: slotEnd,
        trainerId: trainerObj ? trainerObj.id : null,
        trainerName: !trainerObj ? slotTrainerInput : null,
        trainer: trainerObj ? { name: trainerObj.name } : null,
        maxCapacity: slotMaxCapacity,
        price: Number(slotPrice) || 0,
        discountPercentage: Number(slotDiscount) || 0
      } as PTScheduleSlotItem]);
      setSlotStart("");
      setSlotEnd("");
      setSlotMaxCapacity(1);
      setSlotPrice(100000);
      setSlotDiscount(0);
    } else {
      showToast(res.error || "Gagal menambah slot", "error");
    }
  };

  const handleDeleteSlot = async (id: string) => {
    const { deletePTScheduleSlot } = await import("@/app/actions/admin");
    const res = await deletePTScheduleSlot(id);
    if (res.success) {
      showToast("Slot berhasil dihapus.", "success");
      setSlots(slots.filter(s => s.id !== id));
    } else {
      showToast(res.error || "Gagal menghapus slot", "error");
    }
  };

  const pendingSessions = sessions.filter(s => s.status === "PENDING");
  const completedSessions = sessions.filter(s => s.status === "COMPLETED");

  const { currentPage: completedPage, totalPages: completedTotalPages, setCurrentPage: setCompletedPage, paginatedData: paginatedCompleted } = useResponsivePagination(completedSessions);

  const sortedSlots = [...slots].sort((a, b) => {
    const dateA = a.targetDate ? new Date(a.targetDate).getTime() : 0;
    const dateB = b.targetDate ? new Date(b.targetDate).getTime() : 0;
    if (dateA !== dateB) return dateA - dateB;
    return a.startTime.localeCompare(b.startTime);
  });

  const { currentPage: slotPage, totalPages: slotTotalPages, setCurrentPage: setSlotPage, paginatedData: paginatedSlots } = useResponsivePagination(sortedSlots);

  const renderTodaySchedule = (item: any) => {
    let badgeText = "Slot Tersedia";
    let badgeClass = "bg-slate-100 text-slate-600";
    let actionBtn = null;

    const now = new Date();
    const utcOffset = 7 * 60 * 60 * 1000;
    const localNow = new Date(now.getTime() + utcOffset);
    const hours = localNow.getUTCHours().toString().padStart(2, '0');
    const mins = localNow.getUTCMinutes().toString().padStart(2, '0');
    const currentTimeStr = `${hours}:${mins}`;

    let isPastEndTime = false;
    if (item.slotInfo && currentTimeStr > item.slotInfo.endTime) {
      isPastEndTime = true;
    }

    if (item.isBooked) {
      if (isPastEndTime) {
        badgeText = "Selesai";
        badgeClass = "bg-emerald-100 text-emerald-700";
        actionBtn = null;
      } else if (item.status === "PENDING") {
        badgeText = "Menunggu";
        badgeClass = "bg-amber-100 text-amber-700";
        actionBtn = "CONFIRM";
      } else if (item.status === "CONFIRMED") {
        badgeText = "Terkonfirmasi";
        badgeClass = "bg-blue-100 text-blue-700";
        actionBtn = "START";
      } else if (item.status === "ONGOING") {
        badgeText = "Sedang Berjalan";
        badgeClass = "bg-rose-100 text-rose-700";
        actionBtn = "FINISH";
      } else if (item.status === "COMPLETED") {
        badgeText = "Selesai";
        badgeClass = "bg-emerald-100 text-emerald-700";
      }
    } else if (item.slotInfo) {
      if (isPastEndTime) {
        badgeText = "Sesi Berakhir";
        badgeClass = "bg-slate-100 text-slate-400";
      } else if (currentTimeStr >= item.slotInfo.startTime && currentTimeStr <= item.slotInfo.endTime) {
        badgeText = "Sesi Aktif (Kosong)";
        badgeClass = "bg-slate-100 text-slate-500";
      }
    }

    const isProcessing = item.isBooked ? processingId === item.id : false;

    return (
      <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-3 md:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md">
        <div className="flex items-start gap-4">
          <div>
            <p className="text-sm md:text-base font-bold text-slate-900">
              {item.isBooked ? item.memberName : "Slot Tersedia"}
            </p>
            <p className="text-xs md:text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <CalendarClock className="w-3.5 h-3.5" />
              {item.timeStr}
            </p>
            <p className="text-xs md:text-sm text-rose-500 font-medium mt-1">Trainer: {item.trainerName}</p>
            {item.quota && (
              <p className="text-xs md:text-sm font-semibold text-emerald-600 mt-1">
                Terdaftar: {item.quota.current} / {item.quota.max}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center md:justify-end gap-2 mt-2 md:mt-0 flex-wrap">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${badgeClass}`}>
            {badgeText}
          </span>
          
          {actionBtn === "CONFIRM" && (
            <button
              onClick={() => handleConfirm(item.id)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Konfirmasi
            </button>
          )}
          {actionBtn === "START" && (
            <button
              onClick={() => handleStart(item.id)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Mulai
            </button>
          )}
          {actionBtn === "FINISH" && (
            <button
              onClick={() => handleFinish(item.id)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-1.5 bg-rose-500 text-white hover:bg-rose-600 font-bold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
              Akhiri
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderCard = (session: PTSessionItem, action: "CONFIRM" | "START" | "FINISH" | "NONE") => {
    const d = new Date(session.schedule);
    const timeStr = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const dateStr = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    const isProcessing = processingId === session.id;

    return (
      <div key={session.id} className="bg-white border border-slate-200 rounded-2xl p-3 md:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md">
        <div className="flex items-start gap-4">
          <div>
            <p className="text-sm md:text-base font-bold text-slate-900">{session.memberName}</p>
            <p className="text-xs md:text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <CalendarClock className="w-3.5 h-3.5" />
              {dateStr} • {timeStr} WIB
            </p>
            <p className="text-xs md:text-sm text-rose-500 font-medium mt-1">Trainer: {session.trainerName}</p>
          </div>
        </div>

        <div className="flex items-center md:justify-end gap-2 mt-2 md:mt-0">
          {action === "CONFIRM" && (
            <button
              onClick={() => handleConfirm(session.id)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Konfirmasi
            </button>
          )}
          {action === "START" && (
            <button
              onClick={() => handleStart(session.id)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Mulai Sesi PT
            </button>
          )}
          {action === "FINISH" && (
            <button
              onClick={() => handleFinish(session.id)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white hover:bg-rose-600 font-bold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
              Akhiri Sesi
            </button>
          )}
          {action === "NONE" && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Selesai
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <AdminToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onDismiss={() => setToast((s) => ({ ...s, visible: false }))}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">Manajemen Sesi PT</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola siklus hidup pemesanan Personal Trainer.</p>
        </div>
      </div>

      {/* Tabs */}
      {userRole === "SUPER_ADMIN" && (
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab("JADWAL")}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "JADWAL" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Monitoring Sesi
          </button>
          <button
            onClick={() => setActiveTab("PENGATURAN")}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "PENGATURAN" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Master Jadwal & Harga
          </button>
        </div>
      )}

      {activeTab === "PENGATURAN" && userRole === "SUPER_ADMIN" ? (
        <div className="max-w-4xl bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          {/* Master Schedule Slots CRUD */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-6">Kelola Slot Jadwal PT</h2>
            
            <form onSubmit={handleAddSlot} className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4 mb-6 bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-200 items-end">
              <div className="w-full md:col-span-5 mb-1 md:mb-2">
                <label className="block text-xs font-bold text-slate-700 mb-2 md:mb-3">Pilih Tanggal</label>
                <input 
                  type="date"
                  value={slotDate}
                  min={todayStr}
                  onChange={e => setSlotDate(e.target.value)}
                  className="w-full px-4 py-2 md:py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                />
              </div>
              
              <div className="w-full">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Mulai</label>
                <input 
                  type="time" 
                  value={slotStart} 
                  onChange={e => setSlotStart(e.target.value)}
                  className="w-full px-3.5 py-2 md:py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
                />
              </div>
              <div className="w-full">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Selesai</label>
                <input 
                  type="time" 
                  value={slotEnd} 
                  onChange={e => setSlotEnd(e.target.value)}
                  className="w-full px-3.5 py-2 md:py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
                />
              </div>
              
              <div className="w-full">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Maksimal Member (Kuota)</label>
                <input 
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={slotMaxCapacity} 
                  onChange={e => setSlotMaxCapacity(Number(e.target.value.replace(/\D/g, '')))}
                  className="w-full px-4 py-2 md:py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="w-full">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Ketik Nama PT (Opsional)</label>
                <input 
                  type="text"
                  placeholder="Ketik nama trainer..."
                  value={slotTrainerInput} 
                  onChange={e => setSlotTrainerInput(e.target.value)}
                  className="w-full px-4 py-2 md:py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="w-full">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Harga</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 font-semibold text-sm">IDR</span>
                  <input 
                    type="text"
                    inputMode="numeric"
                    value={slotPrice ? Number(slotPrice).toLocaleString('id-ID') : ""} 
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      setSlotPrice(Number(val));
                    }}
                    className="w-full pl-11 pr-3.5 py-2 md:py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Diskon (%)</label>
                <input 
                  type="text"
                  inputMode="numeric"
                  value={slotDiscount} 
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    let num: number | string = val ? Number(val) : "";
                    if (typeof num === 'number' && num > 100) num = 100;
                    setSlotDiscount(num);
                  }}
                  className="w-full px-4 py-2 md:py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <button 
                type="submit" 
                disabled={isAddingSlot}
                className="w-full h-[44px] flex items-center justify-center px-4 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-600 shadow-sm transition-colors disabled:opacity-50 active:scale-[0.98]"
              >
                {isAddingSlot ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tambah Slot"}
              </button>
            </form>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="w-full rounded-lg border border-gray-100">
                <table className="w-full text-left text-sm text-slate-600 block md:table">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-xs tracking-wider whitespace-nowrap hidden md:table-header-group">
                  <tr>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Jam</th>
                    <th className="px-6 py-4">Nama PT</th>
                    <th className="px-6 py-4">KUOTA</th>
                    <th className="px-6 py-4">HARGA</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 block md:table-row-group">
                  {paginatedSlots.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        Belum ada slot waktu yang dibuat.
                      </td>
                    </tr>
                  ) : (
                    paginatedSlots
                      .map((s) => {
                        const dateStr = s.targetDate 
                          ? new Date(s.targetDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })
                          : s.dayOfWeek;
                        
                        return (
                          <tr key={s.id} className="hover:bg-slate-50/50 transition-colors block md:table-row mb-4 border border-slate-200 rounded-xl md:mb-0 md:border-none md:rounded-none bg-white p-2 md:p-0 shadow-sm md:shadow-none">
                            <td className="px-3 py-2.5 md:px-6 md:py-4 font-semibold text-slate-900 md:w-1/4 md:whitespace-nowrap flex justify-between items-center block md:table-cell border-b border-slate-100 md:border-none last:border-none">
                              <span className="md:hidden text-xs font-bold text-slate-500">Tanggal:</span>
                              <span>{dateStr}</span>
                            </td>
                            <td className="px-3 py-2.5 md:px-6 md:py-4 md:w-1/4 md:whitespace-nowrap flex justify-between items-center block md:table-cell border-b border-slate-100 md:border-none last:border-none">
                              <span className="md:hidden text-xs font-bold text-slate-500">Jam:</span>
                              <span className="bg-slate-100 text-slate-700 font-medium px-2 py-1 rounded-md">
                                {s.startTime} - {s.endTime}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 md:px-6 md:py-4 md:whitespace-nowrap flex justify-between items-center block md:table-cell border-b border-slate-100 md:border-none last:border-none">
                              <span className="md:hidden text-xs font-bold text-slate-500">Trainer:</span>
                              <span>{s.trainer?.name || s.trainerName || <span className="text-slate-400 italic">Bebas</span>}</span>
                            </td>
                            <td className="px-3 py-2.5 md:px-6 md:py-4 md:whitespace-nowrap flex justify-between items-center block md:table-cell border-b border-slate-100 md:border-none last:border-none">
                              <span className="md:hidden text-xs font-bold text-slate-500">Kuota:</span>
                              <span className="font-semibold text-slate-900">{s.maxCapacity} Orang</span>
                            </td>
                            <td className="px-3 py-2.5 md:px-6 md:py-4 md:whitespace-nowrap flex justify-between items-center block md:table-cell border-b border-slate-100 md:border-none last:border-none">
                              <span className="md:hidden text-xs font-bold text-slate-500">Harga:</span>
                              <div className="flex flex-col text-right md:text-left">
                                <span className="font-bold text-emerald-600">
                                  IDR {(s.price - (s.price * ((s.discountPercentage || 0) / 100))).toLocaleString("id-ID")}
                                </span>
                                {(s.discountPercentage || 0) > 0 && (
                                  <span className="text-[10px] text-slate-500 line-through">
                                    IDR {(s.price || 0).toLocaleString("id-ID")} (Disc {s.discountPercentage}%)
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-3 md:px-6 md:py-4 text-right md:whitespace-nowrap flex justify-end block md:table-cell border-b border-slate-100 md:border-none last:border-none">
                              <button
                                onClick={() => handleDeleteSlot(s.id)}
                                className="text-red-500 hover:text-red-700 font-medium text-xs bg-red-50 hover:bg-red-100 px-4 py-2 md:px-3 md:py-1.5 rounded-lg transition-colors w-full md:w-auto text-center"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
                </table>
              </div>
              <Pagination 
                currentPage={slotPage}
                totalPages={slotTotalPages}
                onPageChange={setSlotPage}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Kolom Kiri */}
          <div className="space-y-4 md:space-y-6">


          {/* Section 2: CONFIRMED (Today) */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base md:text-xl font-bold text-slate-900">Sesi Hari Ini</h2>
              <span className="text-xs md:text-sm font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{todaySessions?.length || 0}</span>
            </div>
            <div className="space-y-3">
              {!todaySessions || todaySessions.length === 0 ? (
                <div className="p-3 md:p-6 text-center text-slate-500 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Tidak ada jadwal PT untuk hari ini.
                </div>
              ) : (
                todaySessions.map(renderTodaySchedule)
              )}
            </div>
          </section>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-4 md:space-y-6">
          {/* Section 3: PENDING */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base md:text-xl font-bold text-slate-900">Booking Baru (Menunggu Konfirmasi)</h2>
              <span className="text-xs md:text-sm font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{pendingSessions.length}</span>
            </div>
            <div className="space-y-3">
              {pendingSessions.length === 0 ? (
                <div className="p-3 md:p-6 text-center text-slate-500 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Tidak ada booking baru.
                </div>
              ) : (
                pendingSessions.map(s => renderCard(s, "CONFIRM"))
              )}
            </div>
          </section>

          {/* Section 4: COMPLETED (Recent) */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-xl font-bold text-slate-900">Sesi Selesai {activePeriod === "today" ? "(Hari Ini)" : activePeriod === "week" ? "(Minggu Ini)" : activePeriod === "month" ? "(Bulan Ini)" : "(Semua)"}</h2>
                <span className="text-xs md:text-sm font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{completedSessions.length}</span>
              </div>
              <DateFilterDropdown currentFilter={activePeriod || "today"} onFilterChange={handlePeriodChange} />
            </div>
            <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity">
              {paginatedCompleted.length === 0 ? (
                <div className="p-3 md:p-6 text-center text-slate-500 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Belum ada sesi yang selesai.
                </div>
              ) : (
                paginatedCompleted.map(s => renderCard(s, "NONE"))
              )}
            </div>
            <Pagination 
              currentPage={completedPage}
              totalPages={completedTotalPages}
              onPageChange={setCompletedPage}
            />
          </section>
        </div>

      </div>
      )}
    </div>
  );
}
