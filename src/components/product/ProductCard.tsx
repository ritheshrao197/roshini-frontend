"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, BACKEND_URL } from "@/lib/api";
import { getCart, addToCart, updateQuantity } from "@/lib/cart";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);

  const refreshCartQuantity = () => {
    const cart = getCart();
    const item = cart.find((i) => i.id === product._id);
    setQuantity(item ? item.quantitiy : 0);
  };

  useEffect(() => {
    refreshCartQuantity();
    window.addEventListener("cart_updated", refreshCartQuantity);
    return () => window.removeEventListener("cart_updated", refreshCartQuantity);
  }, [product._id]);

  const imageUrl =
    product.image?.secureUrl ||
    product.images?.[0]?.secureUrl ||
    (product.pImages && product.pImages.length > 0
      ? product.pImages[0].startsWith("http")
        ? product.pImages[0]
        : `${BACKEND_URL}/uploads/products/${encodeURIComponent(product.pImages[0])}`
      : "/images/product-placeholder.jpg");

  const productSlug =
    product.slug ||
    product._id ||
    product.pName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const categoryName =
    typeof product.pCategory === "object"
      ? product.pCategory.cName
      : "Homemade";

  const isOutOfStock = product.pQuantity === 0;

  return (
    <div
      className="group relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ background: "#FFFDF9", border: "1.5px solid #E8D5BC", boxShadow: "0 2px 8px rgba(107,62,38,0.06)" }}
    >
      {/* Image */}
      <Link
        href={`/product/${productSlug}`}
        className="block relative overflow-hidden"
        style={{ aspectRatio: "1 / 1", background: "#F5E9DA" }}
      >
        <img
          src={imageUrl}
          alt={product.pName}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.pOffer && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ background: "#B23A2A", color: "#fff" }}
            >
              {product.pOffer}% OFF
            </span>
          )}
          {isOutOfStock && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ background: "rgba(0,0,0,0.55)", color: "#fff" }}
            >
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist placeholder */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm"
            style={{ background: "#fff", border: "1px solid #E8D5BC" }}
          >
            🤍
          </div>
        </div>
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Category */}
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "#7A5C45" }}
        >
          {categoryName}
        </span>

        {/* Name */}
        <Link href={`/product/${productSlug}`} className="block">
          <h3
            className="font-bold text-base leading-snug group-hover:opacity-80 transition-opacity line-clamp-2"
            style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}
          >
            {product.pName}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs leading-relaxed line-clamp-2 flex-1" style={{ color: "#7A5C45" }}>
          {product.pDescription}
        </p>

        {/* Badges row */}
        <div className="flex gap-1.5 flex-wrap">
          {["No Sugar", "Homemade"].map((b) => (
            <span
              key={b}
              className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: "#F5E9DA", color: "#6B3E26", border: "1px solid #E8D5BC" }}
            >
              {b}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t mt-1" style={{ borderColor: "#E8D5BC" }}>
          <div>
            <span
              className="text-xl font-bold"
              style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}
            >
              ₹{product.pPrice}
            </span>
            {product.pOffer && (
              <span className="text-xs line-through ml-2" style={{ color: "#B0886A" }}>
                ₹{Math.round(product.pPrice / (1 - Number(product.pOffer) / 100))}
              </span>
            )}
          </div>
          {isOutOfStock ? (
            <span
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold select-none"
              style={{ background: "#E8D5BC", color: "#7A5C45" }}
            >
              Sold Out
            </span>
          ) : quantity > 0 ? (
            <div className="flex items-center bg-[#F5E9DA] rounded-xl border border-[#E8D5BC] overflow-hidden">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateQuantity(product._id, quantity - 1);
                }}
                className="px-2.5 py-1.5 text-sm font-bold text-[#6B3E26] hover:bg-[#ede0cc] transition-colors cursor-pointer focus:outline-none"
              >
                −
              </button>
              <span className="px-2 text-xs font-bold text-[#6B3E26] min-w-[20px] text-center select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateQuantity(product._id, quantity + 1);
                }}
                className="px-2.5 py-1.5 text-sm font-bold text-[#6B3E26] hover:bg-[#ede0cc] transition-colors cursor-pointer focus:outline-none"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const pImage = product.pImages?.[0] || product.image?.secureUrl || product.images?.[0]?.secureUrl || "/images/product-placeholder.jpg";
                addToCart(product._id, product.pPrice, product.pName, pImage);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90 cursor-pointer focus:outline-none"
              style={{
                background: "#6B3E26",
                color: "#F5E9DA",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
