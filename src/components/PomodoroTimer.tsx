"use client";

import React, { useState, useEffect, useRef } from "react";

const AMBIENT_SOUNDS = [
  { id: "lofi", name: "Lo-Fi Beats", icon: "🎧", freq: 220, type: "sine" },
  { id: "rain", name: "Yağmur Sesi", icon: "🌧️", freq: 150, type: "triangle" },
  { id: "cafe", name: "Kafe Ambiyansı", icon: "☕", freq: 300, type: "sine" },
  { id: "forest", name: "Orman & Doğa", icon: "🌲", freq: 180, type: "sawtooth" },
];

export function PomodoroTimer() {
  const [mode, setMode] = useState<"work" | "shortBreak" | "longBreak">("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [activeSound, setActiveSound] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const modeTimes = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === "work") {
        setCompletedSessions((prev) => prev + 1);
        setMode("shortBreak");
        setTimeLeft(modeTimes.shortBreak);
      } else {
        setMode("work");
        setTimeLeft(modeTimes.work);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const switchMode = (newMode: "work" | "shortBreak" | "longBreak") => {
    setMode(newMode);
    setTimeLeft(modeTimes[newMode]);
    setIsRunning(false);
  };

  const toggleSound = (soundId: string) => {
    if (activeSound === soundId) {
      stopAmbientSound();
      setActiveSound(null);
    } else {
      stopAmbientSound();
      playAmbientSound(soundId);
      setActiveSound(soundId);
    }
  };

  const playAmbientSound = (soundId: string) => {
    const sound = AMBIENT_SOUNDS.find((s) => s.id === soundId);
    if (!sound) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = sound.type as any;
      osc.frequency.setValueAtTime(sound.freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      console.error("Audio synth error:", e);
    }
  };

  const stopAmbientSound = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
      } catch (e) {}
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
    }
    oscRef.current = null;
    audioCtxRef.current = null;
  };

  useEffect(() => {
    return () => stopAmbientSound();
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const totalDuration = modeTimes[mode];
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="pomodoro-container bg-[#1E293B] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl">
            ⏱️
          </div>
          <div>
            <h3 className="font-black text-white text-base">Pomodoro Odak Sayacı & Çalışma Müzikleri</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              25 dakika yüksek odaklanma, 5 dakika dinlenme döngüsü
            </p>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
          <span className="text-xs font-black text-amber-300">🏆 Tamamlanan:</span>
          <span className="text-sm font-black text-white tabular-nums">{completedSessions} Oturum</span>
        </div>
      </div>

      {/* Mode Switches */}
      <div className="flex p-1 bg-[#0D1B35] rounded-xl border border-white/5">
        <button
          onClick={() => switchMode("work")}
          className={`flex-1 py-2 rounded-lg text-xs font-black transition ${
            mode === "work" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          🎯 Çalışma (25 dk)
        </button>
        <button
          onClick={() => switchMode("shortBreak")}
          className={`flex-1 py-2 rounded-lg text-xs font-black transition ${
            mode === "shortBreak" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          ☕ Kısa Mola (5 dk)
        </button>
        <button
          onClick={() => switchMode("longBreak")}
          className={`flex-1 py-2 rounded-lg text-xs font-black transition ${
            mode === "longBreak" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          🌴 Uzun Mola (15 dk)
        </button>
      </div>

      {/* Timer Circle / Display */}
      <div className="flex flex-col items-center justify-center py-4 relative">
        <div className="w-48 h-48 rounded-full border-4 border-white/10 flex flex-col items-center justify-center relative bg-gradient-to-br from-[#0D1B35] to-[#1E293B] shadow-inner">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={mode === "work" ? "#6366f1" : mode === "shortBreak" ? "#10b981" : "#a855f7"}
              strokeWidth="4"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progressPercent) / 100}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <span className="text-4xl font-black text-white tabular-nums tracking-tighter z-10">
            {formattedTime}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 z-10">
            {mode === "work" ? "Ders Odaklanması" : "Mola Süresi"}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3 rounded-xl font-black text-sm transition shadow-lg flex items-center gap-2 ${
              isRunning
                ? "bg-amber-600 hover:bg-amber-500 text-white"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
            }`}
          >
            <span>{isRunning ? "⏸️ Duraklat" : "▶️ Başlat"}</span>
          </button>
          <button
            onClick={() => switchMode(mode)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-black text-xs px-4 py-3 rounded-xl transition"
          >
            🔄 Sıfırla
          </button>
        </div>
      </div>

      {/* Ambient Sound Player */}
      <div className="border-t border-white/10 pt-4">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-3">
          🎧 Arka Plan Odaklanma Müzikleri
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {AMBIENT_SOUNDS.map((s) => {
            const isPlaying = activeSound === s.id;
            return (
              <button
                key={s.id}
                onClick={() => toggleSound(s.id)}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  isPlaying
                    ? "bg-indigo-600/30 border-indigo-500/60 text-white font-black"
                    : "bg-[#0D1B35] border-white/5 text-slate-400 hover:text-white hover:bg-white/5 font-semibold"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{s.icon}</span>
                  <span className="text-xs truncate">{s.name}</span>
                </div>
                {isPlaying && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
