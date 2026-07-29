"use client";

import React, { useState, useEffect } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("derslinex_theme");
    if (saved === "light") {
      setTheme("light");
      document.documentElement.classList.add("light-theme");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      localStorage.setItem("derslinex_theme", "light");
      document.documentElement.classList.add("light-theme");
    } else {
      setTheme("dark");
      localStorage.setItem("derslinex_theme", "dark");
      document.documentElement.classList.remove("light-theme");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      title={theme === "dark" ? "Gündüz / Aydınlık Krem Temaya Geç" : "Gece / Koyu SincApp Temasına Geç"}
      className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 px-3 py-1.5 rounded-xl text-xs font-black transition shadow"
    >
      <span>{theme === "dark" ? "☀️ Aydınlık Tema" : "🌙 Koyu Tema"}</span>
    </button>
  );
}
