"use client";

import React, { useState } from "react";
import { API_URL } from "@/lib/api";

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ text: "New passwords do not match", type: "error" });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ text: "Password must be at least 8 characters long", type: "error" });
      return;
    }

    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/account/security/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token || "",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Password changed successfully!", type: "success" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ text: data.error || "Failed to change password", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Network error", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none" +
    " bg-gray-50 border-gray-200 focus:bg-white focus:border-[#6B3E26] focus:shadow-[0_0_0_3px_rgba(107,62,38,0.1)]";

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border" style={{ borderColor: "#E8D5BC" }}>
      <h2 className="text-2xl font-bold text-[#6B3E26] mb-2" style={{ fontFamily: "'Merriweather', serif" }}>
        Security Settings
      </h2>
      <p className="text-gray-500 mb-8 text-sm">Update your password and secure your account.</p>

      {message.text && (
        <div className={`p-4 mb-6 rounded-xl text-sm font-bold ${
          message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Current Password</label>
          <input 
            type="password" 
            value={currentPassword} 
            onChange={e => setCurrentPassword(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">New Password</label>
          <input 
            type="password" 
            value={newPassword} 
            onChange={e => setNewPassword(e.target.value)}
            className={inputClass}
            required
            minLength={8}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Confirm New Password</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)}
            className={inputClass}
            required
            minLength={8}
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#6B3E26] text-[#F5E9DA] rounded-xl font-bold text-sm hover:bg-[#5A3320] transition-colors disabled:opacity-50"
          >
            {saving ? "Updating..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
