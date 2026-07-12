import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { QRRenderer } from "./qr-renderer";
import Link from "next/link";
import { ScanLine } from "lucide-react";
import { redirect } from "next/navigation";

export default async function QRCodePage() {
  const clerkUser = await currentUser();
  if (!clerkUser) return redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id }
  });

  if (!user) return redirect("/sign-in");

  const memberId = user.shortId || `M-${user.id.substring(user.id.length - 4).toUpperCase()}`;
  const qrData = memberId;
  const isVip = user.role === "MEMBER" && user.endDate && user.endDate > new Date();
  const userName = user.name || "Member Purnama";

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
        <div className={`absolute -inset-1 rounded-3xl blur opacity-75 animate-pulse transition duration-1000 max-w-[280px] mx-auto w-full aspect-square ${isVip ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}></div>
        <div className={`relative p-6 rounded-3xl shadow-2xl flex flex-col items-center w-full max-w-[280px] border ${isVip ? 'bg-gradient-to-br from-slate-900 to-black text-white border-amber-500/50 shadow-amber-500/20' : 'bg-white text-slate-800 border-gray-200'}`}>
          <div className="border-4 border-dashed border-slate-100/20 p-4 rounded-2xl relative w-full">
            {/* Scan frame corners */}
            <div className={`absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 rounded-tl-xl -translate-x-2 -translate-y-2 ${isVip ? 'border-amber-400' : 'border-emerald-500'}`}></div>
            <div className={`absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 rounded-tr-xl translate-x-2 -translate-y-2 ${isVip ? 'border-amber-400' : 'border-emerald-500'}`}></div>
            <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 rounded-bl-xl -translate-x-2 translate-y-2 ${isVip ? 'border-amber-400' : 'border-emerald-500'}`}></div>
            <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 rounded-br-xl translate-x-2 translate-y-2 ${isVip ? 'border-amber-400' : 'border-emerald-500'}`}></div>
            
            <div className="text-center mb-4 border-b border-slate-500/30 pb-4">
              <h2 className={`font-extrabold text-xl ${isVip ? 'text-amber-400' : 'text-slate-800'}`}>{userName}</h2>
              <p className={`text-sm font-mono mb-2 ${isVip ? 'text-slate-400' : 'text-gray-500'}`}>ID: {memberId}</p>
              <span className={`inline-block px-3 py-1 text-[10px] rounded-full uppercase tracking-wider ${
                isVip ? 'bg-amber-500 text-black font-extrabold' : 'bg-gray-200 text-gray-500 font-bold'
              }`}>
                {isVip ? 'VIP Member' : 'NON MEMBER'}
              </span>
            </div>

            <div className="max-w-[200px] mx-auto w-full aspect-square bg-white rounded-xl flex items-center justify-center overflow-hidden p-2">
              <QRRenderer userId={qrData} />
            </div>
            
          </div>
          
          <div className={`mt-6 flex items-center gap-2 font-bold px-4 py-2 rounded-full text-sm ${isVip ? 'bg-white/10 text-amber-400' : 'bg-slate-50 text-slate-800'}`}>
            <ScanLine className={`w-4 h-4 shrink-0 ${isVip ? 'text-amber-400' : 'text-emerald-500'}`} />
            <span className="whitespace-nowrap">Tunjukkan QR ini ke Kasir</span>
          </div>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className={`absolute top-1/4 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${isVip ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}></div>
      <div className={`absolute bottom-1/4 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${isVip ? 'bg-yellow-500/10' : 'bg-teal-500/10'}`}></div>
    </div>
  );
}
