"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { AdminToast } from "@/components/admin/AdminToast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Plus, Edit2, Trash2, Loader2, Star } from "lucide-react";
import { createMembershipPackage, updateMembershipPackage, deleteMembershipPackage } from "@/app/actions/admin";

interface PackageItem {
  id: string;
  name: string;
  durationMonths: number;
  price: number;
  isPopular: boolean;
  description?: string | null;
  originalPrice?: number | null;
}

export default function PackagesClient({ initialPackages }: { initialPackages: PackageItem[] }) {
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({ visible: false, message: "", type: "success" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDailyModal, setIsDailyModal] = useState(false);
  
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    durationMonths: 1,
    price: 0,
    isPopular: false,
    description: "",
    originalPrice: 0,
    discountPercent: 0,
  });

  const handleOpenModal = (pkg?: PackageItem, isDaily: boolean = false) => {
    setIsDailyModal(isDaily || (pkg?.durationMonths === 0));
    if (pkg) {
      setEditId(pkg.id);
      let discount = 0;
      if (pkg.originalPrice && pkg.originalPrice > pkg.price) {
        discount = Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);
      }

      setFormData({
        name: pkg.name,
        durationMonths: pkg.durationMonths,
        price: pkg.price,
        isPopular: pkg.isPopular,
        description: pkg.description || "",
        originalPrice: pkg.originalPrice || 0,
        discountPercent: discount,
      });
    } else {
      setEditId(null);
      setFormData({ name: isDaily ? "Visit 1 Hari" : "", durationMonths: isDaily ? 0 : 1, price: 0, isPopular: false, description: "", originalPrice: 0, discountPercent: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    let res;
    
    // Kalkulasi Harga Jual Final
    let finalPrice = formData.originalPrice > 0 ? formData.originalPrice : formData.price;
    if (formData.originalPrice > 0 && formData.discountPercent > 0) {
      finalPrice = Math.round(formData.originalPrice - (formData.originalPrice * (formData.discountPercent / 100)));
    }

    // Siapkan data payload dengan mengabaikan nilai opsional jika kosong/0
    const payload = {
      ...formData,
      price: finalPrice,
      description: formData.description.trim() || undefined,
      originalPrice: formData.originalPrice > 0 ? formData.originalPrice : undefined,
    };

    if (editId) {
      res = await updateMembershipPackage(editId, payload);
    } else {
      res = await createMembershipPackage(payload);
    }
    
    setIsSaving(false);
    if (res.success) {
      setToast({ visible: true, message: "Paket berhasil disimpan.", type: "success" });
      setIsModalOpen(false);
    } else {
      setToast({ visible: true, message: res.error || "Gagal menyimpan", type: "error" });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsSaving(true);
    const res = await deleteMembershipPackage(deleteId);
    setIsSaving(false);
    if (res.success) {
      setToast({ visible: true, message: "Paket berhasil dihapus.", type: "success" });
    } else {
      setToast({ visible: true, message: res.error || "Gagal menghapus", type: "error" });
    }
    setDeleteId(null);
  };

  const columns = [
    {
      key: "name",
      label: "Nama Paket",
      render: (item: PackageItem) => (
        <div className="flex items-center gap-2">
          <p className="font-semibold text-slate-900">{item.name}</p>
          {item.isPopular && <Star className="w-4 h-4 text-amber-500 fill-current" />}
        </div>
      ),
    },
    {
      key: "duration",
      label: "Durasi",
      render: (item: PackageItem) => (
        <span className="text-sm text-slate-700">
          {item.durationMonths === 0 ? "Harian" : `${item.durationMonths} Bulan`}
        </span>
      ),
    },
    {
      key: "price",
      label: "Harga",
      render: (item: PackageItem) => (
        <span className="text-sm font-bold text-slate-900">
          Rp {item.price.toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      className: "text-right",
      render: (item: PackageItem) => (
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
        title="Hapus Paket"
        description="Yakin ingin menghapus paket ini? Transaksi yang menggunakan paket ini tidak akan terhapus."
        confirmLabel={isSaving ? "Menghapus..." : "Hapus"}
        cancelLabel="Batal"
        onConfirm={handleDelete}
        onCancel={() => !isSaving && setDeleteId(null)}
        variant="danger"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Paket</h1>
          <p className="text-slate-500 text-sm mt-1">{initialPackages.length} paket tersedia</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenModal(undefined, true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Visit Harian
          </button>
          <button
            onClick={() => handleOpenModal(undefined, false)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-colors shadow-sm shadow-rose-200"
          >
            <Plus className="w-4 h-4" /> Tambah Paket VIP
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={initialPackages} emptyMessage="Belum ada paket" emptyDescription="Tambahkan paket membership pertama Anda." />

      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editId ? "Edit Paket" : (isDailyModal ? "Tambah Visit Harian" : "Tambah Paket VIP")}
              </h2>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Paket</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Misal: VIP 1 Bulan"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm"
                />
              </div>
              {!isDailyModal && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Durasi (Bulan)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={formData.durationMonths ? formData.durationMonths.toString() : ""}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, durationMonths: parseInt(rawValue) || 0 });
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi Paket</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Contoh: Khusus Pelajar, Free Wifi (pisahkan dengan koma)"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm min-h-[80px] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Harga Normal Dasar</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="text-slate-500 text-sm font-medium">Rp</span>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={formData.originalPrice ? formData.originalPrice.toLocaleString("id-ID") : ""}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, originalPrice: parseInt(rawValue) || 0 });
                      }}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Diskon (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min={0}
                      max={100}
                      value={formData.discountPercent === 0 ? "" : formData.discountPercent}
                      onChange={(e) => {
                        const rawVal = e.target.value.replace(',', '.');
                        let val = parseFloat(rawVal);
                        if (isNaN(val)) val = 0;
                        if (val > 100) val = 100;
                        if (val < 0) val = 0;
                        setFormData({ ...formData, discountPercent: val });
                      }}
                      className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <span className="text-slate-500 text-sm font-medium">%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {formData.originalPrice > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Harga Final Jual:</span>
                  <span className="text-sm font-bold text-rose-500">
                    Rp {Math.round(formData.originalPrice - (formData.originalPrice * (formData.discountPercent / 100))).toLocaleString("id-ID")}
                  </span>
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                  className="accent-rose-500 w-4 h-4"
                />
                <span className="text-sm font-medium text-slate-700">Tandai sebagai Best Seller</span>
              </label>

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
