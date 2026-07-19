import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YKS Meslek Net Atlası — Hangi Bölüm Kaç Net İstiyor?",
  description: "Tıp, Hukuk, Mühendislik gibi popüler üniversite bölümlerine yerleşen son öğrencilerin TYT/AYT net ortalamaları.",
};

export default function MeslekNetAtlasiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
