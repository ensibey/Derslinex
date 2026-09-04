import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import TeacherCard from "@/components/TeacherCard";
import FAQ from "@/components/FAQ";
import AdvantageSlider from "@/components/AdvantageSlider";
import SubjectSearchWidget from "@/components/SubjectSearchWidget";
import PackagesSection from "@/components/PackagesSection";
import { waLink } from "@/lib/utils";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Derslinex | Online Özel Ders & Sınavlara Hazırlık (YKS - LGS)",
  description:
    "Doğru Ders, Doğru Öğretmen, Gerçek Başarı. Alanında uzman öğretmenler, online özel ders, kişiye özel program ve düzenli akademik takip ile YKS ve LGS hedefinize ulaşın.",
};

const faqItems = [
  {
    soru: "Dersler online mı yoksa yüz yüze mi yapılıyor?",
    cevap: "Her iki seçeneği de sunuyoruz. Öğretmenlerimizin büyük çoğunluğu Türkiye genelinde gelişmiş interaktif beyaz tahta ve video kayıt sistemiyle online ders vermektedir. İsteyen öğrencilerimiz için yüz yüze ders seçenekleri de mevcuttur.",
  },
  {
    soru: "WhatsApp üzerinden nasıl ders alırım?",
    cevap: "İstediğiniz öğretmenin profilindeki veya sitedeki 'WhatsApp ile Ders Al' butonuna tıklayın. Otomatik hazırlanan mesajı gönderdiğinizde eğitim danışmanımız ve öğretmenimiz en kısa sürede size döner ve ders programını birlikte belirlersiniz.",
  },
  {
    soru: "Hangi sınavlar için özel ders alabilirim?",
    cevap: "YKS (TYT, AYT Sayısal, AYT Eşit Ağırlık, AYT Sözel, YDT Dil) ve LGS (8. sınıf lise hazırlık) başta olmak üzere tüm ara sınıflar için özel ders alabilirsiniz.",
  },
  {
    soru: "Kamera gözetmenli online deneme sınavları ücretli mi?",
    cevap: "Derslinex platformunda belirli dönemlerde tüm öğrencilere açık ücretsiz Türkiye geneli deneme sınavları düzenlenir.",
  },
];

