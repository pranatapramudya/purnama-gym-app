"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { AdminToast } from "@/components/admin/AdminToast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Plus, Edit2, Trash2, Loader2, PlayCircle, ExternalLink } from "lucide-react";
import { createGuideVideo, updateGuideVideo, deleteGuideVideo } from "@/app/actions/admin";
import Link from "next/link";

interface GuideItem {
  id: string;
  title: string;
  url: string;
  category: string;
}

export default function GuidesClient({ initialGuides }: { initialGuides: GuideItem[] }) {
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as "success" | "error" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    category: "Latihan Dasar",
  });

  const handleOpenModal = (guide?: GuideItem) => {
    if (guide) {
      setEditId(guide.id);
      setFormData({
        title: guide.title,
        url: guide.url,
        category: guide.category,
      });
    } else {
      setEditId(null);
      setFormData({ title: "", url: "", category: "Latihan Dasar" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let res;
    if (editId) {
      res = await updateGuideVideo(editId, formData);
    } else {
      res = await createGuideVideo(formData);
    }

    setIsSaving(false);
    if (res.success) {
      setToast({ visible: true, message: "Video panduan berhasil disimpan.", type: "success" });
      setIsModalOpen(false);
    } else {
      setToast({ visible: true, message: res.error || "Gagal menyimpan", type: "error" });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsSaving(true);
    const res = await deleteGuideVideo(deleteId);
    setIsSaving(false);
    if (res.success) {
      setToast({ visible: true, message: "Video panduan berhasil dihapus.", type: "success" });
    } else {
      setToast({ visible: true, message: res.error || "Gagal menghapus", type: "error" });
    }
    setDeleteId(null);
  };

  const columns = [
    {
      key: "title",
      label: "Judul Video",
      render: (item: GuideItem) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
            <PlayCircle className="w-4 h-4" />
          </div>
          <p className="font-semibold text-slate-900">{item.title}</p>
        </div>
      ),
    },
    {
      key: "category",
      label: "Kategori",
      render: (item: GuideItem) => (
        <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
          {item.category}
        </span>
      ),
    },
    {
      key: "url",
      label: "Link YouTube",
      render: (item: GuideItem) => (
        <Link href={item.url} target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
          Buka Video <ExternalLink className="w-3 h-3" />
        </Link>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      className: "text-right",
      render: (item: GuideItem) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => handleOpenModal(item)} className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => setDeleteId(item.id)} className="p-2 bg-rose-50 rounded-lg text-rose-600 hover:bg-rose-100">
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
        open={!!deleteId}
        title="Hapus Video"
        description="Yakin ingin menghapus video panduan ini dari daftar?"
        confirmLabel={isSaving ? "Menghapus..." : "Hapus"}
        cancelLabel="Batal"
        onConfirm={handleDelete}
        onCancel={() => !isSaving && setDeleteId(null)}
        variant="danger"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Panduan</h1>
          <p className="text-slate-500 text-sm mt-1">{initialGuides.length} video tersedia</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-colors shadow-sm shadow-rose-200"
        >
          <Plus className="w-4 h-4" /> Tambah Video
        </button>
      </div>

      <DataTable columns={columns} data={initialGuides} emptyMessage="Belum ada video" emptyDescription="Tambahkan link YouTube panduan pertama Anda." />

      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">{editId ? "Edit Video" : "Tambah Video"}</h2>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul Video</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Misal: Latihan Dumbbell Pemula"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Misal: Kekuatan Tubuh"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Link YouTube</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-rose-500 rounded-xl hover:bg-rose-600 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
