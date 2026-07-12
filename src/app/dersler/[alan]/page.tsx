import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dersAlanlari, getDersAlaniBySlug } from "@/data/dersler";
import { hocalar } from "@/data/hocalar";
import TeacherCard from "@/components/TeacherCard";
import Image from "next/image";
import { waLink } from "@/lib/utils";

export async function generateStaticParams() {
  return dersAlanlari.map((d) => ({ alan: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ alan: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const ders = getDersAlaniBySlug(resolvedParams.alan);
  if (!ders) return {};
  return {
    title: `${ders.isim} YKS Hazırlık — Uzman ${ders.isim} Hocaları`,
    description: `${ders.isim} dersinde YKS'ye hazırlanın. ${ders.yksTuru.join(", ")} için deneyimli hocalar, online ve yüz yüze ders seçenekleri. WhatsApp ile hemen başlayın.`,
  };
}

export default async function DersAlaniPage({ params }: { params: Promise<{ alan: string }> }) {
  const resolvedParams = await params;
  const ders = getDersAlaniBySlug(resolvedParams.alan);
  if (!ders) notFound();

  const ilgiliHocalar = hocalar.filter(
    (h) => h.aktif && h.dersler.some((d) => d.toLowerCase().includes(ders.isim.toLowerCase().split(" ")[0]))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-primary-600">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/dersler" className="hover:text-primary-600">Dersler</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{ders.isim}</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-850 rounded-3xl p-8 sm:p-12 text-white mb-12 shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex-1 relative z-10">
          <div className="text-6xl mb-4">{ders.emoji}</div>
          <h1 className="text-4xl font-black mb-3 tracking-tight">{ders.isim} YKS Hazırlık</h1>
          <p className="text-primary-100 text-lg max-w-xl mb-8 leading-relaxed">{ders.aciklama}</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {ders.yksTuru.map((t) => (
              <span key={t} className="bg-white/10 border border-white/10 text-white text-xs font-semibold px-4 py-1.5 rounded-xl backdrop-blur-md">{t}</span>
            ))}
          </div>
          <a href={waLink(`Merhaba, ${ders.isim} dersi için YKS hazırlık hocası arıyorum.`)}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-white text-primary-700 font-bold px-10 py-4 rounded-xl hover:bg-primary-50 hover:scale-105 transition-all">
            WhatsApp ile Hoca Bul
          </a>
        </div>

        {["fizik-yks", "matematik-yks", "kimya-yks", "biyoloji-yks"].includes(ders.slug) && (
          <div className="relative w-full max-w-[280px] h-[220px] md:h-[260px] flex-shrink-0 z-10 hidden sm:block">
            <Image
              src={
                ders.slug === "fizik-yks"
                  ? "/fizik.png"
                  : ders.slug === "matematik-yks"
                  ? "/matematik.png"
                  : ders.slug === "kimya-yks"
                  ? "/kimya.png"
                  : "/biyoloji.png"
              }
              alt={`${ders.isim} Dersi YKS`}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="280px"
              priority
            />
          </div>
        )}
      </div>

      {/* Hocalar */}
      <section>
        <h2 className="text-2xl font-black text-gray-900 mb-6">
          {ders.isim} Hocaları ({ilgiliHocalar.length})
        </h2>
        {ilgiliHocalar.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ilgiliHocalar.map((h) => <TeacherCard key={h.id} hoca={h} />)}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border">
            <p className="text-gray-500 mb-4">Bu alana uygun hoca yakında eklenecek.</p>
            <a href={waLink(`Merhaba, ${ders.isim} dersi için hoca arıyorum.`)}
              target="_blank" rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded-xl">
              WhatsApp\'tan Sor
            </a>
          </div>
        )}
      </section>

      {/* İlgili Dersler */}
      <section className="mt-16">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Diğer Ders Alanları</h2>
        <div className="flex flex-wrap gap-3">
          {dersAlanlari.filter((d) => d.slug !== ders.slug).slice(0, 8).map((d) => (
            <Link key={d.id} href={`/dersler/${d.slug}`}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:border-primary-300 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              <span>{d.emoji}</span> {d.isim}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
