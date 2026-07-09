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
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 text-white pt-20 pb-28 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block bg-white/10 text-blue-200 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            YKS 2026 Hazırlığı Başlıyor 🎯
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
            YKS'de Hedefine<br />
            <span className="text-yellow-400">Uzman Hocayla</span> Ulaş
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            TYT, AYT Sayısal, Sözel, EA ve Dil için deneyimli hocalar. Online veya yüz yüze ders seçeneği. WhatsApp ile anında başla.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors shadow-lg"
            >
              <span>💬</span> WhatsApp ile Hemen Başla
            </a>
            <Link
              href="/hocalar"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors backdrop-blur-sm"
            >
              Hocaları İncele →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.etiket} className="text-center">
              <div className="text-3xl font-black text-primary-600">{s.rakam}</div>
              <div className="text-sm text-gray-500 mt-1">{s.etiket}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ders Formatı */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Sana Uygun Ders Formatı</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Nerede olursan ol, ders almaya devam et.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-primary-50 to-blue-100 rounded-2xl p-8 border border-primary-100">
            <div className="text-4xl mb-4">🏫</div>
            <h3 className="text-xl font-bold text-primary-900 mb-3">Yüz Yüze Ders</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Belirli şehirlerdeki hocalarımızla birebir yüz yüze ders. Doğrudan etkileşim, anlık geri bildirim ve odaklanmış çalışma ortamı.
            </p>
            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              {["Seçili şehirlerdeki hocalar", "Birebir yerinde çalışma", "Haftalık düzenli program", "Kişiselleştirilmiş materyaller"].map(i => (
                <li key={i} className="flex items-center gap-2"><span className="text-green-600">✓</span>{i}</li>
              ))}
            </ul>
            <Link href="/hocalar?format=yuz-yuze" className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Yüz Yüze Hocaları Gör
            </Link>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 border border-green-100">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="text-xl font-bold text-green-900 mb-3">Online Ders</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Türkiye'nin her yerinden Türkiye'nin en iyi hocalarına eriş. Evden, kütüphaneden — nerede olursan ol.
            </p>
            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              {["Türkiye geneli hocalar", "Video konferans ile canlı ders", "Esnek saat seçeneği", "Ders kayıtları izlenebilir"].map(i => (
                <li key={i} className="flex items-center gap-2"><span className="text-green-600">✓</span>{i}</li>
              ))}
            </ul>
            <Link href="/hocalar?format=online" className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Online Hocaları Gör
            </Link>
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
