"use client";
import { useEffect, useState } from "react";
import { waLink } from "@/lib/utils";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    const t2 = setTimeout(() => setShowTooltip(true), 4000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="hidden lg:flex fixed bottom-6 right-6 z-50 items-center gap-3">
      {showTooltip && (
        <div className="relative bg-white/95 backdrop-blur-md border border-[#EFECE6] text-[#1E3A8A] font-black text-xs px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 animate-fade-in whitespace-nowrap">
          <span>💬 Hızlı Özel Ders Danışmanlığı</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-gray-600 font-bold ml-1 text-[10px]"
            aria-label="Kapat"
          >
            ✕
          </button>
          {/* Tooltip arrow pointing right */}
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-6 border-l-white/95" />
        </div>
      )}
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile iletişime geç"
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-xl transition-all hover:scale-110 animate-bounce flex-shrink-0"
        style={{ animationIterationCount: 3 }}
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.552 4.118 1.517 5.845L.057 23.547a.75.75 0 00.921.921l5.702-1.46A11.949 11.949 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.692-.504-5.23-1.385l-.374-.22-3.384.867.882-3.384-.22-.374A9.948 9.948 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
      </a>
    </div>
  );
}
