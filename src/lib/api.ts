export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, "")
  : "http://localhost:8000";

export const API_URL = `${BACKEND_URL}/api`;

export interface Product {
  _id: string;
  pName: string;
  pDescription: string;
  pPrice: number;
  pSold: number;
  pQuantity: number;
  pCategory: {
    _id: string;
    cName: string;
  } | string;
  pImages: string[];
  pOffer: string | null;
  pRatingsReviews: any[];
  pStatus: string;
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  nutritionalInfo?: Record<string, string>;
  benefits?: string[];
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
}

export interface Category {
  _id: string;
  cName: string;
  cDescription: string;
  cImage: string;
  cStatus: string;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await fetchWithTimeout(`${API_URL}/product/all-product`, {
      next: { revalidate: 60 }, // Cache on server for 60 seconds
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    return data.Products || [];
  } catch (err) {
    console.error("getAllProducts Error:", err);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetchWithTimeout(`${API_URL}/category/all-category`, {
      next: { revalidate: 300 }, // Cache on server for 5 minutes
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    return data.Categories || [];
  } catch (err) {
    console.error("getCategories Error:", err);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.featured === true || p.pSold > 10).slice(0, 8);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  // Match slug or match by Mongo ID as fallback
  const found = products.find(
    (p) => p.slug === slug || p._id === slug || p.pName.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
  );
  return found || null;
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  const products = await getAllProducts();
  const catId = typeof product.pCategory === "object" ? product.pCategory._id : product.pCategory;
  
  return products
    .filter((p) => {
      const pCatId = typeof p.pCategory === "object" ? p.pCategory._id : p.pCategory;
      return p._id !== product._id && pCatId === catId;
    })
    .slice(0, 4);
}

export interface VlogCategory {
  _id: string;
  cName: string;
  cDescription: string;
  slug: string;
  cStatus: string;
}

export interface VlogTag {
  _id: string;
  name: string;
  slug: string;
}

export interface Vlog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail?: string;
  vCategory: VlogCategory;
  vTags?: VlogTag[];
  isPublished: boolean;
  publishDate?: string;
  viewCount: number;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getVlogs(page = 1, limit = 10): Promise<{ vlogs: Vlog[], totalPages: number }> {
  try {
    const res = await fetchWithTimeout(`${API_URL}/vlogs?page=${page}&limit=${limit}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch vlogs");
    const data = await res.json();
    return { vlogs: data.vlogs || [], totalPages: data.totalPages || 1 };
  } catch (err) {
    console.error("getVlogs Error:", err);
    return { vlogs: [], totalPages: 1 };
  }
}

export async function getFeaturedVlogs(): Promise<Vlog[]> {
  try {
    const res = await fetchWithTimeout(`${API_URL}/vlogs/featured`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch featured vlogs");
    const data = await res.json();
    return data.vlogs || [];
  } catch (err) {
    console.error("getFeaturedVlogs Error:", err);
    return [];
  }
}

export async function getVlogBySlug(slug: string): Promise<Vlog | null> {
  try {
    const res = await fetchWithTimeout(`${API_URL}/vlogs/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch vlog");
    const data = await res.json();
    return data.vlog || null;
  } catch (err) {
    console.error("getVlogBySlug Error:", err);
    return null;
  }
}

export async function getVlogCategories(): Promise<VlogCategory[]> {
  try {
    const res = await fetchWithTimeout(`${API_URL}/vlog-categories`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error("Failed to fetch vlog categories");
    const data = await res.json();
    return data.Categories || [];
  } catch (err) {
    console.error("getVlogCategories Error:", err);
    return [];
  }
}

export interface Achievement {
  _id: string;
  title: string;
  subtitle: string;
  type: string;
  icon: string;
  value?: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
}

export async function getAchievements(): Promise<Achievement[]> {
  try {
    const res = await fetchWithTimeout(`${API_URL}/achievements`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch achievements");
    const data = await res.json();
    return data.achievements || [];
  } catch (err) {
    console.error("getAchievements Error:", err);
    return [];
  }
}

export async function getHeroSliders(): Promise<any[]> {
  try {
    const res = await fetchWithTimeout(`${API_URL}/sliders/active`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch sliders");
    const data = await res.json();
    return data.sliders || [];
  } catch (err) {
    console.error("getHeroSliders Error:", err);
    return [];
  }
}

export async function trackSliderAnalytics(sliderId: string, type: 'impression' | 'click'): Promise<void> {
  try {
    await fetch(`${API_URL}/analytics/slider`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sliderId, type })
    });
  } catch (err) {
    console.error("trackSliderAnalytics Error:", err);
  }
}
