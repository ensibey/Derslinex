import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OBP Sıralama Etki Robotu — Diploma Notunun YKS Sıralamasına Etkisi",
  description: "Ortaöğretim Başarı Puanınızın (OBP) YKS yerleştirme sıralamanızı nasıl etkileyeceğini ve size kaç net kazandıracağını hesaplayın.",
};

export default function ObpSiralamayaEtkisiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
