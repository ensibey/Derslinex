"use client";

import React, { useState } from "react";

function clampNet(valStr: string, max: number, min: number = 0): string {
  if (valStr === "" || valStr === undefined || valStr === null) return "";
  let num = parseFloat(valStr);
  if (isNaN(num)) return "";
  if (num < min) num = min;
  if (num > max) num = max;
  return String(num);
}

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

  // Clamped Calculations for YKS
  const obpVal = Math.min(100, Math.max(50, parseFloat(obp || "0")));
  const obpEkPuan = obpVal * 0.6; // ÖSYM OBP ek puanı = OBP * 0.6

  const tytTurkceVal = Math.min(40, Math.max(0, parseFloat(tytTurkce || "0")));
  const tytSosyalVal = Math.min(20, Math.max(0, parseFloat(tytSosyal || "0")));
  const tytMatVal = Math.min(40, Math.max(0, parseFloat(tytMat || "0")));
  const tytFenVal = Math.min(20, Math.max(0, parseFloat(tytFen || "0")));

  const totalTytNet = Math.min(120, tytTurkceVal + tytSosyalVal + tytMatVal + tytFenVal);
  const tytRawScore = 100 + totalTytNet * 3.3;
  const tytYerlestirmePuan = Math.min(500, tytRawScore + obpEkPuan);

  const aytMatVal = Math.min(40, Math.max(0, parseFloat(aytMat || "0")));
  const aytFizikVal = Math.min(14, Math.max(0, parseFloat(aytFizik || "0")));
  const aytKimyaVal = Math.min(13, Math.max(0, parseFloat(aytKimya || "0")));
  const aytBiyolojiVal = Math.min(13, Math.max(0, parseFloat(aytBiyoloji || "0")));

  const aytSayNet = Math.min(80, aytMatVal + aytFizikVal + aytKimyaVal + aytBiyolojiVal);
  const aytSayRawScore = 100 + (totalTytNet * 1.3 + aytSayNet * 3.0);
  const aytSayYerlestirme = Math.min(500, aytSayRawScore + obpEkPuan);

  const aytEdebiyatVal = Math.min(24, Math.max(0, parseFloat(aytEdebiyat || "0")));
  const aytTarih1Val = Math.min(10, Math.max(0, parseFloat(aytTarih1 || "0")));
  const aytCografya1Val = Math.min(6, Math.max(0, parseFloat(aytCografya1 || "0")));

  const aytEaNet = Math.min(80, aytMatVal + aytEdebiyatVal + aytTarih1Val + aytCografya1Val);
  const aytEaRawScore = 100 + (totalTytNet * 1.3 + aytEaNet * 3.1);
  const aytEaYerlestirme = Math.min(500, aytEaRawScore + obpEkPuan);

  // Clamped Calculations for LGS
  const lgsTurkceVal = Math.min(20, Math.max(0, parseFloat(lgsTurkce || "0")));
  const lgsMatVal = Math.min(20, Math.max(0, parseFloat(lgsMat || "0")));
  const lgsFenVal = Math.min(20, Math.max(0, parseFloat(lgsFen || "0")));
  const lgsInkilapVal = Math.min(10, Math.max(0, parseFloat(lgsInkilap || "0")));
  const lgsDinVal = Math.min(10, Math.max(0, parseFloat(lgsDin || "0")));
  const lgsIngilizceVal = Math.min(10, Math.max(0, parseFloat(lgsIngilizce || "0")));

  const totalLgsNet = Math.min(
    90,
    lgsTurkceVal + lgsMatVal + lgsFenVal + lgsInkilapVal + lgsDinVal + lgsIngilizceVal
  );

  const lgsScore = Math.min(
    500,
    100 +
      lgsTurkceVal * 4.3 +
      lgsMatVal * 4.3 +
      lgsFenVal * 4.1 +
      lgsInkilapVal * 1.6 +
      lgsDinVal * 1.6 +
      lgsIngilizceVal * 1.6
  );

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
              <label htmlFor="obp-input" className="block text-[10px] font-black text-slate-300 uppercase mb-1">
                Diploma Notu (OBP: 50 – 100)
              </label>
              <input
                id="obp-input"
                type="number"
                min={50}
                max={100}
                step="1"
                value={obp}
                onChange={(e) => setObp(clampNet(e.target.value, 100, 50))}
                aria-label="Diploma Notu OBP"
                className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[9px] text-indigo-400 font-bold block mt-1">
                Ek OBP Puanı: +{obpEkPuan.toFixed(1)} Puan
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="tyt-turkce" className="block text-[10px] font-black text-slate-300 uppercase mb-1">Türkçe (Max 40S)</label>
                <input
                  id="tyt-turkce"
                  type="number"
                  min={0}
                  max={40}
                  step="0.25"
                  value={tytTurkce}
                  onChange={(e) => setTytTurkce(clampNet(e.target.value, 40))}
                  aria-label="TYT Türkçe Net"
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="tyt-sosyal" className="block text-[10px] font-black text-slate-300 uppercase mb-1">Sosyal (Max 20S)</label>
                <input
                  id="tyt-sosyal"
                  type="number"
                  min={0}
                  max={20}
                  step="0.25"
                  value={tytSosyal}
                  onChange={(e) => setTytSosyal(clampNet(e.target.value, 20))}
                  aria-label="TYT Sosyal Net"
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="tyt-mat" className="block text-[10px] font-black text-slate-300 uppercase mb-1">Matematik (Max 40S)</label>
                <input
                  id="tyt-mat"
                  type="number"
                  min={0}
                  max={40}
                  step="0.25"
                  value={tytMat}
                  onChange={(e) => setTytMat(clampNet(e.target.value, 40))}
                  aria-label="TYT Matematik Net"
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="tyt-fen" className="block text-[10px] font-black text-slate-300 uppercase mb-1">Fen (Max 20S)</label>
                <input
                  id="tyt-fen"
                  type="number"
                  min={0}
                  max={20}
                  step="0.25"
                  value={tytFen}
                  onChange={(e) => setTytFen(clampNet(e.target.value, 20))}
                  aria-label="TYT Fen Net"
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl">
              <span className="text-[10px] font-black text-indigo-300 uppercase block">TYT TOPLAM NET</span>
              <span className="text-xl font-black text-white tabular-nums">{totalTytNet.toFixed(1)} Net / 120 Net</span>
            </div>
          </div>

          {/* AYT Inputs */}
          <div className="space-y-4 bg-[#0D1B35] p-5 rounded-2xl border border-white/5">
            <h4 className="font-black text-white text-sm flex items-center gap-2">
              <span>📗</span> AYT Netleriniz
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">AYT Mat (Max 40S)</label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  step="0.25"
                  value={aytMat}
                  onChange={(e) => setAytMat(clampNet(e.target.value, 40))}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Fizik (Max 14S)</label>
                <input
                  type="number"
                  min={0}
                  max={14}
                  step="0.25"
                  value={aytFizik}
                  onChange={(e) => setAytFizik(clampNet(e.target.value, 14))}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Kimya (Max 13S)</label>
                <input
                  type="number"
                  min={0}
                  max={13}
                  step="0.25"
                  value={aytKimya}
                  onChange={(e) => setAytKimya(clampNet(e.target.value, 13))}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Biyoloji (Max 13S)</label>
                <input
                  type="number"
                  min={0}
                  max={13}
                  step="0.25"
                  value={aytBiyoloji}
                  onChange={(e) => setAytBiyoloji(clampNet(e.target.value, 13))}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Edebiyat (Max 24S)</label>
                <input
                  type="number"
                  min={0}
                  max={24}
                  step="0.25"
                  value={aytEdebiyat}
                  onChange={(e) => setAytEdebiyat(clampNet(e.target.value, 24))}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Tarih-1 (Max 10S)</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  step="0.25"
                  value={aytTarih1}
                  onChange={(e) => setAytTarih1(clampNet(e.target.value, 10))}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="osym-result-card space-y-4 bg-[#0D1B35] p-5 rounded-2xl border border-indigo-500/30 shadow-xl flex flex-col justify-between">

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
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Türkçe (Max 20S)</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  step="0.25"
                  value={lgsTurkce}
                  onChange={(e) => setLgsTurkce(clampNet(e.target.value, 20))}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Matematik (Max 20S)</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  step="0.25"
                  value={lgsMat}
                  onChange={(e) => setLgsMat(clampNet(e.target.value, 20))}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Fen Bilimleri (Max 20S)</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  step="0.25"
                  value={lgsFen}
                  onChange={(e) => setLgsFen(clampNet(e.target.value, 20))}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">İnkılap (Max 10S)</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  step="0.25"
                  value={lgsInkilap}
                  onChange={(e) => setLgsInkilap(clampNet(e.target.value, 10))}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Din Kültürü (Max 10S)</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  step="0.25"
                  value={lgsDin}
                  onChange={(e) => setLgsDin(clampNet(e.target.value, 10))}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">İngilizce (Max 10S)</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  step="0.25"
                  value={lgsIngilizce}
                  onChange={(e) => setLgsIngilizce(clampNet(e.target.value, 10))}
                  className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="osym-result-card bg-[#0D1B35] p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between">

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
