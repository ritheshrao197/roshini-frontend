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
