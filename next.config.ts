import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ytydvrluotcuprnjrghj.supabase.co",
        pathname: "/storage/v1/object/public/product-images/**"
      }
    ],
    unoptimized: true
  }
};

export default nextConfig;
