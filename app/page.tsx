import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    // Cek apakah admin
    const { prisma } = await import('@/lib/prisma');
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { role: true },
    });
    
    if (dbUser?.role === 'ADMIN') {
      redirect('/admin/dashboard');
    } else {
      redirect('/member/dashboard');
    }
  }

  // Jika belum login, paksa ke halaman Sign In
  redirect('/sign-in');
}