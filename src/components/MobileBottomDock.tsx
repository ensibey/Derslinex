"use client";

import React from "react";

import { usePathname } from "next/navigation";

interface MobileBottomDockProps {
  activeTab: string;
  onTabChange: (tabId: any) => void;
}

export default function MobileBottomDock({ activeTab, onTabChange }: MobileBottomDockProps) {
  const pathname = usePathname();
  if (pathname?.startsWith("/deneme/") || pathname?.startsWith("/ders/")) return null;
  const items = [
    { id: "panel", icon: "🏠", label: "Genel" },
    { id: "canli", icon: "🎥", label: "Canlı Ders" },
    { id: "sorucozum", icon: "📝", label: "Test Çöz" },
    { id: "mesajlar", icon: "💬", label: "Mesajlar" },
    { id: "duzenle", icon: "👤", label: "Profil" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D1B35]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex items-center justify-around shadow-2xl">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`relative flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all duration-200 ${
              isActive
                ? "text-white scale-105"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {isActive && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-1 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(165,180,252,1)]" />
            )}
            <span className="text-lg leading-none">{item.icon}</span>
            <span className={`text-[10px] font-black mt-1 leading-none ${ isActive ? "text-indigo-300 font-extrabold" : "" }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
