import React from "react";
import { getVlogs, getFeaturedVlogs } from "@/lib/api";
import VlogCard from "@/components/vlogs/VlogCard";
import Header from "@/components/partials/Header";

export const metadata = {
  title: "Blogs | Roshini's Home Products",
  description: "Read our latest blogs and updates about healthy, homemade products.",
};

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const { vlogs, totalPages } = await getVlogs(page, 9);
  const featuredVlogs = await getFeaturedVlogs();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFFDF9", color: "#2C1A0E", fontFamily: "'Poppins', sans-serif" }}>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {/* Header */}
      <div className="text-center mb-16">
        <h1 
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}
        >
          Our Blogs
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: "#7A5C45" }}>
          Discover tips, recipes, and behind-the-scenes stories about our homemade, no-sugar products.
        </p>
      </div>

      {/* Featured Vlogs Section */}
      {featuredVlogs && featuredVlogs.length > 0 && page === 1 && (
        <section className="mb-20">
          <h2 
            className="text-2xl font-bold mb-8 flex items-center gap-2"
            style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}
          >
            <span className="w-8 h-[2px] bg-[#B23A2A]" />
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
          className="text-2xl font-bold mb-8 flex items-center gap-2"
          style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}
        >
          <span className="w-8 h-[2px] bg-[#B23A2A]" />
          Latest Updates
        </h2>
        
        {vlogs && vlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {vlogs.map((vlog) => (
                <VlogCard key={vlog._id} vlog={vlog} />
              ))}
            </div>

            {/* Pagination Placeholder (simple next/prev for now) */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4">
                {page > 1 && (
                  <a 
                    href={`/blogs?page=${page - 1}`}
                    className="px-6 py-2 rounded-full font-semibold transition-all hover:opacity-90"
                    style={{ background: "#F5E9DA", color: "#6B3E26", border: "1px solid #E8D5BC" }}
                  >
                    Previous
                  </a>
                )}
                {page < totalPages && (
                  <a 
                    href={`/blogs?page=${page + 1}`}
                    className="px-6 py-2 rounded-full font-semibold transition-all hover:opacity-90"
                    style={{ background: "#6B3E26", color: "#F5E9DA" }}
                  >
                    Next
                  </a>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <h3 className="text-xl font-medium text-gray-500">No blogs found.</h3>
          </div>
        )}
      </section>
      </main>
      
      {/* Footer mini */}
      <footer className="py-6 px-4 sm:px-6 text-center text-xs mt-auto" style={{ borderTop: "1px solid #E8D5BC", color: "#7A5C45" }}>
        © 2026 Roshini's Home Products · Handcrafted in Karnataka · All Natural
      </footer>
    </div>
  );
}
