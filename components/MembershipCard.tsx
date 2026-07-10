import { Crown, Sparkles } from "lucide-react";

export function MembershipCard({ name, role, endDate, firstName }: { name: string, role: string, endDate: Date, firstName?: string }) {
  const isVip = role === "MEMBER_VIP";
  
  // VIP menggunakan gradien hitam/emas elegan. Regular menggunakan gradien rose-gold cerah.
  const bgClass = isVip 
    ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-[#2c2210] text-white border border-[#d4af37]/40 shadow-[0_10px_30px_rgba(212,175,55,0.15)]" 
    : "bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-[0_10px_30px_rgba(225,29,72,0.2)]";
  
  const formattedDate = new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }).format(endDate);

  return (
    <div className={`px-4 py-2.5 rounded-3xl relative overflow-hidden ${bgClass} transition-transform hover:scale-[1.02] duration-300`}>
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-white opacity-[0.07] blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-black opacity-10 blur-xl pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-[10px] uppercase tracking-widest opacity-80 mb-0.5 font-medium">{firstName || 'MEMBER'}</p>
          <h2 className="text-lg font-black tracking-tight">{name}</h2>
        </div>
        
        {/* Badge */}
        <div className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-wider flex items-center gap-1.5 shadow-lg
          ${isVip ? "bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-black" : "bg-white/20 text-white backdrop-blur-sm"}`}>
          {isVip ? <Crown className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
          {isVip ? "VIP" : "REGULAR"}
        </div>
      </div>
      
      <div className="mt-3 flex justify-between items-end relative z-10">
        <div>
          <p className="text-[10px] uppercase tracking-widest opacity-80 mb-1 font-medium">Berlaku Sampai</p>
          <p className="font-bold text-sm tracking-wide">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
}
