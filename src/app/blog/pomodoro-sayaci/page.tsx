"use client";
import { useState, useEffect, useRef } from "react";

export default function PomodoroPage() {
  const [pomoTime, setPomoTime] = useState(1500); // 25 dakika = 1500 saniye
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoMode, setPomoMode] = useState<"work" | "break">("work");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Pure Web Audio API Synthesiser Bell Chime
  const playPomoAlarm = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const playTone = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      
      // Play a lovely major triad chime
      playTone(523.25, ctx.currentTime, 0.4); // C5
      playTone(659.25, ctx.currentTime + 0.15, 0.4); // E5
      playTone(783.99, ctx.currentTime + 0.3, 0.5); // G5
    } catch (e) {
      console.error("Audio synthesiser failed:", e);
    }
  };

  const formatPomoTime = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = timeInSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Update browser tab title dynamically
  useEffect(() => {
    if (pomoActive) {
      document.title = `(${formatPomoTime(pomoTime)}) ${pomoMode === "work" ? "Çalışma" : "Mola"} | Derslinex`;
    } else {
      document.title = "Pomodoro Çalışma Sayacı | Derslinex";
    }
    return () => {
      document.title = "Derslinex | Online Özel Ders & Birebir YKS LGS Hazırlık";
    };
  }, [pomoTime, pomoActive, pomoMode]);

  useEffect(() => {
    if (pomoActive) {
      timerRef.current = setInterval(() => {
        setPomoTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setPomoActive(false);
            playPomoAlarm();
            if (pomoMode === "work") {
              setStatusMessage("Tebrikler! Çalışma seansı bitti. Şimdi mola zamanı. 🎉");
              setPomoMode("break");
              return 300; // 5 dk mola
            } else {
              setStatusMessage("Mola bitti! Yeni çalışma seansını başlatabilirsin. 💪");
              setPomoMode("work");
              return 1500; // 25 dk çalışma
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pomoActive, pomoMode]);

  const handlePomoReset = () => {
    setPomoActive(false);
    setPomoMode("work");
    setPomoTime(1500);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto text-center">
        <span className="text-[#B45309] text-xs font-black uppercase tracking-widest">ÇALIŞMA KONDİSYONU</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2 mb-4">Pomodoro Çalışma Sayacı</h1>
        <p className="text-gray-500 text-sm font-semibold mb-10 leading-relaxed">
          25 dakika odaklanmış ders çalışması ve ardından gelen 5 dakikalık zihinsel molalarla sınav veriminizi katlayın.
        </p>

        {/* Premium Pomodoro Clock */}
        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#1e2a52] text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
          
          <div className="flex justify-between items-center w-full pb-4 border-b border-white/10 mb-6">
            <span className="text-[11px] font-black text-[#F5D0A9] uppercase tracking-widest">
              ⏱️ DERS ÇALIŞMA SAYACI
            </span>
            <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${pomoMode === "work" ? "bg-amber-600/50" : "bg-emerald-600/50"}`}>
              {pomoMode === "work" ? "Çalışma Seansı" : "Mola Seansı"}
            </span>
          </div>

          <div className="text-center py-6 relative">
            <div className="text-6xl sm:text-7xl font-black tracking-widest font-mono text-white drop-shadow">
              {formatPomoTime(pomoTime)}
            </div>
            <p className="text-xs text-primary-200 mt-2 font-bold opacity-80">25 Dk Çalışma / 5 Dk Mola</p>
          </div>

          {statusMessage && (
            <div className="w-full mt-6 bg-[#FAF0E3] border border-[#F5D0A9] text-[#B45309] text-xs font-bold p-4 rounded-2xl text-center relative">
              <button 
                onClick={() => setStatusMessage(null)}
                className="absolute top-2 right-2.5 text-gray-500 font-bold"
              >
                ✕
              </button>
              {statusMessage}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 w-full mt-6">
            <button
              onClick={() => {
                setStatusMessage(null);
                setPomoActive(!pomoActive);
              }}
              className={`py-3.5 px-4 rounded-2xl text-sm font-black text-center transition-all active:scale-95 shadow ${
                pomoActive 
                  ? "bg-amber-500 hover:bg-amber-600 text-white" 
                  : "bg-white text-[#1E3A8A] hover:bg-gray-100"
              }`}
            >
              {pomoActive ? "⏸ Duraklat" : "▶ Başlat"}
            </button>
            <button
              onClick={() => {
                handlePomoReset();
                setStatusMessage(null);
              }}
              className="bg-white/10 hover:bg-white/20 text-white py-3.5 px-4 rounded-2xl text-sm font-black text-center transition-all active:scale-95"
            >
              🔄 Sıfırla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
