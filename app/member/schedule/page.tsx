import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import ScheduleClient from "./ScheduleClient";

export default async function SchedulePage() {
  const user = await currentUser();
  
  if (!user) {
    return <div>Harap login terlebih dahulu.</div>;
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (!dbUser) {
    return <div>User tidak ditemukan di database.</div>;
  }

  // Fetch only future bookings for the current user
  const bookings = await prisma.classBooking.findMany({
    where: { 
      userId: dbUser.id,
      gymClass: {
        schedule: {
          gte: new Date(),
        }
      }
    },
    include: {
      gymClass: true,
    },
    orderBy: {
      gymClass: {
        schedule: 'asc'
      }
    }
  });

  // Map to the format expected by ScheduleClient
  const myClasses = bookings.map(b => ({
    id: b.id, // We use booking ID so we can cancel it
    classId: b.gymClass.id, // We need this to pass to the server action
    title: b.gymClass.name,
    instructor: b.gymClass.description || "Coach Gym",
    schedule: b.gymClass.schedule.toISOString(),
    location: "Studio 1",
    tag: b.gymClass.category,
  }));

  return <ScheduleClient initialClasses={myClasses} />;
}
