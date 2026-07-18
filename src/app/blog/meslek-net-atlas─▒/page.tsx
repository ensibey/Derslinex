"use client";
import { useState } from "react";
import Link from "next/link";
import { getMeslekVerisiBySearch } from "@/data/meslekler_helper";
import { waLink } from "@/lib/utils";

export default function MeslekNetAtlasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMeslek, setSelectedMeslek] = useState<any | null>(null);

  // Arama mantığını dinamik helper ile çalıştır (100% meslek kapsamı)
  const filteredMeslekler = getMeslekVerisiBySearch(searchTerm);

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#D97706] text-xs font-black uppercase tracking-widest">YKS NET HEDEF SÖZLÜĞÜ</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2 mb-3">Hangi Meslek Kaç Net İstiyor?</h1>
          <p className="text-gray-550 text-sm font-semibold leading-relaxed">
            Hedeflediğiniz üniversite bölümlerini seçin, yerleşen son kişilerin YKS TYT ve AYT net ortalamalarını detaylıca analiz edin.
          </p>
        </div>

        {/* Arama Kutusu */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-5 shadow-sm mb-8 flex items-center gap-3">
          <span className="text-lg">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Meslek veya üniversite adı arayın... (Örn: Tıp, Yazılım, Eczacılık, Psikoloji)"
            className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl py-3 px-4 text-sm font-bold text-gray-800 outline-none focus:border-[#D97706] transition-colors"
          />
        </div>

        {/* Meslek Listesi */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-md flex flex-col space-y-4 mb-8">
          <div className="flex justify-between items-center pb-4 border-b border-[#FAF8F5]">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">YKS Bölümler Listesi</span>
            <span className="text-xs font-black text-[#D97706] bg-[#FAF0E3] px-3 py-1 rounded-xl">Son Yerleşen Verileri</span>
          </div>

          <div className="divide-y divide-gray-100 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
            {filteredMeslekler.length > 0 ? (
              filteredMeslekler.map((meslek: any) => (
                <button
                  key={meslek.ad}
                  onClick={() => setSelectedMeslek(meslek)}
                  className="w-full py-4 text-left flex justify-between items-center hover:bg-gray-50/50 transition-colors first:pt-0 last:pb-0"
                >
                  <div>
                    <h3 className="font-black text-gray-800 text-sm sm:text-base">{meslek.ad}</h3>
                    <p className="text-xs text-gray-555 font-bold mt-1">🎓 {meslek.uni}</p>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#EFECE6] text-[#1E3A8A] font-black px-4 py-2.5 rounded-xl text-xs flex-shrink-0">
                    Sıralama: {meslek.saySiralama}
                  </div>
                </button>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-gray-400 font-bold">Uyumlu meslek veya üniversite bulunamadı.</div>
            )}
          </div>
        </div>

        {/* Seçilen Mesleğin Net Detayı */}
        {selectedMeslek && (
          <div className="bg-white border border-amber-300 rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-amber-100">
              <div>
                <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-xl uppercase tracking-wider">
                  NET HEDEF ANALİZİ
                </span>
                <h3 className="text-base sm:text-lg font-black text-gray-800 mt-2">{selectedMeslek.ad}</h3>
              </div>
              <button
                onClick={() => setSelectedMeslek(null)}
                className="text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                ✕ Kapat
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl p-4 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Gerekli TYT Toplam Net</p>
                <p className="text-xl font-black text-[#1E3A8A] mt-1">{selectedMeslek.tytNet} Net</p>
              </div>
              <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl p-4 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Gerekli AYT Toplam Net</p>
                <p className="text-xl font-black text-[#1E3A8A] mt-1">{selectedMeslek.aytNet} Net</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <p className="text-xs font-black text-blue-900">📚 Hedeflediğin Üniversiteyi Kazanmak İster misin?</p>
                <p className="text-[10px] text-blue-800 mt-1 font-bold">
                  AYT netlerinizi artıracak ve yerleştirme sıralamanızı garantileyecek özel çalışma programları için <span className="font-black">{selectedMeslek.hocaAd}</span> ile hemen tanışın.
                </p>
              </div>
              <a
                href={waLink(`Merhaba, meslek net atlasında ${selectedMeslek.ad} hedefini seçtim. TYT ${selectedMeslek.tytNet} ve AYT ${selectedMeslek.aytNet} net hedefine ulaşmam için ${selectedMeslek.hocaAd} hocamızdan özel ders almak istiyorum.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1E3A8A] hover:bg-[#152a60] text-white text-xs font-black px-5 py-3.5 rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap"
              >
                Hoca ile İletişime Geç ➔
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
