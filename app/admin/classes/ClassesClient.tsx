"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { AdminToast, ToastType } from "@/components/admin/AdminToast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Plus, Trash2, Edit2, Users, X, Loader2 } from "lucide-react";
import { createGymClass, deleteGymClass } from "@/app/actions/admin";

interface GymClassItem {
  id: string;
  name: string;
  description: string;
  category: string;
  schedule: string;
  capacity: number;
  booked: number;
}

export default function ClassesClient({ initialClasses }: { initialClasses: GymClassItem[] }) {
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as ToastType });
  const [deleteTarget, setDeleteTarget] = useState<GymClassItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Umum",
    date: "",
    time: "",
    capacity: 25,
  });

  const handleOpenModal = (classItem?: GymClassItem) => {
    if (classItem) {
      setEditId(classItem.id);
      const d = new Date(classItem.schedule);
      setFormData({
        name: classItem.name,
        description: classItem.description,
        category: classItem.category,
        date: classItem.schedule.split("T")[0],
        time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        capacity: classItem.capacity,
      });
    } else {
      setEditId(null);
      setFormData({ name: "", description: "", category: "Umum", date: "", time: "", capacity: 25 });
    }
    setIsModalOpen(true);
  };

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ visible: true, message, type });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteGymClass(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      showToast(`Sesi PT "${deleteTarget.name}" berhasil dihapus.`, "success");
      setDeleteTarget(null);
      setIsDeleteDialogOpen(false);
    } else {
      showToast(res.error || "Gagal menghapus sesi PT", "error");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.time) {
      showToast("Lengkapi data sesi PT terlebih dahulu", "error");
      return;
    }

    setIsAdding(true);
    const schedule = new Date(`${formData.date}T${formData.time}:00`);
    
    let res;
    if (editId) {
      const { updateGymClass } = await import("@/app/actions/admin");
      res = await updateGymClass(editId, {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        schedule: schedule.toISOString(),
        capacity: Number(formData.capacity),
      });
    } else {
      res = await createGymClass({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        schedule: schedule.toISOString(),
        capacity: Number(formData.capacity),
      });
    }
    
    setIsAdding(false);

    if (res.success) {
      showToast(`Sesi PT berhasil ${editId ? 'diperbarui' : 'ditambahkan'}.`, "success");
      setIsModalOpen(false);
    } else {
      showToast(res.error || "Gagal menyimpan sesi PT", "error");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Nama PT",
      render: (item: GymClassItem) => (
        <div>
          <div className="inline-block px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded mb-1">
            {item.category}
          </div>
          <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
        </div>
      ),
    },
    {
      key: "schedule",
      label: "Jadwal",
      render: (item: GymClassItem) => {
        const date = new Date(item.schedule);
        return (
          <div>
            <p className="text-sm font-medium text-slate-800">
              {date.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}
            </p>
            <p className="text-xs text-slate-500">
              {date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"}
            </p>
          </div>
        );
      },
    },
    {
      key: "capacity",
      label: "Kapasitas",
      render: (item: GymClassItem) => {
        const percentage = Math.round((item.booked / item.capacity) * 100);
        const isFull = percentage >= 90;
        return (
          <div className="min-w-[120px]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-sm font-medium text-slate-800">{item.booked}/{item.capacity}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isFull ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                {percentage}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isFull ? "bg-red-400" : "bg-emerald-400"}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Aksi",
      className: "text-right",
      render: (item: GymClassItem) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleOpenModal(item)}
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setDeleteTarget(item); setIsDeleteDialogOpen(true); }}
            className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
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

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Sesi PT"
        description={`Apakah Anda yakin ingin menghapus jadwal PT ini? Semua booking terkait juga akan dihapus. Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Hapus"
        variant="danger"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Jadwal PT</h1>
          <p className="text-slate-500 text-sm mt-1">{initialClasses.length} sesi PT terjadwal.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          Tambah Jadwal PT Baru
        </button>
      </div>

      <DataTable columns={columns} data={initialClasses} />

      {isModalOpen && (
        <div className="fixed inset-0 z-[80]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">{editId ? "Edit Sesi PT" : "Tambah Jadwal PT Baru"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori</label>
                <input 
                  type="text" 
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Sesi</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Personal Training..." 
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Deskripsi singkat sesi PT..." 
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none h-20"
                />
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal</label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jam</label>
                    <input 
                      type="time" 
                      value={formData.time}
                      onChange={e => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all" 
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kapasitas</label>
                <input 
                  type="number" 
                  value={formData.capacity}
                  onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  min={1} 
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all" 
                />
              </div>
            </form>

            <div className="flex gap-3 px-6 py-5 border-t border-slate-200">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                Batal
              </button>
              <button 
                type="submit" 
                onClick={handleSave}
                disabled={isAdding}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center min-w-[120px]"
              >
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Jadwal PT"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
