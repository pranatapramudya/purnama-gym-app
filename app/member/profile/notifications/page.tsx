import Link from "next/link";
import { ArrowLeft, Bell, CalendarCheck, Ticket, Info, BellOff } from "lucide-react";

export default function NotificationsPage() {
  // Mock Data (Data Binding Ready)
  const notifications = [
    {
      id: "1",
      title: "Jadwal PT Mendatang",
      message: "Sesi PT Zumba Anda akan dimulai dalam 2 jam. Jangan lupa bawa handuk dan air minum!",
      time: "Hari ini, 14:00",
      type: "class",
      isRead: false
    },
    {
      id: "2",
      title: "Pembayaran Berhasil",
      message: "Pembayaran untuk Perpanjang VIP (1 Bulan) telah diverifikasi oleh admin.",
      time: "Kemarin, 09:30",
      type: "payment",
      isRead: true
    },
    {
      id: "3",
      title: "Promo Spesial Akhir Pekan",
      message: "Dapatkan diskon 20% untuk pembelian Visit Harian di hari Sabtu dan Minggu ini!",
      time: "10 Jul, 08:00",
      type: "promo",
      isRead: true
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'class': return <CalendarCheck className="w-5 h-5 text-indigo-500" />;
      case 'payment': return <Ticket className="w-5 h-5 text-emerald-500" />;
      case 'promo': return <Info className="w-5 h-5 text-rose-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'class': return "bg-indigo-50";
      case 'payment': return "bg-emerald-50";
      case 'promo': return "bg-rose-50";
      default: return "bg-blue-50";
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="bg-gradient-to-br from-emerald-200 via-teal-300 to-emerald-400 px-6 pt-10 pb-8 rounded-b-[2.5rem] shadow-xl shadow-teal-900/10 border-b border-white/60 mb-6 relative overflow-hidden -mx-4 -mt-4 flex items-center gap-4">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
        <Link href="/member/dashboard" className="relative z-10 w-10 h-10 rounded-full bg-white/20 border border-slate-800/10 flex items-center justify-center text-slate-900 hover:bg-white/30 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-slate-900">Notifikasi</h1>
          <p className="text-sm font-medium text-slate-700/90 mt-1">Pemberitahuan untuk Anda</p>
        </div>
      </header>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4">
            <BellOff className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Belum Ada Notifikasi</h2>
          <p className="text-sm text-slate-500">Anda tidak memiliki notifikasi baru saat ini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id} className={`bg-white p-4 rounded-2xl shadow-sm border flex gap-4 relative overflow-hidden transition-colors ${notif.isRead ? 'border-slate-100 opacity-75' : 'border-emerald-100'}`}>
              
              {!notif.isRead && (
                <div className="absolute top-0 right-0 w-2 h-full bg-emerald-400" />
              )}
              
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getBgColor(notif.type)}`}>
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h4 className={`font-bold text-sm truncate ${notif.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0 pt-0.5">
                    {notif.time}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-snug line-clamp-2">
                  {notif.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
