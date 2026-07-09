import type { Metadata } from "next";
export const metadata: Metadata = { title: "Kullanım Koşulları", description: "Sadee Eğitim platformu kullanım koşulları." };
export default function KullanimPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-gray-900 mb-8">Kullanım Koşulları</h1>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
        ⚠️ Bu metin taslaktır. Yayın öncesinde avukatınızdan onay alınız.
      </div>
      <div className="prose max-w-none text-gray-700 space-y-6">
        <p className="text-gray-500 text-sm">Son güncelleme: Haziran 2026</p>
        {[
          ["1. Hizmet Kapsamı", "Sadee Eğitim, YKS hazırlık amaçlı öğrenci-hoca eşleşme platformudur. Platform, ders içeriğinden değil aracılık hizmetinden sorumludur."],
          ["2. Kullanıcı Yükümlülükleri", "Kullanıcılar, platforma gerçek bilgilerle kayıt olmak ve hizmetleri yasal amaçlarla kullanmakla yükümlüdür."],
          ["3. Fikri Mülkiyet", "Platform üzerindeki tüm içerikler (metin, görseller, tasarım) Sadee Eğitim'e aittir. İzinsiz kopyalanamaz."],
          ["4. Sorumluluk Sınırı", "Platform, hoca-öğrenci arasındaki ders kalitesinden doğrudan sorumlu tutulamaz."],
          ["5. Değişiklikler", "Platform bu koşulları önceden bildirmeksizin güncelleyebilir. Güncel koşullar bu sayfada yayınlanır."],
        ].map(([baslik, icerik]) => (
          <div key={baslik}>
            <h2 className="text-lg font-bold text-gray-900">{baslik}</h2>
            <p>{icerik}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
