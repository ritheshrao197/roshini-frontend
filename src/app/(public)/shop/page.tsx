import React from "react";
import Link from "next/link";
import { getAllProducts, getCategories } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import Header from "@/components/partials/Header";

interface ShopPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
  }>;
}

export const revalidate = 60;

const SORT_OPTIONS = [
  { value: "", label: "Featured" },
  { value: "popular", label: "Best Sellers" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { search, category, sort } = await searchParams;
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  let filteredProducts = [...products];

  if (category) {
    filteredProducts = filteredProducts.filter((p) => {
      const pCatId = typeof p.pCategory === "object" ? p.pCategory._id : p.pCategory;
      return pCatId === category;
    });
  }

  if (search) {
    const query = search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.pName.toLowerCase().includes(query) ||
        p.pDescription.toLowerCase().includes(query)
    );
  }

  if (sort === "price_asc")  filteredProducts.sort((a, b) => a.pPrice - b.pPrice);
  else if (sort === "price_desc") filteredProducts.sort((a, b) => b.pPrice - a.pPrice);
  else if (sort === "popular")    filteredProducts.sort((a, b) => b.pSold - a.pSold);

  const activeCategory = categories.find((c) => c._id === category);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFFDF9", color: "#2C1A0E", fontFamily: "'Poppins', sans-serif" }}>
      <Header />

      {/* Page Header Banner */}
      <div style={{ background: "linear-gradient(135deg, #6B3E26 0%, #8a5438 100%)" }} className="py-12 px-4 sm:px-6 text-center md:text-left">
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#ede0cc" }}>
            {activeCategory ? `Category · ${activeCategory.cName}` : "All Products"}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mt-2" style={{ fontFamily: "'Merriweather', serif", color: "#F5E9DA" }}>
            {activeCategory ? activeCategory.cName : "Shop All Products"}
          </h1>
          {activeCategory && activeCategory.cDescription && (
            <p className="text-sm md:text-base mt-3 max-w-3xl leading-relaxed" style={{ color: "#f0e3d2" }}>
              {activeCategory.cDescription}
            </p>
          )}
          <p className="text-xs md:text-sm mt-3" style={{ color: "#ede0cc", opacity: 0.9 }}>
            {filteredProducts.length} premium product{filteredProducts.length !== 1 ? "s" : ""} found — Handcrafted with love
          </p>
        </div>
      </div>

      {/* Nutrition & Trust Highlights Strip */}
      <div className="border-b py-3 px-4 sm:px-6" style={{ borderColor: "#E8D5BC", background: "#F5E9DA" }}>
        <div className="max-w-7xl mx-auto flex flex-wrap justify-around items-center gap-y-2 gap-x-4 text-xs font-medium text-[#6B3E26]">
          <div className="flex items-center gap-1.5">
            <span>🌿</span>
            <span>100% Traditional Recipe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🍬</span>
            <span>No Refined Sugar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🧪</span>
            <span>Zero Preservatives</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🏡</span>
            <span>Premium Homemade Quality</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ── Sidebar ─────────────────────────────────── */}
          <aside className="lg:col-span-1 space-y-5">

            {/* Search */}
            <div className="rounded-2xl p-5 space-y-3" style={{ background: "#FDF6EC", border: "1.5px solid #E8D5BC" }}>
              <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: "#6B3E26" }}>Search</h3>
              <form method="GET" action="/shop">
                {category && <input type="hidden" name="category" value={category} />}
                {sort && <input type="hidden" name="sort" value={sort} />}
                <div className="relative">
                  <input
                    name="search"
                    defaultValue={search || ""}
                    type="text"
                    placeholder="Search products..."
                    className="input pr-10 text-sm"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A5C45] hover:text-[#6B3E26]">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Categories */}
            <div className="rounded-2xl p-5 space-y-3" style={{ background: "#FDF6EC", border: "1.5px solid #E8D5BC" }}>
              <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: "#6B3E26" }}>Categories</h3>
              <div className="flex flex-col gap-1">
                <Link
                  href={`/shop${sort ? `?sort=${sort}` : ""}`}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: !category ? "#6B3E26" : "transparent",
                    color: !category ? "#F5E9DA" : "#2C1A0E",
                  }}
                >
                  <span>All Products</span>
                  <span className="text-[10px] font-bold opacity-60">{products.length}</span>
                </Link>
                {categories.map((cat) => {
                  const count = products.filter((p) => {
                    const id = typeof p.pCategory === "object" ? p.pCategory._id : p.pCategory;
                    return id === cat._id;
                  }).length;
                  const isActive = category === cat._id;
                  return (
                    <Link
                      key={cat._id}
                      href={`/shop?category=${cat._id}${sort ? `&sort=${sort}` : ""}`}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-[#F5E9DA]"
                      style={{
                        background: isActive ? "#6B3E26" : "transparent",
                        color: isActive ? "#F5E9DA" : "#2C1A0E",
                      }}
                    >
                      <span>{cat.cName}</span>
                      <span className="text-[10px] font-bold opacity-60">{count}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Sort */}
            <div className="rounded-2xl p-5 space-y-3" style={{ background: "#FDF6EC", border: "1.5px solid #E8D5BC" }}>
              <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: "#6B3E26" }}>Sort By</h3>
              <div className="flex flex-col gap-1">
                {SORT_OPTIONS.map((opt) => {
                  const isActive = (sort || "") === opt.value;
                  const href = `/shop?sort=${opt.value}${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`;
                  return (
                    <Link
                      key={opt.value}
                      href={href}
                      className="px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-[#F5E9DA]"
                      style={{ color: isActive ? "#6B3E26" : "#7A5C45", fontWeight: isActive ? 700 : 400 }}
                    >
                      {isActive && "✓ "}{opt.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Trust card */}
            <div className="rounded-2xl p-5 text-center space-y-2" style={{ background: "#6B3E26" }}>
              <div className="text-3xl">🌿</div>
              <p className="text-xs font-semibold" style={{ color: "#F5E9DA" }}>100% Natural</p>
              <p className="text-[11px]" style={{ color: "#ede0cc" }}>No preservatives. No artificial additives. Ever.</p>
            </div>
          </aside>

          {/* ── Product Grid ─────────────────────────────── */}
          <div className="lg:col-span-3">
            {/* Active filters */}
            {(search || category || sort) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs font-medium" style={{ color: "#7A5C45" }}>Filters:</span>
                {category && activeCategory && (
                  <Link href={`/shop${sort ? `?sort=${sort}` : ""}`} className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full hover:opacity-80" style={{ background: "#6B3E26", color: "#F5E9DA" }}>
                    {activeCategory.cName} ✕
                  </Link>
                )}
                {search && (
                  <Link href={`/shop${category ? `?category=${category}` : ""}${sort ? `&sort=${sort}` : ""}`} className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full hover:opacity-80" style={{ background: "#6B3E26", color: "#F5E9DA" }}>
                    "{search}" ✕
                  </Link>
                )}
                <Link href="/shop" className="text-xs underline" style={{ color: "#7A5C45" }}>Clear all</Link>
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed rounded-3xl" style={{ borderColor: "#E8D5BC", background: "#FDF6EC" }}>
                <div className="text-5xl mb-4">🌾</div>
                <h3 className="text-lg font-bold" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
                  No Products Found
                </h3>
                <p className="text-sm mt-2 mb-6" style={{ color: "#7A5C45" }}>
                  Try browsing all categories or clearing your filters.
                </p>
                <Link href="/shop" className="btn-primary">View All Products</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer mini */}
      <footer className="py-6 px-4 sm:px-6 text-center text-xs mt-auto" style={{ borderTop: "1px solid #E8D5BC", color: "#7A5C45" }}>
        © 2026 Roshini's Home Products · Handcrafted in Karnataka · All Natural
      </footer>
    </div>
  );
}
