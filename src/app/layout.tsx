import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Derslinex | YKS Hazırlık — Uzman Hocalar, Online & Yüz Yüze Ders",
    template: "%s | Derslinex",
  },
  description:
    "YKS hazırlığında Türkiye'nin en iyi hocalarıyla çalışın. TYT, AYT Sayısal, Sözel, EA ve Dil için online ve yüz yüze özel ders platformu. WhatsApp ile hemen başlayın.",
  keywords: [
    "yks hazırlık", "yks özel ders", "tyt hazırlık", "ayt sayısal",
    "online yks dersi", "yüz yüze yks dersi", "derslinex",
    "matematik yks", "fizik yks", "derslinex eğitim",
  ],
  robots: { index: true, follow: true },
  verification: { google: "GOOGLE_SITE_VERIFICATION_CODE_HERE" },
  other: {
    "og:locale": "tr_TR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
