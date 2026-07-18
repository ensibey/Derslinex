"use client";
import { useState } from "react";
import Link from "next/link";
import { liseTabanVerisi } from "@/data/araclar";
import { waLink } from "@/lib/utils";

export default function LiseTabanPuanlariPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [targetSchool, setTargetSchool] = useState<typeof liseTabanVerisi[0] | null>(null);

  const filteredLiseler = liseTabanVerisi.filter((l) =>
    l.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.sehir.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#D97706] text-xs font-black uppercase tracking-widest">LGS TERCİH ROBOTU</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2 mb-3">LGS Taban Puanları ve Net Hedefleri</h1>
          <p className="text-gray-550 text-sm font-semibold leading-relaxed">
            Hedefinizdeki fen liselerini listeleyin, taban puanlarını inceleyin ve kazanmak için yapmanız gereken ders net hedeflerini görün.
          </p>
        </div>

        {/* Arama Barı */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-5 shadow-sm mb-8 flex items-center gap-3">
          <span className="text-lg">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Lise adı veya şehir arayın... (Örn: Galatasaray, Ankara)"
            className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl py-3 px-4 text-sm font-bold text-gray-800 outline-none focus:border-[#D97706] transition-colors"
          />
        </div>

        {/* Lise Listesi */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-md flex flex-col space-y-4 mb-8">
          <div className="flex justify-between items-center pb-4 border-b border-[#FAF8F5]">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Nitelikli Liseler Listesi</span>
            <span className="text-xs font-black text-[#D97706] bg-[#FAF0E3] px-3 py-1 rounded-xl">2026/2027 Uyumlu</span>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredLiseler.map((lise) => (
              <button
                key={lise.id}
                onClick={() => setTargetSchool(lise)}
                className="w-full py-4 text-left flex justify-between items-center hover:bg-gray-50/50 transition-colors first:pt-0 last:pb-0"
              >
                <div>
                  <h3 className="font-black text-gray-800 text-sm sm:text-base">{lise.ad}</h3>
                  <p className="text-xs text-gray-550 font-bold mt-1">📍 {lise.sehir} | Yüzdelik Dilim: %{lise.dilim}</p>
                </div>
                <div className="bg-[#FAF8F5] border border-[#EFECE6] text-[#1E3A8A] font-black px-4 py-2.5 rounded-xl text-xs flex-shrink-0">
                  {lise.puan} Puan
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Seçilen Lisenin Net Hedef Analizi */}
        {targetSchool && (
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
                Kapat
              </button>
            </div>

            <div>
              <p className="text-xs font-black text-gray-450 uppercase tracking-widest mb-3">Bu Liseyi Kazanmak İçin Hedef Netler:</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl p-3.5 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Matematik</p>
                  <p className="text-base font-black text-[#1E3A8A] mt-1">{targetSchool.matNet} Net</p>
                </div>
                <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl p-3.5 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Fen Bilimleri</p>
                  <p className="text-base font-black text-[#1E3A8A] mt-1">{targetSchool.fenNet} Net</p>
                </div>
                <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl p-3.5 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Türkçe</p>
                  <p className="text-base font-black text-[#1E3A8A] mt-1">{targetSchool.turNet} Net</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <p className="text-xs font-black text-blue-900">📚 Hedef Netlerine Ulaşmak İster misin?</p>
                <p className="text-[10px] text-blue-800 mt-1 font-bold">
                  Özellikle LGS sayısal testlerinde 20 net hedefini yakalamak için uzman hocalarımızla hemen tanışma seansı planlayın.
                </p>
              </div>
              <a
                href={waLink(`Merhaba, LGS taban puan listesinde ${targetSchool.ad} hedefini seçtim. Matematikten ${targetSchool.matNet} net hedefine ulaşmam için özel ders ve program desteği almak istiyorum.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1E3A8A] hover:bg-[#152a60] text-white text-xs font-black px-5 py-3 rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap"
              >
                Hemen Başla ➔
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
