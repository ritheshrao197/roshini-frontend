"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Product, ProductVariant } from "@/lib/api";
import AddToCartButton from "./AddToCartButton";
import { useLanguage } from "@/lib/LanguageContext";

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

interface ProductInteractiveDetailsProps {
  product: Product;
}

export default function ProductInteractiveDetails({ product }: ProductInteractiveDetailsProps) {
  const { t } = useLanguage();
  const variants = product.pVariants || [];
  const hasVariants = variants.length > 0;

  // Set default selected variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    hasVariants ? variants[0] : null
  );

  const actionsRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const el = actionsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { rootMargin: "0px 0px -50% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const price = selectedVariant ? selectedVariant.price : product.pPrice;
  const comparePrice = selectedVariant 
    ? selectedVariant.comparePrice 
    : product.comparePrice;

  // Discount percentage calculation
  let discountPercent = 0;
  if (comparePrice && price && comparePrice > price) {
    discountPercent = Math.round(((comparePrice - price) / comparePrice) * 100);
  } else if (Number(product.pOffer) > 0) {
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
          {isOutOfStock ? t("product.outofstock") : t("product.instock")}
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
            <span key={s} className="text-sm" style={{ color: "var(--brand-brown)" }}>★</span>
          ))}
        </div>
        <span className="text-xs" style={{ color: "#7A5C45" }}>4.9 · Trusted by families</span>
      </div>

      {/* Dynamic Price Display */}
      <div className="flex items-baseline gap-3 pt-1">
        <span className="text-4xl font-bold" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
          {inrFormatter.format(price)}
        </span>
        {comparePrice && comparePrice > price && (
          <span className="text-lg line-through" style={{ color: "#B0886A" }}>
            {inrFormatter.format(comparePrice)}
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
            {t("product.selectsize")}
          </span>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const isSelected = selectedVariant?._id === v._id || selectedVariant?.weight === v.weight;
              return (
                <button
                  key={v._id || v.weight}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#6B3E26] text-[#F5E9DA] border-[#6B3E26]"
                      : "bg-white text-[#6B3E26] border-[#E8D5BC] hover:bg-[#FDF6EC]"
                  }`}
                >
                  {v.weight} {v.quantity === 0 ? `(${t("product.outofstock")})` : `- ₹${v.price}`}
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
          <div key={text as string} className="flex items-center gap-2.5 text-xs sm:text-sm" style={{ color: "#7A5C45" }}>
            <span>{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div ref={actionsRef} className="flex gap-2.5 sm:gap-3 pt-1">
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
          className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all hover:opacity-80 inline-flex items-center justify-center whitespace-nowrap"
          style={{ background: "#F5E9DA", color: "#6B3E26", border: "1.5px solid #E8D5BC" }}
        >
          {t("product.viewcart")}
        </Link>
      </div>

      {/* Security statement badges */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-[#7A5C45]">
        <span>🔒 Secure Checkout</span>
        <span className="hidden sm:inline">·</span>
        <span>🌿 100% Natural</span>
        <span className="hidden sm:inline">·</span>
        <span>✅ Verified Quality</span>
      </div>

      {/* Sticky mobile purchase bar — mirrors the main buy box once it scrolls out of view */}
      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 px-4 py-3 transition-transform duration-300 ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          background: "#FFFDF9",
          borderTop: "1px solid #E8D5BC",
          boxShadow: "0 -8px 24px rgba(44, 26, 14, 0.08)",
          paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
        }}
      >
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold truncate" style={{ color: "#6B3E26" }}>{product.pName}</div>
          <div className="text-base font-bold" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>
            {inrFormatter.format(price)}
          </div>
        </div>
        <div className="flex-shrink-0">
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
        </div>
      </div>
    </div>
  );
}
