"use client";

import React from "react";

export interface TopicProgressItem {
  subject: string;
  totalTopics: number;
  completedTopics: number;
}

interface TopicProgressBarProps {
  progressList: TopicProgressItem[];
}

export default function TopicProgressBar({ progressList }: TopicProgressBarProps) {
  if (!progressList || progressList.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        <p className="text-sm">Henüz konu ilerleme bilginiz bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
      <div>
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>🗺️</span> Konu İlerleme Haritası
        </h3>
        <p className="text-xs text-slate-400">Ders bazında tamamlanan müfredat ve konu yüzdeleriniz</p>
      </div>

      <div className="space-y-4">
        {progressList.map((item) => {
          const percentage = item.totalTopics > 0
            ? Math.round((item.completedTopics / item.totalTopics) * 100)
            : 0;

          return (
            <div key={item.subject} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-200">{item.subject}</span>
                <span className="text-emerald-400 font-bold">
                  %{percentage} ({item.completedTopics}/{item.totalTopics} Konu)
                </span>
              </div>

              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
