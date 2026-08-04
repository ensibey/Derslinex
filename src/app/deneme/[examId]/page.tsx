"use client";

import React, { useState, useEffect, useRef, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function QuestionDrawingOverlay({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.parentElement?.clientWidth || 700;
    canvas.height = canvas.parentElement?.clientHeight || 400;
  }, []);

  const startDraw = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => setIsDrawing(false);

  const clearDraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-auto flex flex-col justify-between p-2">
      <div className="flex justify-end gap-2 z-30 bg-[#0A0F1D]/85 backdrop-blur-xs p-1.5 rounded-xl border border-white/10 w-fit ml-auto shadow-md">
        <button type="button" onClick={clearDraw} className="bg-red-500/20 text-red-300 text-[10px] font-black px-2.5 py-1 rounded-lg">🗑️ Temizle</button>
        <button type="button" onClick={onClose} className="bg-white/10 text-white text-[10px] font-black px-2.5 py-1 rounded-lg">✕ Çizimi Kapat</button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
        className="w-full h-full cursor-crosshair touch-none"
      />
    </div>
  );
}

export default function StudentOnlineExamPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const resolvedParams = use(params);
  const examId = resolvedParams.examId;
  const router = useRouter();

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [attempt, setAttempt] = useState<any>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [qId: number]: { selectedOption: string | null; isFlagged: boolean } }>({});
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New UX State: Palette Filter, Offline status, Pre-exam checklist, Font scale, Drawing overlay
  const [paletteFilter, setPaletteFilter] = useState<"all" | "answered" | "flagged" | "empty">("all");
  const [isOnline, setIsOnline] = useState(true);
  const [showChecklist, setShowChecklist] = useState(true);
  const [fontSizeScale, setFontSizeScale] = useState<number>(1);
  const [isDrawingOverlay, setIsDrawingOverlay] = useState(false);

  // Proctoring & Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [focusWarnings, setFocusWarnings] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Network Status Monitor
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setToastMsg("🟢 İnternet bağlantısı sağlandı. Cevaplarınız senkronize.");
    };
    const handleOffline = () => {
      setIsOnline(false);
      setToastMsg("⚠️ İnternet bağlantınız koptu! Cevaplarınız cihaza güvenle kaydediliyor.");
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Sync answers with LocalStorage fallback
  useEffect(() => {
    if (!student || !examId || Object.keys(answers).length === 0) return;
    try {
      localStorage.setItem(`derslinex_answers_${examId}_${student.id}`, JSON.stringify(answers));
    } catch {}
  }, [answers, examId, student]);

  // Load student auth
  useEffect(() => {
    const savedRole = localStorage.getItem("derslinex_role") || sessionStorage.getItem("derslinex_role");
    const savedUser = localStorage.getItem("derslinex_user") || sessionStorage.getItem("derslinex_user");
    if (savedRole === "student" && savedUser) {
      setStudent(JSON.parse(savedUser));
    } else {
      setError("Deneme sınavına girmek için öğrenci girişi yapmanız gerekmektedir.");
      setLoading(false);
    }
  }, []);

  // Request camera stream if camera required
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.warn("Kamera erişimi verilemedi:", err);
      setCameraActive(false);
    }
  }, []);

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Fetch Exam Data & Start Attempt
  useEffect(() => {
    if (!student || !examId) return;

    fetch(`/api/student/exams/${examId}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-student-id": String(student.id),
      },
      body: JSON.stringify({ hasCamera: true }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setExam(data.exam);
          setQuestions(data.questions || []);
          setAttempt(data.attempt);
          const serverWarnings = data.attempt?.focusWarnings || 0;
          let localWarnings = 0;
          try {
            const storedW = localStorage.getItem(`derslinex_focus_${examId}_${student.id}`);
            if (storedW) localWarnings = parseInt(storedW) || 0;
          } catch {}
          const maxWarnings = Math.max(serverWarnings, localWarnings);
          setFocusWarnings(maxWarnings);

          // Populate existing answers from server & local cache
          const initialAnswers: any = {};
          (data.questions || []).forEach((q: any) => {
            initialAnswers[q.id] = {
              selectedOption: q.selectedOption || null,
              isFlagged: Boolean(q.isFlagged),
            };
          });

          // Fallback to local storage if user refreshed or lost connection
          try {
            const cachedLocal = localStorage.getItem(`derslinex_answers_${examId}_${student.id}`);
            if (cachedLocal) {
              const parsed = JSON.parse(cachedLocal);
              Object.keys(parsed).forEach((qIdStr) => {
                const qId = parseInt(qIdStr);
                if (initialAnswers[qId] && parsed[qId]?.selectedOption) {
                  initialAnswers[qId].selectedOption = parsed[qId].selectedOption;
                  initialAnswers[qId].isFlagged = parsed[qId].isFlagged || initialAnswers[qId].isFlagged;
                }
              });
            }
          } catch {}

          setAnswers(initialAnswers);

          // Calculate remaining seconds
          const durationSec = (data.exam.durationMinutes || 135) * 60;
          const startedSec = Math.floor((Date.now() - new Date(data.attempt.startedAt).getTime()) / 1000);
          const remain = Math.max(0, durationSec - startedSec);
          setRemainingSeconds(remain);

          if (data.exam.isCameraRequired) {
            startCamera();
          }
        } else {
          setError(data.error || "Sınav başlatılamadı.");
        }
      })
      .catch(() => setError("Bağlantı hatası oluştu."))
      .finally(() => setLoading(false));
  }, [student, examId, startCamera]);

  // Tab switch / focus warning detector
  useEffect(() => {
    const handleBlur = () => {
      setFocusWarnings((prev) => {
        const next = prev + 1;
        if (student && examId) {
          try {
            localStorage.setItem(`derslinex_focus_${examId}_${student.id}`, String(next));
            sessionStorage.setItem(`derslinex_focus_${examId}_${student.id}`, String(next));
          } catch {}
        }
        return next;
      });
    };
    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [student, examId]);

  // Submit Handler
  const handleSubmitExam = useCallback(async () => {
    if (!student || !examId || isSubmitting) return;
    setIsSubmitting(true);

    const formattedAnswers = Object.keys(answers).map((qIdStr) => {
      const qId = parseInt(qIdStr);
      return {
        questionId: qId,
        selectedOption: answers[qId].selectedOption,
        isFlagged: answers[qId].isFlagged,
      };
    });

    try {
      const res = await fetch(`/api/student/exams/${examId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-student-id": String(student.id),
        },
        body: JSON.stringify({
          answers: formattedAnswers,
          focusWarnings,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResultData(data.result);
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        }
      } else {
        setToastMsg(data.error || "Sınav gönderilemedi.");
      }
    } catch {
      setToastMsg("Bağlantı hatası oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  }, [student, examId, isSubmitting, answers, focusWarnings]);

  // Countdown timer effect
  useEffect(() => {
    if (remainingSeconds <= 0 || resultData) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingSeconds, resultData, handleSubmitExam]);

  // Format time (HH:MM:SS)
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  };

  const handleSelectOption = (qId: number, optionLetter: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        selectedOption: prev[qId]?.selectedOption === optionLetter ? null : optionLetter,
        isFlagged: prev[qId]?.isFlagged || false,
      },
    }));
  };

  const handleToggleFlag = (qId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        selectedOption: prev[qId]?.selectedOption || null,
        isFlagged: !prev[qId]?.isFlagged,
      },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1D] text-white flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-black text-indigo-300 text-sm tracking-wider">ONLINE DENEME SINAVI YÜKLENİYOR...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0F1D] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-2xl font-black mb-4">⚠️</div>
        <h2 className="text-xl font-black text-white mb-2">{error}</h2>
        <p className="text-slate-400 text-xs mb-6">Lütfen giriş bilgilerinizi kontrol edip tekrar deneyiniz.</p>
        <Link href="/profil" className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3 rounded-xl text-xs transition shadow-lg">
          Profil Sayfasına Dön
        </Link>
      </div>
    );
  }

  // Result Analysis Screen
  if (resultData) {
    return (
      <div className="min-h-screen bg-[#0A0F1D] text-white p-4 sm:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-[#1E293B] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2 border-b border-white/10 pb-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-black text-xs px-4 py-1.5 rounded-full">
              🎉 SINAV BAŞARIYLA TAMAMLANDI
            </div>
            <h1 className="text-2xl font-black text-white">{exam?.title}</h1>
            <p className="text-xs text-slate-400">Tamamlanma Zamanı: {new Date().toLocaleTimeString("tr-TR")}</p>
          </div>

          {/* Net Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0D1B35] border border-blue-500/30 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">Türkçe Net</span>
              <span className="text-2xl font-black text-white">{resultData.turkceNet}</span>
              <span className="text-[10px] text-slate-500 block mt-1">D: {resultData.turkceCorrect} | Y: {resultData.turkceWrong}</span>
            </div>
            <div className="bg-[#0D1B35] border border-purple-500/30 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block mb-1">Sosyal Net</span>
              <span className="text-2xl font-black text-white">{resultData.sosyalNet}</span>
              <span className="text-[10px] text-slate-500 block mt-1">D: {resultData.sosyalCorrect} | Y: {resultData.sosyalWrong}</span>
            </div>
            <div className="bg-[#0D1B35] border border-emerald-500/30 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Matematik Net</span>
              <span className="text-2xl font-black text-white">{resultData.matematikNet}</span>
              <span className="text-[10px] text-slate-500 block mt-1">D: {resultData.matCorrect} | Y: {resultData.matWrong}</span>
            </div>
            <div className="bg-[#0D1B35] border border-amber-500/30 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">Fen Net</span>
              <span className="text-2xl font-black text-white">{resultData.fenNet}</span>
              <span className="text-[10px] text-slate-500 block mt-1">D: {resultData.fenCorrect} | Y: {resultData.fenWrong}</span>
            </div>
          </div>

          {/* Total Net Hero */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-center text-white shadow-xl">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-200">TOPLAM NET PUANINIZ</span>
            <div className="text-4xl sm:text-5xl font-black mt-1 mb-1">{resultData.totalNet} NET</div>
            <p className="text-xs text-indigo-200">ÖSYM Standart Net Hesabı (4 Yanlış 1 Doğruyu Götürür)</p>
          </div>

          {/* Konu Bazlı Yanlış & Başarı Analizi */}
          {resultData.topicBreakdown && Object.keys(resultData.topicBreakdown).length > 0 && (
            <div className="bg-[#0D1B35] border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="font-black text-xs uppercase tracking-wider text-indigo-400 flex items-center justify-between">
                <span>🎯 Konu Bazlı Yanlış & Başarı Analizi</span>
                <span className="text-[10px] text-slate-400">Özel Performans Kırılımı</span>
              </h3>
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {Object.entries(resultData.topicBreakdown as Record<string, { correct: number; wrong: number; empty: number; total: number }>).map(([topic, stat]) => (
                  <div key={topic} className="bg-[#131B2E] border border-white/5 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-white truncate block">{topic}</span>
                      <span className="text-[10px] text-slate-400">Toplam {stat.total} Soru</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-black text-[10px] shrink-0">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-lg">✓ {stat.correct} D</span>
                      <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-lg">✕ {stat.wrong} Y</span>
                      <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded-lg">⚪ {stat.empty} B</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <Link href="/profil" className="w-full sm:w-auto text-center bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-3.5 rounded-xl text-xs transition shadow-lg">
              Profil Karneme Dön 🚀
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const currentAns = currentQ ? answers[currentQ.id] : null;

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-200 flex flex-col select-none relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white text-xs font-black px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-red-400">
          <span>⚠️ {toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="text-white/80 hover:text-white font-bold ml-2">✕</button>
        </div>
      )}
      {/* Top Exam Navigation Bar */}
      <header className="h-16 bg-[#131B2E] border-b border-white/10 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="bg-indigo-600 text-white font-black text-xs px-2.5 py-1 rounded-lg">
            {exam?.examType || "TYT"}
          </span>
          <h1 className="font-black text-white text-sm sm:text-base truncate max-w-[200px] sm:max-w-md">
            {exam?.title}
          </h1>
        </div>

        {/* Live Countdown & Proctoring Status */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Focus Warning Alert */}
          {focusWarnings > 0 && (
            <div className="hidden md:flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-lg">
              ⚠️ {focusWarnings} Sekme Değişimi
            </div>
          )}

          {/* Webcam Box */}
          {exam?.isCameraRequired && (
            <div className="flex items-center gap-2 bg-[#0D1B35] border border-white/10 rounded-xl px-2.5 py-1">
              <div className="w-7 h-7 rounded-lg overflow-hidden bg-black border border-white/20 relative flex-shrink-0">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              </div>
              <span className={`text-[10px] font-black hidden sm:inline ${cameraActive ? "text-emerald-400" : "text-red-400"}`}>
                {cameraActive ? "🟢 Kamera Aktif" : "🔴 Kamera Kapalı"}
              </span>
            </div>
          )}

          {/* Timer */}
          <div className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm tabular-nums border ${
            remainingSeconds < 300 ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse" : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
          }`}>
            ⏱️ <span>{formatTime(remainingSeconds)}</span>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => {
              if (window.confirm("Sınavı teslim etmek istediğinize emin misiniz?")) {
                handleSubmitExam();
              }
            }}
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2 rounded-xl transition shadow-md"
          >
            {isSubmitting ? "Gönderiliyor..." : "Sınavı Bitir ✅"}
          </button>
        </div>
      </header>

      {/* Main Exam Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Question View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {currentQ ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Question Header & Badge */}
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-black text-xs px-3 py-1 rounded-xl">
                    Soru {currentIndex + 1} / {questions.length}
                  </span>
                  {currentQ.sectionName && (
                    <span className="bg-white/5 border border-white/10 text-slate-300 font-bold text-xs px-3 py-1 rounded-xl">
                      {currentQ.sectionName}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Font Scaling Controls */}
                  <div className="flex items-center gap-1 bg-[#0D1B35] border border-white/10 px-2.5 py-1 rounded-xl text-xs font-black">
                    <button
                      type="button"
                      onClick={() => setFontSizeScale((prev) => Math.max(0.85, prev - 0.15))}
                      className="px-1.5 py-0.5 rounded hover:bg-white/10 text-slate-300"
                      title="Yazıları Küçült"
                    >
                      A-
                    </button>
                    <span className="text-[10px] text-indigo-400 font-bold px-1">
                      {Math.round(fontSizeScale * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setFontSizeScale((prev) => Math.min(1.4, prev + 0.15))}
                      className="px-1.5 py-0.5 rounded hover:bg-white/10 text-slate-300"
                      title="Yazıları Büyüt"
                    >
                      A+
                    </button>
                  </div>

                  {/* Drawing Overlay Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsDrawingOverlay((prev) => !prev)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition ${
                      isDrawingOverlay
                        ? "bg-amber-600 border-amber-400 text-white shadow-lg"
                        : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
                    }`}
                  >
                    ✍️ {isDrawingOverlay ? "Çizim Açık" : "Soru Üzerine Çiz"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleFlag(currentQ.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition ${
                      currentAns?.isFlagged
                        ? "bg-purple-600 border-purple-400 text-white"
                        : "bg-white/5 hover:bg-white/10 text-slate-400 border-white/10"
                    }`}
                  >
                    🔖 {currentAns?.isFlagged ? "Bayraklandı" : "Sonraya Bırak"}
                  </button>
                </div>
              </div>

              {/* Question Text Container with Drawing Overlay */}
              <div className="relative bg-[#131B2E] border border-white/10 rounded-2xl p-6 shadow-sm overflow-hidden">
                {isDrawingOverlay && (
                  <QuestionDrawingOverlay onClose={() => setIsDrawingOverlay(false)} />
                )}

                {/* Question Image */}
                {currentQ.imageUrl && (
                  <div className="mb-4 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={currentQ.imageUrl} alt="Soru Görseli" className="max-h-72 object-contain mx-auto rounded-xl" />
                  </div>
                )}

                {/* Question Text with font scale */}
                <div
                  style={{ fontSize: `${fontSizeScale * 1.125}rem` }}
                  className="text-white font-bold leading-relaxed whitespace-pre-wrap transition-all"
                >
                  {currentQ.questionText}
                </div>
              </div>

              {/* Options List */}
              <div className="space-y-3 pt-2">
                {["A", "B", "C", "D", "E"].map((letter) => {
                  const optionKey = `option${letter}`;
                  const optionText = currentQ[optionKey];
                  if (!optionText) return null;
                  const isSelected = currentAns?.selectedOption === letter;

                  return (
                    <button
                      key={letter}
                      onClick={() => handleSelectOption(currentQ.id, letter)}
                      className={`w-full text-left p-4 rounded-2xl border text-sm sm:text-base font-bold transition flex items-center gap-4 ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20"
                          : "bg-[#131B2E] hover:bg-white/5 border-white/10 text-slate-300"
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
                        isSelected ? "bg-white text-indigo-900" : "bg-white/10 text-slate-300"
                      }`}>
                        {letter}
                      </span>
                      <span className="flex-1">{optionText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Next/Prev Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-white font-black text-xs px-5 py-3 rounded-xl transition"
                >
                  ← Önceki Soru
                </button>
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  disabled={currentIndex === questions.length - 1}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black text-xs px-6 py-3 rounded-xl transition shadow-md"
                >
                  Sonraki Soru →
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center py-12 text-slate-500 font-bold">Soru bulunamadı.</p>
          )}
        </div>

        {/* Right Side: Optical Form Palette */}
        <div className="w-full md:w-80 bg-[#131B2E] border-t md:border-t-0 md:border-l border-white/10 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-black text-white text-sm flex items-center justify-between">
              <span>📋 Optik Form Paleti</span>
              <span className="text-xs text-indigo-400 font-bold">
                {Object.values(answers).filter((a) => a.selectedOption).length} / {questions.length} Cevaplandı
              </span>
            </h3>

            {/* Status Legend */}
            <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 flex-wrap">
              <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Cevaplandı</div>
              <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Bayraklandı</div>
              <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-white/10" /> Boş</div>
            </div>

            {/* Palette Filter Tabs */}
            <div className="grid grid-cols-4 gap-1 bg-[#0D1B35] p-1 rounded-xl border border-white/10 text-[10px] font-black text-center">
              <button
                onClick={() => setPaletteFilter("all")}
                className={`py-1 rounded-lg transition ${paletteFilter === "all" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
              >
                Tümü
              </button>
              <button
                onClick={() => setPaletteFilter("answered")}
                className={`py-1 rounded-lg transition ${paletteFilter === "answered" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
              >
                Dolu
              </button>
              <button
                onClick={() => setPaletteFilter("flagged")}
                className={`py-1 rounded-lg transition ${paletteFilter === "flagged" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"}`}
              >
                Bayrak
              </button>
              <button
                onClick={() => setPaletteFilter("empty")}
                className={`py-1 rounded-lg transition ${paletteFilter === "empty" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
              >
                Boş
              </button>
            </div>

            {/* Question Grid Buttons */}
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 gap-2 pt-2">
              {questions.map((q, idx) => {
                const ans = answers[q.id];
                const isCurrent = idx === currentIndex;
                const isAnswered = Boolean(ans?.selectedOption);
                const isFlagged = Boolean(ans?.isFlagged);

                if (paletteFilter === "answered" && !isAnswered) return null;
                if (paletteFilter === "flagged" && !isFlagged) return null;
                if (paletteFilter === "empty" && isAnswered) return null;

                let btnBg = "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10";
                if (isAnswered) btnBg = "bg-emerald-600 border-emerald-400 text-white shadow-xs";
                else if (isFlagged) btnBg = "bg-purple-600 border-purple-400 text-white";

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl font-black text-xs border transition-all flex items-center justify-center relative ${btnBg} ${
                      isCurrent ? "ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#131B2E]" : ""
                    }`}
                  >
                    {idx + 1}
                    {isFlagged && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-400 rounded-full border border-[#131B2E]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 mt-6">
            <button
              onClick={() => {
                if (window.confirm("Sınavı teslim etmek istediğinize emin misiniz?")) {
                  handleSubmitExam();
                }
              }}
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3 rounded-xl transition shadow-lg"
            >
              Sınavı Tamamla ve Gönder ✅
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
