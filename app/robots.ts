import type { MetadataRoute } from 'next'

const baseUrl = 'https://hunar-marketplace.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/profile', '/orders', '/messages', '/proposals', '/checkout'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
