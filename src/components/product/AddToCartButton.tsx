"use client";

import React, { useState, useEffect } from "react";
import { getCart, addToCart, updateQuantity } from "@/lib/cart";

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
  const [quantity, setQuantity] = useState(0);

  const refreshCartQuantity = () => {
    const cart = getCart();
    const item = cart.find((i) => i.id === productId);
    setQuantity(item ? item.quantitiy : 0);
  };

  useEffect(() => {
    refreshCartQuantity();
    window.addEventListener("cart_updated", refreshCartQuantity);
    return () => window.removeEventListener("cart_updated", refreshCartQuantity);
  }, [productId]);

  const handleAdd = () => {
    addToCart(productId, price, pName, pImage, 1);
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

  if (quantity > 0) {
    return (
      <div className="flex-1 flex items-center bg-[#F5E9DA] rounded-2xl border border-[#E8D5BC] overflow-hidden justify-between">
        <button
          type="button"
          onClick={() => updateQuantity(productId, quantity - 1)}
          className="px-6 py-4 text-lg font-bold text-[#6B3E26] hover:bg-[#ede0cc] transition-colors cursor-pointer focus:outline-none"
        >
          −
        </button>
        <span className="px-4 text-sm font-bold text-[#6B3E26] text-center select-none uppercase tracking-wider">
          {quantity} in Cart
        </span>
        <button
          type="button"
          onClick={() => updateQuantity(productId, quantity + 1)}
          className="px-6 py-4 text-lg font-bold text-[#6B3E26] hover:bg-[#ede0cc] transition-colors cursor-pointer focus:outline-none"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className="flex-1 flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer"
      style={{
        background: "#6B3E26",
        color: "#F5E9DA",
        boxShadow: "0 4px 16px rgba(107,62,38,0.25)",
      }}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      Add to Cart
    </button>
  );
}
