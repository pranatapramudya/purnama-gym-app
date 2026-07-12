"use client";

import { useState } from "react";
import { AdminToast, ToastType } from "@/components/admin/AdminToast";
import { CheckCircle2, Play, CheckSquare, Loader2, CalendarClock, Clock, Trash2 } from "lucide-react";
import { confirmPTSession, startPTSession, finishPTSession } from "@/app/actions/admin";

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

interface PTSettingItem {
  pricePerSession: number;
  availableDays: string[];
  startTime: string;
  endTime: string;
}

interface PTScheduleSlotItem {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  trainerId?: string | null;
  trainerName?: string | null;
  trainer?: { name: string | null } | null;
  maxCapacity: number;
}

export default function ClassesClient({ 
  initialSessions,
  userRole,
  ptSetting,
  initialSlots,
  trainers
}: { 
  initialSessions: PTSessionItem[];
  userRole: string;
  ptSetting: PTSettingItem | null;
  initialSlots: PTScheduleSlotItem[];
  trainers: { id: string; name: string | null; email: string }[];
}) {
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as ToastType });
  const [sessions, setSessions] = useState<PTSessionItem[]>(initialSessions);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Tabs: "JADWAL" | "PENGATURAN"
  const [activeTab, setActiveTab] = useState<"JADWAL" | "PENGATURAN">("JADWAL");

  // Settings form state
  const [setPrice, setSetPrice] = useState(ptSetting?.pricePerSession || 100000);
  const [setDays, setSetDays] = useState<string[]>(ptSetting?.availableDays || ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]);
  const [setStartTime, setSetStartTime] = useState(ptSetting?.startTime || "08:00");
  const [setEndTime, setSetEndTime] = useState(ptSetting?.endTime || "20:00");
  const [isSavingSetting, setIsSavingSetting] = useState(false);

  // Slots CRUD state
  const [slots, setSlots] = useState<PTScheduleSlotItem[]>(initialSlots);
  const [slotDay, setSlotDay] = useState("Senin");
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");
  const [slotTrainerInput, setSlotTrainerInput] = useState("");
  const [slotMaxCapacity, setSlotMaxCapacity] = useState(1);
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

  const handleSaveSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSetting(true);
    const { updatePTSetting } = await import("@/app/actions/admin");
    const res = await updatePTSetting({
      pricePerSession: Number(setPrice),
      availableDays: setDays,
      startTime: setStartTime,
      endTime: setEndTime
    });
    setIsSavingSetting(false);
    if (res.success) {
      showToast("Pengaturan PT berhasil disimpan.", "success");
    } else {
      showToast(res.error || "Gagal menyimpan pengaturan", "error");
    }
  };

  const toggleDay = (day: string) => {
    if (setDays.includes(day)) {
      setSetDays(setDays.filter(d => d !== day));
    } else {
      setSetDays([...setDays, day]);
    }
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotStart || !slotEnd) {
      showToast("Jam mulai dan selesai wajib diisi", "error");
      return;
    }
    setIsAddingSlot(true);
    const { createPTScheduleSlot } = await import("@/app/actions/admin");
    const res = await createPTScheduleSlot({ dayOfWeek: slotDay, startTime: slotStart, endTime: slotEnd, trainerInput: slotTrainerInput || undefined, maxCapacity: slotMaxCapacity });
    setIsAddingSlot(false);
    if (res.success) {
      showToast("Slot berhasil ditambahkan.", "success");
      // Find if it matches a trainer to display their name
      const trainerObj = trainers.find(t => t.name === slotTrainerInput || t.id === slotTrainerInput);
      setSlots([...slots, { 
        id: Date.now().toString(), 
        dayOfWeek: slotDay, 
        startTime: slotStart, 
        endTime: slotEnd,
        trainerId: trainerObj ? trainerObj.id : null,
        trainerName: !trainerObj ? slotTrainerInput : null,
        trainer: trainerObj ? { name: trainerObj.name } : null,
        maxCapacity: slotMaxCapacity
      }]);
      setSlotStart("");
      setSlotEnd("");
      setSlotMaxCapacity(1);
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
  
  // Filter for CONFIRMED sessions today
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);
  
  const todayConfirmedSessions = sessions.filter(s => {
    if (s.status !== "CONFIRMED") return false;
    const sDate = new Date(s.schedule);
    return sDate >= todayStart && sDate < todayEnd;
  });

  const ongoingSessions = sessions.filter(s => s.status === "ONGOING");
  const completedSessions = sessions.filter(s => s.status === "COMPLETED");

  const renderCard = (session: PTSessionItem, action: "CONFIRM" | "START" | "FINISH" | "NONE") => {
    const d = new Date(session.schedule);
    const timeStr = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const dateStr = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    const isProcessing = processingId === session.id;

    return (
      <div key={session.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0 shadow-sm">
            {session.memberName.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-900">{session.memberName}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <CalendarClock className="w-3.5 h-3.5" />
              {dateStr} • {timeStr} WIB
            </p>
            <p className="text-xs text-rose-500 font-medium mt-1">Trainer: {session.trainerName}</p>
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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Sesi PT</h1>
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
        <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Pengaturan Master Ketersediaan & Harga PT</h2>
          <form onSubmit={handleSaveSetting} className="space-y-6">
            
            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Harga Per Sesi (1 Jam)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 font-semibold text-sm">Rp</span>
                <input 
                  type="text" 
                  value={setPrice ? setPrice.toLocaleString("id-ID") : ""} 
                  onChange={e => {
                    const val = Number(e.target.value.replace(/\D/g, ''));
                    setSetPrice(val);
                  }}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all appearance-none"
                />
              </div>
            </div>

            {/* Days */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Hari Operasional PT</label>
              <div className="flex flex-wrap gap-2">
                {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${
                      setDays.includes(day)
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Jam Buka Sesi</label>
                <input 
                  type="time" 
                  value={setStartTime} 
                  onChange={e => setSetStartTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Jam Tutup Sesi</label>
                <input 
                  type="time" 
                  value={setEndTime} 
                  onChange={e => setSetEndTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button 
                type="submit" 
                disabled={isSavingSetting}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                {isSavingSetting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Pengaturan"}
              </button>
            </div>
          </form>

          {/* Master Schedule Slots CRUD */}
          <div className="mt-10 pt-10 border-t border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Kelola Slot Jadwal PT</h2>
            
            <form onSubmit={handleAddSlot} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 items-end">
              <div className="w-full md:col-span-5 mb-2">
                <label className="block text-xs font-bold text-slate-700 mb-3">Pilih Hari</label>
                <div className="flex flex-wrap gap-2">
                  {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSlotDay(d)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border shadow-sm ${
                        slotDay === d 
                        ? 'bg-emerald-500 text-white border-emerald-500 ring-2 ring-emerald-500/20' 
                        : 'bg-white text-slate-600 border-slate-300 hover:border-emerald-400 hover:bg-emerald-50 active:scale-95'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="w-full">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Mulai</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Clock className="h-4 w-4 text-slate-400" />
                  </div>
                  <select 
                    value={slotStart} 
                    onChange={e => setSlotStart(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                  >
                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="w-full">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Selesai</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Clock className="h-4 w-4 text-slate-400" />
                  </div>
                  <select 
                    value={slotEnd} 
                    onChange={e => setSlotEnd(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                  >
                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="w-full">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Maksimal Member (Kuota)</label>
                <input 
                  type="number"
                  min="1"
                  value={slotMaxCapacity} 
                  onChange={e => setSlotMaxCapacity(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="w-full">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Ketik Nama PT (Opsional)</label>
                <input 
                  type="text"
                  placeholder="Ketik nama trainer..."
                  value={slotTrainerInput} 
                  onChange={e => setSlotTrainerInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
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
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Hari</th>
                    <th className="px-6 py-4">Jam</th>
                    <th className="px-6 py-4">Nama PT</th>
                    <th className="px-6 py-4">KUOTA</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {slots.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        Belum ada slot waktu yang dibuat.
                      </td>
                    </tr>
                  ) : (
                    ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map(day => {
                      const daySlots = slots.filter(s => s.dayOfWeek === day);
                      return daySlots.map((s, index) => (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-900 w-1/4">
                            {index === 0 ? day : ""}
                          </td>
                          <td className="px-6 py-4 w-1/4">
                            <span className="bg-slate-100 text-slate-700 font-medium px-2 py-1 rounded-md">
                              {s.startTime} - {s.endTime}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {s.trainer?.name || s.trainerName || <span className="text-slate-400 italic">Bebas</span>}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-slate-900">{s.maxCapacity} Orang</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteSlot(s.id)}
                              className="text-red-500 hover:text-red-700 font-medium text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ));
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Kolom Kiri */}
          <div className="space-y-8">
          {/* Section 1: ONGOING */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-lg font-bold text-slate-900">Sesi Aktif (Sedang Berjalan)</h2>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{ongoingSessions.length}</span>
            </div>
            <div className="space-y-3">
              {ongoingSessions.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Tidak ada sesi PT yang sedang berjalan.
                </div>
              ) : (
                ongoingSessions.map(s => renderCard(s, "FINISH"))
              )}
            </div>
          </section>

          {/* Section 2: CONFIRMED (Today) */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-bold text-slate-900">Sesi Hari Ini</h2>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{todayConfirmedSessions.length}</span>
            </div>
            <div className="space-y-3">
              {todayConfirmedSessions.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Tidak ada jadwal PT untuk hari ini.
                </div>
              ) : (
                todayConfirmedSessions.map(s => renderCard(s, "START"))
              )}
            </div>
          </section>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-8">
          {/* Section 3: PENDING */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-bold text-slate-900">Booking Baru (Menunggu Konfirmasi)</h2>
              <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{pendingSessions.length}</span>
            </div>
            <div className="space-y-3">
              {pendingSessions.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Tidak ada booking baru.
                </div>
              ) : (
                pendingSessions.map(s => renderCard(s, "CONFIRM"))
              )}
            </div>
          </section>

          {/* Section 4: COMPLETED (Recent) */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-bold text-slate-900">Sesi Selesai (Terbaru)</h2>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{completedSessions.length}</span>
            </div>
            <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity">
              {completedSessions.slice(0, 5).length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Belum ada sesi yang selesai.
                </div>
              ) : (
                completedSessions.slice(0, 5).map(s => renderCard(s, "NONE"))
              )}
            </div>
          </section>
        </div>

      </div>
      )}
    </div>
  );
}
