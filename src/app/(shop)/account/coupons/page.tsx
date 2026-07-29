"use client";

import React, { useState } from "react";

interface Coupon {
  code: string;
  discount: string;
  description: string;
  minSpend: number;
  expiry: string;
}

const AVAILABLE_COUPONS: Coupon[] = [
  { code: "WELCOME10", discount: "10% OFF", description: "Get 10% off on your first order with us.", minSpend: 0, expiry: "31 Dec 2026" },
  { code: "ROSHINI20", discount: "20% OFF", description: "Save 20% on orders above ₹1,000.", minSpend: 1000, expiry: "31 Dec 2026" },
  { code: "FREESHIP", discount: "FREE SHIPPING", description: "Enjoy free home delivery on your purchase.", minSpend: 500, expiry: "31 Dec 2026" },
  { code: "HOMESTYLE15", discount: "15% OFF", description: "Save 15% on any organic spices or home care blends.", minSpend: 400, expiry: "30 Nov 2026" },
];

export default function CouponsPage() {
  const [activeTab, setActiveTab] = useState<"coupons" | "rewards">("coupons");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border" style={{ borderColor: "#E8D5BC" }}>
      <h2 className="text-2xl font-bold text-[#6B3E26] mb-2" style={{ fontFamily: "'Merriweather', serif" }}>
        Coupons & Rewards 🎟️
      </h2>
      <p className="text-gray-500 text-xs mb-6">Manage your promo codes, view loyalty rewards, and check your points balance.</p>

      {/* Tabs */}
      <div className="flex border-b mb-6" style={{ borderColor: "#F5E9DA" }}>
        <button
          onClick={() => setActiveTab("coupons")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "coupons"
              ? "border-[#6B3E26] text-[#6B3E26]"
              : "border-transparent text-gray-500 hover:text-[#6B3E26]"
          }`}
        >
          Active Coupons
        </button>
        <button
          onClick={() => setActiveTab("rewards")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "rewards"
              ? "border-[#6B3E26] text-[#6B3E26]"
              : "border-transparent text-gray-500 hover:text-[#6B3E26]"
          }`}
        >
          My Loyalty Rewards
        </button>
      </div>

      {activeTab === "coupons" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AVAILABLE_COUPONS.map((coupon) => (
            <div
              key={coupon.code}
              className="bg-[#FFFDF9] border rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden"
              style={{ borderColor: "#E8D5BC" }}
            >
              {/* Decorative side cuts for coupon look */}
              <div className="absolute left-[-10px] top-[calc(50%-10px)] w-5 h-5 rounded-full bg-white border-r" style={{ borderColor: "#E8D5BC" }} />
              <div className="absolute right-[-10px] top-[calc(50%-10px)] w-5 h-5 rounded-full bg-white border-l" style={{ borderColor: "#E8D5BC" }} />

              <div className="border-b border-dashed pb-3 mb-3" style={{ borderColor: "#F5E9DA" }}>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E6A817] block mb-1">
                  Promo Deal
                </span>
                <h3 className="text-lg font-serif font-extrabold text-[#6B3E26] mb-1">
                  {coupon.discount}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed pr-2">
                  {coupon.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className="text-[9px] text-gray-400">Min. Spend: ₹{coupon.minSpend}</p>
                  <p className="text-[9px] text-gray-400">Expires: {coupon.expiry}</p>
                </div>
                <button
                  onClick={() => handleCopy(coupon.code)}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                    copiedCode === coupon.code
                      ? "bg-green-600 text-white"
                      : "bg-[#6B3E26] text-[#F5E9DA] hover:bg-[#4e2c18]"
                  }`}
                >
                  {copiedCode === coupon.code ? "✓ COPIED" : `COPY: ${coupon.code}`}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Points Summary */}
          <div className="bg-[#FDF6EC] border p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-6" style={{ borderColor: "#E8D5BC" }}>
            <div className="text-center sm:text-left space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5C45]">Your Balance</span>
              <h3 className="text-3xl font-extrabold text-[#6B3E26] font-serif">150 Points</h3>
              <p className="text-xs text-gray-500">Equivalent to ₹15.00 discount on your next checkout.</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="px-5 py-2.5 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full hover:bg-[#4e2c18] transition-all cursor-pointer"
              >
                Redeem for Coupon
              </button>
            </div>
          </div>

          {/* How it works */}
          <div className="space-y-3.5">
            <h4 className="text-xs uppercase font-extrabold text-[#7A5C45] tracking-wider">How to Earn Rewards</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white border rounded-xl" style={{ borderColor: "#E8D5BC" }}>
                <div className="text-2xl mb-1.5">🛍️</div>
                <h5 className="text-xs font-bold text-[#6B3E26] mb-0.5">Shop and Earn</h5>
                <p className="text-[10px] text-gray-500">Earn 10 points for every ₹100 spent on any purchase.</p>
              </div>
              <div className="p-4 bg-white border rounded-xl" style={{ borderColor: "#E8D5BC" }}>
                <div className="text-2xl mb-1.5">🎂</div>
                <h5 className="text-xs font-bold text-[#6B3E26] mb-0.5">Birthday Bonus</h5>
                <p className="text-[10px] text-gray-500">Get 100 points as a gift on your birthday every year.</p>
              </div>
              <div className="p-4 bg-white border rounded-xl" style={{ borderColor: "#E8D5BC" }}>
                <div className="text-2xl mb-1.5">📢</div>
                <h5 className="text-xs font-bold text-[#6B3E26] mb-0.5">Refer a Friend</h5>
                <p className="text-[10px] text-gray-500">Invite friends and receive a ₹100 discount coupon upon their first purchase.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
