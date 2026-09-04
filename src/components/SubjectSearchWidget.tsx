"use client";

import { useState } from "react";
import { waLink } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SubjectOption {
  key: string;
  name: string;
  category: "YKS" | "LGS";
  badge?: string;
  targetSlug: string;
}

const subjects: SubjectOption[] = [
  // YKS Subjects
  { key: "tyt-mat", name: "TYT Matematik", category: "YKS", badge: "Popüler", targetSlug: "matematik-yks" },
  { key: "ayt-mat", name: "AYT Matematik & Geometri", category: "YKS", targetSlug: "geometri-yks" },
  { key: "fizik-yks", name: "Fizik", category: "YKS", targetSlug: "fizik-yks" },
  { key: "kimya-yks", name: "Kimya", category: "YKS", targetSlug: "kimya-yks" },
  { key: "biyo-yks", name: "Biyoloji", category: "YKS", targetSlug: "biyoloji-yks" },
  { key: "turkce-yks", name: "Türkçe & Paragraf", category: "YKS", targetSlug: "turkce-yks" },
  { key: "edebiyat-yks", name: "Türk Dili ve Edebiyatı", category: "YKS", targetSlug: "edebiyat-yks" },
  { key: "tarih-cogr", name: "Tarih & Coğrafya", category: "YKS", targetSlug: "tarih-yks" },
  { key: "ydt-ing", name: "YDT İngilizce (Dil)", category: "YKS", targetSlug: "ingilizce-yks" },

  // LGS Subjects
  { key: "lgs-mat", name: "LGS Matematik (Yeni Nesil)", category: "LGS", badge: "En Çok Tercih Edilen", targetSlug: "matematik-yks" },
  { key: "lgs-fen", name: "LGS Fen Bilimleri", category: "LGS", targetSlug: "fizik-yks" },
  { key: "lgs-turkce", name: "LGS Türkçe & Paragraf", category: "LGS", targetSlug: "turkce-yks" },
  { key: "lgs-inkilap", name: "LGS T.C. İnkılap Tarihi", category: "LGS", targetSlug: "tarih-yks" },
  { key: "lgs-ing", name: "LGS İngilizce", category: "LGS", targetSlug: "ingilizce-yks" },
  { key: "lgs-din", name: "LGS Din Kültürü", category: "LGS", targetSlug: "turkce-yks" },
];

export default function SubjectSearchWidget() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<"YKS" | "LGS">("YKS");
  const [selectedKey, setSelectedKey] = useState<string>("tyt-mat");

  const filteredSubjects = subjects.filter((s) => s.category === activeCategory);
  const currentSelected = subjects.find((s) => s.key === selectedKey);

  const getWaMessage = () => {
    const subjectName = currentSelected?.name || `${activeCategory} Hazırlık`;
    return `Merhaba, ${activeCategory} sınavı için ${subjectName} özel dersleri ve öğretmenlerimiz hakkında bilgi almak istiyorum.`;
  };

  const handleSearch = () => {
    if (currentSelected) {
      router.push(`/ogretmenler?alan=${encodeURIComponent(currentSelected.name.split(" ")[0])}`);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-xl border border-[#EFECE6] max-w-2xl">
      {/* Sınav Kategori Seçici (YKS / LGS) */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFECE6]">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#B45309] block">
            ADIM 1 · HEDEF SINAVINIZI SEÇİN
          </span>
          <span className="text-sm font-black text-[#1E3A8A]">
            Çalışmak İstediğiniz Alan
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#FAF8F5] p-1 rounded-2xl border border-[#EFECE6]">
          <button
            type="button"
            onClick={() => {
              setActiveCategory("YKS");
              setSelectedKey("tyt-mat");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeCategory === "YKS"
                ? "bg-[#1E3A8A] text-white shadow-sm"
                : "text-gray-500 hover:text-[#1E3A8A]"
            }`}
          >
            🎯 YKS Hazırlık
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveCategory("LGS");
              setSelectedKey("lgs-mat");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeCategory === "LGS"
                ? "bg-[#B45309] text-white shadow-sm"
                : "text-gray-500 hover:text-[#B45309]"
            }`}
          >
            🎓 LGS Hazırlık
          </button>
        </div>
      </div>

      {/* Branş Butonları Grid */}
      <div className="space-y-3">
        <label className="block text-[11px] font-bold text-gray-500">
          {activeCategory === "YKS" ? "YKS (TYT - AYT) Branşları:" : "LGS Branşları:"}
        </label>

        <div className="flex flex-wrap gap-2">
          {filteredSubjects.map((sub) => {
            const isSelected = selectedKey === sub.key;
            return (
              <button
                key={sub.key}
                type="button"
                onClick={() => setSelectedKey(sub.key)}
                className={`text-xs font-black px-3.5 py-2.5 rounded-xl border transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? activeCategory === "YKS"
                      ? "bg-[#1E3A8A] border-[#1E3A8A] text-white shadow-md shadow-indigo-900/20 scale-102"
                      : "bg-[#B45309] border-[#B45309] text-white shadow-md shadow-amber-900/20 scale-102"
                    : "bg-[#FAF8F5] border-[#EFECE6] text-gray-700 hover:border-gray-300 hover:bg-white"
                }`}
              >
                <span>{sub.name}</span>
                {sub.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-white/25 text-white"
                        : "bg-[#B45309]/15 text-[#B45309]"
                    }`}
                  >
                    {sub.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Aksiyon Butonları */}
      <div className="flex flex-col sm:flex-row gap-3 pt-5 mt-4 border-t border-[#EFECE6]/80">
        <button
          type="button"
          onClick={handleSearch}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#152860] text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-95"
        >
          <span>🔍 {currentSelected?.name} Öğretmenlerini Gör</span>
        </button>

        <a
          href={waLink(getWaMessage())}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#B45309] hover:bg-[#92400E] text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-95"
        >
          <span>💬 {activeCategory} İçin Ücretsiz Rehberlik Al</span>
        </a>
      </div>
    </div>
  );
}
