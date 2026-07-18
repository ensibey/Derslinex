import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LGS Lise Taban Puanları & Yüzdelik Dilim Arama Motoru",
  description: "Türkiye geneli fen ve Anadolu liselerinin güncel taban puanları, yüzdelik dilimleri ve gereken yaklaşık net sayıları.",
};

export default function LiseTabanPuanlariLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
