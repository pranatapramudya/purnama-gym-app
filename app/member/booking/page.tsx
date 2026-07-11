import { currentUser } from "@clerk/nextjs/server";
import { getAvailablePTSlots } from "@/app/actions/pt";
import BookingClient from "./BookingClient";
import { prisma } from "@/lib/prisma";

export default async function BookingPage() {
  const user = await currentUser();
  
  const res = await getAvailablePTSlots();
  const slots = res.success ? res.slots : [];
  const ptSetting = res.success ? res.ptSetting : null;

  return <BookingClient initialSlots={slots as any[]} ptSetting={ptSetting} />;
}
