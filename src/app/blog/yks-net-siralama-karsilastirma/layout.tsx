import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YKS Net ve Sıralama Karşılaştırma Simülatörü — Derslinex",
  description: "Yıllara göre yığılmaları karşılaştırın, netlerinizin hangi YKS yılında yaklaşık kaçıncı sıralamaya denk geldiğini görün.",
};

export default function YksNetSiralamaKarsilastirmaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
