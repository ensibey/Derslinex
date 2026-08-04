import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminAuth } from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const authError = verifyAdminAuth(request);
    if (authError) return authError;

    // Check or create test teacher
    let teacher = await prisma.teacher.findFirst({ where: { email: "ahmet.hoca@derslinex.com" } });
    if (!teacher) {
      teacher = await prisma.teacher.create({
        data: {
          name: "Ahmet Yılmaz",
          email: "ahmet.hoca@derslinex.com",
          phone: "05551112233",
          password: "scrypt_or_bcrypt_hash",
          branch: "Matematik",
          status: "İletişime Geçildi",
          points: 120,
        },
      });
    }

    // Seed test exam
    const existingExam = await prisma.exam.findFirst({ where: { title: "2026 TYT Genel Deneme Sınavı #1" } });
    let exam = existingExam;
    if (!exam) {
      const startTime = new Date(Date.now() - 30 * 60_000);
      const endTime = new Date(Date.now() + 180 * 60_000);
      exam = await prisma.exam.create({
        data: {
          title: "2026 TYT Genel Deneme Sınavı #1",
          description: "ÖSYM standartlarında hazırlanan 125 dakikalık kamera gözetmenli Türkiye geneli deneme.",
          examType: "TYT",
          targetTag: "TÜMÜ",
          startTime,
          endTime,
          durationMinutes: 125,
          status: "PUBLISHED",
          isCameraRequired: true,
        },
      });

      // Seed 3 questions
      const q1 = await prisma.question.create({
        data: {
          teacherId: teacher.id,
          subject: "Matematik",
          examType: "TYT",
          topic: "Üslü Sayılar",
          difficulty: "Orta",
          questionText: "2^x + 2^(x+1) = 24 olduğuna göre x kaçtır?",
          optionA: "2",
          optionB: "3",
          optionC: "4",
          optionD: "5",
          optionE: "6",
          correctOption: "B",
          points: 20,
          status: "APPROVED",
        },
      });

      const q2 = await prisma.question.create({
        data: {
          teacherId: teacher.id,
          subject: "Türkçe",
          examType: "TYT",
          topic: "Paragrafta Ana Düşünce",
          difficulty: "Kolay",
          questionText: "Aşağıdaki cümlelerin hangisinde yazım hatası bulunmamaktadır?",
          optionA: "Herşey çok güzel olacak.",
          optionB: "Bugün de okula gelemedi.",
          optionC: "Yanlış şeyler düşünüyor.",
          optionD: "Bana birşey söylemedi.",
          optionE: "Hiç bir zaman pes etme.",
          correctOption: "C",
          points: 20,
          status: "APPROVED",
        },
      });

      await prisma.examQuestion.createMany({
        data: [
          { examId: exam.id, questionId: q1.id, orderNo: 1, sectionName: "Temel Matematik" },
          { examId: exam.id, questionId: q2.id, orderNo: 2, sectionName: "Türkçe" },
        ],
      });
    }

    return NextResponse.json({
      success: true,
      message: "Test verileri (örnek deneme sınavı ve sorular) başarıyla veritabanına eklendi.",
      examId: exam.id,
    });
  } catch (error) {
    console.error("Admin Seed Error:", error);
    return NextResponse.json({ success: false, error: "Seed işlemi sırasında hata oluştu." }, { status: 500 });
  }
}
