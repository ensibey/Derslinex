import type { Hoca } from "@/types";

// Hayali öğretmenler kaldırılmıştır. Platformda yalnızca onaylı gerçek öğretmenler listelenir.
export const hocalar: Hoca[] = [];

export function getHocaBySlug(slug: string): Hoca | undefined {
  return hocalar.find((h) => h.slug === slug);
}

export function filterHocalar(params: {
  alan?: string;
  format?: string;
  yks?: string;
}) {
  return hocalar.filter((h) => {
    if (!h.aktif) return false;
    if (params.alan && !h.dersler.some((d) => d.toLowerCase().includes(params.alan!.toLowerCase()))) return false;
    if (params.format && params.format !== "tumu" && h.format !== params.format && h.format !== "her-ikisi") return false;
    if (params.yks && params.yks !== "tumu" && !h.yksTuru.includes(params.yks as any)) return false;
    return true;
  });
}
