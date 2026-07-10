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
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    throw new Error("Forbidden: Admins only");
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
    revalidatePath("/admin/classes");
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
    revalidatePath("/admin/classes");
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
    revalidatePath("/admin/classes");
    revalidatePath("/member/booking");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateMembership(userId: string, data: { role: Role; endDate: string | null }) {
  await verifyAdmin();
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: data.role,
        endDate: data.endDate ? new Date(data.endDate) : null,
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
      endDate.setDate(endDate.getDate() + 30);
    } else if (transaction.type === "BULANAN_VIP") {
      role = "MEMBER_VIP";
      endDate.setDate(endDate.getDate() + 30);
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

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return { success: false, error: "Member tidak ditemukan." };
    }

    if (user.role === "MEMBER_VIP") {
      if (!user.endDate || new Date(user.endDate) < new Date()) {
        return { success: false, error: "Masa aktif VIP sudah berakhir." };
      }
    }

    // Buat check-in record
    const checkIn = await prisma.checkIn.create({
      data: {
        userId: user.id
      },
      include: {
        user: true
      }
    });

    revalidatePath("/admin/scanner");

    return { 
      success: true, 
      data: {
        name: checkIn.user.name || "Member",
        email: checkIn.user.email,
        role: checkIn.user.role,
        time: checkIn.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        status: "success"
      } 
    };
  } catch (error: any) {
    console.error("QR CheckIn Error:", error);
    return { success: false, error: "Terjadi kesalahan saat memproses QR." };
  }
}
