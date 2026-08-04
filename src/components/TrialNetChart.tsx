"use client";

import React, { useState } from "react";

export interface TrialResultItem {
  id: number;
  title: string;
  examType: string;
  turkceNet: number;
  sosyalNet: number;
  matematikNet: number;
  fenNet: number;
  toplamNet: number;
  date: string;
}

interface TrialNetChartProps {
  trials: TrialResultItem[];
}

export default function TrialNetChart({ trials }: TrialNetChartProps) {
  const [selectedExamType, setSelectedExamType] = useState<string>("ALL");
  const [selectedSubject, setSelectedSubject] = useState<"toplam" | "turkce" | "matematik" | "sosyal" | "fen">("toplam");

  if (!trials || trials.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        <p className="text-sm">Henüz kaydedilmiş bir deneme sonucunuz bulunmamaktadır.</p>
      </div>
    );
  }

  const filteredTrials = selectedExamType === "ALL"
    ? trials
    : trials.filter((t) => t.examType === selectedExamType);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>📊</span> Deneme & Ders Bazlı Net Gelişim Grafiği
          </h3>
          <p className="text-xs text-slate-400">Net yükseliş trendinizi ders ders filtreleyin</p>
        </div>

        {/* Exam Type Badges */}
        <div className="flex items-center gap-2">
          {["ALL", "TYT", "LGS", "AYT"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedExamType(type)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                selectedExamType === type
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {type === "ALL" ? "Tümü" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex items-center gap-2 flex-wrap bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-bold">
        <span className="text-slate-500 text-[10px] uppercase tracking-wider px-2">Ders Filtresi:</span>
        {[
          { key: "toplam", label: "📈 Toplam Net" },
          { key: "turkce", label: "📚 Türkçe" },
          { key: "matematik", label: "🧮 Matematik" },
          { key: "sosyal", label: "🌍 Sosyal" },
          { key: "fen", label: "🔬 Fen Bilimleri" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setSelectedSubject(item.key as any)}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedSubject === item.key
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Visual Chart Bars */}
      <div className="space-y-4 pt-1">
        {filteredTrials.map((trial) => {
          let displayNet = trial.toplamNet;
          let maxVal = Math.max(...filteredTrials.map((t) => t.toplamNet || 1), 100);
          let labelText = "Toplam Net";
          let barGradient = "from-indigo-500 via-purple-500 to-pink-500";

          if (selectedSubject === "turkce") {
            displayNet = trial.turkceNet;
            maxVal = Math.max(...filteredTrials.map((t) => t.turkceNet || 1), 40);
            labelText = "Türkçe Net";
            barGradient = "from-emerald-500 to-teal-400";
          } else if (selectedSubject === "matematik") {
            displayNet = trial.matematikNet;
            maxVal = Math.max(...filteredTrials.map((t) => t.matematikNet || 1), 40);
            labelText = "Matematik Net";
            barGradient = "from-blue-500 to-cyan-400";
          } else if (selectedSubject === "sosyal") {
            displayNet = trial.sosyalNet;
            maxVal = Math.max(...filteredTrials.map((t) => t.sosyalNet || 1), 20);
            labelText = "Sosyal Net";
            barGradient = "from-amber-500 to-orange-400";
          } else if (selectedSubject === "fen") {
            displayNet = trial.fenNet;
            maxVal = Math.max(...filteredTrials.map((t) => t.fenNet || 1), 20);
            labelText = "Fen Net";
            barGradient = "from-purple-500 to-pink-400";
          }

          const percentage = Math.min(100, Math.max(0, (displayNet / maxVal) * 100));

          return (
            <div key={trial.id} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">{trial.title}</span>
                <span className="text-indigo-300 font-bold bg-indigo-950/80 px-2.5 py-1 rounded-md border border-indigo-800/50">
                  {labelText}: {displayNet.toFixed(2)}
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-slate-800/60 h-3.5 rounded-full overflow-hidden flex p-0.5">
                <div
                  className={`bg-gradient-to-r ${barGradient} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Subject Breakdowns */}
              <div className="grid grid-cols-4 gap-2 pt-1 text-[11px] text-center">
                <div className={`p-1.5 rounded-lg border transition ${selectedSubject === "turkce" ? "bg-emerald-950/60 border-emerald-500/50" : "bg-slate-900/80 border-slate-800"}`}>
                  <span className="text-slate-400 block">Türkçe</span>
                  <span className="font-semibold text-emerald-400">{trial.turkceNet}</span>
                </div>
                <div className={`p-1.5 rounded-lg border transition ${selectedSubject === "matematik" ? "bg-blue-950/60 border-blue-500/50" : "bg-slate-900/80 border-slate-800"}`}>
                  <span className="text-slate-400 block">Matematik</span>
                  <span className="font-semibold text-blue-400">{trial.matematikNet}</span>
                </div>
                <div className={`p-1.5 rounded-lg border transition ${selectedSubject === "sosyal" ? "bg-amber-950/60 border-amber-500/50" : "bg-slate-900/80 border-slate-800"}`}>
                  <span className="text-slate-400 block">Sosyal</span>
                  <span className="font-semibold text-amber-400">{trial.sosyalNet}</span>
                </div>
                <div className={`p-1.5 rounded-lg border transition ${selectedSubject === "fen" ? "bg-purple-950/60 border-purple-500/50" : "bg-slate-900/80 border-slate-800"}`}>
                  <span className="text-slate-400 block">Fen</span>
                  <span className="font-semibold text-purple-400">{trial.fenNet}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
