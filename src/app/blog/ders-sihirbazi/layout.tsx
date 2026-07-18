import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YKS & LGS Tercih Robotu — Netine Göre Üniversite & Lise Bul",
  description: "TYT/AYT netlerinizi girerek yerleşebileceğiniz üniversite bölümlerini ve liseleri tahmin eden ders ve tercih sihirbazı.",
};

export default function DersSihirbaziLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
