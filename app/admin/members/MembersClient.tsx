"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { AdminToast } from "@/components/admin/AdminToast";
import { Search, UserPlus, MoreHorizontal, Shield, Crown, X, Loader2 } from "lucide-react";
import { updateMembership } from "@/app/actions/admin";
import { Role } from "@prisma/client";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  activeUntil: string | null;
  joinDate: string;
  status: string;
}

export default function MembersClient({ initialMembers }: { initialMembers: Member[] }) {
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({ visible: false, message: "", type: "success" });
  const [editModal, setEditModal] = useState<Member | null>(null);
  
  // States for edit form
  const [editRole, setEditRole] = useState<Role>("MEMBER_REGULAR");
  const [editEndDate, setEditEndDate] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const filteredMembers = initialMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditRole = (member: Member) => {
    setEditModal(member);
    setEditRole(member.role as Role);
    setEditEndDate(member.activeUntil ? member.activeUntil.split("T")[0] : "");
  };

  const handleSaveRole = async () => {
    if (!editModal) return;
    setIsSaving(true);
    const res = await updateMembership(editModal.id, {
      role: editRole,
      endDate: editEndDate || null,
    });
    setIsSaving(false);

    if (res.success) {
      setToast({ visible: true, message: `Membership ${editModal.name} berhasil diperbarui.`, type: "success" });
      setEditModal(null);
    } else {
      setToast({ visible: true, message: res.error || "Gagal memperbarui", type: "error" });
    }
  };

  const columns = [
    {
      key: "name",
      label: "Nama",
      render: (item: Member) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
            <p className="text-xs text-slate-500">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (item: Member) => (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
          item.role === "MEMBER_VIP"
            ? "bg-amber-50 text-amber-700"
            : "bg-blue-50 text-blue-700"
        }`}>
          {item.role === "MEMBER_VIP" ? (
            <Crown className="w-3 h-3" />
          ) : (
            <Shield className="w-3 h-3" />
          )}
          {item.role === "MEMBER_VIP" ? "VIP" : "Regular"}
        </span>
      ),
    },
    {
      key: "activeUntil",
      label: "Aktif Sampai",
      render: (item: Member) => {
        if (!item.activeUntil) return <span className="text-sm text-slate-400">-</span>;
        const isExpiring = new Date(item.activeUntil) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const isExpired = new Date(item.activeUntil) < new Date();
        return (
          <span className={`text-sm font-medium ${isExpired ? "text-slate-400 line-through" : isExpiring ? "text-red-600" : "text-slate-700"}`}>
            {new Date(item.activeUntil).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        );
      },
    },
    {
      key: "joinDate",
      label: "Bergabung",
      render: (item: Member) => (
        <span className="text-sm text-slate-500">
          {new Date(item.joinDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      className: "text-right",
      render: (item: Member) => (
        <div className="flex justify-end">
          <button
            onClick={() => handleEditRole(item)}
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <AdminToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onDismiss={() => setToast((s) => ({ ...s, visible: false }))}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Member</h1>
          <p className="text-slate-500 text-sm mt-1">{initialMembers.length} member terdaftar.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all"
        />
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={filteredMembers} emptyMessage="Member tidak ditemukan" emptyDescription="Tidak ada member yang cocok dengan pencarian Anda." />

      {/* Edit Role Modal */}
      {editModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-[scaleIn_0.25s_ease-out]">
            <style>{`
              @keyframes scaleIn {
                from { opacity: 0; transform: scale(0.95); }
                to   { opacity: 1; transform: scale(1); }
              }
            `}</style>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">Edit Role</h3>
              <button onClick={() => setEditModal(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Ubah role untuk <span className="font-semibold text-slate-900">{editModal.name}</span>
            </p>
            <div className="space-y-2 mb-4">
              {["MEMBER_REGULAR", "MEMBER_VIP"].map((role) => (
                <label
                  key={role}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    editRole === role
                      ? "border-rose-500 bg-rose-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => setEditRole(role as Role)}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={editRole === role}
                    onChange={() => setEditRole(role as Role)}
                    className="accent-rose-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{role === "MEMBER_VIP" ? "VIP Member" : "Regular Member"}</p>
                    <p className="text-xs text-slate-500">
                      {role === "MEMBER_VIP" ? "Akses penuh + sesi PT premium" : "Akses standar"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Masa Aktif Sampai</label>
              <input 
                type="date" 
                value={editEndDate}
                onChange={(e) => setEditEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all" 
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setEditModal(null)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                Batal
              </button>
              <button onClick={handleSaveRole} disabled={isSaving} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
