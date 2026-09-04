import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Bez Next.js dev bedza u kadru
  devIndicators: false,
  images: { formats: ['image/webp'] },
}

export default nextConfig
