import { prisma } from "@/lib/prisma";
import ScannerClient from "./ScannerClient";

export default async function ScannerPage() {
  // Ambil history check-in hari ini
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkIns = await prisma.checkIn.findMany({
    where: {
      timestamp: {
        gte: today,
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  const formattedHistory = checkIns.map((ci) => ({
    name: ci.user.name || "Member",
    email: ci.user.email,
    role: ci.user.role,
    time: ci.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    status: "success" as const,
  }));

  return <ScannerClient initialHistory={formattedHistory} />;
}
