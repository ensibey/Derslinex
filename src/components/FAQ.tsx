"use client";
import { useState } from "react";

type FAQItem = { soru: string; cevap: string };

export default function FAQ({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div 
            key={i} 
            className={`border rounded-2xl overflow-hidden bg-white transition-all duration-300 ${
              isOpen 
                ? "border-[#F5D0A9] shadow-md shadow-[#FAF0E3]/40" 
                : "border-[#EFECE6] hover:border-gray-300 shadow-sm"
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full text-left flex justify-between items-center px-6 py-5 bg-white hover:bg-[#FAF8F5]/30 transition-colors gap-4 outline-none"
            >
              <span className={`font-black text-sm sm:text-base transition-colors duration-200 ${isOpen ? "text-[#D97706]" : "text-[#1E3A8A]"}`}>
                {item.soru}
              </span>
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center bg-[#FAF8F5] border border-[#EFECE6] text-gray-500 transition-all duration-300 ${isOpen ? "rotate-180 bg-[#FAF0E3] border-[#F5D0A9] text-[#B45309]" : ""}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? "max-h-[500px] border-t border-[#EFECE6] bg-[#FAF8F5]/40" : "max-h-0"
              }`}
            >
              <div className="px-6 py-5 text-gray-650 text-sm leading-relaxed font-medium">
                {item.cevap}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
