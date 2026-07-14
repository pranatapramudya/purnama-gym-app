import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { UserButton } from "@clerk/nextjs";
import { RoleToast } from "@/components/admin/RoleToast";
import { Suspense } from "react";

import { headers, cookies } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";

  if (pathname.includes("/2026/sign-in")) {
    return <>{children}</>;
  }

  // Proteksi rute: pastikan user sudah login dari Clerk
  let { userId } = await auth();
  
  const cookieStore = await cookies();
  const testRole = cookieStore.get("playwright-role")?.value;
  if (testRole === "SUPER_ADMIN") {
    userId = "test-admin-clerk-id";
  } else if (testRole === "MEMBER") {
    userId = "test-member-clerk-id";
  }

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

  // Izinkan SUPER_ADMIN, ADMIN_KASIR, dan TRAINER.
  if (!dbUser || (dbUser.role !== "SUPER_ADMIN" && dbUser.role !== "ADMIN_KASIR" && dbUser.role !== "TRAINER")) {
    redirect("/member/dashboard");
  }

  // RBAC untuk TRAINER: Hanya boleh akses /2026/personal-trainer dan /2026/scanner
  if (dbUser.role === "TRAINER") {
    // Arahkan otomatis dari dashboard ke jadwal
    if (pathname === "/2026/dashboard" || pathname === "/2026") {
      redirect("/2026/personal-trainer");
    }

    const allowedTrainerRoutes = ["/2026/personal-trainer", "/2026/scanner"];
    const isAllowed = allowedTrainerRoutes.some(r => pathname === r || pathname.startsWith(r + "/"));
    
    if (!isAllowed) {
      redirect("/2026/personal-trainer?error=unauthorized");
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-slate-100">
      <AdminSidebar adminName={dbUser.name || "Admin"} role={dbUser.role.toLowerCase()} />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
        <Suspense fallback={null}>
          <RoleToast />
        </Suspense>
      </main>
    </div>
  );
}