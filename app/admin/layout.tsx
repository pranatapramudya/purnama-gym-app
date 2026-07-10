import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";
  
  if (pathname.includes("/admin/sign-in")) {
    return <>{children}</>;
  }

  // Proteksi rute: pastikan user sudah login dari Clerk
  const { userId } = await auth();

  if (!userId) {
    // PRD-v3.2: Dilarang keras mengarahkan ke halaman utama (/) atau rute autentikasi Clerk.
    // Paksa arahkan ke dashboard member.
    redirect("/member/dashboard");
  }

  // Cek role ADMIN dari database
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { role: true, name: true },
  });

  // PRD-v3.2: Jika proses pencarian di Prisma mengembalikan nilai kosong ATAU status role pengguna bukanlah ADMIN,
  // wajib membuang ke rute dashboard member (/member/dashboard).
  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/member/dashboard");
  }

  return (
    <div className="flex h-[100dvh] bg-slate-100">
      <AdminSidebar adminName={dbUser.name || "Admin"} />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
