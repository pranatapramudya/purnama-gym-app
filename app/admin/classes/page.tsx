import { prisma } from "@/lib/prisma";
import ClassesClient from "./ClassesClient";

export default async function ClassesPage() {
  const gymClasses = await prisma.gymClass.findMany({
    orderBy: { schedule: "asc" },
    include: {
      _count: {
        select: { bookings: true }
      }
    }
  });

  const formattedClasses = gymClasses.map(gc => ({
    id: gc.id,
    name: gc.name,
    description: gc.description || "",
    category: gc.category,
    schedule: gc.schedule.toISOString(),
    capacity: gc.capacity,
    booked: gc._count.bookings
  }));

  return <ClassesClient initialClasses={formattedClasses} />;
}
