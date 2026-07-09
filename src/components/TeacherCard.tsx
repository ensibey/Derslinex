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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary-100">
            <Image
              src={hoca.fotograf}
              alt={hoca.isim}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate">
              {hoca.unvan === "Dr." ? `Dr. ${hoca.isim}` : hoca.isim}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5 truncate">{hoca.egitim}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="text-sm font-semibold text-gray-700">{hoca.puan}</span>
              <span className="text-xs text-gray-400">({hoca.ogrenciSayisi}+ öğrenci)</span>
            </div>
          </div>
        </div>

        {/* Dersler */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {hoca.dersler.slice(0, 3).map((d) => (
            <span key={d} className="text-xs bg-primary-50 text-primary-600 font-medium px-2.5 py-1 rounded-full">
              {d}
            </span>
          ))}
          {hoca.dersler.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
              +{hoca.dersler.length - 3}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <span>📍</span>
            <span className="truncate">{hoca.konum.split(",")[0]}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🎓</span>
            <span>{hoca.deneyimYili} yıl deneyim</span>
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <span>💻</span>
            <span>{formatLabel[hoca.format]}</span>
          </div>
        </div>

        {/* YKS tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {hoca.yksTuru.map((t) => (
            <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-5 flex gap-2">
        <Link
          href={`/hocalar/${hoca.slug}`}
          className="flex-1 text-center text-sm font-semibold text-primary-600 border border-primary-200 hover:bg-primary-50 py-2 rounded-lg transition-colors"
        >
          Profili Gör
        </Link>
        <a
          href={waLinkHoca(hoca.isim, hoca.dersler[0])}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-sm font-semibold bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
