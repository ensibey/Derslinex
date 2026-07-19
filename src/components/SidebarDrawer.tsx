"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { waLink } from "@/lib/utils";
import { wikiKonulari } from "@/data/wiki";

const quickLinks = [
  { href: "/yks-hazirlik", label: "🧮 YKS Puan Hesaplama & Sayaç" },
  { href: "/lgs-hazirlik", label: "⏰ LGS Puan Hesaplama & Geri Sayım" },
  { href: "/blog/pomodoro-sayaci", label: "⏱️ Pomodoro Çalışma Sayacı" },
  { href: "/blog/ders-sihirbazi", label: "⚡ 3 Saniyede Özel Ders Sihirbazı" },
  { href: "/blog/obp-siralamaya-etkisi", label: "⚖️ OBP Sıralama Etki Robotu" },
  { href: "/blog/soru-dagilimlari", label: "📊 YKS & LGS Soru Dağılımları" },
  { href: "/blog/yks-net-siralama-karsilastirma", label: "📈 YKS Net - Sıralama Kıyaslama" },
  { href: "/blog/konu-takip-cetelesi", label: "📋 Konu Takip Çetelesi" },
  { href: "/blog/lise-taban-puanlari", label: "🏫 Lise Taban Puan & Net Analizi" },
  { href: "/blog/meslek-net-atlasi", label: "💼 Hangi Meslek Kaç Net İstiyor?" },
  { href: "/wiki", label: "📚 Ders Konuları Sözlüğü (Wiki)" },
  { href: "/blog/bilgi-kartlari", label: "🃏 Sınav Hap Bilgileri" },
  { href: "/blog/gunun-sorusu", label: "🎮 Günün Özel Sorusu" },
  { href: "/hocalar?alan=Matematik", label: "📐 Matematik Özel Ders" },
  { href: "/hocalar?alan=Fizik", label: "⚡ Fizik Özel Ders" },
  { href: "/blog/yks-matematik-hazirlik-rehberi", label: "📚 YKS Matematik Çalışma Planı" },
  { href: "/blog/tyt-ayt-farki-nedir", label: "❓ TYT ve AYT Farkı Nedir" }
];

