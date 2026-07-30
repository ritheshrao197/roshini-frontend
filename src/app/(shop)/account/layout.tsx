"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    } else {
      try {
        setUser(JSON.parse(storedUser));
        setLoading(false);
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      }
    }
  }, [pathname, router]);

  const menuItems = [
    { label: "Dashboard", href: "/account/dashboard", icon: "📊" },
    { label: "My Profile", href: "/account/profile", icon: "👤" },
    { label: "Manage Addresses", href: "/account/addresses", icon: "📍" },
    { label: "My Orders", href: "/account/orders", icon: "📦" },
    { label: "Wishlist", href: "/account/wishlist", icon: "❤️" },
    { label: "Coupons & Rewards", href: "/account/coupons", icon: "🎟️" },
    { label: "Notifications", href: "/account/notifications", icon: "🔔" },
    { label: "Preferences", href: "/account/preferences", icon: "⚙️" },
    { label: "Security", href: "/account/security", icon: "🔒" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center text-[#6B3E26] dark:text-[#F5E9DA] font-semibold animate-pulse">
          Verifying session details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 pt-24 bg-background text-foreground">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif text-brand-brown">
            My Account
          </h1>
          <p className="text-sm mt-1 text-text-muted">Manage your orders, profile, and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4">
            <div className="p-4 sticky top-24 shadow-sm bg-surface border border-border rounded-xl">
              
              {/* User Snapshot */}
              <div className="flex items-center gap-4 p-4 border-b mb-4 border-border">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl uppercase shadow-sm bg-brand-brown text-on-brand">
                  {user?.name ? user.name.charAt(0) : "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold truncate text-brand-brown">{user?.name || "User"}</p>
                  <p className="text-xs truncate text-text-muted">{user?.email}</p>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="flex flex-col gap-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-lg ${
                        isActive
                          ? "bg-brand-brown text-on-brand shadow-sm"
                          : "text-foreground hover:bg-surface-2 hover:text-brand-brown"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <hr className="my-4 border-border" />
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <span className="text-lg">🚪</span>
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="w-full lg:w-3/4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
