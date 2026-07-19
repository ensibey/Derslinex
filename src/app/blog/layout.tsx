import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — YKS Hazırlık Rehberleri ve Çalışma İpuçları",
  description: "YKS hazırlığı için rehber yazılar, çalışma teknikleri, ders önerileri ve sınav bilgileri. Derslinex Blog.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
