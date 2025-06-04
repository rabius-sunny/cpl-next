import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://ik.imagekit.io/**')]
  },
  // Enable standalone output for Docker deployment
  output: 'standalone'
}

export default nextConfig
