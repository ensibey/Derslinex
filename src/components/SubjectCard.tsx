import Link from "next/link";
import type { DersAlani } from "@/types";

export default function SubjectCard({ ders }: { ders: DersAlani }) {
  return (
    <Link
      href={`/dersler/${ders.slug}`}
      className="group bg-white rounded-3xl border border-[#EFECE6] hover:border-[#F5D0A9] shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col gap-4"
    >
      <div className="text-4xl w-14 h-14 rounded-2xl bg-[#FAF0E3] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        {ders.emoji}
      </div>
      <div>
        <h3 className="font-black text-[#1E3A8A] text-lg group-hover:text-[#D97706] transition-colors">
          {ders.isim}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed font-medium">{ders.aciklama}</p>
      </div>
      <div className="flex flex-wrap gap-1 mt-auto pt-2">
        {ders.yksTuru.map((t) => (
          <span key={t} className="text-[10px] bg-[#FAF8F5] text-gray-500 border border-[#EFECE6] font-black px-2.5 py-0.5 rounded-lg">
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
