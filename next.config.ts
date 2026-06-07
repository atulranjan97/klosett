import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https', // sirf http wali images allowed
        hostname: 'lh3.googleusercontent.com', // sirf Google ke server se images allowed
        pathname: '**', // is domain ke sare paths allowed
      },
    ],
  },
};

export default nextConfig;
