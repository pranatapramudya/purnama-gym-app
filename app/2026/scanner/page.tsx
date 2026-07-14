import { prisma } from "@/lib/prisma";
import ScannerClient from "./ScannerClient";

export default async function ScannerPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const fromParam = searchParams?.from as string;
  const toParam = searchParams?.to as string;

  const now = new Date();
  const utcOffset = 7 * 60 * 60 * 1000; // WIB is UTC+7
  const localNow = new Date(now.getTime() + utcOffset);

  let startDate: Date;
  let endDate: Date;

  if (fromParam) {
    startDate = new Date(fromParam);
    // Adjust to local time if needed, but fromParam is usually YYYY-MM-DD
    // meaning it parses as UTC midnight.
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
    // Default to today
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
    timestamp: { gte: startDate, lte: endDate },
  };

  const checkIns = await prisma.checkIn.findMany({
    where: whereClause,
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
    time: ci.timestamp.toISOString(),
    status: "success" as const,
  }));

  return <ScannerClient initialHistory={formattedHistory} />;
}
