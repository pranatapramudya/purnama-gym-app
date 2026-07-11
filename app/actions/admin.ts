"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

async function verifyAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, role: true },
  });

  if (!user || (user.role.toUpperCase() !== "ADMIN" && user.role.toUpperCase() !== "SUPERADMIN")) {
    throw new Error("Forbidden: Admins or Superadmins only");
  }
  return user;
}

async function verifyPTAccess() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, role: true },
  });

  if (!user || !["ADMIN", "SUPERADMIN", "TRAINER"].includes(user.role.toUpperCase())) {
    throw new Error("Forbidden: Admins, Superadmins, or Trainers only");
  }
  return user;
}

export async function createGymClass(data: { name: string; description: string; category: string; schedule: string; capacity: number }) {
  await verifyAdmin();
  try {
    await prisma.gymClass.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        schedule: new Date(data.schedule),
        capacity: data.capacity,
      },
    });
    revalidatePath("/admin/personal-trainer");
    revalidatePath("/member/booking");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateGymClass(id: string, data: { name: string; description: string; category: string; schedule: string; capacity: number }) {
  await verifyAdmin();
  try {
    await prisma.gymClass.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        schedule: new Date(data.schedule),
        capacity: data.capacity,
      },
    });
    revalidatePath("/admin/personal-trainer");
    revalidatePath("/member/booking");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteGymClass(id: string) {
  await verifyAdmin();
  try {
    // Delete bookings first to avoid foreign key constraints
    await prisma.classBooking.deleteMany({
      where: { classId: id },
    });

    await prisma.gymClass.delete({
      where: { id },
    });
    revalidatePath("/admin/personal-trainer");
    revalidatePath("/member/booking");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateMembership(userId: string, data: { role: Role; endDate: string | null; name: string; email: string; phone: string }) {
  await verifyAdmin();
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: data.role,
        endDate: data.endDate ? new Date(data.endDate) : null,
        name: data.name,
        email: data.email,
        phoneNumber: data.phone
      },
    });
    revalidatePath("/admin/members");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function verifyTransaction(transactionId: string) {
  await verifyAdmin();
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { user: true },
    });

    if (!transaction) throw new Error("Transaction not found");
    if (transaction.status === "SUCCESS") throw new Error("Transaction already verified");

    let role = transaction.user.role;
    let endDate = transaction.user.endDate || new Date();

    if (endDate < new Date()) {
      endDate = new Date();
    }

    if (transaction.type === "BULANAN_REGULAR") {
      role = "MEMBER_REGULAR";
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (transaction.type === "BULANAN_VIP") {
      role = "MEMBER_VIP";
      endDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
    } else if (transaction.type === "HARIAN") {
      role = "MEMBER_REGULAR";
      endDate.setDate(endDate.getDate() + 1);
    }

    await prisma.$transaction([
      prisma.transaction.update({
        where: { id: transactionId },
        data: { status: "SUCCESS" },
      }),
      prisma.user.update({
        where: { id: transaction.userId },
        data: { role, endDate },
      }),
    ]);

    revalidatePath("/admin/transactions");
    revalidatePath("/admin/members");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Packages CRUD
export async function createMembershipPackage(data: { name: string; durationMonths: number; price: number; isPopular: boolean; description?: string; originalPrice?: number }) {
  await verifyAdmin();
  try {
    await prisma.membershipPackage.create({
      data: {
        name: data.name,
        durationMonths: data.durationMonths,
        price: data.price,
        isPopular: data.isPopular,
        description: data.description,
        originalPrice: data.originalPrice,
      }
    });
    revalidatePath("/admin/packages");
    revalidatePath("/member/packages");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateMembershipPackage(id: string, data: { name: string; durationMonths: number; price: number; isPopular: boolean; description?: string; originalPrice?: number }) {
  await verifyAdmin();
  try {
    await prisma.membershipPackage.update({
      where: { id },
      data: {
        name: data.name,
        durationMonths: data.durationMonths,
        price: data.price,
        isPopular: data.isPopular,
        description: data.description,
        originalPrice: data.originalPrice,
      }
    });
    revalidatePath("/admin/packages");
    revalidatePath("/member/packages");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteMembershipPackage(id: string) {
  await verifyAdmin();
  try {
    await prisma.membershipPackage.delete({ where: { id } });
    revalidatePath("/admin/packages");
    revalidatePath("/member/packages");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Guides CRUD
export async function createGuideVideo(data: { title: string; url: string; category: string }) {
  await verifyAdmin();
  try {
    await prisma.guideVideo.create({
      data: {
        title: data.title,
        url: data.url,
        category: data.category,
      }
    });
    revalidatePath("/admin/guides");
    revalidatePath("/member/guide");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateGuideVideo(id: string, data: { title: string; url: string; category: string }) {
  await verifyAdmin();
  try {
    await prisma.guideVideo.update({
      where: { id },
      data: {
        title: data.title,
        url: data.url,
        category: data.category,
      }
    });
    revalidatePath("/admin/guides");
    revalidatePath("/member/guide");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteGuideVideo(id: string) {
  await verifyAdmin();
  try {
    await prisma.guideVideo.delete({ where: { id } });
    revalidatePath("/admin/guides");
    revalidatePath("/member/guide");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function processQRCheckIn(userId: string) {
  try {
    await verifyAdmin();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { shortId: userId },
          { id: userId }
        ]
      }
    });

    if (!user) {
      return { success: false, error: "Member tidak ditemukan." };
    }

    if (user.endDate && new Date(user.endDate) < new Date()) {
      return { success: false, error: "KADALUARSA" };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if there is an active check-in today without checkOutTime
    const activeCheckIn = await prisma.checkIn.findFirst({
      where: {
        userId: user.id,
        timestamp: { gte: today },
        checkOutTime: null
      },
      orderBy: { timestamp: 'desc' }
    });

    if (activeCheckIn) {
      // Process Check-Out
      await prisma.checkIn.update({
        where: { id: activeCheckIn.id },
        data: { checkOutTime: new Date() }
      });
      revalidatePath("/admin/scanner");
      return {
        success: true,
        data: {
          name: user.name || "Member",
          email: user.email,
          role: user.role,
          shortId: user.shortId || user.id,
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          status: "checkout"
        }
      };
    }

    // Process Check-In
    const checkIn = await prisma.checkIn.create({
      data: { userId: user.id }
    });

    // Check for CONFIRMED PT sessions today
    const ptSession = await prisma.pTSession.findFirst({
      where: {
        memberId: user.id,
        status: "CONFIRMED",
        schedule: { gte: today, lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
      }
    });

    revalidatePath("/admin/scanner");

    return {
      success: true,
      data: {
        name: user.name || "Member",
        email: user.email,
        role: user.role,
        shortId: user.shortId || user.id,
        time: checkIn.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        status: "success",
        hasPTSession: !!ptSession
      }
    };
  } catch (error: any) {
    console.error("QR CheckIn Error:", error);
    return { success: false, error: "Terjadi kesalahan saat memproses QR." };
  }
}

export async function createMemberManually(data: {
  name: string;
  email: string;
  phone: string;
  role: Role;
  packageId: string;
  method: string;
  amount: number;
  description: string;
}) {
  const admin = await verifyAdmin();
  try {
    const dummyClerkId = `manual_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    let transactionTypeString = data.packageId;
    let endDate = new Date();

    const pkg = await prisma.membershipPackage.findUnique({ where: { id: data.packageId } });
    if (pkg) {
      transactionTypeString = pkg.name;
      endDate.setMonth(endDate.getMonth() + pkg.durationMonths);
    }

    const shortId = `PRN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          clerkUserId: dummyClerkId,
          email: data.email,
          name: data.name,
          phoneNumber: data.phone,
          role: data.role,
          endDate: endDate,
          shortId: shortId,
        }
      });

      await tx.cashFlow.create({
        data: {
          type: "INCOME",
          amount: data.amount,
          description: data.description,
          adminId: admin.id
        }
      });

      await tx.transaction.create({
        data: {
          amount: data.amount,
          type: transactionTypeString,
          method: data.method,
          status: "SUCCESS",
          userId: newUser.id,
          adminId: admin.id
        }
      });
    });

    revalidatePath("/admin/members");
    revalidatePath("/admin/transactions");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function confirmPTSession(id: string) {
  await verifyPTAccess();
  try {
    await prisma.pTSession.update({
      where: { id },
      data: { status: "CONFIRMED" }
    });
    revalidatePath("/admin/personal-trainer");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function startPTSession(id: string) {
  await verifyPTAccess();
  try {
    await prisma.pTSession.update({
      where: { id },
      data: {
        status: "ONGOING",
        actualStartTime: new Date()
      }
    });
    revalidatePath("/admin/personal-trainer");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function finishPTSession(id: string) {
  await verifyPTAccess();
  try {
    await prisma.pTSession.update({
      where: { id },
      data: {
        status: "COMPLETED",
        actualEndTime: new Date()
      }
    });
    revalidatePath("/admin/personal-trainer");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createManualTransaction(data: {
  userId?: string;
  type: string;
  method: string;
  amount: number;
  description: string;
  expiredDate?: string;
}) {
  const admin = await verifyAdmin();
  try {
    const transactionQueries: any[] = [];

    // Create cashflow entry
    transactionQueries.push(
      prisma.cashFlow.create({
        data: {
          type: "INCOME",
          amount: data.amount,
          description: data.description,
          adminId: admin.id
        }
      })
    );

    let targetUserId = data.userId;

    let transactionTypeString = data.type;
    let packageDurationMonths = 0;
    let isVip = false;

    if (data.type !== "HARIAN" && data.type !== "LAINNYA") {
      const pkg = await prisma.membershipPackage.findUnique({ where: { id: data.type } });
      if (pkg) {
        transactionTypeString = pkg.name;
        packageDurationMonths = pkg.durationMonths;
        isVip = pkg.name.toLowerCase().includes("vip");
      }
    }

    // Create transaction entry if member is linked
    if (targetUserId) {
      transactionQueries.push(
        prisma.transaction.create({
          data: {
            amount: data.amount,
            type: transactionTypeString,
            method: data.method,
            status: "SUCCESS",
            userId: targetUserId,
            adminId: admin.id
          }
        })
      );

      // Update user role/endDate if applicable
      const user = await prisma.user.findUnique({ where: { id: targetUserId } });
      if (user) {
        let endDate = user.endDate || new Date();
        if (endDate < new Date()) endDate = new Date();

        let newRole = user.role;

        // Custom Expired Date Override
        if (data.expiredDate) {
          endDate = new Date(data.expiredDate);
          if (packageDurationMonths > 0 || data.type === "HARIAN") {
            newRole = isVip ? "MEMBER_VIP" : "MEMBER_REGULAR";
          }
        } else {
          if (packageDurationMonths > 0) {
            newRole = isVip ? "MEMBER_VIP" : "MEMBER_REGULAR";
            endDate.setMonth(endDate.getMonth() + packageDurationMonths);
          } else if (data.type === "HARIAN") {
            newRole = "MEMBER_REGULAR";
            endDate.setDate(endDate.getDate() + 1);
          }
        }

        transactionQueries.push(
          prisma.user.update({
            where: { id: targetUserId },
            data: { role: newRole, endDate }
          })
        );
      }
    }

    await prisma.$transaction(transactionQueries);

    revalidatePath("/admin/transactions");
    revalidatePath("/admin/dashboard");
    if (targetUserId) revalidatePath("/admin/members");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePTSetting(data: { pricePerSession: string | number; availableDays: string[]; startTime: string; endTime: string }) {
  await verifyAdmin(); // Or we could verify Superadmin, but currently our check is admin

  // Verify superadmin for this specific action
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { role: true },
  });

  if (!user || user.role.toUpperCase() !== "SUPERADMIN") {
    throw new Error("Forbidden: Superadmin only");
  }

  try {
    let parsedPrice = 0;
    if (typeof data.pricePerSession === 'string') {
      parsedPrice = parseInt(data.pricePerSession.replace(/\./g, ''), 10) || 0;
    } else {
      parsedPrice = data.pricePerSession || 0;
    }

    const existing = await prisma.pTSetting.findFirst();
    if (existing) {
      await prisma.pTSetting.update({
        where: { id: existing.id },
        data: {
          pricePerSession: parsedPrice,
          availableDays: data.availableDays,
          startTime: data.startTime,
          endTime: data.endTime
        }
      });
    } else {
      await prisma.pTSetting.create({
        data: {
          pricePerSession: parsedPrice,
          availableDays: data.availableDays,
          startTime: data.startTime,
          endTime: data.endTime
        }
      });
    }
    revalidatePath("/admin/personal-trainer");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createPTScheduleSlot(data: {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  trainerId?: string | number | null;
  trainerName?: string | null;
  trainerInput?: string;
  maxCapacity?: number;
}) {
  await verifyAdmin();
  try {
    let finalTrainerId: string | null = null;
    let finalTrainerName: string | null = null;

    if (data.trainerId) {
      finalTrainerId = String(data.trainerId);
    } else if (data.trainerName) {
      finalTrainerName = data.trainerName;
    } else if (data.trainerInput) {
      // Fallback for previous frontend implementation
      const userMatch = await prisma.user.findFirst({
        where: {
          OR: [
            { id: data.trainerInput },
            { name: data.trainerInput }
          ],
          role: { in: ["ADMIN", "SUPERADMIN"] }
        }
      });
      if (userMatch) {
        finalTrainerId = userMatch.id;
      } else {
        finalTrainerName = data.trainerInput;
      }
    }

    await prisma.pTScheduleSlot.create({
      data: {
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        trainerId: finalTrainerId,
        trainerName: finalTrainerName,
        maxCapacity: data.maxCapacity ?? 1
      }
    });
    revalidatePath("/admin/personal-trainer");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePTScheduleSlot(id: string) {
  await verifyAdmin();
  try {
    await prisma.pTScheduleSlot.delete({
      where: { id }
    });
    revalidatePath("/admin/personal-trainer");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
