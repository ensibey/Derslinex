"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { waLink } from "@/lib/utils";

export default function SidebarDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tavsiyeIdx, setTavsiyeIdx] = useState(0);
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
          {/* Sınav Geri Sayım Progress Barları */}
          <div className="bg-white border border-[#EFECE6] rounded-2xl p-4 space-y-4">
            <span className="text-[10px] font-black text-[#D97706] uppercase tracking-widest block">
              ⏳ 2026 SINAV SAYAÇLARI
            </span>
            
            {/* YKS Progress */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-[#1E3A8A]">YKS 2026 (20 Haziran)</span>
                <span className="text-gray-500">
                  {(() => {
                    const target = new Date("June 20, 2026 10:00:00").getTime();
                    const start = new Date("September 1, 2025").getTime();
                    const now = new Date().getTime();
                    const total = target - start;
                    const elapsed = now - start;
                    const pct = Math.min(100, Math.max(0, Math.floor((elapsed / total) * 100)));
                    const days = Math.max(0, Math.floor((target - now) / (1000 * 60 * 60 * 24)));
                    return `%${pct} tamamlandı (${days} gün kaldı)`;
                  })()}
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#FAF8F5] border border-[#EFECE6] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#D97706] to-amber-500 rounded-full transition-all duration-1000"
                  style={{
                    width: (() => {
                      const target = new Date("June 20, 2026 10:00:00").getTime();
                      const start = new Date("September 1, 2025").getTime();
                      const now = new Date().getTime();
                      return `${Math.min(100, Math.max(0, Math.floor(((now - start) / (target - start)) * 100)))}%`;
                    })()
                  }}
                />
              </div>
            </div>

            {/* LGS Progress */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-[#1E3A8A]">LGS 2026 (7 Haziran)</span>
                <span className="text-gray-500">
                  {(() => {
                    const target = new Date("June 7, 2026 09:30:00").getTime();
                    const start = new Date("September 1, 2025").getTime();
                    const now = new Date().getTime();
                    const total = target - start;
                    const elapsed = now - start;
                    const pct = Math.min(100, Math.max(0, Math.floor((elapsed / total) * 100)));
                    const days = Math.max(0, Math.floor((target - now) / (1000 * 60 * 60 * 24)));
                    return `%${pct} tamamlandı (${days} gün kaldı)`;
                  })()}
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#FAF8F5] border border-[#EFECE6] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                  style={{
                    width: (() => {
                      const target = new Date("June 7, 2026 09:30:00").getTime();
                      const start = new Date("September 1, 2025").getTime();
                      const now = new Date().getTime();
                      return `${Math.min(100, Math.max(0, Math.floor(((now - start) / (target - start)) * 100)))}%`;
                    })()
                  }}
                />
              </div>
            </div>
          </div>

          {/* Tavsiye Motoru */}
          <div className="bg-[#FAF0E3] border border-[#F5D0A9] rounded-2xl p-4 flex flex-col">
            <span className="text-[10px] font-black text-[#B45309] uppercase tracking-widest block mb-2">
              🎯 GÜNÜN TAVSİYESİ & MOTİVASYONU
            </span>
            <div className="bg-white/80 rounded-xl p-3.5 border border-[#FAF0E3] min-h-[90px] flex items-center justify-center text-center transition-all duration-300">
              <p className="text-xs font-bold text-gray-700 leading-relaxed">
                {(() => {
                  const tavsiyeler = [
                    "TYT Matematik netlerini artırmak için her gün mutlaka 20 problem çözmelisin! 📐",
                    "Uykunu düzene sokmak sınav sabahı odaklanmanı %30 artırır! ⏰",
                    "Paragraf sorularını süre tutarak çözmek sınavda sana fazladan 20 dakika kazandırır! 📚",
                    "Yanlış yaptığın soruların çözümünü öğrenmeden asla başka konuya geçme! 🔍",
                    "Haftada bir gün tam TYT denemesi çözmek sınav provası için hayati önem taşır! ⏳",
                    "Formülleri ezberlemek yerine ispatını ve mantığını öğrenmeye çalış! 🧪",
                    "LGS'de yeni nesil soruları çözebilmek için kitap okuma alışkanlığını sakın aksatma! 📖",
                    "Masadan kalkmadan önce son 10 dakika sadece yaptığın hataları gözden geçir! ✍️",
                    "AYT sayısalda başarılı olmanın sırrı bol bol pratik ve limit-türev-integral üçlüsüdür! 📐",
                    "Kendine inan! Sınav hazırlığı bir sprint değil, disiplinli bir maratondur. 🏃‍♂️"
                  ];
                  // State tanımlayarak tıklama ile güncelleme mekanizması
                  return tavsiyeler[tavsiyeIdx];
                })()}
              </p>
            </div>
            <button
              onClick={() => {
                setTavsiyeIdx((prev) => (prev + 1) % 10);
              }}
              className="mt-3 bg-white hover:bg-amber-50 text-[#B45309] border border-[#F5D0A9] text-xs font-black py-2 rounded-xl transition-all shadow-sm active:scale-95 text-center block"
            >
              🔄 Başka Bir Tavsiye Gör
            </button>
          </div>

          {/* 3 Saniyede Hoca Sihirbazı */}
          <div className="bg-white border border-[#EFECE6] rounded-2xl p-4 flex flex-col space-y-3.5 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-[#D97706] uppercase tracking-widest block">
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
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500">Ders almak istediğiniz sınav alanını seçin:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory("YKS");
                      setWizardStep("subject");
                    }}
                    className="bg-[#FAF8F5] hover:bg-[#FAF0E3] hover:border-[#F5D0A9] border border-[#EFECE6] rounded-xl py-3 px-2 text-center text-xs font-black text-[#1E3A8A] transition-all"
                  >
                    🎓 YKS Hazırlık
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory("LGS");
                      setWizardStep("subject");
                    }}
                    className="bg-[#FAF8F5] hover:bg-[#FAF0E3] hover:border-[#F5D0A9] border border-[#EFECE6] rounded-xl py-3 px-2 text-center text-xs font-black text-[#1E3A8A] transition-all"
                  >
                    🏫 LGS Hazırlık
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500">
                  <span className="text-[#D97706] font-black">{selectedCategory}</span> için ders seçin:
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {(selectedCategory === "YKS"
                    ? ["Matematik", "Fizik", "Kimya", "Türkçe/Edebiyat", "Geometri"]
                    : ["Matematik", "Fen Bilimleri", "Türkçe", "Tarih/İnkılap"]
                  ).map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`border rounded-xl py-2 px-1 text-center text-[11px] font-black transition-all ${
                        selectedSubject === subject
                          ? "bg-[#D97706] text-white border-[#D97706] shadow-sm"
                          : "bg-[#FAF8F5] hover:bg-[#FAF0E3] border-[#EFECE6] text-gray-700"
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
                      className="w-full bg-[#1E3A8A] hover:bg-[#152a60] text-white font-black py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 text-xs text-center active:scale-95"
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
