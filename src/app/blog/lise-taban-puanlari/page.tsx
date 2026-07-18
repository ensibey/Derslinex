"use client";
import { useState } from "react";
import Link from "next/link";
import { tumTurkiyeLiseleri } from "@/data/liseler";
import { getLiseVerisiBySearch } from "@/data/liseler_helper";
import { waLink } from "@/lib/utils";

export default function LiseTabanPuanlariPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sehirFilter, setSehirFilter] = useState("Tümü");
  const [targetSchool, setTargetSchool] = useState<typeof tumTurkiyeLiseleri[0] | null>(null);

  // Benzersiz şehir listesini al (81 ili kapsar)
  const sehirler = ["Tümü", ...Array.from(new Set(tumTurkiyeLiseleri.map((l) => l.sehir)))].sort();

  // Arama ve Şehir filtreleme mantığını dinamik helper ile çalıştır
  const filteredLiseler = getLiseVerisiBySearch(searchTerm, sehirFilter);

  // Seçilen lisenin net hedeflerini dinamik hesaplayan algoritma
  const calculateNetHedefleri = (puan: number) => {
    let matNet = 10;
    let fenNet = 10;
    let turNet = 12;

    if (puan >= 495) {
      matNet = 20; fenNet = 20; turNet = 20;
    } else if (puan >= 490) {
      matNet = 19; fenNet = 19; turNet = 20;
    } else if (puan >= 480) {
      matNet = 18; fenNet = 18; turNet = 19;
    } else if (puan >= 470) {
      matNet = 17; fenNet = 17; turNet = 18;
    } else if (puan >= 460) {
      matNet = 15; fenNet = 16; turNet = 18;
    } else if (puan >= 450) {
      matNet = 14; fenNet = 15; turNet = 17;
    } else {
      matNet = 12; fenNet = 13; turNet = 15;
    }

    return { matNet, fenNet, turNet };
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#D97706] text-xs font-black uppercase tracking-widest">LGS TERCİH ROBOTU</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2 mb-3">LGS Taban Puanları ve Net Hedefleri</h1>
          <p className="text-gray-550 text-sm font-semibold leading-relaxed max-w-2xl mx-auto">
            Türkiye genelindeki nitelikli fen, anadolu ve sosyal bilimler liselerini şehirlere göre filtreleyin, taban puanları ve kazanmak için yapmanız gereken hedefleri analiz edin.
          </p>
        </div>

        {/* Filtreleme ve Arama Paneli */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search-input" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">LİSE ADI VEYA İLÇE ARA</label>
            <input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Örn: Galatasaray, Kars Fen, Rize TOBB..."
              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl py-3 px-4 text-sm font-bold text-gray-800 outline-none focus:border-[#D97706] transition-colors"
            />
          </div>

          <div className="w-full md:w-48">
            <label htmlFor="sehir-select" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">ŞEHİR SEÇ</label>
            <select
              id="sehir-select"
              value={sehirFilter}
              onChange={(e) => setSehirFilter(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl py-3 px-4 text-sm font-bold text-gray-800 outline-none focus:border-[#D97706] transition-colors"
            >
              {sehirler.map((sehir) => (
                <option key={sehir} value={sehir}>{sehir}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lise Listesi */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-md flex flex-col space-y-4 mb-8">
          <div className="flex justify-between items-center pb-4 border-b border-[#FAF8F5]">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Nitelikli Liseler Listesi ({filteredLiseler.length} Okul)</span>
            <span className="text-xs font-black text-[#D97706] bg-[#FAF0E3] px-3 py-1 rounded-xl">2026/2027 Uyumlu</span>
          </div>

          <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
            {filteredLiseler.length > 0 ? (
              filteredLiseler.map((lise) => (
                <button
                  key={lise.ad}
                  onClick={() => setTargetSchool(lise)}
                  className="w-full py-4 text-left flex justify-between items-center hover:bg-gray-50/50 transition-colors first:pt-0 last:pb-0"
                >
                  <div>
                    <h3 className="font-black text-gray-800 text-sm sm:text-base">{lise.ad}</h3>
                    <p className="text-xs text-gray-555 font-bold mt-1">📍 {lise.sehir} | Yüzdelik Dilim: %{lise.dilim}</p>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#EFECE6] text-[#1E3A8A] font-black px-4 py-2.5 rounded-xl text-xs flex-shrink-0">
                    {lise.puan} Puan
                  </div>
                </button>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-gray-400 font-bold">Arama kriterlerine uygun lise bulunamadı.</div>
            )}
          </div>
        </div>

        {/* Seçilen Lisenin Net Hedef Analizi */}
        {targetSchool && (() => {
          const nets = calculateNetHedefleri(targetSchool.puan);
          return (
            <div className="bg-white border border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-emerald-100">
                <div>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl uppercase tracking-wider">
                    HEDEF ANALİZ RAPORU
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-gray-800 mt-2">{targetSchool.ad}</h3>
                </div>
                <button
                  onClick={() => setTargetSchool(null)}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  ✕ Kapat
                </button>
              </div>

              <div>
                <p className="text-xs font-black text-gray-455 uppercase tracking-widest mb-3">Bu Liseyi Kazanmak İçin Hedef Netler:</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl p-3.5 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Matematik</p>
                    <p className="text-base font-black text-[#1E3A8A] mt-1">{nets.matNet} Net</p>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl p-3.5 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Fen Bilimleri</p>
                    <p className="text-base font-black text-[#1E3A8A] mt-1">{nets.fenNet} Net</p>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl p-3.5 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Türkçe</p>
                    <p className="text-base font-black text-[#1E3A8A] mt-1">{nets.turNet} Net</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div>
                  <p className="text-xs font-black text-blue-900">🎯 Hedef Netlerine Ulaşmak İster misin?</p>
                  <p className="text-[10px] text-blue-800 mt-1 font-bold">
                    Özellikle LGS sayısal testlerinde {nets.matNet} net hedefini yakalamak için uzman hocalarımızla hemen tanışma seansı planlayın.
                  </p>
                </div>
                <a
                  href={waLink(`Merhaba, LGS taban puan listesinde ${targetSchool.ad} hedefini seçtim. Matematikten ${nets.matNet} net hedefine ulaşmam için özel ders ve program desteği almak istiyorum.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1E3A8A] hover:bg-[#152a60] text-white text-xs font-black px-5 py-3.5 rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap"
                >
                  Hemen Başla ➔
                </a>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
