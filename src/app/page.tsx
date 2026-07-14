import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { hocalar } from "@/data/hocalar";
import { dersAlanlari } from "@/data/dersler";
import TeacherCard from "@/components/TeacherCard";
import SubjectCard from "@/components/SubjectCard";
import FAQ from "@/components/FAQ";
import AdvantageSlider from "@/components/AdvantageSlider";
import SubjectSearchWidget from "@/components/SubjectSearchWidget";
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
      <section className="relative overflow-hidden bg-[#FAF8F5] pt-20 pb-28 px-4 border-b border-[#EFECE6]">
        {/* Glow & Academic Pattern Mockups */}
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#D97706]/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-[#1E3A8A]/5 blur-[150px] pointer-events-none" />
        <div className="absolute top-10 right-[15%] w-72 h-72 border border-[#EFECE6]/40 rounded-full pointer-events-none" />
        <div className="absolute top-20 right-[18%] w-56 h-56 border border-[#D97706]/5 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Info & Action */}
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 bg-[#FAF0E3] border border-[#F5D0A9] text-[#B45309] text-xs font-black px-4 py-2 rounded-full mb-6 uppercase tracking-widest shadow-sm">
              <span>🎓</span> YKS 2026 AKADEMİK DÖNEMİ
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight text-[#1E3A8A]">
              YKS'de Hedeflediğin <br />
              <span className="text-[#D97706] relative">
                Bölümü Şansa Bırakma!
                <span className="absolute bottom-1 left-0 w-full h-[4px] bg-[#FAF0E3] -z-10 rounded-full" />
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed max-w-xl font-medium">
              Türkiye'nin en seçkin YKS dereceli hocalarından TYT, AYT Sayısal, Sözel, EA ve Dil dersleri. Haftalık ders takipleriyle hedefinize emin adımlarla ilerleyin.
            </p>

            {/* Interactive Search Box */}
            <SubjectSearchWidget />
          </div>

          {/* Right Column: Visual Academic Dashboard Card */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="bg-white border border-[#EFECE6] rounded-3xl p-8 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FAF0E3]/60 rounded-bl-full -z-10" />
              
              <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-[#FAF8F5]">
                <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center text-xl text-[#1E3A8A] font-bold shadow-sm">🏫</div>
                <div>
                  <h4 className="text-base font-black text-[#1E3A8A]">Derslinex Modeli</h4>
                  <p className="text-xs text-gray-500 font-bold">Birebir YKS Koçluğu & Takip</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Kişiye Özel Haftalık Program", desc: "Seviyenize ve hedeflerinize uygun haftalık ders saatleri", icon: "📅", color: "bg-[#FAF0E3]/70 text-[#B45309]" },
                  { title: "Zirvedeki Öğretmenler", desc: "Derece yapanları yetiştirmiş uzman hoca kadrosu", icon: "🏆", color: "bg-[#1E3A8A]/5 text-[#1E3A8A]" },
                  { title: "Anlık WhatsApp İletişimi", desc: "Hocalarınızla 7/24 kesintisiz iletişim kanalları", icon: "💬", color: "bg-[#E8F5E9] text-[#2E7D32]" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-3 rounded-2xl hover:bg-[#FAF8F5] transition-colors border border-transparent hover:border-[#EFECE6]">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.color} flex-shrink-0 shadow-sm`}>
                      {item.icon}
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-[#1E3A8A]">{item.title}</h5>
                      <p className="text-xs text-gray-500 font-bold mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Advantage Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white border border-[#EFECE6] rounded-3xl shadow-sm p-8 grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          {stats.map((s) => (
            <div key={s.etiket} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#1E3A8A]">{s.rakam}</div>
              <div className="text-xs sm:text-sm text-gray-500 font-black mt-2 uppercase tracking-wider">{s.etiket}</div>
            </div>
          ))}
        </div>
        
        <AdvantageSlider />
      </section>

      {/* Ders Formatı */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="text-center mb-16">
          <span className="text-[#D97706] text-xs font-black uppercase tracking-widest">ÇALIŞMA MODELİ</span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#1E3A8A] mt-2">Sana Uygun Ders Formatı</h2>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto font-medium">Nerede olursan ol, kesintisiz öğrenmeye devam et.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EFECE6] shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-[#FAF0E3] rounded-2xl flex items-center justify-center text-3xl mb-6">🏫</div>
            <h3 className="text-2xl font-bold text-[#1E3A8A] mb-4">Yüz Yüze Ders</h3>
            <p className="text-gray-600 mb-8 leading-relaxed text-sm">
              Belirlenen çalışma merkezlerinde veya evinizde eğitmenle birebir ders. Anlık geri bildirim ve yüksek odaklanma.
            </p>
            <ul className="space-y-3.5 text-sm text-gray-600 mb-8 mt-auto">
              {["Seçili şehirlerdeki uzman hocalar", "Birebir konforlu çalışma ortamı", "Haftalık hedeflere dayalı program", "Eğitmen rehberliğinde özel materyaller"].map(i => (
                <li key={i} className="flex items-center gap-3"><span className="text-[#D97706] font-bold">✓</span>{i}</li>
              ))}
            </ul>
            <Link href="/hocalar?format=yuz-yuze" className="inline-block text-center bg-[#D97706] hover:bg-[#B45309] text-white font-bold px-8 py-4 rounded-xl transition-all duration-200">
              Yüz Yüze Hocaları Gör
            </Link>
          </div>
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EFECE6] shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-[#1E3A8A]/10 rounded-2xl flex items-center justify-center text-3xl mb-6">💻</div>
            <h3 className="text-2xl font-bold text-[#1E3A8A] mb-4">Online Ders</h3>
            <p className="text-gray-600 mb-8 leading-relaxed text-sm">
              Mesafe sınırı olmadan en iyi hocalara anında erişin. İnteraktif beyaz tahta ve video kayıt imkanıyla yüksek verim.
            </p>
            <ul className="space-y-3.5 text-sm text-gray-600 mb-8 mt-auto">
              {["Tüm Türkiye genelinden seçkin hocalar", "Gelişmiş dijital eğitim araçları", "Kayıt imkanıyla dersi tekrar izleme", "Zaman ve mekan esnekliği"].map(i => (
                <li key={i} className="flex items-center gap-3"><span className="text-[#D97706] font-bold">✓</span>{i}</li>
              ))}
            </ul>
            <Link href="/hocalar?format=online" className="inline-block text-center bg-[#D97706] hover:bg-[#B45309] text-white font-bold px-8 py-4 rounded-xl transition-all duration-200">
              Online Hocaları Gör
            </Link>
          </div>
        </div>
      </section>

      {/* Öne Çıkan Hocalar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-[#1E3A8A]">Öne Çıkan Hocalar</h2>
            <p className="text-gray-600 mt-1 font-medium">En yüksek puanlı, deneyimli hocalarımız</p>
          </div>
          <Link href="/hocalar" className="hidden sm:inline-flex items-center gap-1 text-[#D97706] font-bold hover:underline">
            Tümünü Gör →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {oneHocalar.map((h) => <TeacherCard key={h.id} hoca={h} />)}
        </div>
        <div className="text-center mt-8">
          <Link href="/hocalar" className="inline-block border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white font-bold px-8 py-3 rounded-xl transition-all">
            Tüm Hocaları Gör ({hocalar.length} hoca)
          </Link>
        </div>
      </section>

      {/* Ders Alanları */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#1E3A8A]">YKS Ders Alanları</h2>
          <p className="text-gray-650 mt-2 font-medium">TYT'den AYT'ye tüm alanlar için uzman hocalar</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {dersAlanlari.slice(0, 8).map((d) => <SubjectCard key={d.id} ders={d} />)}
        </div>
        <div className="text-center mt-6">
          <Link href="/dersler" className="text-[#D97706] font-bold hover:underline">
            Tüm ders alanlarını gör →
          </Link>
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="bg-white border-t border-b border-[#EFECE6] mt-20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#1E3A8A]">3 Adımda Ders Al</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Hocayı Seç", desc: "Alanına ve ders formatına göre filtreleyerek istediğin hocayı bul. CV'sini ve yorumlarını incele.", emoji: "🔍" },
              { step: "2", title: "WhatsApp'a Yaz", desc: "Profildeki butona tıkla, otomatik mesajı gönder. Hocayla program ve ücret konuşun.", emoji: "💬" },
              { step: "3", title: "Derse Başla", desc: "Anlaştıktan sonra online veya yüz yüze derse başla. Hedef puanına odaklan!", emoji: "🚀" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 bg-[#FAF0E3] text-[#B45309] border border-[#F5D0A9] rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4">
                  {s.step}
                </div>
                <div className="text-3xl mb-3">{s.emoji}</div>
                <h3 className="text-xl font-black text-[#1E3A8A] mb-2">{s.title}</h3>
                <p className="text-gray-650 text-sm font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white font-black text-lg px-10 py-4 rounded-xl transition-all shadow-md hover:scale-105"
            >
              Hemen Başla — WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#1E3A8A]">Sıkça Sorulan Sorular</h2>
        </div>
        <FAQ items={faqItems} />
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 mb-8">
        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#111827] rounded-3xl p-10 sm:p-14 text-center text-white shadow-md relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-black mb-4 relative z-10">Hâlâ kararsız mısın?</h2>
          <p className="text-gray-200 text-lg mb-8 max-w-xl mx-auto relative z-10 font-medium">
            WhatsApp'tan bize ulaş, ihtiyacına en uygun hocanı birlikte bulalım. Yanıt süresi: &lt; 1 saat.
          </p>
          <a
            href={waLink("Merhaba, hangi hoca bana uygun olur konusunda yardım almak istiyorum.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white font-black text-lg px-10 py-4 rounded-xl transition-all hover:scale-105 relative z-10"
          >
            💬 Bize Danış — Ücretsiz
          </a>
        </div>
      </section>
    </>
  );
}
