import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YKS Hazırlık Rehberi — Puan Hesaplama & Ders Çalışma Araçları",
  description: "Derslinex YKS hazırlık rehberi. Net puanınızı hesaplayın, sınav geri sayımını inceleyin ve YKS ders çalışma önerilerine anında ulaşın.",
};

export default function YksHazirlikLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
