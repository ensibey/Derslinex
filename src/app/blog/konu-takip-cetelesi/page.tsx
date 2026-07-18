"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { konuTakipVerisi } from "@/data/araclar";
import { waLink } from "@/lib/utils";

export default function KonuTakipPage() {
  const [selectedDersIdx, setSelectedDersIdx] = useState(0);
  const [completedList, setCompletedList] = useState<{ [key: string]: boolean }>({});

  const currentDers = konuTakipVerisi[selectedDersIdx];

  // İşaretleme durumunu değiştir
  const handleToggle = (konu: string) => {
    const key = `${currentDers.id}-${konu}`;
    setCompletedList((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Tamamlanma oranını hesapla
  const getPercentage = () => {
    const total = currentDers.konular.length;
    const completedCount = currentDers.konular.filter((k) => completedList[`${currentDers.id}-${k}`]).length;
    return Math.round((completedCount / total) * 100);
  };

  const percentage = getPercentage();

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#D97706] text-xs font-black uppercase tracking-widest">ÇALIŞMA DİSİPLİNİ</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2 mb-3">YKS & LGS Konu Takip Çetelesi</h1>
          <p className="text-gray-550 text-sm font-semibold leading-relaxed">
            Hangi dersten hangi konuları bitirdiğinizi işaretleyin, tamamlanma oranınızı görün ve eksiklerinizi planlayın.
          </p>
        </div>

        {/* Ders Seçim Sekmeleri */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 border border-[#EFECE6] rounded-2xl">
          {konuTakipVerisi.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setSelectedDersIdx(idx)}
              className={`flex-1 py-3 px-3 text-center text-xs font-black rounded-xl transition-all whitespace-nowrap ${
                selectedDersIdx === idx
                  ? "bg-[#1E3A8A] text-white shadow-sm"
                  : "text-gray-650 hover:bg-gray-50"
              }`}
            >
              {item.ders}
            </button>
          ))}
        </div>

        {/* İlerleme Çubuğu */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-sm mb-6 flex flex-col space-y-3">
          <div className="flex justify-between items-center text-sm font-bold text-gray-700">
            <span>Ders Tamamlanma Oranı</span>
            <span className="text-[#D97706] font-black">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
            <div
              className="bg-[#D97706] h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Konu Listesi */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-md flex flex-col space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-[#FAF8F5] mb-2">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{currentDers.ders} Müfredatı</span>
            <span className="text-xs font-black text-[#D97706] bg-[#FAF0E3] px-3 py-1 rounded-xl">2027 Uyumlu</span>
          </div>

          <div className="space-y-2">
            {currentDers.konular.map((konu) => {
              const key = `${currentDers.id}-${konu}`;
              const isChecked = !!completedList[key];
              return (
                <button
                  key={konu}
                  onClick={() => handleToggle(konu)}
                  className={`w-full text-left flex items-center justify-between border rounded-2xl px-5 py-4 transition-all outline-none font-bold text-xs sm:text-sm ${
                    isChecked
                      ? "border-emerald-300 bg-emerald-50/50 text-emerald-800"
                      : "border-[#EFECE6] bg-[#FAF8F5] text-gray-700 hover:bg-[#FAF0E3]"
                  }`}
                >
                  <span className="pr-4">{konu}</span>
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black ${
                    isChecked ? "bg-emerald-500 text-white" : "bg-white border border-[#EFECE6] text-transparent"
                  }`}>
                    ✓
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Satış Dönüşümü CTA */}
        {percentage < 60 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm font-black text-blue-900">🚨 Konu İlerlemen Henüz %60 Altında!</p>
              <p className="text-xs text-blue-800 mt-1 font-bold">
                Endişelenme. <span className="font-black">{currentDers.hocaAd}</span> ile eksik konularını tamamlayacak hızlandırılmış özel ders planı oluşturabilirsin.
              </p>
            </div>
            <a
              href={waLink(`Merhaba, ${currentDers.ders} dersinin çetelesinde ilerlemem henüz %${percentage} seviyesinde. ${currentDers.hocaAd} hocamızdan eksikleri kapatma programı ve özel ders teklifi almak istiyorum.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1E3A8A] hover:bg-[#152a60] text-white text-xs font-black px-6 py-3.5 rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap"
            >
              Hızlı Ders Al ➔
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
