"use client";

import React, { useState } from "react";

export interface QuestionPoolItem {
  id: number;
  subject: string;
  examType: string;
  topic?: string | null;
  difficulty: string;
  questionText: string;
  points: number;
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
  createdAt: string;
}

interface TeacherQuestionPoolProps {
  questions: QuestionPoolItem[];
}

export default function TeacherQuestionPool({ questions }: TeacherQuestionPoolProps) {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [testFormula, setTestFormula] = useState<string>("f(x) = x^2 + 2x + 1 (Delta: b^2 - 4ac)");
  const [showFormulaTester, setShowFormulaTester] = useState<boolean>(false);

  const filtered = filterStatus === "ALL"
    ? questions
    : questions.filter((q) => q.status === filterStatus);

  const getStatusBadge = (status: QuestionPoolItem["status"]) => {
    switch (status) {
      case "APPROVED":
        return <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2.5 py-0.5 rounded-full text-xs font-medium">Onaylandı</span>;
      case "REJECTED":
        return <span className="bg-rose-950 text-rose-400 border border-rose-800/80 px-2.5 py-0.5 rounded-full text-xs font-medium">Reddedildi</span>;
      case "PENDING_APPROVAL":
      default:
        return <span className="bg-amber-950 text-amber-400 border border-amber-800/80 px-2.5 py-0.5 rounded-full text-xs font-medium">Onay Bekliyor</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>📚</span> Soru Havuzu ve Onay Takibi
          </h3>
          <p className="text-xs text-slate-400">Sisteme yüklediğiniz soruların yayınlanma durumları ve onay takibi</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFormulaTester(!showFormulaTester)}
            className="bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/50 text-xs font-bold px-3.5 py-1.5 rounded-lg transition"
          >
            {showFormulaTester ? "✕ Formül Önizleyiciyi Kapat" : "🧮 Canlı Formül Test Edici"}
          </button>
        </div>
      </div>

      {/* Live Formula Previewer Drawer */}
      {showFormulaTester && (
        <div className="bg-slate-950 border border-indigo-500/30 p-5 rounded-2xl space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-indigo-400 uppercase tracking-wider">
              🧮 Canlı Matematik / Fizik İfade Önizleyici
            </span>
            <span className="text-[10px] text-slate-400">Öğrenciye görünecek biçim</span>
          </div>

          <input
            type="text"
            value={testFormula}
            onChange={(e) => setTestFormula(e.target.value)}
            placeholder="Formül yazın (ör: f(x) = x^2 + \sqrt{y})"
            className="w-full bg-slate-900 border border-slate-800 text-white text-xs font-mono p-3 rounded-xl focus:outline-none focus:border-indigo-500"
          />

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Canlı Görünüm Önizleme:</span>
            <div className="text-sm font-bold text-emerald-300 font-mono leading-relaxed whitespace-pre-wrap">
              {testFormula || "Henüz ifade girilmedi."}
            </div>
          </div>
        </div>
      )}

      {/* Filter buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { key: "ALL", label: "Tümü" },
          { key: "PENDING_APPROVAL", label: "Bekleyenler" },
          { key: "APPROVED", label: "Onaylananlar" },
          { key: "REJECTED", label: "Reddedilenler" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilterStatus(item.key)}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              filterStatus === item.key
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
          Bu kriterde soru bulunmuyor.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <div key={q.id} className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-indigo-950 text-indigo-300 font-semibold px-2 py-0.5 rounded border border-indigo-800/50">
                    {q.examType} - {q.subject}
                  </span>
                  {q.topic && <span className="text-slate-400">({q.topic})</span>}
                  <span className="text-slate-500">• Zorluk: {q.difficulty}</span>
                </div>
                <div>{getStatusBadge(q.status)}</div>
              </div>

              <p className="text-sm text-slate-200 line-clamp-2">{q.questionText}</p>

              {q.status === "REJECTED" && q.rejectionReason && (
                <div className="bg-rose-950/40 border border-rose-900/60 p-2.5 rounded-lg text-xs text-rose-300">
                  <strong>Red Nedeni:</strong> {q.rejectionReason}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
