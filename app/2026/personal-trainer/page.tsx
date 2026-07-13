import { prisma } from "@/lib/prisma";
import ClassesClient from "./ClassesClient";
import { auth } from "@clerk/nextjs/server";

export default async function ClassesPage() {
  const { userId } = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { clerkUserId: userId! },
    select: { id: true, role: true }
  });

  const sessionWhereClause = currentUser?.role === "TRAINER" 
    ? { trainerId: currentUser.id }
    : {};

  const sessions = await prisma.pTSession.findMany({
    where: sessionWhereClause,
    orderBy: { schedule: "asc" },
    include: {
      member: { select: { name: true, email: true } },
      trainer: { select: { name: true } }
    }
  });

  const formattedSessions = sessions.map(s => ({
    id: s.id,
    memberName: s.member.name || "Member",
    trainerName: s.trainer?.name || "Belum ditugaskan",
    schedule: s.schedule.toISOString(),
    status: s.status,
  }));

  const scheduleSlots = await prisma.pTScheduleSlot.findMany({
    orderBy: { startTime: 'asc' },
    include: { trainer: { select: { name: true } } }
  });

  const trainers = await prisma.user.findMany({
    where: { role: { in: ["ADMIN_KASIR", "SUPER_ADMIN", "TRAINER"] } },
    select: { id: true, name: true, email: true }
  });

  // Fetch "Today's" schedule properly bounded in WIB (UTC+7)
  const now = new Date();
  const utcOffset = 7 * 60 * 60 * 1000;
  const localNow = new Date(now.getTime() + utcOffset);
  
  const startOfTodayLocal = new Date(localNow);
  startOfTodayLocal.setUTCHours(0, 0, 0, 0);
  const startOfToday = new Date(startOfTodayLocal.getTime() - utcOffset);
  
  const endOfTodayLocal = new Date(localNow);
  endOfTodayLocal.setUTCHours(23, 59, 59, 999);
  const endOfToday = new Date(endOfTodayLocal.getTime() - utcOffset);

  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const todayDayOfWeek = days[localNow.getUTCDay()];

  const todaySlots = scheduleSlots.filter(s => 
    s.targetDate 
      ? new Date(s.targetDate).getTime() >= startOfToday.getTime() && new Date(s.targetDate).getTime() <= endOfToday.getTime()
      : s.dayOfWeek === todayDayOfWeek
  );

  const todayBookings = await prisma.pTSession.findMany({
    where: {
      ...sessionWhereClause,
      schedule: { gte: startOfToday, lte: endOfToday }
    },
    include: {
      member: { select: { name: true, email: true } },
      trainer: { select: { name: true } }
    }
  });

  const mergedTodaySessions: any[] = [];

  todaySlots.forEach(slot => {
    // Find ALL bookings for this slot time
    const slotBookings = todayBookings.filter(b => {
      const localBookingTime = new Date(b.schedule.getTime() + utcOffset);
      const hours = localBookingTime.getUTCHours().toString().padStart(2, '0');
      const mins = localBookingTime.getUTCMinutes().toString().padStart(2, '0');
      return `${hours}:${mins}` === slot.startTime;
    });

    const currentBookedCount = slotBookings.length;
    const maxCapacity = slot.maxCapacity || 1;

    if (currentBookedCount > 0) {
      slotBookings.forEach(booking => {
        mergedTodaySessions.push({
          id: booking.id,
          timeStr: `${slot.startTime} - ${slot.endTime} WIB`,
          trainerName: slot.trainer?.name || slot.trainerName || "Bebas",
          isBooked: true,
          status: booking.status,
          memberName: booking.member.name || "Member",
          slotInfo: { startTime: slot.startTime, endTime: slot.endTime },
          quota: { current: currentBookedCount, max: maxCapacity }
        });
      });
    } else {
      mergedTodaySessions.push({
        id: slot.id,
        timeStr: `${slot.startTime} - ${slot.endTime} WIB`,
        trainerName: slot.trainer?.name || slot.trainerName || "Bebas",
        isBooked: false,
        status: "AVAILABLE",
        memberName: null,
        slotInfo: { startTime: slot.startTime, endTime: slot.endTime },
        quota: { current: 0, max: maxCapacity }
      });
    }
  });

  // Add orphans
  todayBookings.forEach(b => {
    const localBookingTime = new Date(b.schedule.getTime() + utcOffset);
    const hours = localBookingTime.getUTCHours().toString().padStart(2, '0');
    const mins = localBookingTime.getUTCMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${mins}`;
    
    if (!todaySlots.some(s => s.startTime === timeStr)) {
      mergedTodaySessions.push({
        id: b.id,
        timeStr: `${timeStr} WIB`,
        trainerName: b.trainer?.name || b.trainerName || "Belum ditugaskan",
        isBooked: true,
        status: b.status,
        memberName: b.member.name || "Member",
        slotInfo: null,
        quota: null
      });
    }
  });

  mergedTodaySessions.sort((a, b) => a.timeStr.localeCompare(b.timeStr));

  return <ClassesClient initialSessions={formattedSessions} userRole={currentUser?.role || "ADMIN_KASIR"} initialSlots={scheduleSlots as any} trainers={trainers} todaySessions={mergedTodaySessions} />;
}
