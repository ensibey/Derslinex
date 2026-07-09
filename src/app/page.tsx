import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { hocalar } from "@/data/hocalar";
import { dersAlanlari } from "@/data/dersler";
import TeacherCard from "@/components/TeacherCard";
import SubjectCard from "@/components/SubjectCard";
import FAQ from "@/components/FAQ";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Derslinex | YKS Hazırlık — Uzman Hocalar, Online & Yüz Yüze Ders",
  description:
    "YKS hazırlığında uzman hocalarla çalışın. TYT, AYT Sayısal, Sözel, EA ve Dil için online veya yüz yüze özel ders. WhatsApp ile hemen başlayın.",
};

const faqItems = [
  {
    soru: "Dersler online mı yoksa yüz yüze mi yapılıyor?",
    cevap: "Her iki seçeneği de sunuyoruz. Hocalarımızın bir kısmı yalnızca online, bir kısmı yalnızca yüz yüze, büyük çoğunluğu ise her ikisi ile ders vermektedir. Hoca profillerinde bu bilgi açıkça yer almaktadır.",
  },
  {
    soru: "WhatsApp üzerinden nasıl ders alırım?",
    cevap: "İstediğiniz hocanın profilindeki 'WhatsApp ile Ders Al' butonuna tıklayın. Otomatik hazırlanan mesajı gönderin, hocamız en kısa sürede size döner ve ders programını birlikte belirlersiniz.",
  },
  {
    soru: "Hangi YKS türleri için ders bulabilirsiniz?",
    cevap: "TYT, AYT Sayısal, AYT Sözel, AYT Eşit Ağırlık ve AYT Dil (İngilizce, Almanca, Fransızca) için uzman hocalar platformumuzda yer almaktadır.",
  },
  {
    soru: "Ücretler nasıl belirleniyor?",
    cevap: "Ücretler, hocanın deneyimine, ders formatına (online/yüz yüze) ve ders süresine göre değişmektedir. WhatsApp üzerinden hocayla doğrudan görüşerek detayları öğrenebilirsiniz.",
  },
  {
    soru: "Şehir dışından da ders alabilir miyim?",
    cevap: "Evet. Platformumuzda Türkiye geneline online ders veren çok sayıda hoca bulunmaktadır. Online seçeneğini kullanarak Türkiye'nin her yerinden ders alabilirsiniz.",
  },
];

const stats = [
  { rakam: "9+", etiket: "Uzman Hoca" },
  { rakam: "3.000+", etiket: "Mutlu Öğrenci" },
  { rakam: "12+", etiket: "YKS Dersi" },
  { rakam: "4.8★", etiket: "Ortalama Puan" },
];

