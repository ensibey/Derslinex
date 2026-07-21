"use client";
import { useState } from "react";
import Link from "next/link";

const kartlar = [
  { id: 1, ders: "📚 Türkçe (Edebiyat)", bilgi: "Servet-i Fünun şiirinde 'Aruz' ölçüsü hakimdir. Tek istisna, Tevfik Fikret'in çocuklar için yazdığı 'Şermin' adlı hece vezniyle yazılmış şiir kitabıdır.", kategori: "YKS Edebiyat", hocaLink: "/hocalar/elif-demir-turkce-edebiyat", hocaAd: "Elif Demir" },
  { id: 2, ders: "📐 Geometri", bilgi: "Bir dik üçgende, hipotenüse ait kenarortayın uzunluğu, hipotenüsün uzunluğunun yarısına eşittir. Buna 'Muhteşem Üçlü' denir.", kategori: "YKS / LGS Matematik", hocaLink: "/hocalar/ahmet-yilmaz-matematik", hocaAd: "Ahmet Yılmaz" },
  { id: 3, ders: "🧪 Fizik", bilgi: "Bir iletkenin uçları arasındaki potansiyel farkının, iletkenden geçen akım şiddetine oranı sabittir ve bu sabit iletkenin direncine eşittir (V = I * R).", kategori: "YKS Fizik", hocaLink: "/hocalar/mehmet-celik-fizik", hocaAd: "Mehmet Çelik" },
  { id: 4, ders: "🌍 Coğrafya", bilgi: "Dünyanın en tuzlu denizi Kızıldeniz'dir. Tuzluluk oranı kutuplara gidildikçe sıcaklık azaldığı için düşüş gösterir.", kategori: "TYT Coğrafya", hocaLink: "/hocalar/elif-demir-turkce-edebiyat", hocaAd: "Elif Demir" },
  { id: 5, ders: "⏳ Tarih", bilgi: "Osmanlı Devleti'nde matbaa ilk kez Lale Devri'nde (1727) İbrahim Müteferrika tarafından kurulmuştur. Basılan ilk eser Vankulu Lügati'dir.", kategori: "YKS Tarih", hocaLink: "/hocalar/elif-demir-turkce-edebiyat", hocaAd: "Elif Demir" },
  { id: 6, ders: "🧬 Biyoloji", bilgi: "Canlılarda glikoliz reaksiyonları (glikozun pirüvata kadar yıkımı) tüm canlı türlerinde ortaktır ve hücrenin sitoplazmasında gerçekleşir.", kategori: "TYT / AYT Biyoloji", hocaLink: "/hocalar/ahmet-yilmaz-matematik", hocaAd: "Ahmet Yılmaz" },
  { id: 7, ders: "🎒 Türkçe (LGS)", bilgi: "Fiilimsiler (isim-fiil, sıfat-fiil, zarf-fiil) fiil kök veya gövdelerinden türetilirler, ancak fiiller gibi çekimlenemezler.", kategori: "LGS Türkçe", hocaLink: "/hocalar/elif-demir-turkce-edebiyat", hocaAd: "Elif Demir" },
  { id: 8, ders: "🧲 Fen (LGS)", bilgi: "Katıların basıncı, uyguladıkları dik kuvvetle (ağırlık) doğru orantılı, temas ettikleri yüzey alanıyla ise ters orantılıdır.", kategori: "LGS Fen", hocaLink: "/hocalar/mehmet-celik-fizik", hocaAd: "Mehmet Çelik" },
  // YENİ EKLENEN KARTLAR (20 KARTA TAMAMLAMA)
  { id: 9, ders: "📐 Matematik", bilgi: "İkinci dereceden denklemlerde diskriminant (Δ = b² - 4ac) sıfırdan küçükse, denklemin gerçel (reel) kökü yoktur, karmaşık kökleri vardır.", kategori: "AYT Matematik", hocaLink: "/hocalar/ahmet-yilmaz-matematik", hocaAd: "Ahmet Yılmaz" },
  { id: 10, ders: "🧪 Kimya", bilgi: "Periyodik cetvelde soldan sağa gidildikçe elektronegatiflik ve iyonlaşma enerjisi genellikle artar; atom yarıçapı ise azalır.", kategori: "TYT / AYT Kimya", hocaLink: "/hocalar/mehmet-celik-fizik", hocaAd: "Mehmet Çelik" },
  { id: 11, ders: "📚 Türkçe", bilgi: "Yazım kurallarında 'şey' sözcüğü daima kendinden önceki kelimeden ayrı yazılır (bir şey, her şey, çok şey).", kategori: "YKS / LGS Türkçe", hocaLink: "/hocalar/elif-demir-turkce-edebiyat", hocaAd: "Elif Demir" },
  { id: 12, ders: "📐 Geometri", bilgi: "Herhangi bir çokgenin dış açılarının toplamı kenar sayısından bağımsız olarak daima 360 derecedir.", kategori: "YKS / LGS Geometri", hocaLink: "/hocalar/ahmet-yilmaz-matematik", hocaAd: "Ahmet Yılmaz" },
  { id: 13, ders: "⏳ Tarih", bilgi: "Mustafa Kemal Atatürk'ün askeri ataşe olarak görev yaptığı ve Batı kültürünü yakından analiz ettiği şehir Sofya'dır.", kategori: "YKS / LGS Tarih", hocaLink: "/hocalar/elif-demir-turkce-edebiyat", hocaAd: "Elif Demir" },
  { id: 14, ders: "🧬 Biyoloji", bilgi: "Fotosentezin ışığa bağımlı reaksiyonlarında ATP ve NADPH üretilirken, ışıktan bağımsız (Calvin) reaksiyonlarında bunlar tüketilerek glikoz sentezlenir.", kategori: "AYT Biyoloji", hocaLink: "/hocalar/ahmet-yilmaz-matematik", hocaAd: "Ahmet Yılmaz" },
  { id: 15, ders: "🧪 Fizik", bilgi: "Işığın kırılması sırasında frekansı ve rengi asla değişmez; sadece yayılma hızı ve dalga boyu ortamın yoğunluğuna bağlı olarak değişir.", kategori: "AYT Fizik", hocaLink: "/hocalar/mehmet-celik-fizik", hocaAd: "Mehmet Çelik" },
  { id: 16, ders: "📐 Matematik", bilgi: "Bir fonksiyonun limitinin olması için, o noktadaki sağdan limitin soldan limite eşit olması şarttır. Süreklilik için ise bu limit değerinin fonksiyonun o noktadaki görüntüsüne eşit olması gerekir.", kategori: "AYT Matematik", hocaLink: "/hocalar/ahmet-yilmaz-matematik", hocaAd: "Ahmet Yılmaz" },
  { id: 17, ders: "📚 Edebiyat", bilgi: "Türk edebiyatında ilk realist roman Recaizade Mahmut Ekrem'in yazdığı 'Araba Sevdası' adlı eserdir.", kategori: "AYT Edebiyat", hocaLink: "/hocalar/elif-demir-turkce-edebiyat", hocaAd: "Elif Demir" },
  { id: 18, ders: "🧲 Fen (LGS)", bilgi: "Asitlerin pH değeri 7'den küçük, bazların pH değeri ise 7'den büyüktür. Asitler mavi turnusol kağıdını kırmızıya, bazlar ise kırmızı turnusolu maviye çevirir.", kategori: "LGS Fen", hocaLink: "/hocalar/mehmet-celik-fizik", hocaAd: "Mehmet Çelik" },
  { id: 19, ders: "🎒 Matematik (LGS)", bilgi: "Aralarında asal olan iki pozitif tam sayının en büyük ortak böleni (EBOB) daima 1'dir.", kategori: "LGS Matematik", hocaLink: "/hocalar/ahmet-yilmaz-matematik", hocaAd: "Ahmet Yılmaz" },
  { id: 20, ders: "🧬 Biyoloji", bilgi: "Protein sentezi bütün canlı hücrelerde ortak olan ribozom organelinde gerçekleşir. mRNA üzerindeki kodonlar ile tRNA üzerindeki antikodonlar eşleşir.", kategori: "TYT Biyoloji", hocaLink: "/hocalar/ahmet-yilmaz-matematik", hocaAd: "Ahmet Yılmaz" }
];

