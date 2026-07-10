import { currentUser } from "@clerk/nextjs/server";
import QRCode from "react-qr-code";
import Link from "next/link";
import { ScanLine } from "lucide-react";

export default async function QRCodePage() {
  const user = await currentUser();
  const qrData = user?.id || "dummy-qr-data";

  return (
    <div className="max-w-md mx-auto w-full min-h-screen bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Tombol Kembali */}
      <Link href="/member/dashboard" className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-md z-50">
        &larr;
      </Link>

      <div className="text-center mb-8 relative z-10 mt-12">
        <h1 className="text-2xl font-bold text-white mb-2">QR Masuk</h1>
        <p className="text-slate-400 text-sm">Tingkatkan kecerahan layar agar mudah di-scan</p>
      </div>

      {/* QR Code Container with Pulse Animation */}
      <div className="relative group z-10 w-full max-w-sm mx-auto flex flex-col items-center">
        <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl blur opacity-75 animate-pulse transition duration-1000 max-w-[280px] mx-auto w-full aspect-square"></div>
        <div className="relative bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center w-full max-w-[280px]">
          <div className="border-4 border-dashed border-slate-100 p-4 rounded-2xl relative w-full">
            {/* Scan frame corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-rose-500 rounded-tl-xl -translate-x-2 -translate-y-2"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-rose-500 rounded-tr-xl translate-x-2 -translate-y-2"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-rose-500 rounded-bl-xl -translate-x-2 translate-y-2"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-rose-500 rounded-br-xl translate-x-2 translate-y-2"></div>
            
            <div className="max-w-[200px] mx-auto w-full aspect-square bg-white rounded-xl flex items-center justify-center">
              <QRCode 
                value={qrData} 
                size={200}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
              />
            </div>
            
          </div>
          
          <div className="mt-6 flex items-center gap-2 text-slate-800 font-bold bg-slate-50 px-4 py-2 rounded-full text-sm">
            <ScanLine className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="whitespace-nowrap">Tunjukkan QR ini ke Kasir</span>
          </div>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
}
