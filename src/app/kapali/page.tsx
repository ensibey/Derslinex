import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site Kapatılmıştır | Derslinex",
  description: "Derslinex platformu erişime kapatılmıştır.",
  robots: { index: false, follow: false },
};

export default function KapaliPage() {
  return (
    <div className="min-h-screen w-full bg-[#070C18] text-white flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-red-500 selection:text-white relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Brand Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-black tracking-widest text-slate-300 uppercase">
            Derslinex · Bilgilendirme
          </span>
        </div>

        {/* Card Container */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 sm:p-10 backdrop-blur-xl shadow-2xl shadow-black/60">
          {/* Lock / Off Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/30 flex items-center justify-center shadow-lg shadow-red-950/50">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
            Site Kapatılmıştır
          </h1>

          {/* Subheading / Message */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-medium">
            Derslinex platformu hizmete ve erişime kapatılmıştır. Yeni üyelik, ders alımı ve sisteme giriş işlemleri durdurulmuştur.
          </p>

          <div className="border-t border-white/10 pt-6 mt-6">
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Bugüne kadar platformumuza göstermiş olduğunuz ilgi ve güven için teşekkür ederiz.
            </p>

            {/* Support / Contact info */}
            <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-4 flex items-center justify-center gap-3">
              <span className="text-base">✉️</span>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  İletişim & Destek
                </div>
                <a
                  href="mailto:destek@derslinex.com"
                  className="text-xs sm:text-sm font-bold text-red-300 hover:text-white transition-colors"
                >
                  destek@derslinex.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-slate-600 text-xs mt-8 font-semibold tracking-wider uppercase">
          © 2026 Derslinex · Tüm Hakları Saklıdır
        </p>
      </div>
    </div>
  );
}
