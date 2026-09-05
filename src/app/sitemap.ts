import type { MetadataRoute } from 'next'

/** Zamijeniti kad se veze prava domena. */
const BASE = 'https://edivovina.vercel.app'

/** Samo naslovnica: rute se vracaju kad se vrati sadrzaj. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: BASE, changeFrequency: 'monthly', priority: 1 }]
}
