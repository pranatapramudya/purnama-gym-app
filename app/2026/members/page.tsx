import { prisma } from "@/lib/prisma";
import MembersClient from "./MembersClient";

type PageProps = {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function MembersPage(props: PageProps) {
  const users = await prisma.user.findMany({
    where: { role: "MEMBER" },
    orderBy: { createdAt: "desc" },
  });

  const formattedUsers = users.map(user => ({
    id: user.id,
    name: user.name || "Member",
    email: user.email,
    phone: user.phoneNumber || "",
    address: user.address || "-",
    role: user.role,
    activeUntil: user.endDate ? user.endDate.toISOString() : null,
    joinDate: user.createdAt.toISOString(),
    status: (user.endDate && user.endDate >= new Date()) ? "Aktif" : "Nonaktif",
    isArchived: user.isArchived,
  }));

  const packages = await prisma.membershipPackage.findMany({
    orderBy: { price: "asc" },
    select: { id: true, name: true, price: true, durationMonths: true }
  });

  return <MembersClient initialMembers={formattedUsers} packages={packages} />;
}
