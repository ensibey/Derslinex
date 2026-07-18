"use client";
import { useState } from "react";
import Link from "next/link";
import { waLink } from "@/lib/utils";

export default function ObpHesaplayiciPage() {
  const [obp, setObp] = useState<number>(80);
  const [tytNet, setTytNet] = useState<number>(70);
  const [showResult, setShowResult] = useState(false);
  const [obpPuan, setObpPuan] = useState(0);
  const [ekstraSiralamaEtki, setEkstraSiralamaEtki] = useState(0);
  const [netKarsiligi, setNetKarsiligi] = useState(0);

  const handleCalculate = () => {
    const verifiedObp = Math.min(100, Math.max(50, obp));
    const verifiedNet = Math.min(120, Math.max(0, tytNet));

    const puan = Number((verifiedObp * 5 * 0.12).toFixed(2));
    const obpKaybi = 60 - puan;
    const netEsdegeri = Number((obpKaybi / 1.33).toFixed(1));

    let siralamaKaybi = 0;
    if (verifiedNet > 95) {
      siralamaKaybi = Math.round(obpKaybi * 650);
    } else if (verifiedNet > 70) {
      siralamaKaybi = Math.round(obpKaybi * 1200);
    } else {
      siralamaKaybi = Math.round(obpKaybi * 1800);
    }

    setObpPuan(puan);
    setEkstraSiralamaEtki(siralamaKaybi);
    setNetKarsiligi(netEsdegeri);
    setShowResult(true);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#D97706] text-xs font-black uppercase tracking-widest">YKS SIRALAMA SİMÜLATÖRÜ</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2 mb-3">OBP Sıralama Etki Robotu</h1>
          <p className="text-gray-550 text-sm font-semibold leading-relaxed">
            Diploma notunuzun (OBP) YKS yerleştirme sıralamanızı nasıl etkileyeceğini ve size kaç net kazandırıp kaybettireceğini görün.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-md flex flex-col space-y-6 mb-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="obp-input" className="block text-xs font-black text-[#1E3A8A] uppercase tracking-wider mb-2">
                Diploma Notunuz (50 - 100)
              </label>
              <input
                id="obp-input"
                type="number"
                min="50"
                max="100"
                step="0.01"
                value={obp}
                onChange={(e) => setObp(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl py-3 px-4 text-sm font-bold text-gray-800 outline-none focus:border-[#D97706] transition-colors"
                placeholder="Örn: 85.5"
              />
              <p className="text-[10px] text-gray-400 font-bold mt-1.5">En düşük diploma notu 50 olarak hesaplanır.</p>
            </div>

            <div>
              <label htmlFor="net-input" className="block text-xs font-black text-[#1E3A8A] uppercase tracking-wider mb-2">
                Tahmini TYT Toplam Netiniz (0 - 120)
              </label>
              <input
                id="net-input"
                type="number"
                min="0"
                max="120"
                value={tytNet}
                onChange={(e) => setTytNet(parseInt(e.target.value) || 0)}
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl py-3 px-4 text-sm font-bold text-gray-800 outline-none focus:border-[#D97706] transition-colors"
                placeholder="Örn: 75"
              />
              <p className="text-[10px] text-gray-400 font-bold mt-1.5">Sıralama yığılması tahmini için gereklidir.</p>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-black py-4 rounded-2xl transition-all shadow-md active:scale-95 text-sm"
          >
            Etkiyi Hesapla ➔
          </button>

          {showResult && (
            <div className="pt-6 border-t border-[#FAF8F5] space-y-6">
              <h3 className="text-base font-black text-[#1E3A8A] uppercase tracking-wider">OBP Analiz Raporu</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl p-4 text-center">
                  <p className="text-[10px] font-black text-gray-455 uppercase tracking-widest">OBP KATKI PUANI</p>
                  <p className="text-xl font-black text-[#1E3A8A] mt-1">+{obpPuan}</p>
                </div>
                <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl p-4 text-center">
                  <p className="text-[10px] font-black text-gray-455 uppercase tracking-widest">100 OBP'YE GÖRE KAYIP</p>
                  <p className="text-xl font-black text-red-650 mt-1">-{Number((60 - obpPuan).toFixed(2))} Puan</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col space-y-3">
                <div>
                  <p className="text-xs font-black text-amber-850 uppercase tracking-wider">📊 SIRALAMA ETKİSİ (YAKLAŞIK)</p>
                  <p className="text-sm font-semibold text-amber-900 mt-1.5 leading-relaxed">
                    Diploma notunuz 100 tam puan olsaydı, yerleştirme sıralamasında yaklaşık{" "}
                    <span className="font-black text-red-650">{ekstraSiralamaEtki.toLocaleString("tr-TR")} kişi</span> daha önde olacaktınız.
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-200/60">
                  <p className="text-xs font-black text-amber-850 uppercase tracking-wider">📐 NET CİNSİNDEN DEĞERİ</p>
                  <p className="text-sm font-semibold text-amber-900 mt-1.5 leading-relaxed">
                    Bu diploma notu kaybını telafi edebilmek için TYT sınavında fazladan en az{" "}
                    <span className="font-black text-[#1E3A8A]">{netKarsiligi} Net</span> yapmanız gerekmektedir.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs font-semibold text-blue-900 leading-relaxed">
                <p className="font-black mb-1">💡 UZMAN DERSLİNEX REHBERLİK NOTU:</p>
                OBP sıralama kaybınızı minimuma indirmek ve rakiplerinize net farkı atmak için YKS hazırlık sürecinde özellikle yüksek katsayılı AYT derslerinde nokta atışı çalışmalısınız. Bizimle iletişime geçerek size özel YKS telafi programı hazırlayabiliriz.
                <div className="mt-2.5">
                  <a
                    href={waLink(`Merhaba, OBP sıralama etki robotunda diploma notumu hesapladım, OBP kaybımı kapatacak YKS ders programı ve özel ders teklifi almak istiyorum.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#1E3A8A] text-white font-black px-4 py-2.5 rounded-xl text-xs hover:bg-[#152a60] transition-colors"
                  >
                    💬 OBP Telafi Programı Hazırla
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Kılavuzu & Zengin Metin Alanları */}
        <div className="space-y-6">
          <section className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-black text-[#1E3A8A] mb-3">🎓 OBP'nizi Yükseltmek İçin 3 Altın Kural</h2>
            <p className="text-xs text-gray-500 font-bold leading-relaxed mb-4">
              Okul puanı (OBP), YKS yerleştirme puanına doğrudan eklenir ve lise yazılı notlarınızın ortalamasından elde edilir. OBP'yi yüksek tutmak için:
            </p>
            <ul className="list-disc pl-5 text-xs text-gray-650 font-bold space-y-2">
              <li>
                <span className="text-[#D97706]">Yazılı Sınavlarına Düzenli Çalışın:</span> Lise not ortalamanızın her puanı, yerleştirmede sizi binlerce kişinin önüne geçirecek ağırlığa sahiptir.
              </li>
              <li>
                <span className="text-[#D97706]">Sözlü Notlarını İhmal Etmeyin:</span> Ders içi performans notları ortalamayı doğrudan etkiler. Öğretmenlerinizle iletişimi ve ders katılımını güçlü tutun.
              </li>
              <li>
                <span className="text-[#D97706]">Sayısal ve Sözel Dengeyi Koruyun:</span> Sadece kendi alanınızdaki derslere değil, ortalamaya etki eden müzik, beden, resim gibi yan derslere de önem verin.
              </li>
            </ul>
          </section>

          <section className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-black text-[#1E3A8A] mb-3">🛡️ Düşük OBP'yi YKS'de Eritecek Çalışma Taktikleri</h2>
            <p className="text-xs text-gray-650 font-semibold leading-relaxed">
              Eğer lise diploma notunuz düşükse ve YKS'de geriye düşmekten korkuyorsanız endişelenmeyin. Bu dezavantajı tamamen kapatacak formül şudur:
              <br /><br />
              <strong>1. AYT Netlerine Yüklenin:</strong> YKS yerleştirme puanında TYT'nin soru başı katsayısı daha düşükken, AYT netlerinin çarpanı çok daha yüksektir. OBP kaybınızı, AYT Matematik ve AYT Fen alanından yapacağınız fazladan 2-3 netle tamamen sıfırlayabilirsiniz.
              <br /><br />
              <strong>2. Süre Yetiştirme Çalışmaları:</strong> TYT'de yapacağınız her fazladan net, OBP puanınızı telafi eder. Bu nedenle denemelerde süre yönetimi taktikleriyle hızlanmaya odaklanın.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
