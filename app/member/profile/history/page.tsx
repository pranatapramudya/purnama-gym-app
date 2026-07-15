import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id }
  });

  if (!dbUser) redirect("/sign-in");

  const transactions = await prisma.transaction.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="bg-gradient-to-br from-emerald-200 via-teal-300 to-emerald-400 px-6 pt-10 pb-8 rounded-b-[2.5rem] shadow-xl shadow-teal-900/10 border-b border-white/60 mb-6 relative overflow-hidden -mx-4 -mt-4 flex items-center gap-4">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
        <Link href="/member/dashboard" className="relative z-10 w-10 h-10 rounded-full bg-white/20 border border-slate-800/10 flex items-center justify-center text-slate-900 hover:bg-white/30 transition-colors font-bold text-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-slate-900">Riwayat Transaksi</h1>
          <p className="text-sm font-medium text-slate-700/90 mt-1">Pantau pembayaran Anda</p>
        </div>
      </header>

      {transactions.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Belum Ada Transaksi</h2>
          <p className="text-sm text-slate-500">Anda belum melakukan pembelian visit atau paket membership apa pun.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-900 text-sm mb-1">{tx.type.replace(/_/g, " ")}</div>
                  <div className="text-xs text-slate-500">
                    {new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(tx.createdAt))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-rose-500 text-sm mb-1">
                    Rp {tx.amount.toLocaleString("id-ID")}
                  </div>
                  {tx.status === "SUCCESS" ? (
                    <div className="inline-flex items-center gap-1 bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Berhasil
                    </div>
                  ) : tx.status === "PENDING" ? (
                    <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full text-[10px] font-bold">
                      <Clock className="w-3 h-3" /> Menunggu Verifikasi
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-[10px] font-bold">
                      <AlertCircle className="w-3 h-3" /> Gagal
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
