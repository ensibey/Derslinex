"use client";

import React, { useState, useEffect } from "react";
import { waLink } from "@/lib/utils";

interface PackageItem {
  id: number;
  title: string;
  subtitle: string | null;
  targetExam: string;
  hours: number;
  price: number;
  discountedPrice: number | null;
  badge: string | null;
  features: string;
  isPopular: boolean;
  isActive: boolean;
  orderNo: number;
}

export default function PackagesSection() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<string>("TÜMÜ");

  useEffect(() => {
    fetch("/api/packages")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.packages) {
          setPackages(data.packages);
        }
      })
      .catch((err) => console.error("Paketler yüklenemedi:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = selectedExam === "TÜMÜ"
    ? packages
    : packages.filter((p) => p.targetExam === selectedExam || p.targetExam === "TÜMÜ");

  return (
    <section id="ders-paketleri" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
      {/* Başlık ve Filtreleme */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#FFF3E8] border border-[#F5D0A9] px-4 py-1.5 rounded-full shadow-xs mb-3">
          <span className="w-2 h-2 rounded-full bg-[#E05600] animate-pulse" />
          <span className="text-xs font-black tracking-wider text-[#C04900] uppercase">
            ÖZEL DERS PAKETLERİ & AVANTAJLAR
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] tracking-tight">
          Hedefinize Uygun Ders Paketini Seçin
        </h2>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto font-medium text-sm sm:text-base">
          Saatlik ücret avantajı, kişiye özel haftalık program ve Türkiye geneli denemeler içeren avantajlı paketler.
        </p>

        {/* Kategori Seçici */}
        <div className="flex justify-center mt-6">
          <div className="inline-flex bg-white p-1 rounded-2xl border border-[#EFECE6] shadow-xs">
            {[
              { key: "TÜMÜ", label: "Tüm Paketler" },
              { key: "YKS", label: "🎯 YKS Paketleri" },
              { key: "LGS", label: "🎓 LGS Paketleri" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedExam(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  selectedExam === tab.key
                    ? "bg-[#1E3A8A] text-white shadow-sm"
                    : "text-gray-600 hover:text-[#1E3A8A]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Paket Kartları Grid */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-8 border border-[#EFECE6] animate-pulse h-96" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {filtered.map((pkg) => {
            const featureList = pkg.features
              ? pkg.features.split(",").map((f) => f.trim()).filter(Boolean)
              : [];
            const effectivePrice = pkg.discountedPrice || pkg.price;
            const hourlyRate = pkg.hours > 0 ? Math.round(effectivePrice / pkg.hours) : 0;

            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  pkg.isPopular
                    ? "bg-white border-2 border-[#E05600] shadow-2xl shadow-orange-900/10 md:-translate-y-2"
                    : "bg-white border border-[#EFECE6] shadow-lg hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                {/* Popülerlik / Kampanya Rozeti */}
                {pkg.badge && (
                  <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#D94F00] to-[#EA580C] text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                    ★ {pkg.badge}
                  </div>
                )}

                <div>
                  {/* Sınav Etiketi & Saat */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#1E3A8A]/10 text-[#1E3A8A] text-[11px] font-black px-3 py-1 rounded-lg uppercase">
                      {pkg.targetExam}
                    </span>
                    <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                      ⏱️ {pkg.hours} Saat Canlı Ders
                    </span>
                  </div>

                  {/* Başlık ve Açıklama */}
                  <h3 className="text-xl font-black text-[#1E3A8A] leading-snug mb-2">
                    {pkg.title}
                  </h3>
                  {pkg.subtitle && (
                    <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                      {pkg.subtitle}
                    </p>
                  )}

                  {/* Fiyat Alanı */}
                  <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFECE6] mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#1E3A8A]">
                        {effectivePrice.toLocaleString("tr-TR")} ₺
                      </span>
                      {pkg.discountedPrice && (
                        <span className="text-sm font-bold text-gray-400 line-through">
                          {pkg.price.toLocaleString("tr-TR")} ₺
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-bold text-[#D94F00] mt-1">
                      Saatlik yaklaşık: {hourlyRate.toLocaleString("tr-TR")} ₺ / saat
                    </div>
                  </div>

                  {/* Özellikler Listesi */}
                  <div className="space-y-2.5 mb-8">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">
                      Pakete Dahil Hizmetler:
                    </span>
                    {featureList.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-gray-700 font-medium">
                        <span className="text-emerald-600 font-black flex-shrink-0 text-sm">✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buton */}
                <a
                  href={waLink(`Merhaba, Derslinex üzerinden '${pkg.title}' (${pkg.hours} Saatlik Paket) hakkında bilgi almak ve kaydolmak istiyorum.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 rounded-xl font-black text-xs sm:text-sm text-center transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 ${
                    pkg.isPopular
                      ? "bg-gradient-to-r from-[#D94F00] to-[#EA580C] hover:from-[#C04900] hover:to-[#D94F00] text-white shadow-orange-900/20"
                      : "bg-[#1E3A8A] hover:bg-[#152860] text-white"
                  }`}
                >
                  <span>Paketi Seç & WhatsApp İle Başla</span>
                  <span>→</span>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
