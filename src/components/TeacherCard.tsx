import Link from "next/link";
import Image from "next/image";
import type { Hoca } from "@/types";
import { waLinkHoca } from "@/lib/utils";

export default function TeacherCard({ hoca }: { hoca: Hoca }) {
  const formatLabel: Record<string, string> = {
    "yuz-yuze": "Yüz Yüze",
    online: "Online",
    "her-ikisi": "Yüz Yüze & Online",
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-primary-400/20 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 ring-4 ring-primary-500/10">
            <Image
              src={hoca.fotograf}
              alt={hoca.isim}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="64px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors truncate">
              {hoca.unvan === "Dr." ? `Dr. ${hoca.isim}` : hoca.isim}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{hoca.egitim}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-amber-500 text-sm">★</span>
              <span className="text-sm font-bold text-gray-800">{hoca.puan}</span>
              <span className="text-xs text-gray-500">({hoca.ogrenciSayisi}+ Öğrenci)</span>
            </div>
          </div>
        </div>

        {/* Dersler */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {hoca.dersler.slice(0, 3).map((d) => (
            <span key={d} className="text-xs bg-primary-50 text-primary-700 font-bold px-3 py-1 rounded-xl border border-primary-100/30">
              {d}
            </span>
          ))}
          {hoca.dersler.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-xl font-medium">
              +{hoca.dersler.length - 3}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span>📍</span>
            <span className="font-semibold text-gray-700 truncate">{hoca.konum.split(",")[0]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🎓</span>
            <span className="font-semibold text-gray-700">{hoca.deneyimYili} Yıl Deneyim</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 text-primary-700 font-bold bg-primary-50 py-1.5 px-2.5 rounded-xl border border-primary-100/30">
            <span>💻</span>
            <span>{formatLabel[hoca.format]}</span>
          </div>
        </div>

        {/* YKS tags */}
        <div className="mt-4 flex flex-wrap gap-1">
          {hoca.yksTuru.map((t) => (
            <span key={t} className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-1 rounded-lg border border-gray-200 uppercase tracking-wider">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 flex gap-2">
        <Link
          href={`/hocalar/${hoca.slug}`}
          className="flex-1 text-center text-xs font-bold text-primary-600 border border-primary-500/20 hover:bg-primary-50 py-3 rounded-xl transition-all duration-200"
        >
          Profili Gör
        </Link>
        <a
          href={waLinkHoca(hoca.isim, hoca.dersler[0])}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl shadow-md transition-all duration-200"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
