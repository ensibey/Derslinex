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
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <span className="text-primary-650 text-xs font-bold uppercase tracking-widest font-sans">BİZ KİMİZ?</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 mt-2 bg-gradient-to-r from-primary-600 to-indigo-650 bg-clip-text text-transparent">Hakkımızda</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            YKS hazırlığında öğrencileri Türkiye'nin en iyi hocalarıyla buluşturuyoruz.
          </p>
        </div>

        {/* Misyon */}
        <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-850 rounded-3xl p-10 text-white mb-12 shadow-md relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-2xl font-black mb-4 relative z-10">Misyonumuz</h2>
          <p className="text-primary-100 text-lg leading-relaxed max-w-2xl relative z-10 font-medium">
            Her öğrencinin kaliteli eğitime erişebilmesi gerektiğine inanıyoruz. Derslinex olarak, YKS hazırlığında doğru hocayı bulmayı kolaylaştırıyor, online ve yüz yüze ders seçenekleriyle Türkiye'nin her köşesine ulaşıyoruz.
          </p>
        </div>

        {/* Sayılar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16">
          {[
            { rakam: "9+", etiket: "Uzman Hoca" },
            { rakam: "3.000+", etiket: "Öğrenci" },
            { rakam: "2022", etiket: "Kuruluş Yılı" },
            { rakam: "4.8/5", etiket: "Ortalama Puan" },
          ].map((s) => (
            <div key={s.etiket} className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
              <div className="text-3xl font-black bg-gradient-to-r from-primary-600 to-indigo-650 bg-clip-text text-transparent">{s.rakam}</div>
              <div className="text-sm text-gray-500 mt-1 font-bold">{s.etiket}</div>
            </div>
          ))}
        </div>

        {/* Değerler */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-8">Değerlerimiz</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { emoji: "🎯", baslik: "Sonuç Odaklılık", aciklama: "Her öğrencinin hedef puanına ulaşması için en uygun hocanın ve yöntemin seçilmesine önem veririz." },
              { emoji: "🤝", baslik: "Güven ve Şeffaflık", aciklama: "Hoca CV'leri gerçek verilerle oluşturulmuştur. Öğrenci yorumları denetlenerek yayınlanır." },
              { emoji: "🌍", baslik: "Erişilebilirlik", aciklama: "Online ders seçeneğiyle Türkiye'nin her yerindeki öğrencilere ulaşmayı hedefleriz." },
            ].map((d) => (
              <div key={d.baslik} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="text-4xl mb-4">{d.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{d.baslik}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{d.aciklama}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ekip */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-8">Ekibimizden</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {ekip.map((k) => (
              <div key={k.isim} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                <div className="text-5xl mb-4">{k.emoji}</div>
                <h3 className="font-bold text-gray-900">{k.isim}</h3>
                <p className="text-sm text-gray-500 mt-1 font-semibold">{k.rol}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
