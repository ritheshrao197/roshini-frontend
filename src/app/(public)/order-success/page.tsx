"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || "N/A";
  const [deliveryDate, setDeliveryDate] = useState("");

  useEffect(() => {
    // Generate a delivery date 3-5 days out
    const date = new Date();
    date.setDate(date.getDate() + 4);
    setDeliveryDate(date.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
  }, []);

  return (
    <main className="max-w-3xl mx-auto w-full px-6 py-16 flex-1 flex flex-col justify-center text-[#2C1A0E]">
      <div className="border rounded-3xl p-10 bg-[#FDF6EC] text-center space-y-6 shadow-sm" style={{ borderColor: "#E8D5BC" }}>
        {/* Animated Checkmark Badge */}
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-50 border border-green-200 text-green-600 text-4xl animate-bounce">
          ✓
        </div>
        
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-widest block">Transaction Secure</span>
          <h1 className="text-3xl font-bold font-serif text-[#6B3E26]">Order Confirmed!</h1>
          <p className="text-xs text-[#7A5C45] font-mono select-all">Order ID: {orderId}</p>
        </div>

        <div className="max-w-md mx-auto py-6 border-y space-y-3.5 text-sm text-left" style={{ borderColor: "#E8D5BC" }}>
          <div className="flex justify-between">
            <span className="text-[#7A5C45]">Payment Method</span>
            <span className="font-semibold text-[#6B3E26]">Online / Cash on Delivery</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A5C45]">Status</span>
            <span className="font-semibold text-green-600 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full text-xs">Pending Fulfillment</span>
          </div>
          <div className="flex justify-between items-start gap-4">
            <span className="text-[#7A5C45]">Expected Delivery</span>
            <span className="font-semibold text-[#6B3E26] text-right text-xs max-w-[200px]">
              {deliveryDate || "Within 4 working days"}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#7A5C45] max-w-sm mx-auto">
          We are preparing your natural organic wellness batch! You will receive confirmation details and fulfillment logs shortly.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/dashboard" className="px-6 py-3.5 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full hover:bg-[#4e2c18] transition-all text-center cursor-pointer">
            🚀 Track in My Dashboard
          </Link>
          <Link href="/shop" className="px-6 py-3.5 bg-white border text-xs font-bold rounded-full hover:bg-[#F5E9DA] transition-all text-center" style={{ borderColor: "#E8D5BC", color: "#6B3E26" }}>
            🌱 Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2C1A0E] flex flex-col font-sans">

      <Suspense fallback={
        <main className="max-w-3xl mx-auto w-full px-6 py-16 flex-1 flex flex-col justify-center text-center">
          <p className="text-sm">Loading order details...</p>
        </main>
      }>
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}
