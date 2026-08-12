"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password !== cPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, cPassword }),
      });
      const data = await res.json();
      
      if (data.error) {
        // Handle nested error object from Express backend
        if (typeof data.error === "object") {
          const firstErr = Object.values(data.error).find(v => v !== "");
          setError(firstErr ? String(firstErr) : "Invalid input parameters.");
        } else {
          setError(data.error);
        }
      } else {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (err) {
      setError("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = "input";

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--brand-brown) 0%, var(--brand-brown-dark) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, var(--brand-cream) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative text-center space-y-6 max-w-sm">
          <div className="text-7xl">🌾</div>
          <h2 className="text-3xl font-bold font-serif text-on-brand">Join Our Wellness Family</h2>
          <p className="text-sm leading-relaxed text-brand-cream-dark">
            Create your account to track orders, save favourites, and get exclusive member offers from Roshini's Home Products.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            {[["✅", "Free shipping on \u20b9999+"], ["💰", "Exclusive member discounts"], ["📦", "Easy order tracking"], ["🌿", "Early access to new batches"]].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3 text-sm text-brand-cream-dark">
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-1">
            <Link href="/" className="inline-flex items-center gap-2 justify-center">
              <div className="w-10 h-10 flex items-center justify-center font-bold text-xl" style={{ background: "var(--brand-brown)", color: "var(--on-brand)", borderRadius: "var(--radius-lg)" }}>R</div>
              <div className="text-left">
                <div className="font-bold text-lg leading-none" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-brown)" }}>Roshini's</div>
                <div className="text-[10px] tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>Home Products</div>
              </div>
            </Link>
            <p className="text-sm pt-2" style={{ color: "var(--text-muted)" }}>Create your account</p>
          </div>

          {error && (
            <div role="alert" aria-live="polite" className="alert alert-error">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}
          {success && (
            <div role="status" aria-live="polite" className="alert alert-success">
              <span>✅</span><span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="register-name" className="text-[11px] font-bold uppercase tracking-widest text-brand-brown">Full Name</label>
              <input id="register-name" name="name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required className={fieldClass} placeholder="Your full name" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="register-email" className="text-[11px] font-bold uppercase tracking-widest text-brand-brown">Email Address</label>
              <input id="register-email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required suppressHydrationWarning className={fieldClass} placeholder="name@example.com" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="register-password" className="text-[11px] font-bold uppercase tracking-widest text-brand-brown">Password</label>
              <div className="relative">
                <input
                  id="register-password"
                  name="new-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={fieldClass + " pr-10"}
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-brown)] rounded"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.822 7.822 3 3m-3-3-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="register-cpassword" className="text-[11px] font-bold uppercase tracking-widest text-brand-brown">Confirm Password</label>
              <div className="relative">
                <input
                  id="register-cpassword"
                  name="confirm-password"
                  type={showCPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={cPassword}
                  onChange={(e) => setCPassword(e.target.value)}
                  required
                  className={fieldClass + " pr-10"}
                  placeholder="Repeat your password"
                />
                <button
                  type="button"
                  onClick={() => setShowCPassword(!showCPassword)}
                  aria-label={showCPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-brown)] rounded"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showCPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.822 7.822 3 3m-3-3-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className={`btn-primary w-full text-center ${loading ? "btn-loading" : ""}`}>
              {loading ? "Creating Account…" : "Create My Account"}
            </button>
          </form>

          <div className="text-center text-xs text-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-bold hover:underline text-brand-brown">Sign In →</Link>
          </div>

          <p className="text-center text-[10px] text-text-light">
            By registering, you agree to our{" "}
            <Link href="/privacy-policy" className="underline">Privacy Policy</Link> and{" "}
            <Link href="/terms-of-service" className="underline">Terms of Service</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
