import type { Metadata } from "next";
import Link from "next/link";
import { hocalar } from "@/data/hocalar";
import TeacherCard from "@/components/TeacherCard";
import { waLink } from "@/lib/utils";

interface PageProps {
  params: Promise<{ sehir: string; ilce: string }>;
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
    kadikoy: "Kadıköy",
    besiktas: "Beşiktaş",
    uskudar: "Üsküdar",
    cankaya: "Çankaya",
    karsiyaka: "Karşıyaka",
    bornova: "Bornova",
    pamukkale: "Pamukkale",
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
    { sehir: "istanbul", ilce: "kadikoy" },
    { sehir: "istanbul", ilce: "besiktas" },
    { sehir: "istanbul", ilce: "uskudar" },
    { sehir: "ankara", ilce: "cankaya" },
    { sehir: "izmir", ilce: "karsiyaka" },
    { sehir: "izmir", ilce: "bornova" },
    { sehir: "denizli", ilce: "pamukkale" }
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const sehirName = formatSlug(resolvedParams.sehir);
  const ilceName = formatSlug(resolvedParams.ilce);
  return {
    title: {
      absolute: `${ilceName} Birebir Özel Ders — ${sehirName} YKS LGS Hocaları`
    },
    description: `${sehirName} ${ilceName} bölgesinde yüz yüze birebir özel ders veya online eğitim alın. Matematik, Fizik, Türkçe derslerinde derece yapmış en iyi öğretmenler.`,
  };
}

export default async function IlceOzelDersPage({ params }: PageProps) {
  const resolvedParams = await params;
  const sehirSlug = resolvedParams.sehir;
  const ilceSlug = resolvedParams.ilce;
  
  const sehirName = formatSlug(sehirSlug);
  const ilceName = formatSlug(ilceSlug);

  const normalizedSehir = normalizeText(sehirName);
  const normalizedIlce = normalizeText(ilceName);

  const ilgiliHocalar = hocalar.filter((h) => {
    if (!h.aktif) return false;
    const normalizedHocaKonum = normalizeText(h.konum);
    // Hoca ya doğrudan bu ilçede olmalı ya da "Türkiye Geneli (Online)" vermeli
    return (
      (normalizedHocaKonum.includes(normalizedSehir) && normalizedHocaKonum.includes(normalizedIlce)) ||
      h.konum.toLowerCase().includes("türkiye geneli")
    );
  });

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2 font-bold">
          <Link href="/" className="hover:text-[#B45309] transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/hocalar" className="hover:text-[#B45309] transition-colors">Eğitmenler</Link>
          <span>/</span>
          <Link href={`/ozel-ders/${sehirSlug}`} className="hover:text-[#B45309] transition-colors">{sehirName}</Link>
          <span>/</span>
          <span className="text-gray-900 font-black">{ilceName}</span>
        </nav>

        {/* Hero */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-8 sm:p-12 text-[#1E3A8A] mb-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FAF0E3]/60 rounded-bl-full -z-10" />
          
          <div className="flex-1 relative z-10 text-left">
            <span className="inline-block bg-[#FAF0E3] border border-[#F5D0A9] text-[#B45309] text-xs font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              MAHALLE & İLÇE ÖZEL DERS
            </span>
            <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight text-[#1E3A8A]">
              {sehirName} {ilceName} Birebir Özel Ders
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mb-8 leading-relaxed font-medium">
              {sehirName} - {ilceName} bölgesinde yüz yüze ders veren öğretmenlerimizle veya online canlı ders altyapımızla hedefinize emin adımlarla ilerleyin. Derslinex ile derece yapmış öğretmenlerden kişiye özel YKS LGS hazırlık eğitimi alın.
            </p>
            <a href={waLink(`Merhaba, ${sehirName} ${ilceName} bölgesinde yüz yüze/online ders almak için hoca arıyorum.`)}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#B45309] hover:bg-[#92400E] text-white font-black px-10 py-4 rounded-xl transition-all shadow-sm">
              WhatsApp ile Hoca Önerisi Al
            </a>
          </div>
        </div>

        {/* Hocalar */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-[#1E3A8A]">
              {ilceName} Çevresindeki Hocalarımız ({ilgiliHocalar.filter(h => normalizeText(h.konum).includes(normalizedIlce)).length} Yüz Yüze + Online)
            </h2>
          </div>
          
          {ilgiliHocalar.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ilgiliHocalar.map((h) => <TeacherCard key={h.id} hoca={h} />)}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#EFECE6] p-8 shadow-sm">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-black text-[#1E3A8A] mb-2">Bu bölgeye özel yüz yüze hoca kaydı bulunamadı</h3>
              <p className="text-gray-500 mb-6 font-medium">Online ders altyapımızla Türkiye'nin en seçkin hocalarıyla hemen derse başlayabilirsiniz.</p>
              <a href={waLink(`Merhaba, ${sehirName} ${ilceName} bölgesinde online özel ders için bilgi almak istiyorum.`)}
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
