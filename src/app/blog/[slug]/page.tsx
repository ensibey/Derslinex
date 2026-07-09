import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogYazilari, getBlogBySlug } from "@/data/blog";
import { waLink } from "@/lib/utils";

export async function generateStaticParams() {
  return blogYazilari.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const yazi = getBlogBySlug(params.slug);
  if (!yazi) return {};
  return { title: yazi.baslik, description: yazi.ozet };
}

export default function BlogYazisiPage({ params }: { params: { slug: string } }) {
  const yazi = getBlogBySlug(params.slug);
  if (!yazi) notFound();

  const diger = blogYazilari.filter((b) => b.slug !== yazi.slug).slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-primary-600">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-primary-600">Blog</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{yazi.baslik}</span>
      </nav>

      <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">{yazi.kategori}</span>
      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-4 mb-4 leading-snug">{yazi.baslik}</h1>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b">
        <span>✍️ {yazi.yazar}</span>
        <span>📅 {new Date(yazi.tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
        <span>⏱ {yazi.okumaSuresi} dk okuma</span>
      </div>

      {/* İçerik — gerçek içerik CMS'ten gelir */}
      <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
        <p className="text-xl text-gray-600 leading-relaxed mb-6">{yazi.ozet}</p>
        <p className="mb-4">{yazi.icerik}</p>
        <p className="mb-4">
          Bu içerik Sadee Eğitim tarafından YKS hazırlık sürecinize destek olmak amacıyla hazırlanmıştır.
          Daha fazla bilgi almak ve uzman bir hocayla çalışmak için WhatsApp üzerinden bize ulaşabilirsiniz.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-10 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-6 text-white text-center">
        <h3 className="text-xl font-bold mb-2">Uzman Hocayla Çalışmaya Hazır mısın?</h3>
        <p className="text-blue-100 text-sm mb-4">WhatsApp\'tan bize ulaş, sana en uygun hocanı bulalım.</p>
        <a href={waLink()} target="_blank" rel="noopener noreferrer"
          className="inline-block bg-white text-primary-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
          Hemen Başla
        </a>
      </div>

      {/* Diğer Yazılar */}
      {diger.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Diğer Yazılar</h2>
          <div className="space-y-3">
            {diger.map((d) => (
              <Link key={d.id} href={`/blog/${d.slug}`}
                className="flex justify-between items-center bg-white border border-gray-100 rounded-xl px-5 py-4 hover:border-primary-200 hover:shadow-sm transition-all">
                <span className="font-medium text-gray-800 text-sm line-clamp-1">{d.baslik}</span>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-3">{d.okumaSuresi} dk</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
