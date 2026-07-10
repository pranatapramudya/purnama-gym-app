import { prisma } from "@/lib/prisma";
import DashboardClient from "./_components/DashboardClient";

type PageProps = {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminDashboard(props: PageProps) {
  const now = new Date();
  
  // Start of Today
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Start of Week (assuming Monday as first day of week)
  const dayOfWeek = now.getDay() || 7; // Convert Sunday(0) to 7
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1);

  // Start of Month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Start of Year
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  
  // End bound is just tomorrow to capture everything up to end of today safely
  const tomorrow = new Date(startOfToday);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // 1. Total Member
  const totalMember = await prisma.user.count({
    where: { role: { not: "ADMIN" } },
  });

  // 2. Fetch all transactions for this year to calculate aggregations in JS
  const yearTransactions = await prisma.transaction.findMany({
    where: { status: "SUCCESS", createdAt: { gte: startOfYear, lt: tomorrow } },
    select: { amount: true, createdAt: true },
  });

  let revToday = 0;
  let revWeek = 0;
  let revMonth = 0;
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

  const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const chartDataWeek = weekDays.map(day => ({ name: day, amount: 0 }));

  // Filter today chart by every 2 hours to make it look cleaner, or 24 hours
  const chartDataToday = Array.from({length: 24}, (_, i) => ({
    name: `${i.toString().padStart(2, '0')}:00`,
    amount: 0
  }));

  yearTransactions.forEach(tx => {
    const d = new Date(tx.createdAt);
    
    // Year
    revYear += tx.amount;
    chartDataYear[d.getMonth()].amount += tx.amount;

    // Month
    if (d >= startOfMonth) {
      revMonth += tx.amount;
      chartDataMonth[d.getDate() - 1].amount += tx.amount;
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
    year: revYear,
  };

  const charts = {
    today: filteredChartDataToday,
    week: chartDataWeek,
    month: chartDataMonth,
    year: chartDataYear,
  };

  // 3. Sesi PT Hari Ini
  const classesToday = await prisma.gymClass.count({
    where: {
      schedule: { gte: startOfToday, lt: tomorrow },
    },
  });

  // 4. Check-in Hari Ini
  const checkinsToday = await prisma.checkIn.count({
    where: {
      timestamp: { gte: startOfToday, lt: tomorrow },
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
      totalMember={totalMember}
      classesToday={classesToday}
      checkinsToday={checkinsToday}
      revenue={revenue}
      charts={charts}
      recentCheckins={recentCheckins}
    />
  );
}
