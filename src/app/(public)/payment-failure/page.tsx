"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const txnId        = searchParams.get("txnId");

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center px-6 font-sans text-[#2C1A0E]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0 mb-12">
        <div className="w-9 h-9 rounded-xl bg-[#6B3E26] flex items-center justify-center text-[#F5E9DA] font-bold text-lg shadow-sm group-hover:bg-[#4e2c18] transition-colors">
          R
        </div>
        <div className="leading-none text-left">
          <div className="font-bold text-[#6B3E26] text-base tracking-tight" style={{ fontFamily: "'Merriweather', serif" }}>
            Roshini's
          </div>
          <div className="text-[10px] text-[#7A5C45] font-medium tracking-widest uppercase">
            Home Products
          </div>
        </div>
      </Link>

      <div className="w-full max-w-md text-center space-y-8">
        {/* Illustration */}
        <div className="relative mx-auto w-36 h-36">
          <div className="absolute inset-0 rounded-full bg-red-50 border-2 border-red-100" />
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            💔
          </div>
          {/* Animated ring */}
          <div className="absolute inset-[-8px] rounded-full border-2 border-red-200/50 animate-ping" style={{ animationDuration: "2s" }} />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold font-serif text-red-600">Payment Failed</h1>
          <p className="text-sm text-[#7A5C45] max-w-xs mx-auto leading-relaxed">
            We couldn&apos;t process your payment. Don&apos;t worry — your cart items are saved and no money has been deducted.
          </p>
        </div>

        {/* What happened? */}
        <div className="bg-[#FDF6EC] border rounded-2xl p-5 text-left space-y-3" style={{ borderColor: "#E8D5BC" }}>
          <p className="text-xs font-bold text-[#7A5C45] uppercase tracking-wider">Common Reasons</p>
          <ul className="space-y-2 text-xs text-[#2C1A0E]/70">
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span>Insufficient balance or daily limit exceeded</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span>Payment timed out on the gateway page</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span>Bank declined the transaction</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span>UPI app not responding or wrong PIN entered</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/cart"
            className="w-full block py-3.5 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full hover:bg-[#4e2c18] transition-all shadow-sm uppercase tracking-wider text-center cursor-pointer"
          >
            🔄 Retry Payment
          </Link>
          <Link
            href="/shop"
            className="w-full block py-3.5 bg-white border text-xs font-semibold rounded-full hover:bg-[#F5E9DA] transition-all uppercase tracking-wider text-center"
            style={{ borderColor: "#E8D5BC", color: "#6B3E26" }}
          >
            Continue Shopping
          </Link>
          <Link
            href="/dashboard"
            className="block text-xs text-[#7A5C45] hover:underline pt-1"
          >
            Check my order history
          </Link>
        </div>

        {/* Support */}
        <div className="bg-[#FDF6EC] border border-dashed rounded-2xl p-4 space-y-1 text-xs text-[#7A5C45]" style={{ borderColor: "#E8D5BC" }}>
          <p>If money was deducted, it will be refunded within 5–7 business days.</p>
          <p>
            Need help?{" "}
            <a href="mailto:support@roshinishomeproducts.com" className="text-[#6B3E26] font-semibold hover:underline">
              support@roshinishomeproducts.com
            </a>
          </p>
          {txnId && (
            <p className="font-mono text-[10px] mt-2 bg-white border px-3 py-1.5 rounded-lg" style={{ borderColor: "#E8D5BC" }}>
              Ref: {txnId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF9]">
        <div className="h-12 w-12 rounded-full border-4 border-[#6B3E26]/20 border-t-[#6B3E26] animate-spin" />
      </div>
    }>
      <PaymentFailureContent />
    </Suspense>
  );
}
