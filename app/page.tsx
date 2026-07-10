import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500/30 font-sans flex flex-col">
      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-4 py-4 md:px-12 md:py-6 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-lg md:text-xl tracking-tighter shrink-0">
          <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-lg flex items-center justify-center shadow-md">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="text-slate-900 font-black tracking-tight">PURNAMA GYM</span>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/sign-in" className="text-xs md:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer">
            Sign In
          </Link>
          <Link href="/sign-up">
            <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-full px-4 md:px-5 font-bold transition-all text-xs md:text-sm shadow-sm border-0 cursor-pointer">
              Daftar
            </Button>
          </Link>
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

        <h1 className="max-w-4xl text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
          Ruang Kebugaran Eksklusif <br className="hidden md:block"/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 italic pr-2">
            di Sumedang.
          </span>
        </h1>

        <p className="max-w-2xl text-slate-600 text-lg md:text-xl mb-12 leading-relaxed font-medium">
          Tingkatkan kesehatan dan kepercayaan diri Anda di lingkungan yang aman, nyaman, dan sepenuhnya dirancang khusus untuk privasi wanita.
        </p>

        {/* --- CTA BUTTONS --- */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center min-h-[60px]">
          <Link href="/sign-in">
            <Button size="lg" className="h-14 px-10 bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-lg rounded-full group transition-all active:scale-95 shadow-lg shadow-emerald-500/20 border-0 cursor-pointer">
              Masuk / Daftar Sekarang
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-8 border-t border-slate-200 text-center bg-slate-50">
        <p className="text-slate-500 text-sm font-medium">
          © <Link href="/admin/dashboard" className="cursor-pointer hover:opacity-80 transition-opacity">{new Date().getFullYear()}</Link> Purnama Gym Sumedang. <br className="md:hidden" />
          Hak cipta dilindungi.
        </p>
      </footer>
    </div>
  );
}