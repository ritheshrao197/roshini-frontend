"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product, ProductVariant } from "@/lib/api";
import AddToCartButton from "./AddToCartButton";

interface ProductInteractiveDetailsProps {
  product: Product;
}

export default function ProductInteractiveDetails({ product }: ProductInteractiveDetailsProps) {
  const variants = product.pVariants || [];
  const hasVariants = variants.length > 0;

  // Set default selected variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    hasVariants ? variants[0] : null
  );

  const price = selectedVariant ? selectedVariant.price : product.pPrice;
  const comparePrice = selectedVariant 
    ? selectedVariant.comparePrice 
    : product.comparePrice;

  // Discount percentage calculation
  let discountPercent = 0;
  if (comparePrice && price && comparePrice > price) {
    discountPercent = Math.round(((comparePrice - price) / comparePrice) * 100);
  } else if (product.pOffer) {
    discountPercent = Number(product.pOffer);
  }

  const isOutOfStock = selectedVariant 
    ? selectedVariant.quantity === 0 
    : product.pQuantity === 0;

  const currentWeight = selectedVariant 
    ? selectedVariant.weight 
    : product.productWeight;

  return (
    <div className="space-y-5">
      {/* Category & Stock Badges */}
      <div className="flex items-center gap-2">
        <Link
          href={`/shop?category=${typeof product.pCategory === "object" ? product.pCategory._id : product.pCategory}`}
          className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full hover:opacity-80 transition-opacity"
          style={{ background: "#F5E9DA", color: "#6B3E26", border: "1px solid #E8D5BC" }}
        >
          {typeof product.pCategory === "object" ? product.pCategory.cName : "Homemade"}
        </Link>
        <span
          className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ 
            background: isOutOfStock ? "#FEE2E2" : "#F0FDF4", 
            color: isOutOfStock ? "#B91C1C" : "#15803D" 
          }}
        >
          {isOutOfStock ? "Out of Stock" : "In Stock"}
        </span>
      </div>

      {/* Name */}
      <h1 className="text-3xl md:text-4xl font-bold leading-tight" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
        {product.pName}
      </h1>

      {/* Rating & Trust Statement */}
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className="text-sm" style={{ color: "#E6A817" }}>★</span>
          ))}
        </div>
        <span className="text-xs" style={{ color: "#7A5C45" }}>4.9 · Trusted by families</span>
      </div>

      {/* Dynamic Price Display */}
      <div className="flex items-baseline gap-3 pt-1">
        <span className="text-4xl font-bold" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
          ₹{price}
        </span>
        {comparePrice && comparePrice > price && (
          <span className="text-lg line-through" style={{ color: "#B0886A" }}>
            ₹{comparePrice}
          </span>
        )}
        {discountPercent > 0 && (
          <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{ background: "#B23A2A20", color: "#B23A2A" }}>
            Save {discountPercent}%
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed" style={{ color: "#7A5C45" }}>
        {product.pDescription}
      </p>

      {/* Variant Selector */}
      {hasVariants && (
        <div className="space-y-2.5 pt-2">
          <span className="text-xs font-bold text-[#7A5C45] uppercase tracking-wider block">
            Select Packaging / Size:
          </span>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const isSelected = selectedVariant?._id === v._id || selectedVariant?.weight === v.weight;
              return (
                <button
                  key={v._id || v.weight}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#6B3E26] text-[#F5E9DA] border-[#6B3E26]"
                      : "bg-white text-[#6B3E26] border-[#E8D5BC] hover:bg-[#FDF6EC]"
                  }`}
                >
                  {v.weight} {v.quantity === 0 ? "(Sold Out)" : `- ₹${v.price}`}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={{ borderTop: "1.5px solid #E8D5BC" }} />

      {/* Shipping and trust points */}
      <div className="flex flex-col gap-2">
        {[
          ["🚚", "Free shipping on orders above ₹499"],
          ["📦", "Fresh micro-batch packaging"],
          ["↩️", "Easy returns within 7 days"],
        ].map(([icon, text]) => (
          <div key={text as string} className="flex items-center gap-2.5 text-sm" style={{ color: "#7A5C45" }}>
            <span>{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <AddToCartButton
          productId={selectedVariant ? `${product._id}-${selectedVariant.weight}` : product._id}
          price={price}
          pName={product.pName}
          pImage={product.image?.secureUrl || product.images?.[0]?.secureUrl || product.pImages?.[0]}
          disabled={isOutOfStock}
          dbProductId={product._id}
          variantId={selectedVariant ? selectedVariant._id || selectedVariant.weight : undefined}
          variantName={currentWeight || undefined}
        />
        <Link
          href="/cart"
          className="px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all hover:opacity-80 inline-flex items-center"
          style={{ background: "#F5E9DA", color: "#6B3E26", border: "1.5px solid #E8D5BC" }}
        >
          View Cart
        </Link>
      </div>

      {/* Security statement badges */}
      <div className="flex items-center gap-4 pt-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#B0886A" }}>
        <span>🔒 Secure Checkout</span>
        <span>·</span>
        <span>🌿 100% Natural</span>
        <span>·</span>
        <span>✅ Verified Quality</span>
      </div>
    </div>
  );
}
