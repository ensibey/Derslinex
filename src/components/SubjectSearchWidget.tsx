"use client";

import { waLink } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function SubjectSearchWidget() {
  const router = useRouter();

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md border border-[#EFECE6] max-w-lg">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="calisma-alani" className="block text-xs font-black text-[#1E3A8A] uppercase tracking-wider mb-1.5">
            Çalışmak İstediğin Alan
          </label>
          <select
            id="calisma-alani"
            name="calisma-alani"
            aria-label="Çalışmak İstediğiniz YKS Ders Alanı"
            className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-3 py-2.5 text-sm font-bold text-gray-700 focus:outline-none focus:border-[#D97706]"
            onChange={(e) => {
              if (e.target.value) {
                router.push(`/dersler/${e.target.value}`);
              }
            }}
          >
            <option value="">Seçim Yapın...</option>
            <option value="matematik-yks">Matematik YKS</option>
            <option value="fizik-yks">Fizik YKS</option>
            <option value="kimya-yks">Kimya YKS</option>
            <option value="biyoloji-yks">Biyoloji YKS</option>
          </select>
        </div>
        <div className="flex items-end">
          <a
            href={waLink("Merhaba, YKS hazırlık dersleri hakkında bilgi almak istiyorum.")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white font-black text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-sm"
          >
            Rehberlik Al
          </a>
        </div>
      </div>
    </div>
  );
}
