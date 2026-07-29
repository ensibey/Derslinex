import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

// GET /api/student/leaderboard
export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);

    // Fetch all active students
    const students = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        avatar: true,
        createdAt: true,
      },
    });

    const [allQuizResults, allTrialResults] = await Promise.all([
      prisma.studentQuizResult.findMany({
        select: {
          studentId: true,
          netScore: true,
          totalPoints: true,
          totalQuestions: true,
          createdAt: true,
        },
      }),
      prisma.studentTrialResult.findMany({
        select: {
          studentId: true,
          toplamNet: true,
          matematikNet: true,
          turkceNet: true,
          date: true,
        },
      }),
    ]);

    const leaderboard = students.map((s) => {
      const myQuizzes = allQuizResults.filter((q) => q.studentId === s.id);
      const myTrials = allTrialResults.filter((t) => t.studentId === s.id);

      const quizCount = myQuizzes.length;
      const trialCount = myTrials.length;
      const quizPoints = myQuizzes.reduce((acc, q) => acc + (q.totalPoints || 0), 0);

      // Max trial net
      const maxTrialNet = myTrials.length > 0 ? Math.max(...myTrials.map((t) => t.toplamNet)) : 0;
      const maxMathNet = myTrials.length > 0 ? Math.max(...myTrials.map((t) => t.matematikNet)) : 0;

      // Total Gamification Points = (Quiz Points) + (Trial Net * 10) + (Test Count * 20)
      const totalScore = Math.round(quizPoints + maxTrialNet * 10 + (quizCount + trialCount) * 20);

      // Badges dynamic calculation
      const badges = [
        {
          id: "mat_genius",
          name: "Matematik Dehası",
          icon: "🧠",
          description: "Denemede 25+ Matematik Neti yaptı",
          unlocked: maxMathNet >= 25,
        },
        {
          id: "net_monster",
          name: "Net Canavarı",
          icon: "🎯",
          description: "Denemede 50+ Toplam Net elde etti",
          unlocked: maxTrialNet >= 50,
        },
        {
          id: "speed_solver",
          name: "Seri Çözücü",
          icon: "⚡",
          description: "En az 3 test veya deneme sınavı tamamladı",
          unlocked: quizCount + trialCount >= 3,
        },
        {
          id: "night_owl",
          name: "Gece Kuşu",
          icon: "🦉",
          description: "Gece saatlerinde soru çözdü ve aktif çalıştı",
          unlocked: myQuizzes.some((q) => {
            const hour = new Date(q.createdAt).getHours();
            return hour >= 22 || hour <= 4;
          }) || quizCount > 0,
        },
        {
          id: "champ",
          name: "Haftanın Şampiyonu",
          icon: "🥇",
          description: "Liderlik tablosunda üst sıralara tırmandı",
          unlocked: totalScore >= 100,
        },
      ];

      return {
        id: s.id,
        name: s.name,
        avatar: s.avatar || null,
        totalScore,
        quizCount,
        trialCount,
        maxTrialNet,
        badges,
        unlockedBadgeCount: badges.filter((b) => b.unlocked).length,
      };
    });

    // Sort leaderboard by totalScore descending
    leaderboard.sort((a, b) => b.totalScore - a.totalScore);

    // Add rank
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    return NextResponse.json({
      success: true,
      leaderboard: rankedLeaderboard,
      currentUserId: authUser?.role === "student" ? authUser.id : null,
    });
  } catch (error) {
    console.error("Leaderboard GET error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
