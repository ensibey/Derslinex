import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim — Derslinex",
  description: "Derslinex YKS hazırlık platformu ile iletişime geçin. Soru, öneri, ders talebi veya öğretmen başvurusu için hızlı formumuzu doldurun veya WhatsApp'tan yazın.",
};

export default function IletisimLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
