"use client";

import { useState } from "react";
import { X, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { createStaffAccount } from "@/app/actions/superadmin";

interface NewStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewStaffModal({ isOpen, onClose, onSuccess }: NewStaffModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState<{ email?: string; password?: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "ADMIN_KASIR" as "ADMIN_KASIR" | "TRAINER",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await createStaffAccount(formData);
      if (res.success) {
        setSuccessData({ email: res.email, password: res.password });
        onSuccess();
      } else {
        setError(res.message || "Terjadi kesalahan saat membuat akun.");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (successData?.email && successData?.password) {
      const text = `Email: ${successData.email}\nPassword: ${successData.password}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetAndClose = () => {
    setSuccessData(null);
    setFormData({ name: "", email: "", role: "ADMIN_KASIR" });
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {successData ? "Akun Berhasil Dibuat!" : "Tambah Karyawan Baru"}
          </h2>
          {!successData && (
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {successData ? (
            <div className="space-y-6">
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-emerald-800 font-medium leading-relaxed">
                      Simpan kredensial ini dan berikan kepada karyawan. Sandi ini hanya ditampilkan satu kali ini saja!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                  <p className="font-mono text-sm text-slate-800 mt-1">{successData.email}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kata Sandi (Sementara)</label>
                  <p className="font-mono text-sm font-bold text-slate-800 mt-1 tracking-widest">{successData.password}</p>
                </div>
                
                <button
                  onClick={handleCopy}
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg text-sm font-semibold transition-all"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Tersalin!" : "Copy Kredensial"}
                </button>
              </div>

              <button
                onClick={resetAndClose}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 transition-all"
              >
                Tutup
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2 border border-red-100">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all outline-none text-sm text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Email Aktif</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, email: val });
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(val) && val.length > 0) {
                      setEmailError("Format email tidak valid.");
                    } else {
                      setEmailError("");
                    }
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border transition-all outline-none text-sm text-slate-900 ${emailError ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'}`}
                />
                {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Pilih Jabatan (Role)</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all outline-none text-sm bg-white"
                >
                  <option value="ADMIN_KASIR">Admin Kasir</option>
                  <option value="TRAINER">Personal Trainer</option>
                </select>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
                <p className="text-xs text-amber-800 flex gap-2 leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Kata sandi akan di-generate otomatis oleh sistem dan hanya akan ditampilkan satu kali setelah pembuatan berhasil.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !!emailError}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-rose-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Buat Akun Karyawan"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
