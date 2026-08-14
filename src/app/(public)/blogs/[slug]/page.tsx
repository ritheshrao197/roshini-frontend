import React from "react";
import { getVlogBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import LikeButton from "@/components/vlogs/LikeButton";
import ShareButtons from "@/components/vlogs/ShareButtons";
import ImageGallery from "@/components/vlogs/ImageGallery";
import { NewsletterSection } from "@/components/home/HomeSections";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vlog = await getVlogBySlug(slug);
  if (!vlog) return { title: "Blog Not Found" };

  return {
    title: vlog.seoTitle || `${vlog.title} | Roshini's`,
    description: vlog.seoDescription || vlog.excerpt,
    keywords: vlog.seoKeywords || [],
    alternates: {
      canonical: vlog.canonicalUrl || undefined
    },
    openGraph: {
      title: vlog.seoTitle || vlog.title,
      description: vlog.seoDescription || vlog.excerpt,
      images: vlog.ogImage ? [vlog.ogImage] : (vlog.thumbnail ? [vlog.thumbnail] : []),
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
    : null;

  const cleanContent = (content: string, title: string) => {
    if (!content) return "";
    let cleaned = content.trim();
    // Remove leading <h1> tag (since article header already renders the page <h1>)
    // or leading <h2> if text matches the article title
    cleaned = cleaned.replace(/^<h[12][^>]*>[\s\S]*?<\/h[12]>/i, (match) => {
      const textOnly = match.replace(/<[^>]*>/g, "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      const titleOnly = (title || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      if (
        match.toLowerCase().startsWith("<h1") ||
        !textOnly ||
        textOnly === titleOnly ||
        titleOnly.includes(textOnly) ||
        textOnly.includes(titleOnly)
      ) {
        return "";
      }
      return match;
    });
    return cleaned.trim();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFFDF9", color: "#2C1A0E", fontFamily: "'Poppins', sans-serif" }}>
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
            className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight font-serif text-[#6B3E26]"
          >
            {vlog.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-xs" style={{ color: "#7A5C45" }}>
            <span>{vlog.publishDate ? new Date(vlog.publishDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }) : 'Draft'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              👁️ {vlog.viewCount} Views
            </span>
            <span>•</span>
            <span>⏱️ {vlog.readingTime || 1} min read</span>
          </div>
        </header>

        {/* Featured Image */}
        {imageUrl ? (
          <div 
            className="relative w-full h-[400px] md:h-[500px] mb-12 rounded-3xl overflow-hidden shadow-lg"
            style={{ border: "2px solid #E8D5BC" }}
          >
            <Image
              src={imageUrl}
              alt={vlog.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ) : null}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#6B3E26] prose-p:text-[#4A3B32] prose-a:text-[#B23A2A] mb-12"
          dangerouslySetInnerHTML={{ __html: cleanContent(vlog.content, vlog.title) }}
        />

        {/* Interactions: Likes & Social Sharing */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 py-6 border-t border-b" style={{ borderColor: "#E8D5BC" }}>
          <LikeButton vlogId={vlog._id} initialLikes={vlog.likesCount || 0} />
          <ShareButtons title={vlog.title} slug={vlog.slug} />
        </div>

        {/* Gallery */}
        <ImageGallery images={vlog.gallery || []} />

        {/* Related Products */}
        {vlog.relatedProducts && vlog.relatedProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t" style={{ borderColor: "#E8D5BC" }}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-[#7A5C45]">Featured Roshini Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {vlog.relatedProducts.map((prod: any) => {
                const prodImg = prod.pImages && prod.pImages[0] 
                  ? (prod.pImages[0].startsWith("http") ? prod.pImages[0] : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/uploads/products/${prod.pImages[0]}`)
                  : "/images/product-placeholder.jpg";
                return (
                  <div key={prod._id} className="group border rounded-2xl p-3 bg-white hover:-translate-y-1 transition-all flex flex-col justify-between" style={{ borderColor: "#E8D5BC" }}>
                    <img src={prodImg} alt={prod.pName} className="h-28 w-full object-cover rounded-xl mb-2" />
                    <div>
                      <h4 className="font-bold text-xs text-[#6B3E26] line-clamp-2">{prod.pName}</h4>
                      <span className="text-xs font-bold text-[#B23A2A] mt-1 block">₹{prod.pPrice}</span>
                    </div>
                    <Link href={`/product/${prod.slug}`} className="mt-2 text-[10px] font-bold uppercase text-center block bg-[#6B3E26] text-[#F5E9DA] py-1.5 rounded-full hover:bg-[#4e2c18] transition-all">
                      View Product
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tags */}
        {vlog.vTags && vlog.vTags.length > 0 && (
          <div className="mt-12 pt-8 border-t" style={{ borderColor: "#E8D5BC" }}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#7A5C45" }}>Tags</h3>
            <div className="flex flex-wrap gap-2">
              {vlog.vTags.map((tag: any) => (
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

      {/* Wellness Newsletter Section */}
      <NewsletterSection />

      {/* Footer mini */}
      <footer className="py-6 px-4 sm:px-6 text-center text-xs mt-auto" style={{ borderTop: "1px solid #E8D5BC", color: "#7A5C45" }}>
        © 2026 Roshini's Home Products · Handcrafted in Karnataka · All Natural
      </footer>
    </div>
  );
}
