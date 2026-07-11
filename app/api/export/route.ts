import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as xlsx from "xlsx";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'today';

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Start of Week (assuming Monday as first day of week)
    const dayOfWeek = now.getDay() || 7;
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    
    const tomorrow = new Date(startOfToday);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let startDate = startOfToday;
    let endDate = tomorrow;
    
    if (filter === "week") {
      startDate = startOfWeek;
    } else if (filter === "month") {
      startDate = startOfMonth;
    } else if (filter === "last_month") {
      startDate = startOfLastMonth;
      endDate = startOfMonth;
    } else if (filter === "year") {
      startDate = startOfYear;
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        status: "SUCCESS",
        createdAt: {
          gte: startDate,
          lt: endDate
        }
      },
      include: {
        user: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const wb = xlsx.utils.book_new();

    const formatData = (txs: any[]) => txs.map(tx => {
      const date = tx.createdAt.toISOString().split('T')[0];
      const time = tx.createdAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      return {
        "ID": tx.id,
        "Nama Member": tx.user.name || 'Unknown',
        "Tanggal": `${date} ${time}`,
        "Jenis": tx.type,
        "Metode": tx.method,
        "Total Pendapatan": tx.amount
      };
    });

    const createSheet = (data: any[], sheetName: string) => {
      const ws = xlsx.utils.json_to_sheet(data);
      
      // Auto-width columns
      const colWidths = [
        { wch: 30 }, // ID
        { wch: 25 }, // Nama Member
        { wch: 20 }, // Tanggal
        { wch: 15 }, // Jenis
        { wch: 15 }, // Metode
        { wch: 20 }, // Total Pendapatan
      ];
      ws['!cols'] = colWidths;

      xlsx.utils.book_append_sheet(wb, ws, sheetName);
    };

    // Sheet 1: Semua Transaksi
    createSheet(formatData(transactions), "Semua Transaksi");

    // Sheet 2: Pemasukan Member
    const memberTxs = transactions.filter(t => t.type === "MEMBERSHIP");
    createSheet(formatData(memberTxs), "Pemasukan Member");

    // Sheet 3: Pembayaran PT
    const ptTxs = transactions.filter(t => t.type === "PT_SESSION");
    createSheet(formatData(ptTxs), "Pembayaran PT");

    // Convert to buffer
    const buf = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="Laporan_Purnama_Gym.xlsx"'
      }
    });
  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
