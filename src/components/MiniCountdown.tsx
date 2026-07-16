"use client";
import { useState, useEffect } from "react";

export default function MiniCountdown() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const targetDate = new Date("June 20, 2026 10:00:00").getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setDaysLeft(Math.floor(difference / (1000 * 60 * 60 * 24)));
      } else {
        setDaysLeft(0);
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  if (daysLeft === null) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-[#FAF0E3] border border-[#F5D0A9] text-[#B45309] text-xs font-black px-4 py-2 rounded-full mb-6 uppercase tracking-widest shadow-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
      </span>
      <span>YKS 2026'YA SON {daysLeft} GÜN! 🎓</span>
    </div>
  );
}
