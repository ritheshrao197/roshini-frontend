"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
  offerPercent?: number;
  isOutOfStock?: boolean;
}

export default function ProductImageGallery({ images, alt, offerPercent, isOutOfStock }: ProductImageGalleryProps) {
  const gallery = images.length > 0 ? images : ["/images/product-placeholder.jpg"];
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-3">
      <div
        className="relative overflow-hidden rounded-3xl shadow-md"
        style={{ aspectRatio: "1 / 1", background: "#F5E9DA" }}
      >
        <Image
          src={gallery[selected]}
          alt={alt}
          fill
          priority={selected === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {Number(offerPercent) > 0 && (
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: "#B23A2A", color: "#fff" }}>
              {offerPercent}% OFF
            </span>
          )}
          {isOutOfStock && (
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}>
              Sold Out
            </span>
          )}
        </div>
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1" role="tablist" aria-label="Product photos">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              type="button"
              role="tab"
              aria-selected={i === selected}
              aria-label={`View photo ${i + 1} of ${gallery.length}`}
              onClick={() => setSelected(i)}
              className="relative flex-shrink-0 rounded-xl overflow-hidden transition-all cursor-pointer"
              style={{
                width: "4.5rem",
                height: "4.5rem",
                background: "#F5E9DA",
                border: i === selected ? "2px solid #6B3E26" : "1.5px solid #E8D5BC",
                opacity: i === selected ? 1 : 0.75,
              }}
            >
              <Image src={src} alt="" fill sizes="72px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
