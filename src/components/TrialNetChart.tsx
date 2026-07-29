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

  const maxNet = Math.max(...filteredTrials.map((t) => t.toplamNet || 1), 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>📊</span> Deneme & Net Gelişim Grafiği
          </h3>
          <p className="text-xs text-slate-400">Girdiğiniz deneme sınavlarının net değişim grafiği</p>
        </div>

        {/* Filter Badges */}
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

      {/* Visual Chart Bars */}
      <div className="space-y-4 pt-2">
        {filteredTrials.map((trial) => {
          const percentage = Math.min(100, Math.max(0, (trial.toplamNet / maxNet) * 100));

          return (
            <div key={trial.id} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">{trial.title}</span>
                <span className="text-indigo-400 font-bold bg-indigo-950/80 px-2.5 py-1 rounded-md border border-indigo-800/50">
                  Toplam Net: {trial.toplamNet.toFixed(2)}
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-slate-800/60 h-3.5 rounded-full overflow-hidden flex p-0.5">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Subject Breakdowns */}
              <div className="grid grid-cols-4 gap-2 pt-1 text-[11px] text-center">
                <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Türkçe</span>
                  <span className="font-semibold text-emerald-400">{trial.turkceNet}</span>
                </div>
                <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Matematik</span>
                  <span className="font-semibold text-blue-400">{trial.matematikNet}</span>
                </div>
                <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Sosyal</span>
                  <span className="font-semibold text-amber-400">{trial.sosyalNet}</span>
                </div>
                <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
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
