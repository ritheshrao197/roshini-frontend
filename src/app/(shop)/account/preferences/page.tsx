"use client";

import React, { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { applyAppTheme } from "@/lib/ThemeProvider";
import { useLanguage, SupportedLanguage } from "@/lib/LanguageContext";

const LANGUAGES = [
  "English",
  "Hindi",
  "Kannada",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Marathi",
  "Bengali",
  "Gujarati",
  "Spanish",
  "French",
];
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

  if (loading) return <div className="p-8 text-center text-text-muted">Loading preferences...</div>;

  const selectClass = "w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand-brown";

  return (
    <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border">
      <h2 className="text-2xl font-bold text-brand-brown mb-2 font-serif">
        Account Preferences ⚙️
      </h2>
      <p className="text-text-muted text-xs mb-6">Customize your language, appearance settings, and personalized recommendations.</p>

      {message.text && (
        <div className={`p-4 mb-6 rounded-xl text-sm font-bold border ${
          message.type === "success" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800" : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Language & Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">Preferred Language</label>
            <select
              value={preferences.preferredLanguage}
              onChange={(e) => {
                const newLang = e.target.value as SupportedLanguage;
                setPreferences({ ...preferences, preferredLanguage: newLang });
                setLanguage(newLang);
              }}
              className={selectClass}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">App Theme</label>
            <select
              value={preferences.theme}
              onChange={(e) => {
                const newTheme = e.target.value;
                setPreferences({ ...preferences, theme: newTheme });
                applyAppTheme(newTheme);
              }}
              className={selectClass}
            >
              {THEMES.map((theme) => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div> */}
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">Interests & Favorites</label>
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
                      ? "bg-brand-brown text-on-brand border-brand-brown shadow-sm"
                      : "bg-surface text-text-muted border-border hover:bg-surface-2"
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
          <label className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">Dietary Options & Allergies</label>
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
                      ? "bg-brand-brown text-on-brand border-brand-brown shadow-sm"
                      : "bg-surface text-text-muted border-border hover:bg-surface-2"
                  }`}
                >
                  {dietary}
                </button>
              );
            })}
          </div>
        </div>

        {/* Marketing Consent */}
        <div className="p-4 bg-surface-2 border border-border rounded-2xl flex items-start gap-3">
          <input
            type="checkbox"
            id="marketingConsent"
            checked={preferences.marketingConsent}
            onChange={(e) => setPreferences({ ...preferences, marketingConsent: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded accent-brand-brown"
          />
          <label htmlFor="marketingConsent" className="text-xs text-text-muted leading-relaxed cursor-pointer select-none font-medium">
            I agree to receive promotional updates, exclusive coupon offers, and personalized product recommendations from Roshini's Home Products.
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary"
        >
          {saving ? "Saving changes..." : "Save Preferences"}
        </button>
      </form>
    </div>
  );
}
