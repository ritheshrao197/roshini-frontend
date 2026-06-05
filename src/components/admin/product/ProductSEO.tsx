import React, { useState } from "react";

interface SEOProps {
  seoTitle: string;
  setSeoTitle: (val: string) => void;
  seoDescription: string;
  setSeoDescription: (val: string) => void;
  tags: string[];
  setTags: (vals: string[]) => void;
  canonicalUrl: string;
  setCanonicalUrl: (val: string) => void;
  ogImage: string;
  setOgImage: (val: string) => void;
}

export default function ProductSEO({
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  tags,
  setTags,
  canonicalUrl,
  setCanonicalUrl,
  ogImage,
  setOgImage,
}: SEOProps) {
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag.trim()) {
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#fcfaf2] border border-[#ece7d9] p-6 rounded-3xl space-y-4">
        <h3 className="font-serif font-bold text-accent-green text-lg">6. Search Engine Optimization (SEO)</h3>

        {/* SEO Title */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">SEO Meta Title (Recommended 50-60 chars)</label>
            <span className={`text-[10px] ${seoTitle.length > 60 ? "text-red-500 font-bold" : "text-foreground/50"}`}>
              {seoTitle.length}/60
            </span>
          </div>
          <input
            type="text"
            placeholder="e.g. Roshini's Multigrain Health Mix | 100% Traditional Recipe"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
          />
        </div>

        {/* SEO Description */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">SEO Meta Description (Recommended 150-160 chars)</label>
            <span className={`text-[10px] ${seoDescription.length > 160 ? "text-red-500 font-bold" : "text-foreground/50"}`}>
              {seoDescription.length}/160
            </span>
          </div>
          <textarea
            placeholder="Introduce the wellness profile, ingredients, and key discount items to boost click through rates..."
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={3}
            className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green resize-none"
          />
        </div>

        {/* Tags input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-accent-sage uppercase tracking-wider block">Keywords & Tag Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. millet, health mix, sugar free"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-5 py-2.5 bg-accent-green text-background text-xs font-bold rounded-xl"
            >
              Add Tag
            </button>
          </div>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-accent-green/10 text-accent-green px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border border-accent-green/20"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-red-500 font-bold hover:underline"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-foreground/50 italic">No search keywords assigned yet.</p>
          )}
        </div>

        {/* Canonical URL & OG Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Canonical URL (Optional)</label>
            <input
              type="url"
              placeholder="https://roshinishomeproducts.com/product/..."
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Social Preview Image Link (OG Image)</label>
            <input
              type="text"
              placeholder="e.g. social_banner.jpg"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
