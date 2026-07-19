"use client";
import { useSearchParams } from "next/navigation";
import { hocalar } from "@/data/hocalar";
import TeacherCard from "@/components/TeacherCard";
import { waLink } from "@/lib/utils";
import React, { Suspense } from "react";

import Link from "next/link";

function HocalarContent() {
  const searchParams = useSearchParams();
  const alan = searchParams.get("alan") || undefined;
  const format = searchParams.get("format") || undefined;
  const yks = searchParams.get("yks") || undefined;

  const filtrelenmis = hocalar.filter((h) => {
    if (!h.aktif) return false;
    if (alan && alan !== "tumu") {
      if (!h.dersler.some((d) => d.toLowerCase().includes(alan.toLowerCase()))) return false;
    }
    if (format && format !== "tumu") {
      if (h.format !== format && h.format !== "her-ikisi") return false;
    }
    if (yks && yks !== "tumu") {
      if (!h.yksTuru.includes(yks as any)) return false;
    }
    return true;
  });

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <span className="text-[#B45309] text-xs font-black uppercase tracking-widest font-sans">EĞİTMEN KADROMUZ</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-2 mt-2 text-[#1E3A8A]">Uzman Hocalarımız</h1>
          <p className="text-gray-600 text-lg font-medium">
            YKS'nin her alanı için deneyimli uzman hocalar. WhatsApp ile anında iletişim.
          </p>
        </div>

        {/* Filtreler */}
        <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 shadow-sm mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-wider">
                Ders Alanı
              </label>
              <Link href="/hocalar" className={`block w-full text-xs font-black py-2.5 rounded-xl border text-center transition-all duration-200 mb-2 ${!alan || alan === "tumu" ? "bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-sm" : "bg-[#FAF8F5] text-[#1E3A8A] border-[#EFECE6] hover:border-[#FAF0E3]"}`}>
                Tümü
              </Link>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["Matematik", "Fizik", "Kimya", "Türkçe", "Tarih", "İngilizce"].map((a) => (
                  <Link key={a} href={`/hocalar?alan=${a}${format ? `&format=${format}` : ""}${yks ? `&yks=${yks}` : ""}`}
                    className={`text-[11px] font-black px-3 py-1.5 rounded-xl border transition-all duration-200 ${alan === a ? "bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-sm" : "bg-[#FAF8F5] text-gray-600 border-[#EFECE6] hover:border-[#FAF0E3]"}`}>
                    {a}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-wider">
                Ders Formatı
              </label>
              <div className="flex flex-col gap-2">
                {[
                  { value: "tumu", label: "Tümü" },
                  { value: "yuz-yuze", label: "Yüz Yüze" },
                  { value: "online", label: "Online" },
                ].map((f) => (
                  <Link key={f.value}
                    href={`/hocalar?${alan ? `alan=${alan}&` : ""}format=${f.value}${yks ? `&yks=${yks}` : ""}`}
                    className={`text-xs font-black py-2.5 rounded-xl border text-center transition-all duration-200 ${format === f.value || (!format && f.value === "tumu") ? "bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-sm" : "bg-[#FAF8F5] text-gray-600 border-[#EFECE6] hover:border-[#FAF0E3]"}`}>
                    {f.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-wider">
                YKS Sınav Türü
              </label>
              <div className="flex flex-col gap-2">
                {[
                  { value: "tumu", label: "Tümü" },
                  { value: "TYT", label: "TYT" },
                  { value: "AYT Sayısal", label: "AYT Sayısal" },
                  { value: "AYT Sözel", label: "AYT Sözel" },
                  { value: "AYT EA", label: "AYT Eşit Ağırlık" },
                  { value: "AYT Dil", label: "AYT Dil" },
                ].map((y) => (
                  <Link key={y.value}
                    href={`/hocalar?${alan ? `alan=${alan}&` : ""}${format ? `format=${format}&` : ""}yks=${y.value}`}
                    className={`text-xs font-black py-2.5 rounded-xl border text-center transition-all duration-200 ${yks === y.value || (!yks && y.value === "tumu") ? "bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-sm" : "bg-[#FAF8F5] text-gray-600 border-[#EFECE6] hover:border-[#FAF0E3]"}`}>
                    {y.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sonuç sayısı */}
        <p className="text-xs text-[#B45309] font-black uppercase tracking-widest mb-6 bg-[#FAF0E3] border border-[#F5D0A9] py-2.5 px-4 rounded-xl inline-flex items-center gap-1.5 shadow-sm">
          🚀 Toplam <span className="font-black text-[#1E3A8A]">{filtrelenmis.length}</span> uzman eğitmen listeleniyor
        </p>

        {/* Grid */}
        {filtrelenmis.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtrelenmis.map((h) => <TeacherCard key={h.id} hoca={h} />)}
          </div>
        ) : (
          <div className="text-center py-10 sm:py-20 bg-white/80 backdrop-blur-md border border-[#EFECE6]/60 rounded-3xl p-8 shadow-premium">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-black text-[#1E3A8A] mb-2">Bu filtreye uygun hoca bulunamadı</h3>
            <p className="text-gray-500 mb-6 font-semibold">Filtreleri değiştirmeyi ya da WhatsApp'tan bize danışmayı deneyin.</p>
            <a href={waLink("Merhaba, aradığım kriterlerde hoca bulamadım. Yardımcı olur musunuz?")}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] text-white font-black px-6 py-3 rounded-xl transition-all shadow-sm">
              WhatsApp'tan Sor
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HocalarPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-20 text-center text-gray-500 font-bold">
        Yükleniyor...
      </div>
    }>
      <HocalarContent />
    </Suspense>
  );
}
