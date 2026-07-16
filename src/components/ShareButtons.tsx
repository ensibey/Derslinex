"use client";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  shareUrl?: string;
}

export default function ShareButtons({ title, shareUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (shareUrl) return shareUrl;
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  const handleCopy = () => {
    const url = getUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleWhatsApp = () => {
    const url = getUrl();
    const text = encodeURIComponent(`Bunu incelemelisin: ${title} — ${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="inline-flex items-center gap-2 bg-white border border-[#EFECE6] rounded-2xl p-2.5 shadow-sm">
      <span className="text-xs text-gray-500 font-black px-1 uppercase tracking-wider">Paylaş:</span>
      
      {/* WhatsApp Share */}
      <button
        onClick={handleWhatsApp}
        className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-all"
        title="WhatsApp ile Paylaş"
      >
        <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.552 4.118 1.517 5.845L.057 23.547a.75.75 0 00.921.921l5.702-1.46A11.949 11.949 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.692-.504-5.23-1.385l-.374-.22-3.384.867.882-3.384-.22-.374A9.948 9.948 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="px-3 h-9 rounded-xl bg-gray-55 hover:bg-gray-100 border border-[#EFECE6] text-xs font-black text-gray-700 flex items-center justify-center transition-all min-w-[70px]"
      >
        {copied ? "Kopyalandı!" : "Linki Kopyala"}
      </button>
    </div>
  );
}
