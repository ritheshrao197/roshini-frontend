import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Shipping Policy | Roshini's Home Products",
  description: "Delivery timelines for Roshini's Home Products orders.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg, #FFFDF9)", color: "var(--text, #2C1A0E)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#B0886A" }}>
          Legal
        </p>
        <h1
          className="text-3xl sm:text-4xl font-bold mb-2"
          style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "#6B3E26" }}
        >
          Shipping Policy
        </h1>

        <div className="mt-8" style={{ color: "#3a2a1c" }}>
          <p className="text-sm leading-relaxed mb-4">
            All items are delivered within 2–4 days of dispatch.
          </p>
          <p className="text-sm leading-relaxed mb-4">
            For questions about an order in transit, see our{" "}
            <Link href="/refund-policy" className="underline">
              Refund Policy
            </Link>{" "}
            or contact us at{" "}
            <a href="mailto:roshinishomeproducts@gmail.com" className="underline">
              roshinishomeproducts@gmail.com
            </a>{" "}
            or{" "}
            <a href="tel:+919591896917" className="underline">
              +91 95918 96917
            </a>
            .
          </p>
        </div>

        <div className="mt-12 pt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ borderTop: "1px solid #E8D5BC" }}>
          <Link href="/refund-policy" className="font-bold hover:underline" style={{ color: "#6B3E26" }}>
            Refund Policy →
          </Link>
          <Link href="/privacy-policy" className="font-bold hover:underline" style={{ color: "#6B3E26" }}>
            Privacy Policy →
          </Link>
          <Link href="/terms-of-service" className="font-bold hover:underline" style={{ color: "#6B3E26" }}>
            Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
}
