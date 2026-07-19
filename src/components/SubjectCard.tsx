import Link from "next/link";
import Image from "next/image";
import type { DersAlani } from "@/types";

export default function SubjectCard({ ders }: { ders: DersAlani }) {
  // Mapping subject slugs to their high quality JPG realistic images
  const subjectImages: Record<string, string> = {
    "matematik-yks": "/matematik.jpg",
    "geometri-yks": "/geometri.jpg",
    "fizik-yks": "/fizik.jpg",
    "kimya-yks": "/kimya.jpg",
    "biyoloji-yks": "/biyoloji.jpg",
    "turkce-yks": "/turkce.jpg",
    "turk-dili-edebiyati-yks": "/edebiyat.jpg",
    "tarih-yks": "/tarih.jpg"
  };

  const imagePath = subjectImages[ders.slug];

  return (
    <Link
      href={`/dersler/${ders.slug}`}
      className="group bg-white/80 backdrop-blur-md rounded-3xl border border-[#EFECE6]/60 hover:border-[#F5D0A9]/80 hover:bg-white/95 shadow-sm hover:shadow-premium transition-all duration-300 p-5 flex flex-col gap-4"
    >
      <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#FAF0E3] flex items-center justify-center group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
        {imagePath ? (
          <Image
            src={imagePath}
            alt={ders.isim}
            fill
            className="object-cover"
            sizes="96px"
            quality={75}
            priority
          />
        ) : (
          <span className="text-3xl">{ders.emoji}</span>
        )}
      </div>
      <div>
        <h3 className="font-black text-[#1E3A8A] text-lg group-hover:text-[#B45309] transition-colors">
          {ders.isim}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed font-semibold">{ders.aciklama}</p>
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
