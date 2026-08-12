"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, BACKEND_URL } from "@/lib/api";
import { getCart, addToCart, updateQuantity } from "@/lib/cart";

interface ProductCardProps {
  product: Product;
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const canTilt = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = imageRef.current;
    if (!el || !canTilt()) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 12;
    const rotateX = (0.5 - py) * 12;
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  };

  const handleTiltLeave = () => {
    if (imageRef.current) {
      imageRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
  };

  const refreshCartQuantity = () => {
    const cart = getCart();
    const item = cart.find((i) => i.id === product._id);
    setQuantity(item ? item.quantitiy : 0);
  };

  const refreshWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlisted(wishlist.includes(product._id));
  };

  useEffect(() => {
    refreshCartQuantity();
    refreshWishlist();
    window.addEventListener("cart_updated", refreshCartQuantity);
    window.addEventListener("wishlist_updated", refreshWishlist);
    return () => {
      window.removeEventListener("cart_updated", refreshCartQuantity);
      window.removeEventListener("wishlist_updated", refreshWishlist);
    };
  }, [product._id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    let updated: string[];
    if (isWishlisted) {
      updated = wishlist.filter((id: string) => id !== product._id);
      setIsWishlisted(false);
    } else {
      updated = [...wishlist, product._id];
      setIsWishlisted(true);
    }
    localStorage.setItem("wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlist_updated"));
  };

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
    <div className="product-card card-interactive group relative flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      {/* Image — tilts as a flat 2.5D plane toward the cursor */}
      <div
        ref={imageRef}
        onMouseMove={handleTiltMove}
        onMouseLeave={handleTiltLeave}
        className="product-card-image relative overflow-hidden transition-transform duration-200 ease-out will-change-transform"
      >
        <Link
          href={`/product/${productSlug}`}
          aria-hidden="true"
          tabIndex={-1}
          className="block absolute inset-0"
        >
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {Number(product.pOffer) > 0 && (
            <span className="product-card-badge product-card-offer text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
              {product.pOffer}% OFF
            </span>
          )}
          {isOutOfStock && (
            <span className="product-card-badge product-card-stock text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist handler */}
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity z-10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full"
        >
          <div className="product-wishlist w-8 h-8 flex items-center justify-center text-sm shadow-sm transition-transform hover:scale-110 active:scale-95">
            {isWishlisted ? "❤️" : "🤍"}
          </div>
        </button>
      </div>

      {/* Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 gap-2 sm:gap-2.5">
        {/* Category */}
        <span className="site-muted text-[10px] font-bold uppercase tracking-widest">
          {categoryName}
        </span>

        {/* Name */}
        <Link href={`/product/${productSlug}`} className="block">
          <h3 className="product-card-title font-bold text-base leading-snug group-hover:opacity-80 transition-opacity">
            {product.pName}
          </h3>
        </Link>

        {/* Description */}
        <p className="site-muted text-xs leading-relaxed line-clamp-2 flex-1 my-0.5">
          {product.pDescription}
        </p>

        {/* Badges row */}
        <div className="flex gap-2 flex-wrap my-1">
          {["No Sugar", "Homemade"].map((b) => (
            <span key={b} className="product-chip text-[9.5px] font-semibold uppercase tracking-wider px-2.5 py-0.5">
              {b}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="product-card-footer flex items-center justify-between gap-2 pt-3 mt-auto">
          <div>
            <span className="product-card-price text-xl font-bold">
              {inrFormatter.format(product.pPrice)}
            </span>
            {Number(product.pOffer) > 0 && (
              <span className="site-muted text-xs line-through ml-2">
                {inrFormatter.format(Math.round(product.pPrice / (1 - Number(product.pOffer) / 100)))}
              </span>
            )}
          </div>
          {isOutOfStock ? (
            <span className="quantity-control flex items-center gap-1.5 px-3 py-2 text-xs font-semibold select-none">
              Sold Out
            </span>
          ) : quantity > 0 ? (
            <div className="quantity-control flex items-center overflow-hidden rounded-lg">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateQuantity(product._id, quantity - 1);
                }}
                aria-label="Decrease quantity"
                className="px-2.5 py-1.5 text-sm font-bold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-brown)]"
              >
                −
              </button>
              <span className="px-2 text-xs font-bold min-w-[20px] text-center select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateQuantity(product._id, quantity + 1);
                }}
                aria-label="Increase quantity"
                className="px-2.5 py-1.5 text-sm font-bold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-brown)]"
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
              className="btn-primary btn-sm rounded-lg flex items-center gap-1.5 text-xs cursor-pointer"
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
