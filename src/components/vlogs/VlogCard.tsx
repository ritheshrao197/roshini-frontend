import React from "react";
import Link from "next/link";
import { Vlog } from "@/lib/api";

interface VlogCardProps {
  vlog: Vlog;
}

export default function VlogCard({ vlog }: VlogCardProps) {
  const imageUrl = vlog.thumbnail
    ? vlog.thumbnail.startsWith("http")
      ? vlog.thumbnail
      : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/uploads/vlogs/${vlog.thumbnail}`
    : "/images/blog-placeholder.jpg"; // Fallback image

  return (
    <div
      className="group relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white"
      style={{ border: "1.5px solid #E8D5BC", boxShadow: "0 2px 8px rgba(107,62,38,0.06)" }}
    >
      {/* Image */}
      <Link
        href={`/blogs/${vlog.slug}`}
        className="block relative overflow-hidden h-48"
        style={{ background: "#F5E9DA" }}
      >
        <img
          src={imageUrl}
          alt={vlog.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Category Badge */}
        {vlog.vCategory && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
            >
              {vlog.vCategory.cName}
            </span>
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Date and View Count */}
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{vlog.publishDate ? new Date(vlog.publishDate).toLocaleDateString() : 'Draft'}</span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {vlog.viewCount} Views
          </span>
        </div>

        {/* Title */}
        <Link href={`/blogs/${vlog.slug}`} className="block">
          <h3
            className="font-bold text-lg leading-snug group-hover:opacity-80 transition-opacity line-clamp-2"
            style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}
          >
            {vlog.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm leading-relaxed line-clamp-3 flex-1" style={{ color: "#7A5C45" }}>
          {vlog.excerpt}
        </p>

        {/* Read More Link */}
        <div className="pt-3 border-t mt-auto" style={{ borderColor: "#E8D5BC" }}>
          <Link
            href={`/blogs/${vlog.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:opacity-80"
            style={{ color: "#B23A2A" }}
          >
            Read More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
