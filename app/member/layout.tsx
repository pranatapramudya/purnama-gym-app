import { BottomNav } from "@/components/BottomNav";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Solusi Wajib 1: Auto-Sync User ke Prisma (Auth Wrapper)
  const clerkUser = await currentUser();
  
  if (clerkUser) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (!dbUser) {
      await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || `no-email-${clerkUser.id}@gym.com`,
          name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName}`.trim() : "Member",
          role: "MEMBER_REGULAR", // Menyesuaikan dengan schema yang ada (bukan MEMBER)
        },
      });
    }
  }

  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col bg-slate-100 text-slate-900 selection:bg-rose-500/30 font-sans">
      <main className="flex-1 overflow-y-auto w-full max-w-md mx-auto relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-2xl border-x border-slate-200 pb-24">
        {children}
        <BottomNav />
      </main>
    </div>
  );
}
