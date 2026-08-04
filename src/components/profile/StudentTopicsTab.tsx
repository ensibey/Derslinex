"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/Toast";

interface StudentTopicsTabProps {
  studentId: number;
}

const subjectsList = [
  { name: "Türkçe", topics: ["Sözcükte Anlam", "Cümlede Anlam", "Paragraf", "Yazım Kuralları", "Noktalama İşaretleri", "Dil Bilgisi"] },
  { name: "Matematik", topics: ["Temel Kavramlar", "Sayı Basamakları", "Bölme-Bölünebilme", "EBOB-EKOK", "Rasyonel Sayılar", "Üslü Sayılar", "Köklü Sayılar", "Çarpanlara Ayırma", "Oran-Orantı", "Problemler", "Mantık", "Kümeler", "Fonksiyonlar", "Polinomlar", "2. Dereceden Denklemler"] },
  { name: "Geometri", topics: ["Doğruda ve Üçgende Açılar", "Özel Üçgenler", "Üçgende Alan ve Açıortay", "Çokgenler ve Dörtgenler", "Çember ve Daire", "Analitik Geometri", "Katı Cisimler"] },
  { name: "Fizik", topics: ["Fizik Bilimine Giriş", "Madde ve Özellikleri", "Hareket ve Kuvvet", "İş, Güç ve Enerji", "Isı ve Sıcaklık", "Elektrik ve Magnetizma", "Optik", "Dalgalar"] },
  { name: "Kimya", topics: ["Kimya Bilimi", "Atom ve Periyodik Sistem", "Kimyasal Türler Arası Etkileşimler", "Maddenin Halleri", "Mol Kavramı", "Asitler, Bazlar ve Tuzlar", "Karışımlar"] },
  { name: "Biyoloji", topics: ["Canlıların Ortak Özellikleri", "Hücre ve Organeller", "Canlıların Sınıflandırılması", "Hücre Bölünmeleri", "Kalıtım", "Ekosistem Ekolojisi"] },
];

export function StudentTopicsTab({ studentId }: StudentTopicsTabProps) {
  const [selectedSubject, setSelectedSubject] = useState("Matematik");
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetch(`/api/student/topics?studentId=${studentId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.progress)) {
          const map: Record<string, boolean> = {};
          d.progress.forEach((item: any) => {
            map[`${item.subject}_${item.topic}`] = item.isCompleted;
          });
          setCompletedMap(map);
        }
      })
      .catch((err) => console.error("Topics load error:", err))
      .finally(() => setLoading(false));
  }, [studentId]);

  const toggleTopic = async (subject: string, topic: string) => {
    const key = `${subject}_${topic}`;
    const nextState = !completedMap[key];

    setCompletedMap((prev) => ({ ...prev, [key]: nextState }));

    try {
      const res = await fetch("/api/student/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic, isCompleted: nextState }),
      });
      const data = await res.json();
      if (!data.success) {
        setCompletedMap((prev) => ({ ...prev, [key]: !nextState }));
        showToast(data.error || "Güncelleme başarısız", "error");
      } else {
        showToast(nextState ? `"${topic}" tamamlandı olarak işaretlendi! 🎉` : `"${topic}" eksik olarak işaretlendi.`, "success");
      }
    } catch (err) {
      setCompletedMap((prev) => ({ ...prev, [key]: !nextState }));
      showToast("Sunucuya ulaşılamadı", "error");
    }
  };

  const currentSubjectObj = subjectsList.find((s) => s.name === selectedSubject) || subjectsList[1];
  const currentCompletedCount = currentSubjectObj.topics.filter((t) => completedMap[`${selectedSubject}_${t}`]).length;
  const currentPercent = Math.round((currentCompletedCount / currentSubjectObj.topics.length) * 100);

  if (loading) {
    return <div className="p-8 text-center text-indigo-300 font-bold animate-pulse">Konu takip haritası yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Subject Filter Pills */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-white/10">
        {subjectsList.map((sub) => {
          const completed = sub.topics.filter((t) => completedMap[`${sub.name}_${t}`]).length;
          const isSel = sub.name === selectedSubject;
          return (
            <button
              key={sub.name}
              onClick={() => setSelectedSubject(sub.name)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                isSel
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
              }`}
            >
              <span>{sub.name}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isSel ? "bg-white/20 text-white" : "bg-white/10 text-slate-400"}`}>
                {completed}/{sub.topics.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress Card */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-black text-white">{selectedSubject} Konu İlerlemesi</h3>
            <p className="text-xs text-slate-400 font-bold mt-0.5">
              {currentCompletedCount} / {currentSubjectObj.topics.length} Konu Tamamlandı
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-indigo-400">%{currentPercent}</span>
          </div>
        </div>

        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${currentPercent}%` }}
          />
        </div>
      </div>

      {/* Topics Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {currentSubjectObj.topics.map((t) => {
          const isDone = !!completedMap[`${selectedSubject}_${t}`];
          return (
            <div
              key={t}
              onClick={() => toggleTopic(selectedSubject, t)}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between group ${
                isDone
                  ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/50"
                  : "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-black transition ${
                    isDone ? "bg-emerald-500 text-slate-950" : "border border-white/20 group-hover:border-indigo-400 text-transparent"
                  }`}
                >
                  ✓
                </div>
                <span className={`text-xs font-bold ${isDone ? "line-through opacity-80" : ""}`}>{t}</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 group-hover:text-indigo-300">
                {isDone ? "Tamamlandı" : "Eksik"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
