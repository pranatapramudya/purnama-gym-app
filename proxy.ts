import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isMemberRoute = createRouteMatcher(["/member(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const authObj = await auth();
  const userId = authObj.userId;
  // Membaca custom role dari publicMetadata yang disisipkan ke sessionClaims (membutuhkan konfigurasi JWT template di Clerk)
  const role = (authObj.sessionClaims?.metadata as { role?: string })?.role;

  // Proteksi akses untuk user yang belum login
  if (!userId && (isAdminRoute(req) || isMemberRoute(req))) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
