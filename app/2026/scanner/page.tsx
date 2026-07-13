import { prisma } from "@/lib/prisma";
import ScannerClient from "./ScannerClient";

export default async function ScannerPage(props: { searchParams: Promise<{ period?: string }> }) {
  const searchParams = await props.searchParams;
  const period = searchParams.period || "today";

  const now = new Date();
  const utcOffset = 7 * 60 * 60 * 1000; // WIB is UTC+7
  const localNow = new Date(now.getTime() + utcOffset);

  let startDate: Date | undefined = undefined;
  let endDate: Date | undefined = undefined;

  if (period === "today") {
    const startOfTodayLocal = new Date(localNow);
    startOfTodayLocal.setUTCHours(0, 0, 0, 0);
    startDate = new Date(startOfTodayLocal.getTime() - utcOffset);
    
    const endOfTodayLocal = new Date(localNow);
    endOfTodayLocal.setUTCHours(23, 59, 59, 999);
    endDate = new Date(endOfTodayLocal.getTime() - utcOffset);
  } else if (period === "week") {
    const startOfWeekLocal = new Date(localNow);
    // Monday as start of week
    const day = startOfWeekLocal.getUTCDay();
    const diff = startOfWeekLocal.getUTCDate() - day + (day === 0 ? -6 : 1);
    startOfWeekLocal.setUTCDate(diff);
    startOfWeekLocal.setUTCHours(0, 0, 0, 0);
    startDate = new Date(startOfWeekLocal.getTime() - utcOffset);
    
    const endOfWeekLocal = new Date(startOfWeekLocal);
    endOfWeekLocal.setUTCDate(endOfWeekLocal.getUTCDate() + 6);
    endOfWeekLocal.setUTCHours(23, 59, 59, 999);
    endDate = new Date(endOfWeekLocal.getTime() - utcOffset);
  } else if (period === "month") {
    const startOfMonthLocal = new Date(localNow);
    startOfMonthLocal.setUTCDate(1);
    startOfMonthLocal.setUTCHours(0, 0, 0, 0);
    startDate = new Date(startOfMonthLocal.getTime() - utcOffset);
    
    const endOfMonthLocal = new Date(localNow);
    endOfMonthLocal.setUTCMonth(endOfMonthLocal.getUTCMonth() + 1);
    endOfMonthLocal.setUTCDate(0);
    endOfMonthLocal.setUTCHours(23, 59, 59, 999);
    endDate = new Date(endOfMonthLocal.getTime() - utcOffset);
  }

  const whereClause: any = {};
  if (startDate && endDate) {
    whereClause.timestamp = { gte: startDate, lte: endDate };
  }

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

  return <ScannerClient initialHistory={formattedHistory} activePeriod={period} />;
}
