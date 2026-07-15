import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { role: true, phoneNumber: true, address: true },
    });

    if (dbUser) {
      if (dbUser.role === "SUPER_ADMIN" || dbUser.role === "ADMIN_KASIR") {
        redirect("/2026/dashboard");
      } else if (dbUser.role === "TRAINER") {
        redirect("/2026/personal-trainer");
      } else {
        // Role: MEMBER
        if (!dbUser.phoneNumber || !dbUser.address) {
          redirect("/member/onboarding");
        } else {
          redirect("/member/dashboard");
        }
      }
    } else {
      // User is logged into Clerk but not found in Prisma yet
      redirect("/auth-sync");
    }
  }
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500/30 font-sans flex flex-col">
      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-4 py-4 md:px-12 md:py-6 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-lg md:text-xl tracking-tighter shrink-0">
          <span className="text-slate-900 font-black tracking-tight">PURNAMA GYM</span>
        </div>
        
        <div className="flex flex-row items-center gap-3 md:gap-4 justify-end">
          <div className="flex items-center gap-2 mr-0 md:mr-2">
            <span className="hidden md:inline-block text-sm text-slate-500 font-medium">Sudah punya akun?</span>
            <Link href="/sign-in" className="text-sm font-bold text-slate-800 hover:text-emerald-600 transition-colors">
              Masuk
            </Link>
          </div>
          <div className="flex items-center gap-3 pl-3 md:pl-4 border-l border-slate-200">
            <span className="hidden md:inline-block text-sm text-slate-500 font-medium">Belum punya akun?</span>
            <div className="flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-500 leading-none mb-1 md:hidden font-normal">Belum punya akun?</span>
              <Link href="/sign-up">
                <Button size="sm" className="h-8 md:h-9 bg-emerald-600 text-white hover:bg-emerald-700 rounded-full px-4 md:px-5 font-bold transition-all text-sm shadow-sm cursor-pointer border-0">
                  Daftar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 md:py-32 text-center bg-white">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm text-emerald-700 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium">Khusus Wanita (Women-Only)</span>
        </div>

        <h1 className="max-w-4xl text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1] px-4 md:px-0 break-words">
          Ruang Kebugaran Eksklusif <br className="hidden md:block"/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 italic pr-4 inline-block">
            di Sumedang.
          </span>
        </h1>

        <p className="max-w-2xl text-slate-600 text-lg md:text-xl mb-12 leading-relaxed font-medium">
          Tingkatkan kesehatan dan kepercayaan diri Anda di lingkungan yang aman, nyaman, dan sepenuhnya dirancang khusus untuk privasi wanita.
        </p>



      </main>

      {/* --- FOOTER --- */}
      <footer className="py-8 border-t border-slate-200 text-center bg-slate-50">
        <p className="text-slate-500 text-sm font-medium">
          © <Link href="/2026/sign-in" className="cursor-pointer hover:opacity-80 transition-opacity">{new Date().getFullYear()}</Link> Purnama Gym Sumedang. <br className="md:hidden" />
          Hak cipta dilindungi.
        </p>
      </footer>
    </div>
  );
}