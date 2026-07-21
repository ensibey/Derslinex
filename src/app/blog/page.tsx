"use client";
import { useState } from "react";
import Link from "next/link";
import { blogYazilari } from "@/data/blog";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  // Dynamically retrieve all unique blog categories
  const categories = ["Tümü", ...Array.from(new Set(blogYazilari.map((b) => b.kategori)))];

  const filteredBlogYazilari = blogYazilari.filter((b) => {
    const matchesSearch =
      b.baslik.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ozet.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tümü" || b.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <span className="text-[#B45309] text-xs font-black uppercase tracking-widest">GÜNCEL YAZILAR</span>
        <h1 className="text-4xl font-black text-[#1E3A8A] mt-2">Derslinex Blog</h1>
        <p className="text-gray-500 mt-2 text-lg font-medium">YKS hazırlığı için rehber yazılar ve ipuçları</p>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white/80 backdrop-blur-md border border-[#EFECE6] p-6 rounded-3xl mb-10 shadow-sm space-y-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Blog yazısı başlığı veya özeti ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl pl-10 pr-4 py-3.5 text-sm font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#B45309] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-black px-4 py-2 rounded-xl border transition-all ${
                selectedCategory === cat
                  ? "bg-[#B45309] text-white border-[#B45309] shadow-sm shadow-[#B45309]/10"
                  : "bg-[#FAF8F5] text-gray-600 border-[#EFECE6] hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filteredBlogYazilari.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogYazilari.map((b) => (
            <Link
              key={b.id}
              href={`/blog/${b.slug}`}
              className="bg-white rounded-3xl border border-[#EFECE6] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
            >
              <div className="bg-[#FAF8F5] border-b border-[#EFECE6] h-44 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                {b.kategori === "YKS Bilgi"
                  ? "📖"
                  : b.kategori === "Çalışma Teknikleri"
                  ? "✏️"
                  : b.kategori === "Ders Rehberleri"
                  ? "📚"
                  : "📝"}
              </div>
              <div className="p-6">
                <span className="text-[10px] font-black text-[#B45309] bg-[#FAF0E3] px-3 py-1 rounded-lg uppercase tracking-wider">
                  {b.kategori}
                </span>
                <h2 className="font-black text-[#1E3A8A] text-lg mt-3 leading-snug group-hover:text-[#B45309] transition-colors line-clamp-2">
                  {b.baslik}
                </h2>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed font-medium">{b.ozet}</p>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#EFECE6] text-xs text-gray-400 font-bold">
                  <span>{b.yazar}</span>
                  <span>{b.okumaSuresi} dk okuma</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/50 border border-dashed border-[#EFECE6] rounded-3xl">
          <span className="text-4xl">📚</span>
          <p className="text-gray-500 font-bold mt-4">Kriterlerinize uygun blog yazısı bulunamadı.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Tümü");
            }}
            className="text-[#B45309] font-black text-xs underline mt-2 block mx-auto"
          >
            Filtreleri Sıfırla
          </button>
        </div>
      )}

      {/* İnteraktif Sınav Araçları Bölümü */}
      <section className="mt-12 sm:mt-16 lg:mt-20">
        <div className="mb-10 text-center">
          <span className="text-[#B45309] text-xs font-black uppercase tracking-widest">DİJİTAL SİMÜLATÖRLER</span>
          <h2 className="text-3xl font-black text-[#1E3A8A] mt-2">İnteraktif Sınav Araçlarımız</h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            Netlerinizi artırmanıza ve hedeflerinizi planlamanıza yardımcı akıllı araçlar
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { title: "Tercih Robotu", desc: "Netine Göre Üniversite & Lise Bulucu", icon: "🏫", url: "/blog/ders-sihirbazi" },
            { title: "Hap Bilgiler", desc: "YKS / LGS Ders Bilgi Kartları", icon: "🃏", url: "/blog/bilgi-kartlari" },
            { title: "Günün Sorusu", desc: "Her Gün Yeni YKS/LGS Soru Çözümü", icon: "❓", url: "/blog/gunun-sorusu" },
            { title: "Konu Çetelesi", desc: "localStorage Tabanlı Konu Takibi", icon: "✅", url: "/blog/konu-takip-cetelesi" },
            { title: "Taban Puanları", desc: "Lise Yüzdelik Dilim & Net İhtiyacı", icon: "📊", url: "/blog/lise-taban-puanlari" },
            { title: "Net Atlası", desc: "YKS Hangi Meslek Kaç Net İstiyor?", icon: "📈", url: "/blog/meslek-net-atlasi" },
            { title: "OBP Hesaplayıcı", desc: "Diploma Notunun Sıralamaya Etkisi", icon: "🧮", url: "/blog/obp-siralamaya-etkisi" },
            { title: "Pomodoro Sayacı", desc: "Zaman Yönetimi & Çalışma Arkadaşı", icon: "⏱️", url: "/blog/pomodoro-sayaci" },
            { title: "Soru Dağılımları", desc: "Yıllara Göre Soru Konu İstatistikleri", icon: "📅", url: "/blog/soru-dagilimlari" },
            { title: "Net Kıyaslama", desc: "YKS Net ve Sıralama Karşılaştırma", icon: "🔄", url: "/blog/yks-net-siralama-karsilastirma" },
            { title: "Çalışma Programı", desc: "Yoğunluğa Özel Program Robotu", icon: "📅", url: "/blog/ders-calisma-programi" },
            { title: "Deneme Takip", desc: "Net İlerleme Grafiği ve Kaydı", icon: "📊", url: "/blog/deneme-net-takip" }
          ].map((tool, idx) => (
            <Link
              key={idx}
              href={tool.url}
              className="bg-white border border-[#EFECE6] hover:border-[#F5D0A9] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FAF0E3] text-[#B45309] border border-[#F5D0A9]/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 mb-4">
                {tool.icon}
              </div>
              <h3 className="font-black text-[#1E3A8A] text-sm group-hover:text-[#B45309] transition-colors line-clamp-1">
                {tool.title}
              </h3>
              <p className="text-[10px] text-gray-500 font-bold mt-1 leading-snug line-clamp-2">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
