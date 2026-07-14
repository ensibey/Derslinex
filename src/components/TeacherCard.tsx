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
    <div className="bg-white rounded-3xl shadow-sm border border-[#EFECE6] hover:border-[#F5D0A9] hover:shadow-md transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 ring-4 ring-[#FAF0E3]">
            <Image
              src={hoca.fotograf}
              alt={hoca.isim}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="64px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-[#1E3A8A] text-lg group-hover:text-[#D97706] transition-colors truncate">
              {hoca.unvan === "Dr." ? `Dr. ${hoca.isim}` : hoca.isim}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 truncate font-medium">{hoca.egitim}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-amber-500 text-sm">★</span>
              <span className="text-sm font-bold text-gray-800">{hoca.puan}</span>
              <span className="text-xs text-gray-500 font-bold">({hoca.ogrenciSayisi}+ Öğrenci)</span>
            </div>
          </div>
        </div>

        {/* Dersler */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {hoca.dersler.slice(0, 3).map((d) => (
            <span key={d} className="text-xs bg-[#FAF0E3] text-[#B45309] font-black px-3 py-1 rounded-xl border border-[#F5D0A9]/30">
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
        <div className="mt-4 pt-4 border-t border-[#EFECE6] grid grid-cols-2 gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span>📍</span>
            <span className="font-bold text-gray-700 truncate">{hoca.konum.split(",")[0]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🎓</span>
            <span className="font-bold text-gray-700">{hoca.deneyimYili} Yıl Deneyim</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 text-[#B45309] font-black bg-[#FAF0E3] py-1.5 px-2.5 rounded-xl border border-[#F5D0A9]/30">
            <span>💻</span>
            <span>{formatLabel[hoca.format]}</span>
          </div>
        </div>

        {/* YKS tags */}
        <div className="mt-4 flex flex-wrap gap-1">
          {hoca.yksTuru.map((t) => (
            <span key={t} className="text-[10px] bg-gray-150 text-gray-600 font-black px-2 py-1 rounded-lg border border-[#EFECE6] uppercase tracking-wider">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 flex gap-2">
        <Link
          href={`/hocalar/${hoca.slug}`}
          className="flex-1 text-center text-xs font-black text-[#1E3A8A] border border-[#1E3A8A]/20 hover:bg-[#FAF8F5] py-3 rounded-xl transition-all duration-200"
        >
          Profili Gör
        </Link>
        <a
          href={waLinkHoca(hoca.isim, hoca.dersler[0])}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-xs font-black bg-[#D97706] hover:bg-[#B45309] text-white py-3 rounded-xl transition-all duration-200"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
