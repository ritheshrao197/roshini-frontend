"use client";

import React, { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState({
    email: {
      orders: true,
      promotions: true,
      newsletter: true,
    },
    sms: {
      orders: true,
    },
    whatsapp: {
      orders: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/account/profile`, {
        headers: { token: token || "" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user?.notifications) {
          setNotifications({
            email: {
              orders: data.user.notifications.email?.orders !== false,
              promotions: data.user.notifications.email?.promotions !== false,
              newsletter: data.user.notifications.email?.newsletter !== false,
            },
            sms: {
              orders: data.user.notifications.sms?.orders !== false,
            },
            whatsapp: {
              orders: !!data.user.notifications.whatsapp?.orders,
            },
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/account/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token || "",
        },
        body: JSON.stringify({ notifications }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Notification settings updated successfully!", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to update settings", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Network error", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading notification settings...</div>;

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border" style={{ borderColor: "#E8D5BC" }}>
      <h2 className="text-2xl font-bold text-[#6B3E26] mb-2" style={{ fontFamily: "'Merriweather', serif" }}>
        Notification Settings 🔔
      </h2>
      <p className="text-gray-500 text-xs mb-6">Choose how and when you would like to be notified about your orders and store updates.</p>

      {message.text && (
        <div className={`p-4 mb-6 rounded-xl text-sm font-bold border ${
          message.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Email Notifications */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase font-extrabold text-[#7A5C45] tracking-wider border-b pb-2" style={{ borderColor: "#F5E9DA" }}>
            Email Alerts
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="emailOrders" className="text-xs font-bold text-[#6B3E26] cursor-pointer">Order Confirmations & Tracking</label>
                <p className="text-[10px] text-gray-500">Receive order status, transaction invoices, and tracking links.</p>
              </div>
              <input
                type="checkbox"
                id="emailOrders"
                checked={notifications.email.orders}
                onChange={(e) => setNotifications({
                  ...notifications,
                  email: { ...notifications.email, orders: e.target.checked }
                })}
                className="w-4 h-4 rounded accent-[#6B3E26]"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="emailPromotions" className="text-xs font-bold text-[#6B3E26] cursor-pointer">Promotional Offers & Coupons</label>
                <p className="text-[10px] text-gray-500">Get notified about exclusive deals, sales, and seasonal events.</p>
              </div>
              <input
                type="checkbox"
                id="emailPromotions"
                checked={notifications.email.promotions}
                onChange={(e) => setNotifications({
                  ...notifications,
                  email: { ...notifications.email, promotions: e.target.checked }
                })}
                className="w-4 h-4 rounded accent-[#6B3E26]"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="emailNewsletter" className="text-xs font-bold text-[#6B3E26] cursor-pointer">Weekly Newsletter & Vlogs</label>
                <p className="text-[10px] text-gray-500">Get the latest articles, recipes, and home care tips.</p>
              </div>
              <input
                type="checkbox"
                id="emailNewsletter"
                checked={notifications.email.newsletter}
                onChange={(e) => setNotifications({
                  ...notifications,
                  email: { ...notifications.email, newsletter: e.target.checked }
                })}
                className="w-4 h-4 rounded accent-[#6B3E26]"
              />
            </div>
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase font-extrabold text-[#7A5C45] tracking-wider border-b pb-2" style={{ borderColor: "#F5E9DA" }}>
            SMS Alerts
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="smsOrders" className="text-xs font-bold text-[#6B3E26] cursor-pointer">Order Updates & OTPs</label>
              <p className="text-[10px] text-gray-500">Receive real-time order delivery updates and secure login OTPs.</p>
            </div>
            <input
              type="checkbox"
              id="smsOrders"
              checked={notifications.sms.orders}
              onChange={(e) => setNotifications({
                ...notifications,
                sms: { orders: e.target.checked }
              })}
              className="w-4 h-4 rounded accent-[#6B3E26]"
            />
          </div>
        </div>

        {/* WhatsApp Notifications */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase font-extrabold text-[#7A5C45] tracking-wider border-b pb-2" style={{ borderColor: "#F5E9DA" }}>
            WhatsApp Integration
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="whatsappOrders" className="text-xs font-bold text-[#6B3E26] cursor-pointer">Delivery updates on WhatsApp</label>
              <p className="text-[10px] text-gray-500">Get status notifications directly in your WhatsApp chat for convenience.</p>
            </div>
            <input
              type="checkbox"
              id="whatsappOrders"
              checked={notifications.whatsapp.orders}
              onChange={(e) => setNotifications({
                ...notifications,
                whatsapp: { orders: e.target.checked }
              })}
              className="w-4 h-4 rounded accent-[#6B3E26]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full hover:bg-[#4e2c18] transition-all disabled:opacity-60 cursor-pointer"
        >
          {saving ? "Saving settings..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
