"use client";
import { useState, useEffect } from "react";
import { waLink } from "@/lib/utils";

interface DenemeKaydi {
  id: string;
  ad: string;
  turkce: number;
  matematik: number;
  sosyal: number;
  fen: number;
  tarih: string;
}

export default function DenemeNetTakipPage() {
  const [denemeler, setDenemeler] = useState<DenemeKaydi[]>([]);
  const [ad, setAd] = useState("");
  const [turkce, setTurkce] = useState<number>(0);
  const [matematik, setMatematik] = useState<number>(0);
  const [sosyal, setSosyal] = useState<number>(0);
  const [fen, setFen] = useState<number>(0);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("derslinex_deneme_takip");
      if (saved) {
        setDenemeler(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Local storage load error:", e);
    }
  }, []);

  const saveToLocalStorage = (list: DenemeKaydi[]) => {
    try {
      localStorage.setItem("derslinex_deneme_takip", JSON.stringify(list));
    } catch (e) {
      console.error("Local storage save error:", e);
    }
  };

  const handleAddDeneme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ad) return;

    // Normalise net values
    const tNet = Math.min(40, Math.max(0, turkce));
    const mNet = Math.min(40, Math.max(0, matematik));
    const sNet = Math.min(20, Math.max(0, sosyal));
    const fNet = Math.min(20, Math.max(0, fen));

    const yeniKayit: DenemeKaydi = {
      id: Math.random().toString(36).substring(2, 9),
      ad,
      turkce: tNet,
      matematik: mNet,
      sosyal: sNet,
      fen: fNet,
      tarih: new Date().toLocaleDateString("tr-TR")
    };

    const updated = [yeniKayit, ...denemeler];
    setDenemeler(updated);
    saveToLocalStorage(updated);

    // Reset inputs
    setAd("");
    setTurkce(0);
    setMatematik(0);
    setSosyal(0);
    setFen(0);
  };

  const handleDelete = (id: string) => {
    const updated = denemeler.filter((item) => item.id !== id);
    setDenemeler(updated);
    saveToLocalStorage(updated);
  };

  const calculateTotalNet = (item: DenemeKaydi) => {
    return item.turkce + item.matematik + item.sosyal + item.fen;
  };

  // Get average nets
  const getAverage = (key: keyof Omit<DenemeKaydi, "id" | "ad" | "tarih">) => {
    if (denemeler.length === 0) return 0;
    const sum = denemeler.reduce((acc, item) => acc + item[key], 0);
    return Number((sum / denemeler.length).toFixed(1));
  };

  const averageTotal = getAverage("turkce") + getAverage("matematik") + getAverage("sosyal") + getAverage("fen");

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#B45309] text-xs font-black uppercase tracking-widest font-sans">NET ANALİZ KARTLARI</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2 mb-3">Deneme Net Takip Paneli</h1>
          <p className="text-gray-500 text-sm font-semibold max-w-xl mx-auto leading-relaxed">
            Haftalık çözdüğünüz TYT veya LGS deneme netlerini sisteme kaydedin, net gelişim çizgilerinizi ve ders bazlı istatistiklerinizi canlı takip edin.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Add Net Record */}
          <div className="lg:col-span-2 bg-white border border-[#EFECE6] rounded-3xl p-6 shadow-sm h-fit">
            <h2 className="text-base font-black text-[#1E3A8A] mb-5 border-b border-[#FAF8F5] pb-3">Deneme Sonucu Ekle</h2>
            
            <form onSubmit={handleAddDeneme} className="space-y-4">
              <div>
                <label htmlFor="deneme-ad" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Deneme Adı / Yayıncı *</label>
                <input
                  id="deneme-ad"
                  type="text"
                  required
                  value={ad}
                  onChange={(e) => setAd(e.target.value)}
                  placeholder="Örn: 3D Türkiye Geneli 1, Özdebir..."
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-[#B45309]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="net-turkce" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Türkçe (Max 40)</label>
                  <input
                    id="net-turkce"
                    type="number"
                    min="0"
                    max="40"
                    step="0.25"
                    value={turkce}
                    onChange={(e) => setTurkce(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-[#B45309]"
                  />
                </div>
                <div>
                  <label htmlFor="net-matematik" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Matematik (Max 40)</label>
                  <input
                    id="net-matematik"
                    type="number"
                    min="0"
                    max="40"
                    step="0.25"
                    value={matematik}
                    onChange={(e) => setMatematik(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-[#B45309]"
                  />
                </div>
                <div>
                  <label htmlFor="net-sosyal" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Sosyal (Max 20)</label>
                  <input
                    id="net-sosyal"
                    type="number"
                    min="0"
                    max="20"
                    step="0.25"
                    value={sosyal}
                    onChange={(e) => setSosyal(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-[#B45309]"
                  />
                </div>
                <div>
                  <label htmlFor="net-fen" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Fen Bilimleri (Max 20)</label>
                  <input
                    id="net-fen"
                    type="number"
                    min="0"
                    max="20"
                    step="0.25"
                    value={fen}
                    onChange={(e) => setFen(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-[#B45309]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#B45309] hover:bg-[#92400E] text-white font-black py-3 rounded-xl transition-all shadow active:scale-95 text-xs"
              >
                💾 Denemeyi Kaydet
              </button>
            </form>
          </div>

          {/* Results Analytics & History */}
          <div className="lg:col-span-3 space-y-6">
            {denemeler.length > 0 ? (
              <>
                {/* Stats summary cards */}
                <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-[#1E3A8A] uppercase tracking-wider">📊 NET ORTALAMALARINIZ</h3>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {[
                      { lbl: "Türkçe", val: getAverage("turkce"), max: 40 },
                      { lbl: "Mat", val: getAverage("matematik"), max: 40 },
                      { lbl: "Sosyal", val: getAverage("sosyal"), max: 20 },
                      { lbl: "Fen", val: getAverage("fen"), max: 20 },
                      { lbl: "Toplam", val: averageTotal, max: 120 }
                    ].map((item) => (
                      <div key={item.lbl} className="bg-[#FAF8F5] border border-[#EFECE6] rounded-xl p-2">
                        <p className="text-[9px] font-black text-gray-400 uppercase">{item.lbl}</p>
                        <p className="text-sm font-black text-[#1E3A8A] mt-1">{item.val}</p>
                        <p className="text-[8px] text-gray-400 font-bold mt-0.5">/{item.max}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* History Table list */}
                <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 shadow-md">
                  <div className="flex justify-between items-center pb-4 border-b border-[#FAF8F5] mb-4">
                    <h3 className="text-xs font-black text-[#1E3A8A] uppercase tracking-wider">📋 DENEME GEÇMİŞİ</h3>
                    <span className="text-[10px] text-gray-400 font-bold">{denemeler.length} kayıt</span>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                    {denemeler.map((item) => {
                      const total = calculateTotalNet(item);
                      return (
                        <div
                          key={item.id}
                          className="bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl p-4 flex justify-between items-center hover:border-[#B45309] transition-all"
                        >
                          <div>
                            <h4 className="font-black text-gray-800 text-xs sm:text-sm">{item.ad}</h4>
                            <p className="text-[9px] text-gray-400 font-semibold mt-1">
                              📅 {item.tarih} | TR: {item.turkce} | MAT: {item.matematik} | SOS: {item.sosyal} | FEN: {item.fen}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-[#1E3A8A] bg-[#FAF0E3] px-3 py-1.5 rounded-xl border border-[#F5D0A9]/30">
                              {total} Net
                            </span>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-gray-400 hover:text-red-500 font-bold text-xs"
                              aria-label="Sil"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Conversion callout */}
                <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div>
                    <h4 className="text-xs font-black text-blue-900">📉 Netlerini Hızla Yükseltmek İster misin?</h4>
                    <p className="text-[10px] text-blue-800 mt-1 font-bold">
                      Ortalama netini artırmak ve yanlış yaptığın konuları sıfırlamak için uzman hocalarımızla tanışma seansı ayarla.
                    </p>
                  </div>
                  <a
                    href={waLink(`Merhaba, platformda son deneme netlerimi kaydettim. Net ortalamam şu an yaklaşık ${averageTotal} seviyesinde. Netlerimi yükseltecek bir özel ders planı talep ediyorum.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1E3A8A] hover:bg-[#152a60] text-white text-xs font-black px-5 py-3 rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap"
                  >
                    💬 Netimi Yükselt ➔
                  </a>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white/50 border border-dashed border-[#EFECE6] rounded-3xl">
                <span className="text-5xl">📊</span>
                <p className="text-gray-500 font-bold mt-4">Henüz kaydedilmiş deneme sonucunuz bulunmamaktadır.</p>
                <p className="text-gray-400 text-xs mt-1">Sol taraftaki panelden ilk denemenizi ekleyip analize başlayabilirsiniz.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
