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

  const now = new Date();
  
  // Start of Today
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Start of Week (assuming Monday as first day of week)
  const dayOfWeek = now.getDay() || 7; // Convert Sunday(0) to 7
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1);

  // Start of Month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Start of Last Month
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Start of Year
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  
  // Earliest date needed for transactions
  const minStart = startOfYear < startOfLastMonth ? startOfYear : startOfLastMonth;
  
  // End bound is just tomorrow to capture everything up to end of today safely
  const tomorrow = new Date(startOfToday);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // 1. Active & Non-Member Segments
  const activeMembers = await prisma.user.count({
    where: {
      role: { in: ["MEMBER", "MEMBER"] },
      endDate: { gt: now }
    },
  });

  const nonMembers = await prisma.user.count({
    where: {
      role: { in: ["MEMBER", "MEMBER"] },
      OR: [
        { endDate: null },
        { endDate: { lte: now } }
      ]
    }
  });

  // 2. Fetch all required transactions for aggregations in JS
  const allTransactions = await prisma.transaction.findMany({
    where: { status: "SUCCESS", createdAt: { gte: minStart, lt: tomorrow } },
    select: { amount: true, createdAt: true },
  });

  let revToday = 0;
  let revWeek = 0;
  let revMonth = 0;
  let revLastMonth = 0;
  let revYear = 0;

  const chartDataYear = Array.from({length: 12}, (_, i) => ({
    name: new Date(0, i).toLocaleString('id-ID', {month: 'short'}),
    amount: 0
  }));

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const chartDataMonth = Array.from({length: daysInMonth}, (_, i) => ({
    name: (i + 1).toString(),
    amount: 0
  }));

  const daysInLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  const chartDataLastMonth = Array.from({length: daysInLastMonth}, (_, i) => ({
    name: (i + 1).toString(),
    amount: 0
  }));

  const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const chartDataWeek = weekDays.map(day => ({ name: day, amount: 0 }));

  // Filter today chart by every 2 hours to make it look cleaner, or 24 hours
  const chartDataToday = Array.from({length: 24}, (_, i) => ({
    name: `${i.toString().padStart(2, '0')}:00`,
    amount: 0
  }));

  allTransactions.forEach(tx => {
    const d = new Date(tx.createdAt);
    
    // Year
    if (d >= startOfYear) {
      revYear += tx.amount;
      chartDataYear[d.getMonth()].amount += tx.amount;
    }

    // Month
    if (d >= startOfMonth) {
      revMonth += tx.amount;
      chartDataMonth[d.getDate() - 1].amount += tx.amount;
    }

    // Last Month
    if (d >= startOfLastMonth && d < startOfMonth) {
      revLastMonth += tx.amount;
      chartDataLastMonth[d.getDate() - 1].amount += tx.amount;
    }

    // Week
    if (d >= startOfWeek) {
      revWeek += tx.amount;
      const jsDay = d.getDay(); 
      const weekIndex = jsDay === 0 ? 6 : jsDay - 1;
      chartDataWeek[weekIndex].amount += tx.amount;
    }

    // Today
    if (d >= startOfToday) {
      revToday += tx.amount;
      chartDataToday[d.getHours()].amount += tx.amount;
    }
  });

  // Optimization: Filter chartDataToday to only show hours from 06:00 to 22:00
  const filteredChartDataToday = chartDataToday.slice(6, 23);

  const revenue = {
    today: revToday,
    week: revWeek,
    month: revMonth,
    last_month: revLastMonth,
    year: revYear,
  };

  const charts = {
    today: filteredChartDataToday,
    week: chartDataWeek,
    month: chartDataMonth,
    last_month: chartDataLastMonth,
    year: chartDataYear,
  };

  const resolvedSearchParams = await props.searchParams;
  const filter = (resolvedSearchParams?.filter as string) || "today";

  // Determine dynamic start and end dates based on filter
  let dynamicStartDate = startOfToday;
  let dynamicEndDate = tomorrow;
  
  if (filter === "week") dynamicStartDate = startOfWeek;
  else if (filter === "month") dynamicStartDate = startOfMonth;
  else if (filter === "last_month") {
    dynamicStartDate = startOfLastMonth;
    dynamicEndDate = startOfMonth;
  }
  else if (filter === "year") dynamicStartDate = startOfYear;
  
  // 3. Sesi PT (Dinamis)
  const classesToday = await prisma.gymClass.count({
    where: {
      schedule: { gte: dynamicStartDate, lt: dynamicEndDate },
    },
  });

  // 4. Check-in (Dinamis)
  const checkinsToday = await prisma.checkIn.count({
    where: {
      timestamp: { gte: dynamicStartDate, lt: dynamicEndDate },
    },
  });

  // Recent Activity (Check-ins)
  const recentCheckinsRaw = await prisma.checkIn.findMany({
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
      revenue={revenue}
      charts={charts}
      recentCheckins={recentCheckins}
      activeFilter={filter}
    />
  );
}
