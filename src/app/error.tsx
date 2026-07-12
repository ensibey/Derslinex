"use client";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-7xl mb-6">⚠️</div>
      <h1 className="text-3xl font-black text-gray-900 mb-3">Bir Hata Oluştu</h1>
      <p className="text-gray-500 mb-8 max-w-md leading-relaxed">
        Sistem yüklenirken beklenmedik bir sorun oluştu. Sayfayı yenilemeyi deneyebilir veya ana sayfaya dönebilirsiniz.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
        >
          Yeniden Dene
        </button>
        <Link
          href="/"
          className="bg-gray-150 hover:bg-gray-200 text-gray-800 font-bold px-6 py-3 rounded-xl transition-all border border-gray-250"
        >
          Ana Sayfaya Git
        </Link>
      </div>
    </div>
  );
}
