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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <span className="text-primary-500 text-xs font-bold uppercase tracking-widest font-sans">EĞİTMEN KADROMUZ</span>
        <h1 className="text-4xl sm:text-5xl font-black mb-2 mt-2 bg-gradient-to-r from-primary-600 to-indigo-650 bg-clip-text text-transparent">Uzman Hocalarımız</h1>
        <p className="text-gray-500 text-lg">
          YKS'nin her alanı için deneyimli uzman hocalar. WhatsApp ile anında iletişim.
        </p>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-premium mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
              Ders Alanı
            </label>
            <Link href="/hocalar" className={`block w-full text-xs font-bold py-2.5 rounded-xl border text-center transition-all duration-200 mb-2 ${!alan || alan === "tumu" ? "bg-primary-600 text-white border-primary-600 shadow-premium" : "bg-white text-gray-600 border-gray-100 hover:border-primary-300"}`}>
              Tümü
            </Link>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {["Matematik", "Fizik", "Kimya", "Türkçe", "Tarih", "İngilizce"].map((a) => (
                <Link key={a} href={`/hocalar?alan=${a}${format ? `&format=${format}` : ""}${yks ? `&yks=${yks}` : ""}`}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all duration-200 ${alan === a ? "bg-primary-600 text-white border-primary-600 shadow-premium" : "bg-white text-gray-600 border-gray-100 hover:border-primary-300"}`}>
                  {a}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
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
                  className={`text-xs font-bold py-2.5 rounded-xl border text-center transition-all duration-200 ${format === f.value || (!format && f.value === "tumu") ? "bg-primary-600 text-white border-primary-600 shadow-premium" : "bg-white text-gray-600 border-gray-100 hover:border-primary-300"}`}>
                  {f.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
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
                  className={`text-xs font-bold py-2.5 rounded-xl border text-center transition-all duration-200 ${yks === y.value || (!yks && y.value === "tumu") ? "bg-primary-600 text-white border-primary-600 shadow-premium" : "bg-white text-gray-600 border-gray-100 hover:border-primary-300"}`}>
                  {y.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sonuç sayısı */}
      <p className="text-sm text-gray-500 mb-6 bg-gray-50 border border-gray-100/50 py-2 px-4 rounded-xl inline-block">
        🚀 Toplam <span className="font-bold text-gray-900">{filtrelenmis.length}</span> uzman eğitmen listeleniyor
      </p>

      {/* Grid */}
      {filtrelenmis.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrelenmis.map((h) => <TeacherCard key={h.id} hoca={h} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Bu filtreye uygun hoca bulunamadı</h3>
          <p className="text-gray-500 mb-6">Filtreleri değiştirmeyi ya da WhatsApp\'tan bize danışmayı deneyin.</p>
          <a href={waLink("Merhaba, aradığım kriterlerde hoca bulamadım. Yardımcı olur musunuz?")}
            target="_blank" rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors">
            WhatsApp\'tan Sor
          </a>
        </div>
      )}
    </div>
  );
}

export default function HocalarPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        Yükleniyor...
      </div>
    }>
      <HocalarContent />
    </Suspense>
  );
}
