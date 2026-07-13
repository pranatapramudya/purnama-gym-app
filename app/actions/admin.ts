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

  if (!user || (user.role.toUpperCase() !== "ADMIN_KASIR" && user.role.toUpperCase() !== "SUPER_ADMIN")) {
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

  if (!user || !["ADMIN_KASIR", "SUPER_ADMIN", "TRAINER"].includes(user.role.toUpperCase())) {
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
    revalidatePath("/2026/personal-trainer");
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
    revalidatePath("/2026/personal-trainer");
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
    revalidatePath("/2026/personal-trainer");
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
    revalidatePath("/2026/members");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteMembership(userId: string) {
  await verifyAdmin();
  try {
    // Delete related records to prevent foreign key constraint failures if necessary
    // E.g., transactions, check-ins, etc.
    await prisma.user.delete({
      where: { id: userId },
    });
    revalidatePath("/2026/members");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Gagal menghapus member: " + error.message };
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
      role = "MEMBER";
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (transaction.type === "BULANAN_VIP") {
      role = "MEMBER";
      endDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
    } else if (transaction.type === "HARIAN") {
      role = "MEMBER";
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

    revalidatePath("/2026/transactions");
    revalidatePath("/2026/members");
    revalidatePath("/2026/dashboard");
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
    revalidatePath("/2026/packages");
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
    revalidatePath("/2026/packages");
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
    revalidatePath("/2026/packages");
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
    revalidatePath("/2026/guides");
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
    revalidatePath("/2026/guides");
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
    revalidatePath("/2026/guides");
    revalidatePath("/member/guide");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function processQRCheckIn(userId: string) {
  try {
    await verifyAdmin();

    const searchId = userId.includes("-") ? userId.split("-")[1] : userId;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { shortId: userId },
          { id: userId },
          { id: { endsWith: searchId } }
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
      revalidatePath("/2026/scanner");
      return {
        success: true,
        data: {
          name: user.name || "Member",
          email: user.email,
          role: user.role,
          shortId: user.shortId || user.id,
          time: new Date().toISOString(),
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

    revalidatePath("/2026/scanner");

    return {
      success: true,
      data: {
        name: user.name || "Member",
        email: user.email,
        role: user.role,
        shortId: user.shortId || user.id,
        time: checkIn.timestamp.toISOString(),
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
  existingUserId?: string;
}) {
  const admin = await verifyAdmin();
  try {
    const dummyClerkId = `manual_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    let transactionTypeString = data.packageId;
    let endDate = new Date();

    const pkg = await prisma.membershipPackage.findUnique({ where: { id: data.packageId } });
    if (pkg) {
      transactionTypeString = pkg.name;
      // If durationMonths is 0, it's Daily Visit (+1 day), else add months
      if (pkg.durationMonths === 0) {
        endDate.setDate(endDate.getDate() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + pkg.durationMonths);
      }
    }

    const shortId = `PRN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    await prisma.$transaction(async (tx) => {
      let targetUserId = data.existingUserId;

      if (targetUserId) {
        // Update existing user
        await tx.user.update({
          where: { id: targetUserId },
          data: {
            role: data.role,
            endDate: endDate,
          }
        });
      } else {
        // Create new user
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
        targetUserId = newUser.id;
      }

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
          userId: targetUserId,
          adminId: admin.id
        }
      });
    });

    revalidatePath("/2026/members");
    revalidatePath("/2026/transactions");
    revalidatePath("/2026/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function checkExistingUserByEmail(email: string) {
  await verifyAdmin();
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, phoneNumber: true }
    });
    return { success: true, user };
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
    revalidatePath("/2026/personal-trainer");
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
    revalidatePath("/2026/personal-trainer");
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
    revalidatePath("/2026/personal-trainer");
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
            newRole = isVip ? "MEMBER" : "MEMBER";
          }
        } else {
          if (packageDurationMonths > 0) {
            newRole = isVip ? "MEMBER" : "MEMBER";
            endDate.setMonth(endDate.getMonth() + packageDurationMonths);
          } else if (data.type === "HARIAN") {
            newRole = "MEMBER";
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

    revalidatePath("/2026/transactions");
    revalidatePath("/2026/dashboard");
    if (targetUserId) revalidatePath("/2026/members");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePTSetting(data: { pricePerSession: string | number; discountPercentage?: string | number | null; }) {
  await verifyAdmin(); // Or we could verify Superadmin, but currently our check is admin

  // Verify superadmin for this specific action
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { role: true },
  });

  if (!user || user.role.toUpperCase() !== "SUPER_ADMIN") {
    throw new Error("Forbidden: Superadmin only");
  }

  try {
    let parsedPrice = 0;
    if (typeof data.pricePerSession === 'string') {
      parsedPrice = parseInt(data.pricePerSession.replace(/\./g, ''), 10) || 0;
    } else {
      parsedPrice = data.pricePerSession || 0;
    }

    let parsedDiscount = 0;
    if (data.discountPercentage !== undefined && data.discountPercentage !== null && data.discountPercentage !== "") {
      if (typeof data.discountPercentage === 'string') {
        parsedDiscount = parseInt(data.discountPercentage.replace(/\D/g, ''), 10) || 0;
      } else {
        parsedDiscount = Number(data.discountPercentage) || 0;
      }
    }

    const existing = await prisma.pTSetting.findFirst();
    if (existing) {
      await prisma.pTSetting.update({
        where: { id: existing.id },
        data: {
          pricePerSession: parsedPrice,
          discountPercentage: parsedDiscount,
        }
      });
    } else {
      await prisma.pTSetting.create({
        data: {
          pricePerSession: parsedPrice,
          discountPercentage: parsedDiscount,
        }
      });
    }
    revalidatePath("/2026/personal-trainer");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createPTScheduleSlot(data: {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  targetDate?: string;
  trainerId?: string | number | null;
  trainerName?: string | null;
  trainerInput?: string;
  maxCapacity?: number;
  price?: number;
  discountPercentage?: number;
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
          role: { in: ["ADMIN_KASIR", "SUPER_ADMIN"] }
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
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
        startTime: data.startTime,
        endTime: data.endTime,
        trainerId: finalTrainerId,
        trainerName: finalTrainerName,
        maxCapacity: data.maxCapacity ?? 1,
        price: data.price ?? 100000,
        discountPercentage: data.discountPercentage ?? 0
      }
    });
    revalidatePath("/2026/personal-trainer");
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
    revalidatePath("/2026/personal-trainer");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
