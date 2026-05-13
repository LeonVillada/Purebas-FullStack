import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - Algunas versiones de Next.js requieren esto para acceso desde IP local
  allowedDevOrigins: ['192.168.1.7', 'localhost:3000'],
};

export default nextConfig;
