import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, amount, description, adminId, buktiKwitansi } = body;

    if (!type || !amount || !description || !adminId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const cashflow = await prisma.cashFlow.create({
      data: {
        type,
        amount,
        description,
        adminId,
        buktiKwitansi
      },
      include: {
        admin: { select: { name: true } }
      }
    });

    return NextResponse.json({
      id: cashflow.id,
      type: cashflow.type,
      amount: cashflow.amount,
      description: cashflow.description,
      buktiKwitansi: cashflow.buktiKwitansi,
      adminName: cashflow.admin?.name || "Unknown",
      createdAt: cashflow.createdAt.toISOString()
    });
  } catch (error) {
    console.error("Cashflow Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
