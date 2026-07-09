import type { Metadata } from "next";
import Link from "next/link";
import { blogYazilari } from "@/data/blog";
import { dersAlanlari } from "@/data/dersler";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "YKS Hazırlık Merkezi — Konu Rehberleri, Çalışma Planları",
  description: "YKS hazırlığı için kapsamlı rehber. TYT ve AYT konuları, çalışma planları, puan hesaplama ve daha fazlası. Derslinex YKS bilgi merkezi.",
};

export default function YksHazirlikPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-14">
        <span className="text-primary-500 text-xs font-bold uppercase tracking-widest">KÜTÜPHANE</span>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 mt-2">YKS Hazırlık Merkezi</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          TYT'den AYT'ye tüm sınav türleri için rehber içerikler, çalışma planları ve uzman ipuçları.
        </p>
      </div>

      {/* Hızlı Araçlar */}
      <section className="mb-16">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Hızlı Araçlar</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { emoji: "⏰", title: "Sınava Geri Sayım", desc: "YKS 2026'ya kalan gün, saat ve dakika", bg: "bg-primary-50/50 border-primary-100/50 hover:border-primary-300" },
            { emoji: "🧮", title: "Puan Hesaplama", desc: "Net sayılarından tahmini puan hesapla", bg: "bg-emerald-50/50 border-emerald-100/50 hover:border-emerald-300" },
            { emoji: "📋", title: "Konu Kontrol Listesi", desc: "Hangi YKS konularını çalıştığını takip et", bg: "bg-violet-50/50 border-violet-100/50 hover:border-violet-300" },
          ].map((t) => (
            <a key={t.title} href={waLink(`${t.title} hakkında bilgi almak istiyorum.`)} target="_blank" rel="noopener noreferrer"
              className={`flex items-start gap-4 ${t.bg} border rounded-3xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}>
              <span className="text-3xl">{t.emoji}</span>
              <div>
                <p className="font-bold text-gray-900">{t.title}</p>
                <p className="text-sm text-gray-600 mt-1">{t.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Sınav Türleri */}
      <section className="mb-16">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Sınav Türleri</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { tur: "TYT", renk: "from-primary-600 via-primary-700 to-indigo-800", aciklama: "135 dakika, 120 soru. Türkçe, Sosyal, Matematik, Fen alanlarından oluşur. Tüm puan türlerinin temeli.", dersler: "Türkçe, Matematik, Fen Bilimleri, Sosyal Bilimler" },
            { tur: "AYT Sayısal", renk: "from-violet-600 via-violet-700 to-primary-800", aciklama: "180 dakika, 80 soru. Matematik, Fizik, Kimya ve Biyoloji soruları.", dersler: "Matematik, Fizik, Kimya, Biyoloji" },
            { tur: "AYT Sözel", renk: "from-rose-600 to-rose-500", aciklama: "180 dakika, 80 soru. Edebiyat, Tarih, Coğrafya, Felsefe grup soruları.", dersler: "Edebiyat, Tarih 1-2, Coğrafya 1-2, Felsefe" },
            { tur: "AYT Eşit Ağırlık", renk: "from-amber-600 to-amber-500", aciklama: "Matematik ve Türkçe-Sosyal derslerinin birleşimi. EA bölümleri için.", dersler: "Matematik, Edebiyat, Tarih 1, Coğrafya 1" },
            { tur: "AYT Dil", renk: "from-emerald-600 to-emerald-500", aciklama: "80 soru. İngilizce, Almanca, Fransızca gibi yabancı dil seçenekleri.", dersler: "İngilizce / YDT" },
          ].map((s) => (
            <div key={s.tur} className={`bg-gradient-to-br ${s.renk} rounded-3xl p-8 text-white shadow-premium hover:shadow-2xl transition-all duration-300`}>
              <h3 className="text-xl font-black mb-3">{s.tur}</h3>
              <p className="text-white/85 text-xs mb-6 leading-relaxed">{s.aciklama}</p>
              <span className="text-[10px] font-bold bg-white/20 rounded-lg px-3 py-1.5 backdrop-blur-sm inline-block tracking-wide">{s.dersler}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Ders Alanları */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Ders Alanına Göre Hazırlık</h2>
          <Link href="/dersler" className="text-primary-600 font-semibold hover:underline text-sm">Tümü →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {dersAlanlari.slice(0, 8).map((d) => (
            <Link key={d.id} href={`/dersler/${d.slug}`}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:border-primary-300 hover:shadow-sm px-4 py-3 rounded-xl text-sm font-medium transition-all">
              <span>{d.emoji}</span> {d.isim}
            </Link>
          ))}
        </div>
      </section>

      {/* Son Blog Yazıları */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Güncel Rehberler</h2>
          <Link href="/blog" className="text-primary-600 font-semibold hover:underline text-sm">Tüm Yazılar →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogYazilari.slice(0, 3).map((b) => (
            <Link key={b.id} href={`/blog/${b.slug}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
              <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{b.kategori}</span>
              <h3 className="font-bold text-gray-900 mt-3 leading-snug line-clamp-2">{b.baslik}</h3>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{b.ozet}</p>
              <p className="text-xs text-gray-400 mt-3">{b.okumaSuresi} dk okuma</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
