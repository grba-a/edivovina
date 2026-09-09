import type { MetadataRoute } from 'next'
import { WINES } from '@/data/wines'

/** Zamijeniti kad se veze prava domena. */
const BASE = 'https://edivovina.vercel.app'

/**
 * Sedam stranica + deset proizvoda + jedna Woo kategorija.
 *
 * Rute su NJIHOVE: arhiva /wines, kategorija /wines/undersea, proizvodi
 * /product/[slug] — pa se indeksirani URL-ovi ne razilaze pri presnimavanju.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/wines`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/wines/undersea`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about`, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${BASE}/visit`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/news`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/gallery`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/contact`, changeFrequency: 'yearly', priority: 0.6 },
  ]

  const products: MetadataRoute.Sitemap = WINES.map((w) => ({
    url: `${BASE}/product/${w.slug}`,
    changeFrequency: 'monthly' as const,
    priority: w.featured ? 0.9 : 0.6,
  }))

  return [...pages, ...products]
}
