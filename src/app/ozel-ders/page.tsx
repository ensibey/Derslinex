import type { Metadata } from "next";
import Link from "next/link";
import { dersAlanlari } from "@/data/dersler";
import SubjectCard from "@/components/SubjectCard";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Özel Ders — Türkiye Geneli YKS & LGS Birebir Özel Ders Rehberi",
  description:
    "İstanbul, Ankara, İzmir, Denizli ve tüm Türkiye'de online ya da yüz yüze birebir özel ders alın. YKS ve LGS Matematik, Fizik, Kimya ve Türkçe öğretmenleri.",
};

const populerSehirler = [
  { slug: "istanbul", name: "İstanbul", count: "120+ Öğretmen", badge: "En Popüler" },
  { slug: "ankara", name: "Ankara", count: "85+ Öğretmen", badge: "Başkent" },
  { slug: "izmir", name: "İzmir", count: "65+ Öğretmen", badge: "Ege" },
  { slug: "denizli", name: "Denizli", count: "40+ Öğretmen", badge: "Merkez" },
  { slug: "bursa", name: "Bursa", count: "35+ Öğretmen" },
  { slug: "antalya", name: "Antalya", count: "30+ Öğretmen" },
  { slug: "adana", name: "Adana", count: "25+ Öğretmen" },
  { slug: "kocaeli", name: "Kocaeli", count: "20+ Öğretmen" },
  { slug: "konya", name: "Konya", count: "20+ Öğretmen" },
  { slug: "eskisehir", name: "Eskişehir", count: "25+ Öğretmen" },
];

export default function OzelDersRootPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2 font-bold">
          <Link href="/" className="hover:text-[#B45309] transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-gray-900 font-black">Özel Ders Rehberi</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-8 sm:p-12 text-[#1E3A8A] mb-14 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF0E3]/70 rounded-bl-full -z-10" />
          <div className="max-w-3xl">
            <span className="inline-block bg-[#FAF0E3] border border-[#F5D0A9] text-[#B45309] text-xs font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              TÜRKİYE GENELİ BİREBİR EĞİTİM
            </span>
            <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight leading-tight">
              Şehrinize & İhtiyacınıza Özel <br />
              <span className="text-[#B45309]">Birebir Özel Ders</span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed font-medium">
              Türkiye'nin neresinde olursanız olun, ister online ister yüz yüze dereceli uzman öğretmen kadromuzla hedeflerinize ulaşın. Derslinex ile kişiye özel haftalık program yapın.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/ogretmenler"
                className="bg-[#1E3A8A] hover:bg-[#152860] text-white font-black px-8 py-3.5 rounded-xl transition-all shadow-md"
              >
                Tüm Öğretmenleri İncele →
              </Link>
              <a
                href={waLink("Merhaba, özel ders hakkında bilgi almak istiyorum.")}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#B45309] hover:bg-[#92400E] text-white font-black px-8 py-3.5 rounded-xl transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>💬 WhatsApp Danışma</span>
              </a>
            </div>
          </div>
        </div>

        {/* Şehirlere Göre Özel Ders */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <span className="text-[#B45309] text-xs font-black uppercase tracking-widest block">LOKASYON BAZLI DERSLER</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1E3A8A] mt-1">Şehre Göre Özel Ders Alın</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {populerSehirler.map((s) => (
              <Link
                key={s.slug}
                href={`/ozel-ders/${s.slug}`}
                className="bg-white border border-[#EFECE6] hover:border-[#B45309] rounded-2xl p-5 transition-all duration-200 shadow-sm hover:shadow-md group relative"
              >
                {s.badge && (
                  <span className="absolute top-3 right-3 text-[10px] font-black bg-[#FAF0E3] text-[#B45309] px-2 py-0.5 rounded-md">
                    {s.badge}
                  </span>
                )}
                <div className="w-10 h-10 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center text-xl mb-3 group-hover:bg-[#B45309] group-hover:text-white transition-colors">
                  📍
                </div>
                <h3 className="font-black text-lg text-[#1E3A8A] group-hover:text-[#B45309] transition-colors">
                  {s.name} Özel Ders
                </h3>
                <p className="text-xs text-gray-500 font-bold mt-1">{s.count}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Ders Alanları */}
        <section className="mb-16">
          <div className="mb-8">
            <span className="text-[#B45309] text-xs font-black uppercase tracking-widest block">BRANŞ SEÇİMİ</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E3A8A] mt-1">Özel Ders Alabileceğiniz Branşlar</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dersAlanlari.map((d) => (
              <SubjectCard key={d.id} ders={d} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
