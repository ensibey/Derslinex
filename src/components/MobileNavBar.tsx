"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { waLink } from "@/lib/utils";

export default function MobileNavBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerSidebar = () => {
    // Custom window event fırlatarak SidebarDrawer'ı aç
    const event = new CustomEvent("open-sidebar-drawer");
    window.dispatchEvent(event);
  };

  if (!mounted) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#EFECE6] z-50 flex items-center justify-around px-2 shadow-2xl">
      {/* Anasayfa */}
      <Link href="/" className="flex flex-col items-center justify-center text-center flex-1 py-1 group">
        <span className="text-xl">🏠</span>
        <span className="text-[10px] font-black text-[#1E3A8A] mt-0.5 group-hover:text-[#D97706] transition-colors">Ana Sayfa</span>
      </Link>

      {/* Dersler */}
      <Link href="/dersler" className="flex flex-col items-center justify-center text-center flex-1 py-1 group">
        <span className="text-xl">📐</span>
        <span className="text-[10px] font-black text-[#1E3A8A] mt-0.5 group-hover:text-[#D97706] transition-colors">Dersler</span>
      </Link>

      {/* Hızlı Menü */}
      <button onClick={triggerSidebar} className="flex flex-col items-center justify-center text-center flex-1 py-1 group outline-none">
        <span className="relative flex h-5 w-5 justify-center items-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-20"></span>
          <span className="text-xl">⚡</span>
        </span>
        <span className="text-[10px] font-black text-[#1E3A8A] mt-0.5 group-hover:text-[#D97706] transition-colors">Hızlı Menü</span>
      </button>

      {/* WhatsApp */}
      <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center text-center flex-1 py-1 group">
        <span className="text-xl">💬</span>
        <span className="text-[10px] font-black text-[#1E3A8A] mt-0.5 group-hover:text-[#D97706] transition-colors">WhatsApp</span>
      </a>
    </div>
  );
}
