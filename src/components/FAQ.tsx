"use client";
import { useState } from "react";

type FAQItem = { soru: string; cevap: string };

export default function FAQ({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left flex justify-between items-center px-5 py-4 bg-white hover:bg-gray-50 transition-colors gap-4"
          >
            <span className="font-semibold text-gray-900 text-sm sm:text-base">{item.soru}</span>
            <span className={`flex-shrink-0 text-primary-600 transition-transform ${open === i ? "rotate-180" : ""}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed bg-gray-50">
              {item.cevap}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
