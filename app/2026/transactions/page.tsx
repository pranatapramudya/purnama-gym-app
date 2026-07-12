import { prisma } from "@/lib/prisma";
import TransactionsClient from "./TransactionsClient";

export default async function TransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const formattedTransactions = transactions.map(t => ({
    id: t.id,
    memberName: t.user?.name || "Member",
    memberEmail: t.user?.email || "Tidak ada email",
    type: t.type,
    amount: t.amount,
    date: t.createdAt.toISOString(),
    status: t.status,
    method: t.method,
  }));

  return <TransactionsClient initialTransactions={formattedTransactions} />;
}
