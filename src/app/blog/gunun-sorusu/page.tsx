"use client";
import { useState } from "react";

const sorular = [
  {
    id: 1,
    ders: "📚 Edebiyat",
    soru: "Aşağıdaki sanatçılardan hangisi Servet-i Fünun dönemi bağımsız yazarlarındandır?",
    secenekler: [
      { key: "A", text: "Halit Ziya Uşaklıgil" },
      { key: "B", text: "Teodor Kasap" },
      { key: "C", text: "Hüseyin Rahmi Gürpınar" },
      { key: "D", text: "Cenap Şahabettin" }
    ],
    dogru: "C",
    cozum: "Hüseyin Rahmi Gürpınar ve Ahmet Rasim, Servet-i Fünun döneminde yaşamalarına rağmen topluluğa dahil olmayıp bağımsız kalmışlardır."
  },
  {
    id: 2,
    ders: "📐 Matematik",
    soru: "Bir aritmetik dizide a₁ = 5 ve ortak fark d = 3 ise, bu dizinin 10. terimi (a₁₀) kaçtır?",
    secenekler: [
      { key: "A", text: "32" },
      { key: "B", text: "35" },
      { key: "C", text: "38" },
      { key: "D", text: "41" }
    ],
    dogru: "A",
    cozum: "Aritmetik dizi genel terim formülü: an = a₁ + (n-1)*d. Buradan a₁₀ = 5 + (10-1)*3 = 5 + 27 = 32 bulunur."
  },
  {
    id: 3,
    ders: "🧪 Fizik",
    soru: "Aşağıdakilerden hangisi temel büyüklüklerden biridir?",
    secenekler: [
      { key: "A", text: "Hız" },
      { key: "B", text: "Kuvvet" },
      { key: "C", text: "Sıcaklık" },
      { key: "D", text: "Enerji" }
    ],
    dogru: "C",
    cozum: "Kısa Muz (Kütle, Işık şiddeti, Sıcaklık, Akım şiddeti, Madde miktarı, Uzunluk, Zaman) temel büyüklüklerdir. Diğerleri türetilmiştir."
  }
];

export default function GunlukQuizPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const current = sorular[selectedIdx];

  const handleChoice = (key: string) => {
    if (showAnswer) return;
    setUserChoice(key);
  };

  const handleCheck = () => {
    if (!userChoice) return;
    setShowAnswer(true);
  };

  const handleNext = () => {
    setUserChoice(null);
    setShowAnswer(false);
    setSelectedIdx((prev) => (prev + 1) % sorular.length);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#D97706] text-xs font-black uppercase tracking-widest">GÜNLÜK MEYDAN OKUMA</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2 mb-3">Günün Özel Sorusu</h1>
          <p className="text-gray-550 text-sm font-semibold">Her gün yeni bir soru çözerek bilgilerinizi tazeleyin.</p>
        </div>

        {/* Question Container */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-md flex flex-col space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-[#FAF8F5]">
            <span className="text-xs font-black text-[#D97706] bg-[#FAF0E3] px-3 py-1 rounded-xl">{current.ders}</span>
            <span className="text-xs text-gray-400 font-bold">Soru {current.id}</span>
          </div>

          <p className="text-base sm:text-lg font-black text-gray-800 leading-relaxed">
            {current.soru}
          </p>

          <div className="space-y-3">
            {current.secenekler.map((opt) => {
              const isSelected = userChoice === opt.key;
              const isCorrect = opt.key === current.dogru;
              
              let btnClass = "border-[#EFECE6] bg-[#FAF8F5] text-gray-700 hover:bg-[#FAF0E3] hover:border-[#F5D0A9]";
              if (isSelected) {
                btnClass = "border-[#D97706] bg-[#FAF0E3] text-[#B45309]";
              }
              if (showAnswer) {
                if (isCorrect) {
                  btnClass = "border-emerald-500 bg-emerald-50 text-emerald-800";
                } else if (isSelected) {
                  btnClass = "border-red-500 bg-red-50 text-red-800";
                } else {
                  btnClass = "border-[#EFECE6] opacity-60 text-gray-400";
                }
              }

              return (
                <button
                  key={opt.key}
                  onClick={() => handleChoice(opt.key)}
                  disabled={showAnswer}
                  className={`w-full text-left flex items-center gap-4 border rounded-2xl px-5 py-4 transition-all outline-none font-bold text-sm ${btnClass}`}
                >
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black ${
                    isSelected ? "bg-[#D97706] text-white" : "bg-white border border-[#EFECE6] text-gray-500"
                  }`}>
                    {opt.key}
                  </span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Action Button */}
          {!showAnswer ? (
            <button
              onClick={handleCheck}
              disabled={!userChoice}
              className={`w-full font-black py-4 rounded-2xl transition-all shadow-sm ${
                userChoice 
                  ? "bg-[#D97706] hover:bg-[#B45309] text-white active:scale-95 cursor-pointer" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Cevabı Kontrol Et
            </button>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs font-semibold text-amber-850 leading-relaxed">
                <p className="font-black mb-1">💡 ÇÖZÜM:</p>
                {current.cozum}
              </div>
              <button
                onClick={handleNext}
                className="w-full bg-[#1E3A8A] hover:bg-[#152a60] text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-sm text-sm"
              >
                Sıradaki Soruya Geç ➔
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
