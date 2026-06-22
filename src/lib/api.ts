export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, "")
  : "http://localhost:8000";

export const API_URL = `${BACKEND_URL}/api`;

export interface CloudinaryImage {
  publicId: string;
  secureUrl: string;
  alt?: string;
  isPrimary?: boolean;
}

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
  image?: CloudinaryImage;
  images?: CloudinaryImage[];
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
  image?: CloudinaryImage;
  cStatus: string;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  const fetchOptions: RequestInit = {
    ...options,
    signal: controller.signal,
    credentials: options.credentials || "include", // Ensure cookies are always transferred
  };

  try {
    let response = await fetch(url, fetchOptions);
    
    if (response.status === 401) {
      try {
        const clone = response.clone();
        const data = await clone.json();
        if (data.code === "TOKEN_EXPIRED") {
          // Call the refresh endpoint to rotate cookies
          const refreshRes = await fetch(`${API_URL}/refresh-token`, {
            method: "POST",
            credentials: "include",
          });
          
          if (refreshRes.ok) {
            // Retrying original request with updated cookies
            response = await fetch(url, fetchOptions);
          } else {
            // Refresh token expired/revoked, force signout and login redirect
            if (typeof window !== "undefined") {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
              window.location.href = "/login";
            }
          }
        }
      } catch (err) {
        console.error("[API Client] Error during silent token refresh:", err);
      }
    }
    
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
  image?: CloudinaryImage;
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

export async function getWebsiteSections(): Promise<any[]> {
  try {
    const res = await fetchWithTimeout(`${API_URL}/sections`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch website sections");
    const data = await res.json();
    return data.sections || [];
  } catch (err) {
    console.error("getWebsiteSections Error:", err);
    return [];
  }
}

// ── Admin User Management API ─────────────────────────────────────────────

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  return { "Content-Type": "application/json", token };
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: number;
  role: string;
  status: string;
  userRole: number;
  lastLogin?: string;
  createdAt: string;
  addresses?: any[];
  preferences?: any;
  notifications?: any;
}

export interface UsersListResponse {
  success: boolean;
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UserDetailResponse {
  success: boolean;
  user: AdminUser;
  orderStats: {
    totalOrders: number;
    totalSpent: number;
    latestOrder: { amount: number; status: string; paymentStatus: string; createdAt: string } | null;
  };
}

export interface AuditLog {
  _id: string;
  adminId: { _id: string; name: string; email: string } | string;
  action: string;
  entityType: string;
  entityId: string | null;
  oldValue: unknown;
  newValue: unknown;
  timestamp: string;
}

export async function adminListUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sort?: string;
} = {}): Promise<UsersListResponse> {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  const res = await fetch(`${API_URL}/admin/users?${qs}`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return res.json();
}

export async function adminCreateUser(data: {
  name: string;
  email: string;
  phoneNumber?: string;
  role: string;
  tempPassword: string;
}): Promise<{ success?: boolean; error?: string; user?: AdminUser }> {
  const res = await fetch(`${API_URL}/admin/users`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminGetUser(id: string): Promise<UserDetailResponse> {
  const res = await fetch(`${API_URL}/admin/users/${id}`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return res.json();
}

export async function adminUpdateUser(
  id: string,
  data: { role?: string; status?: string; phoneNumber?: string }
): Promise<{ success?: boolean; error?: string; user?: AdminUser }> {
  const res = await fetch(`${API_URL}/admin/users/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminBulkAction(
  ids: string[],
  action: "activate" | "deactivate" | "block"
): Promise<{ success?: boolean; error?: string; affected?: number }> {
  const res = await fetch(`${API_URL}/admin/users/bulk`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({ ids, action }),
  });
  return res.json();
}

export function adminExportUsersUrl(params: { role?: string; status?: string } = {}): string {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  return `${API_URL}/admin/users/export?${qs}`;
}

export async function adminListCustomers(params: {
  filter?: "recent" | "top" | "inactive";
  page?: number;
  limit?: number;
} = {}): Promise<{ success: boolean; customers: AdminUser[]; total: number; totalPages: number }> {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  const res = await fetch(`${API_URL}/admin/customers?${qs}`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return res.json();
}

export async function adminGetAuditLogs(params: {
  page?: number;
  limit?: number;
  action?: string;
  entityType?: string;
} = {}): Promise<{ success: boolean; logs: AuditLog[]; total: number; totalPages: number }> {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  const res = await fetch(`${API_URL}/admin/audit-logs?${qs}`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return res.json();
}
