import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// GET: get feedbacks (filtered by teacherId if provided; public sees only APPROVED, admin sees all)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get("teacherId");
    const includeAll = searchParams.get("includeAll") === "true";

    const isAdmin = verifyAdminAuth(request) === null;

    const whereClause: any = {};

    if (teacherId) {
      whereClause.teacherId = parseInt(teacherId);
    }

    // Only admins requesting includeAll get non-APPROVED feedbacks
    if (!isAdmin || !includeAll) {
      whereClause.status = "APPROVED";
    }

    const feedbacks = await prisma.feedback.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, feedbacks });
  } catch (error) {
    console.error("Görüş GET Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST: submit a feedback/gorus (defaults to PENDING for admin approval)
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`gorus-submit-${ip}`, 5, 60_000);
    if (!rateLimit.success) {
      return NextResponse.json({ success: false, error: "Çok fazla görüş gönderdiniz. Lütfen bekleyin." }, { status: 429 });
    }

    const body = await request.json();
    const { studentName, studentEmail, teacherId, teacherName, content, rating } = body;

    if (!studentName || !teacherId || !teacherName || !content) {
      return NextResponse.json({ success: false, error: "Eksik alanlar var" }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        studentName,
        studentEmail: studentEmail || null,
        teacherId: parseInt(teacherId),
        teacherName,
        content,
        rating: rating ? parseInt(rating) : 5,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      feedback,
      message: "Görüş ve puanlamanız alındı! Yönetici onayının ardından öğretmen profilinde yayınlanacaktır.",
    });
  } catch (error) {
    console.error("Görüş POST Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// PUT: approve or reject feedback/gorus (admin only)
export async function PUT(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status || !["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json({ success: false, error: "Geçersiz parametreler." }, { status: 400 });
    }

    const updated = await prisma.feedback.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    return NextResponse.json({ success: true, feedback: updated });
  } catch (error) {
    console.error("Görüş PUT Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// DELETE: delete a feedback/gorus (admin only)
export async function DELETE(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");

    if (!idStr) {
      return NextResponse.json({ success: false, error: "Görüş ID gereklidir" }, { status: 400 });
    }

    await prisma.feedback.delete({
      where: { id: parseInt(idStr) },
    });

    return NextResponse.json({ success: true, message: "Görüş/Randevu talebi başarıyla kaldırıldı." });
  } catch (error) {
    console.error("Görüş DELETE Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}


