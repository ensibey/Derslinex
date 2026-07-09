import Link from "next/link";
import type { DersAlani } from "@/types";

export default function SubjectCard({ ders }: { ders: DersAlani }) {
  return (
    <Link
      href={`/dersler/${ders.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all p-5 flex flex-col gap-3"
    >
      <div className="text-3xl">{ders.emoji}</div>
      <div>
        <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
          {ders.isim}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{ders.aciklama}</p>
      </div>
      <div className="flex flex-wrap gap-1 mt-auto">
        {ders.yksTuru.map((t) => (
          <span key={t} className="text-xs bg-primary-50 text-primary-600 font-medium px-2 py-0.5 rounded-full">
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
