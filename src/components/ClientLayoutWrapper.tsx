"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNavBar from "@/components/MobileNavBar";
import WhatsAppButton from "@/components/WhatsAppButton";
import CommandPalette from "@/components/CommandPalette";
import { ToastProvider } from "@/components/Toast";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoute =
    pathname?.startsWith("/profil") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/sifremi-unuttum") ||
    pathname?.startsWith("/sifremi-sifirla") ||
    pathname?.startsWith("/ders/") ||
    pathname?.startsWith("/deneme/");

  if (isDashboardRoute) {
    const isFullscreenRoute = pathname?.startsWith("/deneme/") || pathname?.startsWith("/ders/");
    return (
      <ToastProvider>
        <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
          <CommandPalette />
          <main className={isFullscreenRoute ? "" : "pb-20 md:pb-0"}>{children}</main>
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <CommandPalette />
      <Header />
      <main className="pb-24 lg:pb-0">{children}</main>
      <Footer className="pb-28 lg:pb-14" />
      <MobileNavBar />
      <WhatsAppButton />
    </ToastProvider>
  );
}
