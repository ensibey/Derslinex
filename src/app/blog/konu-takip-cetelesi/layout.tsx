import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ders Konu Takip Çetelesi — YKS & LGS Konu Takip Programı",
  description: "Sınav müfredatındaki bitirdiğiniz konuları işaretleyin, ilerleme durumunuzu tarayıcı tabanlı akıllı çetele ile anlık takip edin.",
};

export default function KonuTakipCetelesiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
