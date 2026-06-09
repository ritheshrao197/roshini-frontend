"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { token: token || "", "Content-Type": "application/json" };

        const [profileRes, ordersRes] = await Promise.all([
          fetch(`${API_URL}/account/profile`, { headers }),
          fetch(`${API_URL}/order/user`, { 
            method: "POST", 
            headers, 
            body: JSON.stringify({ uId: JSON.parse(localStorage.getItem("user") || "{}")._id }) 
          })
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData.user);
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData.Order || []);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your dashboard...</div>;

  const totalSpent = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const savedAddressesCount = profile?.addresses?.length || 0;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl border" style={{ borderColor: "#E8D5BC" }}>
        <h2 className="text-2xl font-bold text-[#6B3E26] mb-2" style={{ fontFamily: "'Merriweather', serif" }}>
          Welcome back, {profile?.name || "Customer"}! 👋
        </h2>
        <p className="text-gray-600">From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border flex items-center gap-4" style={{ borderColor: "#E8D5BC" }}>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl">📦</div>
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Orders</p>
            <p className="text-2xl font-bold text-[#6B3E26]">{orders.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border flex items-center gap-4" style={{ borderColor: "#E8D5BC" }}>
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-2xl">💸</div>
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Spent</p>
            <p className="text-2xl font-bold text-[#6B3E26]">₹{totalSpent.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border flex items-center gap-4" style={{ borderColor: "#E8D5BC" }}>
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center text-2xl">📍</div>
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Saved Addresses</p>
            <p className="text-2xl font-bold text-[#6B3E26]">{savedAddressesCount}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-2xl border" style={{ borderColor: "#E8D5BC" }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#6B3E26]">Recent Orders</h3>
          <Link href="/account/orders" className="text-sm font-bold text-[#E6A817] hover:underline">
            View All
          </Link>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link href="/shop" className="px-6 py-2 bg-[#6B3E26] text-[#F5E9DA] rounded-full font-bold text-sm">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b">
                <tr>
                  <th className="px-4 py-3 font-bold rounded-tl-lg">Order ID</th>
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Total</th>
                  <th className="px-4 py-3 font-bold text-right rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.slice(0, 3).map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-mono text-xs text-gray-600">{order.transactionId}</td>
                    <td className="px-4 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        order.status === "Delivered" ? "bg-green-100 text-green-700" :
                        order.status === "Cancelled" ? "bg-red-100 text-red-700" :
                        "bg-orange-100 text-orange-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-bold text-[#6B3E26]">₹{order.amount}</td>
                    <td className="px-4 py-4 text-right">
                      <Link href={`/account/orders/${order._id}`} className="text-blue-600 hover:text-blue-800 text-xs font-bold">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/shop" className="p-4 bg-white border rounded-xl text-center hover:bg-gray-50 transition-colors" style={{ borderColor: "#E8D5BC" }}>
          <div className="text-2xl mb-2">🛍️</div>
          <span className="text-xs font-bold text-[#6B3E26]">Shop Again</span>
        </Link>
        <Link href="/account/profile" className="p-4 bg-white border rounded-xl text-center hover:bg-gray-50 transition-colors" style={{ borderColor: "#E8D5BC" }}>
          <div className="text-2xl mb-2">📝</div>
          <span className="text-xs font-bold text-[#6B3E26]">Edit Profile</span>
        </Link>
        <Link href="/account/addresses" className="p-4 bg-white border rounded-xl text-center hover:bg-gray-50 transition-colors" style={{ borderColor: "#E8D5BC" }}>
          <div className="text-2xl mb-2">🏠</div>
          <span className="text-xs font-bold text-[#6B3E26]">Addresses</span>
        </Link>
        <Link href="/account/wishlist" className="p-4 bg-white border rounded-xl text-center hover:bg-gray-50 transition-colors" style={{ borderColor: "#E8D5BC" }}>
          <div className="text-2xl mb-2">❤️</div>
          <span className="text-xs font-bold text-[#6B3E26]">Wishlist</span>
        </Link>
      </div>

    </div>
  );
}
