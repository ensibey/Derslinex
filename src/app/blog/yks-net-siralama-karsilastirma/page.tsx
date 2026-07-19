"use client";
import { useState } from "react";
import Link from "next/link";
import { waLink } from "@/lib/utils";

const veri2024 = [
  { tytNet: "110 Net", aytNet: "75 Net", obp: "95", saySiralama: "950", eaSiralama: "120" },
  { tytNet: "100 Net", aytNet: "70 Net", obp: "92", saySiralama: "3,800", eaSiralama: "580" },
  { tytNet: "90 Net", aytNet: "60 Net", obp: "90", saySiralama: "14,500", eaSiralama: "2,400" },
  { tytNet: "80 Net", aytNet: "50 Net", obp: "85", saySiralama: "39,000", eaSiralama: "8,900" },
  { tytNet: "70 Net", aytNet: "40 Net", obp: "80", saySiralama: "85,000", eaSiralama: "22,000" }
];

const veri2025 = [
  { tytNet: "110 Net", aytNet: "75 Net", obp: "95", saySiralama: "1,200", eaSiralama: "180" },
  { tytNet: "100 Net", aytNet: "70 Net", obp: "92", saySiralama: "4,600", eaSiralama: "820" },
  { tytNet: "90 Net", aytNet: "60 Net", obp: "90", saySiralama: "17,200", eaSiralama: "3,100" },
  { tytNet: "80 Net", aytNet: "50 Net", obp: "85", saySiralama: "44,500", eaSiralama: "11,200" },
  { tytNet: "70 Net", aytNet: "40 Net", obp: "80", saySiralama: "98,000", eaSiralama: "28,500" }
];

