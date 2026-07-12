import { prisma } from "@/lib/prisma";
import PackagesClient from "./PackagesClient";

type PageProps = {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PackagesPage(props: PageProps) {
  const packages = await prisma.membershipPackage.findMany({
    orderBy: { price: "asc" },
  });

  const formattedPackages = packages.map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    durationMonths: pkg.durationMonths,
    price: pkg.price,
    isPopular: pkg.isPopular,
  }));

  return <PackagesClient initialPackages={formattedPackages} />;
}
