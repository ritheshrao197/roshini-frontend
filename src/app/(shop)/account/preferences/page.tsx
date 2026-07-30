"use client";

import React, { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { applyAppTheme } from "@/lib/ThemeProvider";
import { useLanguage, SupportedLanguage } from "@/lib/LanguageContext";

const LANGUAGES = ["English", "Hindi", "Tamil", "Malayalam", "Telugu", "Kannada"];
const THEMES = ["System Default", "Light Mode", "Dark Mode"];
const INTEREST_OPTIONS = ["Spices", "Ready Mixes", "Beverages", "Sweets & Snacks", "Pickles", "Health Food"];
const DIETARY_OPTIONS = ["Vegetarian", "Vegan", "Gluten Free", "Organic Only", "Sugar Free", "Nut Free"];

export default function PreferencesPage() {
  const { setLanguage, t } = useLanguage();
  const [preferences, setPreferences] = useState({
    preferredLanguage: "English",
    theme: "Light Mode",
    interests: [] as string[],
    dietaryPreferences: [] as string[],
    marketingConsent: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/account/profile`, {
        headers: { token: token || "" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user?.preferences) {
          const userTheme = data.user.preferences.theme || "Light Mode";
          const userLang = (data.user.preferences.preferredLanguage || "English") as SupportedLanguage;
          setPreferences({
            preferredLanguage: userLang,
            theme: userTheme,
            interests: data.user.preferences.interests || [],
            dietaryPreferences: data.user.preferences.dietaryPreferences || [],
            marketingConsent: data.user.preferences.marketingConsent !== false,
          });
          applyAppTheme(userTheme);
          setLanguage(userLang);
        }
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
        body: JSON.stringify({ preferences }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Preferences updated successfully!", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to update preferences", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Network error", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setPreferences((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const toggleDietary = (dietary: string) => {
    setPreferences((prev) => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(dietary)
        ? prev.dietaryPreferences.filter((d) => d !== dietary)
        : [...prev.dietaryPreferences, dietary],
    }));
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading preferences...</div>;

  const selectClass = "w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#6B3E26]";

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border" style={{ borderColor: "#E8D5BC" }}>
      <h2 className="text-2xl font-bold text-[#6B3E26] mb-2" style={{ fontFamily: "'Merriweather', serif" }}>
        Account Preferences ⚙️
      </h2>
      <p className="text-gray-500 text-xs mb-6">Customize your language, appearance settings, and personalized recommendations.</p>

      {message.text && (
        <div className={`p-4 mb-6 rounded-xl text-sm font-bold border ${
          message.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Language & Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider block">Preferred Language</label>
            <select
              value={preferences.preferredLanguage}
              onChange={(e) => {
                const newLang = e.target.value as SupportedLanguage;
                setPreferences({ ...preferences, preferredLanguage: newLang });
                setLanguage(newLang);
              }}
              className={selectClass}
              style={{ borderColor: "#E8D5BC" }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider block">App Theme</label>
            <select
              value={preferences.theme}
              onChange={(e) => {
                const newTheme = e.target.value;
                setPreferences({ ...preferences, theme: newTheme });
                applyAppTheme(newTheme);
              }}
              className={selectClass}
              style={{ borderColor: "#E8D5BC" }}
            >
              {THEMES.map((theme) => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider block">Interests & Favorites</label>
          <div className="flex flex-wrap gap-2.5">
            {INTEREST_OPTIONS.map((interest) => {
              const selected = preferences.interests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    selected
                      ? "bg-[#6B3E26] text-[#F5E9DA] border-[#6B3E26] shadow-sm"
                      : "bg-[#FFFDF9] text-[#7A5C45] border-[#E8D5BC] hover:bg-[#FDF6EC]"
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dietary Preferences */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider block">Dietary Options & Allergies</label>
          <div className="flex flex-wrap gap-2.5">
            {DIETARY_OPTIONS.map((dietary) => {
              const selected = preferences.dietaryPreferences.includes(dietary);
              return (
                <button
                  type="button"
                  key={dietary}
                  onClick={() => toggleDietary(dietary)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    selected
                      ? "bg-[#6B3E26] text-[#F5E9DA] border-[#6B3E26] shadow-sm"
                      : "bg-[#FFFDF9] text-[#7A5C45] border-[#E8D5BC] hover:bg-[#FDF6EC]"
                  }`}
                >
                  {dietary}
                </button>
              );
            })}
          </div>
        </div>

        {/* Marketing Consent */}
        <div className="p-4 bg-[#FDF6EC] border rounded-2xl flex items-start gap-3" style={{ borderColor: "#E8D5BC" }}>
          <input
            type="checkbox"
            id="marketingConsent"
            checked={preferences.marketingConsent}
            onChange={(e) => setPreferences({ ...preferences, marketingConsent: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded accent-[#6B3E26]"
          />
          <label htmlFor="marketingConsent" className="text-xs text-[#7A5C45] leading-relaxed cursor-pointer select-none font-medium">
            I agree to receive promotional updates, exclusive coupon offers, and personalized product recommendations from Roshini's Home Products.
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full hover:bg-[#4e2c18] transition-all disabled:opacity-60 cursor-pointer"
        >
          {saving ? "Saving changes..." : "Save Preferences"}
        </button>
      </form>
    </div>
  );
}
