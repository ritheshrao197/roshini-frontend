import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Refund Policy | Roshini's Home Products",
  description: "Our returns and refunds policy for Roshini's Home Products.",
};

const sectionHeading = "text-xl sm:text-2xl font-bold mt-10 mb-3";
const paragraph = "text-sm leading-relaxed mb-4";

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
          <p className={paragraph}>
            We have a 30-day return policy, which means you have 30 days after receiving your item to request a
            return.
          </p>
          <p className={paragraph}>
            To be eligible for a return, your item must be in the same condition that you received it, unworn or
            unused, with tags, and in its original packaging. You&rsquo;ll also need the receipt or proof of
            purchase.
          </p>
          <p className={paragraph}>
            To start a return, you can contact us at{" "}
            <a href="mailto:roshinishomeproducts@gmail.com" className="underline">
              roshinishomeproducts@gmail.com
            </a>
            . If your return is accepted, we&rsquo;ll send you a return shipping label, as well as instructions on
            how and where to send your package. Items sent back to us without first requesting a return will not be
            accepted.
          </p>
          <p className={paragraph} style={{ fontWeight: 700 }}>
            No replacements or exchanges are provided.
          </p>

          <h2 className={sectionHeading} style={{ color: "#6B3E26" }}>
            Refunds
          </h2>
          <p className={paragraph}>
            We will notify you once we&rsquo;ve received and inspected your return, and let you know if the refund
            was approved or not. If approved, you&rsquo;ll be automatically refunded on your original payment method
            within 10 business days. Please remember it can take some time for your bank or payment provider to
            process and post the refund too.
          </p>
          <p className={paragraph}>
            If more than 15 business days have passed since we&rsquo;ve approved your return, please contact us at{" "}
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
