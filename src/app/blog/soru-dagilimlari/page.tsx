"use client";
import { useState } from "react";
import Link from "next/link";

const soruDagilimlari = {
  YKS: [
    { ders: "🧮 Matematik", soru: "40", detay: "TYT Temel Matematik (Problemler, Sayılar, Geometri)" },
    { ders: "📐 AYT Matematik", soru: "40", detay: "Trigonometri, Logaritma, Limit, Türev, İntegral" },
    { ders: "📝 Türkçe", soru: "40", detay: "Dil Bilgisi, Yazım Kuralları, Paragrafta Anlam" },
    { ders: "⚡ Fizik", soru: "14", detay: "AYT Fizik (Mekanik, Elektrik, Manyetizma, Modern Fizik)" },
    { ders: "🧪 Kimya", soru: "13", detay: "AYT Kimya (Organik Kimya, Gazlar, Sıvı Çözeltiler)" },
    { ders: "🧬 Biyoloji", soru: "13", detay: "AYT Biyoloji (Sistemler, Fotosentez, Solunum, GDO)" }
  ],
  LGS: [
    { ders: "🧮 Matematik", soru: "20", detay: "Çarpanlar ve Katlar, Köklü Sayılar, Doğrusal Denklemler" },
    { ders: "🔬 Fen Bilimleri", soru: "20", detay: "Mevsimler, DNA, Basınç, Madde ve Endüstri" },
    { ders: "📝 Türkçe", soru: "20", detay: "Paragraf Yorumu, Sözel Mantık, Cümlenin Ögeleri" },
    { ders: "⏳ T.C. İnkılap Tarihi", soru: "10", detay: "Milli Uyanış, Atatürkçülük, Dış Politika" },
    { ders: "🕌 Din Kültürü", soru: "10", detay: "Kader İnancı, Zekat ve Sadaka, Din ve Hayat" },
    { ders: "🇬🇧 Yabancı Dil (İngilizce)", soru: "10", detay: "Friendship, Teen Life, In The Kitchen" }
  ]
};

export default function SoruDagilimlariPage() {
  const [activeTab, setActiveTab] = useState<"YKS" | "LGS">("YKS");

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#B45309] text-xs font-black uppercase tracking-widest">KONU VE SORU DAĞILIMLARI</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2 mb-3">YKS & LGS Soru Dağılımları</h1>
          <p className="text-gray-500 text-sm font-semibold leading-relaxed">
            Sınava hazırlık sürecinde hangi dersten kaç soru çıkacağını öğrenin ve çalışmalarınızı en çok soru getiren konulara göre şekillendirin.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white p-2 border border-[#EFECE6] rounded-2xl mb-8">
          <button
            onClick={() => setActiveTab("YKS")}
            className={`flex-1 py-3 text-center text-xs sm:text-sm font-black rounded-xl transition-all ${
              activeTab === "YKS"
                ? "bg-[#1E3A8A] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            🎓 YKS Soru Dağılımı
          </button>
          <button
            onClick={() => setActiveTab("LGS")}
            className={`flex-1 py-3 text-center text-xs sm:text-sm font-black rounded-xl transition-all ${
              activeTab === "LGS"
                ? "bg-[#1E3A8A] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            🏫 LGS Soru Dağılımı
          </button>
        </div>

        {/* Distribution List */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-[#FAF8F5]">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{activeTab} Testleri</span>
            <span className="text-xs font-black text-[#B45309] bg-[#FAF0E3] px-3 py-1 rounded-xl">2027 Müfredatı</span>
          </div>

          <div className="divide-y divide-gray-100">
            {soruDagilimlari[activeTab].map((item, idx) => (
              <div key={idx} className="flex justify-between items-start py-4 first:pt-0 last:pb-0">
                <div className="pr-4">
                  <h3 className="font-black text-gray-800 text-sm sm:text-base">{item.ders}</h3>
                  <p className="text-xs text-gray-500 font-bold mt-1 leading-relaxed">{item.detay}</p>
                </div>
                <div className="flex-shrink-0 font-black text-[#B45309] bg-[#FAF0E3] px-3 py-1 rounded-xl text-xs sm:text-sm">
                  {item.soru} Soru
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-sm font-black text-blue-900">📚 Bu Konularda Eksiklerin mi Var?</p>
            <p className="text-xs text-blue-800 mt-1 font-bold">
              Türkiye'nin en seçkin öğretmen kadrosuyla hedeflerine en kısa yoldan ulaşabilirsin.
            </p>
          </div>
          <Link
            href="/hocalar"
            className="bg-[#1E3A8A] hover:bg-[#152a60] text-white text-xs font-black px-6 py-3 rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            Özel Ders Hocalarını İncele ➔
          </Link>
        </div>
      </div>
    </div>
  );
}
