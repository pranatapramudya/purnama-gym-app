import { prisma } from "@/lib/prisma";
import CashflowClient from "@/app/2026/kasir/CashflowClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function KasirPage() {
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

  const cashflowsRaw = await prisma.cashFlow.findMany({
    orderBy: { createdAt: "desc" },
    include: { admin: { select: { name: true } } }
  });

  const cashflows = cashflowsRaw.map(cf => ({
    id: cf.id,
    type: cf.type,
    amount: cf.amount,
    description: cf.description,
    adminName: cf.admin?.name || "Unknown",
    createdAt: cf.createdAt.toISOString()
  }));

  return <CashflowClient initialData={cashflows} adminId={currentUser.id} userRole={userRole} />;
}
