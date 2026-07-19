import Link from "next/link";
import { wikiKonulari } from "@/data/wiki";

export const metadata = {
  title: "Ders Konuları Sözlüğü | YKS & LGS Wiki",
  description: "YKS ve LGS sınavlarında en çok aratılan ders terimleri, formülleri ve konu anlatım özetlerinin yer aldığı interaktif eğitim kütüphanesi."
};

export default function WikiIndexPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#B45309] text-xs font-black uppercase tracking-widest">EĞİTİM KÜTÜPHANESİ</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2 mb-3">Ders Konuları Sözlüğü</h1>
          <p className="text-gray-500 text-sm font-semibold max-w-xl mx-auto leading-relaxed">
            YKS ve LGS sınavlarında karşına çıkabilecek kritik terimleri, kuralları ve ÖSYM soru tiplerini tek tıkla öğren.
          </p>
        </div>

        {/* Search / Topic Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wikiKonulari.map((wiki) => (
            <div
              key={wiki.id}
              className="bg-white border border-[#EFECE6] rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#B45309] transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-[#B45309] bg-[#FAF0E3] px-2.5 py-1 rounded-xl">
                    {wiki.kategori} {wiki.ders}
                  </span>
                </div>
                <h3 className="text-base font-black text-gray-800 leading-snug mb-3">
                  {wiki.baslik}
                </h3>
                <p className="text-xs text-gray-500 font-bold line-clamp-3 leading-relaxed mb-6">
                  {wiki.ozet}
                </p>
              </div>

              <Link
                href={`/wiki/${wiki.slug}`}
                className="w-full bg-[#FAF8F5] hover:bg-[#FAF0E3] border border-[#EFECE6] text-[#1E3A8A] hover:text-[#B45309] hover:border-[#F5D0A9] font-black py-3 rounded-2xl transition-all text-xs text-center active:scale-95 block"
              >
                Konuyu İncele ➔
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
