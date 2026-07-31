"use client";

import React, { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/subscribers/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "Homepage" }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 animate-fade-up">
        <div className="badge badge-sage w-14 h-14 rounded-full flex items-center justify-center text-2xl">
          ✅
        </div>
        <p className="font-display text-[var(--color-espresso)] font-semibold">
          You're in! Thank you for subscribing.
        </p>
        <p className="site-muted text-xs">
          Expect wellness tips and exclusive offers in your inbox.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {error && <p className="alert alert-error text-sm mb-2">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3"
      >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        suppressHydrationWarning
        className="input flex-1 rounded-xl"
        autoComplete="email"
      />
      <button
        type="submit"
        disabled={loading}
        className="btn-primary rounded-xl whitespace-nowrap disabled:opacity-60"
      >
        {loading ? "Subscribing..." : "Subscribe Free"}
      </button>
      </form>
    </div>
  );
}
