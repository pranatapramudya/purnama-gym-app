import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        status: "SUCCESS"
      },
      include: {
        user: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Buat header CSV
    const headers = ["ID", "Nama Member", "Tanggal", "Jenis", "Metode", "Total Pendapatan"];
    
    // Map data
    const rows = transactions.map(tx => {
      const date = tx.createdAt.toISOString().split('T')[0];
      const time = tx.createdAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      return [
        tx.id,
        `"${tx.user.name || 'Unknown'}"`,
        `"${date} ${time}"`,
        tx.type,
        tx.method,
        tx.amount
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="Laporan_Purnama_Gym.csv"'
      }
    });
  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
