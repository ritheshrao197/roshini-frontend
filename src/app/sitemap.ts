import { MetadataRoute } from 'next';
import { getAllProducts, getVlogs } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://roshinis.com';

  // Base static paths
  const staticPaths = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/shop`, lastModified: new Date() },
    { url: `${baseUrl}/blogs`, lastModified: new Date() },
    { url: `${baseUrl}/cart`, lastModified: new Date() },
  ];

  // Dynamic Product Paths
  let productPaths: any[] = [];
  try {
    const products = await getAllProducts();
    productPaths = products.map((p) => {
      const slug = p.slug || p.pName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return {
        url: `${baseUrl}/product/${slug}`,
        lastModified: new Date(p.createdAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    });
  } catch (e) {
    console.error('Sitemap product generation error:', e);
  }

  // Dynamic Blog Paths
  let blogPaths: any[] = [];
  try {
    const { vlogs } = await getVlogs(1, 100);
    blogPaths = vlogs.map((v) => ({
      url: `${baseUrl}/blogs/${v.slug}`,
      lastModified: new Date(v.publishDate || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (e) {
    console.error('Sitemap blog generation error:', e);
  }

  return [...staticPaths, ...productPaths, ...blogPaths];
}
