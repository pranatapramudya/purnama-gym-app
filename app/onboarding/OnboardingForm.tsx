"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/app/actions/member";
import { useRouter } from "next/navigation";
import { Loader2, Phone, MapPin } from "lucide-react";

export default function OnboardingForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !address) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    
    setError("");
    const res = await updateProfile({ phoneNumber, address });
    
    if (res.success) {
      startTransition(() => {
        router.push("/member/dashboard");
      });
    } else {
      setError(res.error || "Gagal menyimpan data. Silakan coba lagi.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold flex items-center gap-2">
          {error}
        </div>
      )}
      
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <Phone className="w-4 h-4 text-slate-400" />
          Nomor HP (WhatsApp)
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Contoh: 081234567890"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all"
        />
      </div>
      
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          Alamat Lengkap
        </label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Masukkan alamat domisili lengkap..."
          rows={3}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-md mt-6"
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan & Lanjutkan"}
      </button>
    </form>
  );
}
