"use client";

import { useState, useEffect, useRef } from "react";
import { AdminToast, ToastType } from "@/components/admin/AdminToast";
import { Camera, CheckCircle2, Clock, Scan, Loader2, XCircle } from "lucide-react";
import { processQRCheckIn } from "@/app/actions/admin";
import { Html5Qrcode } from "html5-qrcode";
import { useResponsivePagination } from "@/hooks/useResponsivePagination";
import { Pagination } from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface ScanResult {
  name: string;
  email: string;
  role: string;
  shortId?: string;
  time: string;
  status: "success" | "already" | "expired" | "checkout";
  hasPTSession?: boolean;
}

export default function ScannerClient({ initialHistory }: { initialHistory: ScanResult[] }) {
  const router = useRouter();
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as ToastType });
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>(initialHistory);
  const [userIdInput, setUserIdInput] = useState("");
  const [expiredUserId, setExpiredUserId] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [mounted, setMounted] = useState(false);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ visible: true, message, type });
  };

  const { currentPage, totalPages, setCurrentPage, paginatedData, itemsPerPage } = useResponsivePagination(scanHistory);

  useEffect(() => {
    setScanHistory(initialHistory);
    setCurrentPage(1);
  }, [initialHistory, setCurrentPage]);



  useEffect(() => {
    setMounted(true);
    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;

    html5QrCode.start(
      { facingMode: { exact: "environment" } },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText) => {
        if (!isProcessingRef.current) {
          handleScanText(decodedText);
        }
      },
      (errorMessage) => {
        // parse error, ignore
      }
    ).catch((err) => {
      // Fallback to any camera if environment camera fails (e.g. PC without back camera)
      html5QrCode.start(
        { facingMode: "user" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (!isProcessingRef.current) {
            handleScanText(decodedText);
          }
        },
        (errorMessage) => {}
      ).catch((err2) => {
        setCameraError("Harap izinkan akses kamera pada browser Anda.");
        console.error("Camera access failed", err2);
      });
    });

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().then(() => scannerRef.current?.clear()).catch(console.error);
      }
    };
  }, []);

  const handleScanText = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    // Extract ID if the scanned text is a URL
    const extractedId = cleanText.includes("/verify/") 
      ? cleanText.split("/verify/")[1].split("?")[0].replace(/\/$/, "") 
      : cleanText;

    isProcessingRef.current = true;
    setIsScanning(true);
    setUserIdInput(extractedId);

    const res = await processQRCheckIn(extractedId);
    setIsScanning(false);

    if (res.success && res.data) {
      const data = res.data as ScanResult;
      setLastScan(data);
      setScanHistory(prev => [data, ...prev]);
      setUserIdInput(""); 
      setExpiredUserId(null);

      if (data.status === "checkout") {
        showToast(`Check-out berhasil: ${data.name}`, "success");
      } else {
        showToast(`Check-in berhasil: ${data.name}`, "success");
      }
    } else {
      if (res.error === "KADALUARSA") {
        setExpiredUserId(cleanText);
        setLastScan(null);
      } else {
        showToast(res.error || "Gagal check-in", "error");
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 2500);
      }
    }
  };

  const handleCloseModal = () => {
    setLastScan(null);
    setExpiredUserId(null);
    isProcessingRef.current = false;
  };

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProcessingRef.current) {
      handleScanText(userIdInput);
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
            {cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-white font-bold text-sm">{cameraError}</p>
                <p className="text-white/60 text-xs mt-2">Beri izin akses kamera pada pengaturan browser untuk melanjutkan.</p>
              </div>
            ) : (
              <div id="qr-reader" className="w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover" />
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
            
            {/* Scanning indication overlay */}
            {isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                <Loader2 className="w-12 h-12 text-rose-500 animate-spin mb-4" />
                <p className="text-white font-bold animate-pulse">Memproses Check-In...</p>
              </div>
            )}
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

          {/* Expired Alert */}
          {expiredUserId && (
            <div className="bg-red-50 rounded-2xl border border-red-200 p-5 shadow-sm animate-[fadeUp_0.3s_ease-out]">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h3 className="text-sm font-bold text-red-700">Masa Aktif Kadaluarsa!</h3>
                </div>
                <p className="text-xs text-red-600 font-medium">Member ini tidak dapat check-in karena masa aktifnya sudah habis. Silakan lakukan perpanjangan langganan terlebih dahulu.</p>
                <div className="pt-2">
                  <a 
                    href={`/2026/transactions?userId=${expiredUserId}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Lakukan Perpanjangan
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Last Scan Result Modal */}
          {lastScan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className={`p-6 text-center text-white ${lastScan.role === "MEMBER" ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'}`}>
                  <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md mb-4 shadow-inner border border-white/30">
                    <CheckCircle2 className="w-10 h-10 text-white drop-shadow-md" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-1">
                    {lastScan.status === "checkout" ? "Check-out Berhasil!" : "Check-in Berhasil!"}
                  </h3>
                  <p className="text-white/80 text-sm font-medium">Data kehadiran tercatat di sistem.</p>
                </div>
                
                <div className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-1">BIODATA MEMBER</p>
                    <h4 className="text-2xl font-extrabold text-slate-900">{lastScan.name}</h4>
                    <p className="text-sm font-mono font-bold text-slate-500 mt-1">{lastScan.shortId || "ID NOT SET"}</p>
                    
                    <div className="mt-3 inline-flex items-center justify-center">
                      <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 ${
                        lastScan.role === "MEMBER" 
                          ? "bg-amber-50 text-amber-600 border-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.2)]" 
                          : "bg-blue-50 text-blue-600 border-blue-200"
                      }`}>
                        {lastScan.role === "MEMBER" ? "VIP MEMBER" : "REGULAR MEMBER"}
                      </span>
                    </div>

                    {lastScan.hasPTSession && (
                      <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-center gap-2 text-emerald-700">
                        <span className="text-lg">📋</span>
                        <span className="text-sm font-bold">Jadwal PT Hari Ini</span>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handleCloseModal}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-slate-900/20"
                  >
                    Tutup & Scan Lagi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scan History */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Riwayat Check-in</h3>
                <p className="text-xs text-slate-500 mt-0.5">Total: {scanHistory.length} scan tercatat</p>
              </div>
              <div className="w-full sm:w-auto flex-shrink-0">
                <DateRangePicker />
              </div>
            </div>
            <div className="divide-y divide-slate-100 h-[600px] overflow-y-auto">
              {paginatedData.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">Belum ada history check-in pada rentang waktu ini.</div>
              ) : (
                paginatedData.map((scan, idx) => {
                  const globalIdx = (currentPage - 1) * itemsPerPage + idx + 1;
                  return (
                  <div key={idx} className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50/60 transition-colors min-w-0">
                    <span className="text-slate-400 font-bold text-sm w-6 text-right shrink-0">#{globalIdx}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{scan.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] text-slate-500">
                          {mounted 
                            ? new Date(scan.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }) + " WIB"
                            : "00:00 WIB"}
                        </span>
                        {scan.status === "already" && (
                          <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">Sudah scan</span>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      scan.role === "MEMBER" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                    }`}>
                      {scan.role === "MEMBER" ? "VIP" : "REG"}
                    </span>
                  </div>
                )})
              )}
            </div>
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
