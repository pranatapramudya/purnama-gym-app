import { prisma } from "@/lib/prisma";
import DashboardClient from "./_components/DashboardClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminDashboard(props: PageProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }

  const currentUser = await prisma.user.findUnique({
    where: { clerkUserId: userId }
  });

  const userRole = currentUser?.role || "MEMBER";

  if (userRole !== "ADMIN_KASIR" && userRole !== "SUPER_ADMIN") {
    redirect("/");
  }

  const resolvedSearchParams = await props.searchParams;
  const fromParam = resolvedSearchParams?.from as string;
  const toParam = resolvedSearchParams?.to as string;

  // Set explicit timezone for Jakarta (WIB)
  const jakartaTimeStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
  const localNow = new Date(jakartaTimeStr);
  const now = new Date();

  // Parse start and end dates or default to today
  let dynamicStartDate = new Date(Date.UTC(localNow.getFullYear(), localNow.getMonth(), localNow.getDate()));
  let dynamicEndDate = new Date(dynamicStartDate);
  dynamicEndDate.setDate(dynamicEndDate.getDate() + 1);

  if (fromParam) {
    dynamicStartDate = new Date(fromParam);
  }
  if (toParam) {
    dynamicEndDate = new Date(toParam);
    dynamicEndDate.setHours(23, 59, 59, 999);
  }

  // 1. Active & Non-Member Segments
  const activeMembers = await prisma.user.count({
    where: {
      role: { in: ["MEMBER"] },
      endDate: { gt: now }
    },
  });

  const nonMembers = await prisma.user.count({
    where: {
      role: { in: ["MEMBER"] },
      OR: [
        { endDate: null },
        { endDate: { lte: now } }
      ]
    }
  });

  // 2. Fetch all required transactions for aggregations in JS
  const allTransactions = await prisma.transaction.findMany({
    where: { status: "SUCCESS", createdAt: { gte: dynamicStartDate, lte: dynamicEndDate } },
    select: { amount: true, createdAt: true },
  });

  let totalRevenue = 0;
  allTransactions.forEach(tx => totalRevenue += tx.amount);

  // Dynamic Chart Logic
  const timeDiff = dynamicEndDate.getTime() - dynamicStartDate.getTime();
  const diffDays = timeDiff / (1000 * 3600 * 24);

  let chartData: { name: string, amount: number }[] = [];

  if (diffDays <= 2) { // 2 days or less
    // Group by hour
    const hours = Array.from({length: 24}, (_, i) => ({
      name: `${i.toString().padStart(2, '0')}:00`,
      amount: 0
    }));
    allTransactions.forEach(tx => {
      const d = new Date(tx.createdAt);
      hours[d.getHours()].amount += tx.amount;
    });
    chartData = hours.slice(6, 23);
  } else if (diffDays <= 31) {
    // Group by day
    const daysMap = new Map<string, number>();
    for (let d = new Date(dynamicStartDate); d <= dynamicEndDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      daysMap.set(dateString, 0);
    }
    allTransactions.forEach(tx => {
      const dateString = tx.createdAt.toISOString().split('T')[0];
      if (daysMap.has(dateString)) {
        daysMap.set(dateString, daysMap.get(dateString)! + tx.amount);
      }
    });
    chartData = Array.from(daysMap.entries()).map(([dateStr, amt]) => {
      const d = new Date(dateStr);
      const name = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      return { name, amount: amt };
    });
  } else {
    // Group by month
    const monthsMap = new Map<string, number>();
    allTransactions.forEach(tx => {
      const monthString = `${tx.createdAt.getFullYear()}-${(tx.createdAt.getMonth() + 1).toString().padStart(2, '0')}`;
      monthsMap.set(monthString, (monthsMap.get(monthString) || 0) + tx.amount);
    });
    const sortedMonths = Array.from(monthsMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    chartData = sortedMonths.map(([monthStr, amt]) => {
      const d = new Date(`${monthStr}-01`);
      const name = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
      return { name, amount: amt };
    });
  }

  // 3. Sesi PT (Dinamis)
  const idDays = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const startDayName = idDays[dynamicStartDate.getDay()];
  
  let ptWhereClause: any = {
    targetDate: { gte: dynamicStartDate, lte: dynamicEndDate },
  };

  if (diffDays <= 2) {
    ptWhereClause = {
      OR: [
        { targetDate: { gte: dynamicStartDate, lte: dynamicEndDate } },
        { targetDate: null, dayOfWeek: startDayName }
      ]
    };
  } else {
    ptWhereClause = {
      OR: [
        { targetDate: { gte: dynamicStartDate, lte: dynamicEndDate } },
        { targetDate: null }
      ]
    };
  }

  const classesToday = await prisma.pTScheduleSlot.count({
    where: ptWhereClause,
  });

  // 4. Check-in (Dinamis)
  const checkinsToday = await prisma.checkIn.count({
    where: {
      timestamp: { gte: dynamicStartDate, lte: dynamicEndDate },
    },
  });

  // Recent Activity (Check-ins)
  const recentCheckinsRaw = await prisma.checkIn.findMany({
    where: {
      timestamp: { gte: dynamicStartDate, lte: dynamicEndDate },
    },
    take: 5,
    orderBy: { timestamp: "desc" },
    include: { user: true },
  });

  const recentCheckins = recentCheckinsRaw.map((item) => ({
    ...item,
    timestamp: item.timestamp.toISOString(),
  }));

  return (
    <DashboardClient 
      userRole={typeof userRole === 'string' ? userRole.toLowerCase() : 'member'}
      activeMembers={activeMembers}
      nonMembers={nonMembers}
      classesToday={classesToday}
      checkinsToday={checkinsToday}
      revenue={totalRevenue}
      chartData={chartData}
      recentCheckins={recentCheckins}
    />
  );
}
