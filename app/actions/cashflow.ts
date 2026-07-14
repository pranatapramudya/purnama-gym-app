"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateCashflow(id: string, amount: number, description: string) {
  try {
    if (!id || amount === undefined || !description) {
      throw new Error("Data tidak lengkap.");
    }

    await prisma.cashFlow.update({
      where: { id },
      data: {
        amount,
        description,
      },
    });

    revalidatePath("/2026/kasir");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating cashflow:", error);
    return { error: error.message || "Gagal mengupdate transaksi." };
  }
}

export async function deleteCashflow(id: string, userRole: string) {
  try {
    if (userRole !== "SUPER_ADMIN") {
      throw new Error("Akses ditolak: Hanya Owner yang bisa menghapus data.");
    }

    if (!id) {
      throw new Error("ID tidak valid.");
    }

    await prisma.cashFlow.delete({
      where: { id },
    });

    revalidatePath("/2026/kasir");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting cashflow:", error);
    return { error: error.message || "Gagal menghapus transaksi." };
  }
}

export async function uploadToCloudinary(base64Image: string) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary credentials are not configured in environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET).");
    }

    // Convert base64 to Blob
    const base64Data = base64Image.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: 'image/jpeg' });

    const safeName = "bukti-" + Date.now() + ".jpg";

    const formData = new FormData();
    formData.append("file", blob, safeName);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || "Failed to upload to Cloudinary");
    }

    return { secureUrl: data.secure_url as string };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return { error: error.message || "Gagal mengunggah gambar." };
  }
}
