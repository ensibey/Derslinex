import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieConsent from "@/components/CookieConsent";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://derslinex.com"),
  title: {
    default: "Derslinex | Online Özel Ders & Birebir YKS LGS Hazırlık",
    template: "%s | Derslinex",
  },
  description:
    "YKS ve LGS hazırlığında Türkiye'nin en iyi hocalarından online özel ders ve birebir ders alın. Matematik, Fizik, Türkçe ve Kimya derslerinde online birebir eğitim. WhatsApp ile hemen başlayın.",
  keywords: [
    "online özel ders", "online ders", "birebir özel ders", "yks hazırlık", 
    "yks özel ders", "lgs özel ders", "lgs online ders", "birebir ders", 
    "tyt hazırlık", "ayt sayısal özel ders", "matematik online özel ders", 
    "fizik online ders", "derslinex online eğitim", "özel ders fiyatları"
  ],
  robots: { index: true, follow: true },
  verification: { google: "google5716913a2e6e8126" },
  icons: {
    icon: [
      { url: "/logo.png?v=9", sizes: "192x192", type: "image/png" },
      { url: "/logo.png?v=9", sizes: "96x96", type: "image/png" },
      { url: "/logo.png?v=9", sizes: "48x48", type: "image/png" },
      { url: "/favicon.ico?v=9", sizes: "any" }
    ],
    shortcut: "/favicon.ico?v=9",
    apple: [
      { url: "/logo.png?v=9", sizes: "180x180", type: "image/png" }
    ]
  },
  openGraph: {
    type: "website",
    title: "Derslinex | Online Özel Ders & Birebir YKS LGS Hazırlık",
    description: "Türkiye'nin en iyi hocalarından online özel ders ve birebir ders alın. Online birebir eğitim.",
    images: [
      {
        url: "/logo.png?v=9",
        width: 800,
        height: 600,
        alt: "Derslinex Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/logo.png?v=9"],
  },
  other: {
    "og:locale": "tr_TR",
  },
};

import MobileNavBar from "@/components/MobileNavBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://ui-avatars.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://ui-avatars.com" />
        <link rel="icon" href="/logo.png?v=9" sizes="192x192" type="image/png" />
        <link rel="icon" href="/logo.png?v=9" sizes="96x96" type="image/png" />
        <link rel="icon" href="/logo.png?v=9" sizes="48x48" type="image/png" />
        <link rel="icon" href="/favicon.ico?v=9" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico?v=9" />
        <link rel="apple-touch-icon" href="/logo.png?v=9" sizes="180x180" />
      </head>
      <body className="bg-[#FAF8F5] text-gray-900 antialiased">
        <Header />
        <main className="pb-24 lg:pb-0">{children}</main>
        <Footer className="pb-28 lg:pb-14" />
        <MobileNavBar />
        <WhatsAppButton />
        <GoogleAnalytics />
        <CookieConsent />
      </body>
    </html>
  );
}
