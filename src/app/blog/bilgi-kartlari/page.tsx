"use client";
import { useState, useEffect } from "react";

const kartlar = [
  { ders: "📚 Türkçe", bilgi: "Servet-i Fünun şiirinde 'Aruz' ölçüsü hakimdir. Tek istisna, Tevfik Fikret'in çocuklar için yazdığı 'Şermin' adlı hece vezniyle yazılmış şiir kitabıdır.", kategori: "YKS Edebiyat" },
  { ders: "📐 Geometri", bilgi: "Bir dik üçgende, hipotenüse ait kenarortayın uzunluğu, hipotenüsün uzunluğunun yarısına eşittir. Buna 'Muhteşem Üçlü' denir.", kategori: "YKS / LGS Matematik" },
  { ders: "🧪 Fizik", bilgi: "Bir iletkenin uçları arasındaki potansiyel farkının, iletkenden geçen akım şiddetine oranı sabittir ve bu sabit iletkenin direncine eşittir (V = I * R).", kategori: "YKS Fizik" },
  { ders: "🌍 Coğrafya", bilgi: "Dünyanın en tuzlu denizi Kızıldeniz'dir. Tuzluluk oranı kutuplara gidildikçe sıcaklık azaldığı için düşüş gösterir.", kategori: "TYT Coğrafya" },
  { ders: "⏳ Tarih", bilgi: "Osmanlı Devleti'nde matbaa ilk kez Lale Devri'nde (1727) İbrahim Müteferrika tarafından kurulmuştur. Basılan ilk eser Vankulu Lügati'dir.", kategori: "YKS Tarih" },
  { ders: "🧬 Biyoloji", bilgi: "Canlılarda glikoliz reaksiyonları (glikozun pirüvata kadar yıkımı) tüm canlı türlerinde ortaktır ve hücrenin sitoplazmasında gerçekleşir.", kategori: "TYT / AYT Biyoloji" },
  { ders: "🎒 Türkçe (LGS)", bilgi: "Fiilimsiler (isim-fiil, sıfat-fiil, zarf-fiil) fiil kök veya gövdelerinden türetilirler, ancak fiiller gibi çekimlenemezler.", kategori: "LGS Türkçe" },
  { ders: "🧲 Fen (LGS)", bilgi: "Katıların basıncı, uyguladıkları dik kuvvetle (ağırlık) doğru orantılı, temas ettikleri yüzey alanıyla ise ters orantılıdır.", kategori: "LGS Fen" }
];

export default function BilgiKartlariPage() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % kartlar.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + kartlar.length) % kartlar.length);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto text-center">
        <span className="text-[#D97706] text-xs font-black uppercase tracking-widest">İNTERAKTİF ÖĞRENME</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2 mb-4">Sınav Hap Bilgileri</h1>
        <p className="text-gray-550 text-sm font-semibold mb-10 leading-relaxed">
          Kaydırarak veya yön tuşlarıyla sınavda çıkabilecek altın değerindeki bilgileri hızla öğrenin.
        </p>

        {/* Tinder Style Card */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-8 shadow-md relative min-h-[260px] flex flex-col justify-between items-center transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#FAF0E3]/40 rounded-bl-full pointer-events-none" />
          
          <div className="w-full flex justify-between items-center pb-4 border-b border-[#FAF8F5]">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{kartlar[currentIdx].kategori}</span>
            <span className="text-xs font-black text-[#D97706] bg-[#FAF0E3] px-3 py-1 rounded-xl">{kartlar[currentIdx].ders}</span>
          </div>

          <div className="my-6 text-center">
            <p className="text-base sm:text-lg font-black text-gray-800 leading-relaxed drop-shadow-sm">
              "{kartlar[currentIdx].bilgi}"
            </p>
          </div>

          <div className="w-full flex justify-between items-center pt-4 border-t border-[#FAF8F5] text-xs text-gray-400 font-bold">
            <span>Kart {currentIdx + 1} / {kartlar.length}</span>
            <span className="text-[#1E3A8A]">Derslinex Hızlı Bilgi</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            className="w-12 h-12 bg-white border border-[#EFECE6] rounded-2xl flex items-center justify-center text-lg font-black text-[#1E3A8A] hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-90 shadow-sm"
          >
            ◀
          </button>
          <button
            onClick={handleNext}
            className="bg-[#D97706] hover:bg-[#B45309] text-white font-black px-8 py-3.5 rounded-2xl transition-all active:scale-95 shadow-md text-sm"
          >
            Sonraki Kart ➔
          </button>
        </div>
      </div>
    </div>
  );
}
