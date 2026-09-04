import type { MetadataRoute } from 'next'
import { WINES } from '@/data/wines'

/** Zamijeniti kad se veze prava domena. */
const BASE = 'https://edivovina.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/wines', '/story', '/visit', '/gallery', '/contact']
  return [
    ...pages.map((p) => ({
      url: BASE + p,
      changeFrequency: 'monthly' as const,
      priority: p === '' ? 1 : 0.8,
    })),
    ...WINES.map((w) => ({
      url: `${BASE}/wines/${w.slug}`,
      changeFrequency: 'monthly' as const,
      priority: w.featured ? 0.9 : 0.6,
    })),
  ]
}
