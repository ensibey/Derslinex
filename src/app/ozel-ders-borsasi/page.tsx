"use client";

import React, { useState } from "react";
import Link from "next/link";
import { waLink } from "@/lib/utils";

interface DemandItem {
  id: string;
  title: string;
  category: "YKS" | "LGS" | "ARA_SINIF";
  subject: string;
  location: string;
  format: "Online" | "Yüz Yüze" | "Farketmez";
  budget: string;
  hoursPerWeek: string;
  postedAt: string;
  status: "Açık" | "Görüşülüyor";
  desc: string;
}

const initialDemands: DemandItem[] = [
  {
    id: "d1",
    title: "TYT & AYT Matematik Derece Hedefi İçin Deneyimli Hoca",
    category: "YKS",
    subject: "Matematik & Geometri",
    location: "Online / Tüm Türkiye",
    format: "Online",
    budget: "700 - 1.000 TL / Saat",
    hoursPerWeek: "Haftada 2 Gün (4 Saat)",
    postedAt: "Bugün",
    status: "Açık",
    desc: "12. sınıf sayısal öğrencisiyim. TYT netlerim 22-25 bandında, AYT için ileri düzey yeni nesil soru çözümü ve haftalık ödev takibi yapabilecek öğretmen arıyoruz.",
  },
  {
    id: "d2",
    title: "8. Sınıf LGS Fen Bilimleri ve Yeni Nesil Soru Çözümü",
    category: "LGS",
    subject: "Fen Bilimleri",
    location: "Kadıköy / İstanbul veya Online",
    format: "Farketmez",
    budget: "600 - 850 TL / Saat",
    hoursPerWeek: "Haftada 1 Gün (2 Saat)",
    postedAt: "1 gün önce",
    status: "Açık",
    desc: "Oğlum LGS hazırlığında. Fen bilimleri deney sorularında ve grafik yorumlamada desteğe ihtiyacı var. Sabırlı ve pedagojik yaklaşımı kuvvetli öğretmen tercihimizdir.",
  },
  {
    id: "d3",
    title: "YKS Eşit Ağırlık İçin Edebiyat & Paragraf Hızlı Taktikler",
    category: "YKS",
    subject: "Türkçe & Edebiyat",
    location: "Online",
    format: "Online",
    budget: "600 - 800 TL / Saat",
    hoursPerWeek: "Haftada 2 Saat",
    postedAt: "2 gün önce",
    status: "Açık",
    desc: "Cumhuriyet dönemi edebiyat ezberleri ve TYT 30+ net paragraf için haftalık planlı çalışma yapacak tecrübeli eğitmen arayışındayız.",
  },
  {
    id: "d4",
    title: "11. Sınıf Sayısal Fizik Temel Güçlendirme",
    category: "ARA_SINIF",
    subject: "Fizik",
    location: "Çankaya / Ankara veya Online",
    format: "Online",
    budget: "650 - 900 TL / Saat",
    hoursPerWeek: "Haftada 2 Saat",
    postedAt: "3 gün önce",
    status: "Açık",
    desc: "Kuvvet, hareket ve elektrik ünitelerinde temeli sağlamlaştırmak istiyoruz. Okul sınavları ve AYT temeli hedefleniyor.",
  },
];

