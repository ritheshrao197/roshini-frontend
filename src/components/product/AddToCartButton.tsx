"use client";

import React, { useState } from "react";
import { addToCart } from "@/lib/cart";

interface AddToCartButtonProps {
  productId: string;
  price: number;
  pName: string;
  pImage?: string;
  disabled?: boolean;
}

export default function AddToCartButton({
  productId,
  price,
  pName,
  pImage,
  disabled,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(productId, price, pName, pImage, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (disabled) {
    return (
      <button
        disabled
        className="flex-1 px-8 py-4 rounded-2xl font-semibold text-sm uppercase tracking-wider cursor-not-allowed"
        style={{ background: "#E8D5BC", color: "#7A5C45" }}
      >
        Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={added}
      className="flex-1 flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-sm uppercase tracking-wider transition-all duration-200"
      style={{
        background: added ? "#4CAF50" : "#6B3E26",
        color: "#F5E9DA",
        boxShadow: added
          ? "0 4px 16px rgba(76,175,80,0.35)"
          : "0 4px 16px rgba(107,62,38,0.25)",
        transform: added ? "scale(0.98)" : "scale(1)",
      }}
    >
      {added ? (
        <>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Added to Cart!
        </>
      ) : (
        <>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add to Cart
        </>
      )}
    </button>
  );
}
