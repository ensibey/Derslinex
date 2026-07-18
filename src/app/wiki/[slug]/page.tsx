import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { wikiKonulari, getWikiBySlug } from "@/data/wiki";
import { waLink } from "@/lib/utils";

export async function generateStaticParams() {
  return wikiKonulari.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const wiki = getWikiBySlug(resolvedParams.slug);
  if (!wiki) return {};
  return { title: wiki.baslik, description: wiki.ozet };
}

export default async function WikiKonuDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const wiki = getWikiBySlug(resolvedParams.slug);
  if (!wiki) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-550 mb-8 flex items-center gap-2 font-bold">
        <Link href="/" className="hover:text-[#D97706] transition-colors">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/wiki" className="hover:text-[#D97706] transition-colors">Ders Sözlüğü</Link>
        <span>/</span>
        <span className="text-gray-950 font-black truncate">{wiki.baslik}</span>
      </nav>

      {/* Header Info */}
      <span className="text-xs font-black text-[#B45309] bg-[#FAF0E3] px-3 py-1 rounded-full uppercase tracking-wider">
        {wiki.kategori} • {wiki.ders}
      </span>
      <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-4 mb-4 leading-snug tracking-tight">
        {wiki.baslik}
      </h1>

      <p className="text-base sm:text-lg text-[#1E3A8A] leading-relaxed font-bold border-l-4 border-[#D97706] pl-4 italic bg-[#FAF8F5] py-4 px-5 rounded-r-2xl mb-8">
        {wiki.ozet}
      </p>

      {/* Main Content Body */}
      <div className="max-w-none text-gray-750 leading-relaxed font-medium space-y-6 text-base sm:text-lg whitespace-pre-line border-b border-gray-100 pb-8 mb-8">
        {wiki.icerik}
      </div>

      {/* Sales CTA Banner */}
      <div className="bg-gradient-to-br from-[#1E3A8A] to-[#1e2a52] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
        
        <div className="space-y-2 text-center sm:text-left relative">
          <span className="text-[10px] font-black text-[#F5D0A9] uppercase tracking-widest block">
            ÖZEL DERS FIRSATI
          </span>
          <h3 className="text-lg sm:text-xl font-black">
            Bu Konuda Eksiklerin mi Var?
          </h3>
          <p className="text-xs text-primary-200 font-bold max-w-md leading-relaxed">
            Konuyu tam anlamak, pratik ÖSYM soru tiplerini çözmek ve rakiplerinin önüne geçmek için <span className="text-[#F5D0A9]">{wiki.hocaAd}</span> ile hemen birebir derse başla!
          </p>
        </div>

        <a
          href={waLink(`Merhaba, ders konuları sözlüğündeki ${wiki.baslik} konusu hakkında ${wiki.hocaAd} hocamızdan birebir özel ders almak istiyorum.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#D97706] hover:bg-[#B45309] text-white font-black px-6 py-3.5 rounded-xl transition-all shadow-sm active:scale-95 text-xs text-center whitespace-nowrap z-10"
        >
          ⚡ {wiki.hocaAd} ile Derse Başla
        </a>
      </div>
    </div>
  );
}
