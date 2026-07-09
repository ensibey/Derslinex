import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dersAlanlari, getDersAlaniBySlug } from "@/data/dersler";
import { hocalar } from "@/data/hocalar";
import TeacherCard from "@/components/TeacherCard";
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
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-850 rounded-3xl p-10 text-white mb-12 shadow-premium relative overflow-hidden">
        <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="text-6xl mb-4 relative z-10">{ders.emoji}</div>
        <h1 className="text-4xl font-black mb-3 relative z-10 tracking-tight">{ders.isim} YKS Hazırlık</h1>
        <p className="text-primary-100 text-lg max-w-2xl mb-8 relative z-10 leading-relaxed">{ders.aciklama}</p>
        <div className="flex flex-wrap gap-2 mb-8 relative z-10">
          {ders.yksTuru.map((t) => (
            <span key={t} className="bg-white/10 border border-white/10 text-white text-xs font-semibold px-4 py-1.5 rounded-xl backdrop-blur-md">{t}</span>
          ))}
        </div>
        <a href={waLink(`Merhaba, ${ders.isim} dersi için YKS hazırlık hocası arıyorum.`)}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-white text-primary-700 font-bold px-10 py-4 rounded-xl hover:bg-primary-50 hover:scale-105 transition-all relative z-10">
          WhatsApp ile Hoca Bul
        </a>
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
