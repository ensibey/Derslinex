import type { Metadata } from "next";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Hakkımızda — Derslinex",
  description: "Derslinex, YKS hazırlığında öğrencileri en iyi hocalarla buluşturan bir eğitim platformudur. Misyonumuz, hedefine ulaşmak isteyen her öğrencinin yanında olmak.",
};

const ekip = [
  { isim: "Ahmet Yılmaz", rol: "Kurucu & Matematik Hocası", emoji: "👨‍🏫" },
  { isim: "Elif Demir", rol: "Türkçe & Edebiyat Hocası", emoji: "👩‍🏫" },
  { isim: "Dr. Mehmet Çelik", rol: "Fizik Hocası", emoji: "👨‍🔬" },
];

export default function HakkimizdaPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <span className="text-[#B45309] text-xs font-black uppercase tracking-widest font-sans">BİZ KİMİZ?</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 mt-2 text-[#1E3A8A]">Hakkımızda</h1>
          <p className="text-lg text-gray-600 max-w-2xl font-medium leading-relaxed">
            YKS hazırlığında öğrencileri Türkiye'nin en iyi hocalarıyla buluşturan, başarı odaklı yeni nesil eğitim platformu.
          </p>
        </div>

        {/* Misyon & Vizyon Infografik */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-8 sm:p-10 mb-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FAF0E3]/60 rounded-bl-full -z-10" />
          <div className="w-16 h-16 rounded-2xl bg-[#FAF0E3] flex items-center justify-center text-4xl shadow-sm flex-shrink-0">🎯</div>
          <div>
            <h2 className="text-2xl font-black text-[#1E3A8A] mb-3">Misyonumuz</h2>
            <p className="text-gray-600 text-base leading-relaxed max-w-2xl font-medium">
              Her öğrencinin kaliteli eğitime erişebilmesi gerektiğine inanıyoruz. Derslinex olarak, YKS hazırlığında doğru hocayı bulmayı kolaylaştırıyor, online ve yüz yüze ders seçenekleriyle Türkiye'nin her köşesine ulaşıyoruz.
            </p>
          </div>
        </div>

        {/* Sayılar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {[
            { rakam: "9+", etiket: "Uzman Hoca" },
            { rakam: "3.000+", etiket: "Öğrenci" },
            { rakam: "2022", etiket: "Kuruluş Yılı" },
            { rakam: "4.8/5", etiket: "Ortalama Puan" },
          ].map((s) => (
            <div key={s.etiket} className="bg-white rounded-2xl border border-[#EFECE6] p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl font-black text-[#1E3A8A]">{s.rakam}</div>
              <div className="text-xs text-gray-500 mt-1 font-black uppercase tracking-wider">{s.etiket}</div>
            </div>
          ))}
        </div>

        {/* Değerler */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-[#1E3A8A] mb-8">Değerlerimiz</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { emoji: "🎯", baslik: "Sonuç Odaklılık", aciklama: "Her öğrencinin hedef puanına ulaşması için en uygun hocanın ve yöntemin seçilmesine önem veririz." },
              { emoji: "🤝", baslik: "Güven ve Şeffaflık", aciklama: "Hoca CV'leri gerçek verilerle oluşturulmuştur. Öğrenci yorumları denetlenerek yayınlanır." },
              { emoji: "🌍", baslik: "Erişilebilirlik", aciklama: "Online ders seçeneğiyle Türkiye'nin her yerindeki öğrencilere ulaşmayı hedefleriz." },
            ].map((d) => (
              <div key={d.baslik} className="bg-white rounded-2xl border border-[#EFECE6] shadow-sm p-6 hover:-translate-y-1 transition-transform">
                <div className="text-4xl mb-4">{d.emoji}</div>
                <h3 className="text-lg font-black text-[#1E3A8A] mb-2">{d.baslik}</h3>
                <p className="text-gray-600 text-sm leading-relaxed font-medium">{d.aciklama}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ekip */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-[#1E3A8A] mb-8">Ekibimizden</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {ekip.map((k) => (
              <div key={k.isim} className="bg-white rounded-2xl border border-[#EFECE6] shadow-sm p-6 text-center">
                <div className="text-5xl mb-4">{k.emoji}</div>
                <h3 className="font-bold text-[#1E3A8A]">{k.isim}</h3>
                <p className="text-sm text-gray-500 mt-1 font-bold">{k.rol}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-[#1E3A8A] mb-3">Başarı Yolculuğuna Başlayın</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-6 text-sm font-medium">
            Alanında uzman eğitmenlerimizle size en uygun programı hazırlamak için buradayız.
          </p>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] text-white font-black px-8 py-3.5 rounded-xl transition-all shadow-sm"
          >
            Hemen İletişime Geçin
          </a>
        </div>
      </div>
    </div>
  );
}
