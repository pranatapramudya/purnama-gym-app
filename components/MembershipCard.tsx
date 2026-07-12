import { Crown, Sparkles } from "lucide-react";

export function MembershipCard({ name, role, endDate, firstName }: { name: string, role: string, endDate: Date, firstName?: string }) {
  const isVip = role === "MEMBER" && endDate && new Date(endDate) > new Date();
  
  // VIP menggunakan gradien hitam/emas elegan. Non-VIP menggunakan abu-abu netral.
  const bgClass = isVip 
    ? "bg-gradient-to-r from-slate-900 to-black text-white border border-amber-500/30 shadow-[0_10px_30px_rgba(245,158,11,0.15)]" 
    : "bg-gray-100 text-gray-800 border border-gray-300 shadow-sm";
  
  const formattedDate = new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }).format(endDate);

  return (
    <div className={`px-4 py-2.5 rounded-3xl relative overflow-hidden ${bgClass} transition-transform hover:scale-[1.02] duration-300`}>
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-white opacity-[0.07] blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-black opacity-10 blur-xl pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-[10px] uppercase tracking-widest opacity-80 mb-0.5 font-medium">{firstName || 'MEMBER'}</p>
          <h2 className={`text-lg font-black tracking-tight ${isVip ? "text-amber-400" : ""}`}>{name}</h2>
        </div>
        
        {/* Badge */}
        <div className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-wider flex items-center gap-1.5 shadow-sm
          ${isVip ? "bg-amber-500 text-black" : "bg-white text-gray-600 border border-gray-200"}`}>
          {isVip ? <Crown className="w-3 h-3" /> : <Sparkles className="w-3 h-3 text-gray-400" />}
          {isVip ? "VIP" : "REGULAR"}
        </div>
      </div>
      
      <div className="mt-3 flex justify-between items-end relative z-10 min-h-[36px]">
        {isVip && (
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-80 mb-1 font-medium">Berlaku Sampai</p>
            <p className="font-bold text-sm tracking-wide">{formattedDate}</p>
          </div>
        )}
      </div>
    </div>
  );
}