export default function NetSiralamaKarsilastirmaPage() {
  const [tytInput, setTytInput] = useState<number>(90);
  const [aytInput, setAytInput] = useState<number>(60);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [result, setResult] = useState<{ say2024: number; say2025: number; ea2024: number; ea2025: number } | null>(null);

  const handleSimulate = () => {
    // Normalise inputs
    const tyt = Math.min(120, Math.max(0, tytInput));
    const ayt = Math.min(80, Math.max(0, aytInput));
    
    // Combined target index metric: weight AYT heavily (e.g. 2x) since it impacts rank more
    const studentScore = tyt + (ayt * 2);
    
    // Reference points mapping from data tables
    const refs = [
      { score: 110 + (75 * 2), say24: 950, say25: 1200, ea24: 120, ea25: 180 },     // 260
      { score: 100 + (70 * 2), say24: 3800, say25: 4600, ea24: 580, ea25: 820 },    // 240
      { score: 90 + (60 * 2), say24: 14500, say25: 17200, ea24: 2400, ea25: 3100 },  // 210
      { score: 80 + (50 * 2), say24: 39000, say25: 44500, ea24: 8900, ea25: 11200 }, // 180
      { score: 70 + (40 * 2), say24: 85000, say25: 98000, ea24: 22000, ea25: 28500 } // 150
    ];

    let say24 = 0, say25 = 0, ea24 = 0, ea25 = 0;
    
    if (studentScore >= refs[0].score) {
      // Out of top bounds: scale up ranking factor
      const ratio = refs[0].score / (studentScore || 1);
      say24 = Math.round(refs[0].say24 * ratio);
      say25 = Math.round(refs[0].say25 * ratio);
      ea24 = Math.round(refs[0].ea24 * ratio);
      ea25 = Math.round(refs[0].ea25 * ratio);
    } else if (studentScore <= refs[refs.length - 1].score) {
      // Out of bottom bounds: scale down ranking factor
      const ratio = refs[refs.length - 1].score / (studentScore || 1);
      say24 = Math.round(refs[refs.length - 1].say24 * ratio);
      say25 = Math.round(refs[refs.length - 1].say25 * ratio);
      ea24 = Math.round(refs[refs.length - 1].ea24 * ratio);
      ea25 = Math.round(refs[refs.length - 1].ea25 * ratio);
    } else {
      // Interpolate between two adjacent reference points
      for (let i = 0; i < refs.length - 1; i++) {
        const upper = refs[i];
        const lower = refs[i + 1];
        if (studentScore <= upper.score && studentScore >= lower.score) {
          const range = upper.score - lower.score;
          const factor = (upper.score - studentScore) / (range || 1); // 0 to 1
          
          say24 = Math.round(upper.say24 + (lower.say24 - upper.say24) * factor);
          say25 = Math.round(upper.say25 + (lower.say25 - upper.say25) * factor);
          ea24 = Math.round(upper.ea24 + (lower.ea24 - upper.ea24) * factor);
          ea25 = Math.round(upper.ea25 + (lower.ea25 - upper.ea25) * factor);
          break;
        }
      }
    }

    setResult({
      say2024: Math.max(1, say24),
      say2025: Math.max(1, say25),
      ea2024: Math.max(1, ea24),
      ea2025: Math.max(1, ea25)
    });
    setShowResult(true);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#B45309] text-xs font-black uppercase tracking-widest">YKS VERİ SİMÜLATÖRÜ</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2 mb-3">YKS Net ve Sıralama Karşılaştırma</h1>
          <p className="text-gray-500 text-sm font-semibold max-w-xl mx-auto leading-relaxed">
            Aynı netlerin 2024 (zor) ve 2025 (yığılmalı kolay) sınav yıllarındaki sıralama karşılıklarını yan yana simüle ederek yığılma etkisini analiz edin.
          </p>
        </div>

        {/* Interactive Simulator Panel */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-md flex flex-col space-y-6 mb-10">
          <div className="flex justify-between items-center pb-4 border-b border-[#FAF8F5]">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">YKS Net Kıyaslama Robotu</span>
            <span className="text-xs font-black text-[#B45309] bg-[#FAF0E3] px-3 py-1 rounded-xl">2024 vs 2025 Kıyasla</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tyt-net-input" className="block text-xs font-black text-[#1E3A8A] uppercase tracking-wider mb-2">
                TYT Toplam Netiniz (0 - 120)
              </label>
              <input
                id="tyt-net-input"
                type="number"
                min="0"
                max="120"
                value={tytInput}
                onChange={(e) => setTytInput(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl py-3 px-4 text-sm font-bold text-gray-800 outline-none focus:border-[#B45309] transition-colors"
                placeholder="Örn: 90"
              />
            </div>
            <div>
              <label htmlFor="ayt-net-input" className="block text-xs font-black text-[#1E3A8A] uppercase tracking-wider mb-2">
                AYT Toplam Netiniz (0 - 80)
              </label>
              <input
                id="ayt-net-input"
                type="number"
                min="0"
                max="80"
                value={aytInput}
                onChange={(e) => setAytInput(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl py-3 px-4 text-sm font-bold text-gray-800 outline-none focus:border-[#B45309] transition-colors"
                placeholder="Örn: 60"
              />
            </div>
          </div>

          <button
            onClick={handleSimulate}
            className="w-full bg-[#B45309] hover:bg-[#92400E] text-white font-black py-4 rounded-2xl transition-all shadow-md active:scale-95 text-sm relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_3s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent"
          >
            Yığılma Sıralama Etkisini Gör ➔
          </button>

          {showResult && result && (
            <div className="pt-6 border-t border-[#FAF8F5] space-y-6">
              <h3 className="text-base font-black text-[#1E3A8A] uppercase tracking-wider">Yığılma Karşılaştırma Raporu</h3>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Sayısal Sonuç */}
                <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-3xl p-5 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200/50">
                    <span className="text-xs font-black text-gray-400">📐 SAYISAL ALANI</span>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">SAY Puanı</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm font-bold text-gray-700">
                      <span>2024 YKS Sıralama (Zor Sınav):</span>
                      <span className="font-black text-[#1E3A8A]">{result.say2024.toLocaleString("tr-TR")}.</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-gray-700">
                      <span>2025 YKS Sıralama (Kolay Sınav):</span>
                      <span className="font-black text-red-650">{result.say2025.toLocaleString("tr-TR")}.</span>
                    </div>
                    <div className="pt-2 border-t border-dashed border-gray-250 text-[10px] text-gray-500 font-semibold">
                      Aynı netlerle kolay sınavda yaklaşık <span className="text-red-600 font-bold">%{(Math.round(((result.say2025 - result.say2024) / result.say2024) * 100))}% daha geride</span> yer aldınız.
                    </div>
                  </div>
                </div>

                {/* Eşit Ağırlık Sonuç */}
                <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-3xl p-5 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200/50">
                    <span className="text-xs font-black text-gray-400">⚖️ EŞİT AĞIRLIK ALANI</span>
                    <span className="text-[10px] font-black text-[#B45309] bg-[#FAF0E3] px-2.5 py-0.5 rounded-full">EA Puanı</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm font-bold text-gray-700">
                      <span>2024 YKS Sıralama (Zor Sınav):</span>
                      <span className="font-black text-[#1E3A8A]">{result.ea2024.toLocaleString("tr-TR")}.</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-gray-700">
                      <span>2025 YKS Sıralama (Kolay Sınav):</span>
                      <span className="font-black text-red-650">{result.ea2025.toLocaleString("tr-TR")}.</span>
                    </div>
                    <div className="pt-2 border-t border-dashed border-gray-250 text-[10px] text-gray-500 font-semibold">
                      Aynı netlerle kolay sınavda yaklaşık <span className="text-red-600 font-bold">%{(Math.round(((result.ea2025 - result.ea2024) / result.ea2024) * 100))}% daha geride</span> yer aldınız.
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 text-xs font-semibold text-blue-900 leading-relaxed">
                <p className="font-black mb-1">💡 DERSLİNEX YIĞILMA ANALİZ NOTU:</p>
                Sınavın kolay olduğu yıllarda sıralama yığılmaları oluşur ve aynı netlerle daha geride kalırsınız. Yığılmadan etkilenmemek ve rakiplerinize sıralama farkı atmak için YKS'de standart sapması yüksek olan zorlayıcı AYT derslerine odaklanmalısınız. Bizimle iletişime geçerek hedefinize özel birebir AYT net geliştirme programı hazırlayabilirsiniz.
                <div className="mt-3">
                  <a
                    href={waLink(`Merhaba, YKS net sıralama karşılaştırma robotunda netlerimi simüle ettim. TYT ${tytInput} ve AYT ${aytInput} netlerimi artıracak ve yığılmadan etkilenmeyecek bir çalışma programı almak istiyorum.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#1E3A8A] text-white font-black px-5 py-3 rounded-xl text-xs hover:bg-[#152a60] transition-colors"
                  >
                    💬 Sıralama Kurtarma Planı Hazırla
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2025 Veri Tablosu */}
        <section className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-sm mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-[#1E3A8A] uppercase tracking-wider">📊 2025 YKS Net - Sıralama Karşılıkları</h2>
            <span className="text-xs font-bold text-gray-400">Yaklaşık Sonuçlar</span>
          </div>

          <div className="overflow-x-auto whitespace-nowrap scrollbar-thin pb-2">
            <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-[#FAF8F5] text-gray-400 font-black uppercase tracking-wider">
                  <th className="pb-3 px-2">TYT Net</th>
                  <th className="pb-3 px-2">AYT Net</th>
                  <th className="pb-3 px-2">OBP</th>
                  <th className="pb-3 px-2 text-right">Sayısal Sıralama</th>
                  <th className="pb-3 px-2 text-right">Eşit Ağırlık</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-bold text-gray-700">
                {veri2025.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-2 text-[#1E3A8A]">{row.tytNet}</td>
                    <td className="py-4 px-2">{row.aytNet}</td>
                    <td className="py-4 px-2">{row.obp}</td>
                    <td className="py-4 px-2 text-right text-emerald-600 font-black">{row.saySiralama}</td>
                    <td className="py-4 px-2 text-right text-[#B45309] font-black">{row.eaSiralama}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2024 Veri Tablosu */}
        <section className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-sm mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-[#1E3A8A] uppercase tracking-wider">📊 2024 YKS Net - Sıralama Karşılıkları</h2>
            <span className="text-xs font-bold text-gray-400">Resmi Veriler</span>
          </div>

          <div className="overflow-x-auto whitespace-nowrap scrollbar-thin pb-2">
            <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-[#FAF8F5] text-gray-400 font-black uppercase tracking-wider">
                  <th className="pb-3 px-2">TYT Net</th>
                  <th className="pb-3 px-2">AYT Net</th>
                  <th className="pb-3 px-2">OBP</th>
                  <th className="pb-3 px-2 text-right">Sayısal Sıralama</th>
                  <th className="pb-3 px-2 text-right">Eşit Ağırlık</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-bold text-gray-700">
                {veri2024.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-2 text-[#1E3A8A]">{row.tytNet}</td>
                    <td className="py-4 px-2">{row.aytNet}</td>
                    <td className="py-4 px-2">{row.obp}</td>
                    <td className="py-4 px-2 text-right text-emerald-650 font-black">{row.saySiralama}</td>
                    <td className="py-4 px-2 text-right text-[#B45309] font-black">{row.eaSiralama}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sales Conversion Section */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-black">🎯 Hedeflediğin Sıralamaya Ulaşmak İster misin?</h3>
            <p className="text-xs text-amber-50 font-semibold max-w-lg leading-relaxed">
              Yığışmanın etkisini en aza indirmek ve hedeflerini riske atmamak için hemen uzman hocalarımızla çalışmaya başla, netlerini garantiye al!
            </p>
          </div>
          <Link
            href="/hocalar"
            className="bg-white hover:bg-gray-50 text-[#B45309] font-black px-6 py-3.5 rounded-xl transition-all shadow-sm active:scale-95 text-xs text-center whitespace-nowrap flex-shrink-0"
          >
            Birebir Ders Al ➔
          </Link>
        </div>
      </div>
    </div>
  );
}
