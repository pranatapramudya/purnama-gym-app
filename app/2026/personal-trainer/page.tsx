import { prisma } from "@/lib/prisma";
import ClassesClient from "./ClassesClient";
import { auth } from "@clerk/nextjs/server";

export default async function ClassesPage() {
  const { userId } = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { clerkUserId: userId! },
    select: { id: true, role: true }
  });

  const sessionWhereClause = currentUser?.role === "TRAINER" 
    ? { trainerId: currentUser.id }
    : {};

  const sessions = await prisma.pTSession.findMany({
    where: sessionWhereClause,
    orderBy: { schedule: "asc" },
    include: {
      member: { select: { name: true, email: true } },
      trainer: { select: { name: true } }
    }
  });

  const formattedSessions = sessions.map(s => ({
    id: s.id,
    memberName: s.member.name || "Member",
    trainerName: s.trainer?.name || "Belum ditugaskan",
    schedule: s.schedule.toISOString(),
    status: s.status,
  }));

  const scheduleSlots = await prisma.pTScheduleSlot.findMany({
    orderBy: { startTime: 'asc' },
    include: { trainer: { select: { name: true } } }
  });

  const trainers = await prisma.user.findMany({
    where: { role: { in: ["ADMIN_KASIR", "SUPER_ADMIN", "TRAINER"] } },
    select: { id: true, name: true, email: true }
  });

  return <ClassesClient initialSessions={formattedSessions} userRole={currentUser?.role || "ADMIN_KASIR"} initialSlots={scheduleSlots as any} trainers={trainers} />;
}
