import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hocalar } from "@/data/hocalar";
import TeacherCard from "@/components/TeacherCard";
import { waLink } from "@/lib/utils";

interface PageProps {
  params: Promise<{ sehir: string }>;
}

function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/â/g, "a");
}

function formatSlug(slug: string): string {
  const mapping: Record<string, string> = {
    istanbul: "İstanbul",
    ankara: "Ankara",
    izmir: "İzmir",
    denizli: "Denizli",
  };
  
  if (mapping[slug.toLowerCase()]) {
    return mapping[slug.toLowerCase()];
  }
  
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateStaticParams() {
  return [
    { sehir: "istanbul" },
    { sehir: "ankara" },
    { sehir: "izmir" },
    { sehir: "denizli" }
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const sehirName = formatSlug(resolvedParams.sehir);
  return {
    title: {
      absolute: `${sehirName} Birebir Özel Ders — YKS LGS Hazırlık Hocaları`
    },
    description: `${sehirName} genelinde online veya yüz yüze birebir özel ders alın. Matematik, Fizik, Kimya derslerinde YKS ve LGS hazırlığı için en iyi dereceli hocalar.`,
  };
}

export default async function SehirOzelDersPage({ params }: PageProps) {
  const resolvedParams = await params;
  const sehirSlug = resolvedParams.sehir;
  const sehirName = formatSlug(sehirSlug);

  const normalizedSehir = normalizeText(sehirName);
  const ilgiliHocalar = hocalar.filter((h) => {
    if (!h.aktif) return false;
    return normalizeText(h.konum).includes(normalizedSehir) || h.konum.toLowerCase().includes("türkiye geneli");
  });

  // Şehre ait popüler ilçeleri çıkartalım (Hocaların konumlarından)
  const ilceler = Array.from(
    new Set(
      hocalar
        .filter((h) => normalizeText(h.konum).includes(normalizedSehir) && h.konum.includes(","))
        .map((h) => h.konum.split(",")[0].trim())
    )
  ).sort();

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2 font-bold">
          <Link href="/" className="hover:text-[#B45309] transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/hocalar" className="hover:text-[#B45309] transition-colors">Eğitmenler</Link>
          <span>/</span>
          <span className="text-gray-900 font-black">{sehirName}</span>
        </nav>

        {/* Hero */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-8 sm:p-12 text-[#1E3A8A] mb-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FAF0E3]/60 rounded-bl-full -z-10" />
          
          <div className="flex-1 relative z-10 text-left">
            <span className="inline-block bg-[#FAF0E3] border border-[#F5D0A9] text-[#B45309] text-xs font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              YEREL ÖZEL DERS
            </span>
            <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight text-[#1E3A8A]">
              {sehirName} Birebir Özel Ders
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mb-8 leading-relaxed font-medium">
              {sehirName} genelinde YKS ve LGS hazırlığı için en iyi öğretmenlerden online veya evinizde yüz yüze birebir özel ders alın. Matematik, Fizik, Türkçe ve Kimya alanında derece yapan hocalarla hemen başlayın.
            </p>
            <a href={waLink(`Merhaba, ${sehirName} şehrinde özel ders almak için hoca arıyorum.`)}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#B45309] hover:bg-[#92400E] text-white font-black px-10 py-4 rounded-xl transition-all shadow-sm">
              WhatsApp ile Hoca Önerisi Al
            </a>
          </div>
        </div>

        {/* İlçeler Filtresi */}
        {ilceler.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">İLGİLİ İLÇELER</h2>
            <div className="flex flex-wrap gap-2">
              {ilceler.map((ilce) => {
                const ilceSlug = ilce.toLowerCase().replace(/ş/g, "s").replace(/ç/g, "c").replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ö/g, "o");
                return (
                  <Link
                    key={ilce}
                    href={`/ozel-ders/${sehirSlug}/${ilceSlug}`}
                    className="bg-white border border-[#EFECE6] hover:border-[#F5D0A9] text-gray-700 hover:text-[#B45309] text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    📍 {ilce} Özel Ders
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Hocalar */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-[#1E3A8A]">
              {sehirName} Bölgesindeki Hocalarımız ({ilgiliHocalar.length})
            </h2>
          </div>
          
          {ilgiliHocalar.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ilgiliHocalar.map((h) => <TeacherCard key={h.id} hoca={h} />)}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#EFECE6] p-8 shadow-sm">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-black text-[#1E3A8A] mb-2">Bu bölgeye uygun hoca kaydı bulunamadı</h3>
              <p className="text-gray-500 mb-6 font-medium">Diğer hocalarımızla online ders yapmak için WhatsApp'tan iletişime geçebilirsiniz.</p>
              <a href={waLink(`Merhaba, ${sehirName} bölgesinde ders almak istiyorum. Online hocaları görebilir miyim?`)}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] text-white font-black px-6 py-3 rounded-xl transition-all shadow-sm">
                WhatsApp'tan Sor
              </a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
