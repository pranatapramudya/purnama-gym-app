import { User, Settings, CreditCard, History, ChevronRight, LogOut, Bell } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import ProfileFormClient from "./ProfileFormClient";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const clerkUser = await currentUser();
  if (!clerkUser) return redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id }
  });

  const memberId = user ? (user.shortId || `M-${user.id.substring(user.id.length - 4).toUpperCase()}`) : "Guest";
  const roleDisplay = user?.role === "MEMBER" ? "VIP Member" : user?.role === "ADMIN_KASIR" ? "Admin" : "Regular Member";

  return (
    <div className="p-4 space-y-6">
      <header className="bg-gradient-to-br from-emerald-200 via-teal-300 to-emerald-400 px-6 pt-10 pb-8 rounded-b-[2.5rem] shadow-xl shadow-teal-900/10 border-b border-white/60 mb-6 relative overflow-hidden -mx-4 -mt-4 flex justify-between items-center">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Profil Saya</h1>
          <p className="text-sm font-medium text-slate-700/90 mt-1.5">Kelola akun dan pengaturan</p>
        </div>
        <button className="relative z-10 w-10 h-10 rounded-full bg-white/20 border border-slate-800/10 flex items-center justify-center text-slate-900 hover:bg-white/30 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shrink-0">
          <User className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-900">{user?.name || clerkUser.firstName || "Member"}</h2>
          <p className="text-sm text-slate-500">{memberId}</p>
          <div className="mt-2 inline-flex items-center px-2 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-md">
            {roleDisplay}
          </div>
        </div>
      </div>

      <ProfileFormClient initialPhoneNumber={user?.phoneNumber || ""} initialAddress={user?.address || ""} />

      <div className="space-y-2 mt-6">
        <h3 className="font-bold text-slate-900 mb-3 px-1">Menu Akun</h3>
        


        <SignOutButton>
          <div className="w-full cursor-pointer bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 hover:border-red-100 transition-colors mt-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-semibold text-sm text-red-600">Keluar (Log Out)</h4>
            </div>
          </div>
        </SignOutButton>
      </div>
    </div>
  );
}
