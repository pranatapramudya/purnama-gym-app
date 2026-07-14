import { prisma } from "@/lib/prisma";
import TransactionsClient from "./TransactionsClient";

export default async function TransactionsPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const fromParam = searchParams?.from as string;
  const toParam = searchParams?.to as string;

  const now = new Date();
  const utcOffset = 7 * 60 * 60 * 1000;
  const localNow = new Date(now.getTime() + utcOffset);

  let startDate: Date | undefined;
  let endDate: Date | undefined;

  if (fromParam) {
    startDate = new Date(fromParam);
  }
  if (toParam) {
    endDate = new Date(toParam);
    endDate.setUTCHours(23, 59, 59, 999);
  }

  const whereClause: any = {};
  if (startDate || endDate) {
    whereClause.createdAt = {};
    if (startDate) whereClause.createdAt.gte = startDate;
    if (endDate) whereClause.createdAt.lte = endDate;
  }

  const transactions = await prisma.transaction.findMany({
    where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
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
