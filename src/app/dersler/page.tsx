import type { Metadata } from "next";
import { dersAlanlari } from "@/data/dersler";
import SubjectCard from "@/components/SubjectCard";

export const metadata: Metadata = {
  title: "YKS Ders Alanları — TYT, AYT Sayısal, Sözel, EA, Dil",
  description: "YKS hazırlığı için tüm ders alanları: Matematik, Fizik, Kimya, Biyoloji, Türkçe, Edebiyat, Tarih ve daha fazlası. Uzman hocalarla online veya yüz yüze ders.",
};

const yksGruplari = [
  { id: "TYT", label: "TYT", renk: "bg-blue-600", desc: "Temel Yeterlilik Testi" },
  { id: "AYT Sayısal", label: "AYT Sayısal", renk: "bg-purple-600", desc: "Matematik, Fizik, Kimya, Biyoloji" },
  { id: "AYT Sözel", label: "AYT Sözel", renk: "bg-red-600", desc: "Edebiyat, Tarih, Coğrafya, Felsefe" },
  { id: "AYT EA", label: "AYT Eşit Ağırlık", renk: "bg-amber-600", desc: "Matematik, Edebiyat, Tarih, Coğrafya" },
  { id: "AYT Dil", label: "AYT Dil", renk: "bg-sky-600", desc: "İngilizce, Almanca, Fransızca" },
];

export default function DerslerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900">Ders Alanları</h1>
        <p className="text-gray-500 mt-2 text-lg">YKS\'nin tüm sınav türleri ve dersleri için uzman hoca desteği</p>
      </div>

      {yksGruplari.map((grup) => {
        const alandakiDersler = dersAlanlari.filter((d) => d.yksTuru.includes(grup.id as any));
        if (alandakiDersler.length === 0) return null;
        return (
          <section key={grup.id} className="mb-14">
            <div className={`inline-flex items-center gap-3 ${grup.renk} text-white px-5 py-2.5 rounded-xl mb-6`}>
              <span className="font-black text-lg">{grup.label}</span>
              <span className="text-white/80 text-sm">{grup.desc}</span>
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
