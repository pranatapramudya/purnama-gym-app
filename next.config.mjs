/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  // Paksa Next.js buat nge-transpile Clerk supaya jalurnya nggak korup
  transpilePackages: ["@clerk/nextjs"],
  
  // Matikan fitur-fitur eksperimental yang mungkin bikin bentrok
  experimental: {
    // Kosongkan dulu kalau ada isinya
  },
  turbopack: {}
};

export default withPWA(nextConfig);
