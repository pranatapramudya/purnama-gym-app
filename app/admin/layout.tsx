import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { UserButton } from "@clerk/nextjs";
import { RoleToast } from "@/components/admin/RoleToast";
import { Suspense } from "react";

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

  // PRD-v3.2, v3.52 & v3.87: Izinkan ADMIN, SUPERADMIN, dan TRAINER.
  if (!dbUser || (dbUser.role !== "ADMIN" && dbUser.role !== "SUPERADMIN" && dbUser.role !== "TRAINER")) {
    redirect("/member/dashboard");
  }

  // RBAC untuk TRAINER: Hanya boleh akses /admin/personal-trainer dan /admin/scanner
  if (dbUser.role === "TRAINER") {
    // Arahkan otomatis dari dashboard ke jadwal
    if (pathname === "/admin/dashboard" || pathname === "/admin") {
      redirect("/admin/personal-trainer");
    }

    const allowedTrainerRoutes = ["/admin/personal-trainer", "/admin/scanner"];
    const isAllowed = allowedTrainerRoutes.some(r => pathname === r || pathname.startsWith(r + "/"));
    
    if (!isAllowed) {
      redirect("/admin/personal-trainer?error=unauthorized");
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-slate-100">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md shadow-rose-500/20">
            <span className="text-white text-sm font-black tracking-tighter">PG</span>
          </div>
          <span className="font-extrabold text-slate-900 tracking-tight">Admin Panel</span>
        </div>
        <UserButton />
      </header>

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