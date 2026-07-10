import { prisma } from "@/lib/prisma";
import BookingClient from "./BookingClient";
import { currentUser } from "@clerk/nextjs/server";

export default async function BookingPage() {
  const user = await currentUser();
  
  // Ambil user dari database untuk tahu id-nya
  let dbUser = null;
  if (user) {
    dbUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
    });
  }

  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Ambil sesi PT di masa depan (H+1)
  const gymClasses = await prisma.gymClass.findMany({
    where: {
      schedule: {
        gte: tomorrow,
      }
    },
    orderBy: { schedule: "asc" },
    include: {
      _count: {
        select: { bookings: true }
      },
      bookings: dbUser ? {
        where: { userId: dbUser.id }
      } : false
    }
  });

  const formattedClasses = gymClasses.map(gc => ({
    id: gc.id,
    name: gc.name,
    description: gc.description || "",
    category: gc.category,
    schedule: gc.schedule.toISOString(),
    capacity: gc.capacity,
    booked: gc._count.bookings,
    isBooked: gc.bookings ? gc.bookings.length > 0 : false
  }));

  const dbCategories = await prisma.gymClass.findMany({
    select: { category: true },
    distinct: ['category'],
  });

  const categories = ["Semua", ...dbCategories.map(c => c.category)];

  return <BookingClient initialClasses={formattedClasses} categories={categories} />;
}
