import React from "react";

interface ImagesProps {
  pImage1: File | null;
  setPImage1: (file: File | null) => void;
  pImage2: File | null;
  setPImage2: (file: File | null) => void;
}

export default function ProductImages({
  pImage1,
  setPImage1,
  pImage2,
  setPImage2,
}: ImagesProps) {
  
  return (
    <div className="space-y-6">
      <div className="bg-[#fcfaf2] border border-[#ece7d9] p-6 rounded-3xl space-y-4">
        <h3 className="font-serif font-bold text-accent-green text-lg">3. Product Media</h3>
        <p className="text-xs text-foreground/70">
          Upload clear, high-resolution product photos. Supports WebP, PNG, JPEG formats.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Image Upload Box */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider block">Main Product Image *</label>
            <div className="border-2 border-dashed border-[#ece7d9] rounded-2xl p-6 flex flex-col items-center justify-center bg-background min-h-[160px] text-center relative group overflow-hidden">
              {pImage1 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background p-4">
                  <span className="text-xs font-semibold text-accent-green truncate max-w-full">
                    {pImage1.name}
                  </span>
                  <span className="text-[10px] text-foreground/50">
                    ({Math.round(pImage1.size / 1024)} KB)
                  </span>
                  <button
                    type="button"
                    onClick={() => setPImage1(null)}
                    className="mt-2 text-xs font-bold text-red-500 hover:underline"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1">📸</span>
                  <span className="text-xs font-medium text-foreground/80">Click or Drag to Upload Main Photo</span>
                  <span className="text-[9px] text-foreground/50 mt-0.5">Recommended 1000 x 1000px</span>
                  <input
                    type="file"
                    required
                    onChange={(e) => setPImage1(e.target.files ? e.target.files[0] : null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Secondary Image Upload Box */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider block">Product Gallery (Additional Image)</label>
            <div className="border-2 border-dashed border-[#ece7d9] rounded-2xl p-6 flex flex-col items-center justify-center bg-background min-h-[160px] text-center relative group overflow-hidden">
              {pImage2 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background p-4">
                  <span className="text-xs font-semibold text-accent-green truncate max-w-full">
                    {pImage2.name}
                  </span>
                  <span className="text-[10px] text-foreground/50">
                    ({Math.round(pImage2.size / 1024)} KB)
                  </span>
                  <button
                    type="button"
                    onClick={() => setPImage2(null)}
                    className="mt-2 text-xs font-bold text-red-500 hover:underline"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1">🖼️</span>
                  <span className="text-xs font-medium text-foreground/80">Upload Gallery Image</span>
                  <span className="text-[9px] text-foreground/50 mt-0.5">Supports supplementary product angles</span>
                  <input
                    type="file"
                    onChange={(e) => setPImage2(e.target.files ? e.target.files[0] : null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
