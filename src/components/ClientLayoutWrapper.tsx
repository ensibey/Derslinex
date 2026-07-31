"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNavBar from "@/components/MobileNavBar";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoute =
    pathname?.startsWith("/profil") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/sifremi-unuttum") ||
    pathname?.startsWith("/sifremi-sifirla") ||
    pathname?.startsWith("/ders/");

  if (isDashboardRoute) {
    return (
      <div className="min-h-screen bg-[#0A1628]">
        <main>{children}</main>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="pb-24 lg:pb-0">{children}</main>
      <Footer className="pb-28 lg:pb-14" />
      <MobileNavBar />
      <WhatsAppButton />
    </>
  );
}
