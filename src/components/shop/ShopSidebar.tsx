"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/api";

interface Category {
  _id: string;
  cName: string;
  cDescription?: string;
}

interface ShopSidebarProps {
  categories: Category[];
  products: Product[];
  category?: string;
  sort?: string;
  search?: string;
  filteredCount: number;
}

const SORT_OPTIONS = [
  { value: "", label: "Featured" },
  { value: "popular", label: "Best Sellers" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

export default function ShopSidebar({
  categories,
  products,
  category,
  sort,
  search,
  filteredCount
}: ShopSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const renderFiltersContent = () => (
    <>
      {/* Search */}
      <div className="rounded-2xl p-5 space-y-3" style={{ background: "#FDF6EC", border: "1.5px solid #E8D5BC" }}>
        <h3 className="font-bold text-sm uppercase tracking-wider text-[#6B3E26]">Search</h3>
        <form method="GET" action="/shop">
          {category && <input type="hidden" name="category" value={category} />}
          {sort && <input type="hidden" name="sort" value={sort} />}
          <div className="relative">
            <input
              name="search"
              defaultValue={search || ""}
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 text-sm rounded-xl border border-[#E8D5BC] bg-white focus:outline-none focus:border-[#6B3E26] text-[#2C1A0E] placeholder:text-[#B0886A] pr-10"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A5C45] hover:text-[#6B3E26] cursor-pointer">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Categories */}
      <div className="rounded-2xl p-5 space-y-3" style={{ background: "#FDF6EC", border: "1.5px solid #E8D5BC" }}>
        <h3 className="font-bold text-sm uppercase tracking-wider text-[#6B3E26]">Categories</h3>
        <div className="flex flex-col gap-1">
          <Link
            href={`/shop${sort ? `?sort=${sort}` : ""}`}
            onClick={() => setIsOpen(false)}
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
                onClick={() => setIsOpen(false)}
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
        <h3 className="font-bold text-sm uppercase tracking-wider text-[#6B3E26]">Sort By</h3>
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map((opt) => {
            const isActive = (sort || "") === opt.value;
            const href = `/shop?sort=${opt.value}${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`;
            return (
              <Link
                key={opt.value}
                href={href}
                onClick={() => setIsOpen(false)}
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
        <p className="text-xs font-semibold text-[#F5E9DA]">100% Natural</p>
        <p className="text-[11px] text-[#ede0cc]">No preservatives. No artificial additives. Ever.</p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button Strip (Visible on mobile, hidden on desktop) */}
      <div className="lg:hidden w-full mb-6 flex items-center justify-between p-4 rounded-2xl bg-[#FDF6EC] border border-[#E8D5BC]">
        <div className="text-xs font-semibold text-[#7A5C45]">
          Showing {filteredCount} product{filteredCount !== 1 ? "s" : ""}
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full shadow-md hover:bg-[#4e2c18] transition-all cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters & Sort
        </button>
      </div>

      {/* Desktop Sidebar (Visible on desktop, hidden on mobile) */}
      <aside className="hidden lg:block lg:col-span-1 space-y-5">
        {renderFiltersContent()}
      </aside>

      {/* Mobile Sidebar Slide-over Drawer (Visible only when open on mobile) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-full max-w-xs bg-[#FFFDF9] h-full p-6 shadow-2xl overflow-y-auto space-y-6" style={{ borderRight: "1px solid #E8D5BC" }}>
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "#E8D5BC" }}>
              <span className="font-serif font-bold text-[#6B3E26] text-lg">Filters & Sorting</span>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F5E9DA] text-[#6B3E26] flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-[#ede0cc]"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 space-y-5">
              {renderFiltersContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}