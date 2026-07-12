"use client";

import { useState } from "react";
import { Users, UserPlus, Search, Shield, Dumbbell, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { NewStaffModal } from "@/components/admin/NewStaffModal";
import { useRouter } from "next/navigation";
import { deleteStaffAccount } from "@/app/actions/superadmin";

type StaffUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  clerkUserId: string;
};

interface StaffClientProps {
  initialStaff: StaffUser[];
  currentUserId: string;
}

export default function StaffClient({ initialStaff, currentUserId }: StaffClientProps) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, clerkId: string, name: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const filteredStaff = initialStaff.filter((staff) => 
    staff.name?.toLowerCase().includes(search.toLowerCase()) || 
    staff.email.toLowerCase().includes(search.toLowerCase()) ||
    staff.role.toLowerCase().includes(search.toLowerCase())
  );

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setDeletingId(deleteConfirm.id);
    
    try {
      const res = await deleteStaffAccount(deleteConfirm.id, deleteConfirm.clerkId);
      if (res.success) {
        setDeleteConfirm(null);
        router.refresh();
      } else {
        alert(res.message || "Gagal menghapus akun");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setDeletingId(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
            <Shield className="w-3 h-3" /> Super Admin
          </span>
        );
      case "ADMIN_KASIR":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
            <Shield className="w-3 h-3" /> Admin Kasir
          </span>
        );
      case "TRAINER":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
            <Dumbbell className="w-3 h-3" /> Trainer
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
            Staff
          </span>
        );
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Karyawan</h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Kelola akses Admin Kasir dan Personal Trainer.
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Karyawan</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, email, atau jabatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-transparent border-none focus:ring-0 outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Staff List Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Karyawan</th>
                <th className="px-6 py-4">Jabatan</th>
                <th className="px-6 py-4">Tanggal Bergabung</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase text-xs shrink-0">
                          {staff.name ? staff.name.substring(0, 2) : staff.email.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{staff.name || "Tanpa Nama"}</p>
                          <p className="text-slate-500 text-xs">{staff.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(staff.role)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-500">
                        {new Date(staff.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {staff.clerkUserId !== currentUserId && (
                        <button
                          onClick={() => setDeleteConfirm({ id: staff.id, clerkId: staff.clerkUserId, name: staff.name || staff.email })}
                          disabled={deletingId === staff.id}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Hapus Karyawan"
                        >
                          {deletingId === staff.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3">
                      <Users className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">Tidak ada data karyawan ditemukan.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewStaffModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          router.refresh();
        }} 
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center text-slate-900 mb-2">Hapus Akses Karyawan?</h3>
            <p className="text-center text-slate-600 text-sm leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus akses <strong>{deleteConfirm.name}</strong> secara permanen? Data kredensial akan dihapus.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deletingId !== null}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  "Ya, Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
