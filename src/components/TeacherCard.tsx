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
    <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-premium border border-[#EFECE6]/65 hover:border-[#F5D0A9]/80 hover:bg-white/95 hover:shadow-md transition-all duration-300 overflow-hidden group">
      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden flex-shrink-0 ring-4 ring-[#FAF0E3]">
            <Image
              src={hoca.fotograf}
              alt={hoca.isim}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="96px"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-[#1E3A8A] text-base sm:text-lg group-hover:text-[#B45309] transition-colors truncate">
              {hoca.unvan === "Dr." ? `Dr. ${hoca.isim}` : hoca.isim}
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 truncate font-semibold">{hoca.egitim}</p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="text-amber-500 text-sm">★</span>
              <span className="text-xs sm:text-sm font-bold text-gray-800">{hoca.puan}</span>
              <span className="text-[10px] sm:text-xs text-gray-500 font-bold">({hoca.ogrenciSayisi}+ Öğrenci)</span>
              <span className="text-gray-300 sm:hidden">•</span>
              <span className="text-[10px] text-gray-500 sm:hidden font-bold">📍 {hoca.konum.split(",")[0]}</span>
            </div>
          </div>
        </div>

        {/* Compact row for key metadata - hidden on mobile, flex on larger screens */}
        <div className="hidden sm:flex mt-3.5 flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] sm:text-xs text-gray-500 border-t border-b border-[#EFECE6]/60 py-2.5">
          <div className="flex items-center gap-1">
            <span>📍</span>
            <span className="font-semibold text-gray-700">{hoca.konum.split(",")[0]}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🎓</span>
            <span className="font-semibold text-gray-700">{hoca.deneyimYili} Yıl Deneyim</span>
          </div>
          <div className="flex items-center gap-1 text-[#B45309] font-black bg-[#FAF0E3] px-2 py-0.5 rounded-lg border border-[#F5D0A9]/20">
            <span>💻</span>
            <span>{formatLabel[hoca.format]}</span>
          </div>
        </div>

        {/* Dersler & YKS Tags wrapped tightly - hidden on mobile */}
        <div className="hidden sm:flex mt-3 flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {hoca.dersler.slice(0, 2).map((d) => (
              <span key={d} className="text-[10px] sm:text-xs bg-[#FAF0E3] text-[#B45309] font-black px-2 py-0.5 rounded-lg border border-[#F5D0A9]/30">
                {d}
              </span>
            ))}
            {hoca.dersler.length > 2 && (
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg font-medium">
                +{hoca.dersler.length - 2}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {hoca.yksTuru.map((t) => (
              <span key={t} className="text-[9px] bg-gray-100 text-gray-600 font-black px-1.5 py-0.5 rounded-md border border-[#EFECE6] uppercase tracking-wider">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 sm:px-6 sm:pb-6 flex gap-2">
        <Link
          href={`/hocalar/${hoca.slug}`}
          className="flex-1 text-center text-xs font-black text-[#1E3A8A] border border-[#1E3A8A]/20 hover:bg-[#FAF8F5] py-2.5 sm:py-3 rounded-xl transition-all duration-200"
        >
          Profil
        </Link>
        <a
          href={waLinkHoca(hoca.isim, hoca.dersler[0])}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-xs font-black bg-[#B45309] hover:bg-[#92400E] text-white py-2.5 sm:py-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#B45309]/20 flex items-center justify-center gap-1"
        >
          💬 Ders Al
        </a>
      </div>
    </div>
  );
}
