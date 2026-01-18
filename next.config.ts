import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Enable static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  // Set basePath for GitHub Pages (repo name)
  basePath: '/orchademy_poc',
  trailingSlash: true,
};

export default nextConfig;
