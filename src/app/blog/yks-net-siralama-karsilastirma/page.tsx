import Link from "next/link";

export const metadata = {
  title: "YKS Net - Sıralama Karşılaştırma Tabloları | Derslinex",
  description: "2024, 2025 ve 2026 yıllarına ait çıkmış TYT ve AYT netlerinin yaklaşık yerleştirme sıralaması karşılıkları ve yığılma karşılaştırma tablosu."
};

const veri2024 = [
  { tytNet: "110 Net", aytNet: "75 Net", obp: "95", saySiralama: "950", eaSiralama: "120" },
  { tytNet: "100 Net", aytNet: "70 Net", obp: "92", saySiralama: "3,800", eaSiralama: "580" },
  { tytNet: "90 Net", aytNet: "60 Net", obp: "90", saySiralama: "14,500", eaSiralama: "2,400" },
  { tytNet: "80 Net", aytNet: "50 Net", obp: "85", saySiralama: "39,000", eaSiralama: "8,900" },
  { tytNet: "70 Net", aytNet: "40 Net", obp: "80", saySiralama: "85,000", eaSiralama: "22,000" }
];

const veri2025 = [
  { tytNet: "110 Net", aytNet: "75 Net", obp: "95", saySiralama: "1,200", eaSiralama: "180" },
  { tytNet: "100 Net", aytNet: "70 Net", obp: "92", saySiralama: "4,600", eaSiralama: "820" },
  { tytNet: "90 Net", aytNet: "60 Net", obp: "90", saySiralama: "17,200", eaSiralama: "3,100" },
  { tytNet: "80 Net", aytNet: "50 Net", obp: "85", saySiralama: "44,500", eaSiralama: "11,200" },
  { tytNet: "70 Net", aytNet: "40 Net", obp: "80", saySiralama: "98,000", eaSiralama: "28,500" }
];

export default function NetSiralamaKarsilastirmaPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#B45309] text-xs font-black uppercase tracking-widest">YKS VERİ MERKEZİ</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2 mb-3">YKS Net ve Sıralama Karşılaştırma Tabloları</h1>
          <p className="text-gray-500 text-sm font-semibold max-w-xl mx-auto leading-relaxed">
            Geçmiş sınav yıllarına ait netlerin yaklaşık sıralama karşılıklarını inceleyerek, yığılmanın netler üzerindeki etkisini analiz edin.
          </p>
        </div>

        {/* 2025 Veri Tablosu */}
        <section className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-sm mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-[#1E3A8A] uppercase tracking-wider">📊 2025 YKS Net - Sıralama Karşılıkları</h2>
            <span className="text-xs font-bold text-gray-400">Yaklaşık Sonuçlar</span>
          </div>

          <div className="overflow-x-auto whitespace-nowrap scrollbar-thin pb-2">
            <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-[#FAF8F5] text-gray-450 font-black uppercase tracking-wider">
                  <th className="pb-3 px-2">TYT Net</th>
                  <th className="pb-3 px-2">AYT Net</th>
                  <th className="pb-3 px-2">OBP</th>
                  <th className="pb-3 px-2 text-right">Sayısal Sıralama</th>
                  <th className="pb-3 px-2 text-right">Eşit Ağırlık</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-bold text-gray-700">
                {veri2025.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-2 text-[#1E3A8A]">{row.tytNet}</td>
                    <td className="py-4 px-2">{row.aytNet}</td>
                    <td className="py-4 px-2">{row.obp}</td>
                    <td className="py-4 px-2 text-right text-emerald-650 font-black">{row.saySiralama}</td>
                    <td className="py-4 px-2 text-right text-[#B45309] font-black">{row.eaSiralama}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2024 Veri Tablosu */}
        <section className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-sm mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-[#1E3A8A] uppercase tracking-wider">📊 2024 YKS Net - Sıralama Karşılıkları</h2>
            <span className="text-xs font-bold text-gray-400">Resmi Veriler</span>
          </div>

          <div className="overflow-x-auto whitespace-nowrap scrollbar-thin pb-2">
            <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-[#FAF8F5] text-gray-450 font-black uppercase tracking-wider">
                  <th className="pb-3 px-2">TYT Net</th>
                  <th className="pb-3 px-2">AYT Net</th>
                  <th className="pb-3 px-2">OBP</th>
                  <th className="pb-3 px-2 text-right">Sayısal Sıralama</th>
                  <th className="pb-3 px-2 text-right">Eşit Ağırlık</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-bold text-gray-700">
                {veri2024.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-2 text-[#1E3A8A]">{row.tytNet}</td>
                    <td className="py-4 px-2">{row.aytNet}</td>
                    <td className="py-4 px-2">{row.obp}</td>
                    <td className="py-4 px-2 text-right text-emerald-650 font-black">{row.saySiralama}</td>
                    <td className="py-4 px-2 text-right text-[#B45309] font-black">{row.eaSiralama}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sales Conversion Section */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-black">🎯 Hedeflediğin Sıralamaya Ulaşmak İster misin?</h3>
            <p className="text-xs text-amber-50 font-semibold max-w-lg leading-relaxed">
              Yığışmanın etkisini en aza indirmek ve hedeflerini riske atmamak için hemen uzman hocalarımızla çalışmaya başla, netlerini garantiye al!
            </p>
          </div>
          <Link
            href="/hocalar"
            className="bg-white hover:bg-gray-50 text-[#B45309] font-black px-6 py-3.5 rounded-xl transition-all shadow-sm active:scale-95 text-xs text-center whitespace-nowrap"
          >
            Birebir Ders Al ➔
          </Link>
        </div>
      </div>
    </div>
  );
}
