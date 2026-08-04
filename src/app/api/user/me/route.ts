import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Oturum açılmamış." },
        { status: 401 }
      );
    }

    if (authUser.role === "student") {
      const student = await prisma.student.findUnique({
        where: { id: authUser.id },
      });

      if (!student || student.isBanned) {
        return NextResponse.json(
          { success: false, error: "Kullanıcı bulunamadı veya hesabı askıya alınmış." },
          { status: 403 }
        );
      }

      const { password: _, ...studentWithoutPassword } = student;
      return NextResponse.json({
        success: true,
        role: "student",
        user: studentWithoutPassword,
      });
    } else if (authUser.role === "teacher") {
      const teacher = await prisma.teacher.findUnique({
        where: { id: authUser.id },
      });

      if (!teacher || teacher.isBanned) {
        return NextResponse.json(
          { success: false, error: "Kullanıcı bulunamadı veya hesabı askıya alınmış." },
          { status: 403 }
        );
      }

      const { password: _, ...teacherWithoutPassword } = teacher;
      return NextResponse.json({
        success: true,
        role: "teacher",
        user: teacherWithoutPassword,
      });
    }

    return NextResponse.json(
      { success: false, error: "Geçersiz rol." },
      { status: 400 }
    );
  } catch (error) {
    console.error("User Me Verification Error:", error);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası." },
      { status: 500 }
    );
  }
}
