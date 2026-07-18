import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YKS & LGS Hap Bilgiler Kartları — İnteraktif Ders Çalışma Kartları",
  description: "Matematik, Fizik, Türkçe derslerinde sınavda çıkabilecek hap bilgileri, formülleri ve kuralları akılda kalıcı kartlarla hemen öğrenin.",
};

export default function BilgiKartlariLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
