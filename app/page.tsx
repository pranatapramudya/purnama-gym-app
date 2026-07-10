import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    // Cek apakah admin
    const { prisma } = await import('@/lib/prisma');
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { role: true },
    });
    
    if (dbUser?.role === 'ADMIN') {
      redirect('/admin/dashboard');
    } else {
      redirect('/member/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-rose-500/30 font-sans flex flex-col">
      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-4 py-4 md:px-12 md:py-6 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-lg md:text-xl tracking-tighter shrink-0">
          <div className="w-8 h-8 bg-gradient-to-tr from-rose-500 to-rose-400 rounded-lg flex items-center justify-center shadow-md">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="text-slate-900 font-black tracking-tight">PURNAMA GYM</span>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          <SignInButton mode="modal" forceRedirectUrl="/member/dashboard">
            <button className="text-xs md:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl="/member/dashboard">
            <Button size="sm" className="bg-rose-500 text-white hover:bg-rose-600 rounded-full px-4 md:px-5 font-bold transition-all text-xs md:text-sm shadow-sm border-0 cursor-pointer">
              Daftar
            </Button>
          </SignUpButton>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 md:py-32 text-center bg-white">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-sm text-rose-600 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="font-medium">Khusus Wanita (Women-Only)</span>
        </div>

        <h1 className="max-w-4xl text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
          Ruang Kebugaran Eksklusif <br className="hidden md:block"/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 italic pr-2">
            di Sumedang.
          </span>
        </h1>

        <p className="max-w-2xl text-slate-600 text-lg md:text-xl mb-12 leading-relaxed font-medium">
          Tingkatkan kesehatan dan kepercayaan diri Anda di lingkungan yang aman, nyaman, dan sepenuhnya dirancang khusus untuk privasi wanita.
        </p>

        {/* --- CTA BUTTONS --- */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center min-h-[60px]">
          <SignUpButton mode="modal" forceRedirectUrl="/member/dashboard">
            <Button size="lg" className="h-14 px-10 bg-rose-500 text-white hover:bg-rose-600 font-bold text-lg rounded-full group transition-all active:scale-95 shadow-lg shadow-rose-500/20 border-0 cursor-pointer">
              Masuk / Daftar Sekarang
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </SignUpButton>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-8 border-t border-slate-200 text-center bg-slate-50">
        <p className="text-slate-500 text-sm font-medium">
          © {new Date().getFullYear()} Purnama Gym Sumedang. <br className="md:hidden" />
          Hak cipta dilindungi.
        </p>
      </footer>
    </div>
  );
}