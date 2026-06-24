"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_URL, BACKEND_URL } from "./api";

export interface CustomizationSettings {
  logoImage?: string | null;
  shopName: string;
  shopSubtitle: string;
  themePrimaryColor: string;
  themePrimaryColorDark: string;
  themePrimaryColorLight: string;
  themeCreamColor: string;
  themeCreamColorDark: string;
}

interface CustomizationContextValue {
  settings: CustomizationSettings;
  logoUrl: string | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: CustomizationSettings = {
  logoImage: null,
  shopName: "Roshini's",
  shopSubtitle: "Home Products",
  themePrimaryColor: "#6B3E26",
  themePrimaryColorDark: "#4e2c18",
  themePrimaryColorLight: "#8a5438",
  themeCreamColor: "#F5E9DA",
  themeCreamColorDark: "#ede0cc",
};

const CustomizationContext = createContext<CustomizationContextValue>({
  settings: defaultSettings,
  logoUrl: null,
  loading: true,
  refreshSettings: async () => {},
});

export const useCustomization = () => useContext(CustomizationContext);

export function CustomizationProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<CustomizationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Load initial settings from localStorage to prevent flash of unstyled content
  useEffect(() => {
    const cached = localStorage.getItem("customization_settings");
    if (cached) {
      try {
        setSettings(JSON.parse(cached));
      } catch (e) {}
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/customize/get-settings`);
      if (res.ok) {
        const json = await res.json();
        if (json.settings) {
          const newSettings = {
            logoImage: json.settings.logoImage || null,
            shopName: json.settings.shopName || defaultSettings.shopName,
            shopSubtitle: json.settings.shopSubtitle || defaultSettings.shopSubtitle,
            themePrimaryColor: json.settings.themePrimaryColor || defaultSettings.themePrimaryColor,
            themePrimaryColorDark: json.settings.themePrimaryColorDark || defaultSettings.themePrimaryColorDark,
            themePrimaryColorLight: json.settings.themePrimaryColorLight || defaultSettings.themePrimaryColorLight,
            themeCreamColor: json.settings.themeCreamColor || defaultSettings.themeCreamColor,
            themeCreamColorDark: json.settings.themeCreamColorDark || defaultSettings.themeCreamColorDark,
          };
          setSettings(newSettings);
          localStorage.setItem("customization_settings", JSON.stringify(newSettings));
        }
      }
    } catch (err) {
      console.error("Failed to load customization settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const logoUrl = settings.logoImage 
    ? `${BACKEND_URL}/uploads/customize/${settings.logoImage}` 
    : null;

  // Generate CSS style string dynamically to inject override variables into :root
  const styleContent = `
    :root {
      --brand-brown: ${settings.themePrimaryColor};
      --brand-brown-dark: ${settings.themePrimaryColorDark};
      --brand-brown-light: ${settings.themePrimaryColorLight};
      --brand-cream: ${settings.themeCreamColor};
      --brand-cream-dark: ${settings.themeCreamColorDark};
    }
  `;

  return (
    <CustomizationContext.Provider value={{ settings, logoUrl, loading, refreshSettings }}>
      <style dangerouslySetInnerHTML={{ __html: styleContent }} />
      {children}
    </CustomizationContext.Provider>
  );
}
