import type { Metadata } from "next";
import Link from "next/link";
import { blogYazilari } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog — YKS Hazırlık Rehberleri ve Çalışma İpuçları",
  description: "YKS hazırlığı için rehber yazılar, çalışma teknikleri, ders önerileri ve sınav bilgileri. Derslinex Blog.",
};

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <span className="text-primary-500 text-xs font-bold uppercase tracking-widest">GÜNCEL YAZILAR</span>
        <h1 className="text-4xl font-black text-gray-900 mt-2">Derslinex Blog</h1>
        <p className="text-gray-500 mt-2 text-lg">YKS hazırlığı için rehber yazılar ve ipuçları</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogYazilari.map((b) => (
          <Link key={b.id} href={`/blog/${b.slug}`}
            className="bg-white rounded-3xl border border-gray-100 shadow-premium hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
            <div className="bg-gradient-to-br from-primary-50 to-indigo-50 h-44 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
              {b.kategori === "YKS Bilgi" ? "📖" : b.kategori === "Çalışma Teknikleri" ? "✏️" : b.kategori === "Ders Rehberleri" ? "📚" : "📝"}
            </div>
            <div className="p-6">
              <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-lg uppercase tracking-wider">{b.kategori}</span>
              <h2 className="font-bold text-gray-900 text-lg mt-3 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                {b.baslik}
              </h2>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{b.ozet}</p>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 text-xs text-gray-400">
                <span>{b.yazar}</span>
                <span>{b.okumaSuresi} dk okuma</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
