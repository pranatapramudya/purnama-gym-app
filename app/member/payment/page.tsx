import { prisma } from "@/lib/prisma";
import PaymentClient from "./PaymentClient";
import { redirect } from "next/navigation";

export default async function PaymentPage({ searchParams }: { searchParams: Promise<{ packageId?: string, type?: string }> }) {
  let packageData = null;
  const { packageId, type } = await searchParams;

  if (packageId) {
    packageData = await prisma.membershipPackage.findUnique({
      where: { id: packageId }
    });
  } else if (type === 'visit') {
    packageData = await prisma.membershipPackage.findFirst({
      where: { durationMonths: 0 },
      orderBy: { createdAt: 'desc' }
    });
  } else if (type === 'vip') {
    packageData = await prisma.membershipPackage.findFirst({
      where: { durationMonths: { gt: 0 } },
      orderBy: { price: 'asc' }
    });
  }

  let defaultData = null;
  if (packageData) {
    defaultData = {
      title: packageData.name,
      priceStr: `Rp ${packageData.price.toLocaleString("id-ID")}`,
      amount: packageData.price,
      txType: packageData.durationMonths === 0 ? "HARIAN" : "BULANAN_VIP",
      isDaily: packageData.durationMonths === 0,
    };
  } else {
    redirect("/member/packages");
  }

  return <PaymentClient initialData={defaultData} />;
}
