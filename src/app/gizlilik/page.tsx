import type { Metadata } from "next";
export const metadata: Metadata = { title: "Gizlilik Politikası", description: "Sadee Eğitim gizlilik politikası ve KVKK aydınlatma metni." };
export default function GizlilikPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-gray-900 mb-8">Gizlilik Politikası</h1>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
        ⚠️ Bu metin taslaktır. Yayın öncesinde KVKK uzmanı avukatınızdan onay alınız.
      </div>
      <div className="prose max-w-none text-gray-700 space-y-6">
        <p className="text-gray-500 text-sm">Son güncelleme: Haziran 2026</p>
        {[
          ["1. Veri Sorumlusu", "Sadee Eğitim ("Platform"), 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusudur."],
          ["2. Toplanan Kişisel Veriler", "Ad-soyad, e-posta adresi, telefon numarası ve iletişim formlarında paylaşılan bilgiler işlenmektedir."],
          ["3. Verilerin İşlenme Amacı", "Kişisel verileriniz; ders hizmetinin sağlanması, hoca-öğrenci eşleşmesi ve iletişim amaçlarıyla işlenmektedir."],
          ["4. Verilerin Saklanma Süresi", "Form verileri 90 gün, sözleşme kapsamındaki veriler yasal süreler boyunca saklanır."],
          ["5. İlgili Kişi Hakları", "KVKK m.11 kapsamında verilerinize erişim, düzeltme veya silme talebinde bulunabilirsiniz. Talep için: kvkk@sadee.com.tr"],
          ["6. Çerezler", "Sitemiz, oturum ve analitik amaçlarla çerez kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri reddedebilirsiniz."],
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