export default async function HomePage() {
  let dbApproved: any[] = [];
  try {
    const dbTeachers = await prisma.teacher.findMany({
      where: { OR: [{ status: "Onaylandı" }, { status: "APPROVED" }, { status: "İletişime Geçildi" }] },
      take: 6,
      orderBy: { points: "desc" }
    });
    dbApproved = dbTeachers.map((t) => ({
      id: `db-${t.id}`,
      slug: t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      isim: t.name,
      unvan: "Eğitmen",
      fotograf: t.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(t.name)}&eyebrows=default&mouth=smile`,
      dersler: [t.branch],
      yksTuru: ["TYT", "AYT Sayısal", "AYT EA"] as any[],
      format: "online" as const,
      konum: "Online / Türkiye Geneli",
      deneyimYili: 5,
      egitim: t.egitim || "Derslinex Onaylı Özel Ders Eğitmeni",
      ozgecmis: t.ozgecmis || `${t.name}, Derslinex platformunda ${t.branch} alanında profesyonel online özel dersler vermektedir.`,
      whatsapp: t.phone.replace(/[^0-9]/g, ""),
      puan: 4.9,
      ogrenciSayisi: 18,
      points: t.points || 0,
      aktif: true
    }));
  } catch (err) {
    console.error("Ana sayfa DB öğretmen hatası:", err);
  }

  const oneHocalar = dbApproved.slice(0, 3);

  // Google SEO: Structured Data
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "Derslinex",
      "url": "https://derslinex.com",
      "logo": "https://derslinex.com/logo.png",
      "description": "YKS ve LGS sınav hazırlığı için Türkiye'nin en iyi öğretmenlerinden online özel ders alın.",
      "telephone": "+905405512020",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "TR",
        "addressLocality": "Denizli",
        "addressRegion": "Pamukkale",
        "streetAddress": "15 Mayıs Mah. 794 Sok. No : 17"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "150"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map((item) => ({
        "@type": "Question",
        "name": item.soru,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.cevap
        }
      }))
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      {/* ─── 1. HERO BÖLÜMÜ (IMAGE 2'DEKİ TASARIMIN BİREBİR UYGULANMASI) ─── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#FFFDF9] to-white pt-12 sm:pt-16 pb-20 px-4 border-b border-[#EFECE6]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          
          {/* Sol Kolon: Başlık, Açıklama, Butonlar ve Güven Rozetleri */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Üst Pill Rozeti */}
            <div className="inline-flex items-center gap-2 bg-[#FFF3E8] border border-[#F5D0A9] px-4 py-1.5 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#E05600] animate-pulse" />
              <span className="text-xs font-black tracking-wider text-[#C04900] uppercase">
                YKS VE LGS'DE SONUCA GÖTÜREN SİSTEM
              </span>
            </div>

            {/* Ana Başlık */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1E3A8A] leading-[1.12]">
              Doğru Ders, Doğru Öğretmen, <br />
              <span className="text-[#C04900]">Gerçek Başarı.</span>
            </h1>

            {/* Açıklama */}
            <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed max-w-xl">
              Alanında uzman öğretmenler, online özel ders, kişiye özel program ve düzenli akademik takip ile hedefini şansa bırakma.
            </p>

            {/* CTA Butonları */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/ogretmenler"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D94F00] to-[#EA580C] hover:from-[#C04900] hover:to-[#D94F00] text-white font-black text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg shadow-orange-900/20 transition-all hover:scale-102 active:scale-98"
              >
                <span>Uygun Öğretmenimi Bul</span>
                <span className="text-lg">›</span>
              </Link>

              <a
                href={waLink("Merhaba, Derslinex üzerinden ücretsiz eğitim danışmanlığı almak istiyorum.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#1E3A8A] border-2 border-[#1E3A8A]/20 hover:border-[#1E3A8A] font-black text-sm sm:text-base px-7 py-4 rounded-xl transition shadow-xs active:scale-98"
              >
                <span>Ücretsiz Danışmanlık Al</span>
              </a>
            </div>

            {/* Alt Güven & Özellik Rozetleri */}
            <div className="pt-4 space-y-2 text-xs font-bold text-gray-600 border-t border-[#EFECE6]/80">
              <div className="flex items-center gap-2 text-[#C04900]">
                <span>⏰</span>
                <span>Sınırlı kontenjan • İlk görüşme ücretsiz</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600">
                <span className="flex items-center gap-1.5"><span className="text-emerald-600">✓</span> Seçkin öğretmen kadrosu</span>
                <span className="flex items-center gap-1.5"><span className="text-emerald-600">✓</span> Kişiye özel başarı planı</span>
                <span className="flex items-center gap-1.5"><span className="text-emerald-600">✓</span> Düzenli veli bilgilendirmesi</span>
              </div>
            </div>

          </div>

          {/* Sağ Kolon: Öğrenci, Laptop ve İnteraktif Kartlar (Image 2'deki Görsel Düzen) */}
          {/* Sağ Kolon: Öğrenci, Laptop ve İnteraktif Kartlar (Temiz, Özgün Kodlanmış Görsel Düzen) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Ana Görsel: Temiz Öğrenci ve Laptop Arka Planı (Üzerinde Çakışan Yazı veya Kart Yoktur) */}
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-slate-100 to-slate-200">
                <Image
                  src="/hero-student-clean.jpg?v=2"
                  alt="Derslinex Online Özel Ders ve Canlı Takip"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>

              {/* Floating Card 1: Haftalık Program (Sol / Üst Kısım) */}
              <div className="absolute -top-5 left-2 sm:left-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-gray-100 hover:scale-102 transition-transform">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-lg bg-orange-100 text-[#D94F00] flex items-center justify-center text-xs">📅</span>
                  <span className="text-xs font-black text-[#1E3A8A]">Haftalık Program</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] font-bold text-gray-500">
                  {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day, idx) => (
                    <div key={day} className="flex flex-col items-center gap-1">
                      <span className="text-[9px]">{day}</span>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white font-black shadow-xs ${
                        idx < 5 ? "bg-[#E05600]" : "bg-gray-200 text-gray-500"
                      }`}>
                        {idx < 5 ? "✓" : "·"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Card 2: Deneme Analizi (Sol / Orta Kısım) */}
              <div className="absolute top-[48%] -left-4 sm:-left-8 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-xl border border-gray-100 hover:scale-102 transition-transform">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-lg bg-orange-100 text-[#D94F00] flex items-center justify-center text-xs">📊</span>
                  <span className="text-xs font-black text-[#1E3A8A]">Deneme Analizi</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Donut Chart SVG */}
                  <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="4" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#1E3A8A" strokeWidth="4"
                        strokeDasharray="63 100" strokeDashoffset="0" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#E05600" strokeWidth="4"
                        strokeDasharray="16 100" strokeDashoffset="-63" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#94A3B8" strokeWidth="4"
                        strokeDasharray="9 100" strokeDashoffset="-79" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="text-[10px] font-bold space-y-1">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#1E3A8A]" /> <span className="text-gray-700">Doğru %72</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#E05600]" /> <span className="text-gray-700">Yanlış %18</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#94A3B8]" /> <span className="text-gray-700">Boş %10</span></div>
                  </div>
                </div>
              </div>

              {/* Floating Card 3: Gelişim Takibi (Sol / Alt Kısım) */}
              <div className="absolute -bottom-5 left-3 sm:left-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-xl border border-gray-100 hover:scale-102 transition-transform">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-lg bg-orange-100 text-[#D94F00] flex items-center justify-center text-xs">📈</span>
                  <span className="text-[11px] font-black text-[#1E3A8A]">Gelişim Takibi</span>
                </div>
                <div className="w-32 sm:w-36 h-10 relative flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 120 36">
                    <defs>
                      <linearGradient id="heroCurveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E05600" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#E05600" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M 10 28 Q 55 20 110 6 L 110 36 L 10 36 Z" fill="url(#heroCurveGrad)" />
                    <path d="M 10 28 Q 55 20 110 6" fill="none" stroke="#E05600" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="10" cy="28" r="3" fill="#E05600" />
                    <circle cx="60" cy="18" r="3" fill="#E05600" />
                    <circle cx="110" cy="6" r="3.5" fill="#E05600" stroke="#FFFFFF" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="flex justify-between text-[8px] font-bold text-gray-400 mt-1 px-1">
                  <span>1. Hafta</span>
                  <span>4. Hafta</span>
                  <span className="text-[#E05600] font-black">7. Hafta</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─── 2. İSTATİSTİK METRİK KARTLARI (IMAGE 2'DEKİ 4'LÜ KART DÜZENİ) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center gap-4 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1E3A8A]/10 text-[#1E3A8A] flex items-center justify-center text-2xl flex-shrink-0">
              👥
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#1E3A8A]">50+</div>
              <div className="text-xs text-gray-500 font-bold">Uzman Öğretmen</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center gap-4 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#D94F00] flex items-center justify-center text-2xl flex-shrink-0">
              🎓
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#1E3A8A]">1.000+</div>
              <div className="text-xs text-gray-500 font-bold">Özel Ders</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center gap-4 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1E3A8A]/10 text-[#1E3A8A] flex items-center justify-center text-2xl flex-shrink-0">
              ⭐
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#1E3A8A]">%96</div>
              <div className="text-xs text-gray-500 font-bold">Memnuniyet Oranı</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center gap-4 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl flex-shrink-0">
              🏆
            </div>
            <div>
              <div className="text-amber-500 font-black text-sm tracking-widest">★★★★★</div>
              <div className="text-xs text-gray-500 font-bold mt-0.5">Öğrenci & Veli Güveni</div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 3. DERS PAKETLERİ BÖLÜMÜ (ADMİNDEN YÖNETİLEBİLİR) ─── */}
      <PackagesSection />

      {/* ─── 4. ÇALIŞMAK İSTEDİĞİN ALAN (YKS & LGS YENİDEN DÜZENLENDİ) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20">
        <div className="text-center mb-8">
          <span className="text-[#B45309] text-xs font-black uppercase tracking-widest">
            HIZLI BRANŞ VE EĞİTMEN SEÇİMİ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2">
            Çalışmak İstediğin Alanı Seç
          </h2>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto font-medium text-sm">
            YKS veya LGS sınav hedefine göre dersini seç, en başarılı öğretmenlerle doğrudan eşleş.
          </p>
        </div>

        <div className="flex justify-center">
          <SubjectSearchWidget />
        </div>
      </section>

      {/* ─── 5. DERS FORMATI (ONLINE / YÜZ YÜZE) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="text-center mb-12">
          <span className="text-[#B45309] text-xs font-black uppercase tracking-widest">ÇALIŞMA MODELİ</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2">Sana Uygun Ders Formatı</h2>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto font-medium text-sm">Nerede olursan ol, kesintisiz öğrenmeye devam et.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EFECE6] shadow-lg flex flex-col hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-[#FAF0E3] rounded-2xl flex items-center justify-center text-3xl mb-6">🏫</div>
            <h3 className="text-2xl font-bold text-[#1E3A8A] mb-3">Yüz Yüze Özel Ders</h3>
            <p className="text-gray-600 mb-6 leading-relaxed text-sm font-medium">
              Belirlenen çalışma merkezlerinde veya evinizde eğitmenle birebir ders. Anlık geri bildirim ve yüksek odaklanma.
            </p>
            <ul className="space-y-3 text-sm text-gray-600 mb-8 mt-auto font-semibold">
              {["Seçili şehirlerdeki uzman öğretmenler", "Birebir konforlu çalışma ortamı", "Haftalık hedeflere dayalı program", "Eğitmen rehberliğinde özel materyaller"].map(i => (
                <li key={i} className="flex items-center gap-3"><span className="text-[#B45309] font-bold">✓</span>{i}</li>
              ))}
            </ul>
            <Link href="/ogretmenler?format=yuz-yuze" className="inline-block text-center bg-[#B45309] hover:bg-[#92400E] text-white font-black px-8 py-3.5 rounded-xl transition-all">
              Yüz Yüze Öğretmenleri Gör
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EFECE6] shadow-lg flex flex-col hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-[#1E3A8A]/10 rounded-2xl flex items-center justify-center text-3xl mb-6">💻</div>
            <h3 className="text-2xl font-bold text-[#1E3A8A] mb-3">Online Özel Ders</h3>
            <p className="text-gray-600 mb-6 leading-relaxed text-sm font-medium">
              Mesafe sınırı olmadan Türkiye'nin en iyi öğretmenlerine anında erişin. İnteraktif beyaz tahta ve video kayıt imkanı.
            </p>
            <ul className="space-y-3 text-sm text-gray-600 mb-8 mt-auto font-semibold">
              {["Tüm Türkiye genelinden seçkin öğretmenler", "Gelişmiş dijital eğitim araçları", "Kayıt imkanıyla dersi tekrar izleme", "Zaman ve mekan esnekliği"].map(i => (
                <li key={i} className="flex items-center gap-3"><span className="text-[#B45309] font-bold">✓</span>{i}</li>
              ))}
            </ul>
            <Link href="/ogretmenler?format=online" className="inline-block text-center bg-[#1E3A8A] hover:bg-[#152860] text-white font-black px-8 py-3.5 rounded-xl transition-all">
              Online Öğretmenleri Gör
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 7. ONAYLI ÖĞRETMENLERİMİZ VİTRİNİ (SADECE GERÇEK DB ÖĞRETMENLERİ) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-[#1E3A8A]">Öne Çıkan Öğretmenlerimiz</h2>
            <p className="text-gray-600 mt-1 font-medium text-sm">Derslinex onaylı, yüksek puanlı eğitmenlerimiz</p>
          </div>
          <Link href="/ogretmenler" className="hidden sm:inline-flex items-center gap-1 text-[#B45309] font-black text-sm hover:underline">
            Tümünü Gör →
          </Link>
        </div>

        {oneHocalar.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {oneHocalar.map((h) => (
              <TeacherCard key={h.id} hoca={h} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#EFECE6] shadow-sm space-y-4">
            <span className="text-5xl block">👨‍🏫</span>
            <h3 className="text-xl font-black text-[#1E3A8A]">Eğitmen Kadromuza Katılın</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Derslinex ailesinde yer almak ve Türkiye geneline online özel ders vermek isteyen öğretmenlerimiz başvurularını tamamlayabilir.
            </p>
            <Link
              href="/profil"
              className="inline-block bg-[#1E3A8A] text-white font-black text-xs px-6 py-3 rounded-xl shadow-xs"
            >
              Öğretmen Başvurusu Yap ➔
            </Link>
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/ogretmenler" className="inline-block border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white font-black text-xs px-8 py-3 rounded-xl transition-all">
            Tüm Öğretmen Kadrosunu İncele
          </Link>
        </div>
      </section>

      {/* ─── 8. 3 ADIMDA DERS AL ─── */}
      <section id="nasil-calisir" className="bg-white border-t border-b border-[#EFECE6] mt-16 sm:mt-24 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#1E3A8A]">3 Adımda Ders Al</h2>
            <p className="text-gray-500 font-medium text-sm mt-2">Hedeflediğin başarıya giden en kolay yol</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Öğretmeni Seç", desc: "Sınavına (YKS/LGS) ve branşına göre filtreleyerek istediğin eğitmeni bul. Özgeçmişini ve puanını incele.", emoji: "🔍" },
              { step: "2", title: "WhatsApp'a Yaz", desc: "Öğretmenin profilindeki butona tıkla. Program, deneme hedefleri ve ücret detaylarını konuş.", emoji: "💬" },
              { step: "3", title: "Derse Başla", desc: "Anlaştıktan sonra canlı interaktif sistemle veya yüz yüze derse başla. Hedef netlerine odaklan!", emoji: "🚀" },
            ].map((s) => (
              <div key={s.step} className="text-center bg-[#FAF8F5] p-6 rounded-2xl border border-[#EFECE6]">
                <div className="w-14 h-14 bg-[#FAF0E3] text-[#B45309] border border-[#F5D0A9] rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-4">
                  {s.step}
                </div>
                <div className="text-3xl mb-2">{s.emoji}</div>
                <h3 className="text-lg font-black text-[#1E3A8A] mb-2">{s.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href={waLink("Merhaba, 3 adımda ders alma süreci hakkında danışmanlık almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] text-white font-black text-sm px-8 py-3.5 rounded-xl transition-all shadow-md"
            >
              Hemen Başla — WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ─── 9. SSS (SIKÇA SORULAN SORULAR) ─── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[#1E3A8A]">Sıkça Sorulan Sorular</h2>
        </div>
        <FAQ items={faqItems} />
      </section>

      {/* ─── 10. ALTA ALINAN İLETİŞİM & DANIŞMANLIK ÇAĞRISI ─── */}
      <section id="iletisim-alani" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 mb-10">
        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#0D1B35] rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden border border-white/10">
          <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1 rounded-full text-xs font-black uppercase mb-4">
            📞 7/24 DESTEK & İLETİŞİM
          </div>
          <h3 className="text-2xl sm:text-4xl font-black mb-3">Soruların mı var? Bize Ulaş!</h3>
          <p className="text-gray-200 text-sm sm:text-base mb-8 max-w-xl mx-auto font-medium">
            Öğretmen seçimi, sınav hazırlık paketleri ve online özel dersler hakkında detaylı bilgi için iletişim ekibimiz hizmetinizdedir.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={waLink("Merhaba, Derslinex iletişim hattına yazıyorum. Bilgi almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all"
            >
              💬 WhatsApp'tan Yaz
            </a>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-black text-sm px-8 py-3.5 rounded-xl transition border border-white/20"
            >
              📍 İletişim & Konum Bilgileri
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
