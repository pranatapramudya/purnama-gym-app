"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/DataTable";
import { AdminToast } from "@/components/admin/AdminToast";
import { Search, UserPlus, MoreHorizontal, Shield, Crown, X, Loader2, Plus, Trash2 } from "lucide-react";
import { updateMembership, checkExistingUserByEmail } from "@/app/actions/admin";
import { Role } from "@prisma/client";
import { useResponsivePagination } from "@/hooks/useResponsivePagination";
import { Pagination } from "@/components/ui/Pagination";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  activeUntil: string | null;
  joinDate: string;
  status: string;
  isArchived: boolean;
}

export default function MembersClient({ 
  initialMembers,
  packages
}: { 
  initialMembers: Member[],
  packages: { id: string; name: string; price: number; durationMonths: number }[]
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "ARCHIVED">("ACTIVE");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({ visible: false, message: "", type: "success" });
  const [editModal, setEditModal] = useState<Member | null>(null);
  const [viewModal, setViewModal] = useState<Member | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // States for edit form
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState<Role>("MEMBER");
  const [editEndDate, setEditEndDate] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  
  // States for Add Member
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addAddress, setAddAddress] = useState("");
  const [addRole, setAddRole] = useState<Role>("MEMBER");
  const [isAdding, setIsAdding] = useState(false);

  // Unified Registration & POS State (VIP Packages Only)
  const [addType, setAddType] = useState(packages[0]?.id || "");
  const [addMethod, setAddMethod] = useState("TUNAI");
  const [addAmount, setAddAmount] = useState<number | "">(packages[0]?.price || 0);
  const [addAmountText, setAddAmountText] = useState((packages[0]?.price || 0).toLocaleString("id-ID"));
  const [addDesc, setAddDesc] = useState(`Pembayaran ${packages[0]?.name || "VIP"} via Tunai`);

  useEffect(() => {
    let typeName = "Paket VIP";
    const pkg = packages.find(p => p.id === addType);
    if (pkg) typeName = pkg.name;
    const methodName = addMethod === "TUNAI" ? "Tunai" : "Transfer";
    setAddDesc(`Pembayaran ${typeName} via ${methodName}`);
  }, [addType, addMethod, packages]);

  const handleAddAmountChange = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (!digits) {
      setAddAmount("");
      setAddAmountText("");
      return;
    }
    const num = parseInt(digits, 10);
    setAddAmount(num);
    setAddAmountText(num.toLocaleString("id-ID"));
  };

  const handleAddTypeChange = (val: string) => {
    setAddType(val);
    const pkg = packages.find(p => p.id === val);
    if (pkg) {
      handleAddAmountChange(pkg.price.toString());
      setAddRole(pkg.name.toLowerCase().includes("vip") ? "MEMBER" : "MEMBER");
    }
  };

  const filteredMembers = initialMembers.filter(
    (m) => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === "ACTIVE" ? !m.isArchived : m.isArchived;
      return matchesSearch && matchesTab;
    }
  );

  const { currentPage, totalPages, setCurrentPage, paginatedData } = useResponsivePagination(filteredMembers);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeTab, setCurrentPage]);

  const handleEditProfile = (member: Member) => {
    setEditModal(member);
    setEditName(member.name);
    setEditEmail(member.email);
    setEditPhone(member.phone);
    setEditRole(member.role as Role);
    setEditEndDate(member.activeUntil ? member.activeUntil.split("T")[0] : "");
  };

  const handleSaveProfile = async () => {
    if (!editModal) return;
    setIsSaving(true);
    const res = await updateMembership(editModal.id, {
      role: editRole,
      endDate: editEndDate || null,
      name: editName,
      email: editEmail,
      phone: editPhone
    });
    setIsSaving(false);

    if (res.success) {
      setToast({ visible: true, message: `Profil ${editModal.name} berhasil diperbarui.`, type: "success" });
      setEditModal(null);
    } else {
      setToast({ visible: true, message: res.error || "Gagal memperbarui", type: "error" });
    }
  };

  const handleAddMember = async () => {
    if (!addName || !addEmail || !addAmount) {
      setToast({ visible: true, message: "Nama, Email, dan Nominal wajib diisi.", type: "error" });
      return;
    }
    setIsAdding(true);
    const { createMemberManually } = await import("@/app/actions/admin");
    const res = await createMemberManually({
      name: addName,
      email: addEmail,
      phone: addPhone,
      role: addRole,
      packageId: addType,
      method: addMethod,
      amount: Number(addAmount),
      description: addDesc,
      address: addAddress
    });
    setIsAdding(false);

    if (res.success) {
      setToast({ visible: true, message: `Member VIP berhasil didaftarkan!`, type: "success" });
      setIsAddModalOpen(false);
      setAddName("");
      setAddEmail("");
      setAddPhone("");
      setAddAddress("");
      if (packages.length > 0) {
        setAddType(packages[0].id);
        handleAddAmountChange(packages[0].price.toString());
        setAddRole(packages[0].name.toLowerCase().includes("vip") ? "MEMBER" : "MEMBER");
      }
      router.refresh();
    } else {
      setToast({ visible: true, message: res.error || "Gagal mendaftarkan member", type: "error" });
    }
  };


  const columns = [
    {
      key: "name",
      label: "Nama",
      render: (item: Member, index: number) => (
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-slate-400 font-bold text-sm w-5 text-right shrink-0">#{index + 1}</span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900 text-sm break-words whitespace-normal">{item.name}</p>
            <p className="text-xs text-slate-500 break-words whitespace-normal">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (item: Member) => (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
          item.role === "MEMBER"
            ? "bg-amber-50 text-amber-700"
            : "bg-blue-50 text-blue-700"
        }`}>
          {item.role === "MEMBER" ? (
            <Crown className="w-3 h-3" />
          ) : (
            <Shield className="w-3 h-3" />
          )}
          {item.role === "MEMBER" ? "VIP" : "Regular"}
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
      label: "",
      className: "text-right",
      render: (item: Member) => (
        <div className="flex items-center justify-end h-full">
          <button
            onClick={() => setViewModal(item)}
            className="w-full md:w-auto px-4 py-2 md:px-3 md:py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm md:text-xs font-bold rounded-xl md:rounded-lg transition-colors flex items-center justify-center gap-2 md:gap-1.5 shadow-sm mt-4 md:mt-0"
          >
            🔍 Lihat Profil
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
          <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">Manajemen Member</h1>
          <p className="text-slate-500 text-sm mt-1">{initialMembers.length} member terdaftar.</p>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => {
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-emerald-500/20"
          >
            <UserPlus className="w-4 h-4" />
            Registrasi VIP & Visit Harian
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("ACTIVE")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === "ACTIVE" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            Member Aktif
          </button>
          <button
            onClick={() => setActiveTab("ARCHIVED")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === "ARCHIVED" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            Arsip Member
          </button>
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all text-slate-900"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={paginatedData} emptyMessage="Member tidak ditemukan" emptyDescription="Tidak ada member yang cocok dengan pencarian Anda." />
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Edit Profile Modal */}
      {editModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-[scaleIn_0.25s_ease-out] max-h-[85vh] overflow-y-auto">
            <style>{`
              @keyframes scaleIn {
                from { opacity: 0; transform: scale(0.95); }
                to   { opacity: 1; transform: scale(1); }
              }
            `}</style>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">Edit Profil</h3>
              <button onClick={() => setEditModal(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Telepon</label>
                <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300" />
              </div>
            </div>

            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role Membership</label>
            <div className="space-y-2 mb-4">
              {["MEMBER", "TRAINER", "ADMIN_KASIR"].map((role) => (
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
                    <p className="text-sm font-semibold text-slate-900">{role === "MEMBER" ? "Member" : role === "TRAINER" ? "Personal Trainer" : "Kasir"}</p>
                    <p className="text-xs text-slate-500">
                      {role === "MEMBER" ? "Akses gym standar" : role === "TRAINER" ? "Akses trainer" : "Akses admin kasir"}
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
              <button onClick={handleSaveProfile} disabled={isSaving} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Biodata Modal */}
      {viewModal && (
        <div className="fixed inset-0 z-[80] flex items-end md:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewModal(null)} />
          <div className="relative bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full max-w-md p-6 animate-[slideUp_0.25s_ease-out] md:animate-[scaleIn_0.25s_ease-out] max-h-[90vh] overflow-y-auto">
            <style>{`
              @keyframes slideUp {
                from { opacity: 0; transform: translateY(100%); }
                to   { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-extrabold text-slate-900">Biodata Member</h3>
              <button onClick={() => setViewModal(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-slate-500 mb-0.5">Nama Lengkap</p>
                  <p className="text-sm font-bold text-slate-900">{viewModal.name}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-slate-500 mb-0.5">Email</p>
                  <p className="text-sm font-bold text-slate-900">{viewModal.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-0.5">Nomor Telepon</p>
                  <p className="text-sm font-bold text-slate-900">{viewModal.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-0.5">Status Member</p>
                  <div className="mt-0.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      viewModal.role === "MEMBER" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {viewModal.role === "MEMBER" ? "VIP" : "Regular"}
                    </span>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-slate-500 mb-0.5">Alamat</p>
                  <p className="text-sm font-bold text-slate-900">{viewModal.address}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-slate-500 mb-0.5">Masa Aktif</p>
                  <p className="text-sm font-bold text-slate-900">
                    {viewModal.activeUntil ? new Date(viewModal.activeUntil).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setViewModal(null);
                  handleEditProfile(viewModal);
                }} 
                className="flex-1 px-4 py-3 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Edit Data
              </button>
              <button 
                onClick={() => {
                  setViewModal(null);
                  setMemberToDelete(viewModal);
                }} 
                className={`flex-1 px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${viewModal.isArchived ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100" : "text-amber-600 bg-amber-50 hover:bg-amber-100"}`}
              >
                {viewModal.isArchived ? "Pulihkan Member" : "Arsipkan Member"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal (Unified Registration & POS) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-[scaleIn_0.25s_ease-out] max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-extrabold text-slate-900">Registrasi VIP & Visit Harian</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kolom Kiri: Data Diri */}
              <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-3">1. Data Diri Member</h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                  <input type="text" value={addName} onChange={e => setAddName(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 text-slate-900" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                  <input type="email" value={addEmail} onChange={e => setAddEmail(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 text-slate-900" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Telepon (Opsional)</label>
                  <input type="tel" value={addPhone} onChange={e => setAddPhone(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat (Opsional)</label>
                  <textarea value={addAddress} onChange={e => setAddAddress(e.target.value)} rows={2} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 text-slate-900" />
                </div>
              </div>

              {/* Kolom Kanan: Pembayaran */}
              <div className="space-y-3 bg-emerald-50/30 p-4 rounded-xl border border-emerald-100">
                <h4 className="font-semibold text-slate-800 border-b border-emerald-200 pb-2 mb-3">2. Paket & Pembayaran</h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Paket Membership</label>
                  <select 
                    value={addType} 
                    onChange={e => handleAddTypeChange(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
                  >
                    {packages.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.durationMonths} Bulan) - {p.name.toLowerCase().includes("vip") ? "VIP" : "Regular"}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nominal Pembayaran</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 font-semibold text-sm">Rp</span>
                    <input 
                      type="text" 
                      value={addAmountText} 
                      onChange={e => handleAddAmountChange(e.target.value)}
                      readOnly={true}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm font-bold transition-colors bg-slate-100 text-slate-600 cursor-not-allowed focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Metode Pembayaran</label>
                  <select 
                    value={addMethod} 
                    onChange={e => setAddMethod(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
                  >
                    <option value="TUNAI">💵 Tunai</option>
                    <option value="TRANSFER">🏦 Transfer Bank</option>
                    <option value="QRIS">📱 QRIS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Keterangan Transaksi</label>
                  <input 
                    type="text" 
                    value={addDesc} 
                    readOnly
                    className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-5 border-t border-slate-100">
              <button onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-3 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                Batal
              </button>
              <button onClick={handleAddMember} disabled={isAdding} className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50">
                {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : "Proses & Bayar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive/Restore Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isDeleting && setMemberToDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-[scaleIn_0.25s_ease-out]">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${memberToDelete.isArchived ? "bg-emerald-100" : "bg-amber-100"}`}>
                {memberToDelete.isArchived ? <Plus className="w-6 h-6 text-emerald-600" /> : <Trash2 className="w-6 h-6 text-amber-600" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{memberToDelete.isArchived ? "Pulihkan Member?" : "Arsipkan Member?"}</h3>
                <p className="text-sm font-semibold text-slate-700 truncate">{memberToDelete.name}</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              {memberToDelete.isArchived 
                ? "Apakah Anda yakin ingin memulihkan member ini? Member akan kembali muncul di daftar aktif."
                : "Apakah Anda yakin ingin mengarsipkan member ini? Data transaksi tidak akan terhapus, namun member akan disembunyikan dari daftar aktif."}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setMemberToDelete(null)} 
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={async () => {
                  setIsDeleting(true);
                  const { deleteMembership, restoreMembership } = await import("@/app/actions/admin");
                  const res = memberToDelete.isArchived 
                    ? await restoreMembership(memberToDelete.id) 
                    : await deleteMembership(memberToDelete.id);
                  setIsDeleting(false);
                  if (res.success) {
                    setToast({ visible: true, message: `Member berhasil ${memberToDelete.isArchived ? "dipulihkan" : "diarsipkan"}.`, type: "success" });
                    setMemberToDelete(null);
                    router.refresh();
                  } else {
                    setToast({ visible: true, message: res.error || "Gagal memproses member", type: "error" });
                  }
                }} 
                disabled={isDeleting}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl transition-colors shadow-sm disabled:opacity-50 ${memberToDelete.isArchived ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-500 hover:bg-amber-600"}`}
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : (memberToDelete.isArchived ? "Yakin Pulihkan" : "Yakin Arsipkan")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
