"use client";

import React, { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate submission (wire to your email API later)
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{ background: "#4CAF5020", border: "2px solid #4CAF50" }}>
          ✅
        </div>
        <p className="font-semibold" style={{ color: "#6B3E26", fontFamily: "'Merriweather', serif" }}>
          You're in! Thank you for subscribing.
        </p>
        <p className="text-xs" style={{ color: "#7A5C45" }}>
          Expect wellness tips and exclusive offers in your inbox.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        suppressHydrationWarning
        className="input flex-1"
        autoComplete="email"
      />
      <button
        type="submit"
        disabled={loading}
        className="btn-primary whitespace-nowrap disabled:opacity-60"
      >
        {loading ? "Subscribing..." : "Subscribe Free"}
      </button>
    </form>
  );
}
