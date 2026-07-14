import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogYazilari, getBlogBySlug } from "@/data/blog";
import { waLink } from "@/lib/utils";

export async function generateStaticParams() {
  return blogYazilari.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const yazi = getBlogBySlug(resolvedParams.slug);
  if (!yazi) return {};
  return { title: yazi.baslik, description: yazi.ozet };
}

export default async function BlogYazisiPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const yazi = getBlogBySlug(resolvedParams.slug);
  if (!yazi) notFound();

  const diger = blogYazilari.filter((b) => b.slug !== yazi.slug).slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2 font-bold">
        <Link href="/" className="hover:text-[#D97706] transition-colors">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-[#D97706] transition-colors">Blog</Link>
        <span>/</span>
        <span className="text-gray-900 font-black truncate">{yazi.baslik}</span>
      </nav>

      <span className="text-xs font-black text-[#B45309] bg-[#FAF0E3] px-3 py-1 rounded-full uppercase tracking-wider">{yazi.kategori}</span>
      <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-4 mb-4 leading-snug tracking-tight">{yazi.baslik}</h1>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-8 pb-6 border-b border-[#EFECE6] font-bold">
        <span>✍️ {yazi.yazar}</span>
        <span>📅 {new Date(yazi.tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
        <span>⏱ {yazi.okumaSuresi} dk okuma</span>
      </div>

      {/* İçerik — rahat okuma düzeni */}
      <div className="max-w-none text-gray-700 leading-relaxed font-medium space-y-6 text-base sm:text-lg">
        <p className="text-lg sm:text-xl text-[#1E3A8A] leading-relaxed font-bold border-l-4 border-[#D97706] pl-4 italic bg-[#FAF8F5] py-2 rounded-r-xl">{yazi.ozet}</p>
        <p className="leading-relaxed">{yazi.icerik}</p>
        <p className="leading-relaxed border-t border-[#EFECE6] pt-4 text-sm text-gray-500">
          Bu içerik Derslinex tarafından YKS hazırlık sürecinize destek olmak amacıyla hazırlanmıştır.
          Daha fazla bilgi almak ve uzman bir hocayla çalışmak için WhatsApp üzerinden bize ulaşabilirsiniz.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-10 bg-white border border-[#EFECE6] rounded-3xl p-8 text-center shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FAF0E3]/60 rounded-bl-full -z-10" />
        <h3 className="text-2xl font-black text-[#1E3A8A] mb-2 relative z-10">Uzman Hocayla Çalışmaya Hazır mısın?</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto relative z-10 font-medium">WhatsApp'tan bize ulaş, hedeflerine en uygun eğitmeni birlikte belirleyelim.</p>
        <a href={waLink()} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-[#D97706] hover:bg-[#B45309] text-white font-black px-10 py-3.5 rounded-xl transition-all relative z-10 shadow-sm">
          Hemen Başla
        </a>
      </div>

      {/* Diğer Yazılar */}
      {diger.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-black text-[#1E3A8A] mb-5">Diğer Yazılar</h2>
          <div className="space-y-3">
            {diger.map((d) => (
              <Link key={d.id} href={`/blog/${d.slug}`}
                className="flex justify-between items-center bg-white border border-[#EFECE6] rounded-xl px-5 py-4 hover:border-[#D97706] hover:shadow-sm transition-all group">
                <span className="font-bold text-gray-700 text-sm line-clamp-1 group-hover:text-[#1E3A8A] transition-colors">{d.baslik}</span>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-3 font-bold">{d.okumaSuresi} dk</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
