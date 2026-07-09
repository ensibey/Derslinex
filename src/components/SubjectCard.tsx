import Link from "next/link";
import type { DersAlani } from "@/types";

export default function SubjectCard({ ders }: { ders: DersAlani }) {
  return (
    <Link
      href={`/dersler/${ders.slug}`}
      className="group bg-white rounded-3xl border border-gray-100 shadow-premium hover:shadow-2xl hover:-translate-y-1 hover:border-primary-200 transition-all duration-300 p-6 flex flex-col gap-4"
    >
      <div className="text-4xl w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        {ders.emoji}
      </div>
      <div>
        <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">
          {ders.isim}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{ders.aciklama}</p>
      </div>
      <div className="flex flex-wrap gap-1 mt-auto pt-2">
        {ders.yksTuru.map((t) => (
          <span key={t} className="text-[10px] bg-primary-50 text-primary-600 font-semibold px-2.5 py-0.5 rounded-lg">
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
