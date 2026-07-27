import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YKS Hazırlık Hocalarımız — TYT, AYT Birebir Özel Ders",
  description: "Türkiye'nin en başarılı dereceli YKS hocalarıyla tanışın. Sayısal, Sözel, Eşit Ağırlık ve Dil alanında ders veren hocaları listeleyin ve arayın.",
};

export default function HocalarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
