"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/member";
import { Loader2, Phone, MapPin } from "lucide-react";

interface ProfileFormProps {
  initialPhoneNumber: string;
  initialAddress: string;
}

export default function ProfileFormClient({ initialPhoneNumber, initialAddress }: ProfileFormProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || "");
  const [address, setAddress] = useState(initialAddress || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const res = await updateProfile({ phoneNumber, address });
    
    setIsSaving(false);
    if (res.success) {
      setMessage({ text: "Profil berhasil diperbarui!", type: "success" });
      setIsEditing(false);
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ text: res.error || "Gagal memperbarui profil", type: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mt-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-slate-900">Lengkapi Profil</h3>
      </div>
      
      {message && (
        <div className={`p-3 rounded-xl text-sm font-semibold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
            <Phone className="w-4 h-4 text-slate-400" />
            Nomor HP
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="081234567890"
            disabled={!isEditing}
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
              !isEditing ? "border-transparent text-slate-600 bg-slate-100/50 cursor-not-allowed" : "border-slate-200 text-slate-900 placeholder:text-slate-400"
            }`}
          />
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
            <MapPin className="w-4 h-4 text-slate-400" />
            Alamat
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Alamat lengkap..."
            rows={3}
            disabled={!isEditing}
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
              !isEditing ? "border-transparent text-slate-600 bg-slate-100/50 cursor-not-allowed" : "border-slate-200 text-slate-900 placeholder:text-slate-400"
            }`}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        {!isEditing ? (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 font-bold rounded-xl transition-colors"
          >
            Edit Profil
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => { 
              e.preventDefault(); 
              setIsEditing(false); 
              setPhoneNumber(initialPhoneNumber || ""); 
              setAddress(initialAddress || ""); 
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-xl transition-colors"
          >
            Batal
          </button>
        )}
        
        <button
          type="submit"
          disabled={!isEditing || isSaving}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 font-bold rounded-xl transition-colors ${
            !isEditing 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50"
          }`}
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (!isEditing ? "Selesai" : "Simpan Profil")}
        </button>
      </div>
    </form>
  );
}
