import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Enable static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  // Optional: If your repo name is not the root, uncomment and set basePath
  // basePath: '/orchademy_poc',
  // trailingSlash: true,
};

export default nextConfig;
