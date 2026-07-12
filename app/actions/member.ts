"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function verifyMember() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found in database");
  return user;
}

export async function bookClass(classId: string) {
  const user = await verifyMember();
  
  try {
    // 1. Cek apakah sesi PT ada
    const gymClass = await prisma.gymClass.findUnique({
      where: { id: classId },
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    });

    if (!gymClass) throw new Error("Sesi PT tidak ditemukan");

    // 1.5 Validasi Tanggal Booking (Minimal H+1)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const scheduleDate = new Date(gymClass.schedule);
    scheduleDate.setHours(0, 0, 0, 0);
    
    if (scheduleDate.getTime() <= today.getTime()) {
      throw new Error("Pemesanan gagal: Booking PT minimal harus dilakukan untuk H+1.");
    }

    // 2. Cek kapasitas
    if (gymClass._count.bookings >= gymClass.capacity) {
      throw new Error("Kapasitas sesi PT penuh");
    }

    // 3. Cek double booking
    const existingBooking = await prisma.classBooking.findFirst({
      where: {
        userId: user.id,
        classId: classId
      }
    });

    if (existingBooking) {
      throw new Error("Anda sudah terdaftar di sesi PT ini.");
    }

    // 4. Proses booking
    await prisma.classBooking.create({
      data: {
        userId: user.id,
        classId: classId
      }
    });

    revalidatePath("/member/booking");
    revalidatePath("/2026/classes");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function cancelBooking(classId: string) {
  const user = await verifyMember();
  
  try {
    const existingBooking = await prisma.classBooking.findFirst({
      where: {
        userId: user.id,
        classId: classId
      }
    });

    if (!existingBooking) {
      throw new Error("Anda tidak terdaftar di sesi PT ini.");
    }

    await prisma.classBooking.delete({
      where: { id: existingBooking.id }
    });

    revalidatePath("/member/booking");
    revalidatePath("/2026/classes");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createTransaction(type: string, amount: number, method: string) {
  const user = await verifyMember();

  try {
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        type,
        method,
        status: "PENDING",
      }
    });

    revalidatePath("/member/payment");
    revalidatePath("/2026/transactions");
    return { success: true, transactionId: transaction.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProfile(data: { phoneNumber?: string; address?: string }) {
  const user = await verifyMember();

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        phoneNumber: data.phoneNumber,
        address: data.address,
      }
    });

    revalidatePath("/member/profile");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function bookPTSession(slotId: string, scheduleIso: string, method: string = "TUNAI") {
  const user = await verifyMember();
  
  try {
    const slot = await prisma.pTScheduleSlot.findUnique({ where: { id: slotId } });
    if (!slot) throw new Error("Slot tidak ditemukan.");

    const ptSetting = await prisma.pTSetting.findFirst();
    const price = ptSetting?.pricePerSession || 100000;

    await prisma.$transaction(async (tx) => {
      await tx.pTSession.create({
        data: {
          memberId: user.id,
          trainerId: slot.trainerId,
          trainerName: slot.trainerName,
          schedule: new Date(scheduleIso),
          status: "PENDING",
        }
      });

      await tx.transaction.create({
        data: {
          userId: user.id,
          type: "PT_SESSION",
          amount: price,
          status: "PENDING",
          method: method
        }
      });
    });

    revalidatePath("/member/booking");
    revalidatePath("/member/schedule");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
