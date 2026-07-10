"use client";

import { useState } from "react";
import { AdminToast, ToastType } from "@/components/admin/AdminToast";
import { Camera, CheckCircle2, Clock, Scan, Loader2 } from "lucide-react";
import { processQRCheckIn } from "@/app/actions/admin";

interface ScanResult {
  name: string;
  email: string;
  role: string;
  time: string;
  status: "success" | "already" | "expired";
}

export default function ScannerClient({ initialHistory }: { initialHistory: ScanResult[] }) {
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as ToastType });
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>(initialHistory);
  const [userIdInput, setUserIdInput] = useState("");

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ visible: true, message, type });
  };

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIdInput.trim()) return;

    setIsScanning(true);
    const res = await processQRCheckIn(userIdInput.trim());
    setIsScanning(false);

    if (res.success && res.data) {
      setLastScan(res.data as ScanResult);
      setScanHistory(prev => [res.data as ScanResult, ...prev]);
      showToast(`Check-in berhasil: ${res.data.name}`, "success");
      setUserIdInput(""); // Reset form
    } else {
      showToast(res.error || "Gagal check-in", "error");
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <AdminToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onDismiss={() => setToast((s) => ({ ...s, visible: false }))}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Scanner QR</h1>
        <p className="text-slate-500 text-sm mt-1">Scan QR member untuk check-in atau kehadiran sesi PT.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Camera Area */}
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-slate-900 rounded-2xl aspect-[4/3] relative overflow-hidden shadow-xl">
            {/* Camera placeholder */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {isScanning ? (
                <>
                  {/* Scanning animation */}
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 border-2 border-white/20 rounded-2xl" />
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-rose-400 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-rose-400 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-rose-400 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-rose-400 rounded-br-xl" />
                    {/* Scanning line */}
                    <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent animate-[scanLine_2s_ease-in-out_infinite]" />
                    <style>{`
                      @keyframes scanLine {
                        0%, 100% { top: 10%; }
                        50% { top: 85%; }
                      }
                    `}</style>
                  </div>
                  <p className="text-white/60 text-sm font-medium mt-4 animate-pulse">Memindai QR Code...</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                    <Camera className="w-10 h-10 text-white/40" />
                  </div>
                  <p className="text-white/50 text-sm font-medium">Kamera belum aktif</p>
                  <p className="text-white/30 text-xs mt-1">Klik tombol di bawah untuk mulai scan</p>
                </>
              )}
            </div>

            {/* Overlay gradient */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/80 to-transparent" />
          </div>

          {/* Scan Input Form */}
          <form onSubmit={handleScanSubmit} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Masukkan ID Member..."
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-rose-500/20"
              disabled={isScanning}
            />
            <button
              type="submit"
              disabled={isScanning || !userIdInput.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg shadow-rose-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scan className="w-5 h-5" />}
              <span className="hidden sm:inline">{isScanning ? "Memindai..." : "Scan"}</span>
            </button>
          </form>

          {/* Last Scan Result */}
          {lastScan && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm animate-[fadeUp_0.3s_ease-out]">
              <style>{`
                @keyframes fadeUp {
                  from { opacity: 0; transform: translateY(0.5rem); }
                  to   { opacity: 1; transform: translateY(0); }
                }
              `}</style>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-sm font-bold text-emerald-700">Check-in Berhasil!</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold shadow-sm">
                  {lastScan.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{lastScan.name}</p>
                  <p className="text-xs text-slate-500">{lastScan.email}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    lastScan.role === "MEMBER_VIP" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                  }`}>
                    {lastScan.role === "MEMBER_VIP" ? "VIP" : "Regular"}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">{lastScan.time}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scan History */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Riwayat Check-in Hari Ini</h3>
              <p className="text-xs text-slate-500 mt-0.5">{scanHistory.length} scan tercatat</p>
            </div>
            <div className="divide-y divide-slate-100 h-[600px] overflow-y-auto">
              {scanHistory.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">Belum ada history check-in hari ini.</div>
              ) : (
                scanHistory.map((scan, idx) => (
                  <div key={idx} className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50/60 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                      {scan.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{scan.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] text-slate-500">{scan.time}</span>
                        {scan.status === "already" && (
                          <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">Sudah scan</span>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      scan.role === "MEMBER_VIP" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                    }`}>
                      {scan.role === "MEMBER_VIP" ? "VIP" : "REG"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
