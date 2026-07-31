import React, { Suspense } from "react";
import { getVlogs, getFeaturedVlogs, getVlogCategories } from "@/lib/api";
import VlogCard from "@/components/vlogs/VlogCard";
import BlogFilters from "@/components/vlogs/BlogFilters";
import Link from "next/link";

export const metadata = {
  title: "Blogs | Roshini's Home Products",
  description: "Read our latest blogs and updates about healthy, homemade products.",
};

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string; 
    category?: string; 
    tag?: string; 
    search?: string; 
    sort?: string; 
  }>;
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const category = resolvedParams.category || "";
  const tag = resolvedParams.tag || "";
  const search = resolvedParams.search || "";
  const sort = resolvedParams.sort || "";

  // Fetch vlogs with the active filters
  const { vlogs, totalPages } = await getVlogs(page, 9, category, tag, search, sort);
  const categories = await getVlogCategories();
  const featuredVlogs = await getFeaturedVlogs();

  // Helper for correct pagination link building
  const getPageLink = (pageNum: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);
    params.set("page", String(pageNum));
    return `/blogs?${params.toString()}`;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFFDF9", color: "#2C1A0E", fontFamily: "'Poppins', sans-serif" }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4 font-serif text-[#6B3E26]"
          >
            Our Blogs
          </h1>
          <p className="text-base max-w-2xl mx-auto text-[#7A5C45]">
            Discover nutrition tips, healthy recipes, and guides on lead-free, organic cooking.
          </p>
        </div>

        {/* Filters */}
        <Suspense fallback={<div className="text-xs text-gray-400">Loading filters...</div>}>
          <BlogFilters categories={categories} />
        </Suspense>

        {/* Featured Vlogs Section (Only on page 1 and if not filtering) */}
        {featuredVlogs && featuredVlogs.length > 0 && page === 1 && !category && !tag && !search && !sort && (
          <section className="mb-16">
            <h2 
              className="text-xl font-bold mb-6 font-serif text-[#6B3E26] flex items-center gap-2"
            >
              <span className="w-6 h-[2px] bg-[#B23A2A]" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVlogs.map((vlog) => (
                <VlogCard key={vlog._id} vlog={vlog} />
              ))}
            </div>
          </section>
        )}

        {/* All Vlogs Section */}
        <section>
          <h2 
            className="text-xl font-bold mb-6 font-serif text-[#6B3E26] flex items-center gap-2"
          >
            <span className="w-6 h-[2px] bg-[#B23A2A]" />
            {category || tag || search || sort ? "Search Results" : "Latest Updates"}
          </h2>
          
          {vlogs && vlogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {vlogs.map((vlog) => (
                  <VlogCard key={vlog._id} vlog={vlog} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-4">
                  {page > 1 && (
                    <Link 
                      href={getPageLink(page - 1)}
                      className="px-6 py-2 rounded-full font-semibold transition-all hover:opacity-90 text-xs shadow-sm"
                      style={{ background: "#F5E9DA", color: "#6B3E26", border: "1px solid #E8D5BC" }}
                    >
                      Previous
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link 
                      href={getPageLink(page + 1)}
                      className="px-6 py-2 rounded-full font-semibold transition-all hover:opacity-90 text-xs shadow-sm"
                      style={{ background: "#6B3E26", color: "#F5E9DA" }}
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-[#FDF6EC]/40 rounded-3xl border border-dashed" style={{ borderColor: "#E8D5BC" }}>
              <h3 className="text-base font-medium text-[#7A5C45]">No blogs found matching the search criteria.</h3>
              <Link href="/blogs" className="text-xs text-[#B23A2A] hover:underline font-bold mt-2 inline-block">
                Clear Filters
              </Link>
            </div>
          )}
        </section>
      </main>
      
      {/* Footer mini */}
      <footer className="py-6 px-4 sm:px-6 text-center text-[11px] mt-auto" style={{ borderTop: "1px solid #E8D5BC", color: "#7A5C45" }}>
        © 2026 Roshini's Home Products · Handcrafted in Karnataka · All Natural
      </footer>
    </div>
  );
}
