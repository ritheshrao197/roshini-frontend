"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCartCount } from "@/lib/cart";
import { API_URL } from "@/lib/api";

export default function Header() {
  const router = useRouter();
  const [user, setUser]         = useState<{ name: string; role: number } | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch {}
    }
    setCartCount(getCartCount());
    const updateCount = () => setCartCount(getCartCount());
    window.addEventListener("cart_updated", updateCount);

    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("cart_updated", updateCount);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleSignout = async () => {
    try {
      await fetch(`${API_URL}/signout`, { method: "POST", credentials: "include" });
    } catch {}
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
    setMenuOpen(false);
    router.push("/login");
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-[#6B3E26] text-[#F5E9DA] text-center text-[11px] font-medium py-2 px-4 tracking-wide">
        🌿 Free shipping on orders above ₹499 &nbsp;|&nbsp; Handcrafted in Karnataka &nbsp;|&nbsp; 100% Natural Ingredients
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(107,62,38,0.12)]"
            : "bg-[#FFFDF9]"
        } border-b border-[#E8D5BC]`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-18">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-[#6B3E26] flex items-center justify-center text-[#F5E9DA] font-bold text-lg shadow-sm group-hover:bg-[#4e2c18] transition-colors">
                R
              </div>
              <div className="leading-none">
                <div className="font-bold text-[#6B3E26] text-base tracking-tight" style={{ fontFamily: "'Merriweather', serif" }}>
                  Roshini's
                </div>
                <div className="text-[10px] text-[#7A5C45] font-medium tracking-widest uppercase">
                  Home Products
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { href: "/shop", label: "Shop All" },
                { href: "/shop?category=health-mixes", label: "Health Mixes" },
                { href: "/blogs", label: "Blogs" },
                { href: "/#values", label: "Our Story" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-[#2C1A0E] hover:text-[#6B3E26] hover:bg-[#F5E9DA] rounded-lg transition-all"
                >
                  {item.label}
                </Link>
              ))}
              {user?.role === 1 && (
                <Link
                  href="/admin"
                  className="px-3 py-2 text-sm font-semibold text-[#6B3E26] hover:bg-[#F5E9DA] rounded-lg transition-all"
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-[#6B3E26] hover:bg-[#F5E9DA] rounded-lg transition-colors"
                aria-label="View cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#E6A817] text-white text-[10px] font-bold h-4.5 w-4.5 min-w-[18px] px-0.5 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/account/dashboard"
                    className="text-xs font-semibold text-[#6B3E26] bg-[#F5E9DA] hover:bg-[#ede0cc] px-3 py-2 rounded-full transition-all"
                  >
                    Hi, {user.name?.split(" ")[0] || "User"} 👋
                  </Link>
                  <button
                    onClick={handleSignout}
                    className="text-xs font-medium text-[#7A5C45] hover:text-[#B23A2A] transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-[#6B3E26] text-[#F5E9DA] text-sm font-semibold rounded-full hover:bg-[#4e2c18] transition-all shadow-sm"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-[#6B3E26] hover:bg-[#F5E9DA] rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[#E8D5BC] px-4 pb-4 pt-2 space-y-1 shadow-lg">
            {[
              { href: "/shop", label: "🛍️  Shop All" },
              { href: "/shop?category=health-mixes", label: "💚  Health Mixes" },
              { href: "/blogs", label: "📝  Blogs" },
              { href: "/#values", label: "🏡  Our Story" },
              { href: "/cart", label: `🛒  Cart (${cartCount})` },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-[#2C1A0E] hover:bg-[#F5E9DA] hover:text-[#6B3E26] rounded-xl transition-all"
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/account/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-[#6B3E26] hover:bg-[#F5E9DA] rounded-xl">
                  My Orders
                </Link>
                {user.role === 1 && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-[#6B3E26] hover:bg-[#F5E9DA] rounded-xl">
                    Admin Console
                  </Link>
                )}
                <button onClick={handleSignout} className="w-full text-left px-4 py-3 text-sm font-medium text-[#B23A2A] hover:bg-red-50 rounded-xl">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-center btn-primary mt-2">
                Sign In
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
