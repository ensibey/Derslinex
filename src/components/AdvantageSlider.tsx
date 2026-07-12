"use client";
import { useState, useEffect } from "react";

const avantajlar = [
  {
    title: "🎯 Kişiselleştirilmiş YKS Yol Haritası",
    desc: "Her öğrencinin seviyesine, eksiklerine ve hedeflediği üniversite bölümüne göre özel haftalık çalışma ve takip programı hazırlanır.",
    stats: "Ortalama +85 Net Artışı",
    badge: "BAŞARI ODAKLI"
  },
  {
    title: "🎓 Türkiye'nin En Seçkin Eğitmen Kadrosu",
    desc: "Sadece alanında uzman, Derece yapmış öğrencileri yetiştirmiş ve YKS müfredatına %100 hakim öğretmenler platformda yer alır.",
    stats: "9.8/10 Veli Memnuniyeti",
    badge: "UZMAN KADRO"
  },
  {
    title: "⚡ Esnek Çalışma Saatleri ve Formatı",
    desc: "Dilersen evinin konforunda interaktif online ders al, dilersen anlaşmalı ortak alanlarda yüz yüze dersle odaklanmanı maksimuma çıkar.",
    stats: "7/24 Rehberlik Desteği",
    badge: "HİBRİT EĞİTİM"
  }
];

export default function AdvantageSlider() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % avantajlar.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-xl">
      <div className="flex flex-wrap gap-2 mb-8 justify-center sm:justify-start">
        {avantajlar.map((av, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-300 ${
              activeTab === idx
                ? "bg-primary-600 text-white shadow-md"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {av.badge}
          </button>
        ))}
      </div>

      <div className="min-h-[160px] flex flex-col justify-between transition-all duration-500">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 animate-fade-in">
            {avantajlar[activeTab].title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl">
            {avantajlar[activeTab].desc}
          </p>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-black text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg">
            {avantajlar[activeTab].stats}
          </span>
          <div className="flex gap-1.5">
            {avantajlar.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeTab === idx ? "w-6 bg-primary-600" : "bg-gray-250"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
