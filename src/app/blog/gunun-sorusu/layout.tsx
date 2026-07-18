import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Günün Sorusu — Her Gün Yeni YKS & LGS Çıkmış Soru Çözümü",
  description: "Günün YKS ve LGS sorusunu çözün, uzman hocalardan detaylı çözüm yollarını inceleyerek netlerinizi artırın.",
};

export default function GununSorusuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
