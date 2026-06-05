import React, { useEffect } from "react";

interface BasicInfoProps {
  pName: string;
  setPName: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  shortDescription: string;
  setShortDescription: (val: string) => void;
  pDescription: string;
  setPDescription: (val: string) => void;
  productType: string;
  setProductType: (val: string) => void;
  brandName: string;
  setBrandName: (val: string) => void;
}

export default function ProductBasicInfo({
  pName,
  setPName,
  slug,
  setSlug,
  shortDescription,
  setShortDescription,
  pDescription,
  setPDescription,
  productType,
  setProductType,
  brandName,
  setBrandName,
}: BasicInfoProps) {
  
  // Auto-generate slug from name
  useEffect(() => {
    if (pName && !slug) {
      const generated = pName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
    }
  }, [pName, slug, setSlug]);

  return (
    <div className="space-y-6">
      <div className="bg-[#fcfaf2] border border-[#ece7d9] p-6 rounded-3xl space-y-4">
        <h3 className="font-serif font-bold text-accent-green text-lg">1. Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Product Name *</label>
            <input
              type="text"
              placeholder="e.g. Roshini's Nutrimix"
              value={pName}
              onChange={(e) => setPName(e.target.value)}
              required
              maxLength={255}
              className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            />
          </div>

          {/* Product Slug */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Product Slug *</label>
            <input
              type="text"
              placeholder="e.g. roshinis-nutrimix"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              required
              className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            />
          </div>

          {/* Product Type Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Product Type</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            >
              <option value="Health Mix">Health Mix</option>
              <option value="Seeds">Seeds</option>
              <option value="Herbal Blend">Herbal Blend</option>
              <option value="Skincare">Skincare</option>
              <option value="Traditional Wellness">Traditional Wellness</option>
            </select>
          </div>

          {/* Brand Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Brand Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            />
          </div>
        </div>

        {/* Short Description */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Short Description (Max 160 chars)</label>
            <span className="text-[10px] text-foreground/50">{shortDescription.length}/160</span>
          </div>
          <textarea
            placeholder="A short wellness summary for cards and search engine snippets..."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value.slice(0, 160))}
            rows={2}
            className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green resize-none"
          />
        </div>

        {/* Full Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Full Description *</label>
          <textarea
            placeholder="Describe the background, nutritional details, and wellness profile..."
            value={pDescription}
            onChange={(e) => setPDescription(e.target.value)}
            rows={5}
            required
            className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
          />
        </div>
      </div>
    </div>
  );
}