export default function HomePage() {
  const oneHocalar = hocalar.filter((h) => h.aktif).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f8f8fd] pt-24 pb-36 px-4">
        {/* Ambient Color Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-200/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-200/20 blur-[150px] pointer-events-none" />
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full bg-pink-100/20 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Sol Kolon - Tipografi */}
          <div className="lg:col-span-7 text-left">
            <span className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-wider shadow-sm">
              ⚡ YKS 2026 Hazırlığı Başlıyor
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.1] mb-8 tracking-tight text-gray-900">
              YKS'de Hedefine<br />
              <span className="bg-gradient-to-r from-primary-600 via-violet-600 to-emerald-500 bg-clip-text text-transparent">Uzman Hocayla</span> Ulaş
            </h1>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mb-12 leading-relaxed font-medium">
              TYT, AYT Sayısal, Sözel, Eşit Ağırlık ve Dil derslerinde zirveye odaklanın. Türkiye'nin en iyi eğitmenleriyle birebir canlı dersler.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base sm:text-lg px-10 py-5 rounded-2xl transition-all duration-300 shadow-glow hover:scale-105"
              >
                <span>💬</span> WhatsApp ile Hemen Başla
              </a>
              <Link
                href="/hocalar"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-base sm:text-lg px-10 py-5 rounded-2xl transition-all duration-300 shadow-premium"
              >
                Hocaları İncele →
              </Link>
            </div>
          </div>

          {/* Sağ Kolon - Floating Premium UI Mockup */}
          <div className="lg:col-span-5 relative hidden lg:block h-[400px]">
            {/* Kart 1: Eğitmen Profil */}
            <div className="absolute top-10 left-10 bg-white border border-gray-100 rounded-3xl p-5 shadow-2xl w-72 animate-float-slow backdrop-blur-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-xl">👨‍🏫</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Ahmet Yılmaz</h4>
                  <p className="text-xs text-gray-500">Matematik Öğretmeni</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-100 rounded-full w-full" />
                <div className="h-2 bg-gray-100 rounded-full w-5/6" />
                <div className="h-2 bg-gray-100 rounded-full w-2/3" />
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center text-xs">
                <span className="text-emerald-600 font-bold">● Online Müsait</span>
                <span className="text-gray-400 font-semibold">10 Yıl Deneyim</span>
              </div>
            </div>

            {/* Kart 2: İlerleme Grafiği */}
            <div className="absolute bottom-5 right-5 bg-white border border-gray-100 rounded-3xl p-6 shadow-2xl w-64 animate-float-delayed backdrop-blur-md">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-xs text-gray-400 uppercase">Haftalık İlerleme</span>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-lg">%88</span>
              </div>
              <div className="text-xl font-black text-gray-900 mb-4">42 Soru Çözüldü</div>
              <div className="flex gap-2 items-end h-16 pt-2">
                <div className="bg-primary-200 h-[40%] w-full rounded-md" />
                <div className="bg-primary-300 h-[60%] w-full rounded-md" />
                <div className="bg-primary-400 h-[50%] w-full rounded-md" />
                <div className="bg-primary-600 h-[90%] w-full rounded-md" />
                <div className="bg-emerald-500 h-[100%] w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white border border-gray-100 rounded-3xl shadow-premium p-8 backdrop-blur-md grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.etiket} className="text-center">
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">{s.rakam}</div>
              <div className="text-xs sm:text-sm text-gray-400 font-bold mt-2 uppercase tracking-wider">{s.etiket}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ders Formatı (Bento Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="text-center mb-16">
          <span className="text-primary-500 text-xs font-bold uppercase tracking-widest">ÇALIŞMA MODELİ</span>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mt-2">Esnek Ders Formatları</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">Nerede olursan ol, kesintisiz öğrenmeye devam et.</p>
        </div>
        <div className="grid md:grid-cols-12 gap-8">
          {/* Bento Kutusu 1 - Geniş ve Büyük */}
          <div className="md:col-span-7 bg-white rounded-[32px] p-8 sm:p-10 border border-gray-100 shadow-premium hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-300">💻</div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Türkiye Geneli Online Ders</h3>
              <p className="text-gray-500 leading-relaxed text-sm mb-8">
                Mesafe sınırlarını kaldırın. Türkiye'nin neresinde olursanız olun, en seçkin YKS öğretmenlerine anında canlı bağlanın. Dijital beyaz tahta, interaktif ödev paylaşımı ve ders kayıtları ile eğitimi evinize getirin.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-6 border-t border-gray-50 mt-auto">
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Gelişmiş canlı ders arayüzü</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Kayıttan tekrar izleme imkanı</li>
              </ul>
              <Link href="/hocalar?format=online" className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 w-full sm:w-auto text-center">
                Online Hocaları Gör
              </Link>
            </div>
          </div>

          {/* Bento Kutusu 2 - İnce ve Yüksek */}
          <div className="md:col-span-5 bg-white rounded-[32px] p-8 sm:p-10 border border-gray-100 shadow-premium hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-300">🏫</div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Yüz Yüze Birebir</h3>
              <p className="text-gray-500 leading-relaxed text-sm mb-8">
                Ortak çalışma alanlarında veya ev konforunda eğitmenle tam odaklanmış birebir YKS hazırlığı.
              </p>
            </div>
            <div className="mt-auto">
              <ul className="space-y-2 text-xs text-gray-600 mb-8 pt-6 border-t border-gray-50">
                <li className="flex items-center gap-2"><span className="text-primary-500 font-bold">✓</span> Anlaşmalı ortak çalışma alanları</li>
                <li className="flex items-center gap-2"><span className="text-primary-500 font-bold">✓</span> Kişiselleştirilmiş ödev takibi</li>
              </ul>
              <Link href="/hocalar?format=yuz-yuze" className="block text-center bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200">
                Yüz Yüze Hocaları Gör
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Öne Çıkan Hocalar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Öne Çıkan Hocalar</h2>
            <p className="text-gray-500 mt-1">En yüksek puanlı, deneyimli hocalarımız</p>
          </div>
          <Link href="/hocalar" className="hidden sm:inline-flex items-center gap-1 text-primary-600 font-semibold hover:underline">
            Tümünü Gör →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {oneHocalar.map((h) => <TeacherCard key={h.id} hoca={h} />)}
        </div>
        <div className="text-center mt-8">
          <Link href="/hocalar" className="inline-block border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Tüm Hocaları Gör ({hocalar.length} hoca)
          </Link>
        </div>
      </section>

      {/* Ders Alanları */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900">YKS Ders Alanları</h2>
          <p className="text-gray-500 mt-2">TYT'den AYT'ye tüm alanlar için uzman hocalar</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {dersAlanlari.slice(0, 8).map((d) => <SubjectCard key={d.id} ders={d} />)}
        </div>
        <div className="text-center mt-6">
          <Link href="/dersler" className="text-primary-600 font-semibold hover:underline">
            Tüm ders alanlarını gör →
          </Link>
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="bg-white mt-20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900">3 Adımda Ders Al</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Hocayı Seç", desc: "Alanına ve ders formatına göre filtreleyerek istediğin hocayı bul. CV'sini ve yorumlarını incele.", emoji: "🔍" },
              { step: "2", title: "WhatsApp'a Yaz", desc: "Profildeki butona tıkla, otomatik mesajı gönder. Hocayla program ve ücret konuşun.", emoji: "💬" },
              { step: "3", title: "Derse Başla", desc: "Anlaştıktan sonra online veya yüz yüze derse başla. Hedef puanına odaklan!", emoji: "🚀" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4">
                  {s.step}
                </div>
                <div className="text-3xl mb-3">{s.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-10 py-4 rounded-xl transition-colors"
            >
              Hemen Başla — WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900">Sıkça Sorulan Sorular</h2>
        </div>
        <FAQ items={faqItems} />
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 mb-4">
        <div className="bg-gradient-to-r from-primary-700 to-primary-500 rounded-3xl p-10 sm:p-14 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Hâlâ kararsız mısın?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            WhatsApp'tan bize ulaş, ihtiyacına en uygun hocanı birlikte bulalım. Yanıt süresi: &lt; 1 saat.
          </p>
          <a
            href={waLink("Merhaba, hangi hoca bana uygun olur konusunda yardım almak istiyorum.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold text-lg px-10 py-4 rounded-xl hover:bg-blue-50 transition-colors"
          >
            💬 Bize Danış — Ücretsiz
          </a>
        </div>
      </section>
    </>
  );
}
