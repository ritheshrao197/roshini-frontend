import React, { useState } from "react";

interface BenefitsProps {
  featured: boolean;
  setFeatured: (val: boolean) => void;
  bestseller: boolean;
  setBestseller: (val: boolean) => void;
  pStatus: string;
  setPStatus: (val: string) => void;
  suitableFor: string[];
  setSuitableFor: (vals: string[]) => void;
  trustBadges: string[];
  setTrustBadges: (vals: string[]) => void;
  benefits: string[];
  setBenefits: (vals: string[]) => void;
}

export default function ProductBenefits({
  featured,
  setFeatured,
  bestseller,
  setBestseller,
  pStatus,
  setPStatus,
  suitableFor,
  setSuitableFor,
  trustBadges,
  setTrustBadges,
  benefits,
  setBenefits,
}: BenefitsProps) {
  const [newBenefit, setNewBenefit] = useState("");

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, idx) => idx !== index));
  };

  const toggleSuitable = (val: string) => {
    if (suitableFor.includes(val)) {
      setSuitableFor(suitableFor.filter((item) => item !== val));
    } else {
      setSuitableFor([...suitableFor, val]);
    }
  };

  const toggleBadge = (val: string) => {
    if (trustBadges.includes(val)) {
      setTrustBadges(trustBadges.filter((item) => item !== val));
    } else {
      setTrustBadges([...trustBadges, val]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#fcfaf2] border border-[#ece7d9] p-6 rounded-3xl space-y-4">
        <h3 className="font-serif font-bold text-accent-green text-lg">5. Labels & Badges</h3>

        {/* Featured, Bestseller & Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-background p-4 rounded-2xl border border-[#ece7d9]">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featuredToggle"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 text-accent-green bg-gray-100 border-gray-300 rounded focus:ring-accent-green"
            />
            <label htmlFor="featuredToggle" className="text-xs font-bold text-accent-sage uppercase tracking-wider cursor-pointer">
              🌟 Featured Product
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="bestsellerToggle"
              checked={bestseller}
              onChange={(e) => setBestseller(e.target.checked)}
              className="w-4 h-4 text-accent-green bg-gray-100 border-gray-300 rounded focus:ring-accent-green"
            />
            <label htmlFor="bestsellerToggle" className="text-xs font-bold text-accent-sage uppercase tracking-wider cursor-pointer">
              🏆 Bestseller Badge
            </label>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-accent-sage uppercase tracking-wider">Product Status</label>
            <select
              value={pStatus}
              onChange={(e) => setPStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#ece7d9] bg-background text-xs"
            >
              <option value="Active">Active / Published</option>
              <option value="Draft">Draft</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Disabled">Disabled / Archived</option>
            </select>
          </div>
        </div>

        {/* Suitable For (Multi select) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-accent-sage uppercase tracking-wider block">Suitable For</label>
          <div className="flex flex-wrap gap-4">
            {["Children", "Adults", "Elderly", "Fitness Enthusiasts"].map((suit) => (
              <label key={suit} className="flex items-center gap-2 text-xs font-medium cursor-pointer text-foreground/80">
                <input
                  type="checkbox"
                  checked={suitableFor.includes(suit)}
                  onChange={() => toggleSuitable(suit)}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-accent-green focus:ring-accent-green"
                />
                {suit}
              </label>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-accent-sage uppercase tracking-wider block">Trust Badges Displayed</label>
          <div className="flex flex-wrap gap-3">
            {["No Added Sugar", "Preservative Free", "Small Batch Made", "Traditional Recipe"].map((badge) => {
              const active = trustBadges.includes(badge);
              return (
                <button
                  type="button"
                  key={badge}
                  onClick={() => toggleBadge(badge)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    active
                      ? "bg-accent-green text-background border-accent-green"
                      : "bg-background text-accent-sage border-[#ece7d9] hover:bg-accent-cream-dark/10"
                  }`}
                >
                  {active ? "✓ " : ""} {badge}
                </button>
              );
            })}
          </div>
        </div>

        {/* Benefits section (Dynamic list) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-accent-sage uppercase tracking-wider block">Dynamic Marketing Benefits</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Rich in natural dietary fiber and calcium"
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            />
            <button
              type="button"
              onClick={addBenefit}
              className="px-5 py-2.5 bg-accent-green text-background text-xs font-bold rounded-xl"
            >
              Add Benefit
            </button>
          </div>
          {benefits.length > 0 ? (
            <div className="space-y-1.5 pt-2">
              {benefits.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-accent-cream-dark/20 px-4 py-2 rounded-xl text-xs border border-[#ece7d9]"
                >
                  <span className="text-accent-green font-medium">✨ {item}</span>
                  <button
                    type="button"
                    onClick={() => removeBenefit(idx)}
                    className="text-red-500 hover:underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-foreground/50 italic">No marketing benefits listed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
