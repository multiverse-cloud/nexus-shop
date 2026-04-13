import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  experimental: {
    serverActions: {
      allowedOrigins: [
        'preview-chat-f30e2c47-2080-4c93-afc0-2d58747afd55.space.z.ai',
        '*.space.z.ai',
        '*.fcapp.run',
        'ws-bf-ea-fcbeae-mfzhoahezy.cn-hongkong-vpc.fcapp.run',
      ],
    },
  },
  // Allow server actions from preview environments
  allowedDevOrigins: [
    'preview-chat-f30e2c47-2080-4c93-afc0-2d58747afd55.space.z.ai',
    'ws-bf-ea-fcbeae-mfzhoahezy.cn-hongkong-vpc.fcapp.run',
    '.space.z.ai',
    '.fcapp.run',
  ],
};

export default nextConfig;
