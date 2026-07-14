"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Download, Plus, ArrowUpCircle, ArrowDownCircle, Banknote, Calendar, ImageIcon, Pencil, Trash } from "lucide-react";
import { useResponsivePagination } from "@/hooks/useResponsivePagination";
import { Pagination } from "@/components/ui/Pagination";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useSearchParams } from "next/navigation";
import { updateCashflow, deleteCashflow, uploadToCloudinary } from "../../actions/cashflow";

type CashFlowData = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string;
  buktiKwitansi?: string | null;
  adminName: string;
  createdAt: string;
};

type Props = {
  initialData: CashFlowData[];
  adminId: string;
  userRole: string;
};

export default function CashflowClient({ initialData, adminId, userRole }: Props) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const searchParams = useSearchParams();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [type, setType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [buktiBase64, setBuktiBase64] = useState<string | null>(null);

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState("");

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  // View Image State
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const { currentPage, itemsPerPage, totalPages, setCurrentPage, paginatedData } = useResponsivePagination(data);

  useEffect(() => {
    setCurrentPage(1);
    setData(initialData);
  }, [initialData, setCurrentPage]);

  const totalIncome = data.filter(d => d.type === "INCOME").reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = data.filter(d => d.type === "EXPENSE").reduce((acc, curr) => acc + curr.amount, 0);
  const netTotal = totalIncome - totalExpense;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setBuktiBase64(compressedDataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      setBuktiBase64(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let buktiKwitansi = null;
      if (type === "EXPENSE" && buktiBase64) {
        const uploadRes = await uploadToCloudinary(buktiBase64);
        if (uploadRes.error) throw new Error(uploadRes.error);
        buktiKwitansi = uploadRes.secureUrl;
      }

      const res = await fetch("/api/cashflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, amount: Number(amount), description, adminId, buktiKwitansi })
      });
      
      if (res.ok) {
        const newItem = await res.json();
        setData([newItem, ...data]);
        setIsModalOpen(false);
        setAmount("");
        setDescription("");
        setBuktiBase64(null);
        router.refresh();
      } else {
        alert("Gagal menyimpan data.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Gagal mengunggah bukti kwitansi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await updateCashflow(editId, Number(amount), description);
      if (res.error) {
        alert(res.error);
      } else {
        setData(data.map(item => item.id === editId ? { ...item, amount: Number(amount), description } : item));
        setIsEditModalOpen(false);
        router.refresh();
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const res = await deleteCashflow(deleteId, userRole);
      if (res.error) {
        alert(res.error);
      } else {
        setData(data.filter(item => item.id !== deleteId));
        setIsDeleteModalOpen(false);
        router.refresh();
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (item: CashFlowData) => {
    setEditId(item.id);
    setAmount(item.amount.toString());
    setDescription(item.description);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Buku Kas</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola arus kas (Uang Masuk / Keluar) Purnama Gym.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              window.location.href = `/api/export-cashflow?from=${searchParams.get('from') || ''}&to=${searchParams.get('to') || ''}`;
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Unduh Excel
          </button>
          <button
            onClick={() => {
              setType("INCOME");
              setAmount("");
              setDescription("");
              setBuktiBase64(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Catat Transaksi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <ArrowUpCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Pemasukan (Uang Masuk)</p>
            <p className="text-xl font-bold text-slate-900">Rp {totalIncome.toLocaleString('id-ID')}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
            <ArrowDownCircle className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Pengeluaran (Uang Keluar)</p>
            <p className="text-xl font-bold text-slate-900">Rp {totalExpense.toLocaleString('id-ID')}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Banknote className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Saldo Bersih (Net)</p>
            <p className={`text-xl font-bold ${netTotal < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              Rp {netTotal.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h3 className="font-semibold text-slate-800">Riwayat Transaksi</h3>
          <div className="w-full sm:w-auto flex-shrink-0">
            <DateRangePicker />
          </div>
        </div>
        
        <div className="w-full rounded-lg border border-slate-100 overflow-x-auto">
          <table className="w-full text-left border-collapse block md:table">
            <thead className="hidden md:table-header-group">
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">NO</th>
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium">Tipe</th>
                <th className="px-6 py-4 font-medium">Keterangan</th>
                <th className="px-6 py-4 font-medium">Kasir</th>
                <th className="px-6 py-4 font-medium text-right">Nominal</th>
                <th className="px-6 py-4 font-medium text-center">Bukti</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 block md:table-row-group">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => {
                  const displayIndex = (currentPage - 1) * itemsPerPage + index + 1;
                  return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors block md:table-row mb-4 border border-slate-200 rounded-xl bg-white p-2 md:p-0 shadow-sm md:shadow-none md:mb-0 md:border-none md:rounded-none">
                    <td className="px-3 py-2.5 md:px-6 md:py-4 whitespace-nowrap text-sm text-slate-500 font-medium flex justify-between items-center block md:table-cell border-b border-slate-100 md:border-none">
                      <span className="md:hidden text-xs font-bold text-slate-500">NO:</span>
                      <span>{displayIndex}</span>
                    </td>
                    <td className="px-3 py-2.5 md:px-6 md:py-4 whitespace-nowrap text-sm text-slate-600 flex justify-between items-center block md:table-cell border-b border-slate-100 md:border-none last:border-none">
                      <span className="md:hidden text-xs font-bold text-slate-500">Tanggal:</span>
                      <span>{new Date(item.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</span>
                    </td>
                    <td className="px-3 py-2.5 md:px-6 md:py-4 whitespace-nowrap flex justify-between items-center block md:table-cell border-b border-slate-100 md:border-none last:border-none">
                      <span className="md:hidden text-xs font-bold text-slate-500">Tipe:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        item.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {item.type === 'INCOME' ? 'Masuk' : 'Keluar'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 md:px-6 md:py-4 text-sm text-slate-800 font-medium flex justify-between items-center block md:table-cell border-b border-slate-100 md:border-none last:border-none">
                      <span className="md:hidden text-xs font-bold text-slate-500 whitespace-nowrap mr-4">Keterangan:</span>
                      <span className="text-right md:text-left">{item.description}</span>
                    </td>
                    <td className="px-3 py-2.5 md:px-6 md:py-4 whitespace-nowrap text-sm text-slate-500 flex justify-between items-center block md:table-cell border-b border-slate-100 md:border-none last:border-none">
                      <span className="md:hidden text-xs font-bold text-slate-500">Kasir:</span>
                      <span>{item.adminName}</span>
                    </td>
                    <td className={`px-3 py-2.5 md:px-6 md:py-4 whitespace-nowrap text-sm font-bold flex justify-between items-center block md:table-cell border-b border-slate-100 md:border-none last:border-none md:text-right ${
                      item.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      <span className="md:hidden text-xs font-bold text-slate-500 text-left">Nominal:</span>
                      <span>{item.type === 'INCOME' ? '+' : '-'} Rp {item.amount.toLocaleString('id-ID')}</span>
                    </td>
                    <td className="px-3 py-2.5 md:px-6 md:py-4 whitespace-nowrap flex justify-between items-center block md:table-cell border-b border-slate-100 md:border-none last:border-none text-center">
                      <span className="md:hidden text-xs font-bold text-slate-500 text-left">Bukti:</span>
                      {item.buktiKwitansi ? (
                        <button
                          onClick={() => {
                            setSelectedImage(item.buktiKwitansi!);
                            setIsImageModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-lg transition-colors mx-auto"
                        >
                          <ImageIcon className="w-3.5 h-3.5" /> Lihat
                        </button>
                      ) : (
                        <span className="text-slate-300 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 md:px-6 md:py-4 whitespace-nowrap flex justify-between items-center block md:table-cell border-b border-slate-100 md:border-none last:border-none text-center">
                      <span className="md:hidden text-xs font-bold text-slate-500 text-left">Aksi:</span>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {userRole === 'SUPER_ADMIN' && (
                          <button
                            onClick={() => openDeleteModal(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )})
              ) : (
                <tr className="block md:table-row">
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500 text-sm block md:table-cell">
                    Belum ada catatan arus kas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Catat Transaksi Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">Catat Transaksi Baru</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipe Transaksi</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType("INCOME")}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border ${
                      type === "INCOME" 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold' 
                        : 'border-slate-200 bg-white text-slate-600 font-medium hover:bg-slate-50'
                    }`}
                  >
                    <ArrowUpCircle className="w-4 h-4" /> Uang Masuk
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("EXPENSE")}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border ${
                      type === "EXPENSE" 
                        ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' 
                        : 'border-slate-200 bg-white text-slate-600 font-medium hover:bg-slate-50'
                    }`}
                  >
                    <ArrowDownCircle className="w-4 h-4" /> Uang Keluar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nominal (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors font-medium text-slate-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Keterangan</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Beli air minum / Pembayaran member baru"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors resize-none h-24 text-sm"
                />
              </div>

              {type === "EXPENSE" && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bukti Kwitansi (Opsional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  {buktiBase64 && (
                    <div className="mt-3">
                      <img src={buktiBase64} alt="Preview" className="h-32 object-contain rounded-lg border border-slate-200" />
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 flex gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70 flex justify-center items-center gap-2 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      {type === "EXPENSE" && buktiBase64 ? "Mengunggah Bukti..." : "Menyimpan..."}
                    </>
                  ) : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Edit Transaksi</h2>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nominal (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium text-slate-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Keterangan</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none h-24 text-sm"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
              <Trash className="w-6 h-6 text-rose-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Hapus Transaksi?</h2>
            <p className="text-slate-500 text-sm mb-6">Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen.</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" onClick={() => { setIsImageModalOpen(false); setSelectedImage(""); }}>
          <div className="relative max-w-3xl w-full animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => { setIsImageModalOpen(false); setSelectedImage(""); }}
              className="absolute -top-12 right-0 text-white hover:text-slate-200 font-bold text-lg"
            >
              Tutup
            </button>
            <img src={selectedImage} alt="Bukti Kwitansi" className="w-full h-auto rounded-lg shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
