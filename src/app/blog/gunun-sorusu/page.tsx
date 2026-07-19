"use client";
import { useState } from "react";
import { waLink } from "@/lib/utils";

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
    cozum: "Hüseyin Rahmi Gürpınar ve Ahmet Rasim, Servet-i Fünun döneminde yaşamalarına rağmen topluluğa dahil olmayıp bağımsız kalmışlardır.",
    hocaAd: "Elif Demir (Türkçe/Edebiyat)"
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
    cozum: "Aritmetik dizi genel terim formülü: an = a₁ + (n-1)*d. Buradan a₁₀ = 5 + (10-1)*3 = 5 + 27 = 32 bulunur.",
    hocaAd: "Ahmet Yılmaz (Matematik)"
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
    cozum: "Kısa Muz (Kütle, Işık şiddeti, Sıcaklık, Akım şiddeti, Madde miktarı, Uzunluk, Zaman) temel büyüklüklerdir. Diğerleri türetilmiştir.",
    hocaAd: "Mehmet Çelik (Fizik)"
  },
  // YENİ SORULAR (10 SORUYA TAMAMLAMA)
  {
    id: 4,
    ders: "🧪 Kimya",
    soru: "Aşağıdaki kimyasal tür etkileşimlerinden hangisi güçlü etkileşim (kimyasal bağ) sınıfına girer?",
    secenekler: [
      { key: "A", text: "Hidrojen Bağı" },
      { key: "B", text: "Kovalent Bağ" },
      { key: "C", text: "Dipol-Dipol Etkileşimi" },
      { key: "D", text: "London Kuvvetleri" }
    ],
    dogru: "B",
    cozum: "Kovalent bağ, iyonik bağ ve metalik bağ güçlü etkileşimlerdir. Hidrojen bağı ve Van der Waals (dipol-dipol, London vb.) ise zayıf etkileşimlerdir.",
    hocaAd: "Mehmet Çelik (Kimya)"
  },
  {
    id: 5,
    ders: "🧬 Biyoloji",
    soru: "Sağlıklı bir insanda çizgili kasların kasılması sırasında aşağıdaki niceliklerden hangisinin azalması beklenir?",
    secenekler: [
      { key: "A", text: "Kreatin miktarı" },
      { key: "B", text: "Isı miktarı" },
      { key: "C", text: "Glikojen miktarı" },
      { key: "D", text: "Karbondioksit miktarı" }
    ],
    dogru: "C",
    cozum: "Kas kasılması sırasında enerji tüketimi için glikoz ve glikojen depoları parçalanarak tüketilir, dolayısıyla glikojen miktarı azalır. Kreatin fosfat kullanımıyla kreatin artar, CO₂ ve ısı ise açığa çıkarak artış gösterir.",
    hocaAd: "Ahmet Yılmaz (Biyoloji)"
  },
  {
    id: 6,
    ders: "📚 Türkçe",
    soru: "Aşağıdaki cümlelerin hangisinde bir yazım hatası yapılmıştır?",
    secenekler: [
      { key: "A", text: "Bugün her şey yolunda gitti." },
      { key: "B", text: "Hiç bir insan yalnız kalmak istemez." },
      { key: "C", text: "Birtakım sorunlar yaşadık." },
      { key: "D", text: "Pek çok konuda anlaştık." }
    ],
    dogru: "B",
    cozum: "'Hiçbir' sözcüğü belgisiz sıfat rolündeyken daima bitişik yazılmalıdır. Cümlede 'Hiç bir' şeklinde ayrı yazılarak hata yapılmıştır.",
    hocaAd: "Elif Demir (Türkçe)"
  },
  {
    id: 7,
    ders: "📐 Geometri",
    soru: "İç açılarının toplamı dış açılarının toplamının 3 katı olan düzgün çokgen kaç kenarlıdır?",
    secenekler: [
      { key: "A", text: "6" },
      { key: "B", text: "8" },
      { key: "C", text: "10" },
      { key: "D", text: "12" }
    ],
    dogru: "B",
    cozum: "Dış açılar toplamı her çokgende 360 derecedir. İç açılar toplamı (n-2)*180 formülüyle bulunur. (n-2)*180 = 360*3 => (n-2)*180 = 1080 => n-2 = 6 => n = 8 (Sekizgen).",
    hocaAd: "Ahmet Yılmaz (Geometri)"
  },
  {
    id: 8,
    ders: "⏳ Tarih",
    soru: "Mustafa Kemal Atatürk'ün 'Ordular, ilk hedefiniz Akdeniz'dir, ileri!' emrini verdiği savaş aşağıdakilerden hangisidir?",
    secenekler: [
      { key: "A", text: "I. İnönü Savaşı" },
      { key: "B", text: "Sakarya Meydan Muharebesi" },
      { key: "C", text: "Büyük Taarruz (Başkomutanlık Meydan Muharebesi)" },
      { key: "D", text: "II. İnönü Savaşı" }
    ],
    dogru: "C",
    cozum: "Mustafa Kemal Atatürk, kurtuluş mücadelesinin son safhası olan Büyük Taarruz sırasında Yunan ordusunu takip etmek üzere ordularına bu tarihi emri vermiştir.",
    hocaAd: "Elif Demir (Tarih)"
  },
  {
    id: 9,
    ders: "🧲 Fen (LGS)",
    soru: "DNA molekülünün kendini eşlemesi sırasında sitoplazmadan çekirdeğe giren maddelerin miktarıyla ilgili hangisi doğrudur?",
    secenekler: [
      { key: "A", text: "Nükleotid miktarı artar" },
      { key: "B", text: "Fosfat ve şeker miktarı azalır" },
      { key: "C", text: "Sitoplazmadaki serbest nükleotid miktarı azalır" },
      { key: "D", text: "Çekirdekteki DNA sayısı yarıya iner" }
    ],
    dogru: "C",
    cozum: "DNA eşlenirken sitoplazmadaki serbest organik baz, şeker ve fosfatlar çekirdeğe girerek yeni ipliklerin yapımında kullanılır. Dolayısıyla sitoplazmadaki serbest nükleotid miktarı azalır.",
    hocaAd: "Mehmet Çelik (Fen)"
  },
  {
    id: 10,
    ders: "🎒 Matematik (LGS)",
    soru: "Alanı 144 cm² olan kare şeklindeki bir kartonun çevresi kaç santimetredir?",
    secenekler: [
      { key: "A", text: "36" },
      { key: "B", text: "48" },
      { key: "C", text: "60" },
      { key: "D", text: "72" }
    ],
    dogru: "B",
    cozum: "Karenin alanı a² = 144 ise bir kenarı a = √144 = 12 cm'dir. Çevresi ise 4*a = 4*12 = 48 cm olarak bulunur.",
    hocaAd: "Ahmet Yılmaz (Matematik)"
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

  const isWrong = userChoice && userChoice !== current.dogru;

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#B45309] text-xs font-black uppercase tracking-widest">GÜNLÜK MEYDAN OKUMA</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2 mb-3">Günün Özel Sorusu</h1>
          <p className="text-gray-500 text-sm font-semibold">Her gün yeni bir soru çözerek bilgilerinizi tazeleyin.</p>
        </div>

        {/* Question Container */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-md flex flex-col space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-[#FAF8F5]">
            <span className="text-xs font-black text-[#B45309] bg-[#FAF0E3] px-3 py-1 rounded-xl">{current.ders}</span>
            <span className="text-xs text-gray-400 font-bold">Soru {current.id} / {sorular.length}</span>
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
                btnClass = "border-[#B45309] bg-[#FAF0E3] text-[#B45309]";
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
                    isSelected ? "bg-[#B45309] text-white" : "bg-white border border-[#EFECE6] text-gray-500"
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
                  ? "bg-[#B45309] hover:bg-[#92400E] text-white active:scale-95 cursor-pointer" 
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

              {/* Satış Yönlendirme Alanı */}
              {isWrong && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs font-semibold text-blue-900 leading-relaxed">
                  <p className="font-black mb-1">💡 UZMAN DERSLİNEX REHBERLİK NOTU:</p>
                  Üzülme! Bu konuda eksiklerin varsa, konuyu tam kavrayabilmen için <span className="font-black">{current.hocaAd}</span> ile hemen 15 dakikalık ücretsiz tanışma seansı başlatabilirsin.
                  <div className="mt-2.5">
                    <a
                      href={waLink(`Merhaba, günün sorusu sayfasındaki ${current.ders} sorusunda takıldım, ${current.hocaAd} hocamızdan ücretsiz tanışma dersi almak istiyorum.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-[#1E3A8A] text-white font-black px-4 py-2 rounded-lg text-[10px] hover:bg-[#152a60] transition-colors"
                    >
                      ⚡ Ücretsiz Tanışma Dersi Al
                    </a>
                  </div>
                </div>
              )}

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
