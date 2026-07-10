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
  }

  // Fallback for daily pass which might not be in the MembershipPackage table if it's separate
  let defaultData = null;
  if (type === 'daily') {
    defaultData = {
      title: "Visit Harian (Daily Pass)",
      priceStr: "Rp 20.000",
      amount: 20000,
      txType: "HARIAN",
      isDaily: true,
    };
  } else if (packageData) {
    defaultData = {
      title: packageData.name,
      priceStr: `Rp ${packageData.price.toLocaleString("id-ID")}`,
      amount: packageData.price,
      txType: "BULANAN_REGULAR", // Set as default, admin should manage VIP via package name if needed, or we can use isPopular for VIP
      isDaily: false,
    };
  } else {
    redirect("/member/packages");
  }

  return <PaymentClient initialData={defaultData} />;
}
