"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { AdminToast, ToastType } from "@/components/admin/AdminToast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CheckCircle2, Clock, XCircle, Filter } from "lucide-react";
import { verifyTransaction } from "@/app/actions/admin";

interface TransactionItem {
  id: string;
  memberName: string;
  memberEmail: string;
  type: string;
  amount: number;
  method: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  date: string;
}

const statusConfig = {
  PENDING: { icon: Clock, label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
  SUCCESS: { icon: CheckCircle2, label: "Berhasil", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  FAILED: { icon: XCircle, label: "Gagal", className: "bg-red-50 text-red-700 border-red-200" },
};

const typeLabels: Record<string, string> = {
  HARIAN: "Harian (Regular)",
  BULANAN_REGULAR: "Bulanan (Regular)",
  BULANAN_VIP: "Bulanan (VIP)",
  PAKET_ZUMBA: "Paket Zumba",
};

export default function TransactionsClient({ 
  initialTransactions
}: { 
  initialTransactions: TransactionItem[]
}) {
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as ToastType });
  const [verifyTarget, setVerifyTarget] = useState<TransactionItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "SUCCESS" | "FAILED">("ALL");
  const [isVerifying, setIsVerifying] = useState(false);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ visible: true, message, type });
  };

  const handleVerify = async () => {
    if (!verifyTarget) return;
    setIsVerifying(true);
    const res = await verifyTransaction(verifyTarget.id);
    setIsVerifying(false);

    if (res.success) {
      showToast(`Transaksi dari ${verifyTarget.memberName} berhasil diverifikasi.`, "success");
      setVerifyTarget(null);
    } else {
      showToast(res.error || "Gagal memverifikasi", "error");
    }
  };

  const filteredTransactions = filterStatus === "ALL"
    ? initialTransactions
    : initialTransactions.filter((t) => t.status === filterStatus);

  const pendingCount = initialTransactions.filter((t) => t.status === "PENDING").length;

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (item: TransactionItem) => (
        <span className="text-xs font-mono font-semibold text-slate-500">{item.id}</span>
      ),
    },
    {
      key: "memberName",
      label: "Member",
      render: (item: TransactionItem) => (
        <p className="text-sm font-semibold text-slate-900">{item.memberName}</p>
      ),
    },
    {
      key: "type",
      label: "Paket",
      render: (item: TransactionItem) => (
        <span className="text-sm text-slate-700">{typeLabels[item.type] || item.type}</span>
      ),
    },
    {
      key: "amount",
      label: "Jumlah",
      render: (item: TransactionItem) => (
        <span className="text-sm font-bold text-slate-900">
          Rp {item.amount.toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      key: "method",
      label: "Metode",
      render: (item: TransactionItem) => (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          item.method === "TUNAI" ? "bg-slate-100 text-slate-600" : "bg-indigo-50 text-indigo-600"
        }`}>
          {item.method === "TUNAI" ? "💵 Tunai" : "🏦 Transfer"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: TransactionItem) => {
        const config = statusConfig[item.status];
        const Icon = config.icon;
        return (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${config.className}`}>
            <Icon className="w-3 h-3" />
            {config.label}
          </span>
        );
      },
    },
    {
      key: "date",
      label: "Waktu",
      render: (item: TransactionItem) => {
        const d = new Date(item.date);
        return (
          <div>
            <p className="text-xs font-medium text-slate-700">
              {d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
            </p>
            <p className="text-[10px] text-slate-500">
              {d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Aksi",
      className: "text-right",
      render: (item: TransactionItem) => (
        <div className="flex justify-end">
          {item.status === "PENDING" ? (
            <button
              onClick={() => setVerifyTarget(item)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verifikasi
            </button>
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )}
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
        open={!!verifyTarget}
        title="Verifikasi Pembayaran"
        description={`Konfirmasi bahwa pembayaran sebesar Rp ${verifyTarget?.amount.toLocaleString("id-ID")} dari ${verifyTarget?.memberName} sudah diterima?`}
        confirmLabel={isVerifying ? "Memproses..." : "Verifikasi"}
        cancelLabel="Batal"
        onConfirm={handleVerify}
        onCancel={() => !isVerifying && setVerifyTarget(null)}
        variant="default"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Transaksi</h1>
          <p className="text-slate-500 text-sm mt-1">
            {initialTransactions.length} transaksi total
            {pendingCount > 0 && (
              <span className="ml-1.5 inline-flex items-center gap-1 text-amber-600 font-semibold">
                · {pendingCount} menunggu verifikasi
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        {(["ALL", "PENDING", "SUCCESS", "FAILED"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterStatus === status
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {status === "ALL" ? "Semua" : statusConfig[status].label}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={filteredTransactions} emptyMessage="Tidak ada transaksi" emptyDescription="Belum ada transaksi yang cocok dengan filter ini." />


    </div>
  );
}
