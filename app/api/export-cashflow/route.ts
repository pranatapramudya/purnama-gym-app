import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as xlsx from "xlsx";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');

    const now = new Date();
    const utcOffset = 7 * 60 * 60 * 1000;
    const localNow = new Date(now.getTime() + utcOffset);

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (fromParam) {
      startDate = new Date(fromParam);
    } else {
      const startOfTodayLocal = new Date(localNow);
      startOfTodayLocal.setUTCHours(0, 0, 0, 0);
      startDate = new Date(startOfTodayLocal.getTime() - utcOffset);
    }

    if (toParam) {
      endDate = new Date(toParam);
      endDate.setUTCHours(23, 59, 59, 999);
    } else {
      if (!fromParam) {
        const endOfTodayLocal = new Date(localNow);
        endOfTodayLocal.setUTCHours(23, 59, 59, 999);
        endDate = new Date(endOfTodayLocal.getTime() - utcOffset);
      } else {
        endDate = new Date(startDate);
        endDate.setUTCHours(23, 59, 59, 999);
      }
    }

    const cashflows = await prisma.cashFlow.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        admin: { select: { name: true } }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const wb = xlsx.utils.book_new();

    const formattedData = cashflows.map(cf => {
      const dateObj = new Date(cf.createdAt.getTime() - (cf.createdAt.getTimezoneOffset() * 60000));
      const date = dateObj.toISOString().split('T')[0];
      const time = dateObj.toISOString().split('T')[1].substring(0, 5);
      return {
        "ID": cf.id,
        "TANGGAL": `${date} ${time}`,
        "TIPE": cf.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran',
        "NOMINAL": cf.amount,
        "KETERANGAN": cf.description,
        "KASIR": cf.admin?.name || 'Unknown'
      };
    });

    const ws = xlsx.utils.json_to_sheet(formattedData);
    
    // Auto-width columns
    const colWidths = [
      { wch: 30 }, // ID
      { wch: 20 }, // TANGGAL
      { wch: 15 }, // TIPE
      { wch: 25 }, // NOMINAL
      { wch: 40 }, // KETERANGAN
      { wch: 25 }, // KASIR
    ];
    ws['!cols'] = colWidths;

    // Apply currency formatting to NOMINAL column (Index 3 / Column D)
    if (ws['!ref']) {
      const range = xlsx.utils.decode_range(ws['!ref']);
      for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        const cellAddress = xlsx.utils.encode_cell({ r: R, c: 3 });
        if (ws[cellAddress]) {
          ws[cellAddress].z = '"Rp"#,##0.00';
        }
      }
    }

    xlsx.utils.book_append_sheet(wb, ws, "Arus Kas");

    // Convert to buffer
    const buf = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="Laporan_Arus_Kas.xlsx"'
      }
    });
  } catch (error) {
    console.error("Export cashflow error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
