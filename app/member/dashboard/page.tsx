import Link from "next/link";
import Image from "next/image";
import { MembershipCard } from "@/components/MembershipCard";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Info, Ticket, History, Bell, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function MemberDashboard() {
  const user = await currentUser();
  
  let dbUser = null;
  if (user) {
    dbUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
    });
  }

  const role = dbUser?.role || "MEMBER";
  const activeUntilDate = dbUser?.endDate || new Date(0);
  const isVipActive = role === "MEMBER" && activeUntilDate > new Date();
  const membershipType = isVipActive ? "VIP Member" : "Non-Member";

  return (
    <div className="w-full min-h-full flex flex-col justify-start font-sans bg-transparent">
      {/* Header Sederhana */}
      <header className="bg-gradient-to-br from-emerald-200 via-teal-300 to-emerald-400 px-6 pt-10 pb-8 rounded-b-[2.5rem] shadow-xl shadow-teal-900/10 border-b border-white/60 mb-6 relative overflow-hidden flex items-center justify-between sticky top-0 z-40">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 text-3xl font-extrabold text-slate-900 tracking-tight">Purnama Gym</div>
        <div className="relative z-10 flex items-center gap-4">
          <Link href="/member/profile/notifications" className="text-slate-900 hover:text-slate-700 transition-colors">
            <Bell className="w-6 h-6" />
          </Link>
          <UserButton />
        </div>
      </header>

      <div className="flex-1 px-4 pt-3 pb-28 w-full flex flex-col justify-start gap-4">
        <div className="flex flex-col gap-2">
          {/* Info Penting (Dipindahkan ke Atas) */}
          <section className="mb-2 mt-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-emerald-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-1 text-xs flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-500" /> Info Penting
              </h3>
              <p className="text-slate-600 text-[11px] leading-tight font-medium pl-5">
                Harap selalu tunjukkan QR Masuk kepada kasir saat tiba di lokasi.
              </p>
            </div>
          </section>

          {/* Kartu Keanggotaan Digital */}
          <section>
            <MembershipCard 
              name={membershipType} 
              firstName={user?.firstName?.toUpperCase() || 'MEMBER'}
              role={role} 
              endDate={activeUntilDate} 
            />
          </section>

          {/* Menu Navigasi Cepat (Grid 2x2) */}
          <section className="grid grid-cols-2 gap-2">
            <Link href="/member/qr" className="bg-white aspect-[2/1] rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center gap-1 text-center group">
              <Image src="/icons/qr-code.png" alt="QR Masuk" width={28} height={28} className="object-contain mx-auto mb-0.5 w-7 h-7 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-slate-900 text-[11px]">QR Masuk</div>
            </Link>
            
            <Link href="/member/booking" className="bg-white aspect-[2/1] rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center gap-1 text-center group">
              <Image src="/icons/calendar.png" alt="Booking PT" width={28} height={28} className="object-contain mx-auto mb-0.5 w-7 h-7 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-slate-900 text-[11px]">Booking PT</div>
            </Link>

            {isVipActive ? (
              <div 
                className="aspect-[2/1] rounded-xl border border-gray-300 shadow-sm flex flex-col items-center justify-center gap-1 text-center bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
              >
                <Image src="/icons/vip.png" alt="VIP Aktif" width={28} height={28} className="object-contain mx-auto mb-0.5 w-7 h-7 opacity-50 grayscale" />
                <div className="font-semibold text-[11px] text-gray-500">
                  VIP Aktif
                </div>
              </div>
            ) : (
              <Link 
                href="/member/packages?kategori=vip" 
                className="bg-white aspect-[2/1] rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center gap-1 text-center group"
              >
                <Image src="/icons/vip.png" alt="VIP Membership" width={28} height={28} className="object-contain mx-auto mb-0.5 w-7 h-7 group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-[11px] text-slate-900">
                  VIP Membership
                </div>
              </Link>
            )}

            <Link href="/member/packages?kategori=visit" className="bg-white aspect-[2/1] rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center gap-1 text-center group">
              <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform mb-0.5">
                <Ticket className="w-3.5 h-3.5" />
              </div>
              <div className="font-semibold text-slate-900 text-[11px]">Visit Harian</div>
            </Link>
          </section>

          {/* Tombol Perpanjang Membership */}
          <section>
            {isVipActive ? (
              <div 
                className="flex items-center justify-center w-full py-2 rounded-xl font-bold text-sm shadow-md transition-colors bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
              >
                VIP Aktif
              </div>
            ) : (
              <Link 
                href="/member/packages" 
                className="flex items-center justify-center w-full py-2 rounded-xl font-bold text-sm shadow-md transition-colors bg-slate-900 text-white hover:bg-slate-800"
              >
                Perpanjang Membership
              </Link>
            )}
          </section>

          {/* Aktivitas & Notifikasi (Dipindahkan dari Profil) */}
          <section className="flex flex-col gap-2 mt-2">
            <Link href="/member/profile/history" className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 hover:border-emerald-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <History className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <h4 className="font-semibold text-sm text-slate-900 truncate">Riwayat Transaksi</h4>
                <p className="text-xs text-slate-500 truncate">Lihat pembayaran dan check-in</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
            </Link>


          </section>
        </div>


      </div>
    </div>
  );
}
