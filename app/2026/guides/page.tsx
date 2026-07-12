import { prisma } from "@/lib/prisma";
import GuidesClient from "./GuidesClient";

type PageProps = {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function GuidesPage(props: PageProps) {
  const guides = await prisma.guideVideo.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formattedGuides = guides.map((guide) => ({
    id: guide.id,
    title: guide.title,
    url: guide.url,
    category: guide.category,
  }));

  return <GuidesClient initialGuides={formattedGuides} />;
}
