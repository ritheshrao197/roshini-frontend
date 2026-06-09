import React from "react";
import { getVlogBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/partials/Header";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vlog = await getVlogBySlug(slug);
  if (!vlog) return { title: "Blog Not Found" };

  return {
    title: vlog.seoTitle || `${vlog.title} | Roshini's`,
    description: vlog.seoDescription || vlog.excerpt,
    openGraph: {
      title: vlog.seoTitle || vlog.title,
      description: vlog.seoDescription || vlog.excerpt,
      images: vlog.thumbnail ? [vlog.thumbnail] : [],
    },
  };
}

export default async function VlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vlog = await getVlogBySlug(slug);

  if (!vlog) {
    notFound();
  }

  const imageUrl = vlog.thumbnail
    ? vlog.thumbnail.startsWith("http")
      ? vlog.thumbnail
      : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/uploads/vlogs/${vlog.thumbnail}`
    : "/images/blog-placeholder.jpg";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFFDF9", color: "#2C1A0E", fontFamily: "'Poppins', sans-serif" }}>
      <Header />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        {/* Header */}
      <header className="mb-12 text-center">
        {vlog.vCategory && (
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ background: "#F5E9DA", color: "#B23A2A" }}
          >
            {vlog.vCategory.cName}
          </span>
        )}
        <h1 
          className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight"
          style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}
        >
          {vlog.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm" style={{ color: "#7A5C45" }}>
          <span>{vlog.publishDate ? new Date(vlog.publishDate).toLocaleDateString() : 'Draft'}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {vlog.viewCount} Views
          </span>
        </div>
      </header>

      {/* Featured Image */}
      <div 
        className="relative w-full h-[400px] md:h-[500px] mb-12 rounded-3xl overflow-hidden shadow-lg"
        style={{ border: "2px solid #E8D5BC" }}
      >
        <img
          src={imageUrl}
          alt={vlog.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div 
        className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#6B3E26] prose-p:text-[#4A3B32] prose-a:text-[#B23A2A]"
        dangerouslySetInnerHTML={{ __html: vlog.content }}
      />

      {/* Tags */}
      {vlog.vTags && vlog.vTags.length > 0 && (
        <div className="mt-12 pt-8 border-t" style={{ borderColor: "#E8D5BC" }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#7A5C45" }}>Tags</h3>
          <div className="flex flex-wrap gap-2">
            {vlog.vTags.map(tag => (
              <span 
                key={tag._id}
                className="px-3 py-1 text-xs font-semibold rounded-full"
                style={{ background: "#F5E9DA", color: "#6B3E26" }}
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
      </article>

      {/* Footer mini */}
      <footer className="py-6 px-4 sm:px-6 text-center text-xs mt-auto" style={{ borderTop: "1px solid #E8D5BC", color: "#7A5C45" }}>
        © 2026 Roshini's Home Products · Handcrafted in Karnataka · All Natural
      </footer>
    </div>
  );
}
