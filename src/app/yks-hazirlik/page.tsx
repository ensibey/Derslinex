"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { blogYazilari } from "@/data/blog";
import { dersAlanlari } from "@/data/dersler";
import { waLink } from "@/lib/utils";

export default function YksHazirlikPage() {
  const [activeTool, setActiveTool] = useState<"countdown" | "calculator" | "checklist" | null>("countdown");

  // Geri Sayım State ve Mantığı (Örn: 20 Haziran 2026)
  const [timeLeft, setTimeLeft] = useState({ gun: 0, saat: 0, dakika: 0 });
  useEffect(() => {
    const targetDate = new Date("June 20, 2026 10:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference < 0) {
        clearInterval(interval);
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft({ gun: d, saat: h, dakika: m });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Puan Hesaplama State ve Mantığı
  const [nets, setNets] = useState({ tytMat: 0, tytTur: 0, tytSos: 0, tytFen: 0, obp: 50 });
  const [scores, setScores] = useState({ tytScore: 150, sayScore: 150 });
  const calculateScores = () => {
    // Basit, tahmini YKS puan hesaplama formülü
    const baseScore = 100;
    const tytMatNet = Math.min(40, Math.max(0, nets.tytMat));
    const tytTurNet = Math.min(40, Math.max(0, nets.tytTur));
    const tytSosNet = Math.min(20, Math.max(0, nets.tytSos));
    const tytFenNet = Math.min(20, Math.max(0, nets.tytFen));

    const totalTytNet = (tytMatNet * 3.3) + (tytTurNet * 3.3) + (tytSosNet * 3.4) + (tytFenNet * 3.4);
    const obpContribution = Math.min(100, Math.max(50, nets.obp)) * 0.6;

    const tyt = Math.round(baseScore + totalTytNet + obpContribution);
    const say = Math.round(baseScore + (totalTytNet * 0.4) + (tytMatNet * 3) + obpContribution);

    setScores({ tytScore: tyt, sayScore: say });
  };

  // Konu Kontrol Listesi
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    "Temel Kavramlar": true,
    "Sözcükte Anlam": false,
    "Paragrafta Yapı": false,
    "Fonksiyonlar": false,
    "Vektörler": false,
  });
  const toggleItem = (name: string) => {
    setChecklist((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-14">
        <span className="text-primary-500 text-xs font-bold uppercase tracking-widest">KÜTÜPHANE & ARAÇLAR</span>
        <h1 className="text-4xl sm:text-5xl font-black mb-4 mt-2 bg-gradient-to-r from-primary-600 to-indigo-650 bg-clip-text text-transparent">YKS Hazırlık Merkezi</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Sınav yolculuğunuzda ihtiyacınız olan tüm interaktif planlama, puan hesaplama ve analiz araçları tek bir yerde.
        </p>
      </div>

      {/* Hızlı Araçlar Navigasyonu */}
      <section className="mb-12">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Hızlı Araçlar</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { id: "countdown", emoji: "⏰", title: "Sınava Geri Sayım", desc: "YKS 2026'ya kalan süre" },
            { id: "calculator", emoji: "🧮", title: "Puan Hesaplama", desc: "Net sayılarına göre tahmini puan" },
            { id: "checklist", emoji: "📋", title: "Konu Kontrol Listesi", desc: "Hangi konuları bitirdiğini takip et" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id as any)}
              className={`flex items-start text-left gap-4 border rounded-3xl p-6 transition-all duration-300 ${activeTool === t.id ? "bg-primary-600 text-white border-primary-600 shadow-premium -translate-y-1" : "bg-white text-gray-900 border-gray-100 shadow-sm hover:shadow-md"}`}
            >
              <span className="text-3xl">{t.emoji}</span>
              <div>
                <p className="font-bold text-base sm:text-lg">{t.title}</p>
                <p className={`text-xs mt-1 ${activeTool === t.id ? "text-primary-100" : "text-gray-500"}`}>{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* İnteraktif Araç Gösterim Alanı */}
      <section className="mb-16 bg-white border border-gray-100 rounded-3xl p-8 shadow-premium">
        {activeTool === "countdown" && (
          <div className="text-center py-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">🗓️ YKS 2026 Geri Sayım Sayacı</h3>
            <div className="flex justify-center gap-4 sm:gap-8">
              {[
                { label: "Gün", value: timeLeft.gun },
                { label: "Saat", value: timeLeft.saat },
                { label: "Dakika", value: timeLeft.dakika },
              ].map((item) => (
                <div key={item.label} className="bg-primary-50 rounded-2xl p-4 sm:p-6 w-24 sm:w-32 flex flex-col items-center">
                  <span className="text-3xl sm:text-5xl font-black text-primary-600">{item.value}</span>
                  <span className="text-xs sm:text-sm text-gray-500 font-semibold mt-2">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTool === "calculator" && (
          <div>
            <h3 className="text-xl font-bold text-gray-850 mb-6 text-center">🧮 TYT Tahmini Puan Hesaplama</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">TYT Matematik Neti</label>
                    <input type="number" value={nets.tytMat} onChange={(e) => setNets({ ...nets, tytMat: Number(e.target.value) })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">TYT Türkçe Neti</label>
                    <input type="number" value={nets.tytTur} onChange={(e) => setNets({ ...nets, tytTur: Number(e.target.value) })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">TYT Sosyal Neti</label>
                    <input type="number" value={nets.tytSos} onChange={(e) => setNets({ ...nets, tytSos: Number(e.target.value) })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">TYT Fen Neti</label>
                    <input type="number" value={nets.tytFen} onChange={(e) => setNets({ ...nets, tytFen: Number(e.target.value) })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Diploma Notu (OBP) [50 - 100]</label>
                  <input type="number" value={nets.obp} onChange={(e) => setNets({ ...nets, obp: Number(e.target.value) })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400" />
                </div>
                <button onClick={calculateScores} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors">Hesapla</button>
              </div>
              <div className="bg-primary-50/50 rounded-3xl p-6 flex flex-col justify-center items-center text-center">
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4">Hesaplanan Sonuçlar</span>
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-black text-primary-600">{scores.tytScore}</div>
                    <div className="text-xs text-gray-400 font-medium">TYT Tahmini Puan</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-violet-600">{scores.sayScore}</div>
                    <div className="text-xs text-gray-400 font-medium">Sayısal Tahmini Puan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTool === "checklist" && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">📋 YKS Müfredatı Konu Takibi</h3>
            <div className="max-w-md mx-auto space-y-3">
              {Object.keys(checklist).map((name) => (
                <button
                  key={name}
                  onClick={() => toggleItem(name)}
                  className={`flex items-center justify-between w-full p-4 border rounded-2xl text-left transition-all ${checklist[name] ? "bg-emerald-50/30 border-emerald-100 text-emerald-800" : "bg-white border-gray-150 text-gray-700 hover:bg-gray-50"}`}
                >
                  <span className="font-semibold text-sm">{name}</span>
                  <span className="text-lg">{checklist[name] ? "✅ Completed" : "⬜ Study"}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Sınav Türleri */}
      <section className="mb-16">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Sınav Türleri</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { tur: "TYT", renk: "from-primary-600 via-primary-700 to-indigo-800", aciklama: "135 dakika, 120 soru. Türkçe, Sosyal, Matematik, Fen alanlarından oluşur. Tüm puan türlerinin temeli.", dersler: "Türkçe, Matematik, Fen Bilimleri, Sosyal Bilimler" },
            { tur: "AYT Sayısal", renk: "from-violet-600 via-violet-700 to-primary-800", aciklama: "180 dakika, 80 soru. Matematik, Fizik, Kimya ve Biyoloji soruları.", dersler: "Matematik, Fizik, Kimya, Biyoloji" },
            { tur: "AYT Sözel", renk: "from-rose-600 to-rose-500", aciklama: "180 dakika, 80 soru. Edebiyat, Tarih, Coğrafya, Felsefe grup soruları.", dersler: "Edebiyat, Tarih 1-2, Coğrafya 1-2, Felsefe" },
            { tur: "AYT Eşit Ağırlık", renk: "from-amber-600 to-amber-500", aciklama: "Matematik ve Türkçe-Sosyal derslerinin birleşimi. EA bölümleri için.", dersler: "Matematik, Edebiyat, Tarih 1, Coğrafya 1" },
            { tur: "AYT Dil", renk: "from-emerald-600 to-emerald-500", aciklama: "80 soru. İngilizce, Almanca, Fransızca gibi yabancı dil seçenekleri.", dersler: "İngilizce / YDT" },
          ].map((s) => (
            <div key={s.tur} className={`bg-gradient-to-br ${s.renk} rounded-3xl p-8 text-white shadow-premium hover:shadow-2xl transition-all duration-300`}>
              <h3 className="text-xl font-black mb-3">{s.tur}</h3>
              <p className="text-white/85 text-xs mb-6 leading-relaxed">{s.aciklama}</p>
              <span className="text-[10px] font-bold bg-white/20 rounded-lg px-3 py-1.5 backdrop-blur-sm inline-block tracking-wide">{s.dersler}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Ders Alanları */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Ders Alanına Göre Hazırlık</h2>
          <Link href="/dersler" className="text-primary-600 font-semibold hover:underline text-sm">Tümü →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {dersAlanlari.slice(0, 8).map((d) => (
            <Link key={d.id} href={`/dersler/${d.slug}`}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:border-primary-300 hover:shadow-sm px-4 py-3 rounded-xl text-sm font-medium transition-all">
              <span>{d.emoji}</span> {d.isim}
            </Link>
          ))}
        </div>
      </section>

      {/* Son Blog Yazıları */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Güncel Rehberler</h2>
          <Link href="/blog" className="text-primary-600 font-semibold hover:underline text-sm">Tüm Yazılar →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogYazilari.slice(0, 3).map((b) => (
            <Link key={b.id} href={`/blog/${b.slug}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
              <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{b.kategori}</span>
              <h3 className="font-bold text-gray-900 mt-3 leading-snug line-clamp-2">{b.baslik}</h3>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{b.ozet}</p>
              <p className="text-xs text-gray-400 mt-3">{b.okumaSuresi} dk okuma</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
