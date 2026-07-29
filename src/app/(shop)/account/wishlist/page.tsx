"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Product, getAllProducts } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlistProducts = async () => {
    try {
      const wishlistIds: string[] = JSON.parse(localStorage.getItem("wishlist") || "[]");
      if (wishlistIds.length === 0) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }
      
      const allProducts = await getAllProducts();
      const filtered = allProducts.filter((p) => wishlistIds.includes(p._id));
      setWishlistItems(filtered);
    } catch (e) {
      console.error("Failed to load wishlist products:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistProducts();
    window.addEventListener("wishlist_updated", fetchWishlistProducts);
    return () => window.removeEventListener("wishlist_updated", fetchWishlistProducts);
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading your wishlist...</div>;
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border" style={{ borderColor: "#E8D5BC" }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#6B3E26]" style={{ fontFamily: "'Merriweather', serif" }}>
          My Wishlist ❤️
        </h2>
        {wishlistItems.length > 0 && (
          <span className="text-xs font-bold text-[#7A5C45] bg-[#FDF6EC] px-3 py-1.5 rounded-full border" style={{ borderColor: "#E8D5BC" }}>
            {wishlistItems.length} Item{wishlistItems.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="text-5xl mb-4">🤍</div>
          <h3 className="text-lg font-bold text-[#6B3E26] mb-1">Your wishlist is empty</h3>
          <p className="text-gray-500 text-xs mb-6 max-w-xs mx-auto">
            Explore our curated home products and add your favorites to your wishlist!
          </p>
          <Link href="/shop" className="px-6 py-2.5 bg-[#6B3E26] text-[#F5E9DA] rounded-full font-bold text-xs hover:bg-[#4e2c18] transition-all">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <div key={product._id} className="relative">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
