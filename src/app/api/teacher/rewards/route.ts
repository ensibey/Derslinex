import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

// GET /api/teacher/rewards?teacherId=123
export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const teacherIdStr = searchParams.get("teacherId");
    let teacherId = teacherIdStr ? parseInt(teacherIdStr) : (authUser?.role === "teacher" ? authUser.id : 0);

    if (!teacherId && authUser?.role === "teacher") {
      teacherId = authUser.id;
    }

    if (!teacherId || isNaN(teacherId)) {
      return NextResponse.json({ success: false, error: "Geçersiz öğretmen ID" }, { status: 400 });
    }

    if (authUser && authUser.role === "teacher" && authUser.id !== teacherId) {
      return NextResponse.json({ success: false, error: "Başka bir öğretmenin ödüllerine erişim yetkiniz yok." }, { status: 403 });
    }

    const [teacher, questionsCount, sessionsCount, resourcesCount, faqsCount] = await Promise.all([
      prisma.teacher.findUnique({ where: { id: teacherId } }),
      prisma.question.count({ where: { teacherId } }),
      prisma.liveSession.count({ where: { teacherId } }),
      prisma.sessionResource.count({ where: { session: { teacherId } } }),
      prisma.teacherFAQ.count({ where: { teacherId } }),
    ]);

    if (!teacher) {
      return NextResponse.json({ success: false, error: "Öğretmen bulunamadı" }, { status: 404 });
    }

    // Points calculation
    const points = sessionsCount * 50 + questionsCount * 30 + resourcesCount * 20 + faqsCount * 10;

    // Teacher Badges
    const badges = [
      {
        id: "master_educator",
        name: "Üstat Eğitmen",
        icon: "🎓",
        description: "En az 3 canlı ders oluşturdu ve yönetti",
        unlocked: sessionsCount >= 3,
      },
      {
        id: "question_architect",
        name: "Soru Mimarı",
        icon: "📚",
        description: "Soru bankasına en az 3 özgün soru ekledi",
        unlocked: questionsCount >= 3,
      },
      {
        id: "resource_hero",
        name: "Kaynak Hazinesi",
        icon: "📎",
        description: "Öğrencilere canlı ders materyalleri (PDF) yükledi",
        unlocked: resourcesCount >= 1,
      },
      {
        id: "community_guide",
        name: "Rehber Öğretmen",
        icon: "🌟",
        description: "Profilinde Sıkça Sorulan Sorular ekledi",
        unlocked: faqsCount >= 1,
      },
    ];

    return NextResponse.json({
      success: true,
      stats: {
        points,
        sessionsCount,
        questionsCount,
        resourcesCount,
        faqsCount,
        unlockedBadgeCount: badges.filter((b) => b.unlocked).length,
      },
      badges,
    });
  } catch (error) {
    console.error("Teacher rewards GET error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
