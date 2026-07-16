import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LGS Hazırlık Rehberi — Puan Hesaplama & Ders Çalışma Araçları",
  description: "Derslinex LGS hazırlık rehberi. Net puanınızı hesaplayın, sınav geri sayımını inceleyin ve LGS ders çalışma önerilerine anında ulaşın.",
};

export default function LgsHazirlikLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
