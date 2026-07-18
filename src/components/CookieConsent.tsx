"use client";
import { useEffect, useState } from "react";
import { CONSENT_KEY, CONSENT_EVENT } from "./GoogleAnalytics";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mevcutOnay = localStorage.getItem(CONSENT_KEY);
    if (!mevcutOnay) setVisible(true);
  }, []);

  function karar(deger: "kabul" | "red") {
    localStorage.setItem(CONSENT_KEY, deger);
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Çerez onayı"
      className="fixed inset-x-0 bottom-20 lg:bottom-0 z-[100] bg-[#1E3A8A] text-white shadow-[0_-4px_20px_rgba(0,0,0,0.2)]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-white/90 flex-1 text-center sm:text-left">
          Sitemizde deneyiminizi iyileştirmek ve analiz amacıyla çerezler kullanıyoruz.{" "}
          <a href="/gizlilik" className="underline text-[#FBBF24]">
            Gizlilik Politikası
          </a>
          &apos;nı inceleyebilirsiniz.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => karar("red")}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
          >
            Reddet
          </button>
          <button
            onClick={() => karar("kabul")}
            className="px-4 py-2 rounded-xl text-sm font-black bg-[#D97706] hover:bg-[#B45309] transition-colors"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
