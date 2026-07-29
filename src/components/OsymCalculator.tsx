"use client";

import React, { useState } from "react";

export function OsymCalculator() {
  const [examType, setExamType] = useState<"YKS" | "LGS">("YKS");
  const [obp, setObp] = useState<string>("85");

  // YKS Nets
  const [tytTurkce, setTytTurkce] = useState("30");
  const [tytSosyal, setTytSosyal] = useState("15");
  const [tytMat, setTytMat] = useState("25");
  const [tytFen, setTytFen] = useState("12");

  const [aytMat, setAytMat] = useState("20");
  const [aytFizik, setAytFizik] = useState("8");
  const [aytKimya, setAytKimya] = useState("7");
  const [aytBiyoloji, setAytBiyoloji] = useState("6");
  const [aytEdebiyat, setAytEdebiyat] = useState("18");
  const [aytTarih1, setAytTarih1] = useState("6");
  const [aytCografya1, setAytCografya1] = useState("4");

  // LGS Nets
  const [lgsTurkce, setLgsTurkce] = useState("18");
  const [lgsMat, setLgsMat] = useState("15");
  const [lgsFen, setLgsFen] = useState("16");
  const [lgsInkilap, setLgsInkilap] = useState("10");
  const [lgsDin, setLgsDin] = useState("10");
  const [lgsIngilizce, setLgsIngilizce] = useState("9");

  // Calculations
  const obpVal = parseFloat(obp || "0");
  const obpEkPuan = obpVal * 0.6; // ÖSYM OBP ek puanı = OBP * 0.6

  // TYT Net & Score
  const totalTytNet =
    parseFloat(tytTurkce || "0") +
    parseFloat(tytSosyal || "0") +
    parseFloat(tytMat || "0") +
    parseFloat(tytFen || "0");
  const tytRawScore = 100 + totalTytNet * 3.3;
  const tytYerlestirmePuan = Math.min(500, tytRawScore + obpEkPuan);

  // AYT Sayısal
  const aytSayNet =
    parseFloat(aytMat || "0") +
    parseFloat(aytFizik || "0") +
    parseFloat(aytKimya || "0") +
    parseFloat(aytBiyoloji || "0");
  const aytSayRawScore = 100 + (totalTytNet * 1.3 + aytSayNet * 3.0);
  const aytSayYerlestirme = Math.min(500, aytSayRawScore + obpEkPuan);

  // AYT Eşit Ağırlık
  const aytEaNet =
    parseFloat(aytMat || "0") +
    parseFloat(aytEdebiyat || "0") +
    parseFloat(aytTarih1 || "0") +
    parseFloat(aytCografya1 || "0");
  const aytEaRawScore = 100 + (totalTytNet * 1.3 + aytEaNet * 3.1);
  const aytEaYerlestirme = Math.min(500, aytEaRawScore + obpEkPuan);

  // Estimated Rankings
  const getSayRank = (score: number) => {
    if (score >= 480) return "1.200 — 3.500";
    if (score >= 440) return "10.000 — 22.000";
    if (score >= 380) return "45.000 — 75.000";
    if (score >= 300) return "120.000 — 190.000";
    return "250.000+";
  };

  const getEaRank = (score: number) => {
    if (score >= 450) return "800 — 2.400";
    if (score >= 400) return "8.500 — 18.000";
    if (score >= 340) return "40.000 — 68.000";
    if (score >= 280) return "110.000 — 180.000";
    return "220.000+";
  };

  // LGS Calculation
  const totalLgsNet =
    parseFloat(lgsTurkce || "0") +
    parseFloat(lgsMat || "0") +
    parseFloat(lgsFen || "0") +
    parseFloat(lgsInkilap || "0") +
    parseFloat(lgsDin || "0") +
    parseFloat(lgsIngilizce || "0");
  const lgsScore = Math.min(
    500,
    100 +
      parseFloat(lgsTurkce || "0") * 4.3 +
      parseFloat(lgsMat || "0") * 4.3 +
      parseFloat(lgsFen || "0") * 4.1 +
      parseFloat(lgsInkilap || "0") * 1.6 +
      parseFloat(lgsDin || "0") * 1.6 +
      parseFloat(lgsIngilizce || "0") * 1.6
  );

  const getLgsYuzdelik = (score: number) => {
    if (score >= 480) return "%0.15 — %0.8";
    if (score >= 440) return "%1.2 — %3.5";
    if (score >= 400) return "%4.5 — %9.0";
    if (score >= 350) return "%12.0 — %22.0";
    return "%30.0+";
  };

  return (
    <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl">
            🧮
          </div>
          <div>
            <h3 className="font-black text-white text-base">ÖSYM YKS / LGS Puan & Sıralama Simülatörü</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Netlerinize göre resmi ÖSYM katsayıları ile tahmini yerleştirme puanı ve sıralamanız
            </p>
          </div>
        </div>

        <div className="flex p-1 bg-[#0D1B35] rounded-xl border border-white/5">
          <button
            onClick={() => setExamType("YKS")}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition ${
              examType === "YKS" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            🎓 YKS (TYT/AYT)
          </button>
          <button
            onClick={() => setExamType("LGS")}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition ${
              examType === "LGS" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            🎒 LGS (Lise Giriş)
          </button>
        </div>
      </div>

      {examType === "YKS" ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* TYT & OBP Inputs */}
          <div className="space-y-4 bg-[#0D1B35] p-5 rounded-2xl border border-white/5">
            <h4 className="font-black text-white text-sm flex items-center gap-2">
              <span>📘</span> TYT Netleriniz & OBP
            </h4>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">
                Diploma Notu (OBP: 50 – 100)
              </label>
              <input
                type="number"
                value={obp}
                onChange={(e) => setObp(e.target.value)}
                className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-black"
              />
              <span className="text-[9px] text-indigo-400 font-bold block mt-1">
                Ek OBP Puanı: +{obpEkPuan.toFixed(1)} Puan
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Türkçe (40S)</label>
                <input
                  type="number"
                  value={tytTurkce}
                  onChange={(e) => setTytTurkce(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Sosyal (20S)</label>
                <input
                  type="number"
                  value={tytSosyal}
                  onChange={(e) => setTytSosyal(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Matematik (40S)</label>
                <input
                  type="number"
                  value={tytMat}
                  onChange={(e) => setTytMat(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Fen (20S)</label>
                <input
                  type="number"
                  value={tytFen}
                  onChange={(e) => setTytFen(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl">
              <span className="text-[10px] font-black text-indigo-300 uppercase block">TYT TOPLAM NET</span>
              <span className="text-xl font-black text-white tabular-nums">{totalTytNet.toFixed(1)} Net</span>
            </div>
          </div>

          {/* AYT Inputs */}
          <div className="space-y-4 bg-[#0D1B35] p-5 rounded-2xl border border-white/5">
            <h4 className="font-black text-white text-sm flex items-center gap-2">
              <span>📗</span> AYT Netleriniz
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">AYT Mat (40S)</label>
                <input
                  type="number"
                  value={aytMat}
                  onChange={(e) => setAytMat(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Fizik (14S)</label>
                <input
                  type="number"
                  value={aytFizik}
                  onChange={(e) => setAytFizik(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Kimya (13S)</label>
                <input
                  type="number"
                  value={aytKimya}
                  onChange={(e) => setAytKimya(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Biyoloji (13S)</label>
                <input
                  type="number"
                  value={aytBiyoloji}
                  onChange={(e) => setAytBiyoloji(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Edebiyat (24S)</label>
                <input
                  type="number"
                  value={aytEdebiyat}
                  onChange={(e) => setAytEdebiyat(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Tarih-1 (10S)</label>
                <input
                  type="number"
                  value={aytTarih1}
                  onChange={(e) => setAytTarih1(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="space-y-4 bg-gradient-to-br from-indigo-950/60 via-[#0D1B35] to-[#1E293B] p-5 rounded-2xl border border-indigo-500/30 shadow-xl flex flex-col justify-between">
            <div>
              <h4 className="font-black text-white text-sm flex items-center gap-2 mb-4">
                <span>🏆</span> Tahmini ÖSYM Sonuçlarınız
              </h4>

              <div className="space-y-3">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-[10px] font-black text-slate-400 uppercase block">TYT Yerleştirme Puanı</span>
                  <span className="text-lg font-black text-indigo-300 tabular-nums">{tytYerlestirmePuan.toFixed(1)} Puan</span>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <span className="text-[10px] font-black text-blue-300 uppercase block">AYT Sayısal Puanı & Sıralama</span>
                  <span className="text-xl font-black text-white tabular-nums">{aytSayYerlestirme.toFixed(1)} Puan</span>
                  <span className="text-xs font-bold text-emerald-400 block mt-1">
                    📍 Tahmini Türkiye Sıralaması: {getSayRank(aytSayYerlestirme)}
                  </span>
                </div>

                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <span className="text-[10px] font-black text-purple-300 uppercase block">AYT Eşit Ağırlık Puanı & Sıralama</span>
                  <span className="text-xl font-black text-white tabular-nums">{aytEaYerlestirme.toFixed(1)} Puan</span>
                  <span className="text-xs font-bold text-amber-400 block mt-1">
                    📍 Tahmini Türkiye Sıralaması: {getEaRank(aytEaYerlestirme)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-slate-400 font-semibold text-center">
              * Katsayılar en güncel ÖSYM kılavuz standartlarına göre hesaplanmaktadır.
            </div>
          </div>
        </div>
      ) : (
        /* LGS Simulator */
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4 bg-[#0D1B35] p-5 rounded-2xl border border-white/5">
            <h4 className="font-black text-white text-sm flex items-center gap-2">
              <span>🎒</span> LGS Ders Netleriniz
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Türkçe (20S)</label>
                <input
                  type="number"
                  value={lgsTurkce}
                  onChange={(e) => setLgsTurkce(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Matematik (20S)</label>
                <input
                  type="number"
                  value={lgsMat}
                  onChange={(e) => setLgsMat(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Fen Bilimleri (20S)</label>
                <input
                  type="number"
                  value={lgsFen}
                  onChange={(e) => setLgsFen(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">İnkılap (10S)</label>
                <input
                  type="number"
                  value={lgsInkilap}
                  onChange={(e) => setLgsInkilap(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Din Kültürü (10S)</label>
                <input
                  type="number"
                  value={lgsDin}
                  onChange={(e) => setLgsDin(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">İngilizce (10S)</label>
                <input
                  type="number"
                  value={lgsIngilizce}
                  onChange={(e) => setLgsIngilizce(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-950/60 via-[#0D1B35] to-[#1E293B] p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between">
            <div>
              <h4 className="font-black text-white text-sm flex items-center gap-2 mb-4">
                <span>🏆</span> LGS Puan & Yüzdelik Dilim Simülasyonu
              </h4>
              <div className="space-y-4">
                <div className="p-4 bg-purple-600/20 border border-purple-500/30 rounded-xl">
                  <span className="text-[10px] font-black text-purple-300 uppercase block">LGS Toplam Net</span>
                  <span className="text-2xl font-black text-white tabular-nums">{totalLgsNet.toFixed(1)} Net / 90 Net</span>
                </div>
                <div className="p-4 bg-emerald-600/20 border border-emerald-500/30 rounded-xl">
                  <span className="text-[10px] font-black text-emerald-300 uppercase block">Tahmini LGS Puanı</span>
                  <span className="text-3xl font-black text-white tabular-nums">{lgsScore.toFixed(1)} Puan</span>
                  <span className="text-xs font-bold text-emerald-400 block mt-2">
                    📍 Tahmini Genel Yüzdelik Dilim: {getLgsYuzdelik(lgsScore)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
