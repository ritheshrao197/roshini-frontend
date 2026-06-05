import React, { useEffect, useState } from "react";

interface PricingProps {
  pPrice: string;
  setPPrice: (val: string) => void;
  comparePrice: string;
  setComparePrice: (val: string) => void;
  sku: string;
  setSku: (val: string) => void;
  pQuantity: string;
  setPQuantity: (val: string) => void;
  lowStockThreshold: string;
  setLowStockThreshold: (val: string) => void;
  productWeight: string;
  setProductWeight: (val: string) => void;
}

export default function ProductPricing({
  pPrice,
  setPPrice,
  comparePrice,
  setComparePrice,
  sku,
  setSku,
  pQuantity,
  setPQuantity,
  lowStockThreshold,
  setLowStockThreshold,
  productWeight,
  setProductWeight,
}: PricingProps) {
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Auto-calculate discount percentage
  useEffect(() => {
    const priceNum = Number(pPrice);
    const mrpNum = Number(comparePrice);
    if (mrpNum > 0 && priceNum > 0 && mrpNum > priceNum) {
      const calc = Math.round(((mrpNum - priceNum) / mrpNum) * 100);
      setDiscountPercent(calc);
    } else {
      setDiscountPercent(0);
    }
  }, [pPrice, comparePrice]);

  return (
    <div className="space-y-6">
      <div className="bg-[#fcfaf2] border border-[#ece7d9] p-6 rounded-3xl space-y-4">
        <h3 className="font-serif font-bold text-accent-green text-lg">2. Pricing & Inventory</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Selling Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Selling Price (₹) *</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 299"
              value={pPrice}
              onChange={(e) => setPPrice(e.target.value)}
              required
              className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            />
          </div>

          {/* Compare Price / MRP */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Compare MRP (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 349"
              value={comparePrice}
              onChange={(e) => setComparePrice(e.target.value)}
              className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            />
          </div>

          {/* Discount Display */}
          <div className="flex flex-col justify-end pb-3 text-sm">
            {discountPercent > 0 ? (
              <span className="text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-xl border border-green-100 inline-block text-center">
                🏷️ Saving {discountPercent}% Off MRP
              </span>
            ) : (
              <span className="text-foreground/50 italic text-xs">No active price markdown detected</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SKU */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">SKU Code</label>
              <button
                type="button"
                onClick={() => setSku(`RHP-NM-${Math.floor(100 + Math.random() * 900)}`)}
                className="text-[10px] text-accent-green hover:underline font-bold"
              >
                Auto Generate
              </button>
            </div>
            <input
              type="text"
              placeholder="e.g. RHP-NM-500"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            />
          </div>

          {/* Product weight */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Net Weight / Volume</label>
            <input
              type="text"
              placeholder="e.g. 200g, 500g, 1kg"
              value={productWeight}
              onChange={(e) => setProductWeight(e.target.value)}
              className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stock Quantity */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Stock Quantity *</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 150"
              value={pQuantity}
              onChange={(e) => setPQuantity(e.target.value)}
              required
              className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            />
          </div>

          {/* Low Stock Threshold */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Low Stock Alarm Threshold</label>
            <input
              type="number"
              min="1"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
