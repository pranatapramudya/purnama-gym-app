import { prisma } from "@/lib/prisma";
import StaffClient from "./StaffClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function StaffPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/member/dashboard");
  }

  // Cek otorisasi, hanya SUPERADMIN yang boleh mengakses halaman ini
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { role: true },
  });

  if (!dbUser || dbUser.role !== "SUPERADMIN") {
    redirect("/admin/dashboard");
  }

  // Ambil semua user dengan role ADMIN, SUPERADMIN, dan TRAINER
  const staff = await prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "SUPERADMIN", "TRAINER"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      clerkUserId: true,
    },
  });

  return <StaffClient initialStaff={staff} currentUserId={userId} />;
}
