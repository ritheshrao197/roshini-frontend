import React, { useState, useRef } from "react";

export interface GalleryImage {
  id: string; // Unique local identifier
  file?: File; // Present if it's a new upload
  previewUrl?: string; // Data URL or Cloudinary URL
  publicId?: string; // Present if existing image
  secureUrl?: string; // Present if existing image
  alt: string; // Image alt text
  isPrimary: boolean; // Flag to identify main image
}

interface ImagesProps {
  galleryImages: GalleryImage[];
  setGalleryImages: React.Dispatch<React.SetStateAction<GalleryImage[]>>;
}

export default function ProductImages({ galleryImages, setGalleryImages }: ImagesProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList) => {
    setError(null);
    const validFiles: GalleryImage[] = [];
    const currentCount = galleryImages.length;

    if (currentCount + files.length > 10) {
      setError("Maximum 10 images allowed per product");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Size check (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(`File "${file.name}" exceeds the 5MB size limit.`);
        continue;
      }
      // Type check
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError(`File "${file.name}" is not a supported format (JPEG, PNG, WebP).`);
        continue;
      }

      validFiles.push({
        id: Math.random().toString(36).substring(7) + "_" + Date.now(),
        file: file,
        previewUrl: URL.createObjectURL(file),
        alt: "",
        isPrimary: currentCount === 0 && validFiles.length === 0,
      });
    }

    if (validFiles.length > 0) {
      setGalleryImages((prev) => {
        const next = [...prev, ...validFiles];
        // Ensure at least one image is primary if list is not empty
        if (next.length > 0 && !next.some((img) => img.isPrimary)) {
          next[0].isPrimary = true;
        }
        return next;
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (id: string) => {
    setGalleryImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      // If we removed the primary image, make the first remaining one primary
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const setPrimaryImage = (id: string) => {
    setGalleryImages((prev) =>
      prev.map((img) => ({
        ...img,
        isPrimary: img.id === id,
      }))
    );
  };

  const updateAltText = (id: string, newAlt: string) => {
    setGalleryImages((prev) =>
      prev.map((img) => {
        if (img.id === id) {
          return { ...img, alt: newAlt };
        }
        return img;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#fcfaf2] border border-[#ece7d9] p-6 rounded-3xl space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-serif font-bold text-accent-green text-lg">3. Product Media</h3>
            <p className="text-xs text-foreground/70 mt-1">
              Upload clear, high-resolution product photos. Supports WebP, PNG, JPEG formats up to 5MB.
            </p>
          </div>
          <span className="text-xs bg-[#ece7d9] text-accent-green px-3 py-1 rounded-full font-bold">
            {galleryImages.length} / 10 Images
          </span>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100">
            ⚠️ {error}
          </div>
        )}

        {/* Upload Drag & Drop Area */}
        {galleryImages.length < 10 ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center bg-background min-h-[160px] text-center cursor-pointer transition-all ${
              isDragging
                ? "border-accent-green bg-accent-green/5 scale-[0.99]"
                : "border-[#ece7d9] hover:border-accent-green/50 hover:bg-[#fcfaf2]/30"
            }`}
          >
            <span className="text-3xl mb-2">📸</span>
            <span className="text-sm font-semibold text-foreground/80">
              Drag & Drop files here, or <span className="text-accent-green underline">Browse</span>
            </span>
            <span className="text-[10px] text-foreground/50 mt-1">
              Supports supplementary angles, nutrition facts labels, and organic seals.
            </span>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  processFiles(e.target.files);
                }
              }}
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/webp"
            />
          </div>
        ) : (
          <div className="border border-[#ece7d9] rounded-2xl p-6 bg-accent-cream-dark/10 text-center text-xs text-foreground/60">
            🔒 Gallery is full. Remove an image to upload a replacement.
          </div>
        )}

        {/* Image Previews List */}
        {galleryImages.length > 0 && (
          <div className="pt-4 border-t border-[#ece7d9]/60">
            <h4 className="text-xs font-bold text-accent-sage uppercase tracking-wider mb-3">
              Image Gallery
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img) => (
                <div
                  key={img.id}
                  className={`bg-background border rounded-2xl p-3 flex flex-col justify-between gap-3 relative transition-all group ${
                    img.isPrimary ? "border-accent-green ring-1 ring-accent-green/20" : "border-[#ece7d9]"
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div className="h-32 w-full relative rounded-xl overflow-hidden bg-foreground/[0.02] flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.previewUrl}
                      alt={img.alt || "Product image preview"}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors"
                      title="Remove image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Controls */}
                  <div className="space-y-2">
                    {/* Primary toggle */}
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(img.id)}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        img.isPrimary
                          ? "bg-accent-green text-background border border-transparent shadow-sm"
                          : "bg-transparent text-foreground/70 hover:text-foreground border border-[#ece7d9] hover:bg-accent-cream-dark/10"
                      }`}
                    >
                      {img.isPrimary ? (
                        <>
                          <span>⭐</span> Primary Main Image
                        </>
                      ) : (
                        <>
                          <span>☆</span> Make Primary
                        </>
                      )}
                    </button>

                    {/* Alt Text Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-accent-sage uppercase tracking-wider block">
                        Alt Text (SEO Description)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Organic Ragi Health Mix front box"
                        value={img.alt}
                        onChange={(e) => updateAltText(img.id, e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-[#ece7d9] bg-background text-foreground/80 focus:outline-none focus:border-accent-green"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
