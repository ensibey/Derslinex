"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { waLink } from "@/lib/utils";

export default function SidebarDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [wizardStep, setWizardStep] = useState<"category" | "subject">("category");
  const [selectedCategory, setSelectedCategory] = useState<"YKS" | "LGS" | "">("");
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sayfa kaymasını engelle & window eventi dinle
  useEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleToggle = () => setIsOpen(true);
    window.addEventListener("open-sidebar-drawer", handleToggle);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("open-sidebar-drawer", handleToggle);
    };
  }, [isOpen, mounted]);

  const quickLinks = [
    { href: "/yks-hazirlik", label: "🧮 YKS Puan Hesaplama & Sayaç" },
    { href: "/lgs-hazirlik", label: "⏰ LGS Puan Hesaplama & Geri Sayım" },
    { href: "/hocalar?alan=Matematik", label: "📐 Matematik Özel Ders" },
    { href: "/hocalar?alan=Fizik", label: "⚡ Fizik Özel Ders" },
    { href: "/blog/yks-matematik-hazirlik-rehberi", label: "📚 YKS Matematik Çalışma Planı (Blog)" },
    { href: "/blog/tyt-ayt-farki-nedir", label: "❓ TYT ve AYT Farkı Nedir? (Blog)" },
    { href: "/blog/yks-calisma-programi-nasil-yapilir", label: "🗓️ Günlük Çalışma Programı Hazırlama (Blog)" }
  ];

  if (!mounted) return null;

  return (
    <>
      {/* Drawer Hamburgers (3 Lines SVG) Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-11 h-11 bg-white hover:bg-[#FAF8F5] border border-[#EFECE6] rounded-xl flex items-center justify-center transition-all shadow-sm text-[#1E3A8A] active:scale-95"
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
            className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#EFECE6] flex items-center justify-center text-lg font-black text-gray-650 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6 scrollbar-thin">
          {/* 3 Saniyede Hoca Sihirbazı */}
          <div className="bg-white border border-[#EFECE6] rounded-3xl p-5 flex flex-col space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-[#D97706] uppercase tracking-wider flex items-center gap-1.5">
                ⚡ 3 SANİYEDE ÖZEL DERS AL
              </span>
              {wizardStep === "subject" && (
                <button 
                  onClick={() => {
                    setWizardStep("category");
                    setSelectedCategory("");
                    setSelectedSubject("");
                  }}
                  className="text-[10px] font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wider"
                >
                  ◀ Geri Dön
                </button>
              )}
            </div>

            {wizardStep === "category" ? (
              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-650 leading-relaxed">Ders almak istediğiniz sınav alanını seçin:</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setSelectedCategory("YKS");
                      setWizardStep("subject");
                    }}
                    className="bg-[#FAF8F5] hover:bg-[#FAF0E3] hover:border-[#F5D0A9] border border-[#EFECE6] rounded-2xl py-3.5 px-2 text-center text-xs font-black text-[#1E3A8A] transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                  >
                    🎓 YKS Hazırlık
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory("LGS");
                      setWizardStep("subject");
                    }}
                    className="bg-[#FAF8F5] hover:bg-[#FAF0E3] hover:border-[#F5D0A9] border border-[#EFECE6] rounded-2xl py-3.5 px-2 text-center text-xs font-black text-[#1E3A8A] transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                  >
                    🏫 LGS Hazırlık
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-500">
                  <span className="text-[#D97706] font-black">{selectedCategory}</span> için ders seçin:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(selectedCategory === "YKS"
                    ? ["Matematik", "Fizik", "Kimya", "Türkçe/Edebiyat", "Geometri"]
                    : ["Matematik", "Fen Bilimleri", "Türkçe", "Tarih/İnkılap"]
                  ).map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`border rounded-2xl py-2.5 px-1 text-center text-xs font-black transition-all active:scale-95 ${
                        selectedSubject === subject
                          ? "bg-[#D97706] text-white border-[#D97706] shadow-sm"
                          : "bg-[#FAF8F5] hover:bg-[#FAF0E3] border-[#EFECE6] text-[#1E3A8A]"
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>

                {selectedSubject && (
                  <div className="pt-2">
                    <a
                      href={waLink(`Merhaba, ${selectedCategory} sınavı için ${selectedSubject} dersi hakkında birebir özel ders bilgisi almak istiyorum.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#1E3A8A] hover:bg-[#152a60] text-white font-black py-3 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-1.5 text-xs text-center active:scale-95"
                    >
                      ⚡ {selectedSubject} Dersi Al
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#D97706] uppercase tracking-widest block mb-3">
              POPÜLER ARAÇLAR & DERSLER
            </span>
            <div className="space-y-2">
              {quickLinks.slice(0, 4).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block bg-white border border-[#EFECE6] rounded-2xl p-4 text-sm font-bold text-[#1E3A8A] hover:border-[#D97706] hover:shadow-sm transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Blog Section */}
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#D97706] uppercase tracking-widest block mb-3">
              OKUNMASI GEREKEN REHBERLER
            </span>
            <div className="space-y-2">
              {quickLinks.slice(4).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block bg-white border border-[#EFECE6] rounded-2xl p-4 text-xs font-bold text-gray-600 hover:border-[#D97706] hover:text-[#1E3A8A] hover:shadow-sm transition-all leading-relaxed"
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
            href={waLink("Merhaba, YKS / LGS özel derslerimiz hakkında bilgi almak istiyorum.")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-black py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
          >
            💬 Birebir Özel Ders Al
          </a>
        </div>
      </div>
    </>
  );
}
