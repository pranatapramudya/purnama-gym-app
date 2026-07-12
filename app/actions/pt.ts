"use server";

import { prisma } from "@/lib/prisma";

export async function getAvailablePTSlots(targetDateStr?: string) {
  try {
    const ptSetting = await prisma.pTSetting.findFirst();
    const price = ptSetting?.pricePerSession || 100000;

    let isGlobalFeed = false;
    let startOfDay = new Date();
    
    if (targetDateStr) {
      startOfDay = new Date(targetDateStr);
    } else {
      isGlobalFeed = true;
    }
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const dayMap: Record<number, string> = {
      0: "Minggu", 1: "Senin", 2: "Selasa", 3: "Rabu", 4: "Kamis", 5: "Jumat", 6: "Sabtu"
    };
    const targetDayName = dayMap[startOfDay.getDay()];

    let whereClause: any = {
      OR: [
        { targetDate: { gte: startOfDay, lte: endOfDay } },
        { targetDate: null, dayOfWeek: targetDayName }
      ]
    };

    if (isGlobalFeed) {
      whereClause = {
        targetDate: { gte: startOfDay }
      };
    }

    const masterSlots = await prisma.pTScheduleSlot.findMany({
      where: whereClause,
      include: { trainer: { select: { name: true } } },
      orderBy: isGlobalFeed ? [
        { targetDate: 'asc' },
        { startTime: 'asc' }
      ] : undefined
    });

    if (masterSlots.length === 0) {
      return { success: true, slots: [], ptSetting };
    }

    const nextDay = new Date(startOfDay);
    nextDay.setDate(startOfDay.getDate() + 1);

    const bookedSessions = await prisma.pTSession.findMany({
      where: {
        schedule: isGlobalFeed ? { gte: startOfDay } : { gte: startOfDay, lt: nextDay },
        status: { in: ["PENDING", "CONFIRMED", "ONGOING"] }
      },
      select: { schedule: true, trainerId: true, trainerName: true }
    });

    const bookedData = bookedSessions.map(session => {
       const hours = String(session.schedule.getHours()).padStart(2, '0');
       const minutes = String(session.schedule.getMinutes()).padStart(2, '0');
       
       const dateObj = session.schedule;
       const localDateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth()+1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

       return {
         dateKey: localDateStr,
         time: `${hours}:${minutes}`,
         trainerId: session.trainerId,
         trainerName: session.trainerName
       };
    });

    const result = masterSlots.map(slot => {
      const dateToUse = slot.targetDate || startOfDay;
      const slotDateKey = `${dateToUse.getFullYear()}-${String(dateToUse.getMonth()+1).padStart(2, '0')}-${String(dateToUse.getDate()).padStart(2, '0')}`;

      const currentBookings = bookedData.filter(b => 
        (isGlobalFeed ? b.dateKey === slotDateKey : true) &&
        b.time === slot.startTime && 
        b.trainerId === slot.trainerId && 
        b.trainerName === slot.trainerName
      ).length;
      return {
        id: slot.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: currentBookings >= slot.maxCapacity,
        price: slot.price,
        discountPercentage: slot.discountPercentage,
        trainerName: slot.trainerName || slot.trainer?.name || "Tanpa PT",
        targetDate: dateToUse.toISOString(),
        currentBookings: currentBookings,
        maxCapacity: slot.maxCapacity
      };
    });

    result.sort((a, b) => a.startTime.localeCompare(b.startTime));

    return { success: true, slots: result, ptSetting };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
