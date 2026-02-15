import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: '/services', destination: '/kpi-library', permanent: true }];
  },
};

export default nextConfig;
