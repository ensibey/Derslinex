"use client";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-[#FAF8F5]">
      <div className="text-7xl mb-6">⚠️</div>
      <h1 className="text-3xl font-black text-[#1E3A8A] mb-3">Bir Hata Oluştu</h1>
      <p className="text-gray-500 mb-8 max-w-md leading-relaxed font-semibold">
        Sistem yüklenirken beklenmedik bir sorun oluştu. Sayfayı yenilemeyi deneyebilir veya ana sayfaya dönebilirsiniz.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-[#B45309] hover:bg-[#92400E] text-white font-black px-6 py-3.5 rounded-xl transition-all shadow active:scale-95"
        >
          Yeniden Dene
        </button>
        <Link
          href="/"
          className="bg-white hover:bg-gray-50 text-[#1E3A8A] border border-[#EFECE6] font-black px-6 py-3.5 rounded-xl transition-all shadow active:scale-95"
        >
          Ana Sayfaya Git
        </Link>
      </div>
    </div>
  );
}
