"use client";

import { useState } from "react";
import { waLink } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function SubjectSearchWidget() {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  const subjectLabels: Record<string, string> = {
    "matematik-yks": "Matematik",
    "fizik-yks": "Fizik",
    "kimya-yks": "Kimya",
    "biyoloji-yks": "Biyoloji",
  };

  const getWaMessage = () => {
    if (!selected) {
      return "Merhaba, YKS hazırlık dersleri hakkında bilgi almak istiyorum.";
    }
    const name = subjectLabels[selected] || selected;
    return `Merhaba, ${name} YKS özel dersleri ve ders programı hakkında detaylı bilgi almak istiyorum.`;
  };

  const handleSearch = () => {
    if (selected) {
      router.push(`/dersler/${selected}`);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-premium border border-[#EFECE6]/60 max-w-xl">
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="calisma-alani" className="block text-xs font-black text-[#1E3A8A] uppercase tracking-widest mb-2">
            Çalışmak İstediğin Alan
          </label>
          <select
            id="calisma-alani"
            name="calisma-alani"
            aria-label="Çalışmak İstediğiniz YKS Ders Alanı"
            className="w-full bg-[#FAF8F5]/80 border border-[#EFECE6] rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-[#B45309] transition-all"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Bir ders seçin...</option>
            <option value="matematik-yks">Matematik YKS</option>
            <option value="fizik-yks">Fizik YKS</option>
            <option value="kimya-yks">Kimya YKS</option>
            <option value="biyoloji-yks">Biyoloji YKS</option>
          </select>
          
          <div className="flex flex-wrap gap-1.5 mt-2.5 items-center">
            <span className="text-[10px] text-gray-500 font-bold mr-1">Hızlı Seç:</span>
            {Object.entries(subjectLabels).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(key)}
                className={`text-[10px] font-black px-2.5 py-1 rounded-lg border transition-all ${
                  selected === key
                    ? "bg-[#B45309] text-white border-[#B45309]"
                    : "bg-[#FAF8F5] text-gray-600 border-[#EFECE6] hover:bg-gray-100"
                }`}
              >
                {label} YKS
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSearch}
            disabled={!selected}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#172d6b] disabled:bg-gray-100 disabled:text-gray-400 text-white font-black text-sm px-6 py-3.5 rounded-xl transition-all shadow-sm active:scale-95 disabled:pointer-events-none"
          >
            🔍 Detayları & Hocaları Gör
          </button>
          <a
            href={waLink(getWaMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#B45309] hover:bg-[#92400E] text-white font-black text-sm px-6 py-3.5 rounded-xl transition-all shadow-sm active:scale-95"
          >
            💬 Rehberlik Al
          </a>
        </div>
      </div>
    </div>
  );
}
