"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token || !email) {
      setError("Invalid reset password link. Missing email or token.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
        credentials: "include",
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setMessage(data.success || "Password has been successfully reset.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
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
        <p className="text-sm pt-2" style={{ color: "#7A5C45" }}>Reset Your Password</p>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl text-sm" style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", color: "#B91C1C" }}>
          <span className="text-base mt-0.5">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="flex items-start gap-3 p-4 rounded-2xl text-sm" style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0", color: "#16A34A" }}>
          <span className="text-base mt-0.5">✅</span>
          <span>{message} (Redirecting to login...)</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* New Password Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#6B3E26" }}>New Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
              className={fieldClass + " pr-10"} 
              placeholder="Min 8 characters" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#B0886A] hover:text-[#6B3E26]"
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

        {/* Confirm Password Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#6B3E26" }}>Confirm Password</label>
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              className={fieldClass + " pr-10"} 
              placeholder="Verify password" 
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#B0886A] hover:text-[#6B3E26]"
            >
              {showConfirmPassword ? (
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

        <button type="submit" disabled={loading} className="btn-primary w-full text-center disabled:opacity-60">
          {loading ? "Resetting password..." : "Set New Password"}
        </button>
      </form>

      <div className="text-center text-xs" style={{ color: "#7A5C45" }}>
        Go back to{" "}
        <Link href="/login" className="font-bold hover:underline" style={{ color: "#6B3E26" }}>Login →</Link>
      </div>

      {/* Trust */}
      <div className="flex items-center justify-center gap-4 pt-2 text-[10px] font-medium" style={{ color: "#B0886A" }}>
        <span>🔒 Secure Verification</span>
        <span>·</span>
        <span>🌿 Trusted Identity</span>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #F5E9DA 0%, #FFFDF9 60%)", fontFamily: "'Poppins', sans-serif" }}>
      {/* Left brand panel – hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #6B3E26 0%, #8a5438 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #F5E9DA 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative text-center space-y-6 max-w-sm">
          <div className="text-7xl">🌿</div>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Merriweather', serif", color: "#F5E9DA" }}>
            Set a New<br />Password.
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#ede0cc" }}>
            Create a secure password to re-enable access to your account history and profiles.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <Suspense fallback={
          <div className="text-center text-sm" style={{ color: "#7A5C45" }}>
            Loading password configuration...
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
