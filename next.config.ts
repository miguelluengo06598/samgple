import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['blondish-precedentless-luise.ngrok-free.dev'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig