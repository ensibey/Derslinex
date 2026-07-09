import type { Metadata } from "next";
import Link from "next/link";
import { blogYazilari } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog — YKS Hazırlık Rehberleri ve Çalışma İpuçları",
  description: "YKS hazırlığı için rehber yazılar, çalışma teknikleri, ders önerileri ve sınav bilgileri. Sadee Eğitim Blog.",
};

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900">Blog</h1>
        <p className="text-gray-500 mt-2 text-lg">YKS hazırlığı için rehber yazılar ve ipuçları</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogYazilari.map((b) => (
          <Link key={b.id} href={`/blog/${b.slug}`}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
            <div className="bg-gradient-to-br from-primary-100 to-blue-50 h-40 flex items-center justify-center text-6xl">
              {b.kategori === "YKS Bilgi" ? "📖" : b.kategori === "Çalışma Teknikleri" ? "✏️" : b.kategori === "Ders Rehberleri" ? "📚" : "📝"}
            </div>
            <div className="p-6">
              <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{b.kategori}</span>
              <h2 className="font-bold text-gray-900 mt-3 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                {b.baslik}
              </h2>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{b.ozet}</p>
              <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
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
