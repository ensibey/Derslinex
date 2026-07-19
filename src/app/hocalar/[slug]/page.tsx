import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hocalar, getHocaBySlug } from "@/data/hocalar";
import StarRating from "@/components/StarRating";
import { waLinkHoca } from "@/lib/utils";

export async function generateStaticParams() {
  return hocalar.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const hoca = getHocaBySlug(resolvedParams.slug);
  if (!hoca) return {};
  return {
    title: `${hoca.isim} — ${hoca.dersler.join(", ")} Öğretmeni`,
    description: `${hoca.isim} ile ${hoca.dersler.join(", ")} dersi alın. ${hoca.deneyimYili} yıl deneyim, ${hoca.ogrenciSayisi}+ öğrenci. ${hoca.format === "online" ? "Online" : hoca.format === "yuz-yuze" ? "Yüz yüze" : "Online ve yüz yüze"} ders. WhatsApp ile hemen iletişim.`,
  };
}

const formatLabel: Record<string, string> = {
  "yuz-yuze": "Yüz Yüze",
  online: "Online",
  "her-ikisi": "Yüz Yüze & Online",
};

import ShareButtons from "@/components/ShareButtons";

export default async function HocaProfilPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const hoca = getHocaBySlug(resolvedParams.slug);
  if (!hoca) notFound();

  const waUrl = waLinkHoca(hoca.isim, hoca.dersler[0]);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `https://derslinex.com/hocalar/${hoca.slug}#service`,
      "name": `${hoca.isim} — Özel Ders`,
      "image": hoca.fotograf,
      "description": hoca.ozgecmis,
      "telephone": hoca.whatsapp ? `+${hoca.whatsapp}` : "+905405512020",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": hoca.konum
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": hoca.puan.toString(),
        "reviewCount": hoca.ogrenciSayisi.toString(),
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `https://derslinex.com/hocalar/${hoca.slug}#profile`,
      "mainEntity": {
        "@type": "Person",
        "name": hoca.isim,
        "jobTitle": `${hoca.unvan} / ${hoca.egitim}`,
        "image": hoca.fotograf,
        "description": hoca.ozgecmis
      }
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb & Share */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <nav className="text-sm text-gray-500 flex items-center gap-2 font-bold">
            <Link href="/" className="hover:text-primary-600">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/hocalar" className="hover:text-primary-600">Hocalar</Link>
            <span>/</span>
            <span className="text-gray-900 font-black">{hoca.isim}</span>
          </nav>
          <ShareButtons title={`${hoca.isim} — ${hoca.dersler.join(", ")} Özel Ders`} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sol Kolon — Profil Kartı */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
              {/* Foto */}
              <div className="bg-gradient-to-b from-primary-600 to-indigo-800 p-8 flex flex-col items-center">
                <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-white/10 mb-4">
                  <Image src={hoca.fotograf} alt={hoca.isim} fill className="object-cover" sizes="112px" unoptimized />
                </div>
                <h1 className="text-xl font-black text-white text-center">
                  {hoca.unvan === "Dr." ? `Dr. ${hoca.isim}` : hoca.isim}
                </h1>
                <p className="text-primary-200 text-sm mt-1">{hoca.unvan}</p>
              </div>

              {/* Detaylar */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-semibold">Puan</span>
                  <StarRating puan={hoca.puan} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-semibold">Öğrenci</span>
                  <span className="font-bold text-gray-800">{hoca.ogrenciSayisi}+</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-semibold">Deneyim</span>
                  <span className="font-bold text-gray-800">{hoca.deneyimYili} yıl</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-semibold">Format</span>
                  <span className="font-bold text-gray-800">{formatLabel[hoca.format]}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-semibold">Konum</span>
                  <span className="font-bold text-gray-800 text-right">{hoca.konum}</span>
                </div>

                {/* YKS Türleri */}
                <div className="pt-2">
                  <p className="text-xs text-gray-500 font-bold mb-2 uppercase tracking-wider">YKS Türleri</p>
                  <div className="flex flex-wrap gap-1.5">
                    {hoca.yksTuru.map((t) => (
                      <span key={t} className="text-xs bg-primary-50 text-primary-700 font-bold px-2.5 py-1 rounded-full border border-primary-100/30">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dersler */}
                <div className="pt-1">
                  <p className="text-xs text-gray-500 font-bold mb-2 uppercase tracking-wider">Verdiği Dersler</p>
                  <div className="flex flex-wrap gap-1.5">
                    {hoca.dersler.map((d) => (
                      <span key={d} className="text-xs bg-gray-100 text-gray-700 font-bold px-2.5 py-1 rounded-full border border-gray-200">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="p-5 pt-0 space-y-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.124.552 4.118 1.517 5.845L.057 23.547a.75.75 0 00.921.921l5.702-1.46A11.949 11.949 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.692-.504-5.23-1.385l-.374-.22-3.384.867.882-3.384-.22-.374A9.948 9.948 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  WhatsApp ile Ders Al
                </a>
                <p className="text-center text-xs text-gray-500 font-semibold">Genellikle 1 saat içinde yanıt verilir</p>
              </div>
            </div>
          </div>

          {/* Sağ Kolon — Detay */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hakkında */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Hoca Hakkında</h2>
              <p className="text-gray-700 leading-relaxed">{hoca.ozgecmis}</p>
            </div>

            {/* Eğitim */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Eğitim Geçmişi</h2>
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-1">🎓</span>
                <div>
                  <p className="font-semibold text-gray-900">{hoca.egitim}</p>
                </div>
              </div>
            </div>

            {/* İstatistikler */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: `${hoca.deneyimYili}+`, lbl: "Yıl Deneyim" },
                { val: `${hoca.ogrenciSayisi}+`, lbl: "Öğrenci" },
                { val: `${hoca.puan}/5.0`, lbl: "Ortalama Puan" },
              ].map((s) => (
                <div key={s.lbl} className="bg-primary-50/50 border border-primary-100 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-primary-600">{s.val}</div>
                  <div className="text-xs text-gray-500 mt-1 font-bold">{s.lbl}</div>
                </div>
              ))}
            </div>

            {/* Ders Formatı Detayı */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ders Formatı</h2>
              {(hoca.format === "her-ikisi" || hoca.format === "yuz-yuze") && (
                <div className="flex items-start gap-3 mb-4 p-4 bg-indigo-50/30 border border-indigo-100/50 rounded-xl">
                  <span className="text-2xl">🏫</span>
                  <div>
                    <p className="font-semibold text-gray-900">Yüz Yüze Ders</p>
                    <p className="text-sm text-gray-655 mt-1">Konum: {hoca.konum}</p>
                  </div>
                </div>
              )}
              {(hoca.format === "her-ikisi" || hoca.format === "online") && (
                <div className="flex items-start gap-3 p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-xl">
                  <span className="text-2xl">💻</span>
                  <div>
                    <p className="font-semibold text-gray-900">Online Ders</p>
                    <p className="text-sm text-gray-655 mt-1">Google Meet veya Zoom üzerinden canlı ders</p>
                  </div>
                </div>
              )}
            </div>

            {/* Alt CTA */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white text-center shadow-md relative overflow-hidden">
              <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <h3 className="text-2xl font-black mb-2 relative z-10">{hoca.isim} ile Ders Almak İster misin?</h3>
              <p className="text-emerald-100 text-sm mb-6 max-w-md mx-auto relative z-10">WhatsApp üzerinden hemen iletişime geç, müsaitlik ve ücret konuşun.</p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white text-emerald-700 font-bold px-10 py-4 rounded-xl hover:bg-emerald-50 hover:scale-105 transition-all relative z-10"
              >
                WhatsApp'ta Yaz
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
