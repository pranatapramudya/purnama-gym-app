"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

export type CreateStaffResponse = {
  success: boolean;
  message?: string;
  email?: string;
  password?: string;
};

function generateStrongPassword(length = 12): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
}

export async function createStaffAccount(data: {
  name: string;
  email: string;
  role: "ADMIN" | "TRAINER";
}): Promise<CreateStaffResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const superAdmin = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!superAdmin || superAdmin.role !== "SUPERADMIN") {
      return { success: false, message: "Forbidden: Only Super Admin can create staff accounts" };
    }

    const password = generateStrongPassword(12);

    const nameParts = data.name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "Purnama";
    const username = `${firstName.toLowerCase()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const client = await clerkClient();
    const newClerkUser = await client.users.createUser({
      emailAddress: [data.email],
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });

    await prisma.user.create({
      data: {
        clerkUserId: newClerkUser.id,
        email: data.email,
        name: data.name,
        role: data.role as Role,
      },
    });

    return {
      success: true,
      email: data.email,
      password: password,
    };
  } catch (error: any) {
    console.error("Error creating staff account:", error);
    return {
      success: false,
      message: error.errors?.[0]?.longMessage || error.message || "Failed to create staff account",
    };
  }
}

export async function deleteStaffAccount(userId: string, targetClerkUserId: string) {
  try {
    const { userId: currentClerkUserId } = await auth();
    if (!currentClerkUserId) return { success: false, message: "Unauthorized" };

    const superAdmin = await prisma.user.findUnique({
      where: { clerkUserId: currentClerkUserId },
      select: { role: true }
    });

    if (!superAdmin || superAdmin.role !== "SUPERADMIN") {
      return { success: false, message: "Forbidden: Only Super Admin can delete staff accounts" };
    }

    if (currentClerkUserId === targetClerkUserId) {
      return { success: false, message: "Super Admin tidak dapat menghapus akunnya sendiri" };
    }

    const client = await clerkClient();
    await client.users.deleteUser(targetClerkUserId);
    
    await prisma.user.delete({ 
      where: { id: userId } 
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting staff account:", error);
    return {
      success: false,
      message: error.errors?.[0]?.longMessage || error.message || "Gagal menghapus akun karyawan",
    };
  }
}
