import { prisma } from "@/lib/prisma";
import GuideClient from "./GuideClient";

export default async function GuidePage() {
  const guides = await prisma.guideVideo.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <GuideClient initialGuides={guides} />;
}
