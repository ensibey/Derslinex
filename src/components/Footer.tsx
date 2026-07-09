import Link from "next/link";
import Image from "next/image";
import { waLink } from "@/lib/utils";

const dersLinks = [
  { href: "/dersler/matematik-yks", label: "Matematik" },
  { href: "/dersler/fizik-yks", label: "Fizik" },
  { href: "/dersler/kimya-yks", label: "Kimya" },
  { href: "/dersler/biyoloji-yks", label: "Biyoloji" },
  { href: "/dersler/turkce-yks", label: "Türkçe" },
  { href: "/dersler/ingilizce-yks", label: "İngilizce (YDT)" },
];

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-white/10 shadow-md">
                <Image
                  src="/logo.png"
                  alt="Derslinex Logo"
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </div>
              <div className="text-3xl font-black tracking-tight">Derslinex</div>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed">
              YKS'ye hazırlanan her öğrencinin yanında. Uzman hocalar, esnek ders formatı ve Türkiye geneli online eğitim altyapısı.
            </p>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              WhatsApp: Ders Al
            </a>
          </div>

          {/* Dersler */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Dersler</h3>
            <ul className="space-y-2">
              {dersLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-blue-200 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Kurumsal</h3>
            <ul className="space-y-2">
              {[
                { href: "/hakkimizda", label: "Hakkımızda" },
                { href: "/hocalar", label: "Hocalarımız" },
                { href: "/blog", label: "Blog" },
                { href: "/iletisim", label: "İletişim" },
                { href: "/gizlilik", label: "Gizlilik Politikası" },
                { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-blue-200 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">İletişim</h3>
            <ul className="space-y-3 text-sm text-blue-200">
              <li className="flex items-start gap-2">
                <span>📱</span>
                <span>+90 555 000 00 00 (WhatsApp)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✉️</span>
                <span>info@derslinex.com</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Tüm Türkiye (Online ders)<br />Seçili şehirler (Yüz yüze)</span>
              </li>
            </ul>
            <div className="mt-5 flex gap-3">
              <a href="https://instagram.com/derslinex" target="_blank" rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors text-sm">
                Instagram
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors text-sm">
                YouTube
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-blue-300">
          <p>© {new Date().getFullYear()} Derslinex. Tüm hakları saklıdır.</p>
          <p>YKS hazırlık platformu — Türkiye geneli hizmet</p>
        </div>
      </div>
    </footer>
  );
}
