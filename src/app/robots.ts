import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/account/', '/dashboard/'],
    },
    sitemap: 'https://roshinis.com/sitemap.xml',
  };
}
