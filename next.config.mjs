/** @type {import('next').NextConfig} */
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
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

export default withSerwist(nextConfig);
