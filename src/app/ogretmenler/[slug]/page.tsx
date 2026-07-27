import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hocalar, getHocaBySlug } from "@/data/hocalar";
import StarRating from "@/components/StarRating";
import { waLinkHoca } from "@/lib/utils";
import { prisma } from "@/lib/db";

function getYouTubeEmbedId(url: string | null) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return hocalar.map((h) => ({ slug: h.slug }));
}

async function getHocaOrDb(slug: string) {
  const staticH = getHocaBySlug(slug);
  if (staticH) return staticH;

  // Query database
  const dbTeachers = await prisma.teacher.findMany({
    where: { status: "İletişime Geçildi" }
  });

  const matched = dbTeachers.find(
    (t) => t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
  );

  if (matched) {
    return {
      id: `db-${matched.id}`,
      slug: slug,
      isim: matched.name,
      unvan: "Eğitmen",
      fotograf: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(matched.name)}&eyebrows=default&mouth=smile`,
      dersler: [matched.branch],
      yksTuru: ["TYT", "AYT Sayısal", "AYT EA"] as any[],
      format: "online" as const,
      konum: "Online / Türkiye Geneli",
      deneyimYili: 5,
      egitim: matched.egitim || "Derslinex Onaylı Özel Ders Eğitmeni",
      ozgecmis: matched.ozgecmis || `${matched.name}, Derslinex platformu bünyesinde ${matched.branch} alanında profesyonel online birebir dersler sunmaktadır.`,
      whatsapp: matched.phone.replace(/[^0-9]/g, ""),
      puan: 4.9,
      ogrenciSayisi: 15,
      linkedin: matched.linkedin,
      youtube: matched.youtube,
      aktif: true
    };
  }
  return undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const hoca = await getHocaOrDb(resolvedParams.slug);
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
  const hoca = await getHocaOrDb(resolvedParams.slug);
  if (!hoca) notFound();

  // Load custom lesson offers and other details
  let customLessons: any[] = [];
  let faqs: any[] = [];
  let realRating = hoca.puan;
  let totalReviews = hoca.ogrenciSayisi;

  if (hoca.id.toString().startsWith("db-")) {
    const dbId = parseInt(hoca.id.toString().replace("db-", ""));
    const [dbLessons, dbFaqs, dbFeedbacks] = await Promise.all([
      prisma.lessonOffer.findMany({
        where: { teacherId: dbId },
        orderBy: { createdAt: "desc" }
      }),
      prisma.teacherFAQ.findMany({
        where: { teacherId: dbId },
        orderBy: { createdAt: "asc" }
      }),
      prisma.feedback.findMany({
        where: { teacherId: dbId }
      })
    ]);
    
    customLessons = dbLessons;
    faqs = dbFaqs;
    
    if (dbFeedbacks.length > 0) {
      const totalScore = dbFeedbacks.reduce((acc, curr) => acc + curr.rating, 0);
      realRating = parseFloat((totalScore / dbFeedbacks.length).toFixed(1));
      totalReviews = dbFeedbacks.length;
    }
  } else {
    customLessons = [
      {
        id: "static-1",
        title: `${hoca.dersler[0]} Birebir Özel Ders`,
        price: 450,
        format: hoca.format,
        description: `${hoca.isim} öğretmenimizden hedeflerinize özel hazırlanmış birebir ${hoca.dersler[0]} dersleri.`
      }
    ];
    faqs = [
      {
        id: "static-faq-1",
        question: "Dersler ne kadar sürüyor?",
        answer: "Birebir özel derslerimiz standart olarak 50 dakika ders + 10 dakika mola şeklinde 1 saat olarak uygulanmaktadır."
      },
      {
        id: "static-faq-2",
        question: "Ders dışı soru sorabiliyor muyum?",
        answer: "Evet, tüm öğrencilerimiz takıldıkları soruları WhatsApp üzerinden öğretmenlerimize haftalık soru limitleri dahilinde sorabilirler."
      }
    ];
  }

  const waUrl = waLinkHoca(hoca.isim, hoca.dersler[0]);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `https://derslinex.com/ogretmenler/${hoca.slug}#service`,
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
      "@id": `https://derslinex.com/ogretmenler/${hoca.slug}#profile`,
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
            <Link href="/ogretmenler" className="hover:text-primary-600">Öğretmenler</Link>
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
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-800">{realRating}</span>
                    <StarRating puan={realRating} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-semibold">Görüş / İstek</span>
                  <span className="font-bold text-gray-800">{totalReviews}</span>
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
                <a
                  href={`/profil?startChatWithTeacherId=${hoca.id.toString().replace("db-", "")}&teacherName=${encodeURIComponent(hoca.isim)}`}
                  className="flex items-center justify-center gap-2 w-full bg-white hover:bg-gray-50 text-[#1E3A8A] font-bold py-3 rounded-xl transition-all text-sm border border-gray-200 shadow-xs"
                >
                  💬 Site İçi Mesaj Gönder
                </a>
                <p className="text-center text-xs text-gray-500 font-semibold">Genellikle 1 saat içinde yanıt verilir</p>
                {(hoca.linkedin || hoca.youtube) && (
                  <div className="pt-3.5 mt-2 border-t border-gray-100 flex items-center justify-center gap-4 flex-wrap">
                    {hoca.linkedin && (
                      <a
                        href={hoca.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-700 transition-colors flex items-center gap-1 font-bold text-xs"
                      >
                        <span className="text-sm">👔</span> LinkedIn
                      </a>
                    )}
                    {hoca.youtube && (
                      <a
                        href={hoca.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1 font-bold text-xs"
                      >
                        <span className="text-sm">🎥</span> YouTube Tanıtımı
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sağ Kolon — Detay */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hakkında */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Öğretmen Hakkında</h2>
              <p className="text-gray-700 leading-relaxed">{hoca.ozgecmis}</p>
            </div>

            {/* Tanıtım Videosu */}
            {hoca.youtube && getYouTubeEmbedId(hoca.youtube) && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Tanıtım Videosu</h2>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${getYouTubeEmbedId(hoca.youtube)}`}
                    title="Öğretmen Tanıtım Videosu"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

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

            {/* Ders Teklifleri */}
            {customLessons.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Açtığı Dersler & Saatlik Ücretler</h2>
                <div className="grid gap-4">
                  {customLessons.map((l: any) => {
                    // Generate specialized WhatsApp booking link
                    const targetPhone = hoca.whatsapp || "905342407519";
                    const lessonWa = `https://wa.me/${targetPhone}?text=${encodeURIComponent(
                      `Merhaba, Derslinex üzerinden "${l.title}" dersinizi saatlik ${l.price} TL karşılığında almak istiyorum.`
                    )}`;
                    return (
                      <div key={l.id} className="p-4 bg-[#FAF8F5]/80 border border-gray-150 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-100 hover:bg-[#FAF8F5] transition">
                        <div>
                          <h4 className="font-bold text-[#1E3A8A] text-sm sm:text-base">{l.title}</h4>
                          <span className="inline-block text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-100 mt-1">
                            {l.format === "online" ? "💻 Online" : l.format === "yuz-yuze" ? "🏫 Yüz Yüze" : "🔄 Online & Yüz Yüze"}
                          </span>
                          {l.description && <p className="text-gray-500 text-xs mt-2 font-semibold leading-relaxed">{l.description}</p>}
                        </div>
                        <div className="flex sm:flex-col items-end gap-2 w-full sm:w-auto">
                          <span className="text-sm sm:text-lg font-black text-[#B45309] whitespace-nowrap">{l.price} TL / Saat</span>
                          <a
                            href={lessonWa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl text-center transition w-full sm:w-auto whitespace-nowrap"
                          >
                            Ders Al (WhatsApp)
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* İstatistikler */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: `${hoca.deneyimYili}+`, lbl: "Yıl Deneyim" },
                { val: `${totalReviews}`, lbl: "Görüş / İstek" },
                { val: `${realRating}/5.0`, lbl: "Ortalama Puan" },
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

            {/* Sıkça Sorulan Sorular */}
            {faqs.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Sıkça Sorulan Sorular (SSS)</h2>
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <details key={faq.id} className="group border border-gray-100 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition select-none">
                        <span className="font-bold text-sm text-gray-900 leading-snug">{faq.question}</span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform duration-200">▼</span>
                      </summary>
                      <div className="p-4 border-t border-gray-100 bg-white text-xs text-gray-655 font-semibold leading-relaxed">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

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
