"use client";
import { useState } from "react";
import Link from "next/link";
import { tercihRobotuSorgula, hesaplaYksPuan, hesaplaLgsPuan } from "@/data/tercih_helper";
import { waLink } from "@/lib/utils";

export default function TercihRobotuPage() {
  const [mode, setMode] = useState<"yks" | "lgs">("yks");
  
  // YKS Inputs
  const [tytNet, setTytNet] = useState<number>(75);
  const [aytNet, setAytNet] = useState<number>(45);

  // LGS Inputs
  const [lgsNet, setLgsNet] = useState<number>(65);

  // Sorgu Sonuçları
  const sonuclar = tercihRobotuSorgula(tytNet, aytNet, lgsNet, mode);

  const tahminiPuan = mode === "yks" ? hesaplaYksPuan(tytNet, aytNet) : hesaplaLgsPuan(lgsNet * 0.55, lgsNet * 0.45);

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#B45309] text-xs font-black uppercase tracking-widest">YÖK ATLAS & ÖSYM UYUMLU</span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1E3A8A] mt-2 mb-4">Netine Göre Tercih Robotu</h1>
          <p className="text-gray-600 text-sm font-semibold max-w-xl mx-auto leading-relaxed">
            Mevcut netlerinizi girin, en güncel taban puanı verilerine göre kazanabileceğiniz popüler üniversite programlarını ve liseleri anında listeleyin.
          </p>
        </div>

        {/* Seçim Butonları (YKS / LGS) */}
        <div className="flex justify-center gap-3 mb-10">
          <button
            onClick={() => setMode("yks")}
            className={`px-8 py-3 rounded-2xl text-sm font-black transition-all ${
              mode === "yks"
                ? "bg-[#1E3A8A] text-white shadow-md shadow-blue-900/10"
                : "bg-white border border-[#EFECE6] text-gray-600 hover:border-gray-300"
            }`}
          >
            🎓 YKS Tercih Robotu
          </button>
          <button
            onClick={() => setMode("lgs")}
            className={`px-8 py-3 rounded-2xl text-sm font-black transition-all ${
              mode === "lgs"
                ? "bg-[#1E3A8A] text-white shadow-md shadow-blue-900/10"
                : "bg-white border border-[#EFECE6] text-gray-600 hover:border-gray-300"
            }`}
          >
            🏫 LGS Tercih Robotu
          </button>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Giriş Alanı */}
          <div className="md:col-span-2 bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-sm h-fit">
            <h2 className="text-lg font-black text-[#1E3A8A] mb-6">Net Bilgilerinizi Girin</h2>

            {mode === "yks" ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase mb-2">
                    TYT Neti ({tytNet} Net)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    value={tytNet}
                    onChange={(e) => setTytNet(Number(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#B45309]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1.5">
                    <span>0 Net</span>
                    <span>120 Net</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase mb-2">
                    AYT Neti ({aytNet} Net)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={aytNet}
                    onChange={(e) => setAytNet(Number(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#B45309]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1.5">
                    <span>0 Net</span>
                    <span>80 Net</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase mb-2">
                  LGS Toplam Net ({lgsNet} Net)
                </label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={lgsNet}
                  onChange={(e) => setLgsNet(Number(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#B45309]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1.5">
                  <span>0 Net</span>
                  <span>90 Net</span>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-[#FAF8F5] text-center">
              <span className="text-xs font-bold text-gray-400 uppercase">Tahmini Yerleştirme Puanı</span>
              <p className="text-3xl font-black text-[#B45309] mt-2">{tahminiPuan} Puan</p>
            </div>
          </div>

          {/* Sonuç Alanı */}
          <div className="md:col-span-3 space-y-4">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-lg font-black text-[#1E3A8A]">Girebileceğin En Popüler Kurumlar</h2>
              <span className="text-xs font-bold text-gray-400 bg-white border border-[#EFECE6] px-3 py-1 rounded-xl">
                Kazanma Şansı
              </span>
            </div>

            <div className="space-y-4">
              {sonuclar.map((item: any, idx: number) => {
                const isLgs = "ad" in item;
                const ad = isLgs ? item.ad : `${item.uni} - ${item.program}`;
                const konum = isLgs ? item.sehir : `${item.sehir} | ${item.tur}`;
                const hedef = item.hedefPuan;

                return (
                  <div
                    key={idx}
                    className="bg-white border border-[#EFECE6] hover:border-[#F5D0A9] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <h3 className="font-black text-[#1E3A8A] text-sm sm:text-base truncate">{ad}</h3>
                      <p className="text-xs text-gray-500 font-semibold mt-1">📍 {konum}</p>
                      <p className="text-[10px] text-gray-450 font-bold mt-2">Taban Puanı: <span className="text-gray-700 font-black">{hedef}</span></p>
                    </div>

                    <div className="flex flex-col items-end flex-shrink-0">
                      <span
                        className={`text-xs font-black px-3.5 py-1.5 rounded-xl border ${
                          item.sans >= 70
                            ? "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]"
                            : item.sans >= 40
                            ? "bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]"
                            : "bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]"
                        }`}
                      >
                        %{item.sans} İhtimal
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dönüşüm / Call To Action */}
            <div className="bg-[#FAF0E3]/70 border border-[#F5D0A9]/60 rounded-3xl p-6 text-center mt-6">
              <h3 className="text-base font-black text-[#B45309]">🎯 İstediğin Bölümün/Lisenin Kazanma İhtimalini %100 Yap!</h3>
              <p className="text-xs text-[#B45309]/80 font-bold mt-2 max-w-lg mx-auto">
                Haftalık düzenli takip, eksik analizi ve nokta atışı soru çözümleriyle netlerini hızla yükselt.
              </p>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 bg-[#B45309] hover:bg-[#92400E] text-white font-black px-8 py-3.5 rounded-xl text-sm transition-all"
              >
                Hemen WhatsApp'tan Destek Al
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
