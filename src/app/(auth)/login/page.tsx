"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Pass cookies cross-origin
      });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        // Success: Store token and user locally and redirect
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      }
    } catch (err) {
      setError("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = "w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none" +
    " bg-white" +
    " border-[#E8D5BC] focus:border-[#6B3E26] focus:shadow-[0_0_0_3px_rgba(107,62,38,0.1)]" +
    " placeholder:text-[#B0886A] text-[#2C1A0E]";

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #F5E9DA 0%, #FFFDF9 60%)", fontFamily: "'Poppins', sans-serif" }}>
      {/* Left brand panel – hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #6B3E26 0%, #8a5438 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #F5E9DA 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative text-center space-y-6 max-w-sm">
          <div className="text-7xl">🌿</div>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Merriweather', serif", color: "#F5E9DA" }}>
            Welcome Back!<br />Good to See You.
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#ede0cc" }}>
            Sign in to access your order history, track shipments, and discover our latest homemade nutrition products.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[["500+", "Happy Families"], ["100%", "Natural"], ["0g", "Added Sugar"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-xl font-bold" style={{ fontFamily: "'Merriweather', serif", color: "#E6A817" }}>{v}</div>
                <div className="text-[10px] mt-0.5" style={{ color: "#ede0cc" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-7">
          {/* Logo */}
          <div className="text-center space-y-1">
            <Link href="/" className="inline-flex items-center gap-2 justify-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl" style={{ background: "#6B3E26", color: "#F5E9DA" }}>R</div>
              <div className="text-left">
                <div className="font-bold text-lg leading-none" style={{ fontFamily: "'Merriweather', serif", color: "#6B3E26" }}>Roshini's</div>
                <div className="text-[10px] tracking-widest uppercase leading-none" style={{ color: "#7A5C45" }}>Home Products</div>
              </div>
            </Link>
            <p className="text-sm pt-2" style={{ color: "#7A5C45" }}>Sign in to your account</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 rounded-2xl text-sm" style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", color: "#B91C1C" }}>
              <span className="text-base mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#6B3E26" }}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required suppressHydrationWarning className={fieldClass} placeholder="name@example.com" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#6B3E26" }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={fieldClass} placeholder="Your password" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full text-center disabled:opacity-60">
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="text-center text-xs" style={{ color: "#7A5C45" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold hover:underline" style={{ color: "#6B3E26" }}>Create Account →</Link>
          </div>

          {/* Trust */}
          <div className="flex items-center justify-center gap-4 pt-2 text-[10px] font-medium" style={{ color: "#B0886A" }}>
            <span>🔒 Secure Login</span>
            <span>·</span>
            <span>🌿 Trusted Brand</span>
            <span>·</span>
            <span>📦 Easy Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}
