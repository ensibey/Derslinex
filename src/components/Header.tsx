"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { waLink } from "@/lib/utils";

const navLinks = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/hocalar", label: "Öğretmenlerimiz" },
  { href: "/dersler", label: "Dersler" },
  { href: "/yks-hazirlik", label: "YKS Hazırlık" },
  { href: "/lgs-hazirlik", label: "LGS Hazırlık" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md shadow-sm border-b border-[#EFECE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-12 h-12 group-hover:scale-105 transition-transform flex items-center justify-center">
                <Image
                  src="/logo.png?v=7"
                  alt="Derslinex Logo"
                  fill
                  className="object-contain"
                  sizes="48px"
                  priority
                />
              </div>
              <span className="text-2xl font-black text-[#1E3A8A] tracking-tight group-hover:text-[#B45309] transition-colors">Derslinex</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-bold text-[#1E3A8A]/80 hover:text-[#B45309] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] text-white text-sm font-bold px-5 py-3 rounded-xl transition-all duration-200 shadow-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.552 4.118 1.517 5.845L.057 23.547a.75.75 0 00.921.921l5.702-1.46A11.949 11.949 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.692-.504-5.23-1.385l-.374-.22-3.384.867.882-3.384-.22-.374A9.948 9.948 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              WhatsApp ile Ders Al
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-t border-[#EFECE6] shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {navLinks
              .filter((l) => l.href !== "/dersler")
              .map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-[#1E3A8A] font-bold hover:bg-gray-100 rounded-lg"
                >
                  {l.label}
                </Link>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}
