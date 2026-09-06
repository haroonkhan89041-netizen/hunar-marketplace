import type { MetadataRoute } from 'next'

const baseUrl = 'https://hunar-marketplace.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/talent',
    '/work',
    '/categories',
    '/how-it-works',
    '/login',
    '/signup',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }))
}
