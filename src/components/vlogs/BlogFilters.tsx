"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VlogCategory } from "@/lib/api";

interface BlogFiltersProps {
  categories: VlogCategory[];
}

export default function BlogFilters({ categories }: BlogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentTag = searchParams.get("tag") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "";

  const [searchValue, setSearchValue] = useState(currentSearch);

  // Sync state if URL search changes externally
  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reset page on filter change
    
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    router.push(`/blogs?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchValue });
  };

  const popularTags = [
    "Millets",
    "Protein",
    "Kids Nutrition",
    "Recipes",
    "Healthy Breakfast",
    "Organic",
    "Sugar Free",
    "Diet"
  ];

  return (
    <div className="space-y-6 mb-12">
      {/* Search Bar & Sort Dropdown */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search blogs by title, content or tags..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border rounded-full focus:outline-none focus:border-[#6B3E26] bg-[#FFFDF9] text-sm shadow-sm"
            style={{ borderColor: "#E8D5BC", color: "#6B3E26" }}
          />
          <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6B3E26]">
            🔍
          </button>
          {searchValue && (
            <button
              type="button"
              onClick={() => {
                setSearchValue("");
                updateFilters({ search: null });
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <span className="text-xs font-bold uppercase text-[#7A5C45]">Sort By:</span>
          <select
            value={currentSort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="border rounded-full px-4 py-2 text-sm bg-[#FFFDF9] focus:outline-none focus:border-[#6B3E26] cursor-pointer"
            style={{ borderColor: "#E8D5BC", color: "#6B3E26" }}
          >
            <option value="">Latest Articles</option>
            <option value="popular">Most Viewed</option>
            <option value="featured">Featured Articles</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div>
        <span className="block text-xs font-bold uppercase tracking-wider text-[#7A5C45] mb-3">
          Categories
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilters({ category: null })}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              !currentCategory 
                ? "bg-[#6B3E26] text-[#F5E9DA] border-[#6B3E26]"
                : "bg-white text-[#6B3E26] border-[#E8D5BC] hover:bg-[#FDF6EC]"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateFilters({ category: cat.slug })}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                currentCategory === cat.slug
                  ? "bg-[#6B3E26] text-[#F5E9DA] border-[#6B3E26]"
                  : "bg-white text-[#6B3E26] border-[#E8D5BC] hover:bg-[#FDF6EC]"
              }`}
            >
              {cat.cName}
            </button>
          ))}
        </div>
      </div>

      {/* Tag Cloud */}
      <div>
        <span className="block text-xs font-bold uppercase tracking-wider text-[#7A5C45] mb-3">
          Popular Tags
        </span>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => {
            const tagSlug = tag.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            const isActive = currentTag === tagSlug;
            return (
              <button
                key={tag}
                onClick={() => updateFilters({ tag: isActive ? null : tagSlug })}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                  isActive
                    ? "bg-[#B23A2A] text-white border border-[#B23A2A]"
                    : "bg-[#F5E9DA]/40 text-[#7A5C45] border border-[#E8D5BC]/50 hover:bg-[#F5E9DA]/80"
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filters Display */}
      {(currentCategory || currentTag || currentSearch || currentSort) && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E8D5BC]/40">
          <span className="text-xs text-[#7A5C45]">Active Filters:</span>
          {currentSearch && (
            <span className="bg-[#FDF6EC] border border-[#E8D5BC] text-[#6B3E26] px-3 py-1 rounded-full text-[11px] flex items-center gap-1">
              Search: "{currentSearch}"
              <button onClick={() => updateFilters({ search: null })} className="hover:text-red-500 font-bold ml-1">✕</button>
            </span>
          )}
          {currentCategory && (
            <span className="bg-[#FDF6EC] border border-[#E8D5BC] text-[#6B3E26] px-3 py-1 rounded-full text-[11px] flex items-center gap-1">
              Category: {categories.find(c => c.slug === currentCategory)?.cName || currentCategory}
              <button onClick={() => updateFilters({ category: null })} className="hover:text-red-500 font-bold ml-1">✕</button>
            </span>
          )}
          {currentTag && (
            <span className="bg-[#FDF6EC] border border-[#E8D5BC] text-[#6B3E26] px-3 py-1 rounded-full text-[11px] flex items-center gap-1">
              Tag: #{currentTag}
              <button onClick={() => updateFilters({ tag: null })} className="hover:text-red-500 font-bold ml-1">✕</button>
            </span>
          )}
          {currentSort && (
            <span className="bg-[#FDF6EC] border border-[#E8D5BC] text-[#6B3E26] px-3 py-1 rounded-full text-[11px] flex items-center gap-1">
              Sort: {currentSort === "popular" ? "Most Viewed" : "Featured"}
              <button onClick={() => updateFilters({ sort: null })} className="hover:text-red-500 font-bold ml-1">✕</button>
            </span>
          )}
          <button
            onClick={() => router.push("/blogs")}
            className="text-xs text-[#B23A2A] hover:underline font-bold ml-auto"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
