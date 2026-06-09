"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }
  }, []);

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

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10 pt-24" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#6B3E26]" style={{ fontFamily: "'Merriweather', serif" }}>
            My Account
          </h1>
          <p className="text-gray-500">Manage your orders, profile, and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm border p-4 sticky top-24" style={{ borderColor: "#E8D5BC" }}>
              
              {/* User Snapshot */}
              <div className="flex items-center gap-4 p-4 border-b mb-4" style={{ borderColor: "#F5E9DA" }}>
                <div className="w-12 h-12 rounded-full bg-[#6B3E26] text-white flex items-center justify-center font-bold text-xl uppercase">
                  {user?.name ? user.name.charAt(0) : "U"}
                </div>
                <div>
                  <p className="font-bold text-[#6B3E26] truncate w-40">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-500 truncate w-40">{user?.email}</p>
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
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                        isActive 
                          ? "bg-[#6B3E26] text-[#F5E9DA] shadow-md" 
                          : "text-gray-600 hover:bg-[#FDF6EC] hover:text-[#6B3E26]"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <hr className="my-4 border-[#F5E9DA]" />
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium text-red-600 hover:bg-red-50"
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
