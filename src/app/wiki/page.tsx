"use client";
import Link from "next/link";
import { useState } from "react";
import { wikiKonulari } from "@/data/wiki";

export default function WikiIndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Tümü");

  // Get unique list of subjects dynamically
  const subjects = ["Tümü", ...Array.from(new Set(wikiKonulari.map((w) => w.ders)))];

  const filteredWiki = wikiKonulari.filter((wiki) => {
    const matchesSearch =
      wiki.baslik.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wiki.ozet.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "Tümü" || wiki.ders === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#B45309] text-xs font-black uppercase tracking-widest">EĞİTİM KÜTÜPHANESİ</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2 mb-3">Ders Konuları Sözlüğü</h1>
          <p className="text-gray-500 text-sm font-semibold max-w-xl mx-auto leading-relaxed">
            YKS ve LGS sınavlarında karşına çıkabilecek kritik terimleri, kuralları ve ÖSYM soru tiplerini tek tıkla öğren.
          </p>
        </div>

        {/* Live Filter Controls */}
        <div className="bg-white/80 backdrop-blur-md border border-[#EFECE6] p-6 rounded-3xl mb-8 shadow-sm space-y-4">
          {/* Search Box */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Terim, kural veya konu anlatımı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl pl-10 pr-4 py-3.5 text-sm font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#B45309] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Subject Filter Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`text-xs font-black px-4 py-2 rounded-xl border transition-all ${
                  selectedSubject === sub
                    ? "bg-[#B45309] text-white border-[#B45309] shadow-sm shadow-[#B45309]/10"
                    : "bg-[#FAF8F5] text-gray-600 border-[#EFECE6] hover:bg-gray-100"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Grid */}
        {filteredWiki.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWiki.map((wiki) => (
              <div
                key={wiki.id}
                className="bg-white border border-[#EFECE6] rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#B45309] transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-[#B45309] bg-[#FAF0E3] px-2.5 py-1 rounded-xl">
                      {wiki.kategori} {wiki.ders}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-gray-800 leading-snug mb-3">
                    {wiki.baslik.split(":")[0]}
                  </h3>
                  <p className="text-xs text-gray-500 font-bold line-clamp-3 leading-relaxed mb-6">
                    {wiki.ozet}
                  </p>
                </div>

                <Link
                  href={`/wiki/${wiki.slug}`}
                  className="w-full bg-[#FAF8F5] hover:bg-[#FAF0E3] border border-[#EFECE6] text-[#1E3A8A] hover:text-[#B45309] hover:border-[#F5D0A9] font-black py-3 rounded-2xl transition-all text-xs text-center active:scale-95 block"
                >
                  Konuyu İncele ➔
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/50 border border-dashed border-[#EFECE6] rounded-3xl">
            <span className="text-4xl">🔍</span>
            <p className="text-gray-500 font-bold mt-4">Arama kriterlerine uygun ders konusu bulunamadı.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSubject("Tümü");
              }}
              className="text-[#B45309] font-black text-xs underline mt-2 block mx-auto"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
