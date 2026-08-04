import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Online Deneme Sınavları — YKS & LGS Kamera Gözetmenli Deneme",
  description:
    "Türkiye geneli online TYT, AYT ve LGS deneme sınavlarına katılın. Gerçek sınav süresi, kamera gözetmenliği, anlık sıralama ve detaylı net analizi.",
};

export const revalidate = 0; // Dynamic server page

async function getExams() {
  try {
    const exams = await prisma.exam.findMany({
      where: {
        status: { in: ["PUBLISHED", "ACTIVE", "ENDED"] },
      },
      orderBy: { startTime: "desc" },
      include: {
        _count: {
          select: { examQuestions: true, attempts: true },
        },
      },
    });
    return exams;
  } catch (error) {
    console.error("Deneme sınavları çekilemedi:", error);
    return [];
  }
}

export default async function DenemeRootPage() {
  const dbExams = await getExams();

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2 font-bold">
          <Link href="/" className="hover:text-[#B45309] transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-gray-900 font-black">Online Deneme Sınavları</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-8 sm:p-12 text-[#1E3A8A] mb-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF0E3]/70 rounded-bl-full -z-10" />
          <div className="max-w-3xl">
            <span className="inline-block bg-[#FAF0E3] border border-[#F5D0A9] text-[#B45309] text-xs font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              CANLI KAMERA GÖZETMENLİKLİ
            </span>
            <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight leading-tight">
              Türkiye Geneli <br />
              <span className="text-[#B45309]">Online Deneme Sınavları</span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed font-medium">
              Gerçek ÖSYM ve MEB sınav formatına uygun süre, yapay zekâ ve kamera gözetmenliği ile ev konforunda Türkiye geneli deneme sınavlarına girin, anlık net analizi ve sıralamanızı görün.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/profil"
                className="bg-[#1E3A8A] hover:bg-[#152860] text-white font-black px-8 py-3.5 rounded-xl transition-all shadow-md"
              >
                Giriş Yap & Sınavlara Katıl →
              </Link>
            </div>
          </div>
        </div>

        {/* Sınav Listesi */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <span className="text-[#B45309] text-xs font-black uppercase tracking-widest block">SINAV LİSTESİ</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1E3A8A] mt-1">Aktif & Yaklaşan Deneme Sınavları</h2>
            </div>
          </div>

          {dbExams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dbExams.map((exam) => {
                const now = new Date();
                const start = new Date(exam.startTime);
                const end = new Date(exam.endTime);

                let statusBadge = { label: "📅 Gelecek Sınav", bg: "bg-blue-50 text-blue-700 border-blue-200" };
                if (now >= start && now <= end) {
                  statusBadge = { label: "🔴 CANLI SINAV", bg: "bg-red-50 text-red-700 border-red-200 animate-pulse" };
                } else if (now > end) {
                  statusBadge = { label: "✅ Tamamlandı", bg: "bg-gray-100 text-gray-700 border-gray-200" };
                }

                return (
                  <div
                    key={exam.id}
                    className="bg-white border border-[#EFECE6] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="bg-[#FAF0E3] text-[#B45309] text-xs font-black px-3 py-1 rounded-xl">
                          {exam.examType} ({exam.targetTag})
                        </span>
                        <span className={`text-xs font-black px-3 py-1 rounded-xl border ${statusBadge.bg}`}>
                          {statusBadge.label}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-[#1E3A8A] mb-2">{exam.title}</h3>
                      <p className="text-xs text-gray-600 font-medium mb-6 line-clamp-2">
                        {exam.description || "Türkiye geneli derecelendirmeli ve zaman sınırlı online deneme sınavı."}
                      </p>

                      <div className="space-y-2 border-t border-[#FAF8F5] pt-4 text-xs font-bold text-gray-500 mb-6">
                        <div className="flex items-center justify-between">
                          <span>⏱️ Sınav Süresi:</span>
                          <span className="text-gray-900 font-black">{exam.durationMinutes} Dakika</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>📝 Soru Sayısı:</span>
                          <span className="text-gray-900 font-black">{exam._count.examQuestions} Soru</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>👥 Katılan Öğrenci:</span>
                          <span className="text-gray-900 font-black">{exam._count.attempts} Öğrenci</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/deneme/${exam.id}`}
                      className="block w-full text-center bg-[#1E3A8A] hover:bg-[#152860] text-white font-black py-3 rounded-xl transition-colors shadow-sm text-sm"
                    >
                      Sınava Git / Katıl →
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-[#EFECE6] rounded-3xl p-12 text-center max-w-xl mx-auto">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-xl font-black text-[#1E3A8A] mb-2">Henüz Yayınlanan Bir Sınav Yok</h3>
              <p className="text-sm text-gray-500 font-medium mb-6">
                Öğretmenlerimiz tarafından hazırlanan yeni Türkiye geneli deneme sınavları çok yakında yayınlanacaktır. Takipte kalın!
              </p>
              <Link
                href="/profil"
                className="inline-block bg-[#1E3A8A] text-white text-xs font-black px-6 py-3 rounded-xl shadow-sm"
              >
                Öğrenci Paneline Git
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
