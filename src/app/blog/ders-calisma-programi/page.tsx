"use client";
import { useState } from "react";
import { waLink } from "@/lib/utils";

interface ProgramGun {
  gun: string;
  seans1: string;
  seans2: string;
  odak: string;
}

export default function DersCalismaProgramiPage() {
  const [sinavTuru, setSinavTuru] = useState<"say" | "ea" | "soz" | "lgs">("say");
  const [calismaHacmi, setCalismaHacmi] = useState<"hafif" | "orta" | "yogun">("orta");
  const [generatedProgram, setGeneratedProgram] = useState<ProgramGun[] | null>(null);

  const generateProgram = () => {
    let program: ProgramGun[] = [];

    const seansSureleri = {
      hafif: "60 Dk",
      orta: "90 Dk",
      yogun: "120 Dk"
    };

    const sure = seansSureleri[calismaHacmi];

    if (sinavTuru === "say") {
      program = [
        { gun: "Pazartesi", seans1: `📐 Matematik (${sure}) — Problemler`, seans2: `⚡ Fizik (${sure}) — Hareket ve Kuvvet`, odak: "Temel tyt netlerini artırma odaklı tekrar" },
        { gun: "Salı", seans1: `🧪 Kimya (${sure}) — Mol Kavramı`, seans2: `📖 Türkçe (${sure}) — Paragraf & Anlam`, odak: "Süre yönetimi denemeleri" },
        { gun: "Çarşamba", seans1: `📐 Matematik (${sure}) — Trigonometri`, seans2: `🧬 Biyoloji (${sure}) — Hücre Bölünmeleri`, odak: "AYT sayısal konularına yoğunlaşma" },
        { gun: "Perşembe", seans1: `⚡ Fizik (${sure}) — Vektörler`, seans2: `📖 Türkçe (${sure}) — Dil Bilgisi`, odak: "Yanlış çözülen soru analizleri" },
        { gun: "Cuma", seans1: `📐 Matematik (${sure}) — Limit ve Süreklilik`, seans2: `🧪 Kimya (${sure}) — Gazlar`, odak: "AYT formül tekrarları" },
        { gun: "Cumartesi", seans1: `📝 TYT Deneme Sınavı (${seansSureleri[calismaHacmi] === "120 Dk" ? "165 Dk" : "135 Dk"})`, seans2: `🔍 Yanlış Soru Analizi (60 Dk)`, odak: "Gerçek sınav simülasyonu" },
        { gun: "Pazar", seans1: `🍿 Haftalık Dinlenme & Deşarj`, seans2: `📅 Gelecek Hafta Planlaması (30 Dk)`, odak: "Zihinsel toparlanma ve motivasyon" }
      ];
    } else if (sinavTuru === "ea") {
      program = [
        { gun: "Pazartesi", seans1: `📐 Matematik (${sure}) — Problemler`, seans2: `📚 Edebiyat (${sure}) — Divan Edebiyatı`, odak: "Temel edebiyat ezberleri ve matematik netleri" },
        { gun: "Salı", seans1: `🌍 Coğrafya (${sure}) — Harita Bilgisi`, seans2: `📖 Türkçe (${sure}) — Paragraf & Anlam`, odak: "TYT genel tekrar ve okuma pratikleri" },
        { gun: "Çarşamba", seans1: `📐 Matematik (${sure}) — Fonksiyonlar`, seans2: `⏳ Tarih (${sure}) — Osmanlı Tarihi`, odak: "AYT Eşit Ağırlık dengeli çalışma planı" },
        { gun: "Perşembe", seans1: `📚 Edebiyat (${sure}) — Tanzimat Dönemi`, seans2: `📖 Türkçe (${sure}) — Yazım Kuralları`, odak: "Eser-yazar bilgi kartları tekrarı" },
        { gun: "Cuma", seans1: `📐 Matematik (${sure}) — Logaritma`, seans2: `⏳ Tarih (${sure}) — Atatürk İlke ve İnkılapları`, odak: "Haftalık sözel konu soru çözümleri" },
        { gun: "Cumartesi", seans1: `📝 TYT Deneme Sınavı (${seansSureleri[calismaHacmi] === "120 Dk" ? "165 Dk" : "135 Dk"})`, seans2: `🔍 Yanlış Soru Analizi (60 Dk)`, odak: "Gerçek sınav simülasyonu" },
        { gun: "Pazar", seans1: `🍿 Haftalık Dinlenme & Deşarj`, seans2: `📅 Gelecek Hafta Planlaması (30 Dk)`, odak: "Zihinsel toparlanma ve motivasyon" }
      ];
    } else if (sinavTuru === "soz") {
      program = [
        { gun: "Pazartesi", seans1: `📚 Edebiyat (${sure}) — Halk Edebiyatı`, seans2: `⏳ Tarih (${sure}) — İslamiyet Öncesi Türk Tarihi`, odak: "Sözel ezberlerin mantığını oturtma" },
        { gun: "Salı", seans1: `🌍 Coğrafya (${sure}) — İklim Bilgisi`, seans2: `📖 Türkçe (${sure}) — Paragraf & Anlam`, odak: "Okuma hızı ve paragraf çözme teknikleri" },
        { gun: "Çarşamba", seans1: `📚 Edebiyat (${sure}) — Cumhuriyet Dönemi`, seans2: `📐 Temel Matematik (${sure}) — Sayılar`, odak: "Sözel sıralamada fark yaratan matematik netleri" },
        { gun: "Perşembe", seans1: `⏳ Tarih (${sure}) — Kurtuluş Savaşı`, seans2: `📖 Türkçe (${sure}) — Cümle Bilgisi`, odak: "Çıkmış soru çözümleri ve konu analizleri" },
        { gun: "Cuma", seans1: `📚 Edebiyat (${sure}) — Edebi Sanatlar`, seans2: `🌍 Coğrafya (${sure}) — Nüfus ve Yerleşme`, odak: "Hap bilgiler ve yazar-eser kartları çalışması" },
        { gun: "Cumartesi", seans1: `📝 TYT Deneme Sınavı (135 Dk)`, seans2: `🔍 Yanlış Soru Analizi (60 Dk)`, odak: "Süre yönetimi ve sınav kondisyonu" },
        { gun: "Pazar", seans1: `🍿 Haftalık Dinlenme & Deşarj`, seans2: `📅 Gelecek Hafta Planlaması (30 Dk)`, odak: "Zihinsel toparlanma ve motivasyon" }
      ];
    } else {
      // LGS
      program = [
        { gun: "Pazartesi", seans1: `🧮 LGS Matematik (${sure}) — Çarpanlar ve Katlar`, seans2: `📝 LGS Türkçe (${sure}) — Fiilimsiler`, odak: "Sayısal mantık ve paragraf analizi" },
        { gun: "Salı", seans1: `🔬 LGS Fen Bilimleri (${sure}) — Mevsimler & İklim`, seans2: `🇬🇧 İngilizce (${sure}) — Friendship`, odak: "Fen terimleri ve İngilizce kelime kartları" },
        { gun: "Çarşamba", seans1: `🧮 LGS Matematik (${sure}) — Üslü Sayılar`, seans2: `⏳ T.C. İnkılap Tarihi (${sure}) — Bir Kahraman Doğuyor`, odak: "LGS yeni nesil soru çözme pratiği" },
        { gun: "Perşembe", seans1: `🔬 LGS Fen Bilimleri (${sure}) — DNA ve Genetik Kod`, seans2: `📝 LGS Türkçe (${sure}) — Sözel Mantık`, odak: "Analitik düşünme soruları ve yanlış analizleri" },
        { gun: "Cuma", seans1: `🧮 LGS Matematik (${sure}) — Köklü İfadeler`, seans2: `🕌 Din Kültürü (${sure}) — Kader İnancı`, odak: "Matematik formül pratikleri" },
        { gun: "Cumartesi", seans1: `📝 LGS Deneme Sınavı (Sayısal + Sözel)`, seans2: `🔍 Hatalı Soru Çözümleri (45 Dk)`, odak: "Zaman yönetimi ve LGS sınav provası" },
        { gun: "Pazar", seans1: `🍿 Haftalık Dinlenme & Eğlence`, seans2: `📅 Gelecek Hafta Planlaması (20 Dk)`, odak: "Motivasyon ve dinlenme" }
      ];
    }

    setGeneratedProgram(program);
  };

  const getWaMessage = () => {
    const sinavLabel = {
      say: "YKS Sayısal",
      ea: "YKS Eşit Ağırlık",
      soz: "YKS Sözel",
      lgs: "LGS Lise Giriş"
    }[sinavTuru];

    const hacimLabel = {
      hafif: "Hafif (Haftalık 10-15 saat)",
      orta: "Orta (Haftalık 20-30 saat)",
      yogun: "Yoğun (Haftalık 35-45 saat)"
    }[calismaHacmi];

    return `Merhaba, platformdaki Ders Çalışma Programı Robotu üzerinden kendime özel ${sinavLabel} ve ${hacimLabel} programı oluşturdum. Bu programı bir derece hocası eşliğinde takip etmek ve özel ders teklifi almak istiyorum.`;
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 print:hidden">
          <span className="text-[#B45309] text-xs font-black uppercase tracking-widest">DİJİTAL REHBERLİK</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2 mb-3">Çalışma Programı Hazırlama Robotu</h1>
          <p className="text-gray-500 text-sm font-semibold max-w-xl mx-auto leading-relaxed">
            Hedef alanınızı ve haftalık çalışmak istediğiniz yoğunluğu seçin, ÖSYM ve MEB müfredatına en uyumlu ders çalışma takviminizi anında oluşturun.
          </p>
        </div>

        {/* Wizard Panel */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-md space-y-6 mb-8 print:hidden">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Sinav Turu */}
            <div>
              <label className="block text-xs font-black text-[#1E3A8A] uppercase tracking-wider mb-3">
                Çalışma Alanınız / Sınavınız
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "say", label: "📐 YKS Sayısal" },
                  { id: "ea", label: "⚖️ YKS Eşit Ağırlık" },
                  { id: "soz", label: "📚 YKS Sözel" },
                  { id: "lgs", label: "🎒 LGS (Lise Giriş)" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSinavTuru(item.id as any);
                      setGeneratedProgram(null);
                    }}
                    className={`py-3 px-3 text-center text-xs font-black rounded-xl border transition-all ${
                      sinavTuru === item.id
                        ? "bg-[#1E3A8A] text-white border-[#1E3A8A]"
                        : "bg-[#FAF8F5] text-gray-600 border-[#EFECE6] hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calisma Hacmi */}
            <div>
              <label className="block text-xs font-black text-[#1E3A8A] uppercase tracking-wider mb-3">
                Haftalık Çalışma Yoğunluğunuz
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "hafif", label: "🟢 Hafif" },
                  { id: "orta", label: "🟡 Orta" },
                  { id: "yogun", label: "🔴 Yoğun" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCalismaHacmi(item.id as any);
                      setGeneratedProgram(null);
                    }}
                    className={`py-3 px-2 text-center text-xs font-black rounded-xl border transition-all ${
                      calismaHacmi === item.id
                        ? "bg-[#1E3A8A] text-white border-[#1E3A8A]"
                        : "bg-[#FAF8F5] text-gray-600 border-[#EFECE6] hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={generateProgram}
            className="w-full bg-[#B45309] hover:bg-[#92400E] text-white font-black py-4 rounded-2xl transition-all shadow-md active:scale-95 text-sm relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_3s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent"
          >
            Haftalık Programımı Oluştur ➔
          </button>
        </div>

        {/* Generated Program Panel */}
        {generatedProgram && (
          <div className="space-y-6 animate-fade-in print:space-y-4">
            <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col space-y-6 print:border-none print:shadow-none print:p-0">
              <div className="flex justify-between items-center pb-4 border-b border-[#FAF8F5] print:pb-2">
                <div>
                  <span className="text-[10px] font-black text-[#B45309] bg-[#FAF0E3] px-2.5 py-1 rounded-xl uppercase tracking-wider print:hidden">
                    KİŞİYE ÖZEL ÇALIŞMA PLANI
                  </span>
                  <h2 className="text-xl font-black text-[#1E3A8A] mt-2">
                    {sinavTuru.toUpperCase()} — {calismaHacmi.toUpperCase()} Haftalık Ders Programı
                  </h2>
                </div>
                <button
                  onClick={() => window.print()}
                  className="bg-[#FAF8F5] hover:bg-gray-100 border border-[#EFECE6] text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all print:hidden"
                >
                  🖨️ Yazdır / PDF Kaydet
                </button>
              </div>

              {/* Grid Calendar */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-2 print:gap-2">
                {generatedProgram.map((item) => (
                  <div
                    key={item.gun}
                    className="bg-[#FAF8F5]/80 border border-[#EFECE6] rounded-2xl p-4 space-y-2.5 print:bg-white"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200/50">
                      <span className="text-xs font-black text-[#1E3A8A]">{item.gun}</span>
                    </div>
                    <div className="space-y-2 text-xs font-bold text-gray-700">
                      <p className="flex items-center gap-1.5">
                        <span className="text-blue-500">▪</span> {item.seans1}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <span className="text-amber-500">▪</span> {item.seans2}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-dashed border-gray-250 text-[10px] text-gray-400 font-semibold leading-relaxed">
                      💡 {item.odak}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 print:hidden">
              <div className="text-center sm:text-left">
                <h3 className="text-sm font-black text-blue-900">🎯 Bu Programı Derece Hocası Eşliğinde Uygula!</h3>
                <p className="text-xs text-blue-800 mt-1 font-bold">
                  Sana özel konu anlatımı, yanlış analizi ve haftalık program takibiyle hedefine kesin adımlarla ilerle.
                </p>
              </div>
              <a
                href={waLink(getWaMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1E3A8A] hover:bg-[#152a60] text-white text-xs font-black px-6 py-3.5 rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap"
              >
                Hoca İle Takip Planla ➔
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
