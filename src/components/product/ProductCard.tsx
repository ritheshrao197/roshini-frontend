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
  const [isWishlisted, setIsWishlisted] = useState(false);

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
    <div className="product-card card-interactive animate-fade-up group relative flex h-full flex-col overflow-hidden">
      {/* Image */}
      <Link
        href={`/product/${productSlug}`}
        className="product-card-image block relative overflow-hidden"
      >
        <Image
          src={imageUrl}
          alt={product.pName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
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
        <div 
          onClick={toggleWishlist}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
        >
          <div className="product-wishlist w-8 h-8 flex items-center justify-center text-sm shadow-sm transition-transform hover:scale-110 active:scale-95">
            {isWishlisted ? "❤️" : "🤍"}
          </div>
        </div>
      </Link>

      {/* Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-1.5 sm:gap-2">
        {/* Category */}
        <span className="site-muted text-[10px] font-bold uppercase tracking-widest">
          {categoryName}
        </span>

        {/* Name */}
        <Link href={`/product/${productSlug}`} className="block">
          <h3 className="product-card-title font-bold text-base leading-snug group-hover:opacity-80 transition-opacity line-clamp-2">
            {product.pName}
          </h3>
        </Link>

        {/* Description */}
        <p className="site-muted text-xs leading-relaxed line-clamp-2 flex-1">
          {product.pDescription}
        </p>

        {/* Badges row */}
        <div className="flex gap-1.5 flex-wrap">
          {["No Sugar", "Homemade"].map((b) => (
            <span key={b} className="product-chip text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5">
              {b}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="product-card-footer flex items-center justify-between pt-3 mt-1">
          <div>
            <span className="product-card-price text-xl font-bold">
              ₹{product.pPrice}
            </span>
            {Number(product.pOffer) > 0 && (
              <span className="site-muted text-xs line-through ml-2">
                ₹{Math.round(product.pPrice / (1 - Number(product.pOffer) / 100))}
              </span>
            )}
          </div>
          {isOutOfStock ? (
            <span className="quantity-control flex items-center gap-1.5 px-3 py-2 text-xs font-semibold select-none">
              Sold Out
            </span>
          ) : quantity > 0 ? (
            <div className="quantity-control flex items-center overflow-hidden">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateQuantity(product._id, quantity - 1);
                }}
                className="px-2.5 py-1.5 text-sm font-bold transition-colors cursor-pointer focus:outline-none"
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
                className="px-2.5 py-1.5 text-sm font-bold transition-colors cursor-pointer focus:outline-none"
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
              className="btn-primary btn-sm flex items-center gap-1.5 text-xs cursor-pointer"
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
