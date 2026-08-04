"use client";

import React, { useState, useEffect, useCallback } from "react";

interface QuestionAttempt {
  id: number;
  questionId: number;
  selectedOption: string;
  isCorrect: boolean;
  createdAt: string;
  question: {
    id: number;
    subject: String;
    examType: string;
    questionText: string;
    imageUrl?: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    optionE: string;
    correctOption: string;
    solutionText?: string;
    solutionVideoUrl?: string;
  };
}

export default function WrongQuestionsModal({
  studentId,
  onClose,
}: {
  studentId: number;
  onClose: () => void;
}) {
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAttempt, setSelectedAttempt] = useState<QuestionAttempt | null>(null);

  const fetchWrongQuestions = useCallback(async () => {
    try {
      const res = await fetch(`/api/student/wrong-questions`, {
        headers: { "x-student-id": String(studentId) },
      });
      const data = await res.json();
      if (data.success) {
        setAttempts(data.wrongQuestions || []);
      } else {
        setError(data.error || "Yanlış sorular yüklenemedi.");
      }
    } catch {
      setError("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchWrongQuestions();
  }, [fetchWrongQuestions]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#0F172A] border border-red-500/30 text-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900/40 via-purple-900/40 to-slate-900 px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 border border-red-500/40 rounded-xl flex items-center justify-center text-xl">
              🎯
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Yanlış Soru Havuzu & Aralıklı Tekrar</h2>
              <p className="text-xs text-red-300">Geliştirmen gereken zayıf noktalarını incele ve çözümleri öğren</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition focus-visible:ring-2 focus-visible:ring-red-400"
            aria-label="Pencereyi Kapat"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-400">Yanlış sorularınız analiz ediliyor...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-center text-red-300 text-xs font-bold">
              {error}
            </div>
          ) : attempts.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white/5 rounded-3xl border border-white/5 p-8">
              <div className="text-5xl mb-2">🎉</div>
              <h3 className="text-lg font-black text-white">Harika! Yanlış Sorunuz Bulunmuyor</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Çözdüğünüz tüm testlerde ve denemelerde tam başarı gösterdiniz veya henüz yeni bir soru çözmediniz.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {attempts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedAttempt(item)}
                  className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-4 ${
                    selectedAttempt?.id === item.id
                      ? "bg-red-950/40 border-red-500 shadow-xl shadow-red-900/20"
                      : "bg-[#1E293B] hover:bg-white/5 border-white/10"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                        {item.question.subject || "Genel"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-200 line-clamp-3 leading-relaxed">
                      {item.question.questionText}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-black border-t border-white/10 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">Senin Yanıtın: {item.selectedOption}</span>
                      <span className="text-emerald-400">Doğru: {item.question.correctOption}</span>
                    </div>
                    <span className="text-indigo-400 hover:underline">Çözümü İncele →</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected Question Detail Drawer */}
          {selectedAttempt && (
            <div className="bg-[#1E293B] border border-red-500/40 rounded-3xl p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="bg-indigo-600 text-white font-black text-xs px-3 py-1 rounded-xl">
                  Soru Çözüm Detayı
                </span>
                <button
                  onClick={() => setSelectedAttempt(null)}
                  className="text-xs font-bold text-slate-400 hover:text-white"
                >
                  Kapat ✕
                </button>
              </div>

              {selectedAttempt.question.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedAttempt.question.imageUrl}
                  alt="Soru Görseli"
                  className="max-h-56 object-contain mx-auto rounded-xl border border-white/10 p-2 bg-black"
                />
              )}

              <div className="bg-[#0D172A] p-4 rounded-2xl border border-white/10 text-sm font-bold text-slate-200 whitespace-pre-wrap">
                {selectedAttempt.question.questionText}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
                {["A", "B", "C", "D", "E"].map((opt) => {
                  const optText = (selectedAttempt.question as any)[`option${opt}`];
                  if (!optText) return null;
                  const isUserWrong = selectedAttempt.selectedOption === opt;
                  const isCorrect = selectedAttempt.question.correctOption === opt;

                  let style = "bg-white/5 border-white/10 text-slate-300";
                  if (isCorrect) style = "bg-emerald-600/30 border-emerald-500 text-emerald-300";
                  else if (isUserWrong) style = "bg-red-600/30 border-red-500 text-red-300";

                  return (
                    <div key={opt} className={`p-3 rounded-xl border ${style} flex items-center gap-2`}>
                      <span className="font-black">{opt})</span>
                      <span>{optText}</span>
                      {isCorrect && <span className="ml-auto">✅ Correct</span>}
                      {isUserWrong && <span className="ml-auto">❌ Senin Cevabın</span>}
                    </div>
                  );
                })}
              </div>

              {/* Solution text or video */}
              {selectedAttempt.question.solutionText && (
                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">
                    💡 Öğretmen Çözüm Açıklaması
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedAttempt.question.solutionText}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 bg-[#0B1120] text-center text-xs text-slate-400 font-bold">
          * Aralıklı tekrar yapmak öğrendiklerinizin kalıcılığını %80 artırır.
        </div>
      </div>
    </div>
  );
}
