"use client";

import React, { useEffect } from "react";

export function applyAppTheme(themeSetting: string) {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  let isDark = false;
  if (themeSetting === "Dark Mode") {
    isDark = true;
  } else if (themeSetting === "Light Mode") {
    isDark = false;
  } else {
    // "System Default"
    isDark = isSystemDark;
  }

  if (isDark) {
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
    root.style.colorScheme = "light";
  }

  localStorage.setItem("rhp_theme", themeSetting);
}

export function ThemeManager() {
  useEffect(() => {
    // 1. Initial theme load from localStorage or fallback to Light Mode by default
    const savedTheme = localStorage.getItem("rhp_theme") || "Light Mode";
    applyAppTheme(savedTheme);

    // 2. Listen to OS system color scheme changes if user explicitly chose "System Default"
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      const currentTheme = localStorage.getItem("rhp_theme");
      if (currentTheme === "System Default") {
        applyAppTheme("System Default");
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemChange);
    } else {
      mediaQuery.addListener(handleSystemChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleSystemChange);
      } else {
        mediaQuery.removeListener(handleSystemChange);
      }
    };
  }, []);

  return null;
}
