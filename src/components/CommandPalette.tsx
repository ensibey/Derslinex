"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigasyon" | "Araçlar" | "Hızlı Erişim";
  icon: string;
  href: string;
}

const COMMAND_ITEMS: CommandItem[] = [
  { id: "1", title: "Ana Sayfa", category: "Navigasyon", icon: "🏠", href: "/" },
  { id: "2", title: "Öğrenci Profil Karnesi", category: "Navigasyon", icon: "📊", href: "/profil" },
  { id: "3", title: "Online Deneme Sınavları", category: "Navigasyon", icon: "📝", href: "/blog/deneme-net-takip" },
  { id: "4", title: "Özel Ders Öğretmenleri", category: "Navigasyon", icon: "👨‍🏫", href: "/ogretmenler" },
  { id: "5", title: "YKS Hazırlık Merkezi", category: "Navigasyon", icon: "🎓", href: "/yks-hazirlik" },
  { id: "6", title: "LGS Hazırlık Rehberi", category: "Navigasyon", icon: "📚", href: "/lgs-hazirlik" },
  { id: "7", title: "Wiki Bilgi Bankası", category: "Navigasyon", icon: "💡", href: "/wiki" },

  { id: "8", title: "YKS / Net Hesaplama Motoru", category: "Araçlar", icon: "🧮", href: "/blog/obp-siralamaya-etkisi" },
  { id: "9", title: "Pomodoro Çalışma Sayacı", category: "Araçlar", icon: "⏱️", href: "/blog/pomodoro-sayaci" },
  { id: "10", title: "Konu Takip Çetelesi", category: "Araçlar", icon: "✅", href: "/blog/konu-takip-cetelesi" },
  { id: "11", title: "Ders Çalışma Programı Sihirbazı", category: "Araçlar", icon: "🪄", href: "/blog/ders-sihirbazi" },
  { id: "12", title: "YKS Soru Dağılımları", category: "Araçlar", icon: "📊", href: "/blog/soru-dagilimlari" },
  { id: "13", title: "Meslek Net Atlası", category: "Araçlar", icon: "🗺️", href: "/blog/meslek-net-atlasi" },

  { id: "14", title: "İletişim & Destek", category: "Hızlı Erişim", icon: "📞", href: "/iletisim" },
  { id: "15", title: "Gizlilik Politikası", category: "Hızlı Erişim", icon: "🔒", href: "/gizlilik" },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Filter items
  const filteredItems = COMMAND_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Navigate through list using arrow keys
  const handleItemKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        router.push(filteredItems[selectedIndex].href);
        handleClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 select-none">
      <div
        className="bg-[#0F172A] border border-indigo-500/30 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleItemKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-[#1E293B]">
          <span className="text-xl">🔍</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Hızlı arama veya yönlendirme için yazın... (ör: Deneme, Net, Pomodoro)"
            className="w-full bg-transparent text-white text-sm sm:text-base placeholder-slate-400 font-bold focus:outline-none"
          />
          <button
            onClick={handleClose}
            className="text-xs font-black bg-white/10 hover:bg-white/20 text-slate-300 px-2.5 py-1 rounded-lg transition"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-bold text-xs">
              Sonuç bulunamadı. Başka bir arama terimi deneyin.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    router.push(item.href);
                    handleClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition font-bold text-xs sm:text-sm ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isSelected ? "bg-white/20 text-white" : "bg-white/5 text-slate-400"
                    }`}
                  >
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#0B1120] flex items-center justify-between text-[11px] text-slate-400 font-semibold">
          <div className="flex items-center gap-2">
            <span>↑↓ Gezin</span>
            <span>•</span>
            <span>↵ Seç</span>
          </div>
          <span className="text-indigo-400 font-black">Sadee Eğitim QuickNav</span>
        </div>
      </div>
    </div>
  );
}
