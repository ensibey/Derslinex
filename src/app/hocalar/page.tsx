"use client";
import { useSearchParams } from "next/navigation";
import { hocalar } from "@/data/hocalar";
import TeacherCard from "@/components/TeacherCard";
import { waLink } from "@/lib/utils";
import React, { Suspense } from "react";

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
        <h1 className="text-4xl font-black text-gray-900">Hocalarımız</h1>
        <p className="text-gray-500 mt-2 text-lg">
          YKS'nin her alanı için deneyimli uzman hocalar. WhatsApp ile anında iletişim.
        </p>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
              Ders Alanı
            </label>
            <a href="/hocalar" className={`block w-full text-sm px-3 py-2 rounded-lg border cursor-pointer text-center mb-1 ${!alan || alan === "tumu" ? "bg-primary-600 text-white border-primary-600" : "bg-white text-gray-700 border-gray-200 hover:border-primary-300"}`}>
              Tümü
            </a>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {["Matematik", "Fizik", "Kimya", "Türkçe", "Tarih", "İngilizce"].map((a) => (
                <a key={a} href={`/hocalar?alan=${a}${format ? `&format=${format}` : ""}${yks ? `&yks=${yks}` : ""}`}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${alan === a ? "bg-primary-600 text-white border-primary-600" : "bg-white text-gray-600 border-gray-200 hover:border-primary-300"}`}>
                  {a}
                </a>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
              Ders Formatı
            </label>
            <div className="flex flex-col gap-1.5">
              {[
                { value: "tumu", label: "Tümü" },
                { value: "yuz-yuze", label: "Yüz Yüze" },
                { value: "online", label: "Online" },
              ].map((f) => (
                <a key={f.value}
                  href={`/hocalar?${alan ? `alan=${alan}&` : ""}format=${f.value}${yks ? `&yks=${yks}` : ""}`}
                  className={`text-sm px-3 py-2 rounded-lg border text-center transition-colors ${format === f.value || (!format && f.value === "tumu") ? "bg-primary-600 text-white border-primary-600" : "bg-white text-gray-700 border-gray-200 hover:border-primary-300"}`}>
                  {f.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
              YKS Türü
            </label>
            <div className="flex flex-col gap-1.5">
              {[
                { value: "tumu", label: "Tümü" },
                { value: "TYT", label: "TYT" },
                { value: "AYT Sayısal", label: "AYT Sayısal" },
                { value: "AYT Sözel", label: "AYT Sözel" },
                { value: "AYT EA", label: "AYT Eşit Ağırlık" },
                { value: "AYT Dil", label: "AYT Dil" },
              ].map((y) => (
                <a key={y.value}
                  href={`/hocalar?${alan ? `alan=${alan}&` : ""}${format ? `format=${format}&` : ""}yks=${y.value}`}
                  className={`text-sm px-3 py-2 rounded-lg border text-center transition-colors ${yks === y.value || (!yks && y.value === "tumu") ? "bg-primary-600 text-white border-primary-600" : "bg-white text-gray-700 border-gray-200 hover:border-primary-300"}`}>
                  {y.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sonuç sayısı */}
      <p className="text-sm text-gray-500 mb-6">
        <span className="font-semibold text-gray-900">{filtrelenmis.length}</span> hoca bulundu
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
