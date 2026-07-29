"use client";

import React from "react";

export interface ParticipantStat {
  id: number;
  studentName: string;
  joinedAt?: string | null;
  leftAt?: string | null;
  isAttended: boolean;
}

interface SessionAttendanceStatsProps {
  sessionTitle: string;
  durationMinutes: number;
  participants: ParticipantStat[];
}

export default function SessionAttendanceStats({
  sessionTitle,
  durationMinutes,
  participants,
}: SessionAttendanceStatsProps) {
  if (!participants || participants.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center text-slate-400 text-xs">
        Bu seansa henüz katılan öğrenci bulunmuyor.
      </div>
    );
  }

  const attendedCount = participants.filter((p) => p.isAttended).length;
  const attendanceRate = Math.round((attendedCount / participants.length) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-semibold text-white">⏱️ Canlı Ders Yoklama İstatistiği</h4>
          <p className="text-xs text-slate-400">{sessionTitle} ({durationMinutes} dk)</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block">Katılım Oranı</span>
          <span className="text-sm font-bold text-emerald-400">%{attendanceRate}</span>
        </div>
      </div>

      <div className="divide-y divide-slate-800/60 text-xs">
        {participants.map((p) => {
          let durationText = "Katılmadı";
          if (p.joinedAt && p.leftAt) {
            const start = new Date(p.joinedAt).getTime();
            const end = new Date(p.leftAt).getTime();
            const mins = Math.max(0, Math.round((end - start) / 60000));
            durationText = `${mins} dk yayında kaldı`;
          } else if (p.joinedAt) {
            durationText = "Derse katıldı (Aktif)";
          }

          return (
            <div key={p.id} className="py-2.5 flex justify-between items-center">
              <span className="text-slate-200 font-medium">{p.studentName}</span>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-[11px]">{durationText}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    p.isAttended
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60"
                      : "bg-rose-950 text-rose-400 border border-rose-800/60"
                  }`}
                >
                  {p.isAttended ? "Katıldı" : "Devamsız"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
