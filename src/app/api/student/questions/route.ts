import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/student/questions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject");
    const examType = searchParams.get("examType");
    const difficulty = searchParams.get("difficulty");
    const topic = searchParams.get("topic");

    let whereClause: any = {
      status: "APPROVED",
    };

    if (subject && subject !== "tumu") {
      whereClause.subject = { equals: subject, mode: "insensitive" };
    }
    if (examType && examType !== "tumu") {
      whereClause.examType = examType;
    }
    if (difficulty && difficulty !== "tumu") {
      whereClause.difficulty = difficulty;
    }
    if (topic && topic.trim()) {
      whereClause.topic = { contains: topic, mode: "insensitive" };
    }

    const questions = await prisma.question.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        subject: true,
        examType: true,
        topic: true,
        difficulty: true,
        questionText: true,
        imageUrl: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        optionE: true,
        correctOption: true,
        solutionText: true,
        teacher: {
          select: {
            name: true,
            branch: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error("Student Questions GET Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
