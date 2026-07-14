import { prisma } from "@/lib/prisma";
import CashflowClient from "@/app/2026/kasir/CashflowClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function KasirPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const currentUser = await prisma.user.findUnique({
    where: { clerkUserId: userId }
  });

  if (!currentUser) {
    return redirect("/");
  }

  const userRole = currentUser.role;

  if (userRole !== "ADMIN_KASIR" && userRole !== "SUPER_ADMIN") {
    return redirect("/2026/dashboard");
  }

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
  } else {
    // Default to today
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

  const whereClause: any = {
    createdAt: { gte: startDate, lte: endDate },
  };

  const cashflowsRaw = await prisma.cashFlow.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: { admin: { select: { name: true } } }
  });

  const cashflows = cashflowsRaw.map(cf => ({
    id: cf.id,
    type: cf.type,
    amount: cf.amount,
    description: cf.description,
    buktiKwitansi: cf.buktiKwitansi,
    adminName: cf.admin?.name || "Unknown",
    createdAt: cf.createdAt.toISOString()
  }));

  return <CashflowClient initialData={cashflows} adminId={currentUser.id} userRole={userRole} />;
}
