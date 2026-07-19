"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { waLink } from "@/lib/utils";

export default function MobileNavBar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerSidebar = () => {
    const event = new CustomEvent("open-sidebar-drawer");
    window.dispatchEvent(event);
  };

  if (!mounted) return null;

  const linkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex flex-col items-center justify-center text-center flex-1 py-1 group transition-all ${
      isActive ? "text-[#B45309] scale-105" : "text-[#1E3A8A] hover:text-[#B45309]"
    }`;
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-[calc(4.5rem+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] bg-white/95 backdrop-blur-lg border-t border-[#EFECE6] z-50 flex items-center justify-around px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {/* Anasayfa */}
      <Link href="/" className={linkClass("/")}>
        <span className="text-xl">🏠</span>
        <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">Ana Sayfa</span>
      </Link>

      {/* Dersler */}
      <Link href="/dersler" className={linkClass("/dersler")}>
        <span className="text-xl">📐</span>
        <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">Dersler</span>
      </Link>

      {/* Wiki */}
      <Link href="/wiki" className={linkClass("/wiki")}>
        <span className="text-xl">📚</span>
        <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">Sözlük</span>
      </Link>

      {/* Hızlı Araçlar */}
      <button
        onClick={triggerSidebar}
        className="flex flex-col items-center justify-center text-center flex-1 py-1 text-[#1E3A8A] hover:text-[#B45309] transition-all outline-none"
      >
        <span className="relative flex h-5 w-5 justify-center items-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-20"></span>
          <span className="text-xl">⚡</span>
        </span>
        <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">Araçlar</span>
      </button>

      {/* WhatsApp Hızlı İletişim */}
      <a
        href={waLink("Merhaba, Derslinex mobil web arayüzünden ulaşıyorum. Özel ders programı ve öğretmenlerimiz hakkında detaylı bilgi alabilir miyim?")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center text-center flex-1 py-1 text-[#1E3A8A] hover:text-emerald-650 transition-all"
      >
        <span className="text-xl">💬</span>
        <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">WhatsApp</span>
      </a>
    </div>
  );
}