export default function SidebarDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Widget states
  const [activeWidget, setActiveWidget] = useState<"pomo" | "calc" | "dict" | null>(null);

  // 1. Pomodoro Sayacı
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [pomoActive, setPomoActive] = useState(false);

  // 2. Net Hesaplayıcı
  const [tytMat, setTytMat] = useState(0);
  const [tytTur, setTytTur] = useState(0);
  const calculatedScore = (100 + (tytMat * 3.3) + (tytTur * 3.3)).toFixed(1);

  // 3. Akıllı Sözlük
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedWikiId, setExpandedWikiId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-sidebar-drawer", handleOpen);
    return () => window.removeEventListener("open-sidebar-drawer", handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    let interval: any = null;
    if (pomoActive && pomoTime > 0) {
      interval = setInterval(() => {
        setPomoTime((t) => t - 1);
      }, 1000);
    } else if (pomoTime === 0) {
      setPomoActive(false);
      setPomoTime(25 * 60);
      alert("Pomodoro bitti! Harika çalıştın, şimdi küçük bir kahve molası hak ettin. ☕");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomoActive, pomoTime]);

  const formatPomoTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const filteredWiki = searchQuery
    ? wikiKonulari.filter(
        (w) =>
          w.baslik.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.ders.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const toggleWidget = (type: "pomo" | "calc" | "dict") => {
    setActiveWidget(activeWidget === type ? null : type);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Drawer Hamburger Button - Desktop Only */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex w-11 h-11 bg-white hover:bg-[#FAF8F5] border border-[#EFECE6] rounded-xl items-center justify-center transition-all shadow-sm text-[#1E3A8A] active:scale-95"
        aria-label="Hızlı Araçlar Menüsü"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300"
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 left-0 h-screen h-[100dvh] w-full max-w-[340px] bg-[#FAF8F5] border-r border-[#EFECE6] shadow-2xl z-[9999] transition-transform duration-300 transform flex flex-col overflow-hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#EFECE6] flex justify-between items-center bg-white flex-shrink-0">
          <div>
            <h3 className="font-black text-[#1E3A8A] text-lg">Derslinex Hızlı Menü</h3>
            <p className="text-xs text-gray-550 font-bold mt-0.5">En Çok Ziyaret Edilenler</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#EFECE6] flex items-center justify-center text-lg font-black text-gray-600 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6 scrollbar-thin">
          {/* Canlı Etkileşimli Araçlar (Glassmorphic) */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-black text-[#B45309] uppercase tracking-widest block">
              CANLI ETKİLEŞİMLİ ARAÇLAR
            </span>

            {/* 1. Pomodoro Sayacı Widget */}
            <div className="bg-white/70 backdrop-blur-md border border-[#EFECE6] rounded-2xl overflow-hidden transition-all shadow-sm">
              <button
                onClick={() => toggleWidget("pomo")}
                className="w-full flex items-center justify-between p-4 font-bold text-[#1E3A8A] hover:bg-white/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>⏱️</span>
                  <span>Canlı Pomodoro Sayacı</span>
                </div>
                <span>{activeWidget === "pomo" ? "▲" : "▼"}</span>
              </button>
              {activeWidget === "pomo" && (
                <div className="p-4 pt-0 border-t border-[#EFECE6]/50 bg-white/40 flex flex-col items-center">
                  <div className={`text-3xl font-black my-3 font-mono text-gray-800 ${pomoActive ? "animate-pulse text-[#B45309]" : ""}`}>
                    {formatPomoTime(pomoTime)}
                  </div>
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => setPomoActive(!pomoActive)}
                      className={`flex-1 text-xs font-black py-2 rounded-xl text-white transition-all ${
                        pomoActive ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      {pomoActive ? "Durdur" : "Başlat"}
                    </button>
                    <button
                      onClick={() => {
                        setPomoActive(false);
                        setPomoTime(25 * 60);
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-black px-4 py-2 rounded-xl transition-all"
                    >
                      Sıfırla
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Pratik Net Hesaplama Widget */}
            <div className="bg-white/70 backdrop-blur-md border border-[#EFECE6] rounded-2xl overflow-hidden transition-all shadow-sm">
              <button
                onClick={() => toggleWidget("calc")}
                className="w-full flex items-center justify-between p-4 font-bold text-[#1E3A8A] hover:bg-white/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>🧮</span>
                  <span>Pratik Net Hesaplama</span>
                </div>
                <span>{activeWidget === "calc" ? "▲" : "▼"}</span>
              </button>
              {activeWidget === "calc" && (
                <div className="p-4 pt-0 border-t border-[#EFECE6]/50 bg-white/40 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-gray-600">
                      <span>TYT Türkçe Neti</span>
                      <span>{tytTur} / 40</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={tytTur}
                      onChange={(e) => setTytTur(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#B45309]"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-gray-600">
                      <span>TYT Matematik Neti</span>
                      <span>{tytMat} / 40</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={tytMat}
                      onChange={(e) => setTytMat(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#B45309]"
                    />
                  </div>
                  <div className="bg-[#FAF0E3] border border-[#F5D0A9]/30 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tahmini Yerleştirme Puanı</p>
                    <p className="text-xl font-black text-[#B45309] mt-0.5">{calculatedScore}</p>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Akıllı Sözlük Widget */}
            <div className="bg-white/70 backdrop-blur-md border border-[#EFECE6] rounded-2xl overflow-hidden transition-all shadow-sm">
              <button
                onClick={() => toggleWidget("dict")}
                className="w-full flex items-center justify-between p-4 font-bold text-[#1E3A8A] hover:bg-white/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>🔍</span>
                  <span>Akıllı Sözlük (Wiki Search)</span>
                </div>
                <span>{activeWidget === "dict" ? "▲" : "▼"}</span>
              </button>
              {activeWidget === "dict" && (
                <div className="p-4 pt-0 border-t border-[#EFECE6]/50 bg-white/40 space-y-3">
                  <input
                    type="text"
                    placeholder="Konu veya terim ara... (örn: mitoz)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-[#EFECE6] rounded-xl px-3 py-2 text-xs focus:border-[#B45309] text-gray-900 outline-none font-bold"
                  />
                  {searchQuery && (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {filteredWiki.length > 0 ? (
                        filteredWiki.map((w) => (
                          <div key={w.id} className="bg-white border border-[#EFECE6] rounded-xl p-2.5 transition-all text-xs">
                            <button
                              onClick={() => setExpandedWikiId(expandedWikiId === w.id ? null : w.id)}
                              className="w-full flex justify-between items-center text-left font-black text-[#1E3A8A]"
                            >
                              <span>{w.baslik.split(":")[0]}</span>
                              <span className="text-[9px] text-[#B45309]">{w.ders}</span>
                            </button>
                            {expandedWikiId === w.id && (
                              <p className="text-[11px] text-gray-500 font-medium mt-1 leading-relaxed border-t border-[#EFECE6]/40 pt-1.5">
                                {w.ozet}
                                <Link
                                  href={`/wiki/${w.slug}`}
                                  onClick={() => setIsOpen(false)}
                                  className="text-[#B45309] underline font-bold ml-1 block"
                                >
                                  Detaylı Oku →
                                </Link>
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-gray-500 text-center py-2 font-semibold">Sonuç bulunamadı.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#B45309] uppercase tracking-widest block mb-3">
              POPÜLER SAYFALAR & HIZLI ERİŞİM
            </span>
            <div className="space-y-2">
              {quickLinks.slice(0, 13).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block bg-white border border-[#EFECE6] rounded-2xl p-4 text-sm font-bold text-[#1E3A8A] hover:border-[#B45309] hover:shadow-sm transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Blog Section */}
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#B45309] uppercase tracking-widest block mb-3">
              OKUNMASI GEREKEN REHBERLER
            </span>
            <div className="space-y-2">
              {quickLinks.slice(13).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block bg-white border border-[#EFECE6] rounded-2xl p-4 text-xs font-bold text-gray-600 hover:border-[#B45309] hover:text-[#1E3A8A] hover:shadow-sm transition-all leading-relaxed"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#EFECE6] bg-white flex-shrink-0">
          <a
            href={waLink("Merhaba, Derslinex hızlı menüsünden ulaşıyorum. YKS / LGS özel derslerimiz hakkında bilgi alabilir miyim?")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#B45309] hover:bg-[#92400E] text-white font-black py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
          >
            💬 Birebir Özel Ders Al
          </a>
        </div>
      </div>
    </>
  );
}
