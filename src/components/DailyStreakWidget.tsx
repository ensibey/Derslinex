"use client";

import React, { useState, useEffect } from "react";

export default function DailyStreakWidget({ studentId }: { studentId: number }) {
  const [streakDays, setStreakDays] = useState(1);
  const [hasStudiedToday, setHasStudiedToday] = useState(false);

  useEffect(() => {
    if (!studentId) return;

    const streakKey = `derslinex_streak_${studentId}`;
    const lastDateKey = `derslinex_last_date_${studentId}`;
    const today = new Date().toISOString().split("T")[0];

    const savedStreak = parseInt(localStorage.getItem(streakKey) || "1", 10);
    const lastDate = localStorage.getItem(lastDateKey);

    if (lastDate === today) {
      setStreakDays(savedStreak);
      setHasStudiedToday(true);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastDate === yesterdayStr) {
        // Increment streak for continuing consecutive days
        const newStreak = savedStreak + 1;
        setStreakDays(newStreak);
        setHasStudiedToday(true);
        localStorage.setItem(streakKey, String(newStreak));
        localStorage.setItem(lastDateKey, today);
      } else {
        // Reset streak to 1
        setStreakDays(1);
        setHasStudiedToday(true);
        localStorage.setItem(streakKey, "1");
        localStorage.setItem(lastDateKey, today);
      }
    }
  }, [studentId]);

  return (
    <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-orange-500/30 animate-bounce">
          🔥
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-orange-400">GÜNLÜK ÇALIŞMA SERİSİ</span>
            <span className="bg-orange-500/20 border border-orange-500/40 text-orange-300 text-[10px] font-black px-2 py-0.5 rounded-full">
              SERİ AKTİF
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
            {streakDays} Gündür Üst Üste Çalışıyorsun! 🏆
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            {hasStudiedToday
              ? "Bugünkü aktiflik rozetin kaydedildi. Harika gidiyorsun!"
              : "Bugün de bir test çöz veya canlı derse katıl, serini koru!"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 bg-[#0D1B35] border border-white/10 px-4 py-2.5 rounded-2xl">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black transition ${
              i < Math.min(streakDays, 7)
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/40"
                : "bg-white/5 text-slate-600 border border-white/5"
            }`}
          >
            {i + 1}G
          </div>
        ))}
      </div>
    </div>
  );
}
