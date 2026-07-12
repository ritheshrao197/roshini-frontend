"use client";

import React, { useState } from "react";

interface ImageGalleryProps {
  images: any[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [activeImage, setActiveImage] = useState<any>(null);

  if (!images || images.length === 0) return null;

  const getImageUrl = (img: any) => {
    return img.secureUrl.startsWith("http")
      ? img.secureUrl
      : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/uploads/vlogs/${img.secureUrl}`;
  };

  return (
    <div className="mt-12 pt-8 border-t" style={{ borderColor: "#E8D5BC" }}>
      <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-[#7A5C45]">Article Image Gallery</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setActiveImage(img)}
            className="group relative h-28 md:h-36 rounded-2xl overflow-hidden cursor-pointer border border-[#E8D5BC]/55 shadow-sm hover:shadow transition-all bg-white"
          >
            <img
              src={getImageUrl(img)}
              alt={img.alt || `Gallery Image ${idx + 1}`}
              className="object-cover h-full w-full group-hover:scale-105 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-lg font-bold">
              🔍
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex flex-col justify-center items-center">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-10 right-0 text-white text-xl hover:text-gray-300 font-bold bg-white/10 h-8 w-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
            <img
              src={getImageUrl(activeImage)}
              alt={activeImage.alt || "Gallery Lightbox"}
              className="object-contain max-w-full max-h-full rounded-lg shadow-2xl"
            />
            {activeImage.alt && (
              <p className="text-white text-xs mt-3 bg-black/40 px-4 py-1.5 rounded-full border border-white/10">
                {activeImage.alt}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
