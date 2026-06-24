"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/api";

type VerifyState = "loading" | "success" | "failed" | "pending" | "error";

function PaymentStatusContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const txnId        = searchParams.get("txnId");
  const gateway      = searchParams.get("gateway") || "phonepe";

  const [state,   setState]   = useState<VerifyState>("loading");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [amount,  setAmount]  = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!txnId) {
      setState("error");
      setMessage("No transaction ID found. Cannot verify payment.");
      return;
    }

    // For PhonePe — verify server-side
    async function verifyPayment() {
      try {
        const res  = await fetch(
          `${API_URL}/payment/${txnId}/verify`
        );
        const data = await res.json();

        if (data.success && data.status === "SUCCESS") {
          setState("success");
          setOrderId(String(data.orderId));
          setAmount(data.amount);
          // Auto-redirect after 3s
          setTimeout(() => {
            router.push(`/order-success?id=${data.orderId}`);
          }, 3000);
        } else if (data.status === "PENDING") {
          setState("pending");
          setMessage("Your payment is being processed. This may take a moment.");
        } else {
          setState("failed");
          setMessage(data.message || "Payment was not successful.");
        }
      } catch (err) {
        setState("error");
        setMessage("Could not verify payment. Please contact support with your transaction ID.");
      }
    }

    verifyPayment();
  }, [txnId, router]);

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

      <div className="w-full max-w-md bg-[#FDF6EC] border rounded-3xl p-8 shadow-sm text-center space-y-6" style={{ borderColor: "#E8D5BC" }}>

        {/* Loading */}
        {state === "loading" && (
          <>
            <div className="flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-[#6B3E26]/20 border-t-[#6B3E26] animate-spin" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif text-[#6B3E26]">Verifying Payment</h1>
              <p className="text-sm text-[#7A5C45] mt-2">
                Please wait while we confirm your payment with {gateway === "payu" ? "PayU" : "PhonePe"}...
              </p>
            </div>
            <p className="text-xs font-mono text-[#7A5C45] bg-white border px-3 py-2 rounded-xl" style={{ borderColor: "#E8D5BC" }}>
              TXN: {txnId}
            </p>
          </>
        )}

        {/* Success */}
        {state === "success" && (
          <>
            <div className="flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-4xl animate-bounce">
                ✅
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif text-emerald-700">Payment Successful!</h1>
              <p className="text-sm text-[#7A5C45] mt-2">
                Your order has been confirmed and is now being processed.
              </p>
            </div>
            {amount && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Amount Paid</p>
                <p className="text-3xl font-serif font-bold text-emerald-700 mt-1">₹{amount}</p>
              </div>
            )}
            <p className="text-xs text-[#7A5C45]">Redirecting to your order confirmation in 3 seconds...</p>
            <Link
              href={orderId ? `/order-success?id=${orderId}` : "/dashboard"}
              className="w-full block py-3 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full hover:bg-[#4e2c18] transition-all uppercase tracking-wider cursor-pointer"
            >
              View Order Details →
            </Link>
          </>
        )}

        {/* Pending */}
        {state === "pending" && (
          <>
            <div className="flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-4xl">
                ⏳
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif text-amber-700">Payment Pending</h1>
              <p className="text-sm text-[#7A5C45] mt-2">{message}</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => { setState("loading"); window.location.reload(); }}
                className="w-full py-3 bg-amber-500 text-white text-xs font-bold rounded-full hover:bg-amber-600 transition-all uppercase tracking-wider cursor-pointer"
              >
                🔄 Check Status Again
              </button>
              <Link href="/dashboard" className="block text-xs text-[#7A5C45] hover:underline">
                View your orders
              </Link>
            </div>
            <p className="text-xs font-mono text-[#7A5C45] bg-white border px-3 py-2 rounded-xl" style={{ borderColor: "#E8D5BC" }}>
              TXN: {txnId}
            </p>
          </>
        )}

        {/* Failed */}
        {state === "failed" && (
          <>
            <div className="flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center text-4xl">
                ❌
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif text-red-600">Payment Failed</h1>
              <p className="text-sm text-[#7A5C45] mt-2">{message || "Your payment could not be processed."}</p>
            </div>
            <div className="space-y-3">
              <Link
                href="/cart"
                className="w-full block py-3 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full hover:bg-[#4e2c18] transition-all uppercase tracking-wider text-center"
              >
                🔄 Try Again
              </Link>
              <Link href="/shop" className="block text-xs text-[#7A5C45] hover:underline">
                Back to Shop
              </Link>
            </div>
            <p className="text-xs font-mono text-[#7A5C45] bg-white border px-3 py-2 rounded-xl" style={{ borderColor: "#E8D5BC" }}>
              TXN: {txnId}
            </p>
          </>
        )}

        {/* Error */}
        {state === "error" && (
          <>
            <div className="flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-4xl">
                ⚠️
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif text-[#6B3E26]">Verification Error</h1>
              <p className="text-sm text-[#7A5C45] mt-2">{message}</p>
            </div>
            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="w-full block py-3 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full hover:bg-[#4e2c18] transition-all uppercase tracking-wider text-center"
              >
                Check My Orders
              </Link>
              <Link href="/cart" className="block text-xs text-[#7A5C45] hover:underline">
                Back to Cart
              </Link>
            </div>
            {txnId && (
              <p className="text-xs font-mono text-[#7A5C45] bg-white border px-3 py-2 rounded-xl" style={{ borderColor: "#E8D5BC" }}>
                TXN: {txnId}
              </p>
            )}
          </>
        )}
      </div>

      {/* Trust indicators */}
      <div className="mt-8 flex items-center gap-6 text-[10px] text-[#7A5C45] uppercase tracking-widest">
        <span>🔒 Secure</span>
        <span>·</span>
        <span>256-bit SSL</span>
        <span>·</span>
        <span>PCI Compliant</span>
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF9]">
        <div className="h-12 w-12 rounded-full border-4 border-[#6B3E26]/20 border-t-[#6B3E26] animate-spin" />
      </div>
    }>
      <PaymentStatusContent />
    </Suspense>
  );
}
