import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YKS & LGS Yıllara Göre Soru Dağılımları ve Konu Analizleri",
  description: "Matematik, Fizik, Türkçe ve Kimya derslerinde ÖSYM'nin geçmiş yıllarda hangi konudan kaç soru sorduğunu inceleyin.",
};

export default function SoruDagilimlariLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
