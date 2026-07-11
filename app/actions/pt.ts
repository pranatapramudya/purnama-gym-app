"use server";

import { prisma } from "@/lib/prisma";

const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export async function getAvailablePTSlots() {
  try {
    const masterSlots = await prisma.pTScheduleSlot.findMany({
      include: { trainer: { select: { name: true } } }
    });

    const ptSetting = await prisma.pTSetting.findFirst();
    const price = ptSetting?.pricePerSession || 100000;

    if (masterSlots.length === 0) {
      return { success: true, slots: [], ptSetting };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayMap: Record<string, number> = {
      "Minggu": 0, "Senin": 1, "Selasa": 2, "Rabu": 3, "Kamis": 4, "Jumat": 5, "Sabtu": 6
    };

    const getUpcomingDate = (dayName: string) => {
      const targetDay = dayMap[dayName];
      const currentDay = today.getDay();
      let diff = targetDay - currentDay;
      if (diff <= 0) {
        diff += 7; // Next week
      }
      const upcomingDate = new Date(today);
      upcomingDate.setDate(today.getDate() + diff);
      return upcomingDate;
    };

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 8);
    const bookedSessions = await prisma.pTSession.findMany({
      where: {
        schedule: { gte: today, lte: endDate },
        status: { in: ["PENDING", "CONFIRMED", "ONGOING"] }
      },
      select: { schedule: true }
    });

    const bookedTimeKeys = bookedSessions.map(session => {
       const year = session.schedule.getFullYear();
       const month = String(session.schedule.getMonth() + 1).padStart(2, '0');
       const day = String(session.schedule.getDate()).padStart(2, '0');
       const hours = String(session.schedule.getHours()).padStart(2, '0');
       const minutes = String(session.schedule.getMinutes()).padStart(2, '0');
       return `${year}-${month}-${day}-${hours}:${minutes}`;
    });

    const result = masterSlots.map(slot => {
      const upcomingDate = getUpcomingDate(slot.dayOfWeek);
      const year = upcomingDate.getFullYear();
      const month = String(upcomingDate.getMonth() + 1).padStart(2, '0');
      const day = String(upcomingDate.getDate()).padStart(2, '0');
      const key = `${year}-${month}-${day}-${slot.startTime}`;
      
      return {
        id: slot.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: bookedTimeKeys.includes(key),
        price: price,
        trainerName: slot.trainerName || slot.trainer?.name || "Tanpa PT",
        targetDate: upcomingDate.toISOString()
      };
    });

    result.sort((a, b) => {
       const dateA = new Date(a.targetDate).getTime();
       const dateB = new Date(b.targetDate).getTime();
       if (dateA !== dateB) return dateA - dateB;
       return a.startTime.localeCompare(b.startTime);
    });

    return { success: true, slots: result, ptSetting };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
