import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle2, XCircle, User } from "lucide-react";

export default async function VerifyPage(props: { params: Promise<{ memberCode: string }> }) {
  const params = await props.params;
  const memberCode = params.memberCode;
  
  // Extract ID using the same flexible lookup logic
  const searchId = memberCode.includes("-") ? memberCode.split("-")[1] : memberCode;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { shortId: memberCode },
        { id: memberCode },
        { id: { endsWith: searchId } }
      ]
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-6 shadow-inner border border-red-500/20">
          <XCircle className="w-10 h-10 text-red-500 drop-shadow-lg" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2 tracking-tight">Data Tidak Valid</h1>
        <p className="text-slate-400 text-sm mb-8 max-w-xs font-medium">QR Code tidak valid atau member tidak terdaftar dalam sistem Purnama Gym.</p>
        <Link href="/" className="px-8 py-4 bg-slate-900 text-white border border-white/10 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg active:scale-[0.98]">
          Kembali ke Aplikasi
        </Link>
      </div>
    );
  }

  const isVip = user.role === "MEMBER" && user.endDate && user.endDate > new Date();
  const roleDisplay = isVip ? "VIP MEMBER" : "REGULAR MEMBER";
  const displayedId = user.shortId || `M-${user.id.substring(user.id.length - 4).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background Ambience */}
      <div className={`absolute top-0 left-0 w-full h-1/2 opacity-20 blur-[100px] pointer-events-none ${isVip ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>

      <div className="w-full max-w-sm relative z-10 animate-in zoom-in-95 duration-500">
        <div className={`relative p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center border ${isVip ? 'bg-gradient-to-br from-slate-900 to-black border-amber-500/50 shadow-amber-500/10' : 'bg-gradient-to-br from-slate-900 to-slate-950 border-emerald-500/50 shadow-emerald-500/10'}`}>
          
          <div className="mb-8 text-center w-full">
            <h2 className="text-xl font-black tracking-[0.2em] text-white/40 uppercase mb-2">Purnama Gym</h2>
            <div className={`w-12 h-1.5 mx-auto rounded-full opacity-80 ${isVip ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`}></div>
          </div>

          <div className={`w-28 h-28 rounded-full flex items-center justify-center backdrop-blur-xl mb-6 shadow-2xl border-4 ${isVip ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'}`}>
            <User className="w-12 h-12" />
          </div>

          <div className="text-center w-full mb-8">
            <h1 className="text-3xl font-black text-white mb-1.5 tracking-tight">{user.name || "Member Purnama"}</h1>
            <p className="text-lg font-mono font-bold text-slate-400">{displayedId}</p>
          </div>

          <div className="w-full bg-black/40 rounded-2xl p-5 border border-white/5 mb-8 flex flex-col items-center justify-center backdrop-blur-md">
            <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase mb-3">STATUS KEANGGOTAAN</span>
            <span className={`px-5 py-2.5 rounded-full text-sm font-black uppercase tracking-widest border ${
              isVip 
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.15)]" 
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            }`}>
              {roleDisplay}
            </span>
            <div className="flex items-center gap-1.5 mt-5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wide">Terverifikasi Sistem</span>
            </div>
          </div>

          <Link href="/" className="w-full py-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-extrabold text-center transition-all active:scale-[0.98] shadow-lg">
            Kembali ke Aplikasi
          </Link>
        </div>
      </div>
    </div>
  );
}
