import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl mb-6">🔍</div>
      <h1 className="text-4xl font-black text-gray-900 mb-3">Sayfa Bulunamadı</h1>
      <p className="text-gray-500 mb-8 max-w-sm">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
      <Link href="/" className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
