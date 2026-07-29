"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { hocalar } from "@/data/hocalar";
import Link from "next/link";

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
  const isEnded = session.status === "ENDED" || nowMs > endMs;
  const isLive = session.status === "LIVE";
  const canJoin = !isEnded && (isLive || role === "teacher" || nowMs >= fifteenMinsBefore);

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
  const isEnded = session.status === "ENDED" || nowMs > endMs;
  const isLive = session.status === "LIVE";
  const canJoin = !isEnded && (isLive || role === "teacher" || nowMs >= fifteenMinsBefore);

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
  if (loading) return <div className="py-12 text-center text-slate-500 font-semibold">Yükleniyor...</div>;
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

function StudentQuizTab() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: "tumu",
    examType: "tumu",
    difficulty: "tumu",
    topic: "",
  });

  const [userAnswers, setUserAnswers] = useState<Record<number, { selectedOption: string; isCorrect: boolean; showSolution: boolean }>>({});

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

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSelectOption = (questionId: number, opt: string, correctOpt: string) => {
    const isCorrect = opt === correctOpt;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        selectedOption: opt,
        isCorrect,
        showSolution: prev[questionId]?.showSolution || false,
      },
    }));
  };

  const toggleSolution = (questionId: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedOption: prev[questionId]?.selectedOption || "",
        isCorrect: prev[questionId]?.isCorrect || false,
        showSolution: !prev[questionId]?.showSolution,
      },
    }));
  };

  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = Object.values(userAnswers).filter((a) => a.isCorrect).length;

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>📝</span> Soru Bankası & İnteraktif Test Çözümü
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Öğretmenler tarafından onaylanan ÖSYM tipi soruları çözün, kendinizi test edin ve çözümleri inceleyin.
          </p>
        </div>

        {answeredCount > 0 && (
          <div className="flex items-center gap-3 bg-[#0D1B35] border border-white/10 px-4 py-2 rounded-xl">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Çözülen</span>
              <span className="text-sm font-black text-white">{answeredCount}</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="text-center">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">Doğru</span>
              <span className="text-sm font-black text-emerald-400">{correctCount}</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="text-center">
              <span className="text-[10px] text-indigo-400 font-bold uppercase block">Başarı Oranı</span>
              <span className="text-sm font-black text-indigo-400">%{Math.round((correctCount / answeredCount) * 100)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Bar */}
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
            placeholder="Konu Adında Ara..."
            value={filters.topic}
            onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
            className="bg-[#0D1B35] border border-white/10 text-white text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 font-semibold">Sorular yükleniyor...</div>
      ) : questions.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl p-12 text-center text-slate-500 font-semibold border border-white/5">
          Seçtiğiniz kriterlere uygun onaylanmış soru bulunamadı.
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const answerState = userAnswers[q.id];
            const hasAnswered = !!answerState?.selectedOption;

            return (
              <div key={q.id} className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl relative">
                {/* Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                      Soru #{idx + 1}
                    </span>
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

                {/* Question Text */}
                <div className="font-bold text-white text-base leading-relaxed whitespace-pre-wrap bg-[#0D1B35] p-5 rounded-2xl border border-white/5">
                  {q.questionText}
                </div>

                {q.imageUrl && (
                  <div className="max-w-lg my-3">
                    <img src={q.imageUrl} alt="Soru Görseli" className="rounded-2xl border border-white/10 max-h-72 object-contain" />
                  </div>
                )}

                {/* Interactive Options A-E */}
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {["A", "B", "C", "D", "E"].map((opt) => {
                    const optVal = q[`option${opt}`];
                    if (!optVal && opt !== "A" && opt !== "B") return null;

                    const isSelected = answerState?.selectedOption === opt;
                    const isCorrectOpt = q.correctOption === opt;

                    let btnStyle = "bg-[#0D1B35] border-white/10 text-slate-300 hover:bg-white/5";
                    if (hasAnswered) {
                      if (isCorrectOpt) {
                        btnStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-black shadow-lg shadow-emerald-900/30";
                      } else if (isSelected && !isCorrectOpt) {
                        btnStyle = "bg-red-500/20 border-red-500/50 text-red-300 font-bold";
                      }
                    }

                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelectOption(q.id, opt, q.correctOption)}
                        className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all text-xs ${btnStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 ${
                          hasAnswered && isCorrectOpt ? "bg-emerald-500 text-white" :
                          hasAnswered && isSelected ? "bg-red-500 text-white" :
                          "bg-white/10 text-slate-200"
                        }`}>{opt}</span>
                        <span className="flex-1 mt-0.5 leading-relaxed">{optVal}</span>
                        {hasAnswered && isCorrectOpt && <span className="text-emerald-400 font-black">✓ Doğru</span>}
                        {hasAnswered && isSelected && !isCorrectOpt && <span className="text-red-400 font-bold">✕ Yanlış</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Result & Solution Button */}
                {hasAnswered && (
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black px-3 py-1 rounded-xl ${ answerState.isCorrect ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30" }`}>
                        {answerState.isCorrect ? "🎉 Tebrikler! Doğru Cevap" : `❌ Yanlış Cevap. Doğru Şık: ${q.correctOption}`}
                      </span>
                    </div>

                    {q.solutionText && (
                      <button
                        onClick={() => toggleSolution(q.id)}
                        className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 font-bold text-xs px-4 py-2 rounded-xl transition"
                      >
                        {answerState.showSolution ? "💡 Çözümü Gizle" : "💡 Detaylı Çözümü Göster"}
                      </button>
                    )}
                  </div>
                )}

                {/* Solution Content */}
                {answerState?.showSolution && q.solutionText && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-300 space-y-1">
                    <p className="font-black text-amber-400 uppercase tracking-wider">💡 Detaylı Çözüm:</p>
                    <p className="font-semibold whitespace-pre-wrap leading-relaxed">{q.solutionText}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
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
  if (loading) return <div className="py-12 text-center text-gray-400 font-semibold">Yükleniyor...</div>;
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

// ─── Interfaces ────────────────────────────────────────────────────────────────
interface Student { id: number; name: string; phone: string; email: string; status: string; avatar?: string | null; }
interface Teacher { id: number; name: string; phone: string; email: string; branch: string; status: string; egitim?: string | null; ozgecmis?: string | null; linkedin?: string | null; youtube?: string | null; avatar?: string | null; }
interface Feedback { id: number; studentName: string; studentEmail: string | null; teacherId: number; teacherName: string; content: string; rating: number; createdAt: string; }

// ─── Student Sidebar Nav Items ─────────────────────────────────────────────────
const STUDENT_NAV = [
  { id: "panel",         icon: "🏠", label: "Genel Görünüm" },
  { id: "canli",         icon: "🎥", label: "Canlı Derslerim" },
  { id: "sorucozum",     icon: "📝", label: "Soru Bankası & Test Çöz" },
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

  const [dashboardTab, setDashboardTab] = useState<"panel" | "duzenle" | "dersler" | "bloglar" | "faq" | "mesajlar" | "canli" | "degerlendirme" | "gorevler" | "sorular" | "sorucozum">("panel");
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

  // Load student sessions for sidebar preview
  const fetchStudentSessions = useCallback(async (userId: number) => {
    try {
      const res = await fetch("/api/user/my-sessions", { headers: { "x-user-id": String(userId), "x-user-role": "student" } });
      const d = await res.json();
      if (d.success) setStudentSessions(d.sessions || []);
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
      <div className="bg-[#FAF8F5] min-h-screen py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#B45309] text-xs font-black uppercase tracking-widest block mb-2">DERSLİNEX PORTALI</span>
            <h1 className="text-4xl sm:text-5xl font-black text-[#1E3A8A] leading-tight">Profil & Giriş Sistemi</h1>
            <p className="text-gray-500 font-semibold mt-2">Öğrenci veya öğretmen hesabı oluşturarak derslerinizi, görüş ve randevu taleplerinizi yönetin.</p>
          </div>
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-bold border flex items-center justify-between ${ message.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200" }`}>
              <span>{message.text}</span>
              <button className="text-xs opacity-60 hover:opacity-100" onClick={() => setMessage(null)}>✕</button>
            </div>
          )}
          <div className="space-y-6">
            <div className="grid grid-cols-2 bg-white/70 backdrop-blur border border-[#EFECE6] p-1.5 rounded-2xl shadow-sm">
              <button onClick={() => { setRole("student"); setAuthMode("login"); }} className={`py-3 px-4 text-xs sm:text-sm font-black rounded-xl transition-all duration-200 ${ role === "student" ? "bg-[#1E3A8A] text-white shadow-sm" : "text-gray-600 hover:bg-white" }`}>🎓 Öğrenci Giriş/Kayıt</button>
              <button onClick={() => { setRole("teacher"); setAuthMode("login"); }} className={`py-3 px-4 text-xs sm:text-sm font-black rounded-xl transition-all duration-200 ${ role === "teacher" ? "bg-[#1E3A8A] text-white shadow-sm" : "text-gray-600 hover:bg-white" }`}>👨🏫 Öğretmen Giriş/Kayıt</button>
            </div>
            <div className="text-center">
              <span className="text-xs text-gray-500 font-bold">
                {authMode === "login" ? "Hesabınız yok mu?" : "Zaten üye misiniz?"}{" "}
                <button onClick={() => setAuthMode(authMode === "login" ? "register" : "login")} className="text-[#B45309] font-black underline ml-1 hover:text-[#92400E]">
                  {authMode === "login" ? "Kayıt Olun" : "Giriş Yapın"}
                </button>
              </span>
            </div>
            <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-black text-[#1E3A8A] mb-6 text-center">
                {role === "student" ? "🎓 Öğrenci" : "👨🏫 Öğretmen"}{" "}{authMode === "login" ? "Giriş Paneli" : "Kayıt Paneli"}
              </h3>
              {role === "student" ? (
                <form onSubmit={handleStudentAuth} className="space-y-4">
                  {authMode === "register" && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Adı Soyadı</label><input type="text" required value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none" /></div>
                      <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Telefon</label><input type="text" required placeholder="05xx xxx xx xx" value={studentForm.phone} onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none" /></div>
                    </div>
                  )}
                  <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">E-posta Adresi</label><input type="email" required value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none" /></div>
                  <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Şifre</label><input type="password" required value={studentForm.password} onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none" /></div>
                  <div className="flex items-center gap-2 pt-1"><input type="checkbox" id="studentRemember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded" /><label htmlFor="studentRemember" className="text-xs text-gray-500 font-bold select-none cursor-pointer">Beni Hatırla</label></div>
                  <button type="submit" disabled={loading} className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black py-3.5 rounded-xl text-sm transition-all">{loading ? "İşlem yapılıyor..." : authMode === "login" ? "Giriş Yap" : "Kayıt Ol"}</button>
                </form>
              ) : (
                <form onSubmit={handleTeacherAuth} className="space-y-4">
                  {authMode === "register" && (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Adı Soyadı</label><input type="text" required value={teacherForm.name} onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none" /></div>
                        <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Telefon</label><input type="text" required placeholder="05xx xxx xx xx" value={teacherForm.phone} onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none" /></div>
                      </div>
                      <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Uzmanlık Branşınız</label><input type="text" required placeholder="Matematik, Fizik vb." value={teacherForm.branch} onChange={(e) => setTeacherForm({ ...teacherForm, branch: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none" /></div>
                    </>
                  )}
                  <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">E-posta Adresi</label><input type="email" required value={teacherForm.email} onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none" /></div>
                  <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Şifre</label><input type="password" required value={teacherForm.password} onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none" /></div>
                  <div className="flex items-center gap-2 pt-1"><input type="checkbox" id="teacherRemember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded" /><label htmlFor="teacherRemember" className="text-xs text-gray-500 font-bold select-none cursor-pointer">Beni Hatırla</label></div>
                  <button type="submit" disabled={loading} className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black py-3.5 rounded-xl text-sm transition-all">{loading ? "İşlem yapılıyor..." : authMode === "login" ? "Giriş Yap" : "Başvuru Yap & Kaydol"}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── TEACHER DASHBOARD (SincApp-style dark sidebar layout) ───────────────────
  if (teacherProfile) {
    return (
      <div className="flex min-h-screen bg-[#0A1628] font-sans">
        {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
        
        {/* Left Sidebar */}
        <aside className={`fixed top-0 left-0 h-full w-[220px] bg-[#0D1B35] border-r border-white/5 flex flex-col z-40 transform transition-transform duration-300 ${ sidebarOpen ? "translate-x-0" : "-translate-x-full" } md:translate-x-0 md:static md:flex`}>
          <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between">
            <BrandLogoHeader subBadge="ÖĞRETMEN PANELİ" />
            <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>✕</button>
          </div>
          <div className="px-4 py-4 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 flex-shrink-0">
                <div className="w-full h-full bg-[#0D1B35] rounded-[10px] overflow-hidden flex items-center justify-center font-black text-white text-sm">
                  {teacherProfile.avatar ? <img src={teacherProfile.avatar} alt="" className="w-full h-full object-cover" /> : teacherProfile.name.charAt(0)}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-white font-black text-xs truncate">{teacherProfile.name}</p>
                <p className="text-indigo-400 text-[10px] font-bold truncate flex items-center gap-1 mt-0.5">
                  <span className={`inline-block w-2 h-2 rounded-full ${ teacherProfile.status === "İletişime Geçildi" ? "bg-emerald-400 animate-pulse" : "bg-amber-400" }`}></span>
                  {teacherProfile.status === "İletişime Geçildi" ? "Öğretmen (Yayında)" : "Onay Bekliyor"}
                </p>
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
                            <span>📁 Fotoğraf Seç</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setTeacherEditForm({ ...teacherEditForm, avatar: reader.result as string }); reader.readAsDataURL(file); }}} />
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
    <div className="flex min-h-screen bg-[#0A1628] font-sans">
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
        <div className="px-4 py-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 flex-shrink-0">
              <div className="w-full h-full bg-[#0D1B35] rounded-[10px] overflow-hidden flex items-center justify-center font-black text-white text-sm">
                {studentProfile?.avatar ? <img src={studentProfile.avatar} alt="" className="w-full h-full object-cover" /> : studentProfile?.name.charAt(0)}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-white font-black text-xs truncate">{studentProfile?.name}</p>
              <p className="text-indigo-400 text-[10px] font-bold truncate flex items-center gap-1 mt-0.5">
                <span className={`inline-block w-2 h-2 rounded-full ${ studentProfile?.status === "İletişime Geçildi" ? "bg-emerald-400 animate-pulse" : "bg-amber-400" }`}></span>
                {studentProfile?.status === "İletişime Geçildi" ? "Aktif Hesap" : "Hesap Beklemede"}
              </p>
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
          {message && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${ message.type === "success" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30" }`}>
              {message.text}
              <button onClick={() => setMessage(null)} className="opacity-60 hover:opacity-100">✕</button>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">

          {/* ─── GENEL GÖRÜNÜM ─── */}
          {dashboardTab === "panel" && (
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Left: Main Dashboard */}
              <div className="flex-1 space-y-6">
                {/* Greeting */}
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
                <div className="bg-[#1E293B] rounded-2xl p-5 border border-white/5">
                  <h3 className="text-white font-black text-sm mb-4 flex items-center gap-2">📊 Özet</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ upcomingSessions.length > 0 ? "bg-green-400" : "bg-slate-600" }`}></span>
                      <span className="text-slate-300 text-sm font-semibold">
                        {upcomingSessions.length > 0 ? `${upcomingSessions.length} yaklaşan canlı dersiniz var` : "Yaklaşan canlı dersiniz bulunmuyor"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ chatRooms.length > 0 ? "bg-blue-400" : "bg-slate-600" }`}></span>
                      <span className="text-slate-300 text-sm font-semibold">
                        {chatRooms.length > 0 ? `${chatRooms.length} aktif sohbet odanız var` : "Aktif sohbet odanız bulunmuyor"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ studentFeedbacks.length > 0 ? "bg-amber-400" : "bg-slate-600" }`}></span>
                      <span className="text-slate-300 text-sm font-semibold">
                        {studentFeedbacks.length > 0 ? `${studentFeedbacks.length} değerlendirme gönderildi` : "Henüz değerlendirme göndermediniz"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ pastSessions.some(s => s.myFeedback?.homeworkGiven) ? "bg-purple-400" : "bg-slate-600" }`}></span>
                      <span className="text-slate-300 text-sm font-semibold">
                        {pastSessions.filter(s => s.myFeedback?.homeworkGiven).length > 0 ? `${pastSessions.filter(s => s.myFeedback?.homeworkGiven).length} bekleyen ödeviniz var` : "Bekleyen ödeviniz yok"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Cards */}
                <div>
                  <h3 className="text-white font-black text-sm mb-3">⚡ Hızlı Erişim</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { icon: "🎥", label: "Canlı Derslerim", sub: `${upcomingSessions.length} yaklaşan`, tab: "canli", color: "from-red-600/20 to-red-900/20 border-red-500/20 hover:border-red-500/40" },
                      { icon: "💬", label: "Öğretmenimle Konuş", sub: `${chatRooms.length} sohbet`, tab: "mesajlar", color: "from-blue-600/20 to-blue-900/20 border-blue-500/20 hover:border-blue-500/40" },
                      { icon: "⭐", label: "Değerlendirme Yap", sub: "Görüş gönder", tab: "degerlendirme", color: "from-amber-600/20 to-amber-900/20 border-amber-500/20 hover:border-amber-500/40" },
                      { icon: "⚙️", label: "Profilimi Düzenle", sub: "Bilgileri güncelle", tab: "duzenle", color: "from-slate-600/20 to-slate-900/20 border-slate-500/20 hover:border-slate-500/40" },
                    ].map((card) => (
                      <button
                        key={card.tab}
                        onClick={() => setDashboardTab(card.tab as any)}
                        className={`bg-gradient-to-br ${card.color} border rounded-2xl p-4 text-left transition-all hover:scale-105 group`}
                      >
                        <span className="text-2xl block mb-2">{card.icon}</span>
                        <p className="text-white font-black text-xs">{card.label}</p>
                        <p className="text-slate-400 text-[10px] font-bold mt-0.5">{card.sub}</p>
                      </button>
                    ))}
                    <Link href="/ogretmenler" className={`bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-4 text-left transition-all hover:scale-105`}>
                      <span className="text-2xl block mb-2">📚</span>
                      <p className="text-white font-black text-xs">Ders Bul</p>
                      <p className="text-slate-400 text-[10px] font-bold mt-0.5">Öğretmenleri gör</p>
                    </Link>
                    <Link href="/blog" className={`bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-4 text-left transition-all hover:scale-105`}>
                      <span className="text-2xl block mb-2">📰</span>
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
          {dashboardTab === "sorucozum" && <StudentQuizTab />}

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
                          <span>📁 Fotoğraf Seç</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setStudentEditForm({ ...studentEditForm, avatar: reader.result as string }); reader.readAsDataURL(file); }}} />
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
    </div>
  );
}
