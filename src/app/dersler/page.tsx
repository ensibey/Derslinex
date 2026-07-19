import type { Metadata } from "next";
import { dersAlanlari } from "@/data/dersler";
import SubjectCard from "@/components/SubjectCard";

export const metadata: Metadata = {
  title: "YKS Ders Alanları — TYT, AYT Sayısal, Sözel, EA, Dil",
  description: "YKS hazırlığı için tüm ders alanları: Matematik, Fizik, Kimya, Biyoloji, Türkçe, Edebiyat, Tarih ve daha fazlası. Uzman hocalarla online veya yüz yüze ders.",
};

const yksGruplari = [
  { id: "TYT", label: "TYT", renk: "bg-white border border-[#EFECE6] text-[#1E3A8A]", desc: "Temel Yeterlilik Testi" },
  { id: "AYT Sayısal", label: "AYT Sayısal", renk: "bg-white border border-[#EFECE6] text-[#1E3A8A]", desc: "Matematik, Fizik, Kimya, Biyoloji" },
  { id: "AYT Sözel", label: "AYT Sözel", renk: "bg-white border border-[#EFECE6] text-[#1E3A8A]", desc: "Edebiyat, Tarih, Coğrafya, Felsefe" },
  { id: "AYT EA", label: "AYT Eşit Ağırlık", renk: "bg-white border border-[#EFECE6] text-[#1E3A8A]", desc: "Matematik, Edebiyat, Tarih, Coğrafya" },
  { id: "AYT Dil", label: "AYT Dil", renk: "bg-white border border-[#EFECE6] text-[#1E3A8A]", desc: "İngilizce, Almanca, Fransızca" },
];

export default function DerslerPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <span className="text-[#B45309] text-xs font-black uppercase tracking-widest">SINAV KATEGORİLERİ</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-2 mt-2 text-[#1E3A8A]">Ders Alanları</h1>
          <p className="text-gray-600 text-lg font-medium">YKS'nin tüm sınav türleri ve dersleri için uzman hoca desteği</p>
        </div>

        {/* YKS Sınav Grupları */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-16">
          {yksGruplari.map((g) => (
            <div key={g.id} className={`${g.renk} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#FAF0E3]/60 rounded-bl-full -z-10" />
              <div className="font-black text-[#1E3A8A] text-lg mb-1 group-hover:text-[#B45309] transition-colors">{g.label}</div>
              <div className="text-xs text-gray-500 font-bold leading-relaxed">{g.desc}</div>
            </div>
          ))}
        </div>

        {/* Grid Ders Kartları */}
        <div>
          <h2 className="text-2xl font-black text-[#1E3A8A] mb-8">Tüm YKS Dersleri</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dersAlanlari.map((d) => (
              <SubjectCard key={d.id} ders={d} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
