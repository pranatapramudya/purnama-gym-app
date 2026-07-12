import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default async function AuthSyncPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect("/sign-in");
  }

  let dbUser = null;
  let retries = 0;
  const maxRetries = 5;

  while (!dbUser && retries < maxRetries) {
    dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id }
    });

    if (!dbUser) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      retries++;
    }
  }

  if (!dbUser) {
    // Timeout waiting for webhook
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 p-4 text-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold mb-2">Sinkronisasi Gagal</h1>
        <p className="text-slate-600 mb-6 max-w-sm">Data akun Anda sedang diproses, namun membutuhkan waktu lebih lama. Silakan muat ulang halaman ini.</p>
        <Link 
          href="/auth-sync" 
          className="px-6 py-2 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition"
        >
          Muat Ulang
        </Link>
      </div>
    );
  }

  // Routing berdasarkan role
  if (dbUser.role === "SUPER_ADMIN" || dbUser.role === "ADMIN_KASIR") {
    redirect("/2026/dashboard");
  } else if (dbUser.role === "TRAINER") {
    redirect("/2026/personal-trainer");
  } else {
    // MEMBER
    if (!dbUser.phoneNumber || !dbUser.address) {
      redirect("/member/onboarding");
    } else {
      redirect("/member/dashboard");
    }
  }
}
