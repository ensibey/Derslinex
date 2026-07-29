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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>📚</span> Soru Havuzu ve Onay Takibi
          </h3>
          <p className="text-xs text-slate-400">Sisteme yüklediğiniz soruların yayınlanma durumları</p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
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
