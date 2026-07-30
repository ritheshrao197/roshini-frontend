"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCartCount } from "@/lib/cart";
import { API_URL, getAllProducts, Product } from "@/lib/api";
import { useCustomization } from "@/lib/CustomizationContext";
import { useAuth } from "@/lib/useAuth";
import { useLanguage } from "@/lib/LanguageContext";

export default function Header() {
  const router = useRouter();
  const { t } = useLanguage();
  const { settings, logoUrl } = useCustomization();
  const { shopName, shopSubtitle } = settings;
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCartCount(getCartCount());
    const updateCount = () => setCartCount(getCartCount());
    window.addEventListener("cart_updated", updateCount);

    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);

    // Close autocomplete dropdown on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("cart_updated", updateCount);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter products as user types
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q.length > 0) {
      if (allProducts.length === 0) {
        getAllProducts().then((data) => {
          setAllProducts(data);
          filterList(q, data);
        });
      } else {
        filterList(q, allProducts);
      }
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  const filterList = (q: string, list: Product[]) => {
    const matches = list
      .filter(
        (p) =>
          p.pName.toLowerCase().includes(q) ||
          (p.pDescription && p.pDescription.toLowerCase().includes(q))
      )
      .slice(0, 5); // Limit dropdown to top 5 results
    setSearchResults(matches);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setShowDropdown(false);
    setMobileSearchOpen(false);
    setMenuOpen(false);
    router.push(`/shop?search=${encodeURIComponent(q)}`);
  };

  const handleSignout = async () => {
    try {
      await fetch(`${API_URL}/signout`, { method: "POST", credentials: "include" });
    } catch {}
    logout();
    setMenuOpen(false);
    router.push("/login");
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="text-center text-[11px] font-medium py-2 px-4 tracking-wide" style={{ background: "var(--brand-brown)", color: "var(--on-brand)" }}>
        {t("announcement")}
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-md"
            : ""
        }`}
        style={{ background: scrolled ? "rgba(255,255,255,0.95)" : "var(--bg)", borderBottom: "1px solid var(--border)", boxShadow: scrolled ? "var(--shadow-sm)" : "none" }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-15 sm:h-16 md:h-18 gap-2">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group flex-shrink min-w-0">
              <img src={logoUrl || "/images/logo.png"} alt={shopName} className="h-9 sm:h-12 w-auto object-contain flex-shrink-0" />
              <div className="leading-none min-w-0">
                <div className="font-bold text-xs sm:text-base tracking-tight truncate" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>
                  {shopName}
                </div>
                <div className="text-[9px] sm:text-[10px] font-medium tracking-widest uppercase truncate hidden sm:block" style={{ color: "var(--text-muted)" }}>
                  {shopSubtitle}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { href: "/shop", label: t("nav.shop") },
                { href: "/blogs", label: t("nav.blogs") },
                { href: "/#values", label: t("nav.story") },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap"
                  style={{ color: "var(--text)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--brand-brown)"; e.currentTarget.style.background = "var(--brand-cream)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "transparent"; }}
                >
                  {item.label}
                </Link>
              ))}
              {user?.role === 1 && (
                <Link
                  href="/admin"
                  className="px-3 py-2 text-sm font-semibold rounded-lg transition-all"
                  style={{ color: "var(--brand-brown)" }}
                >
                  {t("nav.admin")}
                </Link>
              )}
            </nav>

            {/* Desktop Search Bar */}
            <div ref={searchContainerRef} className="hidden lg:block relative flex-1 max-w-xs mx-2">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                  placeholder={t("search.placeholder")}
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B3E26]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(""); setShowDropdown(false); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ✕
                  </button>
                )}
              </form>

              {/* Autocomplete Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 overflow-hidden z-50" style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)" }}>
                  {searchResults.length > 0 ? (
                    <div>
                      <div className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)", background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
                        Matching Products ({searchResults.length})
                      </div>
                      {searchResults.map((item) => {
                        const imgUrl = item.image?.secureUrl || item.images?.[0]?.secureUrl || item.pImages?.[0] || "/images/placeholder.jpg";
                        return (
                          <Link
                            key={item._id}
                            href={`/product/${item.slug || item._id}`}
                            onClick={() => { setShowDropdown(false); setSearchQuery(""); }}
                            className="flex items-center gap-3 px-3.5 py-2.5 transition-colors last:border-0 group"
                            style={{ borderBottom: "1px solid color-mix(in srgb, var(--border) 30%, transparent)" }}
                          >
                            <img src={imgUrl} alt={item.pName} className="w-10 h-10 object-cover" style={{ borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--surface-2)" }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate" style={{ color: "var(--text)" }}>
                                {item.pName}
                              </p>
                              <p className="text-[11px] font-semibold" style={{ color: "var(--brand-brown)" }}>
                                ₹{item.pPrice}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full text-center text-xs font-bold py-2.5 transition-colors"
                        style={{ color: "var(--brand-brown)", background: "var(--surface-2)", borderTop: "1px solid var(--border)" }}
                      >
                        See all results for "{searchQuery}" →
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                      No products found matching "<span className="font-semibold" style={{ color: "var(--text)" }}>{searchQuery}</span>"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">

              {/* Mobile Search Toggle Icon */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="lg:hidden p-2 rounded-lg transition-colors"
                style={{ color: "var(--brand-brown)" }}
                aria-label="Search"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-lg transition-colors"
                style={{ color: "var(--brand-brown)" }}
                aria-label="View cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold h-4.5 w-4.5 min-w-[18px] px-0.5 rounded-full flex items-center justify-center shadow-sm" style={{ background: "var(--brand-brown)" }}>
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/account/dashboard"
                    className="text-xs font-semibold px-3 py-2 transition-all"
                    style={{ color: "var(--brand-brown)", background: "var(--brand-cream)", borderRadius: "var(--radius-md)" }}
                  >
                    Hi, {user.name?.split(" ")[0] || "User"} 👋
                  </Link>
                  <button
                    onClick={handleSignout}
                    className="text-xs font-medium transition-colors"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-all"
                  style={{ background: "var(--brand-brown)", color: "var(--on-brand)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)" }}
                >
                  Sign In
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg transition-colors"
                style={{ color: "var(--brand-brown)" }}
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

          {/* Mobile Search Bar Expansion */}
          {mobileSearchOpen && (
            <div className="lg:hidden pb-3 pt-1 relative" style={{ borderTop: "1px solid var(--border)" }}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                  placeholder="Search natural products..."
                  className="w-full pl-9 pr-8 py-2 text-xs focus:outline-none focus:ring-2 transition-all"
                  style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}
                  autoFocus
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                  style={{ color: "var(--text-muted)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(""); setShowDropdown(false); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ✕
                  </button>
                )}
              </form>

              {/* Mobile Autocomplete Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 overflow-hidden z-50" style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)" }}>
                  {searchResults.length > 0 ? (
                    <div>
                      <div className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)", background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
                        Matching Products ({searchResults.length})
                      </div>
                      {searchResults.map((item) => {
                        const imgUrl = item.image?.secureUrl || item.images?.[0]?.secureUrl || item.pImages?.[0] || "/images/placeholder.jpg";
                        return (
                          <Link
                            key={item._id}
                            href={`/product/${item.slug || item._id}`}
                            onClick={() => { setShowDropdown(false); setSearchQuery(""); setMobileSearchOpen(false); }}
                            className="flex items-center gap-3 px-3.5 py-2.5 transition-colors last:border-0 group"
                            style={{ borderBottom: "1px solid color-mix(in srgb, var(--border) 30%, transparent)" }}
                          >
                            <img src={imgUrl} alt={item.pName} className="w-10 h-10 object-cover" style={{ borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--surface-2)" }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate" style={{ color: "var(--text)" }}>
                                {item.pName}
                              </p>
                              <p className="text-[11px] font-semibold" style={{ color: "var(--brand-brown)" }}>
                                ₹{item.pPrice}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full text-center text-xs font-bold py-2.5 transition-colors"
                        style={{ color: "var(--brand-brown)", background: "var(--surface-2)", borderTop: "1px solid var(--border)" }}
                      >
                        See all results for "{searchQuery}" →
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                      No products found matching "<span className="font-semibold" style={{ color: "var(--text)" }}>{searchQuery}</span>"
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Drawer Menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 pt-2 space-y-1" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
            {[
              { href: "/shop", label: "🛍️  Shop All" },
              { href: "/blogs", label: "📝  Blogs" },
              { href: "/#values", label: "🏡  Our Story" },
              { href: "/cart", label: `🛒  Cart (${cartCount})` },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium transition-all"
                style={{ color: "var(--text)", borderRadius: "var(--radius-md)" }}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/account/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold" style={{ color: "var(--brand-brown)", borderRadius: "var(--radius-md)" }}>
                  My Orders
                </Link>
                {user.role === 1 && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold" style={{ color: "var(--brand-brown)", borderRadius: "var(--radius-md)" }}>
                    Admin Console
                  </Link>
                )}
                <button onClick={handleSignout} className="w-full text-left px-4 py-3 text-sm font-medium" style={{ color: "var(--error)", borderRadius: "var(--radius-md)" }}>
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
