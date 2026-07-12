import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) return redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id }
  });

  // PRD-v3.52: Bypass onboarding for ADMIN and SUPERADMIN
  if (dbUser?.role === "ADMIN_KASIR" || dbUser?.role === "SUPER_ADMIN") {
    return redirect("/2026/dashboard");
  }

  // If already complete, skip onboarding
  if (dbUser?.phoneNumber && dbUser?.address) {
    return redirect("/member/dashboard");
  }

  return (
    <div className="min-h-[100dvh] bg-slate-100 flex flex-col items-center justify-center p-6 selection:bg-rose-500/30">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <span className="text-white text-2xl font-black tracking-tighter">PG</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Satu Langkah Lagi!</h1>
          <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
            Lengkapi data diri Anda sesuai formulir keanggotaan Purnama Gym untuk melanjutkan.
          </p>
        </div>
        
        <OnboardingForm />
      </div>
    </div>
  );
}
