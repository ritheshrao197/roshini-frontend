"use client";

import React, { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({
    name: "",
    email: "",
    phoneNumber: "",
    profileImageUrl: "",
    profileImagePublicId: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/account/profile`, {
        headers: { token: token || "" },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/account/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token || "",
        },
        body: JSON.stringify({
          name: profile.name,
          phoneNumber: profile.phoneNumber,
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Profile updated successfully!", type: "success" });
        // Update local user object for sidebar sync
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        storedUser.name = profile.name;
        localStorage.setItem("user", JSON.stringify(storedUser));
        window.dispatchEvent(new Event("storage")); // Trigger layout re-render
      } else {
        setMessage({ text: data.error || "Failed to update profile", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Network error", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ text: "Image must be less than 5MB", type: "error" });
      return;
    }

    setImageUploading(true);
    setMessage({ text: "", type: "" });

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/account/profile-image`, {
        method: "POST",
        headers: { token: token || "" },
        body: formData,
      });
      
      const data = await res.json();
      if (res.ok) {
        setProfile({ ...profile, profileImageUrl: data.profileImageUrl });
        setMessage({ text: "Profile picture updated!", type: "success" });
      } else {
        setMessage({ text: data.error || "Upload failed", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Network error during upload", type: "error" });
    } finally {
      setImageUploading(false);
    }
  };

  // Helper to generate Cloudinary transformation URL for avatars
  const getAvatarUrl = (url: string) => {
    if (!url) return "";
    // If it's a cloudinary URL, insert transformations
    if (url.includes("res.cloudinary.com")) {
      const parts = url.split("/upload/");
      return `${parts[0]}/upload/w_200,h_200,c_fill,g_face,r_max/${parts[1]}`;
    }
    return url; // fallback for local uploads
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  const inputClass = "w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none" +
    " bg-gray-50 border-gray-200 focus:bg-white focus:border-[#6B3E26] focus:shadow-[0_0_0_3px_rgba(107,62,38,0.1)]";

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border" style={{ borderColor: "#E8D5BC" }}>
      <h2 className="text-2xl font-bold text-[#6B3E26] mb-6" style={{ fontFamily: "'Merriweather', serif" }}>
        Personal Information
      </h2>

      {message.text && (
        <div className={`p-4 mb-6 rounded-xl text-sm font-bold ${
          message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Photo Upload */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <div className="relative">
          {profile.profileImageUrl ? (
            <img 
              src={getAvatarUrl(profile.profileImageUrl)} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover shadow-sm border-2 border-white"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#6B3E26] text-white flex items-center justify-center font-bold text-4xl shadow-sm border-2 border-white">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
          {imageUploading && (
            <div className="absolute inset-0 bg-white/50 rounded-full flex items-center justify-center">
              <span className="w-6 h-6 border-2 border-[#6B3E26] border-t-transparent rounded-full animate-spin"></span>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="font-bold text-gray-800 mb-1">Profile Photo</h3>
          <p className="text-xs text-gray-500 mb-3">JPG, PNG or WEBP. Max size of 5MB.</p>
          
          <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors inline-block">
            {imageUploading ? "Uploading..." : "Upload New Photo"}
            <input 
              type="file" 
              className="hidden" 
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImageUpload}
              disabled={imageUploading}
            />
          </label>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Full Name</label>
            <input 
              type="text" 
              value={profile.name || ""} 
              onChange={e => setProfile({...profile, name: e.target.value})}
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Email Address</label>
            <input 
              type="email" 
              value={profile.email || ""} 
              disabled
              className="w-full px-4 py-3 rounded-xl border text-sm bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
              title="Email cannot be changed"
            />
            <p className="text-[10px] text-gray-500">To change your email, please contact support.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Mobile Number</label>
            <input 
              type="tel" 
              value={profile.phoneNumber || ""} 
              onChange={e => setProfile({...profile, phoneNumber: e.target.value})}
              className={inputClass}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#6B3E26] text-[#F5E9DA] rounded-xl font-bold text-sm hover:bg-[#5A3320] transition-colors disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
