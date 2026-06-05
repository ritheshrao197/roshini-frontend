import React from "react";

interface SimpleProduct {
  _id: string;
  pName: string;
}

interface ShippingProps {
  shippingWeight: string;
  setShippingWeight: (val: string) => void;
  length: string;
  setLength: (val: string) => void;
  width: string;
  setWidth: (val: string) => void;
  height: string;
  setHeight: (val: string) => void;
  codAvailable: boolean;
  setCodAvailable: (val: boolean) => void;
  freeShippingEligible: boolean;
  setFreeShippingEligible: (val: boolean) => void;
  allowCoupons: boolean;
  setAllowCoupons: (val: boolean) => void;
  limitedTimeOffer: boolean;
  setLimitedTimeOffer: (val: boolean) => void;
  offerExpiryDate: string;
  setOfferExpiryDate: (val: string) => void;
  
  // Relations
  relatedProducts: string[];
  setRelatedProducts: (vals: string[]) => void;
  allProductsList: SimpleProduct[];

  // Analytics (Read-only)
  viewCount?: number;
  purchaseCount?: number;
  conversionRate?: number;
}

export default function ProductShipping({
  shippingWeight,
  setShippingWeight,
  length,
  setLength,
  width,
  setWidth,
  height,
  setHeight,
  codAvailable,
  setCodAvailable,
  freeShippingEligible,
  setFreeShippingEligible,
  allowCoupons,
  setAllowCoupons,
  limitedTimeOffer,
  setLimitedTimeOffer,
  offerExpiryDate,
  setOfferExpiryDate,
  relatedProducts,
  setRelatedProducts,
  allProductsList,
  viewCount = 0,
  purchaseCount = 0,
  conversionRate = 0,
}: ShippingProps) {
  
  const toggleRelation = (pId: string) => {
    if (relatedProducts.includes(pId)) {
      setRelatedProducts(relatedProducts.filter((id) => id !== pId));
    } else {
      setRelatedProducts([...relatedProducts, pId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#fcfaf2] border border-[#ece7d9] p-6 rounded-3xl space-y-4">
        <h3 className="font-serif font-bold text-accent-green text-lg">7. Shipping, Coupons & Analytics</h3>

        {/* Shipping details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Parcel Weight (kg)</label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 0.5"
              value={shippingWeight}
              onChange={(e) => setShippingWeight(e.target.value)}
              className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Length (cm)</label>
            <input
              type="number"
              placeholder="cm"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Width (cm)</label>
            <input
              type="number"
              placeholder="cm"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Height (cm)</label>
            <input
              type="number"
              placeholder="cm"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-background p-4 rounded-2xl border border-[#ece7d9]">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="codToggle"
              checked={codAvailable}
              onChange={(e) => setCodAvailable(e.target.checked)}
              className="w-4 h-4 text-accent-green bg-gray-100 border-gray-300 rounded focus:ring-accent-green"
            />
            <label htmlFor="codToggle" className="text-xs font-bold text-accent-sage uppercase tracking-wider cursor-pointer">
              📦 Cash on Delivery (COD)
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="freeShippingToggle"
              checked={freeShippingEligible}
              onChange={(e) => setFreeShippingEligible(e.target.checked)}
              className="w-4 h-4 text-accent-green bg-gray-100 border-gray-300 rounded focus:ring-accent-green"
            />
            <label htmlFor="freeShippingToggle" className="text-xs font-bold text-accent-sage uppercase tracking-wider cursor-pointer">
              ✈️ Free Shipping Eligible
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="allowCouponsToggle"
              checked={allowCoupons}
              onChange={(e) => setAllowCoupons(e.target.checked)}
              className="w-4 h-4 text-accent-green bg-gray-100 border-gray-300 rounded focus:ring-accent-green"
            />
            <label htmlFor="allowCouponsToggle" className="text-xs font-bold text-accent-sage uppercase tracking-wider cursor-pointer">
              🎟️ Allow Coupons
            </label>
          </div>
        </div>

        {/* Coupons & Expiry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#fdfdfc] p-4 rounded-2xl border border-[#ece7d9]">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="limitedTimeToggle"
              checked={limitedTimeOffer}
              onChange={(e) => setLimitedTimeOffer(e.target.checked)}
              className="w-4 h-4 text-accent-green bg-gray-100 border-gray-300 rounded"
            />
            <label htmlFor="limitedTimeToggle" className="text-xs font-bold text-accent-sage uppercase tracking-wider cursor-pointer">
              ⏳ Limited Time Promotion
            </label>
          </div>

          {limitedTimeOffer && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-accent-sage uppercase tracking-wider">Promotion Expiry Date</label>
              <input
                type="date"
                value={offerExpiryDate}
                onChange={(e) => setOfferExpiryDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#ece7d9] bg-background text-xs"
              />
            </div>
          )}
        </div>

        {/* Relations (Product list) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-accent-sage uppercase tracking-wider block">Related Products (Cross-sell recommendations)</label>
          <div className="max-h-36 overflow-y-auto border border-[#ece7d9] rounded-2xl p-3 bg-background flex flex-col gap-1">
            {allProductsList.map((prod) => {
              const active = relatedProducts.includes(prod._id);
              return (
                <button
                  type="button"
                  key={prod._id}
                  onClick={() => toggleRelation(prod._id)}
                  className={`text-left text-xs px-3 py-1.5 rounded-lg flex items-center justify-between ${
                    active ? "bg-accent-green/10 text-accent-green font-bold" : "hover:bg-accent-cream-dark/20 text-foreground/80"
                  }`}
                >
                  <span>{prod.pName}</span>
                  {active && <span>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Performance & Analytics */}
        <div className="pt-4 border-t border-[#ece7d9]">
          <h4 className="font-serif font-bold text-accent-green text-sm mb-3">📈 Real-time Analytics (Read-only)</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-background border border-[#ece7d9] p-3 rounded-2xl text-center">
              <span className="text-[9px] uppercase font-bold text-accent-sage block">Product Views</span>
              <span className="text-lg font-serif font-bold text-accent-green mt-0.5 block">{viewCount}</span>
            </div>
            <div className="bg-background border border-[#ece7d9] p-3 rounded-2xl text-center">
              <span className="text-[9px] uppercase font-bold text-accent-sage block">Total Purchases</span>
              <span className="text-lg font-serif font-bold text-accent-green mt-0.5 block">{purchaseCount}</span>
            </div>
            <div className="bg-background border border-[#ece7d9] p-3 rounded-2xl text-center">
              <span className="text-[9px] uppercase font-bold text-accent-sage block">Conversion Rate</span>
              <span className="text-lg font-serif font-bold text-accent-green mt-0.5 block">{conversionRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
