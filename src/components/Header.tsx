"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { waLink } from "@/lib/utils";
import SidebarDrawer from "@/components/SidebarDrawer";

const navLinks = [
  { href: "/#nasil-calisir", label: "Nasıl Çalışır?" },
  { href: "/ogretmenler", label: "Öğretmenler" },
  { href: "/ozel-ders", label: "Özel Ders" },
  { href: "/yks-hazirlik", label: "Sınavlara Hazırlık" },
  { href: "/ozel-ders-borsasi", label: "Özel Ders Borsası", badge: "YENİ" },
  { href: "/#firsat-kuponlari", label: "Fırsat Kuponları" },
  { href: "/hakkimizda", label: "Başarılarımız" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedRole = localStorage.getItem("derslinex_role") || sessionStorage.getItem("derslinex_role");
      const savedUser = localStorage.getItem("derslinex_user") || sessionStorage.getItem("derslinex_user");
      if (savedRole && savedUser) {
        setRole(savedRole);
        setUser(JSON.parse(savedUser));
      } else {
        setRole(null);
        setUser(null);
      }
    };
    handleStorageChange();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("derslinex_auth_change", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("derslinex_auth_change", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/98 backdrop-blur-md shadow-xs border-b border-[#EFECE6]">
      {/* ─── SATIR 1: BÜYÜK LOGO & ANA MENÜ ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Sidebar Drawer */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <SidebarDrawer />
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0 py-1">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 group-hover:scale-105 transition-transform flex items-center justify-center">
                <Image
                  src="/logo.png?v=9"
                  alt="Derslinex Logo"
                  fill
                  className="object-contain"
                  sizes="56px"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-[#1E3A8A] tracking-tight group-hover:text-[#B45309] transition-colors leading-none">
                  Derslinex
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#B45309] tracking-wider uppercase mt-0.5">
                  Özel Ders & Sınavlara Hazırlık
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links (1. Satır: İletişim alta alındı) */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-6 flex-shrink">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs 2xl:text-sm font-bold text-[#1E3A8A]/85 hover:text-[#B45309] transition-colors whitespace-nowrap flex items-center gap-1.5 py-1"
              >
                <span>{l.label}</span>
                {l.badge && (
                  <span className="bg-[#B45309] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md animate-pulse">
                    {l.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Hızlı Butonlar (Büyük Ekranlar İçin 1. Satır Sağ) */}
          <div className="hidden lg:flex xl:hidden items-center gap-2">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-black px-3 py-2 rounded-xl transition shadow-xs"
            >
              <span>💬 WhatsApp</span>
            </a>
            <Link
              href="/profil"
              className="inline-flex items-center gap-1.5 bg-[#1E3A8A] hover:bg-[#152860] text-white text-xs font-black px-3.5 py-2 rounded-xl transition shadow-xs"
            >
              <span>👤 Giriş Yap</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex items-center gap-2">
            <Link
              href="/profil"
              className="inline-flex items-center gap-1 bg-[#1E3A8A] text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition whitespace-nowrap"
            >
              <span>👤 {user ? user.name.split(" ")[0] : "Giriş"}</span>
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
              aria-label="Menüyü aç/kapat"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── SATIR 2: WHATSAPP, DERS AL, GİRİŞ KAYIT ─── */}
      <div className="hidden xl:block bg-[#1E3A8A] text-white py-2 border-t border-[#EFECE6]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-bold">
          {/* Sol: Bilgilendirme Rozeti */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-white font-black text-[11px] tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              YKS & LGS 2026 Sezonu Kayıtları Başladı
            </span>
            <span className="text-white/80 hidden 2xl:inline">
              Alanında uzman öğretmenlerle canlı birebir özel ders ve başarı takibi.
            </span>
          </div>

          {/* Sağ: 2. Satır Eylem Grubu (WhatsApp, Ders Al, Giriş/Kayıt) */}
          <div className="flex items-center gap-3">
            {/* 1. WhatsApp */}
            <a
              href={waLink("Merhaba, özel ders ve sınavlara hazırlık programı hakkında bilgi almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-black px-3.5 py-1.5 rounded-lg transition-all shadow-xs hover:scale-102"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.552 4.118 1.517 5.845L.057 23.547a.75.75 0 00.921.921l5.702-1.46A11.949 11.949 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.692-.504-5.23-1.385l-.374-.22-3.384.867.882-3.384-.22-.374A9.948 9.948 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              <span>WhatsApp Destek</span>
            </a>

            {/* 2. Ders Al */}
            <Link
              href="/ogretmenler"
              className="inline-flex items-center gap-1 bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-black px-3.5 py-1.5 rounded-lg transition-all shadow-xs hover:scale-102"
            >
              <span>🎓 Ders Al / Öğretmen Bul</span>
            </Link>

            {/* 3. Giriş / Kayıt */}
            {user ? (
              <Link
                href="/profil"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-lg transition"
              >
                <div className="w-5 h-5 rounded-full bg-[#B45309] text-white flex items-center justify-center text-[10px] font-black overflow-hidden">
                  {user?.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-xs font-black text-white truncate max-w-[100px]">
                  {user.name.split(" ")[0]} ({role === "teacher" ? "Öğretmen" : "Öğrenci"})
                </span>
              </Link>
            ) : (
              <Link
                href="/profil"
                className="inline-flex items-center gap-1.5 bg-white text-[#1E3A8A] hover:bg-[#FAF8F5] text-xs font-black px-3.5 py-1.5 rounded-lg transition-all shadow-xs"
              >
                <span>👤 Giriş Yap / Kayıt Ol</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="xl:hidden bg-[#FAF8F5] border-t border-[#EFECE6] shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-[#1E3A8A] font-bold hover:bg-gray-100 rounded-lg text-sm"
              >
                {l.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-[#EFECE6] space-y-2">
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] text-white font-black text-xs rounded-xl shadow-xs"
              >
                <span>💬 WhatsApp ile İletişim</span>
              </a>

              <Link
                href="/ogretmenler"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#B45309] text-white font-black text-xs rounded-xl shadow-xs"
              >
                <span>🎓 Ders Al / Öğretmen Seç</span>
              </Link>

              <Link
                href="/profil"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#1E3A8A] text-white font-black text-xs rounded-xl shadow-xs"
              >
                <span>👤 {user ? `${user.name} Paneli` : "Giriş Yap / Kayıt Ol"}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
