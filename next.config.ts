import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [new URL('https://ik.imagekit.io/**')]
  },
  // Enable standalone output for Docker deployment
  output: 'standalone'
}

export default nextConfig