export default function BilgiKartlariPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedDers, setSelectedDers] = useState("Tümü");

  // Get unique list of subjects
  const uniqueDersler = ["Tümü", ...Array.from(new Set(kartlar.map((k) => k.ders)))];

  const filteredKartlar = kartlar.filter(
    (k) => selectedDers === "Tümü" || k.ders === selectedDers
  );

  const selectDers = (dersName: string) => {
    setSelectedDers(dersName);
    setCurrentIdx(0);
  };

  const handleNext = () => {
    if (filteredKartlar.length === 0) return;
    setCurrentIdx((prev) => (prev + 1) % filteredKartlar.length);
  };

  const handlePrev = () => {
    if (filteredKartlar.length === 0) return;
    setCurrentIdx((prev) => (prev - 1 + filteredKartlar.length) % filteredKartlar.length);
  };

  const current = filteredKartlar[currentIdx];

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto text-center">
        <span className="text-[#B45309] text-xs font-black uppercase tracking-widest">İNTERAKTİF ÖĞRENME</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2 mb-4">Sınav Hap Bilgileri</h1>
        <p className="text-gray-500 text-sm font-semibold mb-8 leading-relaxed">
          Kaydırarak veya yön tuşlarıyla sınavda çıkabilecek altın değerindeki bilgileri hızla öğrenin.
        </p>

        {/* Dynamic Subject Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin max-w-full justify-start sm:justify-center">
          {uniqueDersler.map((d) => (
            <button
              key={d}
              onClick={() => selectDers(d)}
              className={`text-xs font-black px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
                selectedDers === d
                  ? "bg-[#B45309] text-white border-[#B45309]"
                  : "bg-white text-gray-600 border-[#EFECE6] hover:bg-gray-100"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Tinder Style Card */}
        {filteredKartlar.length > 0 && current ? (
          <>
            <div className="bg-white border border-[#EFECE6] rounded-3xl p-8 shadow-md relative min-h-[290px] flex flex-col justify-between items-center transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#FAF0E3]/40 rounded-bl-full pointer-events-none" />
              
              <div className="w-full flex justify-between items-center pb-4 border-b border-[#FAF8F5]">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{current.kategori}</span>
                <span className="text-xs font-black text-[#B45309] bg-[#FAF0E3] px-3 py-1 rounded-xl">{current.ders}</span>
              </div>

              <div className="my-6 text-center">
                <p className="text-base sm:text-lg font-black text-gray-800 leading-relaxed drop-shadow-sm">
                  "{current.bilgi}"
                </p>
              </div>

              {/* Hoca Yönlendirme Alanı */}
              <div className="w-full pt-4 border-t border-[#FAF8F5] flex flex-col sm:flex-row justify-between items-center gap-3">
                <span className="text-xs text-gray-400 font-bold">Kart {currentIdx + 1} / {filteredKartlar.length}</span>
                <Link
                  href={current.hocaLink}
                  className="text-xs font-black text-[#1E3A8A] hover:text-[#B45309] transition-colors flex items-center gap-1"
                >
                  👨‍🏫 {current.hocaAd} ile Konuyu Çalış ➔
                </Link>
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
                className="bg-[#B45309] hover:bg-[#92400E] text-white font-black px-8 py-3.5 rounded-2xl transition-all active:scale-95 shadow-md text-sm"
              >
                Sonraki Kart ➔
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white/50 border border-dashed border-[#EFECE6] rounded-3xl">
            <span className="text-4xl">🃏</span>
            <p className="text-gray-500 font-bold mt-4">Bu ders kategorisinde henüz bilgi kartı bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </div>
  );
}
