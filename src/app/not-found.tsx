import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-[#FAF8F5]">
      <div className="text-8xl mb-6 select-none">🔍</div>
      <h1 className="text-4xl font-black text-[#1E3A8A] mb-3">Sayfa Bulunamadı</h1>
      <p className="text-gray-500 mb-8 max-w-sm font-semibold leading-relaxed">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="bg-[#B45309] hover:bg-[#92400E] text-white font-black px-8 py-3.5 rounded-xl transition-all shadow active:scale-95"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
