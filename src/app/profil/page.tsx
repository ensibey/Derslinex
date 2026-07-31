"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { hocalar } from "@/data/hocalar";
import Link from "next/link";
import { requestNotificationPermission, getNotificationPermission, checkAndNotifySessions } from "@/lib/web-notifications";
import MobileBottomDock from "@/components/MobileBottomDock";
import { StatCardSkeleton, SessionCardSkeleton, QuestionCardSkeleton } from "@/components/SkeletonLoaders";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { OsymCalculator } from "@/components/OsymCalculator";
import { VirtualStudyRooms } from "@/components/VirtualStudyRooms";
import { ScratchpadModal } from "@/components/ScratchpadModal";
import { ThemeToggle } from "@/components/ThemeToggle";

// ─── Yardımcı: Geri Sayım ─────────────────────────────────────────────────────
function useCountdown(targetDate: string | Date | null) {
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    if (!targetDate) return;
    const update = () => setDiff(new Date(targetDate).getTime() - Date.now());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  const totalSec = Math.max(0, Math.floor(diff / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return { diff, label: `${pad(h)}:${pad(m)}:${pad(s)}`, isNow: diff <= 10 * 60_000 && diff > 0 };
}

// ─── Yardımcı: Google Takvim Linki ────────────────────────────────────────────
function getGoogleCalendarUrl(title: string, startTime: string, durationMinutes: number = 60) {
  const start = new Date(startTime);
  const end = new Date(start.getTime() + (durationMinutes || 60) * 60_000);
  const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");
  const dates = `${fmt(start)}/${fmt(end)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title || "Derslinex Canlı Ders",
    dates: dates,
    details: "Derslinex Birebir Online Ders Oturumu",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ─── Brand Logo Header Component ──────────────────────────────────────────────
function BrandLogoHeader({ subBadge = "DERSLİNEX" }: { subBadge?: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 p-0.5 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
        <div className="w-full h-full bg-[#0D1B35] rounded-[10px] flex items-center justify-center overflow-hidden relative">
          {!imgError ? (
            <img
              src="/logo.png?v=9"
              alt="Derslinex Logo"
              className="w-full h-full object-contain p-1"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white text-xs tracking-tighter">
              DX
            </div>
          )}
        </div>
      </div>
      <div className="min-w-0">
        <span className="text-white font-black text-base tracking-tight block leading-tight group-hover:text-indigo-300 transition-colors">
          Derslinex
        </span>
        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 block leading-tight mt-0.5">
          {subBadge}
        </span>
      </div>
    </Link>
  );
}

// ─── Session Card (dark theme for student sidebar) ────────────────────────────
function SessionCardDark({ session, role }: { session: any; role: "student" | "teacher" }) {
  const { label, diff } = useCountdown(
    session.status === "SCHEDULED" || session.status === "LIVE" ? session.startTime : null
  );
  const startMs = new Date(session.startTime).getTime();
  const endMs = startMs + (session.durationMinutes || 60) * 60_000;
  const nowMs = Date.now();
  const fifteenMinsBefore = startMs - 15 * 60_000;
  const isEnded = session.status === "ENDED" || (session.status !== "LIVE" && nowMs > endMs);
  const isLive = session.status === "LIVE";
  const canJoin = session.status === "LIVE" || (!isEnded && (role === "teacher" || nowMs >= fifteenMinsBefore));

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              isLive ? "bg-red-500/20 text-red-400 animate-pulse" :
              isEnded ? "bg-gray-500/20 text-gray-400" :
              "bg-blue-500/20 text-blue-400"
            }`}>{isLive ? "🔴 CANLI" : isEnded ? "✅ Bitti" : "📅 Planlandı"}</span>
          </div>
          <p className="font-black text-white text-xs truncate">{session.title}</p>
          {session.teacher && (
            <p className="text-[10px] text-slate-400 mt-0.5">{session.teacher.name}</p>
          )}
          <p className="text-[10px] text-indigo-400 mt-0.5">
            {new Date(session.startTime).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        {!isEnded && (
          canJoin ? (
            <Link href={`/ders/${session.id}`}>
              <button className="bg-red-600 hover:bg-red-500 text-white font-black text-[10px] px-2.5 py-1.5 rounded-lg transition flex-shrink-0">
                🚀 Katıl
              </button>
            </Link>
          ) : (
            <div className="text-right flex-shrink-0">
              <div className="font-black text-sm text-indigo-300 tabular-nums">{label}</div>
              <a href={getGoogleCalendarUrl(session.title, session.startTime, session.durationMinutes)} target="_blank" rel="noopener noreferrer" className="text-[9px] text-indigo-400 hover:underline block mt-0.5">
                📅 Takvime Ekle
              </a>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ─── Session Card (light theme for sessions tab) ──────────────────────────────
function SessionCard({ session, role }: { session: any; role: "student" | "teacher" }) {
  const { label } = useCountdown(
    session.status === "SCHEDULED" || session.status === "LIVE" ? session.startTime : null
  );
  const startMs = new Date(session.startTime).getTime();
  const endMs = startMs + (session.durationMinutes || 60) * 60_000;
  const nowMs = Date.now();
  const fifteenMinsBefore = startMs - 15 * 60_000;
  const isEnded = session.status === "ENDED" || (session.status !== "LIVE" && nowMs > endMs);
  const isLive = session.status === "LIVE";
  const canJoin = session.status === "LIVE" || (!isEnded && (role === "teacher" || nowMs >= fifteenMinsBefore));

  return (
    <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-5">
      <div className="flex flex-wrap justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
              isLive ? "bg-red-500/20 text-red-400 animate-pulse" :
              isEnded ? "bg-gray-500/20 text-gray-400" :
              "bg-blue-500/20 text-blue-400"
            }`}>{isLive ? "🔴 CANLI" : isEnded ? "✅ Bitti" : "📅 Planlandı"}</span>
            {session.recordSession && <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">🔴 Kayıtlı</span>}
          </div>
          <h4 className="font-black text-white text-base">{session.title}</h4>
          {role === "student" && session.teacher && (
            <p className="text-xs text-slate-400 font-semibold mt-0.5">👨‍🏫 {session.teacher.name} — {session.teacher.branch}</p>
          )}
          <p className="text-xs text-indigo-400 font-bold mt-0.5">
            🕐 {new Date(session.startTime).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })} • {session.durationMinutes} dk
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {!isEnded && (
            <div className="text-right flex flex-col items-end gap-2">
              {canJoin ? (
                <Link href={`/ders/${session.id}`}>
                  <button className="bg-red-600 hover:bg-red-500 text-white font-black text-sm px-6 py-3 rounded-xl transition shadow-md animate-pulse">
                    🚀 {role === "teacher" ? "Yayını Başlat / Katıl" : "Derse Katıl"}
                  </button>
                </Link>
              ) : (
                <div className="text-center">
                  <div className="font-black text-2xl text-indigo-300 tabular-nums">{label}</div>
                  <div className="text-xs text-slate-500 font-semibold mb-2">sonra başlıyor</div>
                  <div className="flex items-center gap-2">
                    <a href={getGoogleCalendarUrl(session.title, session.startTime, session.durationMinutes)} target="_blank" rel="noopener noreferrer" className="bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-300 font-black text-xs px-3 py-1.5 rounded-xl transition">
                      📅 Google Takvim
                    </a>
                    <a href={`/api/sessions/${session.id}/calendar`} target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-black text-xs px-3 py-1.5 rounded-xl transition">
                      📥 .ics İndir
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {session.resources?.length > 0 && (
        <div className="border-t border-white/10 pt-3 mt-1">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">📎 Ders Materyalleri</p>
          <div className="flex flex-wrap gap-2">
            {session.resources.map((r: any) => (
              <a key={r.id} href={r.fileUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-400 hover:bg-white/10 transition">
                📄 {r.title}
              </a>
            ))}
          </div>
        </div>
      )}
      {isEnded && (
        <div className="border-t border-white/10 pt-3 mt-1 space-y-2">
          {session.recordingUrl && (
            <a href={session.recordingUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:underline">
              📹 Ders Kaydını İzle
            </a>
          )}
          {role === "student" && session.myFeedback && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
              <p className="text-xs font-black text-amber-400 mb-1">⭐ {"★".repeat(session.myFeedback.rating)}{"☆".repeat(5 - session.myFeedback.rating)} — Öğretmen Değerlendirmesi</p>
              {session.myFeedback.comment && <p className="text-xs text-amber-300 font-semibold">"{session.myFeedback.comment}"</p>}
              {session.myFeedback.homeworkGiven && <span className="inline-block mt-1 text-xs font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">📝 Ödev verildi</span>}
            </div>
          )}
          {role === "student" && session.participation && (
            <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${session.participation.isAttended ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {session.participation.isAttended ? "✅ Yoklama: Katıldı" : "❌ Yoklama: Katılmadı"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function StudentSessionsTab({ userId }: { userId: number }) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/user/my-sessions", { headers: { "x-user-id": String(userId), "x-user-role": "student" } })
      .then((r) => r.json())
      .then((d) => { if (d.success) setSessions(d.sessions); })
      .finally(() => setLoading(false));
  }, [userId]);
  const upcoming = sessions.filter((s) => s.status !== "ENDED" && s.status !== "CANCELLED");
  const past = sessions.filter((s) => s.status === "ENDED");
  if (loading) return (
    <div className="space-y-4">
      <SessionCardSkeleton />
      <SessionCardSkeleton />
    </div>
  );
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-black text-indigo-400 mb-4">📅 Yaklaşan Canlı Derslerim ({upcoming.length})</h3>
        {upcoming.length === 0 ? <p className="text-sm text-slate-500 font-semibold py-6 text-center">Yaklaşan dersiniz bulunmuyor.</p> : <div className="space-y-4">{upcoming.map((s) => <SessionCard key={s.id} session={s} role="student" />)}</div>}
      </div>
      <div>
        <h3 className="text-base font-black text-indigo-400 mb-4">🕐 Geçmiş Derslerim & Öğretmen Notları ({past.length})</h3>
        {past.length === 0 ? <p className="text-sm text-slate-500 font-semibold py-6 text-center">Henüz tamamlanan dersiniz yok.</p> : <div className="space-y-4">{past.map((s) => <SessionCard key={s.id} session={s} role="student" />)}</div>}
      </div>
    </div>
  );
}

function StudentQuizTab({ studentId }: { studentId?: number }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeView, setActiveView] = useState<"quiz" | "history">("quiz");
  const [pastResults, setPastResults] = useState<any[]>([]);

  const [filters, setFilters] = useState({
    subject: "tumu",
    examType: "tumu",
    difficulty: "tumu",
    topic: "",
  });

  // Local selected options: { [questionId]: selectedOption }
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  // Submitted evaluation result from server
  const [evalResult, setEvalResult] = useState<any>(null);
  const [showSolutions, setShowSolutions] = useState<Record<number, boolean>>({});
  const [scratchpadText, setScratchpadText] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.subject !== "tumu") params.set("subject", filters.subject);
      if (filters.examType !== "tumu") params.set("examType", filters.examType);
      if (filters.difficulty !== "tumu") params.set("difficulty", filters.difficulty);
      if (filters.topic.trim()) params.set("topic", filters.topic);

      const res = await fetch(`/api/student/questions?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setQuestions(data.questions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchPastResults = useCallback(async () => {
    if (!studentId) return;
    try {
      const res = await fetch(`/api/student/questions/submit?studentId=${studentId}`);
      const data = await res.json();
      if (data.success) {
        setPastResults(data.quizResults || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, [studentId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    if (activeView === "history") {
      fetchPastResults();
    }
  }, [activeView, fetchPastResults]);

  const handleSelectOption = (questionId: number, opt: string) => {
    if (evalResult) return; // Prevent changing after submission
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: prev[questionId] === opt ? "" : opt,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!studentId) {
      alert("Lütfen önce giriş yapın.");
      return;
    }
    if (questions.length === 0) return;

    setSubmitting(true);
    try {
      const payloadAnswers = questions.map((q) => ({
        questionId: q.id,
        selectedOption: selectedOptions[q.id] || "",
      }));

      const res = await fetch("/api/student/questions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          examType: filters.examType !== "tumu" ? filters.examType : "TYT",
          subject: filters.subject !== "tumu" ? filters.subject : "Genel",
          answers: payloadAnswers,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEvalResult(data.result);
      } else {
        alert(data.error || "Değerlendirme sırasında bir hata oluştu.");
      }
    } catch (e) {
      console.error("Submit error", e);
      alert("Sunucuya bağlanılamadı.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setSelectedOptions({});
    setEvalResult(null);
    setShowSolutions({});
    fetchQuestions();
  };

  const answeredCount = Object.values(selectedOptions).filter((v) => v !== "").length;

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>📝</span> Soru Bankası & Sunucu Korumalı Net Takibi
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            ÖSYM standartlarında hazırlanan soruları çözün, cevaplarınızı sunucuda doğrulatın ve net durumunuzu kaydedin.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0D1B35] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveView("quiz")}
            className={`px-4 py-2 rounded-lg text-xs font-black transition ${
              activeView === "quiz" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            ✏️ Soru Çöz
          </button>
          <button
            onClick={() => setActiveView("history")}
            className={`px-4 py-2 rounded-lg text-xs font-black transition ${
              activeView === "history" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            📊 Geçmiş Net Takibim ({pastResults.length})
          </button>
        </div>
      </div>

      {activeView === "history" ? (
        /* History View */
        <div className="space-y-4">
          <h4 className="text-sm font-black text-white flex items-center gap-2">
            <span>📊</span> Tamamlanan Testler ve Net Skorlarınız
          </h4>

          {pastResults.length === 0 ? (
            <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-12 text-center text-slate-400">
              <span className="text-4xl block mb-3">📈</span>
              <p className="font-bold text-sm text-white">Henüz kaydedilmiş test sonucunuz bulunmuyor.</p>
              <p className="text-xs text-slate-400 mt-1">Soru bankasından test çözerek netlerinizi takip edebilirsiniz.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {pastResults.map((r: any) => (
                <div key={r.id} className="bg-[#1E293B] border border-white/5 rounded-2xl p-5 space-y-3 hover:border-indigo-500/30 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-xl">
                      📚 {r.subject} ({r.examType})
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      📅 {new Date(r.createdAt).toLocaleString("tr-TR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 bg-[#0D1B35] p-3 rounded-xl border border-white/5 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">NET</span>
                      <span className="text-base font-black text-amber-400">{r.netScore}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold block">Doğru</span>
                      <span className="text-base font-black text-emerald-400">{r.correctCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-red-400 font-bold block">Yanlış</span>
                      <span className="text-base font-black text-red-400">{r.wrongCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Boş</span>
                      <span className="text-base font-black text-slate-300">{r.emptyCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Quiz Active View */
        <div className="space-y-6">
          {/* Evaluation Result Header if Submitted */}
          {evalResult && (
            <div className="bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full">
                    ✅ TEST TAMAMLANDI & DEĞERLENDİRİLDİ
                  </span>
                  <h4 className="text-2xl font-black text-white mt-2">
                    Netiniz: <span className="text-amber-400">{evalResult.netScore} NET</span>
                  </h4>
                  <p className="text-xs text-slate-300 font-semibold mt-0.5">
                    Sonuçlarınız veritabanınıza başarıyla kaydedildi.
                  </p>
                </div>

                <button
                  onClick={resetQuiz}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-5 py-2.5 rounded-xl transition shadow-lg"
                >
                  🔄 Yeni Teste Başla
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0D1B35]/80 p-4 rounded-xl border border-white/10 text-center">
                <div>
                  <span className="text-xs text-emerald-400 font-bold block">Doğru Sayısı</span>
                  <span className="text-xl font-black text-emerald-400">{evalResult.correctCount}</span>
                </div>
                <div>
                  <span className="text-xs text-red-400 font-bold block">Yanlış Sayısı</span>
                  <span className="text-xl font-black text-red-400">{evalResult.wrongCount}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold block">Boş Bırakılan</span>
                  <span className="text-xl font-black text-slate-300">{evalResult.emptyCount}</span>
                </div>
                <div>
                  <span className="text-xs text-purple-400 font-bold block">Kazanılan Puan</span>
                  <span className="text-xl font-black text-purple-300">+{evalResult.totalPoints} AP</span>
                </div>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          {!evalResult && (
            <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-400 uppercase tracking-wider">🎯 Konu & Zorluk Filtreleri</span>
                {(filters.subject !== "tumu" || filters.examType !== "tumu" || filters.difficulty !== "tumu" || filters.topic) && (
                  <button
                    onClick={() => setFilters({ subject: "tumu", examType: "tumu", difficulty: "tumu", topic: "" })}
                    className="text-[11px] font-bold text-amber-400 hover:underline"
                  >
                    🔄 Filtreleri Temizle
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <select
                  value={filters.subject}
                  onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                  className="bg-[#0D1B35] border border-white/10 text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none"
                >
                  <option value="tumu">Tüm Dersler</option>
                  <option value="Matematik">Matematik</option>
                  <option value="Fizik">Fizik</option>
                  <option value="Kimya">Kimya</option>
                  <option value="Biyoloji">Biyoloji</option>
                  <option value="Türkçe">Türkçe</option>
                  <option value="Tarih">Tarih</option>
                  <option value="Coğrafya">Coğrafya</option>
                  <option value="Felsefe">Felsefe</option>
                  <option value="İngilizce">İngilizce</option>
                </select>

                <select
                  value={filters.examType}
                  onChange={(e) => setFilters({ ...filters, examType: e.target.value })}
                  className="bg-[#0D1B35] border border-white/10 text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none"
                >
                  <option value="tumu">Tüm Sınav Türleri</option>
                  <option value="TYT">TYT</option>
                  <option value="AYT Sayısal">AYT Sayısal</option>
                  <option value="AYT EA">AYT EA</option>
                  <option value="AYT Sözel">AYT Sözel</option>
                  <option value="LGS">LGS</option>
                </select>

                <select
                  value={filters.difficulty}
                  onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                  className="bg-[#0D1B35] border border-white/10 text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none"
                >
                  <option value="tumu">Tüm Zorluklar</option>
                  <option value="Kolay">Kolay</option>
                  <option value="Orta">Orta</option>
                  <option value="Zor">Zor</option>
                  <option value="ÖSYM Tipi">ÖSYM Tipi</option>
                </select>

                <input
                  type="text"
                  placeholder="Konu Ara..."
                  value={filters.topic}
                  onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
                  className="bg-[#0D1B35] border border-white/10 text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none placeholder-slate-500"
                />
              </div>
            </div>
          )}

          {/* Question List */}
          {loading ? (
            <div className="bg-[#1E293B] rounded-2xl p-12 border border-white/5 text-center text-slate-400 font-bold">
              Sorular yükleniyor...
            </div>
          ) : questions.length === 0 ? (
            <div className="bg-[#1E293B] rounded-2xl p-12 border border-white/5 text-center text-slate-400 space-y-2">
              <span className="text-3xl block">🔍</span>
              <p className="font-bold text-white">Seçilen kriterlere uygun soru bulunamadı.</p>
              <p className="text-xs">Filtreleri değiştirerek tekrar deneyebilirsiniz.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, idx) => {
                const userSelected = selectedOptions[q.id] || "";
                const detail = evalResult?.details?.find((d: any) => d.questionId === q.id);

                return (
                  <div key={q.id} className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-indigo-600 text-white font-black text-xs px-3 py-1 rounded-xl">
                          Soru #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => setScratchpadText(q.questionText)}
                          className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-black text-xs px-2.5 py-0.5 rounded-full transition flex items-center gap-1"
                        >
                          ✏️ İşlem Karala
                        </button>
                        <span className="text-xs font-bold bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full">
                          📚 {q.subject} ({q.examType})
                        </span>
                        {q.topic && (
                          <span className="text-xs font-semibold bg-white/5 text-slate-300 px-2.5 py-0.5 rounded-full">
                            🏷️ {q.topic}
                          </span>
                        )}
                        <span className="text-xs font-black bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full">
                          ⚡ {q.difficulty}
                        </span>
                      </div>
                      {q.teacher && (
                        <span className="text-[11px] text-slate-400 font-semibold">
                          👨‍🏫 Hazırlayan: <strong className="text-white">{q.teacher.name}</strong>
                        </span>
                      )}
                    </div>

                    <div className="font-bold text-white text-base leading-relaxed whitespace-pre-wrap bg-[#0D1B35] p-5 rounded-2xl border border-white/5">
                      {q.questionText}
                    </div>

                    {q.imageUrl && (
                      <div className="max-w-lg my-3">
                        <img src={q.imageUrl} alt="Soru Görseli" className="rounded-2xl border border-white/10 max-h-72 object-contain" />
                      </div>
                    )}

                    {/* Options A-E */}
                    <div className="grid sm:grid-cols-2 gap-3 pt-2">
                      {["A", "B", "C", "D", "E"].map((opt) => {
                        const optVal = q[`option${opt}`];
                        if (!optVal || typeof optVal !== "string" || !optVal.trim()) return null;

                        const isChosen = userSelected === opt;
                        const isCorrectOption = detail?.correctOption === opt;

                        let btnStyle = "bg-[#0D1B35] border-white/10 text-slate-300 hover:bg-white/5";

                        if (evalResult) {
                          if (isCorrectOption) {
                            btnStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-black shadow-lg";
                          } else if (isChosen && !isCorrectOption) {
                            btnStyle = "bg-red-500/20 border-red-500/50 text-red-300 font-bold";
                          }
                        } else if (isChosen) {
                          btnStyle = "bg-indigo-600/30 border-indigo-500 text-white font-black shadow-md";
                        }

                        return (
                          <button
                            key={opt}
                            disabled={!!evalResult}
                            onClick={() => handleSelectOption(q.id, opt)}
                            className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all text-xs ${btnStyle}`}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 ${
                              evalResult && isCorrectOption ? "bg-emerald-500 text-white" :
                              evalResult && isChosen ? "bg-red-500 text-white" :
                              isChosen ? "bg-indigo-600 text-white" : "bg-white/10 text-slate-200"
                            }`}>{opt}</span>
                            <span className="flex-1 mt-0.5 leading-relaxed">{optVal}</span>
                            {evalResult && isCorrectOption && <span className="text-emerald-400 font-black">✓ Doğru</span>}
                            {evalResult && isChosen && !isCorrectOption && <span className="text-red-400 font-bold">✕ Yanlış</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Evaluation Details per Question */}
                    {evalResult && detail && (
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between flex-wrap gap-3">
                        <span className={`text-xs font-black px-3 py-1 rounded-xl ${ detail.isCorrect ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30" }`}>
                          {detail.isCorrect ? "🎉 Doğru Yanıt!" : `❌ Yanlış. Doğru Cevap: ${detail.correctOption}`}
                        </span>

                        {detail.solutionText && (
                          <button
                            onClick={() => setShowSolutions((p) => ({ ...p, [q.id]: !p[q.id] }))}
                            className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 font-bold text-xs px-4 py-2 rounded-xl transition"
                          >
                            {showSolutions[q.id] ? "💡 Çözümü Gizle" : "💡 Detaylı Çözümü Göster"}
                          </button>
                        )}
                      </div>
                    )}

                    {showSolutions[q.id] && detail?.solutionText && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-300 space-y-1">
                        <p className="font-black text-amber-400 uppercase tracking-wider">💡 Detaylı Çözüm:</p>
                        <p className="font-semibold whitespace-pre-wrap leading-relaxed">{detail.solutionText}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Submit Quiz Floating/Bottom Bar */}
              {!evalResult && questions.length > 0 && (
                <div className="bg-[#1E293B] border border-indigo-500/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 sticky bottom-4 shadow-2xl z-20">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-300 font-bold">
                      İşaretlenen: <strong className="text-amber-400">{answeredCount}</strong> / {questions.length} Soru
                    </span>
                  </div>

                  <button
                    onClick={handleSubmitQuiz}
                    disabled={submitting}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm px-6 py-3 rounded-xl transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? "Değerlendiriliyor..." : "🚀 Testi Bitir & Sunucuda Netini Hesapla"}
                  </button>
                </div>
              )}

              {scratchpadText && (
                <ScratchpadModal
                  questionText={scratchpadText}
                  onClose={() => setScratchpadText(null)}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Student Trial Net Tracking & Analytics Component ──────────────────────────
function StudentTrialTab({ studentId }: { studentId: number }) {
  const [trials, setTrials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    examType: "TYT",
    turkceNet: "",
    sosyalNet: "",
    matematikNet: "",
    fenNet: "",
  });

  const fetchTrials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/student/trials?studentId=${studentId}`);
      const data = await res.json();
      if (data.success) {
        setTrials(data.trials || []);
      }
    } catch (e) {
      console.error("Trials fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchTrials();
  }, [fetchTrials]);

  const handleSubmitTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/student/trials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          title: form.title,
          examType: form.examType,
          turkceNet: parseFloat(form.turkceNet || "0"),
          sosyalNet: parseFloat(form.sosyalNet || "0"),
          matematikNet: parseFloat(form.matematikNet || "0"),
          fenNet: parseFloat(form.fenNet || "0"),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddForm(false);
        setForm({ title: "", examType: "TYT", turkceNet: "", sosyalNet: "", matematikNet: "", fenNet: "" });
        fetchTrials();
      }
    } catch (e) {
      console.error("Submit trial error:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const maxNet = trials.length > 0 ? Math.max(...trials.map((t) => t.toplamNet)) : 0;
  const avgNet = trials.length > 0 ? (trials.reduce((acc, t) => acc + t.toplamNet, 0) / trials.length).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="space-y-4">
        <SessionCardSkeleton />
        <SessionCardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1E293B] border border-white/10 p-6 rounded-2xl">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>📊</span> Deneme Sınavı Net Takibi & Gelişim Grafiği
          </h3>
          <p className="text-xs text-slate-400 mt-1">Girdiğiniz YKS/LGS deneme sınavlarının net sonuçlarını kaydedin ve gelişiminizi takip edin.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs px-5 py-3 rounded-xl transition shadow-lg flex items-center gap-2"
        >
          <span>{showAddForm ? "❌ Kapat" : "➕ Yeni Deneme Ekle"}</span>
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-900/40 via-indigo-950/60 to-[#0D1B35] border border-indigo-500/30 rounded-2xl p-4 text-center">
          <p className="text-xs text-indigo-300 font-black uppercase tracking-wider">TOPLAM DENEME</p>
          <p className="text-3xl font-black text-white mt-1">{trials.length}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-900/40 via-emerald-950/60 to-[#0D1B35] border border-emerald-500/30 rounded-2xl p-4 text-center">
          <p className="text-xs text-emerald-300 font-black uppercase tracking-wider">EN YÜKSEK NET</p>
          <p className="text-3xl font-black text-emerald-400 mt-1">{maxNet} Net</p>
        </div>

        <div className="bg-gradient-to-br from-amber-900/40 via-amber-950/60 to-[#0D1B35] border border-amber-500/30 rounded-2xl p-4 text-center">
          <p className="text-xs text-amber-300 font-black uppercase tracking-wider">ORTALAMA NET</p>
          <p className="text-3xl font-black text-amber-400 mt-1">{avgNet} Net</p>
        </div>
      </div>

      {/* Add Trial Form */}
      {showAddForm && (
        <form onSubmit={handleSubmitTrial} className="bg-[#1E293B] border border-indigo-500/30 p-6 rounded-2xl space-y-4 shadow-xl">
          <h4 className="font-black text-white text-base">📝 Yeni Deneme Sınavı Kaydı</h4>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Deneme Yayın / Adı</label>
              <input
                type="text"
                placeholder="Örn: 3D Türkiye Geneli TYT-1"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Sınav Türü</label>
              <select
                value={form.examType}
                onChange={(e) => setForm({ ...form, examType: e.target.value })}
                className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500"
              >
                <option value="TYT">TYT (Temel Yeterlilik Testi)</option>
                <option value="AYT">AYT (Alan Yeterlilik Testi)</option>
                <option value="LGS">LGS</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-black text-red-400 uppercase tracking-wider mb-1">Türkçe Net</label>
              <input
                type="number"
                step="0.25"
                placeholder="0.00"
                value={form.turkceNet}
                onChange={(e) => setForm({ ...form, turkceNet: e.target.value })}
                className="w-full bg-[#0D1B35] border border-white/10 text-white px-3 py-2 rounded-xl text-sm font-bold focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-amber-400 uppercase tracking-wider mb-1">Sosyal Net</label>
              <input
                type="number"
                step="0.25"
                placeholder="0.00"
                value={form.sosyalNet}
                onChange={(e) => setForm({ ...form, sosyalNet: e.target.value })}
                className="w-full bg-[#0D1B35] border border-white/10 text-white px-3 py-2 rounded-xl text-sm font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-blue-400 uppercase tracking-wider mb-1">Matematik Net</label>
              <input
                type="number"
                step="0.25"
                placeholder="0.00"
                value={form.matematikNet}
                onChange={(e) => setForm({ ...form, matematikNet: e.target.value })}
                className="w-full bg-[#0D1B35] border border-white/10 text-white px-3 py-2 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-emerald-400 uppercase tracking-wider mb-1">Fen Net</label>
              <input
                type="number"
                step="0.25"
                placeholder="0.00"
                value={form.fenNet}
                onChange={(e) => setForm({ ...form, fenNet: e.target.value })}
                className="w-full bg-[#0D1B35] border border-white/10 text-white px-3 py-2 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs px-4 py-2.5 rounded-xl transition"
            >
              İptal
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-6 py-2.5 rounded-xl transition shadow-md disabled:opacity-50"
            >
              {submitting ? "Kaydediliyor..." : "💾 Denemeyi Kaydet"}
            </button>
          </div>
        </form>
      )}

      {/* Trial List & Bar Charts */}
      {trials.length === 0 ? (
        <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-12 text-center space-y-3">
          <span className="text-4xl">📊</span>
          <h4 className="text-white font-black text-base">Henüz Deneme Sınavı Kaydınız Yok</h4>
          <p className="text-xs text-slate-400">"Yeni Deneme Ekle" butonuna basarak ilk deneme netlerinizi sisteme girebilirsiniz.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h4 className="font-black text-indigo-400 text-sm uppercase tracking-wider">📋 Kayıtlı Deneme Sınavları ({trials.length})</h4>
          {trials.map((t) => {
            const pct = Math.min(100, Math.max(5, (t.toplamNet / 120) * 100));
            return (
              <div key={t.id} className="bg-[#1E293B] border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                      {t.examType}
                    </span>
                    <h5 className="font-black text-white text-base">{t.title}</h5>
                  </div>
                  <span className="text-2xl font-black text-emerald-400 tabular-nums">{t.toplamNet} Net</span>
                </div>

                {/* Net Visual Progress Bar */}
                <div className="w-full bg-[#0D1B35] rounded-full h-3 overflow-hidden border border-white/5 p-0.5">
                  <div
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Subnet Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="bg-[#0D1B35] border border-white/5 p-2 rounded-xl text-center">
                    <p className="text-[10px] text-red-400 font-bold">Türkçe</p>
                    <p className="text-xs font-black text-white">{t.turkceNet} Net</p>
                  </div>
                  <div className="bg-[#0D1B35] border border-white/5 p-2 rounded-xl text-center">
                    <p className="text-[10px] text-amber-400 font-bold">Sosyal</p>
                    <p className="text-xs font-black text-white">{t.sosyalNet} Net</p>
                  </div>
                  <div className="bg-[#0D1B35] border border-white/5 p-2 rounded-xl text-center">
                    <p className="text-[10px] text-blue-400 font-bold">Matematik</p>
                    <p className="text-xs font-black text-white">{t.matematikNet} Net</p>
                  </div>
                  <div className="bg-[#0D1B35] border border-white/5 p-2 rounded-xl text-center">
                    <p className="text-[10px] text-emerald-400 font-bold">Fen</p>
                    <p className="text-xs font-black text-white">{t.fenNet} Net</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── YKS/LGS Topic Completion Checklist Component ─────────────────────────────
const SAMPLE_YKS_TOPICS = [
  {
    subject: "TYT Matematik",
    topics: [
      "Temel Kavramlar",
      "Sayı Basamakları",
      "Bölme ve Bölünebilme",
      "EBOB - EKOK",
      "Rasyonel Sayılar",
      "Basit Eşitsizlikler",
      "Mutlak Değer",
      "Üslü İfadeler",
      "Köklü İfadeler",
      "Oran - Orantı",
      "Problemler (Yaş, İşçi, Yüzde, Kar-Zarar)",
      "Kümeler ve Mantık",
      "Fonksiyonlar",
      "Polinomlar",
    ],
  },
  {
    subject: "AYT Matematik",
    topics: [
      "İkinci Dereceden Denklemler",
      "Karmaşık Sayılar",
      "Parabol",
      "Trigonometri",
      "Logaritma",
      "Diziler",
      "Limit ve Süreklilik",
      "Türev ve Uygulamaları",
      "İntegral",
    ],
  },
  {
    subject: "TYT Türkçe",
    topics: [
      "Sözcükte Anlam",
      "Cümlede Anlam",
      "Paragraf Bilgisi",
      "Ses Bilgisi",
      "Yazım Kuralları",
      "Noktalama İşaretleri",
      "Sözcük Türleri (İsim, Sıfat, Zamir)",
      "Fiiller ve Fiilimsi",
      "Cümlenin Ögeleri",
    ],
  },
  {
    subject: "TYT Fizik",
    topics: [
      "Fizik Bilimine Giriş",
      "Madde ve Özellikleri",
      "Hareket ve Kuvvet",
      "İş, Güç ve Enerji",
      "Isı ve Sıcaklık",
      "Elektrostatik ve Elektrik",
      "Optik ve Aynalar",
      "Dalgalar",
    ],
  },
];

function StudentTopicTab({ studentId }: { studentId: number }) {
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const fetchTopicProgress = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/student/topics?studentId=${studentId}`);
      const data = await res.json();
      if (data.success && data.progress) {
        const map: Record<string, boolean> = {};
        for (const item of data.progress) {
          map[`${item.subject}_${item.topic}`] = item.isCompleted;
        }
        setCompletedTopics(map);
      }
    } catch (e) {
      console.error("Fetch topics error:", e);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchTopicProgress();
  }, [fetchTopicProgress]);

  const toggleTopic = async (subject: string, topic: string) => {
    const key = `${subject}_${topic}`;
    const nextState = !completedTopics[key];

    setCompletedTopics((prev) => ({ ...prev, [key]: nextState }));

    try {
      await fetch("/api/student/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          subject,
          topic,
          isCompleted: nextState,
        }),
      });
    } catch (e) {
      console.error("Toggle topic error:", e);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <SessionCardSkeleton />
        <SessionCardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1E293B] border border-white/10 p-6 rounded-2xl">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <span>📋</span> YKS Konu Takip Çetelesi
        </h3>
        <p className="text-xs text-slate-400 mt-1">Bitirdiğiniz ve hakim olduğunuz konuları işaretleyin, müfredat tamamlama yüzdenizi canlı görün!</p>
      </div>

      {/* Subject Blocks */}
      <div className="space-y-6">
        {SAMPLE_YKS_TOPICS.map((subGroup) => {
          const totalCount = subGroup.topics.length;
          const doneCount = subGroup.topics.filter((t) => completedTopics[`${subGroup.subject}_${t}`]).length;
          const pct = Math.round((doneCount / totalCount) * 100);

          return (
            <div key={subGroup.subject} className="bg-[#1E293B] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="font-black text-white text-base flex items-center gap-2">
                  <span>📚</span> {subGroup.subject}
                </h4>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-bold">
                    {doneCount} / {totalCount} Konu (%{pct})
                  </span>
                  <span className="text-xs font-black bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                    %{pct} Tamamlandı
                  </span>
                </div>
              </div>

              {/* Subject Progress Bar */}
              <div className="w-full bg-[#0D1B35] rounded-full h-2.5 overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Topics Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {subGroup.topics.map((topic) => {
                  const isDone = !!completedTopics[`${subGroup.subject}_${topic}`];
                  return (
                    <button
                      key={topic}
                      onClick={() => toggleTopic(subGroup.subject, topic)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all text-xs font-bold ${
                        isDone
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-md"
                          : "bg-[#0D1B35] border-white/10 text-slate-300 hover:bg-white/5"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 text-xs font-black ${
                        isDone ? "bg-emerald-500 border-emerald-400 text-white" : "border-slate-600 bg-white/5 text-transparent"
                      }`}>✓</span>
                      <span className="flex-1 truncate">{topic}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TeacherSessionsTab({ userId }: { userId: number }) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/user/my-sessions", { headers: { "x-user-id": String(userId), "x-user-role": "teacher" } })
      .then((r) => r.json())
      .then((d) => { if (d.success) setSessions(d.sessions); })
      .finally(() => setLoading(false));
  }, [userId]);
  const upcoming = sessions.filter((s) => s.status !== "ENDED" && s.status !== "CANCELLED");
  const past = sessions.filter((s) => s.status === "ENDED");
  if (loading) return (
    <div className="space-y-4">
      <SessionCardSkeleton />
      <SessionCardSkeleton />
    </div>
  );
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-black text-[#1E3A8A] mb-4">📅 Yaklaşan Canlı Derslerim ({upcoming.length})</h3>
        {upcoming.length === 0 ? <p className="text-sm text-gray-400 font-semibold py-6 text-center">Planlı dersiniz bulunmuyor.</p> : <div className="space-y-4">{upcoming.map((s) => <SessionCard key={s.id} session={s} role="teacher" />)}</div>}
      </div>
      <div>
        <h3 className="text-base font-black text-[#1E3A8A] mb-4">🕐 Geçmiş Derslerim ({past.length})</h3>
        {past.length === 0 ? <p className="text-sm text-gray-400 font-semibold py-6 text-center">Tamamlanan dersiniz yok.</p> : <div className="space-y-4">{past.map((s) => <SessionCard key={s.id} session={s} role="teacher" />)}</div>}
      </div>
    </div>
  );
}

// ─── Student Gamification Leaderboard & Badges Component ─────────────────────
function StudentLeaderboardTab({ currentStudentId }: { currentStudentId?: number }) {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student/leaderboard");
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.leaderboard || []);
      }
    } catch (e) {
      console.error("Leaderboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  if (loading) {
    return (
      <div className="space-y-4">
        <SessionCardSkeleton />
        <SessionCardSkeleton />
      </div>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const myEntry = leaderboard.find((item) => item.id === currentStudentId) || leaderboard[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-amber-500/20 via-indigo-900/40 to-[#0D1B35] border border-amber-500/30 p-6 rounded-2xl">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>🏆</span> Haftanın Net Şampiyonları & Başarı Rozetleri
          </h3>
          <p className="text-xs text-slate-300 mt-1">Soru çözerek, deneme sınavlarında yüksek net elde ederek ve derse katılarak puan toplayın, rozetleri kazanın!</p>
        </div>

        {myEntry && (
          <div className="bg-[#0D1B35] border border-amber-500/40 px-4 py-2.5 rounded-xl text-right">
            <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider block">BENİM SIRAM</span>
            <span className="text-xl font-black text-white tabular-nums">#{myEntry.rank} • {myEntry.totalScore} Puan</span>
          </div>
        )}
      </div>

      {/* Top 3 Podium Showcase */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* 2nd Place */}
          {top3[1] && (
            <div className="order-2 md:order-1 bg-gradient-to-b from-slate-800 to-[#0D1B35] border border-slate-400/30 rounded-2xl p-5 text-center flex flex-col items-center justify-center space-y-3 relative shadow-xl">
              <span className="absolute -top-3 bg-slate-400 text-slate-950 font-black text-xs px-3 py-0.5 rounded-full shadow-md">🥈 2. Sıra</span>
              <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-300 overflow-hidden flex items-center justify-center text-xl font-black text-white mt-2">
                {top3[1].avatar ? <img src={top3[1].avatar} alt="" className="w-full h-full object-cover" /> : top3[1].name.charAt(0)}
              </div>
              <div>
                <h4 className="font-black text-white text-sm">{top3[1].name}</h4>
                <p className="text-xs text-slate-400 font-bold tabular-nums mt-0.5">{top3[1].totalScore} Puan</p>
              </div>
              <div className="flex gap-1">
                {top3[1].badges?.filter((b: any) => b.unlocked).map((b: any) => (
                  <span key={b.id} title={b.name} className="text-base">{b.icon}</span>
                ))}
              </div>
            </div>
          )}

          {/* 1st Place (Gold) */}
          {top3[0] && (
            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-900/60 via-amber-950 to-[#0D1B35] border-2 border-amber-400 rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-3 relative shadow-2xl shadow-amber-500/20 scale-105">
              <span className="absolute -top-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs px-4 py-1 rounded-full shadow-lg border border-amber-300">👑 1. HAFTANIN ŞAMPİYONU</span>
              <div className="w-20 h-20 rounded-full bg-amber-500 border-4 border-amber-300 overflow-hidden flex items-center justify-center text-2xl font-black text-white mt-2 shadow-lg shadow-amber-500/50">
                {top3[0].avatar ? <img src={top3[0].avatar} alt="" className="w-full h-full object-cover" /> : top3[0].name.charAt(0)}
              </div>
              <div>
                <h4 className="font-black text-white text-base">{top3[0].name}</h4>
                <p className="text-sm text-amber-300 font-black tabular-nums mt-0.5">{top3[0].totalScore} Puan</p>
              </div>
              <div className="flex gap-1.5 bg-white/5 px-3 py-1 rounded-xl">
                {top3[0].badges?.filter((b: any) => b.unlocked).map((b: any) => (
                  <span key={b.id} title={b.name} className="text-lg">{b.icon}</span>
                ))}
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className="order-3 bg-gradient-to-b from-amber-950/40 to-[#0D1B35] border border-amber-700/30 rounded-2xl p-5 text-center flex flex-col items-center justify-center space-y-3 relative shadow-xl">
              <span className="absolute -top-3 bg-amber-700 text-white font-black text-xs px-3 py-0.5 rounded-full shadow-md">🥉 3. Sıra</span>
              <div className="w-16 h-16 rounded-full bg-amber-900 border-2 border-amber-600 overflow-hidden flex items-center justify-center text-xl font-black text-white mt-2">
                {top3[2].avatar ? <img src={top3[2].avatar} alt="" className="w-full h-full object-cover" /> : top3[2].name.charAt(0)}
              </div>
              <div>
                <h4 className="font-black text-white text-sm">{top3[2].name}</h4>
                <p className="text-xs text-amber-400 font-bold tabular-nums mt-0.5">{top3[2].totalScore} Puan</p>
              </div>
              <div className="flex gap-1">
                {top3[2].badges?.filter((b: any) => b.unlocked).map((b: any) => (
                  <span key={b.id} title={b.name} className="text-base">{b.icon}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Earned Badges Section */}
      {myEntry && myEntry.badges && (
        <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 space-y-4">
          <h4 className="font-black text-white text-base flex items-center gap-2">
            <span>🎖️</span> Kazandığım Dijital Başarı Rozetleri ({myEntry.unlockedBadgeCount} / {myEntry.badges.length})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {myEntry.badges.map((badge: any) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                  badge.unlocked
                    ? "bg-gradient-to-br from-amber-500/10 to-indigo-900/30 border-amber-500/40 text-white shadow-lg"
                    : "bg-[#0D1B35] border-white/5 text-slate-500 opacity-60"
                }`}
              >
                <span className={`text-2xl p-2 rounded-xl flex-shrink-0 ${ badge.unlocked ? "bg-amber-500/20 border border-amber-500/40" : "bg-white/5" }`}>
                  {badge.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="font-black text-xs text-white truncate">{badge.name}</h5>
                    {badge.unlocked && <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">KAZANILDI</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mt-1 leading-snug">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 space-y-4">
        <h4 className="font-black text-indigo-400 text-sm uppercase tracking-wider">📊 Tüm Öğrenci Sıralaması ({leaderboard.length})</h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                <th className="py-3 px-3">Sıra</th>
                <th className="py-3 px-3">Öğrenci</th>
                <th className="py-3 px-3 text-center">Çözülen Test</th>
                <th className="py-3 px-3 text-center">Max Deneme Neti</th>
                <th className="py-3 px-3 text-center">Kazanılan Rozetler</th>
                <th className="py-3 px-3 text-right">Toplam Puan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leaderboard.map((item) => {
                const isMe = item.id === currentStudentId;
                return (
                  <tr key={item.id} className={`transition-colors ${ isMe ? "bg-indigo-600/20 border-l-4 border-l-indigo-500 font-bold" : "hover:bg-white/5" }`}>
                    <td className="py-3.5 px-3 font-black text-slate-300">
                      {item.rank === 1 ? "🥇 1" : item.rank === 2 ? "🥈 2" : item.rank === 3 ? "🥉 3" : `#${item.rank}`}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-900 border border-white/10 flex items-center justify-center font-black text-white overflow-hidden text-xs flex-shrink-0">
                          {item.avatar ? <img src={item.avatar} alt="" className="w-full h-full object-cover" /> : item.name.charAt(0)}
                        </div>
                        <span className={`font-black text-white ${ isMe ? "text-indigo-300" : "" }`}>
                          {item.name} {isMe && "(Siz)"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-300 font-bold tabular-nums">
                      {item.quizCount + item.trialCount} Test
                    </td>
                    <td className="py-3.5 px-3 text-center text-emerald-400 font-black tabular-nums">
                      {item.maxTrialNet} Net
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex justify-center gap-1">
                        {item.badges?.filter((b: any) => b.unlocked).map((b: any) => (
                          <span key={b.id} title={b.name} className="text-sm">{b.icon}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-black text-indigo-300 text-sm tabular-nums">
                      {item.totalScore} Puan
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Student Wrong Questions Notebook Component ─────────────────────────────
function StudentWrongQuestionsTab({ studentId }: { studentId: number }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryMap, setRetryMap] = useState<Record<number, string>>({});
  const [retryResults, setRetryResults] = useState<Record<number, boolean>>({});

  const fetchWrongQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/student/wrong-questions?studentId=${studentId}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.wrongQuestions || []);
      }
    } catch (e) {
      console.error("Wrong questions fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchWrongQuestions();
  }, [fetchWrongQuestions]);

  const handleRetrySelect = (attemptId: number, option: string) => {
    setRetryMap({ ...retryMap, [attemptId]: option });
  };

  const handleCheckRetry = (attemptId: number, correctOption: string) => {
    const selected = retryMap[attemptId];
    if (!selected) return;
    setRetryResults({ ...retryResults, [attemptId]: selected === correctOption });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <SessionCardSkeleton />
        <SessionCardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1E293B] border border-white/10 p-6 rounded-2xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>📕</span> Yanlış Soru Tekrar Defterim
          </h3>
          <p className="text-xs text-slate-400 mt-1">Daha önce testlerde yanlış yaptığınız sorular burada birikir. Şıkları tekrar inceleyip eksiklerinizi kapatın!</p>
        </div>
        <span className="text-xs font-black bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1.5 rounded-full">
          {items.length} Yanlış Soru
        </span>
      </div>

      {items.length === 0 ? (
        <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-12 text-center space-y-3">
          <span className="text-4xl">🎉</span>
          <h4 className="text-white font-black text-base">Harika! Hiç Yanlış Sorunuz Yok</h4>
          <p className="text-xs text-slate-400">Çözdüğünüz testlerdeki tüm soruları doğru yanıtladınız veya henüz teste girmediniz.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item, index) => {
            const q = item.question;
            const selectedOpt = retryMap[item.attemptId];
            const evalDone = retryResults[item.attemptId] !== undefined;
            const isCorrectRetry = retryResults[item.attemptId];

            return (
              <div key={item.attemptId} className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-white/5 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full">
                      Soru #{index + 1}
                    </span>
                    <span className="text-xs font-bold bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full">
                      {q.subject} • {q.examType}
                    </span>
                    {q.topic && <span className="text-xs font-medium text-slate-400">({q.topic})</span>}
                  </div>
                  <span className="text-[10px] text-red-400 font-bold bg-red-500/10 px-2.5 py-0.5 rounded-full">
                    Siz: {item.selectedOption} şıkkını işaretlemiştiniz
                  </span>
                </div>

                {/* Question Content */}
                <div className="bg-[#0D1B35] border border-white/5 p-4 rounded-xl space-y-3 text-slate-200 text-sm leading-relaxed">
                  <p className="font-bold">{q.questionText}</p>
                  {q.imageUrl && <img src={q.imageUrl} alt="Soru görseli" className="max-h-60 rounded-lg object-contain border border-white/10" />}
                </div>

                {/* Options Grid */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {["A", "B", "C", "D", "E"].map((opt) => {
                    const optText = q[`option${opt}`];
                    if (!optText) return null;

                    const isPreviousWrong = item.selectedOption === opt;
                    const isCorrectOpt = q.correctOption === opt;
                    const isRetrySelected = selectedOpt === opt;

                    let style = "bg-[#0D1B35] border-white/10 text-slate-300 hover:bg-white/5";

                    if (evalDone) {
                      if (isCorrectOpt) style = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-black";
                      else if (isRetrySelected && !isCorrectOpt) style = "bg-red-500/20 border-red-500/50 text-red-300 font-bold";
                    } else if (isRetrySelected) {
                      style = "bg-indigo-600/30 border-indigo-500 text-white font-black";
                    }

                    return (
                      <button
                        key={opt}
                        disabled={evalDone}
                        onClick={() => handleRetrySelect(item.attemptId, opt)}
                        className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all text-xs ${style}`}
                      >
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 ${
                          isCorrectOpt && evalDone ? "bg-emerald-500 text-white" :
                          isPreviousWrong ? "bg-red-500/80 text-white" : "bg-white/10 text-slate-200"
                        }`}>{opt}</span>
                        <span className="flex-1 mt-0.5 leading-relaxed">{optText}</span>
                        {isPreviousWrong && <span className="text-[10px] text-red-400 font-bold">Önceki Yanlışınız</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Submit & Solution Section */}
                <div className="flex items-center justify-between border-t border-white/5 pt-3 flex-wrap gap-3">
                  {evalDone ? (
                    <div className="space-y-1">
                      <span className={`text-xs font-black px-3 py-1 rounded-xl inline-block ${ isCorrectRetry ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30" }`}>
                        {isCorrectRetry ? "🎉 Tebrikler! Doğru Seçenek: " + q.correctOption : "❌ Tekrar Yanlış. Doğru Cevap: " + q.correctOption}
                      </span>
                      {q.solutionText && <p className="text-xs text-indigo-300 font-semibold mt-1">💡 Çözüm: {q.solutionText}</p>}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCheckRetry(item.attemptId, q.correctOption)}
                      disabled={!selectedOpt}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-5 py-2.5 rounded-xl transition disabled:opacity-40"
                    >
                      🔄 Yeniden Çöz ve Kontrol Et
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Teacher Gamification & Rewards Component ─────────────────────────────────
function TeacherRewardsTab({ teacherId }: { teacherId: number }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchRewards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/teacher/rewards?teacherId=${teacherId}`);
      const d = await res.json();
      if (d.success) {
        setData(d);
      }
    } catch (e) {
      console.error("Teacher rewards fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  if (loading) {
    return (
      <div className="space-y-4">
        <SessionCardSkeleton />
        <SessionCardSkeleton />
      </div>
    );
  }

  const stats = data?.stats;
  const badges = data?.badges || [];

  return (
    <div className="space-y-6">
      {/* Header & Score */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/60 via-purple-950 to-[#0D1B35] border border-indigo-500/30 p-6 rounded-2xl">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>🎖️</span> Eğitmen Katkı Puanı & Rozet Paneli
          </h3>
          <p className="text-xs text-slate-300 mt-1">Soru bankasına katkı sağlayarak, materyal paylaşarak ve canlı ders oluşturarak platform puanı kazanın!</p>
        </div>

        <div className="bg-[#0D1B35] border border-amber-500/40 px-5 py-3 rounded-xl text-right">
          <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider block">EĞİTMEN PUANIM</span>
          <span className="text-2xl font-black text-white tabular-nums">{stats?.points || 0} Katkı Puanı</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 space-y-4">
        <h4 className="font-black text-white text-base flex items-center gap-2">
          <span>🏆</span> Eğitmen Başarı Rozetlerim ({stats?.unlockedBadgeCount || 0} / {badges.length})
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {badges.map((badge: any) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                badge.unlocked
                  ? "bg-gradient-to-br from-amber-500/10 to-indigo-900/30 border-amber-500/40 text-white shadow-lg"
                  : "bg-[#0D1B35] border-white/5 text-slate-500 opacity-60"
              }`}
            >
              <span className={`text-3xl p-2.5 rounded-xl flex-shrink-0 ${ badge.unlocked ? "bg-amber-500/20 border border-amber-500/40" : "bg-white/5" }`}>
                {badge.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h5 className="font-black text-sm text-white truncate">{badge.name}</h5>
                  {badge.unlocked && <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">KAZANILDI</span>}
                </div>
                <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Interfaces ────────────────────────────────────────────────────────────────
interface Student { id: number; name: string; phone: string; email: string; status: string; avatar?: string | null; }
interface Teacher { id: number; name: string; phone: string; email: string; branch: string; status: string; egitim?: string | null; ozgecmis?: string | null; linkedin?: string | null; youtube?: string | null; avatar?: string | null; }
interface Feedback { id: number; studentName: string; studentEmail: string | null; teacherId: number; teacherName: string; content: string; rating: number; createdAt: string; }

// ─── Student Sidebar Nav Items ─────────────────────────────────────────────────
const STUDENT_NAV = [
  { id: "panel",         icon: "🏠", label: "Genel Görünüm" },
  { id: "canli",         icon: "🎥", label: "Canlı Derslerim" },
  { id: "sorucozum",     icon: "📝", label: "Soru Bankası & Test Çöz" },
  { id: "yanlissorular", icon: "📕", label: "Yanlış Soru Defterim" },
  { id: "denemenet",     icon: "📊", label: "Deneme Net Takibi" },
  { id: "puanhesapla",   icon: "🧮", label: "Puan & Sıralama Simülatörü" },
  { id: "pomodoro",      icon: "⏱️", label: "Pomodoro & Çalışma Müzikleri" },
  { id: "kutuphane",     icon: "👥", label: "7/24 Sanal Kütüphane" },
  { id: "konutakip",     icon: "📋", label: "YKS Konu Çetelesi" },
  { id: "liderlik",      icon: "🏆", label: "Liderlik & Rozetler" },
  { id: "mesajlar",      icon: "💬", label: "Mesajlar" },
  { id: "degerlendirme", icon: "⭐", label: "Değerlendirmeler" },
  { id: "duzenle",       icon: "⚙️", label: "Profil Düzenle" },
];

// ─── Ana Sayfa ─────────────────────────────────────────────────────────────────
export default function ProfilPage() {
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [rememberMe, setRememberMe] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [studentForm, setStudentForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState(false);
  const [studentEditForm, setStudentEditForm] = useState({ name: "", phone: "", avatar: "" });

  const [teacherForm, setTeacherForm] = useState({ name: "", phone: "", email: "", password: "", branch: "" });
  const [teacherProfile, setTeacherProfile] = useState<Teacher | null>(null);
  const [editingTeacher, setEditingTeacher] = useState(false);
  const [teacherEditForm, setTeacherEditForm] = useState({ name: "", phone: "", branch: "", egitim: "", ozgecmis: "", linkedin: "", youtube: "", avatar: "" });

  const [teacherLessons, setTeacherLessons] = useState<any[]>([]);
  const [teacherBlogs, setTeacherBlogs] = useState<any[]>([]);
  const [teacherFaqs, setTeacherFaqs] = useState<any[]>([]);
  const [addingLesson, setAddingLesson] = useState(false);
  const [writingBlog, setWritingBlog] = useState(false);
  const [addingFaq, setAddingFaq] = useState(false);
  const [lessonForm, setLessonForm] = useState({ title: "", price: "", format: "online", description: "" });
  const [blogForm, setBlogForm] = useState({ title: "", category: "YKS Bilgi", content: "" });
  const [faqForm, setFaqForm] = useState({ question: "", answer: "" });

  const [teacherTasks, setTeacherTasks] = useState<any[]>([]);
  const [teacherPoints, setTeacherPoints] = useState<number>(0);
  const [teacherQuestions, setTeacherQuestions] = useState<any[]>([]);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [questionFilter, setQuestionFilter] = useState({
    subject: "tumu",
    examType: "tumu",
    difficulty: "tumu",
    status: "tumu",
    search: "",
  });
  const [questionForm, setQuestionForm] = useState({
    subject: "Matematik",
    examType: "TYT",
    topic: "",
    difficulty: "Orta",
    questionText: "",
    imageUrl: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    optionE: "",
    correctOption: "A",
    solutionText: "",
  });

  const [dashboardTab, setDashboardTab] = useState<"panel" | "duzenle" | "dersler" | "bloglar" | "faq" | "mesajlar" | "canli" | "degerlendirme" | "gorevler" | "sorular" | "sorucozum" | "denemenet" | "konutakip" | "liderlik" | "yanlissorular" | "pomodoro" | "puanhesapla" | "kutuphane">("panel");
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [activeRoomMessages, setActiveRoomMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [studentFeedbacks, setStudentFeedbacks] = useState<Feedback[]>([]);
  const [teacherFeedbacks, setTeacherFeedbacks] = useState<Feedback[]>([]);

  const [studentSessions, setStudentSessions] = useState<any[]>([]);

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);
  const [dbTeachers, setDbTeachers] = useState<any[]>([]);

  const fetchTeacherDashboardData = useCallback(async (teacherId: number) => {
    try {
      const [lRes, bRes, fRes, tTaskRes, qRes] = await Promise.all([
        fetch(`/api/profil/ogretmen/dersler?teacherId=${teacherId}`),
        fetch(`/api/blog/yazar?authorId=${teacherId}`),
        fetch(`/api/profil/ogretmen/faq?teacherId=${teacherId}`),
        fetch(`/api/profil/ogretmen/gorevler?teacherId=${teacherId}`),
        fetch(`/api/questions?teacherId=${teacherId}`),
      ]);
      const lData = await lRes.json();
      const bData = await bRes.json();
      const fData = await fRes.json();
      const tTaskData = await tTaskRes.json();
      const qData = await qRes.json();
      if (lData.success) setTeacherLessons(lData.lessons || []);
      if (bData.success) setTeacherBlogs(bData.posts || []);
      if (fData.success) setTeacherFaqs(fData.faqs || []);
      if (tTaskData.success) {
        setTeacherTasks(tTaskData.tasks || []);
        setTeacherPoints(tTaskData.points || 0);
      }
      if (qData.success) setTeacherQuestions(qData.questions || []);
    } catch (e) { console.error("Dashboard data fetch error:", e); }
  }, []);

  // Load student sessions for sidebar preview & trigger Web Push Notifications
  const fetchStudentSessions = useCallback(async (userId: number) => {
    try {
      const res = await fetch("/api/user/my-sessions", { headers: { "x-user-id": String(userId), "x-user-role": "student" } });
      const d = await res.json();
      if (d.success) {
        setStudentSessions(d.sessions || []);
        checkAndNotifySessions(d.sessions || []);
      }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    const savedRole = localStorage.getItem("derslinex_role") || sessionStorage.getItem("derslinex_role");
    const savedUser = localStorage.getItem("derslinex_user") || sessionStorage.getItem("derslinex_user");
    if (savedRole && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (savedRole === "student") {
        setStudentProfile(parsedUser);
        setStudentEditForm({ name: parsedUser.name, phone: parsedUser.phone, avatar: parsedUser.avatar || "" });
        setRole("student");
        fetchStudentSessions(parsedUser.id);
      } else {
        setTeacherProfile(parsedUser);
        setTeacherEditForm({ name: parsedUser.name, phone: parsedUser.phone, branch: parsedUser.branch, egitim: parsedUser.egitim || "", ozgecmis: parsedUser.ozgecmis || "", linkedin: parsedUser.linkedin || "", youtube: parsedUser.youtube || "", avatar: parsedUser.avatar || "" });
        setRole("teacher");
        fetchTeacherDashboardData(parsedUser.id);
      }
    }
    fetchDbTeachers();
  }, [fetchTeacherDashboardData, fetchStudentSessions]);

  const fetchChatRooms = useCallback(async () => {
    let url = "";
    if (role === "student" && studentProfile) url = `/api/chat/rooms?studentId=${studentProfile.id}`;
    else if (role === "teacher" && teacherProfile) url = `/api/chat/rooms?teacherId=${teacherProfile.id}`;
    else return;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setChatRooms(data.rooms || []);
    } catch (e) { console.error("Rooms fetch error:", e); }
  }, [role, studentProfile, teacherProfile]);

  useEffect(() => {
    if (!studentProfile && !teacherProfile) return;
    fetchChatRooms();
    const interval = setInterval(fetchChatRooms, 10000);
    return () => clearInterval(interval);
  }, [studentProfile, teacherProfile, fetchChatRooms]);

  useEffect(() => {
    if (!activeRoomId) return;

    // Connect real-time Server-Sent Events (SSE) stream for instant messages
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`/api/chat/stream?roomId=${activeRoomId}`);
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "INIT") {
            setActiveRoomMessages(data.messages || []);
          } else if (data.type === "NEW_MESSAGES") {
            setActiveRoomMessages((prev) => {
              const existingIds = new Set(prev.map((m) => m.id));
              const fresh = data.messages.filter((m: any) => !existingIds.has(m.id));
              return [...prev, ...fresh];
            });
          }
        } catch (e) {
          console.error("SSE parse error", e);
        }
      };
    } catch (err) {
      console.error("EventSource error, fallback to fetch", err);
    }

    // Fallback polling
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?roomId=${activeRoomId}`);
        const data = await res.json();
        if (data.success) setActiveRoomMessages(data.messages || []);
      } catch (e) { console.error("Messages fetch error:", e); }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(interval);
    };
  }, [activeRoomId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const startChatTeacherId = params.get("startChatWithTeacherId");
    const startChatTeacherName = params.get("teacherName");
    if (startChatTeacherId && startChatTeacherName) {
      window.history.replaceState({}, document.title, window.location.pathname);
      const initiateChat = async () => {
        const savedRole = localStorage.getItem("derslinex_role") || sessionStorage.getItem("derslinex_role");
        const savedUser = localStorage.getItem("derslinex_user") || sessionStorage.getItem("derslinex_user");
        if (savedRole === "student" && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          try {
            const res = await fetch("/api/chat/rooms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId: parsedUser.id, studentName: parsedUser.name, teacherId: parseInt(startChatTeacherId), teacherName: startChatTeacherName }) });
            const data = await res.json();
            if (data.success && data.room) { setActiveRoomId(data.room.id); setDashboardTab("mesajlar"); showMsg(`${startChatTeacherName} ile sohbet başlatıldı!`, "success"); }
          } catch (e) { console.error("Chat initiation error:", e); }
        } else { showMsg("Lütfen öğretmenle sohbet başlatmak için önce Öğrenci Girişi yapın.", "error"); }
      };
      setTimeout(initiateChat, 800);
    }
  }, []);

  const fetchDbTeachers = async () => {
    try {
      const res = await fetch("/api/profil/ogretmen");
      const data = await res.json();
      if (data.success) setDbTeachers(data.teachers || []);
    } catch (e) { console.error(e); }
  };

  const showMsg = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem("derslinex_role"); localStorage.removeItem("derslinex_user");
    sessionStorage.removeItem("derslinex_role"); sessionStorage.removeItem("derslinex_user");
    setStudentProfile(null); setTeacherProfile(null);
    setStudentFeedbacks([]); setTeacherFeedbacks([]);
    showMsg("Oturum kapatıldı.", "success");
  };

  const handleStudentAuth = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const endpoint = authMode === "login" ? "/api/auth/login/ogrenci" : "/api/auth/register/ogrenci";
      const payload = authMode === "login" ? { email: studentForm.email, password: studentForm.password } : studentForm;
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        const student = data.student;
        setStudentProfile(student);
        setStudentEditForm({ name: student.name, phone: student.phone, avatar: student.avatar || "" });
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("derslinex_role", "student"); storage.setItem("derslinex_user", JSON.stringify(student));
        fetchStudentSessions(student.id);
        showMsg(authMode === "login" ? "Giriş başarılı!" : "Kayıt başarıyla oluşturuldu!", "success");
      } else { showMsg(data.error || "Giriş/Kayıt işlemi başarısız.", "error"); }
    } catch { showMsg("Bağlantı hatası oluştu.", "error"); } finally { setLoading(false); }
  };

  const handleStudentUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); if (!studentProfile) return; setLoading(true);
    try {
      const res = await fetch("/api/profil/ogrenci", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: studentProfile.email, name: studentEditForm.name, phone: studentEditForm.phone, avatar: studentEditForm.avatar }) });
      const data = await res.json();
      if (data.success) {
        const updated = data.student; setStudentProfile(updated);
        const storage = localStorage.getItem("derslinex_role") ? localStorage : sessionStorage;
        storage.setItem("derslinex_user", JSON.stringify(updated));
        window.dispatchEvent(new Event("derslinex_auth_change"));
        setEditingStudent(false); showMsg("Profil bilgileriniz başarıyla güncellendi!", "success");
      } else { showMsg(data.error || "Profil güncellenemedi.", "error"); }
    } catch { showMsg("Bağlantı hatası.", "error"); } finally { setLoading(false); }
  };

  const handleTeacherAuth = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const endpoint = authMode === "login" ? "/api/auth/login/ogretmen" : "/api/auth/register/ogretmen";
      const payload = authMode === "login" ? { email: teacherForm.email, password: teacherForm.password } : teacherForm;
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        const teacher = data.teacher; setTeacherProfile(teacher);
        setTeacherEditForm({ name: teacher.name, phone: teacher.phone, branch: teacher.branch, egitim: teacher.egitim || "", ozgecmis: teacher.ozgecmis || "", linkedin: teacher.linkedin || "", youtube: teacher.youtube || "", avatar: teacher.avatar || "" });
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("derslinex_role", "teacher"); storage.setItem("derslinex_user", JSON.stringify(teacher));
        showMsg(authMode === "login" ? "Giriş başarılı!" : "Başvurunuz alındı ve kayıt oluşturuldu!", "success");
        fetchDbTeachers(); fetchTeacherDashboardData(teacher.id);
      } else { showMsg(data.error || "Giriş/Kayıt işlemi başarısız.", "error"); }
    } catch { showMsg("Bağlantı hatası oluştu.", "error"); } finally { setLoading(false); }
  };

  const handleTeacherUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); if (!teacherProfile) return; setLoading(true);
    try {
      const res = await fetch("/api/profil/ogretmen", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: teacherProfile.email, name: teacherEditForm.name, phone: teacherEditForm.phone, branch: teacherEditForm.branch, egitim: teacherEditForm.egitim, ozgecmis: teacherEditForm.ozgecmis, linkedin: teacherEditForm.linkedin, youtube: teacherEditForm.youtube, avatar: teacherEditForm.avatar }) });
      const data = await res.json();
      if (data.success) {
        const updated = data.teacher; setTeacherProfile(updated);
        const storage = localStorage.getItem("derslinex_role") ? localStorage : sessionStorage;
        storage.setItem("derslinex_user", JSON.stringify(updated));
        window.dispatchEvent(new Event("derslinex_auth_change"));
        setEditingTeacher(false); showMsg("Profil bilgileriniz başarıyla güncellendi!", "success");
      } else { showMsg(data.error || "Profil güncellenemedi.", "error"); }
    } catch { showMsg("Bağlantı hatası.", "error"); } finally { setLoading(false); }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault(); if (!teacherProfile) return; setLoading(true);
    try {
      const res = await fetch("/api/profil/ogretmen/dersler", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ teacherId: teacherProfile.id, ...lessonForm }) });
      const data = await res.json();
      if (data.success) { setLessonForm({ title: "", price: "", format: "online", description: "" }); setAddingLesson(false); showMsg("Ders teklifi başarıyla eklendi!", "success"); fetchTeacherDashboardData(teacherProfile.id); }
      else { showMsg(data.error || "Ders eklenemedi.", "error"); }
    } catch { showMsg("Bağlantı hatası.", "error"); } finally { setLoading(false); }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!teacherProfile) return;
    if (!confirm("Bu ders ilanını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/profil/ogretmen/dersler?id=${lessonId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { showMsg("Ders ilanı silindi.", "success"); fetchTeacherDashboardData(teacherProfile.id); }
      else { showMsg(data.error || "İlan silinemedi.", "error"); }
    } catch { showMsg("Bağlantı hatası.", "error"); }
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault(); if (!teacherProfile) return; setLoading(true);
    try {
      const res = await fetch("/api/blog/yazar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ authorId: teacherProfile.id, authorName: teacherProfile.name, ...blogForm }) });
      const data = await res.json();
      if (data.success) { setBlogForm({ title: "", category: "YKS Bilgi", content: "" }); setWritingBlog(false); showMsg("Blog yazısı başarıyla yayınlandı!", "success"); fetchTeacherDashboardData(teacherProfile.id); }
      else { showMsg(data.error || "Blog yazısı paylaşılamadı.", "error"); }
    } catch { showMsg("Bağlantı hatası.", "error"); } finally { setLoading(false); }
  };

  const handleDeleteBlog = async (postId: number) => {
    if (!teacherProfile) return;
    if (!confirm("Bu blog yazısını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/blog/yazar?id=${postId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { showMsg("Blog yazısı silindi.", "success"); fetchTeacherDashboardData(teacherProfile.id); }
      else { showMsg(data.error || "Yazı silinemedi.", "error"); }
    } catch { showMsg("Bağlantı hatası.", "error"); }
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault(); if (!teacherProfile) return; setLoading(true);
    try {
      const res = await fetch("/api/profil/ogretmen/faq", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ teacherId: teacherProfile.id, ...faqForm }) });
      const data = await res.json();
      if (data.success) { setFaqForm({ question: "", answer: "" }); setAddingFaq(false); showMsg("Sıkça sorulan soru başarıyla eklendi!", "success"); fetchTeacherDashboardData(teacherProfile.id); }
      else { showMsg(data.error || "Soru eklenemedi.", "error"); }
    } catch { showMsg("Bağlantı hatası.", "error"); } finally { setLoading(false); }
  };

  const handleDeleteFaq = async (faqId: number) => {
    if (!teacherProfile) return;
    if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/profil/ogretmen/faq?id=${faqId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { showMsg("Soru silindi.", "success"); fetchTeacherDashboardData(teacherProfile.id); }
      else { showMsg(data.error || "Soru silinemedi.", "error"); }
    } catch { showMsg("Bağlantı hatası.", "error"); }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoomId || !newMessage.trim()) return;
    let senderId = 0; let senderRole = "";
    if (role === "student" && studentProfile) { senderId = studentProfile.id; senderRole = "student"; }
    else if (role === "teacher" && teacherProfile) { senderId = teacherProfile.id; senderRole = "teacher"; }
    else return;
    try {
      const res = await fetch("/api/chat/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roomId: activeRoomId, senderId, senderRole, content: newMessage.trim() }) });
      const data = await res.json();
      if (data.success) { setActiveRoomMessages((prev) => [...prev, data.message]); setNewMessage(""); fetchChatRooms(); }
    } catch (e) { console.error("Send message error:", e); }
  };

  const fetchStudentFeedbacks = useCallback(async () => {
    if (!studentProfile) return;
    try {
      const res = await fetch("/api/gorus"); const data = await res.json();
      if (data.success) { const filtered = (data.feedbacks || []).filter((f: Feedback) => f.studentEmail === studentProfile.email); setStudentFeedbacks(filtered); }
    } catch (e) { console.error(e); }
  }, [studentProfile]);

  useEffect(() => { if (studentProfile) fetchStudentFeedbacks(); }, [studentProfile, fetchStudentFeedbacks]);

  const fetchTeacherFeedbacks = useCallback(async (tId: number) => {
    try {
      const res = await fetch(`/api/gorus?teacherId=${tId}`); const data = await res.json();
      if (data.success) setTeacherFeedbacks(data.feedbacks || []);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { if (teacherProfile) fetchTeacherFeedbacks(teacherProfile.id); }, [teacherProfile, fetchTeacherFeedbacks]);

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault(); if (!studentProfile) return;
    if (!selectedTeacherId || !feedbackContent.trim()) { showMsg("Lütfen öğretmen seçin ve görüşünüzü yazın.", "error"); return; }
    setLoading(true);
    try {
      let teacherName = "";
      const sId = selectedTeacherId;
      if (sId.startsWith("static-")) { const found = hocalar.find((h) => h.id === sId.replace("static-", "")); teacherName = found ? found.isim : "Öğretmen"; }
      else { const found = dbTeachers.find((h) => h.id.toString() === sId); teacherName = found ? found.name : "Öğretmen"; }
      const res = await fetch("/api/gorus", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentName: studentProfile.name, studentEmail: studentProfile.email, teacherId: sId.startsWith("static-") ? parseInt(sId.replace("static-", "")) * 1000 : parseInt(sId), teacherName, content: feedbackContent, rating: feedbackRating }) });
      const data = await res.json();
      if (data.success) { showMsg("Görüşünüz / talebiniz başarıyla iletildi!", "success"); setFeedbackContent(""); fetchStudentFeedbacks(); }
      else { showMsg(data.error || "Görüş gönderilemedi", "error"); }
    } catch { showMsg("Bir hata oluştu", "error"); } finally { setLoading(false); }
  };

  // ─── Derived stats ────────────────────────────────────────────────────────────
  const upcomingSessions = studentSessions.filter((s) => s.status !== "ENDED" && s.status !== "CANCELLED");
  const pastSessions = studentSessions.filter((s) => s.status === "ENDED");
  const avgRating = pastSessions.length > 0 && pastSessions.some((s) => s.myFeedback)
    ? (pastSessions.filter((s) => s.myFeedback).reduce((acc: number, s: any) => acc + (s.myFeedback?.rating || 0), 0) / pastSessions.filter((s) => s.myFeedback).length).toFixed(1)
    : null;

  // ─── AUTH FORM ─────────────────────────────────────────────────────────────────
  if (!studentProfile && !teacherProfile) {
    return (
      <div className="bg-mesh min-h-screen bg-[#0A1628] flex items-center justify-center py-16 px-4 relative overflow-hidden">
        {/* Animated background glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" style={{animation: 'meshFloat1 15s ease-in-out infinite'}} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" style={{animation: 'meshFloat2 20s ease-in-out infinite'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-indigo-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-lg w-full relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-indigo-300 text-[10px] font-black uppercase tracking-widest">Derslinex Portalı</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              Hesabına{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Giriş Yap
              </span>
            </h1>
            <p className="text-slate-400 font-medium mt-3 text-sm leading-relaxed">
              Öğrenci veya öğretmen hesabıyla derslerini, notlarını<br className="hidden sm:block" /> ve randevularını buradan yönet.
            </p>
          </div>

          {/* Alert Message */}
          {message && (
            <div className={`mb-5 p-4 rounded-2xl text-sm font-bold border flex items-center justify-between ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                : "bg-red-500/10 text-red-300 border-red-500/20"
            }`}>
              <span>{message.text}</span>
              <button className="text-xs opacity-60 hover:opacity-100 transition-opacity ml-3" onClick={() => setMessage(null)}>✕</button>
            </div>
          )}

          {/* Glassmorphism Card */}
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-7 shadow-2xl shadow-black/40">

            {/* Role Tab Switcher */}
            <div className="grid grid-cols-2 bg-white/[0.04] border border-white/8 p-1 rounded-2xl mb-6">
              <button
                onClick={() => { setRole("student"); setAuthMode("login"); }}
                className={`py-2.5 px-4 text-xs sm:text-sm font-black rounded-xl transition-all duration-250 btn-press ${
                  role === "student"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/50"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >🎓 Öğrenci</button>
              <button
                onClick={() => { setRole("teacher"); setAuthMode("login"); }}
                className={`py-2.5 px-4 text-xs sm:text-sm font-black rounded-xl transition-all duration-250 btn-press ${
                  role === "teacher"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/50"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >👨‍🏫 Öğretmen</button>
            </div>

            {/* Login / Register Toggle */}
            <div className="flex items-center justify-center gap-1 mb-5">
              <span className="text-xs text-slate-500 font-bold">
                {authMode === "login" ? "Hesabınız yok mu?" : "Zaten üye misiniz?"}
              </span>
              <button
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                className={`text-xs font-black underline ml-1 transition-colors ${
                  role === "teacher" ? "text-emerald-400 hover:text-emerald-300" : "text-indigo-400 hover:text-indigo-300"
                }`}
              >
                {authMode === "login" ? "Kayıt Olun" : "Giriş Yapın"}
              </button>
            </div>

            {/* Form Header */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/8">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                role === "teacher"
                  ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30"
                  : "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30"
              }`}>
                {role === "student" ? "🎓" : "👨‍🏫"}
              </div>
              <div>
                <h3 className="text-white font-black text-sm">
                  {role === "student" ? "Öğrenci" : "Öğretmen"}{" "}
                  {authMode === "login" ? "Giriş Paneli" : "Kayıt Paneli"}
                </h3>
                <p className="text-slate-500 text-[10px] font-bold mt-0.5 uppercase tracking-wider">
                  {authMode === "login" ? "Hesabınıza güvenle erişin" : "Yeni hesap oluşturun"}
                </p>
              </div>
            </div>

            {/* Student Form */}
            {role === "student" ? (
              <form onSubmit={handleStudentAuth} className="space-y-4">
                {authMode === "register" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Adı Soyadı</label>
                      <input
                        type="text" required
                        value={studentForm.name}
                        onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                        className="input-glow w-full bg-white/[0.05] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold placeholder-slate-600 focus:outline-none"
                        placeholder="Ad Soyad"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Telefon</label>
                      <input
                        type="text" required
                        placeholder="05xx xxx xx xx"
                        value={studentForm.phone}
                        onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                        className="input-glow w-full bg-white/[0.05] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold placeholder-slate-600 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">E-posta Adresi</label>
                  <input
                    type="email" required
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="input-glow w-full bg-white/[0.05] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold placeholder-slate-600 focus:outline-none"
                    placeholder="ornek@email.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Şifre</label>
                  <input
                    type="password" required
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    className="input-glow w-full bg-white/[0.05] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold placeholder-slate-600 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="studentRemember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded accent-indigo-500" />
                    <label htmlFor="studentRemember" className="text-xs text-slate-500 font-bold select-none cursor-pointer">Beni Hatırla</label>
                  </div>
                  {authMode === "login" && (
                    <Link href="/sifremi-unuttum" className="text-xs text-indigo-400 font-black hover:text-indigo-300 transition-colors">
                      Şifremi Unuttum?
                    </Link>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-press w-full bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-3.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-indigo-900/50 hover:shadow-indigo-500/30 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      İşlem yapılıyor...
                    </span>
                  ) : authMode === "login" ? "🚀 Giriş Yap" : "✨ Hesap Oluştur"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleTeacherAuth} className="space-y-4">
                {authMode === "register" && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Adı Soyadı</label>
                        <input
                          type="text" required
                          value={teacherForm.name}
                          onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                          className="input-glow w-full bg-white/[0.05] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold placeholder-slate-600 focus:outline-none"
                          placeholder="Ad Soyad"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Telefon</label>
                        <input
                          type="text" required
                          placeholder="05xx xxx xx xx"
                          value={teacherForm.phone}
                          onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                          className="input-glow w-full bg-white/[0.05] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Uzmanlık Branşınız</label>
                      <input
                        type="text" required
                        placeholder="Matematik, Fizik, İngilizce vb."
                        value={teacherForm.branch}
                        onChange={(e) => setTeacherForm({ ...teacherForm, branch: e.target.value })}
                        className="input-glow w-full bg-white/[0.05] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold placeholder-slate-600 focus:outline-none"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">E-posta Adresi</label>
                  <input
                    type="email" required
                    value={teacherForm.email}
                    onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                    className="input-glow w-full bg-white/[0.05] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold placeholder-slate-600 focus:outline-none"
                    placeholder="ornek@email.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Şifre</label>
                  <input
                    type="password" required
                    value={teacherForm.password}
                    onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                    className="input-glow w-full bg-white/[0.05] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold placeholder-slate-600 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="teacherRemember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded accent-emerald-500" />
                    <label htmlFor="teacherRemember" className="text-xs text-slate-500 font-bold select-none cursor-pointer">Beni Hatırla</label>
                  </div>
                  {authMode === "login" && (
                    <Link href="/sifremi-unuttum" className="text-xs text-emerald-400 font-black hover:text-emerald-300 transition-colors">
                      Şifremi Unuttum?
                    </Link>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-press w-full bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-3.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-emerald-900/50 hover:shadow-emerald-500/30 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      İşlem yapılıyor...
                    </span>
                  ) : authMode === "login" ? "🚀 Giriş Yap" : "✨ Başvuru Yap & Kaydol"}
                </button>
              </form>
            )}
          </div>

          {/* Footer note */}
          <p className="text-center text-slate-600 text-[10px] font-bold mt-5 uppercase tracking-wider">
            © 2026 Derslinex · Tüm Hakları Saklıdır
          </p>
        </div>
      </div>
    );
  }

  // ─── TEACHER DASHBOARD (SincApp-style dark sidebar layout) ───────────────────
  if (teacherProfile) {
    return (
      <div className="bg-mesh flex min-h-screen bg-[#0A1628] font-sans">
        {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
        
        {/* Left Sidebar */}
        <aside className={`fixed top-0 left-0 h-full w-[220px] bg-[#0D1B35] border-r border-white/5 flex flex-col z-40 transform transition-transform duration-300 ${ sidebarOpen ? "translate-x-0" : "-translate-x-full" } md:translate-x-0 md:static md:flex`}>
          <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between">
            <BrandLogoHeader subBadge="ÖĞRETMEN PANELİ" />
            <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>✕</button>
          </div>
          <div className="px-4 py-5 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-0.5 shadow-lg shadow-emerald-500/25 flex-shrink-0">
                <div className="w-full h-full bg-[#0D1B35] rounded-[14px] overflow-hidden flex items-center justify-center font-black text-white text-lg">
                  {teacherProfile.avatar ? <img src={teacherProfile.avatar} alt="" className="w-full h-full object-cover" /> : teacherProfile.name.charAt(0)}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-white font-black text-sm truncate">{teacherProfile.name}</p>
                <p className="text-emerald-400 text-[10px] font-bold truncate flex items-center gap-1 mt-0.5">
                  <span className={`inline-block w-2 h-2 rounded-full pulse-glow-emerald ${ teacherProfile.status === "İletişime Geçildi" ? "bg-emerald-400" : "bg-amber-400" }`}></span>
                  {teacherProfile.status === "İletişime Geçildi" ? "👨‍🏫 Öğretmen · Yayında" : "⏳ Onay Bekliyor"}
                </p>
                <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{width: '75%'}} />
                </div>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
            {[
              { id: "panel", label: "Genel Görünüm", icon: "📊" },
              { id: "canli", label: "Canlı Derslerim", icon: "🎥" },
              { id: "gorevler", label: "Görevlerim & Puan", icon: "🏆" },
              { id: "sorular", label: "Soru Bankam", icon: "📝" },
              { id: "dersler", label: "Ders İlanları", icon: "📚" },
              { id: "bloglar", label: "Blog Yazılarım", icon: "✍️" },
              { id: "faq", label: "Soru & Cevap", icon: "❓" },
              { id: "mesajlar", label: "Mesajlar", icon: "💬" },
              { id: "duzenle", label: "Profil Düzenle", icon: "⚙️" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { setDashboardTab(item.id as any); setSidebarOpen(false); }}
                className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all text-xs font-bold overflow-hidden ${
                  dashboardTab === item.id
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/50 border border-emerald-400/30 font-black"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {dashboardTab === item.id && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-emerald-300 rounded-r-full shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                )}
                <span className="text-base">{item.icon}</span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.id === "mesajlar" && chatRooms.length > 0 && (
                  <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{chatRooms.length}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="px-3 pb-4">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-xs font-bold">
              <span className="text-base">🚪</span> Çıkış Yap
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-[#0D1B35]/80 backdrop-blur border-b border-white/5 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button className="md:hidden text-slate-400 hover:text-white p-1" onClick={() => setSidebarOpen(true)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <h1 className="text-white font-black text-sm uppercase tracking-wider">
                {dashboardTab === "panel" ? "Genel Görünüm" : dashboardTab === "canli" ? "Canlı Derslerim" : dashboardTab === "dersler" ? "Özel Ders İlanlarım" : dashboardTab === "bloglar" ? "Blog Paylaşımlarım" : dashboardTab === "faq" ? "Sıkça Sorulan Sorular" : dashboardTab === "mesajlar" ? "Mesajlarım" : "Profil Düzenleme"}
              </h1>
            </div>
            {message && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${ message.type === "success" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30" }`}>
                <span>{message.text}</span>
                <button onClick={() => setMessage(null)} className="opacity-60 hover:opacity-100">✕</button>
              </div>
            )}
          </header>

          <main className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">

            {/* ─── PANEL ─── */}
            {dashboardTab === "panel" && (
              <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1 space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-white">Tekrar hoş geldiniz, {teacherProfile.name.split(" ")[0]} Hocam! 👋</h2>
                    <p className="text-slate-400 text-sm mt-1">
                      {new Date().toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                      {" • "}
                      <span className={`font-bold ${teacherProfile.status === "İletişime Geçildi" ? "text-green-400" : "text-amber-400"}`}>
                        {teacherProfile.status === "İletişime Geçildi" ? "✅ Profil Onaylandı & Yayında" : "⏳ Profil Başvurusu İnceleniyor"}
                      </span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/60 via-indigo-950/80 to-[#0B1329] border border-indigo-500/30 rounded-2xl p-4 shadow-xl shadow-indigo-950/80 hover:border-indigo-400/60 transition-all duration-300 group">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all" />
                      <div className="flex items-center justify-between">
                        <p className="text-indigo-300 text-[10px] font-black uppercase tracking-wider">DERS İLANLARI</p>
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-xs font-black">📚</div>
                      </div>
                      <p className="text-white font-black text-3xl mt-2 tracking-tight">{teacherLessons.length}</p>
                      <p className="text-indigo-400/80 text-[10px] mt-1 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Aktif ilanlarım
                      </p>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900/60 via-emerald-950/80 to-[#0B1329] border border-emerald-500/30 rounded-2xl p-4 shadow-xl shadow-emerald-950/80 hover:border-emerald-400/60 transition-all duration-300 group">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all" />
                      <div className="flex items-center justify-between">
                        <p className="text-emerald-300 text-[10px] font-black uppercase tracking-wider">BLOG YAZILARI</p>
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 text-xs font-black">✍️</div>
                      </div>
                      <p className="text-white font-black text-3xl mt-2 tracking-tight">{teacherBlogs.length}</p>
                      <p className="text-emerald-400/80 text-[10px] mt-1 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Yayınlanan yazılar
                      </p>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-amber-900/60 via-amber-950/80 to-[#0B1329] border border-amber-500/30 rounded-2xl p-4 shadow-xl shadow-amber-950/80 hover:border-amber-400/60 transition-all duration-300 group">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all" />
                      <div className="flex items-center justify-between">
                        <p className="text-amber-300 text-[10px] font-black uppercase tracking-wider">ÖĞRENCİ GÖRÜŞÜ</p>
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 text-xs font-black">💬</div>
                      </div>
                      <p className="text-white font-black text-3xl mt-2 tracking-tight">{teacherFeedbacks.length}</p>
                      <p className="text-amber-400/80 text-[10px] mt-1 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Gelen değerlendirme
                      </p>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/60 via-blue-950/80 to-[#0B1329] border border-blue-500/30 rounded-2xl p-4 shadow-xl shadow-blue-950/80 hover:border-blue-400/60 transition-all duration-300 group">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
                      <div className="flex items-center justify-between">
                        <p className="text-blue-300 text-[10px] font-black uppercase tracking-wider">SOHBETLER</p>
                        <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 text-xs font-black">✉️</div>
                      </div>
                      <p className="text-white font-black text-3xl mt-2 tracking-tight">{chatRooms.length}</p>
                      <p className="text-blue-400/80 text-[10px] mt-1 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Aktif mesajlaşma
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#1E293B] rounded-2xl p-5 border border-white/5">
                    <h3 className="text-white font-black text-sm mb-4">⚡ Hızlı Erişim</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { icon: "🎥", label: "Canlı Derslerim", sub: "Yayın yönetimi", tab: "canli", color: "from-red-600/20 to-red-900/20 border-red-500/20" },
                        { icon: "📚", label: "Ders İlanları", sub: `${teacherLessons.length} ilan aktif`, tab: "dersler", color: "from-indigo-600/20 to-indigo-900/20 border-indigo-500/20" },
                        { icon: "✍️", label: "Bloglar", sub: `${teacherBlogs.length} yazı yayınlandı`, tab: "bloglar", color: "from-emerald-600/20 to-emerald-900/20 border-emerald-500/20" },
                        { icon: "❓", label: "Soru & Cevap", sub: `${teacherFaqs.length} FAQ eklendi`, tab: "faq", color: "from-amber-600/20 to-amber-900/20 border-amber-500/20" },
                        { icon: "💬", label: "Mesajlar", sub: `${chatRooms.length} aktif sohbet`, tab: "mesajlar", color: "from-blue-600/20 to-blue-900/20 border-blue-500/20" },
                        { icon: "⚙️", label: "Profil Düzenle", sub: "Bilgilerini güncelle", tab: "duzenle", color: "from-slate-600/20 to-slate-900/20 border-slate-500/20" },
                      ].map((card) => (
                        <button key={card.tab} onClick={() => setDashboardTab(card.tab as any)} className={`bg-gradient-to-br ${card.color} border rounded-2xl p-4 text-left transition-all hover:scale-105`}>
                          <span className="text-2xl block mb-2">{card.icon}</span>
                          <p className="text-white font-black text-xs">{card.label}</p>
                          <p className="text-slate-400 text-[10px] font-bold mt-0.5">{card.sub}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {teacherFeedbacks.length > 0 && (
                    <div className="bg-[#1E293B] rounded-2xl p-5 border border-white/5">
                      <h3 className="text-white font-black text-sm mb-4">💬 Öğrenci Görüşleri</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {teacherFeedbacks.map((f) => (
                          <div key={f.id} className="p-3 bg-[#0D1B35] border border-white/5 rounded-xl">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-black text-xs text-white">{f.studentName}</span>
                              <span className="text-amber-400 font-bold text-xs">{f.rating} ★</span>
                            </div>
                            <p className="text-slate-300 text-xs font-semibold leading-relaxed">{f.content}</p>
                            <span className="text-[9px] text-slate-500 block text-right mt-1">{new Date(f.createdAt).toLocaleDateString("tr-TR")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="xl:w-72 space-y-4">
                  <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-4">
                    <h3 className="text-white font-black text-xs uppercase tracking-wider mb-3">👤 Eğitmen Kartı</h3>
                    <div className="flex flex-col items-center py-3">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl overflow-hidden mb-2">
                        {teacherProfile.avatar ? <img src={teacherProfile.avatar} alt="" className="w-full h-full object-cover" /> : teacherProfile.name.charAt(0)}
                      </div>
                      <p className="text-white font-black text-sm">{teacherProfile.name}</p>
                      <span className="text-indigo-400 text-xs font-bold mt-0.5">{teacherProfile.branch}</span>
                    </div>
                    <div className="space-y-2 text-xs border-t border-white/5 pt-3 mt-1">
                      <div className="flex justify-between"><span className="text-slate-500 font-bold">Telefon</span><span className="text-slate-300 font-bold">{teacherProfile.phone}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500 font-bold">E-posta</span><span className="text-slate-300 font-bold truncate ml-2 max-w-[120px]">{teacherProfile.email}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500 font-bold">Eğitim</span><span className="text-slate-300 font-bold ml-2 text-right max-w-[120px] truncate">{teacherProfile.egitim || "—"}</span></div>
                    </div>
                    {teacherProfile.status === "İletişime Geçildi" && (
                      <a href={`/ogretmenler/${teacherProfile.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} target="_blank" rel="noopener noreferrer" className="w-full mt-3 block bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-300 font-black text-xs px-4 py-2 rounded-xl transition text-center">🔍 Yayındaki Profili Gör</a>
                    )}
                    <button onClick={() => setDashboardTab("duzenle")} className="w-full mt-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-black text-xs px-4 py-2 rounded-xl transition">⚙️ Profili Düzenle</button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── CANLI DERSLER ─── */}
            {dashboardTab === "canli" && <div className="max-w-3xl"><TeacherSessionsTab userId={teacherProfile.id} /></div>}

            {/* ─── GÖREVLER & PUAN ─── */}
            {dashboardTab === "gorevler" && (
              <div className="max-w-3xl space-y-6">
                {/* Points Status Header */}
                <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl border border-indigo-500/30 p-6 shadow-xl relative overflow-hidden">
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
                        {teacherPoints >= 300 ? "🏆 Zirve Eğitmen" : teacherPoints >= 100 ? "🌟 Yükselen Eğitmen" : "🌱 Başlangıç Düzeyi"}
                      </span>
                      <h3 className="text-2xl font-black text-white mt-2">Toplam Kazanılan Puan: {teacherPoints} Puan</h3>
                      <p className="text-xs text-indigo-200 font-medium mt-1">
                        Puanınız arttıkça profiliniz <strong>/ogretmenler</strong> sayfasında üst sıralara yükselir ve öğrencilere ilk sırada önerilir!
                      </p>
                    </div>
                    <div className="text-4xl sm:text-5xl">🏆</div>
                  </div>
                </div>

                {/* Task List */}
                <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6">
                  <h4 className="text-white font-black text-base mb-1">📋 Size Atanan Görevler ({teacherTasks.length})</h4>
                  <p className="text-slate-400 text-xs font-semibold mb-5">Görevleri tamamlayıp admin onayına gönderin, puan kazanın!</p>

                  {teacherTasks.length === 0 ? (
                    <p className="text-slate-500 text-sm font-semibold py-8 text-center">Henüz size atanan bir görev bulunmuyor.</p>
                  ) : (
                    <div className="space-y-4">
                      {teacherTasks.map((t) => (
                        <div key={t.id} className="p-4 bg-[#0D1B35] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                                t.status === "COMPLETED" ? "bg-emerald-500/20 text-emerald-400" :
                                t.status === "SUBMITTED" ? "bg-amber-500/20 text-amber-400 animate-pulse" :
                                t.status === "REJECTED" ? "bg-red-500/20 text-red-400" :
                                "bg-blue-500/20 text-blue-400"
                              }`}>
                                {t.status === "COMPLETED" ? "✅ Tamamlandı" :
                                 t.status === "SUBMITTED" ? "⏳ Admin Onayı Bekleniyor" :
                                 t.status === "REJECTED" ? "❌ Reddedildi" :
                                 "🎯 Bekliyor"}
                              </span>
                              <span className="text-[10px] font-black bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">⭐ +{t.points} Puan</span>
                            </div>
                            <h5 className="font-black text-sm text-white">{t.title}</h5>
                            {t.description && <p className="text-xs text-slate-400 font-semibold mt-1 leading-relaxed">{t.description}</p>}
                            {t.proof && <p className="text-[11px] text-amber-300 font-medium mt-1 bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20">📌 İlettiğiniz Not: {t.proof}</p>}
                          </div>

                          {t.status === "PENDING" && (
                            <button
                              onClick={async () => {
                                const proofNote = prompt("Görevi tamamladığınıza dair kısa bir kanıt veya not ekleyin (Opsiyonel):", "Görev tamamlandı.");
                                if (proofNote === null) return;
                                try {
                                  const res = await fetch("/api/profil/ogretmen/gorevler", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ taskId: t.id, proof: proofNote }),
                                  });
                                  const data = await res.json();
                                  if (data.success) {
                                    showMsg("✅ Görev tamamlandı olarak admin onayına gönderildi!", "success");
                                    fetchTeacherDashboardData(teacherProfile.id);
                                  } else {
                                    showMsg(data.error || "İşlem başarısız", "error");
                                  }
                                } catch {
                                  showMsg("Bağlantı hatası", "error");
                                }
                              }}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-4 py-2.5 rounded-xl transition flex-shrink-0"
                            >
                              🚀 Tamamladım Diyerek Onaya Gönder
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── SORU BANKAM & SORU EKLE ─── */}
            {dashboardTab === "sorular" && (
              <div className="max-w-3xl space-y-6">
                {/* Top Info Bar */}
                <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h3 className="text-white font-black text-lg flex items-center gap-2">
                      <span>📝</span> Soru Bankam & Soru Ekle
                    </h3>
                    <p className="text-slate-400 text-xs font-semibold mt-1">
                      Platforma soru hazırlayarak katkıda bulunun. Onaylanan her soru için **+20 Puan** kazanın!
                    </p>
                  </div>
                  <button
                    onClick={() => setAddingQuestion(!addingQuestion)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-5 py-3 rounded-xl transition shadow-lg shadow-indigo-900/50"
                  >
                    {addingQuestion ? "✕ İptal Et" : "➕ Yeni Soru Ekle"}
                  </button>
                </div>

                {/* New Question Form */}
                {addingQuestion && (
                  <div className="bg-[#1E293B] rounded-2xl border border-indigo-500/30 p-6 space-y-4 shadow-xl">
                    <h4 className="text-indigo-400 font-black text-sm uppercase tracking-wider">✏️ Yeni Soru Hazırlama Formu</h4>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Ders / Branş</label>
                        <input
                          type="text"
                          value={questionForm.subject}
                          onChange={(e) => setQuestionForm({ ...questionForm, subject: e.target.value })}
                          className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Sınav Türü</label>
                        <select
                          value={questionForm.examType}
                          onChange={(e) => setQuestionForm({ ...questionForm, examType: e.target.value })}
                          className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500"
                        >
                          <option value="TYT">TYT</option>
                          <option value="AYT Sayısal">AYT Sayısal</option>
                          <option value="AYT EA">AYT Eşit Ağırlık</option>
                          <option value="AYT Sözel">AYT Sözel</option>
                          <option value="LGS">LGS</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Konu Adı</label>
                        <input
                          type="text"
                          placeholder="Örn: Türev / Paragraf"
                          value={questionForm.topic}
                          onChange={(e) => setQuestionForm({ ...questionForm, topic: e.target.value })}
                          className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Zorluk Derecesi</label>
                        <select
                          value={questionForm.difficulty}
                          onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                          className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500"
                        >
                          <option value="Kolay">Kolay</option>
                          <option value="Orta">Orta</option>
                          <option value="Zor">Zor</option>
                          <option value="ÖSYM Tipi">ÖSYM Tipi</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Soru Metni</label>
                      <textarea
                        rows={4}
                        placeholder="Soru metnini yazınız..."
                        value={questionForm.questionText}
                        onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                        className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Soru Görseli / Grafik URL (Opsiyonel)</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={questionForm.imageUrl}
                        onChange={(e) => setQuestionForm({ ...questionForm, imageUrl: e.target.value })}
                        className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
                      />
                    </div>

                    {/* Options A-E */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      {["A", "B", "C", "D", "E"].map((opt) => (
                        <div key={opt}>
                          <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Şık {opt}</label>
                          <input
                            type="text"
                            placeholder={`${opt} Şıkkı seçeneği`}
                            value={(questionForm as any)[`option${opt}`]}
                            onChange={(e) => setQuestionForm({ ...questionForm, [`option${opt}`]: e.target.value })}
                            className="w-full bg-[#0D1B35] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                      <div>
                        <label className="block text-xs font-black text-emerald-400 uppercase tracking-wider mb-1.5">Doğru Cevap Şıkkı</label>
                        <select
                          value={questionForm.correctOption}
                          onChange={(e) => setQuestionForm({ ...questionForm, correctOption: e.target.value })}
                          className="w-full bg-[#0D1B35] border border-emerald-500/40 text-emerald-300 font-black px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                        >
                          <option value="A">A Şıkkı</option>
                          <option value="B">B Şıkkı</option>
                          <option value="C">C Şıkkı</option>
                          <option value="D">D Şıkkı</option>
                          <option value="E">E Şıkkı</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Detaylı Adım Adım Çözüm</label>
                        <input
                          type="text"
                          placeholder="Çözüm adımları..."
                          value={questionForm.solutionText}
                          onChange={(e) => setQuestionForm({ ...questionForm, solutionText: e.target.value })}
                          className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={async () => {
                        if (!questionForm.subject || !questionForm.questionText || !questionForm.optionA || !questionForm.optionB) {
                          showMsg("Lütfen ders, soru metni ve A/B şıklarını doldurunuz.", "error");
                          return;
                        }
                        setLoading(true);
                        try {
                          const res = await fetch("/api/questions", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ...questionForm, teacherId: teacherProfile.id }),
                          });
                          const data = await res.json();
                          if (data.success) {
                            showMsg("✅ Sorunuz başarıyla kaydedildi ve admin onayına gönderildi!", "success");
                            setAddingQuestion(false);
                            setQuestionForm({
                              subject: teacherProfile.branch || "Matematik",
                              examType: "TYT",
                              topic: "",
                              difficulty: "Orta",
                              questionText: "",
                              imageUrl: "",
                              optionA: "",
                              optionB: "",
                              optionC: "",
                              optionD: "",
                              optionE: "",
                              correctOption: "A",
                              solutionText: "",
                            });
                            fetchTeacherDashboardData(teacherProfile.id);
                          } else {
                            showMsg(data.error || "Soru kaydedilemedi", "error");
                          }
                        } catch {
                          showMsg("Bağlantı hatası", "error");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3.5 rounded-xl transition shadow-lg shadow-emerald-900/50"
                    >
                      {loading ? "Gönderiliyor..." : "🚀 Soruyu Kaydet & Admin Onayına Gönder (+20 Puan Ödüllü)"}
                    </button>
                  </div>
                )}

                {/* Questions Filter Bar */}
                <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-400 uppercase tracking-wider">🔍 Soruları Filtrele & Ara</span>
                    {(questionFilter.subject !== "tumu" || questionFilter.examType !== "tumu" || questionFilter.difficulty !== "tumu" || questionFilter.status !== "tumu" || questionFilter.search) && (
                      <button
                        onClick={() => setQuestionFilter({ subject: "tumu", examType: "tumu", difficulty: "tumu", status: "tumu", search: "" })}
                        className="text-[11px] font-bold text-amber-400 hover:underline"
                      >
                        🔄 Filtreleri Temizle
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <select
                      value={questionFilter.subject}
                      onChange={(e) => setQuestionFilter({ ...questionFilter, subject: e.target.value })}
                      className="bg-[#0D1B35] border border-white/10 text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none"
                    >
                      <option value="tumu">Tüm Dersler</option>
                      <option value="Matematik">Matematik</option>
                      <option value="Fizik">Fizik</option>
                      <option value="Kimya">Kimya</option>
                      <option value="Biyoloji">Biyoloji</option>
                      <option value="Türkçe">Türkçe</option>
                      <option value="Tarih">Tarih</option>
                      <option value="Coğrafya">Coğrafya</option>
                      <option value="Felsefe">Felsefe</option>
                      <option value="İngilizce">İngilizce</option>
                    </select>

                    <select
                      value={questionFilter.examType}
                      onChange={(e) => setQuestionFilter({ ...questionFilter, examType: e.target.value })}
                      className="bg-[#0D1B35] border border-white/10 text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none"
                    >
                      <option value="tumu">Tüm Sınavlar</option>
                      <option value="TYT">TYT</option>
                      <option value="AYT Sayısal">AYT Sayısal</option>
                      <option value="AYT EA">AYT EA</option>
                      <option value="AYT Sözel">AYT Sözel</option>
                      <option value="LGS">LGS</option>
                    </select>

                    <select
                      value={questionFilter.difficulty}
                      onChange={(e) => setQuestionFilter({ ...questionFilter, difficulty: e.target.value })}
                      className="bg-[#0D1B35] border border-white/10 text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none"
                    >
                      <option value="tumu">Tüm Zorluklar</option>
                      <option value="Kolay">Kolay</option>
                      <option value="Orta">Orta</option>
                      <option value="Zor">Zor</option>
                      <option value="ÖSYM Tipi">ÖSYM Tipi</option>
                    </select>

                    <select
                      value={questionFilter.status}
                      onChange={(e) => setQuestionFilter({ ...questionFilter, status: e.target.value })}
                      className="bg-[#0D1B35] border border-white/10 text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none"
                    >
                      <option value="tumu">Tüm Durumlar</option>
                      <option value="PENDING_APPROVAL">⏳ Onay Bekleyenler</option>
                      <option value="APPROVED">✅ Onaylananlar</option>
                      <option value="REJECTED">❌ Reddedilenler</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Konu / Metin Ara..."
                      value={questionFilter.search}
                      onChange={(e) => setQuestionFilter({ ...questionFilter, search: e.target.value })}
                      className="bg-[#0D1B35] border border-white/10 text-white text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Questions List */}
                <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-black text-base">📋 Sorularım ({teacherQuestions.filter((q) => {
                      if (questionFilter.subject !== "tumu" && q.subject.toLowerCase() !== questionFilter.subject.toLowerCase()) return false;
                      if (questionFilter.examType !== "tumu" && q.examType !== questionFilter.examType) return false;
                      if (questionFilter.difficulty !== "tumu" && q.difficulty !== questionFilter.difficulty) return false;
                      if (questionFilter.status !== "tumu" && q.status !== questionFilter.status) return false;
                      if (questionFilter.search.trim()) {
                        const term = questionFilter.search.toLowerCase();
                        const matchTopic = q.topic?.toLowerCase().includes(term);
                        const matchText = q.questionText?.toLowerCase().includes(term);
                        if (!matchTopic && !matchText) return false;
                      }
                      return true;
                    }).length} / {teacherQuestions.length})</h4>
                    <span className="text-xs text-slate-400 font-semibold">Onaylanan sorular: +20 Puan</span>
                  </div>

                  {teacherQuestions.length === 0 ? (
                    <p className="text-slate-500 text-sm font-semibold py-8 text-center">Henüz eklediğiniz soru bulunmuyor.</p>
                  ) : (
                    <div className="space-y-4">
                      {teacherQuestions.filter((q) => {
                        if (questionFilter.subject !== "tumu" && q.subject.toLowerCase() !== questionFilter.subject.toLowerCase()) return false;
                        if (questionFilter.examType !== "tumu" && q.examType !== questionFilter.examType) return false;
                        if (questionFilter.difficulty !== "tumu" && q.difficulty !== questionFilter.difficulty) return false;
                        if (questionFilter.status !== "tumu" && q.status !== questionFilter.status) return false;
                        if (questionFilter.search.trim()) {
                          const term = questionFilter.search.toLowerCase();
                          const matchTopic = q.topic?.toLowerCase().includes(term);
                          const matchText = q.questionText?.toLowerCase().includes(term);
                          if (!matchTopic && !matchText) return false;
                        }
                        return true;
                      }).map((q) => (
                        <div key={q.id} className="p-5 bg-[#0D1B35] border border-white/10 rounded-2xl space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                                q.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400" :
                                q.status === "REJECTED" ? "bg-red-500/20 text-red-400" :
                                "bg-amber-500/20 text-amber-400 animate-pulse"
                              }`}>
                                {q.status === "APPROVED" ? "✅ Onaylandı (+ " + q.points + " Puan Alındı)" :
                                 q.status === "REJECTED" ? "❌ Reddedildi" :
                                 "⏳ Admin Onayında"}
                              </span>
                              <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">📚 {q.subject} ({q.examType})</span>
                              {q.topic && <span className="text-[10px] font-semibold bg-white/5 text-slate-400 px-2 py-0.5 rounded-full">🏷️ {q.topic}</span>}
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold">{new Date(q.createdAt).toLocaleDateString("tr-TR")}</span>
                          </div>

                          <p className="text-xs text-white font-bold whitespace-pre-wrap">{q.questionText}</p>

                          {/* Options preview */}
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[11px]">
                            {["A", "B", "C", "D", "E"].map((opt) => {
                              const val = q[`option${opt}`];
                              if (!val) return null;
                              const isCorrect = q.correctOption === opt;
                              return (
                                <div key={opt} className={`p-1.5 rounded-lg border text-center font-bold ${
                                  isCorrect ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" : "bg-white/5 border-white/5 text-slate-400"
                                }`}>
                                  {opt}: {val}
                                </div>
                              );
                            })}
                          </div>

                          {q.rejectionReason && (
                            <p className="text-xs text-red-400 font-semibold bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                              ❌ Red Nedeni: {q.rejectionReason}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── DERS İLANLARI ─── */}
            {dashboardTab === "dersler" && (
              <div className="max-w-3xl bg-[#1E293B] rounded-2xl border border-white/5 p-6">
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-white/5">
                  <div>
                    <h3 className="text-white font-black text-base">📚 Özel Ders İlanlarım</h3>
                    <p className="text-slate-500 text-xs font-semibold mt-0.5">Sitede yayınlanacak özel ders tekliflerinizi yönetin.</p>
                  </div>
                  <button onClick={() => setAddingLesson(!addingLesson)} className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-black px-4 py-2 rounded-xl transition">
                    {addingLesson ? "Vazgeç" : "➕ Yeni İlan Aç"}
                  </button>
                </div>
                {addingLesson ? (
                  <form onSubmit={handleAddLesson} className="space-y-4 max-w-lg">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Ders Başlığı</label>
                        <input type="text" required placeholder="Örn: 10. Sınıf Fizik Özel Ders" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Saatlik Ücret (TL)</label>
                        <input type="number" required placeholder="Örn: 400" value={lessonForm.price} onChange={(e) => setLessonForm({ ...lessonForm, price: e.target.value })} className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Ders Formatı</label>
                      <select value={lessonForm.format} onChange={(e) => setLessonForm({ ...lessonForm, format: e.target.value })} className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500">
                        <option value="online">Online Ders</option>
                        <option value="yuz-yuze">Yüz Yüze Ders</option>
                        <option value="her-ikisi">Online & Yüz Yüze</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Açıklama (Opsiyonel)</label>
                      <textarea rows={3} placeholder="Ders detayları..." value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500 placeholder:text-slate-600" />
                    </div>
                    <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3 rounded-xl text-xs transition">İlanı Yayınla</button>
                  </form>
                ) : teacherLessons.length === 0 ? (
                  <p className="text-slate-500 text-sm font-semibold">Henüz açtığınız bir ders ilanı bulunmuyor.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {teacherLessons.map((l) => (
                      <div key={l.id} className="p-4 bg-[#0D1B35] border border-white/10 rounded-2xl flex flex-col justify-between">
                        <div>
                          <h4 className="font-black text-sm text-white mb-1">{l.title}</h4>
                          <p className="text-xs text-indigo-400 font-black">{l.price} TL / Saat</p>
                          <span className="inline-block text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold mt-2">
                            {l.format === "online" ? "💻 Online" : l.format === "yuz-yuze" ? "🏫 Yüz Yüze" : "🔄 Her İkisi"}
                          </span>
                          {l.description && <p className="text-slate-400 text-xs font-semibold mt-2 line-clamp-2">{l.description}</p>}
                        </div>
                        <button onClick={() => handleDeleteLesson(l.id)} className="text-xs text-red-400 hover:text-red-300 font-black mt-4 pt-3 border-t border-white/5 text-right">🗑️ İlanı Kaldır</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── BLOGLAR ─── */}
            {dashboardTab === "bloglar" && (
              <div className="max-w-3xl bg-[#1E293B] rounded-2xl border border-white/5 p-6">
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-white/5">
                  <div>
                    <h3 className="text-white font-black text-base">✍️ Blog Yazılarım</h3>
                    <p className="text-slate-500 text-xs font-semibold mt-0.5">YKS rehber veya ders içeriklerinizi yazın.</p>
                  </div>
                  <button onClick={() => setWritingBlog(!writingBlog)} className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-black px-4 py-2 rounded-xl transition">
                    {writingBlog ? "Vazgeç" : "✍️ Yeni Yazı Paylaş"}
                  </button>
                </div>
                {writingBlog ? (
                  <form onSubmit={handleAddBlog} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Başlık</label>
                        <input type="text" required placeholder="Örn: TYT Net Arttırma Yöntemleri" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Kategori</label>
                        <select value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500">
                          <option value="YKS Bilgi">YKS Bilgi</option>
                          <option value="Ders Rehberleri">Ders Rehberleri</option>
                          <option value="Çalışma Teknikleri">Çalışma Teknikleri</option>
                          <option value="Genel Rehberlik">Genel Rehberlik</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">İçerik</label>
                      <textarea rows={8} required placeholder="Yazınızı buraya yazın..." value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500 placeholder:text-slate-600" />
                    </div>
                    <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3 rounded-xl text-xs transition">Yazıyı Yayınla</button>
                  </form>
                ) : teacherBlogs.length === 0 ? (
                  <p className="text-slate-500 text-sm font-semibold">Henüz paylaştığınız bir blog yazısı bulunmuyor.</p>
                ) : (
                  <div className="space-y-3">
                    {teacherBlogs.map((b) => (
                      <div key={b.id} className="p-4 bg-[#0D1B35] border border-white/10 rounded-2xl flex items-center justify-between">
                        <div>
                          <h4 className="font-black text-sm text-white">{b.title}</h4>
                          <div className="flex gap-3 text-[10px] text-slate-500 mt-1 font-bold">
                            <span>📂 {b.category}</span>
                            <span>📅 {new Date(b.createdAt).toLocaleDateString("tr-TR")}</span>
                            <a href={`/blog/${b.slug}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">🔗 Sitede Gör</a>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteBlog(b.id)} className="text-xs text-red-400 hover:text-red-300 font-black px-2.5 py-1 rounded-lg hover:bg-red-500/10">Sil</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── SSS ─── */}
            {dashboardTab === "faq" && (
              <div className="max-w-3xl bg-[#1E293B] rounded-2xl border border-white/5 p-6">
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-white/5">
                  <div>
                    <h3 className="text-white font-black text-base">❓ Sıkça Sorulan Sorular</h3>
                    <p className="text-slate-500 text-xs font-semibold mt-0.5">Profilinizde görünecek SSS listesini yönetin.</p>
                  </div>
                  <button onClick={() => setAddingFaq(!addingFaq)} className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-black px-4 py-2 rounded-xl transition">
                    {addingFaq ? "Vazgeç" : "➕ Yeni Soru Ekle"}
                  </button>
                </div>
                {addingFaq ? (
                  <form onSubmit={handleAddFaq} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Soru</label>
                      <input type="text" required placeholder="Örn: Dersleri nerede yapıyorsunuz?" value={faqForm.question} onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })} className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Cevap</label>
                      <textarea rows={3} required placeholder="Örn: Online Zoom üzerinden yapıyoruz." value={faqForm.answer} onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })} className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500 placeholder:text-slate-600" />
                    </div>
                    <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3 rounded-xl text-xs transition">Soruyu Kaydet</button>
                  </form>
                ) : teacherFaqs.length === 0 ? (
                  <p className="text-slate-500 text-sm font-semibold">Henüz eklediğiniz bir soru bulunmuyor.</p>
                ) : (
                  <div className="space-y-3">
                    {teacherFaqs.map((faq) => (
                      <div key={faq.id} className="p-4 bg-[#0D1B35] border border-white/10 rounded-2xl flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-black text-sm text-white">{faq.question}</h4>
                          <p className="text-xs text-slate-400 mt-2 font-semibold leading-relaxed">{faq.answer}</p>
                        </div>
                        <button onClick={() => handleDeleteFaq(faq.id)} className="text-xs text-red-400 hover:text-red-300 font-black px-2.5 py-1 rounded-lg hover:bg-red-500/10 flex-shrink-0">Sil</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── ÖĞRETMEN KATKI ROZETLERİ ─── */}
            {dashboardTab === "gorevler" && (
              <TeacherRewardsTab teacherId={teacherProfile?.id || 1} />
            )}

            {/* ─── MESAJLAR ─── */}
            {dashboardTab === "mesajlar" && (
              <div className="bg-[#1E293B] rounded-2xl border border-white/5 min-h-[500px] flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-64 border-r border-white/5 flex flex-col">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h4 className="font-black text-xs uppercase tracking-wider text-slate-400">Sohbetler</h4>
                    <button onClick={fetchChatRooms} className="text-[10px] text-slate-500 hover:text-white font-black">🔄 Yenile</button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {chatRooms.length === 0 ? (
                      <p className="p-4 text-xs text-slate-500 font-semibold text-center mt-8 leading-relaxed">Henüz mesaj gönderen öğrenci yok.</p>
                    ) : chatRooms.map((room) => (
                      <button key={room.id} onClick={() => setActiveRoomId(room.id)} className={`w-full text-left p-4 border-b border-white/5 flex items-center gap-3 transition-colors ${activeRoomId === room.id ? "bg-indigo-600/20 border-l-4 border-l-indigo-500" : "hover:bg-white/5"}`}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(room.studentName)}&eyebrows=default&mouth=smile`} alt="" className="w-9 h-9 rounded-full bg-slate-700 flex-shrink-0" />
                        <div className="truncate flex-1">
                          <h5 className="font-black text-xs text-white truncate">{room.studentName}</h5>
                          <p className="text-[10px] text-slate-500 font-bold mt-0.5">Sohbeti Görüntüle →</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  {activeRoomId ? (
                    <>
                      <div className="p-4 border-b border-white/5 flex items-center gap-3">
                        {(() => { const ar = chatRooms.find((r) => r.id === activeRoomId); const n = ar?.studentName || ""; return (<><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(n)}&eyebrows=default&mouth=smile`} alt="" className="w-8 h-8 rounded-full bg-slate-700" /><h4 className="font-black text-sm text-white">{n}</h4></>); })()}
                      </div>
                      <div className="flex-1 p-4 overflow-y-auto max-h-[380px] min-h-[300px] space-y-3">
                        {activeRoomMessages.length === 0 ? <p className="text-center text-xs text-slate-600 py-10 font-bold">İlk mesajı siz yazın!</p> : activeRoomMessages.map((msg) => {
                          const isMe = msg.senderRole === "teacher";
                          return (
                            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm font-semibold ${isMe ? "bg-indigo-600 text-white rounded-tr-none" : "bg-[#0D1B35] border border-white/10 text-slate-200 rounded-tl-none"}`}>
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                <span className={`text-[8px] block text-right mt-1.5 ${isMe ? "text-indigo-200" : "text-slate-500"}`}>{new Date(msg.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 flex gap-3 mt-auto">
                        <input type="text" required value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Mesajınızı yazın..." className="flex-1 bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500 placeholder:text-slate-600" />
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-5 py-2.5 rounded-xl text-xs transition">Gönder 🚀</button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                      <span className="text-5xl mb-4">💬</span>
                      <h4 className="font-black text-sm text-white">Sohbet Seçilmedi</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Sol taraftaki listeden bir sohbet seçin.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── PROFİL DÜZENLE ─── */}
            {dashboardTab === "duzenle" && (
              <div className="max-w-2xl">
                <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6">
                  <h3 className="text-white font-black text-base mb-5">⚙️ Profil Bilgilerimi Düzenle</h3>
                  <div className="mb-5">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Profil Fotoğrafı</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0D1B35] p-4 rounded-2xl border border-white/10">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                        {teacherEditForm.avatar ? <img src={teacherEditForm.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl font-black text-white">{teacherEditForm.name.charAt(0) || "?"}</span>}
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer bg-[#1E293B] hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-black text-slate-300 transition">
                            <span>📁 Yükle</span>
                            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const formData = new FormData();
                                  formData.append("file", file);
                                  const res = await fetch("/api/upload", { method: "POST", body: formData });
                                  const data = await res.json();
                                  if (data.success && data.url) {
                                    setTeacherEditForm({ ...teacherEditForm, avatar: data.url });
                                    return;
                                  }
                                } catch {}
                                const reader = new FileReader();
                                reader.onloadend = () => setTeacherEditForm({ ...teacherEditForm, avatar: reader.result as string });
                                reader.readAsDataURL(file);
                              }
                            }} />
                          </label>
                          {teacherEditForm.avatar && <button type="button" onClick={() => setTeacherEditForm({ ...teacherEditForm, avatar: "" })} className="text-xs text-red-400 hover:text-red-300 font-bold">Kaldır</button>}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {["👨‍🏫", "👩‍🏫", "🎓", "🧑‍💻", "👩‍💻", "🧑‍🎓", "👩‍🎓", "🧠", "📐", "🔬"].map((emoji) => (
                            <button key={emoji} type="button" onClick={() => { const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#1E3A8A"/><text x="50" y="65" font-size="50" text-anchor="middle">${emoji}</text></svg>`; setTeacherEditForm({ ...teacherEditForm, avatar: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` }); }} className="w-7 h-7 rounded-lg bg-[#1E293B] border border-white/10 flex items-center justify-center hover:bg-white/10 transition text-sm">{emoji}</button>
                          ))}
                        </div>
                        <input type="url" placeholder="Resim URL (https://...)" value={teacherEditForm.avatar.startsWith("data:") ? "" : teacherEditForm.avatar} onChange={(e) => setTeacherEditForm({ ...teacherEditForm, avatar: e.target.value })} className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none placeholder:text-slate-600" />
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleTeacherUpdate} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Ad Soyad</label>
                        <input type="text" value={teacherEditForm.name} onChange={(e) => setTeacherEditForm({ ...teacherEditForm, name: e.target.value })} required className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Telefon</label>
                        <input type="text" value={teacherEditForm.phone} onChange={(e) => setTeacherEditForm({ ...teacherEditForm, phone: e.target.value })} required className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Branş</label>
                        <input type="text" value={teacherEditForm.branch} onChange={(e) => setTeacherEditForm({ ...teacherEditForm, branch: e.target.value })} required className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Eğitim / Mezuniyet</label>
                        <input type="text" value={teacherEditForm.egitim} onChange={(e) => setTeacherEditForm({ ...teacherEditForm, egitim: e.target.value })} placeholder="Örn: Boğaziçi Üniversitesi" className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">LinkedIn Profil Linki</label>
                        <input type="url" value={teacherEditForm.linkedin} onChange={(e) => setTeacherEditForm({ ...teacherEditForm, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">YouTube Tanıtım Videosu</label>
                        <input type="url" value={teacherEditForm.youtube} onChange={(e) => setTeacherEditForm({ ...teacherEditForm, youtube: e.target.value })} placeholder="https://youtube.com/..." className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Öğretmen Hakkında</label>
                      <textarea rows={4} value={teacherEditForm.ozgecmis} onChange={(e) => setTeacherEditForm({ ...teacherEditForm, ozgecmis: e.target.value })} placeholder="Kendinizden bahsedin..." className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500 placeholder:text-slate-600" />
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-3 rounded-xl text-xs transition">{loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}</button>
                      <button type="button" onClick={() => setDashboardTab("panel")} className="bg-white/5 hover:bg-white/10 text-slate-300 font-black px-6 py-3 rounded-xl text-xs transition border border-white/10">Vazgeç</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    );
  }

  // ─── STUDENT DASHBOARD (SincApp-style dark sidebar layout) ───────────────────
  return (
    <div className="bg-mesh flex min-h-screen bg-[#0A1628] font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Left Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-[220px] bg-[#0D1B35] border-r border-white/5 flex flex-col z-40 transform transition-transform duration-300 ${ sidebarOpen ? "translate-x-0" : "-translate-x-full" } md:translate-x-0 md:static md:flex`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between">
          <BrandLogoHeader subBadge="ÖĞRENCİ PANELİ" />
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        {/* User info */}
        <div className="px-4 py-5 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25 flex-shrink-0">
              <div className="w-full h-full bg-[#0D1B35] rounded-[14px] overflow-hidden flex items-center justify-center font-black text-white text-lg">
                {studentProfile?.avatar ? <img src={studentProfile.avatar} alt="" className="w-full h-full object-cover" /> : studentProfile?.name.charAt(0)}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-white font-black text-sm truncate">{studentProfile?.name}</p>
              <p className="text-indigo-400 text-[10px] font-bold truncate flex items-center gap-1 mt-0.5">
                <span className={`inline-block w-2 h-2 rounded-full ${ studentProfile?.status === "İletişime Geçildi" ? "bg-emerald-400 animate-pulse" : "bg-amber-400" }`}></span>
                {studentProfile?.status === "İletişime Geçildi" ? "🎓 Öğrenci · Aktif" : "⏳ Beklemede"}
              </p>
              <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full" style={{width: `${Math.min(100, (pastSessions.length / 10) * 100)}%`}} />
              </div>
              <p className="text-slate-600 text-[9px] font-bold mt-0.5">{pastSessions.length} ders tamamlandı</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {STUDENT_NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => { setDashboardTab(item.id as any); setSidebarOpen(false); }}
              className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all text-xs font-bold overflow-hidden ${
                dashboardTab === item.id
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/50 border border-indigo-400/30 font-black"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {dashboardTab === item.id && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-indigo-300 rounded-r-full shadow-[0_0_10px_rgba(165,180,252,0.9)]" />
              )}
              <span className="text-base">{item.icon}</span>
              <span className="flex-1 truncate">{item.label}</span>
              {item.id === "mesajlar" && chatRooms.length > 0 && (
                <span className="bg-indigo-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{chatRooms.length}</span>
              )}
              {item.id === "canli" && upcomingSessions.length > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{upcomingSessions.length}</span>
              )}
            </button>
          ))}

          <div className="border-t border-white/5 pt-3 mt-3">
            <Link href="/ogretmenler" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <span className="text-base">📚</span>
              <span className="text-xs font-bold">Ders Kataloğu</span>
            </Link>
            <Link href="/blog" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <span className="text-base">📰</span>
              <span className="text-xs font-bold">Blog</span>
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-xs font-bold">
            <span className="text-base">🚪</span> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-[#0D1B35]/80 backdrop-blur border-b border-white/5 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-slate-400 hover:text-white p-1" onClick={() => setSidebarOpen(true)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h1 className="text-white font-black text-sm">
              {STUDENT_NAV.find(n => n.id === dashboardTab)?.icon} {STUDENT_NAV.find(n => n.id === dashboardTab)?.label || "Genel Görünüm"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDashboardTab("pomodoro")}
              className="hidden sm:flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-black text-xs px-3 py-1.5 rounded-xl transition"
            >
              ⏱️ Pomodoro Sayacı
            </button>
            <button
              onClick={() => setDashboardTab("puanhesapla")}
              className="hidden sm:flex items-center gap-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 font-black text-xs px-3 py-1.5 rounded-xl transition"
            >
              🧮 Puan Simülatörü
            </button>
            <button
              onClick={() => setDashboardTab("kutuphane")}
              className="hidden md:flex items-center gap-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 font-black text-xs px-3 py-1.5 rounded-xl transition"
            >
              👥 Sanal Kütüphane
            </button>
            <ThemeToggle />

            {message && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${ message.type === "success" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30" }`}>
                {message.text}
                <button onClick={() => setMessage(null)} className="opacity-60 hover:opacity-100">✕</button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">

          {/* ─── GENEL GÖRÜNÜM ─── */}
          {dashboardTab === "panel" && (
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Left: Main Dashboard */}
              <div className="flex-1 space-y-6">
                {/* Greeting & Web Push Notification Permission Button */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-white">Merhaba, {studentProfile?.name.split(" ")[0]}! 👋</h2>
                    <p className="text-slate-400 text-sm mt-1">
                      {new Date().toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                      {" • "}
                      <span className={`font-bold ${ studentProfile?.status === "İletişime Geçildi" ? "text-green-400" : "text-amber-400" }`}>
                        {studentProfile?.status === "İletişime Geçildi" ? "✅ Aktif Hesap" : "⏳ Hesap Onay Bekliyor"}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      const ok = await requestNotificationPermission();
                      if (ok) showMsg("🔔 Web Bildirimleri aktif edildi! Derslerinize 15 dk kala otomatik hatırlatma yapılacaktır.", "success");
                      else showMsg("Tarayıcı bildirim izni verilmedi veya engellendi.", "error");
                    }}
                    className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:bg-amber-500/30 text-amber-300 font-black text-xs px-4 py-2.5 rounded-xl transition shadow-lg flex items-center gap-2"
                  >
                    <span>🔔</span> Web Bildirimleri & Derse 15 Dk Kala Hatırlatıcı Aç
                  </button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/60 via-indigo-950/80 to-[#0B1329] border border-indigo-500/30 rounded-2xl p-4 shadow-xl shadow-indigo-950/80 hover:border-indigo-400/60 transition-all duration-300 group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all" />
                    <div className="flex items-center justify-between">
                      <p className="text-indigo-300 text-[10px] font-black uppercase tracking-wider">TOPLAM DERSİM</p>
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-xs font-black">🎓</div>
                    </div>
                    <p className="text-white font-black text-3xl mt-2 tracking-tight">{studentSessions.length}</p>
                    <p className="text-indigo-400/80 text-[10px] mt-1 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Tüm zamanlar
                    </p>
                  </div>

                  <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900/60 via-emerald-950/80 to-[#0B1329] border border-emerald-500/30 rounded-2xl p-4 shadow-xl shadow-emerald-950/80 hover:border-emerald-400/60 transition-all duration-300 group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all" />
                    <div className="flex items-center justify-between">
                      <p className="text-emerald-300 text-[10px] font-black uppercase tracking-wider">TAMAMLANAN</p>
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 text-xs font-black">✅</div>
                    </div>
                    <p className="text-white font-black text-3xl mt-2 tracking-tight">{pastSessions.length}</p>
                    <p className="text-emerald-400/80 text-[10px] mt-1 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Biten dersler
                    </p>
                  </div>

                  <div className="relative overflow-hidden bg-gradient-to-br from-amber-900/60 via-amber-950/80 to-[#0B1329] border border-amber-500/30 rounded-2xl p-4 shadow-xl shadow-amber-950/80 hover:border-amber-400/60 transition-all duration-300 group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all" />
                    <div className="flex items-center justify-between">
                      <p className="text-amber-300 text-[10px] font-black uppercase tracking-wider">ORT. RATİNG</p>
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 text-xs font-black">⭐</div>
                    </div>
                    <p className="text-white font-black text-3xl mt-2 tracking-tight">{avgRating ? `${avgRating}★` : "—"}</p>
                    <p className="text-amber-400/80 text-[10px] mt-1 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Öğretmen notu
                    </p>
                  </div>

                  <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/60 via-blue-950/80 to-[#0B1329] border border-blue-500/30 rounded-2xl p-4 shadow-xl shadow-blue-950/80 hover:border-blue-400/60 transition-all duration-300 group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
                    <div className="flex items-center justify-between">
                      <p className="text-blue-300 text-[10px] font-black uppercase tracking-wider">MESAJLARIM</p>
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 text-xs font-black">💬</div>
                    </div>
                    <p className="text-white font-black text-3xl mt-2 tracking-tight">{chatRooms.length}</p>
                    <p className="text-blue-400/80 text-[10px] mt-1 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Aktif sohbet
                    </p>
                  </div>
                </div>

                {/* Özet */}
                <div className="bg-gradient-to-br from-indigo-900/20 via-[#1E293B] to-[#1E293B] rounded-2xl p-5 border border-indigo-500/15">
                  <h3 className="text-white font-black text-sm mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xs">📊</span>
                    Hesap Özeti
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${ upcomingSessions.length > 0 ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]" : "bg-slate-600" }`}></span>
                      <span className="text-slate-200 text-sm font-semibold flex-1">
                        {upcomingSessions.length > 0 ? `${upcomingSessions.length} yaklaşan canlı dersiniz var` : "Yaklaşan canlı dersiniz bulunmuyor"}
                      </span>
                      {upcomingSessions.length > 0 && <span className="text-[9px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-black">YAKLAŞIYOR</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${ chatRooms.length > 0 ? "bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.6)]" : "bg-slate-600" }`}></span>
                      <span className="text-slate-200 text-sm font-semibold">
                        {chatRooms.length > 0 ? `${chatRooms.length} aktif sohbet odanız var` : "Aktif sohbet odanız bulunmuyor"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${ studentFeedbacks.length > 0 ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" : "bg-slate-600" }`}></span>
                      <span className="text-slate-200 text-sm font-semibold">
                        {studentFeedbacks.length > 0 ? `${studentFeedbacks.length} değerlendirme gönderildi` : "Henüz değerlendirme göndermediniz"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${ pastSessions.some(s => s.myFeedback?.homeworkGiven) ? "bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.6)]" : "bg-slate-600" }`}></span>
                      <span className="text-slate-200 text-sm font-semibold">
                        {pastSessions.filter(s => s.myFeedback?.homeworkGiven).length > 0 ? `${pastSessions.filter(s => s.myFeedback?.homeworkGiven).length} bekleyen ödeviniz var` : "Bekleyen ödeviniz yok"}
                      </span>
                    </div>
                  </div>
                  {/* Ders tamamlama progress */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-slate-500 text-[10px] font-black uppercase tracking-wider">Ders İlerlemesi</span>
                      <span className="text-indigo-400 text-[10px] font-black">{pastSessions.length}/10 ders</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full transition-all duration-700"
                        style={{width: `${Math.min(100, (pastSessions.length / 10) * 100)}%`}}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Action Cards */}
                <div>
                  <h3 className="text-white font-black text-sm mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-amber-500/20 flex items-center justify-center text-xs">⚡</span>
                    Hızlı Erişim
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { icon: "🎥", label: "Canlı Derslerim", sub: `${upcomingSessions.length} yaklaşan`, tab: "canli", color: "from-red-600/30 to-red-900/40 border-red-500/30 hover:border-red-500/60 hover:shadow-[0_4px_20px_rgba(239,68,68,0.2)]" },
                      { icon: "💬", label: "Öğretmenimle Konuş", sub: `${chatRooms.length} sohbet`, tab: "mesajlar", color: "from-blue-600/30 to-blue-900/40 border-blue-500/30 hover:border-blue-500/60 hover:shadow-[0_4px_20px_rgba(59,130,246,0.2)]" },
                      { icon: "⭐", label: "Değerlendirme Yap", sub: "Görüş gönder", tab: "degerlendirme", color: "from-amber-600/30 to-amber-900/40 border-amber-500/30 hover:border-amber-500/60 hover:shadow-[0_4px_20px_rgba(245,158,11,0.2)]" },
                      { icon: "⚙️", label: "Profilimi Düzenle", sub: "Bilgileri güncelle", tab: "duzenle", color: "from-slate-600/30 to-slate-900/40 border-slate-500/30 hover:border-slate-400/60 hover:shadow-[0_4px_20px_rgba(100,116,139,0.2)]" },
                    ].map((card) => (
                      <button
                        key={card.tab}
                        onClick={() => setDashboardTab(card.tab as any)}
                        className={`card-hover bg-gradient-to-br ${card.color} border rounded-2xl p-4 text-left transition-all hover:scale-[1.02] group`}
                      >
                        <span className="text-3xl block mb-3">{card.icon}</span>
                        <p className="text-white font-black text-xs">{card.label}</p>
                        <p className="text-slate-400 text-[10px] font-bold mt-0.5">{card.sub}</p>
                      </button>
                    ))}
                    <Link href="/ogretmenler" className={`card-hover bg-gradient-to-br from-purple-600/30 to-purple-900/40 border border-purple-500/30 hover:border-purple-500/60 hover:shadow-[0_4px_20px_rgba(168,85,247,0.2)] rounded-2xl p-4 text-left transition-all hover:scale-[1.02]`}>
                      <span className="text-3xl block mb-3">📚</span>
                      <p className="text-white font-black text-xs">Ders Bul</p>
                      <p className="text-slate-400 text-[10px] font-bold mt-0.5">Öğretmenleri gör</p>
                    </Link>
                    <Link href="/blog" className={`card-hover bg-gradient-to-br from-emerald-600/30 to-emerald-900/40 border border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-[0_4px_20px_rgba(16,185,129,0.2)] rounded-2xl p-4 text-left transition-all hover:scale-[1.02]`}>
                      <span className="text-3xl block mb-3">📰</span>
                      <p className="text-white font-black text-xs">Blog Oku</p>
                      <p className="text-slate-400 text-[10px] font-bold mt-0.5">Bilgi kazan</p>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right: Upcoming Sessions Panel */}
              <div className="xl:w-72 space-y-4">
                <div className="bg-[#1E293B] rounded-2xl border border-white/5 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-white font-black text-xs uppercase tracking-wider">📅 Bugünkü & Yaklaşan Dersler</h3>
                    <button onClick={() => setDashboardTab("canli")} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-black">Tümü →</button>
                  </div>
                  <div className="p-3 space-y-2">
                    {upcomingSessions.length === 0 ? (
                      <div className="py-6 text-center">
                        <span className="text-3xl block mb-2">📭</span>
                        <p className="text-slate-500 text-xs font-bold">Yaklaşan dersiniz yok</p>
                      </div>
                    ) : upcomingSessions.slice(0, 4).map((s) => (
                      <SessionCardDark key={s.id} session={s} role="student" />
                    ))}
                  </div>
                </div>

                {/* Profil Bilgi Kutusu */}
                <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-4">
                  <h3 className="text-white font-black text-xs uppercase tracking-wider mb-3">👤 Hesap Bilgileri</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-slate-500 font-bold">E-posta</span><span className="text-slate-300 font-bold truncate ml-2 max-w-[130px]">{studentProfile?.email}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-bold">Telefon</span><span className="text-slate-300 font-bold">{studentProfile?.phone}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-bold">Durum</span><span className={`font-bold ${ studentProfile?.status === "İletişime Geçildi" ? "text-green-400" : "text-amber-400" }`}>{studentProfile?.status}</span></div>
                  </div>
                  <button onClick={() => setDashboardTab("duzenle")} className="w-full mt-4 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-300 font-black text-xs px-4 py-2 rounded-xl transition">
                    ✏️ Düzenle
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── CANLİ DERSLER ─── */}
          {dashboardTab === "canli" && studentProfile && (
            <div className="max-w-3xl">
              <StudentSessionsTab userId={studentProfile.id} />
            </div>
          )}

          {/* ─── MESAJLAR ─── */}
          {dashboardTab === "mesajlar" && (
            <div className="bg-[#1E293B] rounded-2xl border border-white/5 shadow-sm overflow-hidden min-h-[500px] flex flex-col md:flex-row">
              <div className="w-full md:w-64 border-r border-white/5 flex flex-col">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <h4 className="font-black text-xs uppercase tracking-wider text-slate-400">Sohbetler</h4>
                  <button onClick={fetchChatRooms} className="text-[10px] text-slate-500 hover:text-white font-black">🔄</button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {chatRooms.length === 0 ? (
                    <p className="p-4 text-xs text-slate-500 font-semibold text-center mt-8 leading-relaxed">Henüz aktif sohbetiniz yok.<br />Öğretmen profillerinden mesaj başlatabilirsiniz.</p>
                  ) : chatRooms.map((room) => {
                    const nameToShow = room.teacherName;
                    return (
                      <button key={room.id} onClick={() => setActiveRoomId(room.id)} className={`w-full text-left p-4 border-b border-white/5 flex items-center gap-3 transition-colors ${ activeRoomId === room.id ? "bg-indigo-600/20 border-l-4 border-l-indigo-500" : "hover:bg-white/5" }`}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nameToShow)}&eyebrows=default&mouth=smile`} alt="" className="w-9 h-9 rounded-full bg-slate-700 flex-shrink-0" />
                        <div className="truncate flex-1"><h5 className="font-black text-xs text-white truncate">{nameToShow}</h5><p className="text-[10px] text-slate-500 font-bold mt-0.5">Sohbeti Görüntüle →</p></div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                {activeRoomId ? (
                  <>
                    <div className="p-4 border-b border-white/5 flex items-center gap-3">
                      {(() => { const activeRoom = chatRooms.find((r) => r.id === activeRoomId); const name = activeRoom?.teacherName || ""; return (<><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&eyebrows=default&mouth=smile`} alt="" className="w-8 h-8 rounded-full bg-slate-700" /><h4 className="font-black text-sm text-white">{name}</h4></>); })()}
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto max-h-[380px] min-h-[300px] space-y-3">
                      {activeRoomMessages.length === 0 ? <p className="text-center text-xs text-slate-600 py-10 font-bold">İlk mesajı siz yazın!</p> : activeRoomMessages.map((msg) => {
                        const isMe = msg.senderRole === "student";
                        return (
                          <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm font-semibold ${ isMe ? "bg-indigo-600 text-white rounded-tr-none" : "bg-[#0D1B35] border border-white/10 text-slate-200 rounded-tl-none" }`}>
                              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                              <span className={`text-[8px] block text-right mt-1.5 ${isMe ? "text-indigo-200" : "text-slate-500"}`}>{new Date(msg.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 flex gap-3 mt-auto">
                      <input type="text" required value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Mesajınızı yazın..." className="flex-1 bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500 placeholder:text-slate-600" />
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-5 py-2.5 rounded-xl text-xs transition">Gönder 🚀</button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <span className="text-5xl mb-4">💬</span>
                    <h4 className="font-black text-sm text-white">Sohbet Seçilmedi</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-1">Sol taraftaki listeden bir sohbet seçin.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── DEĞERLENDİRMELER ─── */}
          {dashboardTab === "degerlendirme" && (
            <div className="max-w-3xl grid md:grid-cols-2 gap-6">
              <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5">
                <h3 className="text-white font-black text-base mb-4">Görüş / Randevu Talebi Gönder</h3>
                <form onSubmit={handleSendFeedback} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Öğretmen Seçin</label>
                    <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)} required className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500">
                      <option value="">Lütfen listeden seçin...</option>
                      <optgroup label="Sistem Öğretmenleri">
                        {hocalar.map((h) => <option key={`static-${h.id}`} value={`static-${h.id}`}>{h.isim} ({h.dersler.join(", ")})</option>)}
                      </optgroup>
                      {dbTeachers.length > 0 && <optgroup label="Kayıtlı Öğretmenler">{dbTeachers.map((h) => <option key={h.id} value={h.id}>{h.name} ({h.branch})</option>)}</optgroup>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Puanınız (1-5)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button key={num} type="button" onClick={() => setFeedbackRating(num)} className={`w-10 h-10 rounded-xl font-black text-sm transition-all border ${ feedbackRating === num ? "bg-amber-500 text-white border-amber-500" : "bg-[#0D1B35] text-slate-400 border-white/10" }`}>{num} ★</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Görüş ve Randevu Mesajınız</label>
                    <textarea rows={4} value={feedbackContent} onChange={(e) => setFeedbackContent(e.target.value)} required placeholder="Ders almak istediğiniz günleri ve hedeflerinizi yazın..." className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500 placeholder:text-slate-600" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3.5 rounded-xl text-sm transition-all">Görüşü / Randevu Talebini İlet</button>
                </form>
              </div>
              <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5">
                <h3 className="text-white font-black text-base mb-4">Taleplerim & Görüşlerim ({studentFeedbacks.length})</h3>
                {studentFeedbacks.length === 0 ? (
                  <p className="text-xs text-slate-500 font-bold">Henüz bir görüş veya ders talebi iletmemişsiniz.</p>
                ) : (
                  <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                    {studentFeedbacks.map((f) => (
                      <div key={f.id} className="p-3 bg-[#0D1B35] border border-white/5 rounded-xl">
                        <div className="flex justify-between items-center mb-1.5"><span className="font-black text-xs text-white">{f.teacherName}</span><span className="text-amber-400 font-bold text-xs">{f.rating} ★</span></div>
                        <p className="text-slate-300 text-xs font-semibold leading-relaxed">{f.content}</p>
                        <span className="text-[9px] text-slate-600 block text-right mt-2">{new Date(f.createdAt).toLocaleDateString("tr-TR")}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── SORU BANKASI & TEST ÇÖZ ─── */}
          {dashboardTab === "sorucozum" && <StudentQuizTab studentId={studentProfile?.id} />}

          {/* ─── YANLIŞ SORU DEFTERİM ─── */}
          {dashboardTab === "yanlissorular" && (
            <StudentWrongQuestionsTab studentId={studentProfile?.id || 1} />
          )}

          {/* ─── DENEME NET TAKİBİ ─── */}
          {dashboardTab === "denemenet" && (
            <StudentTrialTab studentId={studentProfile?.id || 1} />
          )}

          {/* ─── YKS KONU ÇETELESİ ─── */}
          {dashboardTab === "konutakip" && (
            <StudentTopicTab studentId={studentProfile?.id || 1} />
          )}

          {/* ─── LİDERLİK TABLOSU & ROZETLER ─── */}
          {dashboardTab === "liderlik" && (
            <StudentLeaderboardTab currentStudentId={studentProfile?.id || 1} />
          )}

          {/* ─── PUAN & SIRALAMA SİMÜLATÖRÜ ─── */}
          {dashboardTab === "puanhesapla" && <OsymCalculator />}

          {/* ─── POMODORO & ÇALIŞMA MÜZİKLERİ ─── */}
          {dashboardTab === "pomodoro" && <PomodoroTimer />}

          {/* ─── 7/24 SANAL KÜTÜPHANE ─── */}
          {dashboardTab === "kutuphane" && <VirtualStudyRooms />}

          {/* ─── PROFİL DÜZENLE ─── */}
          {dashboardTab === "duzenle" && (
            <div className="max-w-xl">
              <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6">
                <h3 className="text-white font-black text-base mb-5">⚙️ Profil Bilgilerimi Düzenle</h3>
                <div className="mb-5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Profil Fotoğrafı</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0D1B35] p-4 rounded-2xl border border-white/10">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                      {studentEditForm.avatar ? <img src={studentEditForm.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl font-black text-white">{studentEditForm.name.charAt(0) || "?"}</span>}
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer bg-[#1E293B] hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-black text-slate-300 transition">
                          <span>📁 Yükle</span>
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const formData = new FormData();
                                formData.append("file", file);
                                const res = await fetch("/api/upload", { method: "POST", body: formData });
                                const data = await res.json();
                                if (data.success && data.url) {
                                  setStudentEditForm({ ...studentEditForm, avatar: data.url });
                                  return;
                                }
                              } catch {}
                              const reader = new FileReader();
                              reader.onloadend = () => setStudentEditForm({ ...studentEditForm, avatar: reader.result as string });
                              reader.readAsDataURL(file);
                            }
                          }} />
                        </label>
                        {studentEditForm.avatar && <button type="button" onClick={() => setStudentEditForm({ ...studentEditForm, avatar: "" })} className="text-xs text-red-400 hover:text-red-300 font-bold">Kaldır</button>}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {["👨🎓", "👩🎓", "🎓", "🧑💻", "👩💻", "⚡", "📚", "🎯"].map((emoji) => (
                          <button key={emoji} type="button" onClick={() => { const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#1E3A8A"/><text x="50" y="65" font-size="50" text-anchor="middle">${emoji}</text></svg>`; setStudentEditForm({ ...studentEditForm, avatar: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` }); }} className="w-7 h-7 rounded-lg bg-[#1E293B] border border-white/10 flex items-center justify-center hover:bg-white/10 transition text-sm">{emoji}</button>
                        ))}
                      </div>
                      <input type="url" placeholder="Resim URL (https://...)" value={studentEditForm.avatar.startsWith("data:") ? "" : studentEditForm.avatar} onChange={(e) => setStudentEditForm({ ...studentEditForm, avatar: e.target.value })} className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none placeholder:text-slate-600" />
                    </div>
                  </div>
                </div>
                <form onSubmit={handleStudentUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Ad Soyad</label>
                    <input type="text" value={studentEditForm.name} onChange={(e) => setStudentEditForm({ ...studentEditForm, name: e.target.value })} required className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Telefon</label>
                    <input type="text" value={studentEditForm.phone} onChange={(e) => setStudentEditForm({ ...studentEditForm, phone: e.target.value })} required className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-3 rounded-xl text-xs transition">{loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}</button>
                    <button type="button" onClick={() => setDashboardTab("panel")} className="bg-white/5 hover:bg-white/10 text-slate-300 font-black px-6 py-3 rounded-xl text-xs transition border border-white/10">Vazgeç</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Mobile Bottom Navigation Dock */}
      {(studentProfile || teacherProfile) && (
        <MobileBottomDock activeTab={dashboardTab} onTabChange={(tabId) => setDashboardTab(tabId)} />
      )}
    </div>
  );
}


