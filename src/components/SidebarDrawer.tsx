"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { waLink } from "@/lib/utils";

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
            <p className="text-xs text-gray-500 font-bold mt-0.5">En Çok Ziyaret Edilenler</p>
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
          {/* Canlı Etkileşimli Araçlar (Glassmorphic Link Kartları) */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-black text-[#B45309] uppercase tracking-widest block">
              CANLI ETKİLEŞİMLİ ARAÇLAR
            </span>

            {/* 1. Pomodoro Sayacı Link */}
            <Link
              href="/blog/pomodoro-sayaci"
              onClick={() => setIsOpen(false)}
              className="bg-white/70 backdrop-blur-md border border-[#EFECE6] rounded-2xl p-4 font-bold text-[#1E3A8A] hover:border-[#B45309] hover:bg-white hover:shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <span>⏱️</span>
                <span>Canlı Pomodoro Sayacı</span>
              </div>
              <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            {/* 2. Pratik Net Hesaplama Link */}
            <Link
              href="/yks-hazirlik"
              onClick={() => setIsOpen(false)}
              className="bg-white/70 backdrop-blur-md border border-[#EFECE6] rounded-2xl p-4 font-bold text-[#1E3A8A] hover:border-[#B45309] hover:bg-white hover:shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <span>🧮</span>
                <span>Pratik Net Hesaplama</span>
              </div>
              <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            {/* 3. Akıllı Sözlük Link */}
            <Link
              href="/wiki"
              onClick={() => setIsOpen(false)}
              className="bg-white/70 backdrop-blur-md border border-[#EFECE6] rounded-2xl p-4 font-bold text-[#1E3A8A] hover:border-[#B45309] hover:bg-white hover:shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <span>🔍</span>
                <span>Akıllı Sözlük (Wiki)</span>
              </div>
              <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
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
