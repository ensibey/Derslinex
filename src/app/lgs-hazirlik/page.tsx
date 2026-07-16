"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { waLink } from "@/lib/utils";

export default function LgsHazirlikPage() {
  const [activeTool, setActiveTool] = useState<"countdown" | "calculator" | null>("countdown");

  // Geri Sayım State ve Mantığı (Örn: LGS Haziran 2026)
  const [timeLeft, setTimeLeft] = useState({ gun: 0, saat: 0, dakika: 0 });
  useEffect(() => {
    const targetDate = new Date("June 07, 2026 09:30:00").getTime();
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

  // LGS Puan Hesaplama State ve Mantığı
  const [nets, setNets] = useState({ mat: 0, tur: 0, fen: 0, ink: 0, din: 0, ing: 0 });
  const [score, setScore] = useState(100);

  const calculateScore = () => {
    // Standart LGS Katsayıları:
    // Türkçe: 4, Matematik: 4, Fen Bilimleri: 4
    // İnkılap Tarihi: 1, Din Kültürü: 1, Yabancı Dil: 1
    // Taban puan: 100, Maks puan: 500
    const tNet = Math.min(20, Math.max(0, nets.tur));
    const mNet = Math.min(20, Math.max(0, nets.mat));
    const fNet = Math.min(20, Math.max(0, nets.fen));
    const iNet = Math.min(10, Math.max(0, nets.ink));
    const dNet = Math.min(10, Math.max(0, nets.din));
    const yNet = Math.min(10, Math.max(0, nets.ing));

    // LGS Katsayı Formülü Yaklaşık Değer
    const calculated = 100 + (tNet * 4.3) + (mNet * 4.5) + (fNet * 4.1) + (iNet * 1.6) + (dNet * 1.5) + (yNet * 1.6);
    setScore(Math.min(500, Math.round(calculated)));
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-14">
          <span className="text-[#D97706] text-xs font-black uppercase tracking-widest">KÜTÜPHANE & ARAÇLAR</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 mt-2 text-[#1E3A8A]">LGS Hazırlık Merkezi</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-medium">
            Liselere Geçiş Sistemi (LGS) yolculuğunda hedefinize ulaşmanız için özel hazırladığımız araçlar.
          </p>
        </div>

        {/* Hızlı Araçlar Navigasyonu */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-[#1E3A8A] mb-6">Hızlı Araçlar</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { id: "countdown", emoji: "⏰", title: "Sınava Geri Sayım", desc: "LGS 2026'ya kalan süre" },
              { id: "calculator", emoji: "🧮", title: "LGS Puan Hesaplama", desc: "LGS ders netlerine göre tahmini puan" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id as any)}
                className={`flex items-start text-left gap-4 border rounded-3xl p-6 transition-all duration-300 ${activeTool === t.id ? "bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-md -translate-y-1" : "bg-white text-gray-700 border-[#EFECE6] shadow-sm hover:shadow-md"}`}
              >
                <span className="text-3xl">{t.emoji}</span>
                <div>
                  <p className={`font-bold text-base sm:text-lg ${activeTool === t.id ? "text-white" : "text-[#1E3A8A]"}`}>{t.title}</p>
                  <p className={`text-xs mt-1 ${activeTool === t.id ? "text-amber-100" : "text-gray-500"}`}>{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* İnteraktif Araç Gösterim Alanı */}
        <section className="mb-16 bg-white border border-[#EFECE6] rounded-3xl p-8 shadow-sm">
          {activeTool === "countdown" && (
            <div className="text-center py-6">
              <h3 className="text-xl font-bold text-[#1E3A8A] mb-6">🗓️ LGS 2026 Geri Sayım Sayacı</h3>
              <div className="flex justify-center gap-4 sm:gap-8">
                {[
                  { label: "Gün", value: timeLeft.gun },
                  { label: "Saat", value: timeLeft.saat },
                  { label: "Dakika", value: timeLeft.dakika },
                ].map((item) => (
                  <div key={item.label} className="bg-[#FAF0E3] border border-[#F5D0A9] rounded-2xl p-4 sm:p-6 w-24 sm:w-32 flex flex-col items-center">
                    <span className="text-3xl sm:text-5xl font-black text-[#D97706]">{item.value}</span>
                    <span className="text-xs sm:text-sm text-gray-600 font-bold mt-2">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTool === "calculator" && (
            <div className="py-4">
              <h3 className="text-xl font-bold text-[#1E3A8A] mb-6 text-center">🧮 LGS Puan Hesaplama Aracı</h3>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  {[
                    { key: "tur", label: "Türkçe Neti (Max: 20)", max: 20 },
                    { key: "mat", label: "Matematik Neti (Max: 20)", max: 20 },
                    { key: "fen", label: "Fen Bilimleri Neti (Max: 20)", max: 20 },
                    { key: "ink", label: "İnkılap Tarihi Neti (Max: 10)", max: 10 },
                    { key: "din", label: "Din Kültürü Neti (Max: 10)", max: 10 },
                    { key: "ing", label: "Yabancı Dil Neti (Max: 10)", max: 10 },
                  ].map((d) => (
                    <div key={d.key} className="flex justify-between items-center gap-4">
                      <label className="text-xs font-bold text-gray-700">{d.label}</label>
                      <input
                        type="number"
                        min={0}
                        max={d.max}
                        value={(nets as any)[d.key] || 0}
                        onChange={(e) => {
                          const val = Math.min(d.max, Math.max(0, parseFloat(e.target.value) || 0));
                          setNets({ ...nets, [d.key]: val });
                        }}
                        className="w-20 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-3 py-2 text-sm text-right focus:border-[#D97706] outline-none font-bold text-[#1E3A8A]"
                      />
                    </div>
                  ))}
                  <button
                    onClick={calculateScore}
                    className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-black py-3 rounded-xl transition-all shadow-sm mt-4"
                  >
                    Puanı Hesapla
                  </button>
                </div>

                <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl p-6 text-center">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">TAHMİNİ LGS PUANI</p>
                  <p className="text-5xl font-black text-[#1E3A8A]">{score}</p>
                  <p className="text-xs text-gray-500 mt-4 leading-relaxed font-semibold">
                    * Hesaplamalar yaklaşık LGS katsayıları üzerinden yapılmaktadır. Gerçek sınavda standart sapmaya göre değişiklik gösterebilir.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* LGS Danışmanlık Bilgisi */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-[#1E3A8A] mb-3">LGS'ye Uzmanlarla Hazırlanın</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-6 text-sm font-semibold">
            LGS sınavında fen liseleri ve nitelikli okulları hedefleyen öğrencilerimiz için özel LGS koçlarımız mevcuttur.
          </p>
          <a
            href={waLink("Merhaba, LGS özel ders ve LGS hazırlık koçluğu hakkında bilgi almak istiyorum.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white font-black px-8 py-3.5 rounded-xl transition-all shadow-sm"
          >
            LGS Bilgisi Alın
          </a>
        </div>
      </div>
    </div>
  );
}
