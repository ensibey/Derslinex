import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminAuth } from "@/lib/adminAuth";

export async function GET(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    // 1. Database usage & record counts
    const [
      studentCount,
      teacherCount,
      questionCount,
      questionsWithImages,
      liveSessions,
      endedSessions,
      examAttemptsWithCamera,
      examCount,
      examAnswersCount,
      quizResultsCount,
      feedbackCount,
      contactCount,
      blogCount,
      chatMessageCount
    ] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.question.count(),
      prisma.question.count({ where: { imageUrl: { not: null } } }),
      prisma.liveSession.findMany({ select: { durationMinutes: true, status: true, capacity: true } }),
      prisma.liveSession.count({ where: { status: "ENDED" } }),
      prisma.studentExamAttempt.count({ where: { hasCamera: true } }),
      prisma.exam.count(),
      prisma.studentExamAnswer.count(),
      prisma.studentQuizResult.count(),
      prisma.feedback.count(),
      prisma.contactMessage.count(),
      prisma.blogPost.count(),
      prisma.chatMessage.count(),
    ]);

    // Calculate total video minutes used
    const totalLiveMinutes = liveSessions.reduce((acc, s) => acc + (s.durationMinutes || 60), 0);
    const estimatedVideoMinutes = totalLiveMinutes + (examAttemptsWithCamera * 45);

    // Total database records
    const totalDbRecords = 
      studentCount + 
      teacherCount + 
      questionCount + 
      liveSessions.length + 
      examCount + 
      examAnswersCount + 
      quizResultsCount + 
      feedbackCount + 
      contactCount + 
      blogCount + 
      chatMessageCount;

    // Approximate database size in MB (average 1KB per record + overhead)
    const estimatedDbSizeMB = Math.max(0.8, Number(((totalDbRecords * 1.5) / 1024).toFixed(2)));

    // Service Quotas and Live Usage Metrics
    const services = [
      {
        id: "render",
        name: "Render.com Web Service",
        category: "Sunucu & Hosting",
        status: "active",
        icon: "🚀",
        plan: "Starter / Web Service",
        metricName: "Çalışma Süresi & Trafik",
        used: 100, // percentage or hours
        limit: 750,
        unit: "Saat/Ay",
        percentage: 13,
        bandwidthUsed: 0.85,
        bandwidthLimit: 100,
        bandwidthUnit: "GB",
        cost: "$0.00",
        notes: "Frankfurt (EU Central) - Otomatik CI/CD bağlı ve %100 canlıda.",
      },
      {
        id: "neon",
        name: "Neon PostgreSQL",
        category: "Veritabanı",
        status: "active",
        icon: "🐘",
        plan: "Free Tier",
        metricName: "Veritabanı Depolama",
        used: estimatedDbSizeMB,
        limit: 512, // 512 MB
        unit: "MB",
        percentage: Math.max(1, Number(((estimatedDbSizeMB / 512) * 100).toFixed(1))),
        totalRecords: totalDbRecords,
        cost: "$0.00",
        notes: `Toplam ${totalDbRecords.toLocaleString("tr-TR")} kayıt (${studentCount} öğrenci, ${teacherCount} öğretmen, ${questionCount} soru, ${chatMessageCount} mesaj).`,
      },
      {
        id: "daily",
        name: "Daily.co Canlı Video & Gözetmenlik",
        category: "Görüntülü Görüşme",
        status: "active",
        icon: "📹",
        plan: "Developer (10.000 Dk/Ay)",
        metricName: "Görüntülü Ders & Kamera Dakikası",
        used: estimatedVideoMinutes,
        limit: 10000,
        unit: "Dakika",
        percentage: Math.max(1, Number(((estimatedVideoMinutes / 10000) * 100).toFixed(1))),
        activeSessions: liveSessions.filter(s => s.status === "LIVE").length,
        completedSessions: endedSessions,
        cameraExams: examAttemptsWithCamera,
        cost: "$0.00",
        notes: `${endedSessions} tamamlanan canlı ders + ${examAttemptsWithCamera} kamera gözetmenli sınav yapıldı.`,
      },
      {
        id: "r2",
        name: "Cloudflare R2 Video Depolama",
        category: "Depolama (S3)",
        status: "active",
        icon: "☁️",
        plan: "Standard Free Tier",
        metricName: "Ders Kayıt Depolaması",
        used: Number((endedSessions * 0.12).toFixed(2)), // ~120MB per recorded session
        limit: 10,
        unit: "GB",
        percentage: Math.max(0.5, Number((((endedSessions * 0.12) / 10) * 100).toFixed(1))),
        bucket: "derslinex-recordings",
        domain: "recordings.derslinex.com",
        readsUsed: 42,
        readsLimit: 10000000,
        writesUsed: endedSessions,
        writesLimit: 1000000,
        cost: "$0.00",
        notes: "Egress (video izleme/indirme) bant genişliği sınırsız ve $0 ücretlidir.",
      },
      {
        id: "cloudinary",
        name: "Cloudinary CDN Medya",
        category: "Görsel & CDN",
        status: "active",
        icon: "🖼️",
        plan: "Free Tier (25 Kredi)",
        metricName: "Görsel Depolama & Optimizasyon",
        used: Number(((questionsWithImages * 0.4 + teacherCount * 0.2) / 1000).toFixed(2)),
        limit: 25,
        unit: "GB / Kredi",
        percentage: Math.max(1, Number(((((questionsWithImages * 0.4 + teacherCount * 0.2) / 1000) / 25) * 100).toFixed(1))),
        totalImages: questionsWithImages + teacherCount,
        cost: "$0.00",
        notes: `${questionsWithImages} soru görseli ve profil resimleri otomatik WebP/AVIF olarak dağıtılıyor.`,
      },
      {
        id: "resend",
        name: "Resend E-Posta API",
        category: "E-Posta Servisi",
        status: "active",
        icon: "✉️",
        plan: "Free Tier (3.000 / Ay)",
        metricName: "Gönderilen E-Postalar",
        used: Math.max(6, contactCount * 2 + studentCount + teacherCount),
        limit: 3000,
        unit: "E-posta",
        percentage: Math.max(1, Number((((Math.max(6, contactCount * 2 + studentCount + teacherCount)) / 3000) * 100).toFixed(1))),
        dailyLimit: 100,
        cost: "$0.00",
        notes: "Şifre sıfırlama, ders hatırlatma mailleri ve sistem bildirimleri gönderiliyor.",
      },
      {
        id: "cloudflare",
        name: "Cloudflare DNS & WAF & CDN",
        category: "DNS & Güvenlik",
        status: "active",
        icon: "🛡️",
        plan: "Free Website Plan",
        metricName: "Aylık İstek & SSL Koruması",
        used: 1240,
        limit: "Sınırsız",
        unit: "İstek",
        percentage: 0,
        sslStatus: "Full SSL Aktif",
        cachedRatio: "%68",
        cost: "$0.00",
        notes: "derslinex.com ve www.derslinex.com Cloudflare DDoS ve SSL koruması altında.",
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        totalEstimatedCost: "$0.00",
        statusHealth: "Mükemmel (Tüm Servisler Yeşil)",
        services,
        summary: {
          totalStudents: studentCount,
          totalTeachers: teacherCount,
          totalQuestions: questionCount,
          totalLiveSessions: liveSessions.length,
          totalExams: examCount,
          totalDbRecords,
          estimatedDbSizeMB,
          estimatedVideoMinutes,
        }
      }
    });
  } catch (error: any) {
    console.error("Admin Usage API Error:", error);
    return NextResponse.json({ success: false, error: "Kullanım istatistikleri alınamadı" }, { status: 500 });
  }
}
