"use client";

import React, { useState } from "react";
import Image from "next/image";
import { waLink } from "@/lib/utils";

interface Coupon {
  id: string;
  code: string;
  discount: string;
  title: string;
  desc: string;
  tag: string;
  badgeColor: string;
  expires: string;
}

const coupons: Coupon[] = [
  {
    id: "c1",
    code: "DERSLINEX20",
    discount: "%20 İNDİRİM",
    title: "İlk Derse Özel Tanışma İndirimi",
    desc: "Seçeceğiniz herhangi bir branştaki ilk özel dersinizde geçerli %20 anında indirim.",
    tag: "TÜM DERSLER",
    badgeColor: "from-amber-500 to-orange-600",
    expires: "Sınırlı Kontenjan",
  },
  {
    id: "c2",
    code: "YKS10PAKET",
    discount: "+2 DERS HEDİYE",
    title: "10 Saatlik YKS / LGS Paket Avantajı",
    desc: "10 derslik bireysel hazırlık paketi alan öğrencilere 2 canlı soru çözüm dersi hediye.",
    tag: "YKS & LGS",
    badgeColor: "from-blue-600 to-indigo-700",
    expires: "2026 Sezonu",
  },
  {
    id: "c3",
    code: "DENEMEBONUS",
    discount: "ÜCRETSİZ",
    title: "Türkiye Geneli Online Deneme Sınavı",
    desc: "Canlı kamera gözetmenli, detaylı karne analizli Türkiye geneli deneme sınavı hakkı.",
    tag: "ONLINE DENEME",
    badgeColor: "from-emerald-600 to-teal-700",
    expires: "Bu Ay Geçerli",
  },
];

export default function CouponSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {}
  };

  return (
    <section id="firsat-kuponlari" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
      <div className="bg-gradient-to-br from-[#1E3A8A] via-[#152860] to-[#0D1B35] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-white/10">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-white/10 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <span>🎟️ GÜNCEL FIRSAT KUPONLARI & BURSLAR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Eğitimine Avantajla Başla
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-medium mt-1">
              Derslinex onaylı öğretmenlerle bütçene uygun indirim kuponlarını kullan, hedefine hızla ulaş.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-300 font-bold">
              ⚡ Kupon kodunu kopyalayıp WhatsApp üzerinden gönderebilirsin.
            </span>
          </div>
        </div>

        {/* Coupon Grid */}
        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 shadow-lg flex flex-col justify-between hover:bg-white/15 transition-all duration-200 group relative"
            >
              {/* Brand Logo Watermark in Card */}
              <div className="absolute top-4 right-4 w-9 h-9 opacity-35 group-hover:opacity-60 transition-opacity">
                <Image
                  src="/logo.png?v=9"
                  alt="Derslinex"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>

              <div>
                {/* Tag & Discount */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/15 text-white px-2.5 py-1 rounded-md">
                    {c.tag}
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold">
                    ⏰ {c.expires}
                  </span>
                </div>

                <div className={`text-2xl font-black bg-gradient-to-r ${c.badgeColor} bg-clip-text text-transparent mb-2`}>
                  {c.discount}
                </div>

                <h3 className="text-base font-black text-white mb-2 leading-snug">
                  {c.title}
                </h3>

                <p className="text-xs text-gray-300 leading-relaxed font-medium mb-6">
                  {c.desc}
                </p>
              </div>

              {/* Coupon Code Box */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between bg-black/30 border border-white/10 rounded-xl p-2 gap-2">
                  <div className="flex flex-col pl-2">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Kupon Kodu</span>
                    <span className="font-mono font-black text-amber-300 text-sm tracking-wider">
                      {c.code}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(c.code)}
                    className="bg-white/20 hover:bg-white/30 text-white text-xs font-black px-3 py-2 rounded-lg transition active:scale-95 whitespace-nowrap"
                  >
                    {copiedCode === c.code ? "✓ Kopyalandı" : "Kodu Al"}
                  </button>
                </div>

                <a
                  href={waLink(`Merhaba, ${c.code} kupon kodunu kullanarak ${c.title} kampanyasından yararlanmak istiyorum.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center mt-3 text-xs font-black text-amber-300 hover:text-amber-200 transition underline"
                >
                  WhatsApp İle Kuponu Kullan →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
