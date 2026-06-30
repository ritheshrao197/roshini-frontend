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
  pVariants?: any[];
  setPVariants?: (val: any[]) => void;
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
  pVariants = [],
  setPVariants,
}: PricingProps) {
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [enableVariants, setEnableVariants] = useState(pVariants.length > 0);

  // Variant addition form states
  const [varWeight, setVarWeight] = useState("");
  const [varPrice, setVarPrice] = useState("");
  const [varComparePrice, setVarComparePrice] = useState("");
  const [varQuantity, setVarQuantity] = useState("0");
  const [varSku, setVarSku] = useState("");

  // Sync state if initial value changes
  useEffect(() => {
    if (pVariants.length > 0) {
      setEnableVariants(true);
    }
  }, [pVariants.length]);

  // Auto-calculate discount percentage for base product
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

  // Auto-set base product fields to match variants for backward compatibility
  useEffect(() => {
    if (enableVariants && pVariants.length > 0 && setPPrice && setPQuantity && setProductWeight) {
      setPPrice(String(pVariants[0].price || ""));
      setPQuantity(String(pVariants.reduce((sum, v) => sum + Number(v.quantity || 0), 0)));
      setProductWeight(pVariants[0].weight || "");
      if (pVariants[0].comparePrice && setComparePrice) {
        setComparePrice(String(pVariants[0].comparePrice));
      }
      if (pVariants[0].sku && setSku) {
        setSku(pVariants[0].sku);
      }
    }
  }, [pVariants, enableVariants]);

  const handleToggleVariants = (checked: boolean) => {
    setEnableVariants(checked);
    if (!checked && setPVariants) {
      setPVariants([]);
    }
  };

  const handleAddVariant = () => {
    if (!varWeight || !varPrice) return;
    const newVariant = {
      weight: varWeight,
      price: Number(varPrice),
      comparePrice: varComparePrice ? Number(varComparePrice) : undefined,
      quantity: Number(varQuantity),
      sku: varSku || `RHP-VAR-${Math.floor(100 + Math.random() * 900)}`,
    };
    if (setPVariants) {
      setPVariants([...pVariants, newVariant]);
    }
    setVarWeight("");
    setVarPrice("");
    setVarComparePrice("");
    setVarQuantity("0");
    setVarSku("");
  };

  const handleDeleteVariant = (index: number) => {
    if (setPVariants) {
      const updated = [...pVariants];
      updated.splice(index, 1);
      setPVariants(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#fcfaf2] border border-[#ece7d9] p-6 rounded-3xl space-y-4">
        <h3 className="font-serif font-bold text-accent-green text-lg">2. Pricing & Inventory</h3>

        {/* Variants Toggle Checkbox */}
        <div className="flex items-center gap-2 pb-2 border-b border-[#ece7d9]">
          <input
            type="checkbox"
            id="enableVariants"
            checked={enableVariants}
            onChange={(e) => handleToggleVariants(e.target.checked)}
            className="w-4 h-4 text-accent-green border-[#ece7d9] rounded focus:ring-accent-green cursor-pointer"
          />
          <label htmlFor="enableVariants" className="text-xs font-bold text-accent-sage uppercase tracking-wider cursor-pointer select-none">
            This product has multiple versions (variants by weight/size)
          </label>
        </div>

        {/* Variants Manager UI */}
        {enableVariants && (
          <div className="bg-[#FFFDF9] border border-[#ece7d9] p-5 rounded-2xl space-y-4">
            <h4 className="font-bold text-xs text-accent-sage uppercase tracking-wider">Configure Versions</h4>
            
            {/* Add Variant Form */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end bg-[#fcfaf2] p-4 rounded-xl border border-[#ece7d9]">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-accent-sage uppercase tracking-wider">Weight/Size *</label>
                <input
                  type="text"
                  placeholder="e.g. 250g, 500g"
                  value={varWeight}
                  onChange={(e) => setVarWeight(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[#ece7d9] bg-white text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-accent-sage uppercase tracking-wider">Price (₹) *</label>
                <input
                  type="number"
                  placeholder="Selling Price"
                  value={varPrice}
                  onChange={(e) => setVarPrice(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[#ece7d9] bg-white text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-accent-sage uppercase tracking-wider">MRP / Compare (₹)</label>
                <input
                  type="number"
                  placeholder="MSRP"
                  value={varComparePrice}
                  onChange={(e) => setVarComparePrice(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[#ece7d9] bg-white text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-accent-sage uppercase tracking-wider">Stock Qty *</label>
                <input
                  type="number"
                  value={varQuantity}
                  onChange={(e) => setVarQuantity(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[#ece7d9] bg-white text-xs focus:outline-none"
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="w-full py-2 bg-accent-green text-white font-bold text-xs rounded-lg hover:bg-accent-green/90 transition-all cursor-pointer"
                >
                  ＋ Add Option
                </button>
              </div>
            </div>

            {/* Variants List Table */}
            {pVariants.length > 0 ? (
              <div className="overflow-x-auto border border-[#ece7d9] rounded-xl bg-white">
                <table className="min-w-full text-xs text-left">
                  <thead className="bg-[#fcfaf2] border-b border-[#ece7d9]">
                    <tr>
                      <th className="px-4 py-2 font-bold text-accent-sage uppercase tracking-wider">Weight / Size</th>
                      <th className="px-4 py-2 font-bold text-accent-sage uppercase tracking-wider">Selling Price</th>
                      <th className="px-4 py-2 font-bold text-accent-sage uppercase tracking-wider">Compare Price</th>
                      <th className="px-4 py-2 font-bold text-accent-sage uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-2 font-bold text-accent-sage uppercase tracking-wider">SKU</th>
                      <th className="px-4 py-2 font-bold text-accent-sage uppercase tracking-wider text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pVariants.map((v, index) => (
                      <tr key={index} className="border-b border-[#ece7d9] last:border-0 hover:bg-[#fcfaf2]/30">
                        <td className="px-4 py-3 font-semibold text-[#2C1A0E]">{v.weight}</td>
                        <td className="px-4 py-3 text-accent-green font-bold">₹{v.price}</td>
                        <td className="px-4 py-3 text-foreground/50 font-medium">₹{v.comparePrice || "-"}</td>
                        <td className="px-4 py-3 font-bold">{v.quantity}</td>
                        <td className="px-4 py-3 font-mono text-[10px] tracking-tight">{v.sku || "-"}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteVariant(index)}
                            className="px-2.5 py-1 bg-red-50 text-red-600 rounded-md font-bold hover:bg-red-100 transition-all cursor-pointer"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-foreground/50 border border-dashed border-[#ece7d9] rounded-xl bg-[#FFFDF9] italic text-xs">
                No variations configured yet. Add at least one option above.
              </div>
            )}
          </div>
        )}

        {/* Base Pricing fields (Disabled/Calculated when enableVariants is active) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Selling Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">
              {enableVariants ? "Base Price (₹) [Derived]" : "Selling Price (₹) *"}
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 299"
              value={pPrice}
              onChange={(e) => setPPrice(e.target.value)}
              required
              disabled={enableVariants}
              readOnly={enableVariants}
              className={`px-4 py-3 rounded-xl border border-[#ece7d9] text-sm focus:outline-none focus:border-accent-green ${
                enableVariants ? "bg-gray-100 opacity-60 cursor-not-allowed" : "bg-background"
              }`}
            />
          </div>

          {/* Compare Price / MRP */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">
              {enableVariants ? "Base Compare MRP (₹) [Derived]" : "Compare MRP (₹)"}
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 349"
              value={comparePrice}
              onChange={(e) => setComparePrice(e.target.value)}
              disabled={enableVariants}
              readOnly={enableVariants}
              className={`px-4 py-3 rounded-xl border border-[#ece7d9] text-sm focus:outline-none focus:border-accent-green ${
                enableVariants ? "bg-gray-100 opacity-60 cursor-not-allowed" : "bg-background"
              }`}
            />
          </div>

          {/* Discount Display */}
          <div className="flex flex-col justify-end pb-3 text-sm">
            {discountPercent > 0 ? (
              <span className="text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-xl border border-green-100 inline-block text-center">
                🏷️ Saving {discountPercent}% Off MRP
              </span>
            ) : (
              <span className="text-foreground/50 italic text-xs text-center">No active price markdown detected</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SKU */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">SKU Code</label>
              {!enableVariants && (
                <button
                  type="button"
                  onClick={() => setSku(`RHP-NM-${Math.floor(100 + Math.random() * 900)}`)}
                  className="text-[10px] text-accent-green hover:underline font-bold"
                >
                  Auto Generate
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="e.g. RHP-NM-500"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              disabled={enableVariants}
              readOnly={enableVariants}
              className={`px-4 py-3 rounded-xl border border-[#ece7d9] text-sm focus:outline-none focus:border-accent-green ${
                enableVariants ? "bg-gray-100 opacity-60 cursor-not-allowed" : "bg-background"
              }`}
            />
          </div>

          {/* Product weight */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">
              {enableVariants ? "Base Weight / Vol [Derived]" : "Net Weight / Volume"}
            </label>
            <input
              type="text"
              placeholder="e.g. 200g, 500g, 1kg"
              value={productWeight}
              onChange={(e) => setProductWeight(e.target.value)}
              disabled={enableVariants}
              readOnly={enableVariants}
              className={`px-4 py-3 rounded-xl border border-[#ece7d9] text-sm focus:outline-none focus:border-accent-green ${
                enableVariants ? "bg-gray-100 opacity-60 cursor-not-allowed" : "bg-background"
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stock Quantity */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">
              {enableVariants ? "Total Stock Qty [Derived]" : "Stock Quantity *"}
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 150"
              value={pQuantity}
              onChange={(e) => setPQuantity(e.target.value)}
              required
              disabled={enableVariants}
              readOnly={enableVariants}
              className={`px-4 py-3 rounded-xl border border-[#ece7d9] text-sm focus:outline-none focus:border-accent-green ${
                enableVariants ? "bg-gray-100 opacity-60 cursor-not-allowed" : "bg-background"
              }`}
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
