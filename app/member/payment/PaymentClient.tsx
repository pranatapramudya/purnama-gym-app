"use client";

import { Wallet, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState, startTransition } from "react";
import { createTransaction } from "@/app/actions/member";
import { useRouter } from "next/navigation";

interface PaymentData {
  title: string;
  priceStr: string;
  amount: number;
  txType: string;
  isDaily: boolean;
}

export default function PaymentClient({ initialData }: { initialData: PaymentData }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setIsProcessing(true);
    const res = await createTransaction(initialData.txType, initialData.amount, "TUNAI");
    setIsProcessing(false);

    if (res.success) {
      alert("Transaksi berhasil! Menunggu verifikasi admin.");
      startTransition(() => {
        router.push("/member/dashboard");
      });
    } else {
      alert(res.error || "Gagal memproses transaksi");
    }
  };

  const backUrl = initialData.isDaily ? '/member/dashboard' : '/member/packages';

  return (
    <div className="p-4 space-y-6">
      <header className="bg-gradient-to-br from-emerald-200 via-teal-300 to-emerald-400 px-6 pt-10 pb-8 rounded-b-[2.5rem] shadow-xl shadow-teal-900/10 border-b border-white/60 mb-6 relative overflow-hidden -mx-4 -mt-4 flex items-center gap-4">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
        <Link href={backUrl} className="relative z-10 w-10 h-10 rounded-full bg-white/20 border border-slate-800/10 flex items-center justify-center text-slate-900 hover:bg-white/30 transition-colors font-bold text-lg">
          &larr;
        </Link>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-slate-900">Pembayaran</h1>
          <p className="text-sm font-medium text-slate-700/90 mt-1">Selesaikan transaksimu</p>
        </div>
      </header>

      {/* Rincian Tagihan */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          Ringkasan Pesanan
        </h3>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Paket Langganan</span>
            <span className="font-semibold text-slate-900 text-right">{initialData.title}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Masa Aktif</span>
            <span className="font-semibold text-slate-900">{initialData.isDaily ? 'Hari Ini' : 'Sesuai Paket'}</span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-slate-100 border-dashed">
          <span className="font-bold text-slate-900">Total Tagihan</span>
          <span className="text-xl font-extrabold text-rose-500">{initialData.priceStr}</span>
        </div>
      </div>

      {/* Instruksi Pembayaran Kasir */}
      <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-6 text-center shadow-sm">
        <Wallet className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Pembayaran di Kasir</h3>
        <p className="text-sm font-semibold text-rose-700 leading-relaxed">
          Silakan lakukan pembayaran melalui <span className="font-extrabold text-rose-600 uppercase">QRIS</span> atau <span className="font-extrabold text-rose-600 uppercase">TUNAI</span> di meja Kasir dan tunjukkan layar ini kepada petugas.
        </p>
      </div>

      <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-xl border border-amber-100">
        <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 font-medium leading-relaxed">
          Sistem akan mencatat pesanan Anda dengan status PENDING hingga Kasir melakukan verifikasi pembayaran.
        </p>
      </div>

      <button 
        onClick={handlePayment} 
        disabled={isProcessing}
        className="w-full flex justify-center items-center gap-2 bg-slate-900 text-white font-bold text-sm py-4 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-md mt-2 disabled:opacity-50"
      >
        {isProcessing ? "Menyiapkan Pesanan..." : "Buat Pesanan & Bayar di Kasir"}
      </button>
    </div>
  );
}
