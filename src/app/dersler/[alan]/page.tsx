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
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2 font-bold">
        <Link href="/" className="hover:text-[#D97706] transition-colors">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/dersler" className="hover:text-[#D97706] transition-colors">Dersler</Link>
        <span>/</span>
        <span className="text-gray-900 font-black">{ders.isim}</span>
      </nav>

      {/* Hero */}
      <div className="bg-white border border-[#EFECE6] rounded-3xl p-8 sm:p-10 text-[#1E3A8A] mb-12 shadow-sm relative overflow-hidden flex flex-col-reverse md:flex-row justify-between items-center gap-8">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FAF0E3]/60 rounded-bl-full -z-10" />
        
        <div className="flex-1 relative z-10 text-left">
          <span className="inline-block bg-[#FAF0E3] border border-[#F5D0A9] text-[#B45309] text-xs font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            {ders.isim}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight text-[#1E3A8A]">{ders.isim} YKS Hazırlık</h1>
          <p className="text-gray-600 text-base max-w-xl mb-8 leading-relaxed font-medium">{ders.aciklama}</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {ders.yksTuru.map((t) => (
              <span key={t} className="bg-[#FAF8F5] border border-[#EFECE6] text-[#1E3A8A] text-xs font-bold px-4 py-1.5 rounded-xl">{t}</span>
            ))}
          </div>
          <a href={waLink(`Merhaba, ${ders.isim} dersi için YKS hazırlık hocası arıyorum.`)}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#D97706] hover:bg-[#B45309] text-white font-black px-10 py-3.5 rounded-xl transition-all shadow-sm">
            WhatsApp ile Hoca Bul
          </a>
        </div>

        {[
          "fizik-yks", "matematik-yks", "kimya-yks", "biyoloji-yks",
          "turkce-yks", "turk-dili-edebiyati-yks", "tarih-yks"
        ].includes(ders.slug) && (
          <div className="relative w-full max-w-[280px] h-[200px] sm:h-[240px] md:h-[260px] flex-shrink-0 z-10">
            <Image
              src={
                ders.slug === "fizik-yks"
                  ? "/fizik.jpg"
                  : ders.slug === "matematik-yks"
                  ? "/matematik.jpg"
                  : ders.slug === "kimya-yks"
                  ? "/kimya.jpg"
                  : ders.slug === "biyoloji-yks"
                  ? "/biyoloji.jpg"
                  : ders.slug === "turkce-yks"
                  ? "/turkce.jpg"
                  : ders.slug === "turk-dili-edebiyati-yks"
                  ? "/edebiyat.jpg"
                  : "/tarih.jpg"
              }
              alt={`${ders.isim} Dersi YKS`}
              fill
              className="object-cover rounded-2xl shadow-md"
              sizes="(max-width: 768px) 100vw, 280px"
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
