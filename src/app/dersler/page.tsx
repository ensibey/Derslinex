import type { Metadata } from "next";
import { dersAlanlari } from "@/data/dersler";
import SubjectCard from "@/components/SubjectCard";

export const metadata: Metadata = {
  title: "YKS Ders Alanları — TYT, AYT Sayısal, Sözel, EA, Dil",
  description: "YKS hazırlığı için tüm ders alanları: Matematik, Fizik, Kimya, Biyoloji, Türkçe, Edebiyat, Tarih ve daha fazlası. Uzman hocalarla online veya yüz yüze ders.",
};

const yksGruplari = [
  { id: "TYT", label: "TYT", renk: "bg-gradient-to-r from-primary-600 to-indigo-700", desc: "Temel Yeterlilik Testi" },
  { id: "AYT Sayısal", label: "AYT Sayısal", renk: "bg-gradient-to-r from-violet-550 via-violet-650 to-primary-750", desc: "Matematik, Fizik, Kimya, Biyoloji" },
  { id: "AYT Sözel", label: "AYT Sözel", renk: "bg-gradient-to-r from-rose-600 to-rose-700", desc: "Edebiyat, Tarih, Coğrafya, Felsefe" },
  { id: "AYT EA", label: "AYT Eşit Ağırlık", renk: "bg-gradient-to-r from-amber-600 to-amber-700", desc: "Matematik, Edebiyat, Tarih, Coğrafya" },
  { id: "AYT Dil", label: "AYT Dil", renk: "bg-gradient-to-r from-emerald-600 to-emerald-700", desc: "İngilizce, Almanca, Fransızca" },
];

export default function DerslerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <span className="text-primary-500 text-xs font-bold uppercase tracking-widest">SINAV KATEGORİLERİ</span>
        <h1 className="text-4xl sm:text-5xl font-black mb-2 mt-2 bg-gradient-to-r from-primary-600 to-indigo-650 bg-clip-text text-transparent">Ders Alanları</h1>
        <p className="text-gray-500 text-lg">YKS'nin tüm sınav türleri ve dersleri için uzman hoca desteği</p>
      </div>

      {yksGruplari.map((grup) => {
        const alandakiDersler = dersAlanlari.filter((d) => d.yksTuru.includes(grup.id as any));
        if (alandakiDersler.length === 0) return null;
        return (
          <section key={grup.id} className="mb-14">
            <div className={`inline-flex items-center gap-3 ${grup.renk} text-white px-5 py-3 rounded-2xl mb-6 shadow-premium`}>
              <span className="font-black text-lg">{grup.label}</span>
              <span className="text-white/80 text-xs font-medium border-l border-white/20 pl-3">{grup.desc}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {alandakiDersler.map((d) => <SubjectCard key={d.id} ders={d} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
