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
    <div className="bg-[#120b24]/90 rounded-3xl shadow-2xl border border-white/5 hover:border-primary-500/30 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden group">
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
            <h3 className="font-bold text-white text-lg group-hover:text-primary-400 transition-colors truncate">
              {hoca.unvan === "Dr." ? `Dr. ${hoca.isim}` : hoca.isim}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{hoca.egitim}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-amber-400 text-sm">★</span>
              <span className="text-sm font-bold text-gray-200">{hoca.puan}</span>
              <span className="text-xs text-gray-400">({hoca.ogrenciSayisi}+ Öğrenci)</span>
            </div>
          </div>
        </div>

        {/* Dersler */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {hoca.dersler.slice(0, 3).map((d) => (
            <span key={d} className="text-xs bg-primary-950/40 text-primary-400 font-semibold px-3 py-1 rounded-xl border border-primary-500/10">
              {d}
            </span>
          ))}
          {hoca.dersler.length > 3 && (
            <span className="text-xs bg-white/5 text-gray-400 px-3 py-1 rounded-xl font-medium">
              +{hoca.dersler.length - 3}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <span>📍</span>
            <span className="font-medium truncate">{hoca.konum.split(",")[0]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🎓</span>
            <span className="font-medium">{hoca.deneyimYili} Yıl Deneyim</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 text-primary-400 font-semibold bg-primary-950/20 py-1.5 px-2.5 rounded-xl border border-primary-500/10">
            <span>💻</span>
            <span>{formatLabel[hoca.format]}</span>
          </div>
        </div>

        {/* YKS tags */}
        <div className="mt-4 flex flex-wrap gap-1">
          {hoca.yksTuru.map((t) => (
            <span key={t} className="text-[10px] bg-white/5 text-gray-450 font-semibold px-2 py-1 rounded-lg border border-white/5 uppercase tracking-wider">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 flex gap-2">
        <Link
          href={`/hocalar/${hoca.slug}`}
          className="flex-1 text-center text-xs font-bold text-primary-400 border border-primary-500/20 hover:bg-primary-950/30 hover:border-primary-500/40 py-3 rounded-xl transition-all duration-200"
        >
          Profili Gör
        </Link>
        <a
          href={waLinkHoca(hoca.isim, hoca.dersler[0])}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl shadow-glow transition-all duration-200"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
