"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Plus, ArrowUpCircle, ArrowDownCircle, Banknote, Calendar } from "lucide-react";

type CashFlowData = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string;
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
  const [filter, setFilter] = useState("today");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [type, setType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const filteredData = data.filter(item => {
    const d = new Date(item.createdAt);
    const now = new Date();
    if (filter === "today") {
      return d.toDateString() === now.toDateString();
    }
    if (filter === "week") {
      const pastWeek = new Date(now);
      pastWeek.setDate(pastWeek.getDate() - 7);
      return d >= pastWeek;
    }
    if (filter === "month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    return true; // all
  });

  const totalIncome = filteredData.filter(d => d.type === "INCOME").reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = filteredData.filter(d => d.type === "EXPENSE").reduce((acc, curr) => acc + curr.amount, 0);
  const netTotal = totalIncome - totalExpense;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/cashflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, amount: Number(amount), description, adminId })
      });
      
      if (res.ok) {
        const newItem = await res.json();
        setData([newItem, ...data]);
        setIsModalOpen(false);
        setAmount("");
        setDescription("");
        router.refresh();
      } else {
        alert("Gagal menyimpan data.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
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
              // Directing to export endpoint
              window.location.href = `/api/export-cashflow?filter=${filter}`;
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Unduh Excel
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
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
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="font-semibold text-slate-800">Riwayat Transaksi</h3>
          <div className="flex bg-slate-100 rounded-lg p-1">
            {["today", "week", "month", "all"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f === "today" ? "Hari Ini" : f === "week" ? "Minggu Ini" : f === "month" ? "Bulan Ini" : "Semua"}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium">Tipe</th>
                <th className="px-6 py-4 font-medium">Keterangan</th>
                <th className="px-6 py-4 font-medium">Kasir</th>
                <th className="px-6 py-4 font-medium text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(item.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        item.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {item.type === 'INCOME' ? 'Masuk' : 'Keluar'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {item.adminName}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${
                      item.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {item.type === 'INCOME' ? '+' : '-'} Rp {item.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm">
                    Belum ada catatan arus kas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100">
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

              <div className="pt-4 flex gap-3">
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
                  className="flex-1 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
