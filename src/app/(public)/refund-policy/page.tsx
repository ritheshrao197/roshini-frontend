import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Refund Policy | Roshini's Home Products",
  description: "Our returns and refunds policy for Roshini's Home Products.",
};

const sectionHeading = "text-xl sm:text-2xl font-bold mt-10 mb-3";
const paragraph = "text-sm leading-relaxed mb-4";
const list = "list-disc pl-5 space-y-2 text-sm leading-relaxed mb-4";

export default function RefundPolicyPage() {
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
          Refund Policy
        </h1>

        <div className="mt-8" style={{ color: "#3a2a1c" }}>
          <p className={paragraph} style={{ fontWeight: 700 }}>
            We do not offer returns, replacements, or refunds for any reason other than physical damage sustained
            during shipping. Because most of our products are consumable food items, we cannot accept a product
            back into stock once it has left our facility, and we are unable to offer refunds for change of mind,
            taste preference, or similar reasons.
          </p>

          <h2 className={sectionHeading} style={{ color: "#6B3E26" }}>
            Damaged in Transit
          </h2>
          <p className={paragraph}>
            If your order arrives visibly damaged, leaking, broken, or tampered with, we will offer a refund or a
            replacement for the affected item(s). To be eligible:
          </p>
          <ul className={list}>
            <li>Contact us within 48 hours of delivery.</li>
            <li>
              Share clear photos or a short video of the damaged product, its packaging, and the shipping label,
              showing the issue.
            </li>
            <li>Keep the item and its packaging until your claim is resolved &mdash; we may ask you to return it.</li>
          </ul>
          <p className={paragraph}>
            To report transport damage, contact us at{" "}
            <a href="mailto:roshinishomeproducts@gmail.com" className="underline">
              roshinishomeproducts@gmail.com
            </a>{" "}
            or{" "}
            <a href="tel:+919591896917" className="underline">
              +91 95918 96917
            </a>
            , with your order number.
          </p>

          <h2 className={sectionHeading} style={{ color: "#6B3E26" }}>
            Refunds
          </h2>
          <p className={paragraph}>
            Once we&rsquo;ve reviewed your claim and confirmed the damage, we&rsquo;ll let you know whether a refund
            or a replacement will be provided. Approved refunds are issued to your original payment method within
            10 business days; it can take additional time for your bank or payment provider to post the refund.
          </p>
          <p className={paragraph}>
            If more than 15 business days have passed since we&rsquo;ve approved your refund, please contact us at{" "}
            <a href="mailto:roshinishomeproducts@gmail.com" className="underline">
              roshinishomeproducts@gmail.com
            </a>
            .
          </p>
        </div>

        <div className="mt-12 pt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ borderTop: "1px solid #E8D5BC" }}>
          <Link href="/shipping-policy" className="font-bold hover:underline" style={{ color: "#6B3E26" }}>
            Shipping Policy →
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
