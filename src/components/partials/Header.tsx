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
      <div className="site-announcement text-center text-[11px] font-medium py-2.5 px-4 tracking-wide">
        {t("announcement")}
      </div>

      <header
        className={`site-header sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "is-scrolled backdrop-blur-md"
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4 sm:gap-6">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink min-w-0 pr-2">
              <img src={logoUrl || "/images/logo.png"} alt={shopName} className="h-10 sm:h-12 w-auto object-contain flex-shrink-0" />
              <div className="leading-tight min-w-0">
                <div className="site-logo-name font-bold text-sm sm:text-lg tracking-tight truncate">
                  {shopName}
                </div>
                <div className="site-muted text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase truncate hidden sm:block">
                  {shopSubtitle}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-6">
              {[
                { href: "/shop", label: t("nav.shop") },
                { href: "/blogs", label: t("nav.blogs") },
                { href: "/#values", label: t("nav.story") },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="site-link px-3.5 py-2 text-sm font-semibold transition-all whitespace-nowrap hover:bg-black/5 rounded-lg"
                >
                  {item.label}
                </Link>
              ))}
              {user?.role === 1 && (
                <Link
                  href="/admin"
                  className="site-link px-3.5 py-2 text-sm font-bold transition-all hover:bg-black/5 rounded-lg"
                >
                  {t("nav.admin")}
                </Link>
              )}
            </nav>

            {/* Desktop Search Bar */}
            <div ref={searchContainerRef} className="hidden lg:block relative flex-1 max-w-xs mx-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                  placeholder={t("search.placeholder")}
                  className="input input-sm w-full pl-10 pr-8 text-xs"
                />
                <svg
                  className="icon-action absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
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
                    className="site-muted absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </form>

              {/* Autocomplete Dropdown */}
              {showDropdown && (
                <div className="search-dropdown absolute top-full left-0 right-0 mt-2 overflow-hidden z-50">
                  {searchResults.length > 0 ? (
                    <div>
                      <div className="search-dropdown-heading px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider">
                        Matching Products ({searchResults.length})
                      </div>
                      {searchResults.map((item) => {
                        const imgUrl = item.image?.secureUrl || item.images?.[0]?.secureUrl || item.pImages?.[0] || "/images/placeholder.jpg";
                        return (
                          <Link
                            key={item._id}
                            href={`/product/${item.slug || item._id}`}
                            onClick={() => { setShowDropdown(false); setSearchQuery(""); }}
                            className="search-result flex items-center gap-3 px-3.5 py-2.5 transition-colors last:border-0 group"
                          >
                            <img src={imgUrl} alt={item.pName} className="search-result-image w-10 h-10 object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate">
                                {item.pName}
                              </p>
                              <p className="product-card-title text-[11px] font-semibold">
                                ₹{item.pPrice}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                      <button
                        onClick={handleSearchSubmit}
                        className="btn-ghost w-full text-center text-xs font-bold py-2.5"
                      >
                        See all results for "{searchQuery}" →
                      </button>
                    </div>
                  ) : (
                    <div className="site-muted p-4 text-center text-xs">
                      No products found matching "<span className="font-semibold text-[var(--color-text)]">{searchQuery}</span>"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 sm:gap-4">

              {/* Mobile Search Toggle Icon */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="icon-action lg:hidden p-2 transition-colors"
                aria-label="Search"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="icon-action relative p-2 transition-colors"
                aria-label="View cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="cart-count absolute -top-0.5 -right-0.5 text-[10px] font-bold h-4.5 w-4.5 min-w-[18px] px-0.5 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/account/dashboard"
                    className="site-link text-xs font-semibold px-3 py-2 transition-all"
                  >
                    Hi, {user.name?.split(" ")[0] || "User"} 👋
                  </Link>
                  <button
                    onClick={handleSignout}
                    className="site-muted text-xs font-medium transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="btn-primary btn-sm hidden md:inline-flex items-center gap-1.5"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="icon-action md:hidden p-2 transition-colors"
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
            <div className="lg:hidden pb-3 pt-1 relative border-t border-[var(--color-border)]">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                  placeholder="Search natural products..."
                  className="input input-sm w-full pl-10 pr-8 text-xs"
                  autoFocus
                />
                <svg
                  className="site-muted absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
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
                    className="site-muted absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </form>

              {/* Mobile Autocomplete Dropdown */}
              {showDropdown && (
                <div className="search-dropdown absolute top-full left-0 right-0 mt-1 overflow-hidden z-50">
                  {searchResults.length > 0 ? (
                    <div>
                      <div className="search-dropdown-heading px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider">
                        Matching Products ({searchResults.length})
                      </div>
                      {searchResults.map((item) => {
                        const imgUrl = item.image?.secureUrl || item.images?.[0]?.secureUrl || item.pImages?.[0] || "/images/placeholder.jpg";
                        return (
                          <Link
                            key={item._id}
                            href={`/product/${item.slug || item._id}`}
                            onClick={() => { setShowDropdown(false); setSearchQuery(""); setMobileSearchOpen(false); }}
                            className="search-result flex items-center gap-3 px-3.5 py-2.5 transition-colors last:border-0 group"
                          >
                            <img src={imgUrl} alt={item.pName} className="search-result-image w-10 h-10 object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate">
                                {item.pName}
                              </p>
                              <p className="product-card-title text-[11px] font-semibold">
                                ₹{item.pPrice}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                      <button
                        onClick={handleSearchSubmit}
                        className="btn-ghost w-full text-center text-xs font-bold py-2.5"
                      >
                        See all results for "{searchQuery}" →
                      </button>
                    </div>
                  ) : (
                    <div className="site-muted p-4 text-center text-xs">
                      No products found matching "<span className="font-semibold text-[var(--color-text)]">{searchQuery}</span>"
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Drawer Menu */}
        {menuOpen && (
          <div className="header-mobile-panel md:hidden px-4 pb-4 pt-2 space-y-1">
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
                className="site-link block px-4 py-3 text-sm font-medium transition-all"
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/account/dashboard" onClick={() => setMenuOpen(false)} className="site-link block px-4 py-3 text-sm font-semibold">
                  My Orders
                </Link>
                {user.role === 1 && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="site-link block px-4 py-3 text-sm font-semibold">
                    Admin Console
                  </Link>
                )}
                <button onClick={handleSignout} className="btn-ghost w-full justify-start text-left px-4 py-3 text-sm font-medium text-red-700">
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
