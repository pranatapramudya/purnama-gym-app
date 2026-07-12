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

    // 1. Sheet 1: Ringkasan / Stats
    const totalCheckIns = await prisma.checkIn.count({
      where: {
        timestamp: {
          gte: startDate,
          lt: endDate
        }
      }
    });

    const activeMembers = await prisma.user.count({
      where: {
        role: "MEMBER",
        endDate: {
          gte: now
        }
      }
    });

    const ptSessions = await prisma.pTSession.count({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate
        }
      }
    });

    // 2. Sheet 2: Arus Kas
    const cashFlows = await prisma.cashFlow.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate
        }
      },
      include: { admin: { select: { name: true } } },
      orderBy: { createdAt: "desc" }
    });

    // 3. Sheet 3: Data Kunjungan
    const checkIns = await prisma.checkIn.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lt: endDate
        }
      },
      include: { user: { select: { name: true } } },
      orderBy: { timestamp: "desc" }
    });

    const wb = xlsx.utils.book_new();

    const createSheet = (data: any[], sheetName: string, colWidths: {wch: number}[], currencyColIndex?: number) => {
      const ws = xlsx.utils.json_to_sheet(data);
      ws['!cols'] = colWidths;
      
      if (currencyColIndex !== undefined && ws['!ref']) {
        const range = xlsx.utils.decode_range(ws['!ref']);
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
          const cellAddress = xlsx.utils.encode_cell({ r: R, c: currencyColIndex });
          if (ws[cellAddress]) {
            ws[cellAddress].z = '"Rp"#,##0.00';
          }
        }
      }
      
      xlsx.utils.book_append_sheet(wb, ws, sheetName);
    };

    // Prepare Sheet 1
    const summaryData = [
      { "METRIK": "Total Check-in", "NILAI": totalCheckIns },
      { "METRIK": "Member Aktif Saat Ini", "NILAI": activeMembers },
      { "METRIK": "Sesi PT Baru", "NILAI": ptSessions },
    ];
    createSheet(summaryData, "Ringkasan", [{ wch: 30 }, { wch: 15 }]);

    // Prepare Sheet 2
    const cashFlowData = cashFlows.map(cf => {
      // Use local timezone formatting correctly
      const date = new Date(cf.createdAt.getTime() - (cf.createdAt.getTimezoneOffset() * 60000));
      return {
        "ID": cf.id,
        "TANGGAL": date.toISOString().split('T')[0] + " " + date.toISOString().split('T')[1].substring(0, 5),
        "TIPE": cf.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran',
        "NOMINAL": cf.amount,
        "KETERANGAN": cf.description,
        "KASIR": cf.admin?.name || 'Unknown'
      };
    });
    // colIndex for NOMINAL is 3
    createSheet(cashFlowData, "Arus Kas", [{ wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 40 }, { wch: 25 }], 3);

    // Prepare Sheet 3
    const checkInData = checkIns.map(ci => {
      const dateIn = new Date(ci.timestamp.getTime() - (ci.timestamp.getTimezoneOffset() * 60000));
      const timeInStr = dateIn.toISOString().split('T')[0] + " " + dateIn.toISOString().split('T')[1].substring(0, 5);
      
      let timeOutStr = "-";
      if (ci.checkOutTime) {
        const dateOut = new Date(ci.checkOutTime.getTime() - (ci.checkOutTime.getTimezoneOffset() * 60000));
        timeOutStr = dateOut.toISOString().split('T')[0] + " " + dateOut.toISOString().split('T')[1].substring(0, 5);
      }

      return {
        "ID": ci.id,
        "NAMA MEMBER": ci.user?.name || 'Unknown',
        "WAKTU MASUK": timeInStr,
        "WAKTU KELUAR": timeOutStr
      };
    });
    createSheet(checkInData, "Data Kunjungan", [{ wch: 30 }, { wch: 30 }, { wch: 20 }, { wch: 20 }]);

    // Convert to buffer
    const buf = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="Master_Laporan_Purnama_Gym.xlsx"'
      }
    });
  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
