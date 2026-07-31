import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminAuth } from "@/lib/adminAuth";

// GET: Fetch all students & teachers for admin panel
export async function GET(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        avatar: true,
        status: true,
        isBanned: true,
        createdAt: true,
      },
    });

    const teachers = await prisma.teacher.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        branch: true,
        egitim: true,
        ozgecmis: true,
        avatar: true,
        status: true,
        isBanned: true,
        points: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, students, teachers });
  } catch (error) {
    console.error("Admin Users GET Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// PUT: Update status or ban toggle
export async function PUT(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, type, role, action, value } = body;

    const userRole = type || role;
    const userId = parseInt(id);

    if (!userId || !userRole || !action) {
      return NextResponse.json({ success: false, error: "Eksik parametreler" }, { status: 400 });
    }

    if (userRole === "student") {
      if (action === "status") {
        await prisma.student.update({
          where: { id: userId },
          data: { status: value },
        });
      } else if (action === "ban") {
        await prisma.student.update({
          where: { id: userId },
          data: { isBanned: Boolean(value) },
        });
      }
    } else if (userRole === "teacher") {
      if (action === "status") {
        await prisma.teacher.update({
          where: { id: userId },
          data: { status: value },
        });
      } else if (action === "ban") {
        await prisma.teacher.update({
          where: { id: userId },
          data: { isBanned: Boolean(value) },
        });
      }
    } else {
      return NextResponse.json({ success: false, error: "Geçersiz rol" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Kullanıcı başarıyla güncellendi." });
  } catch (error) {
    console.error("Admin Users PUT Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST: Ban/unban user
export async function POST(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, role, type, action, value } = body;

    const userRole = type || role;
    const userId = parseInt(id);

    if (!userId || !userRole) {
      return NextResponse.json({ success: false, error: "Eksik parametre" }, { status: 400 });
    }

    const setBanned = action === "ban" ? Boolean(value) : true;

    if (userRole === "student") {
      await prisma.student.update({
        where: { id: userId },
        data: { isBanned: setBanned },
      });
    } else if (userRole === "teacher") {
      await prisma.teacher.update({
        where: { id: userId },
        data: { isBanned: setBanned },
      });
    } else {
      return NextResponse.json({ success: false, error: "Geçersiz rol" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Kullanıcı engeli ${setBanned ? "etkinleştirildi" : "kaldırıldı"}.` });
  } catch (error) {
    console.error("Admin Users POST Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// DELETE: Delete user completely
export async function DELETE(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");
    const role = searchParams.get("role");

    if (!idStr || !role) {
      return NextResponse.json({ success: false, error: "Parametreler eksik" }, { status: 400 });
    }

    const userId = parseInt(idStr);

    if (role === "student") {
      const student = await prisma.student.findUnique({ where: { id: userId } });
      if (student) {
        if (student.email) {
          await prisma.feedback.deleteMany({ where: { studentEmail: student.email } }).catch(() => {});
        }
        await prisma.sessionParticipant.deleteMany({ where: { studentId: userId } }).catch(() => {});
        await prisma.sessionFeedback.deleteMany({ where: { studentId: userId } }).catch(() => {});
        await prisma.studentQuestionAttempt.deleteMany({ where: { studentId: userId } }).catch(() => {});
        await prisma.studentQuizResult.deleteMany({ where: { studentId: userId } }).catch(() => {});
        await prisma.studentTrialResult.deleteMany({ where: { studentId: userId } }).catch(() => {});
        await prisma.studentTopicProgress.deleteMany({ where: { studentId: userId } }).catch(() => {});
        await prisma.chatRoom.deleteMany({ where: { studentId: userId } }).catch(() => {});
        await prisma.chatMessage.deleteMany({ where: { senderRole: "student", senderId: userId } }).catch(() => {});
        
        await prisma.student.delete({
          where: { id: userId },
        });
      }
    } else if (role === "teacher") {
      await prisma.lessonOffer.deleteMany({ where: { teacherId: userId } }).catch(() => {});
      await prisma.blogPost.deleteMany({ where: { authorId: userId } }).catch(() => {});
      await prisma.feedback.deleteMany({ where: { teacherId: userId } }).catch(() => {});
      await prisma.teacherTask.deleteMany({ where: { teacherId: userId } }).catch(() => {});
      await prisma.question.deleteMany({ where: { teacherId: userId } }).catch(() => {});
      await prisma.teacherFAQ.deleteMany({ where: { teacherId: userId } }).catch(() => {});
      await prisma.sessionFeedback.deleteMany({ where: { teacherId: userId } }).catch(() => {});
      await prisma.liveSession.deleteMany({ where: { teacherId: userId } }).catch(() => {});
      await prisma.chatRoom.deleteMany({ where: { teacherId: userId } }).catch(() => {});
      await prisma.chatMessage.deleteMany({ where: { senderRole: "teacher", senderId: userId } }).catch(() => {});

      await prisma.teacher.delete({
        where: { id: userId },
      });
    } else {
      return NextResponse.json({ success: false, error: "Geçersiz rol" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Kullanıcı başarıyla silindi." });
  } catch (error) {
    console.error("Admin Users DELETE Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