export default function OzelDersBorsasiPage() {
  const [demands, setDemands] = useState<DemandItem[]>(initialDemands);
  const [filterCat, setFilterCat] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "YKS" as "YKS" | "LGS" | "ARA_SINIF",
    subject: "",
    format: "Online" as "Online" | "Yüz Yüze" | "Farketmez",
    hoursPerWeek: "Haftada 2 Saat",
    budget: "",
    desc: "",
    phone: "",
  });
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const filtered = filterCat === "ALL" ? demands : demands.filter((d) => d.category === filterCat);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDemand: DemandItem = {
      id: `d-${Date.now()}`,
      title: formData.title || `${formData.category} ${formData.subject} Özel Ders Talebi`,
      category: formData.category,
      subject: formData.subject,
      location: formData.format === "Online" ? "Online" : "Şehir Belirtildi",
      format: formData.format,
      budget: formData.budget || "Görüşülecek",
      hoursPerWeek: formData.hoursPerWeek,
      postedAt: "Şimdi",
      status: "Açık",
      desc: formData.desc,
    };
    setDemands([newDemand, ...demands]);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSubmittedSuccess(false);
      setFormData({
        title: "",
        category: "YKS",
        subject: "",
        format: "Online",
        hoursPerWeek: "Haftada 2 Saat",
        budget: "",
        desc: "",
        phone: "",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#1E3A8A] via-[#152860] to-[#0D1B35] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10">
          <div className="space-y-4 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              <span>📈 DERSLINEX ÖZEL DERS BORSASI</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Özel Ders Talepleri & Eğitmen Eşleşme Pazarı
            </h1>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-medium">
              Öğrenci ve veliler aradıkları ders kriterlerini ilan olarak bırakır; Derslinex onaylı uzman eğitmenler doğrudan teklif verir.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bg-[#B45309] hover:bg-[#92400E] text-white font-black text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all hover:scale-102 flex items-center gap-2"
              >
                <span>➕ Ücretsiz Ders Talebi Bırak</span>
              </button>
              <a
                href={waLink("Merhaba, Derslinex Özel Ders Borsası üzerinden ilan vermek / ders almak istiyorum.")}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/15 hover:bg-white/25 text-white font-black text-sm px-6 py-3.5 rounded-xl transition border border-white/20 flex items-center gap-2"
              >
                <span>💬 WhatsApp Danışmanıyla Eşleş</span>
              </a>
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-3 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 w-72 text-center">
            <span className="text-3xl font-black text-amber-300">100%</span>
            <span className="text-xs font-black uppercase tracking-wider text-white">Doğrulanmış Öğretmenler</span>
            <p className="text-[11px] text-gray-300 mt-1">
              Borsadaki tüm ders talepleri rehberlik ve veli onayından geçerek yayınlanır.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#EFECE6] shadow-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: "ALL", label: "Tüm Talepler" },
              { key: "YKS", label: "🎯 YKS (TYT-AYT)" },
              { key: "LGS", label: "🎓 LGS Hazırlık" },
              { key: "ARA_SINIF", label: "📚 Okul / Ara Sınıf" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilterCat(tab.key)}
                className={`text-xs font-black px-4 py-2 rounded-xl transition ${
                  filterCat === tab.key
                    ? "bg-[#1E3A8A] text-white shadow-sm"
                    : "bg-[#FAF8F5] text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-black text-[#B45309]">
            Aktif İlan Sayısı: {filtered.length}
          </span>
        </div>

        {/* Demands Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFECE6] shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#1E3A8A]/10 text-[#1E3A8A] text-[11px] font-black px-3 py-1 rounded-lg uppercase">
                      {item.category}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      ● {item.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-bold">{item.postedAt}</span>
                </div>

                <h3 className="text-lg font-black text-[#1E3A8A] leading-snug mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed font-medium mb-4">
                  {item.desc}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-[#FAF8F5] p-3 rounded-xl border border-[#EFECE6]">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block">Branş</span>
                    <strong className="text-gray-800">{item.subject}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block">Format</span>
                    <strong className="text-gray-800">{item.format}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block">Haftalık Süre</span>
                    <strong className="text-gray-800">{item.hoursPerWeek}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#EFECE6] gap-3">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block">Bütçe Aralığı</span>
                  <span className="text-sm font-black text-[#B45309]">{item.budget}</span>
                </div>

                <a
                  href={waLink(`Merhaba, Derslinex Borsasındaki '${item.title}' ilanına eğitmen olarak teklif vermek / detayları öğrenmek istiyorum.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1E3A8A] hover:bg-[#152860] text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow-xs whitespace-nowrap"
                >
                  Teklif Ver / İletişime Geç →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Demand Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              ✕
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-black text-[#B45309] uppercase tracking-wider block">
                ÜCRETSİZ İLAN OLUŞTURUN
              </span>
              <h2 className="text-xl font-black text-[#1E3A8A]">Özel Ders Talebi Bırakın</h2>
              <p className="text-xs text-gray-500 mt-1">
                İhtiyacınızı belirtin, öğretmenlerimiz ve rehberlik ekibimiz size en uygun eşleşmeyi sağlasın.
              </p>
            </div>

            {submittedSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <div className="text-4xl">🎉</div>
                <h3 className="text-base font-black text-emerald-800">Talebiniz Başarıyla Alındı!</h3>
                <p className="text-xs text-emerald-600">
                  İlanınız borsaya eklendi. Uygun eğitmenler doğrudan sizinle iletişime geçecektir.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">Hedef Sınav / Düzey</label>
                  <select
                    value={formData.category}
                    onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:border-[#1E3A8A]"
                  >
                    <option value="YKS">YKS (TYT - AYT Hazırlık)</option>
                    <option value="LGS">LGS (8. Sınıf Lise Giriş)</option>
                    <option value="ARA_SINIF">Okul Dersi / Ara Sınıf Takviye</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">Ders / Branş</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Matematik, Fizik, Geometri"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">Format</label>
                    <select
                      value={formData.format}
                      onChange={(e: any) => setFormData({ ...formData, format: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:border-[#1E3A8A]"
                    >
                      <option value="Online">Online</option>
                      <option value="Yüz Yüze">Yüz Yüze</option>
                      <option value="Farketmez">Farketmez</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">Haftalık Saat</label>
                    <input
                      type="text"
                      placeholder="Örn: Haftada 2 saat"
                      value={formData.hoursPerWeek}
                      onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">Detaylı Açıklama / Hedefiniz</label>
                  <textarea
                    rows={3}
                    placeholder="Öğrencinin mevcut durumu, net hedefi, özel istekler..."
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">İletişim Telefon / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="05xx xxx xx xx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#B45309] hover:bg-[#92400E] text-white font-black text-xs rounded-xl transition shadow-md"
                >
                  🚀 Talebi Yayınla & Eğitmenlerle Eşleş
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
