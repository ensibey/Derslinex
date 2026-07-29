import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

const teacherSelectFields = {
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
  linkedin: true,
  youtube: true,
  createdAt: true,
};

// GET: get teacher profile by email or all teachers
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      // Return all teachers ordered by points (highest first) then createdAt
      const teachers = await prisma.teacher.findMany({
        orderBy: [{ points: "desc" }, { createdAt: "desc" }],
        select: teacherSelectFields,
      });
      return NextResponse.json({ success: true, teachers });
    }

    const teacher = await prisma.teacher.findFirst({
      where: { email },
      select: teacherSelectFields,
    });

    return NextResponse.json({ success: true, teacher });
  } catch (error) {
    console.error("Öğretmen GET Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST: create or update teacher profile
export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim. Oturum açmanız gerekmektedir." }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, email, branch, egitim, ozgecmis, linkedin, youtube, avatar } = body;

    if (!name || !phone || !email || !branch) {
      return NextResponse.json({ success: false, error: "Tüm alanlar zorunludur" }, { status: 400 });
    }

    if (authUser.role === "teacher" && authUser.email !== email) {
      return NextResponse.json({ success: false, error: "Başka bir öğretmenin profilini güncelleme yetkiniz yok." }, { status: 403 });
    }

    const existing = await prisma.teacher.findFirst({
      where: { email },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Öğretmen bulunamadı" }, { status: 404 });
    }

    const teacher = await prisma.teacher.update({
      where: { id: existing.id },
      data: { name, phone, branch, egitim, ozgecmis, linkedin, youtube, avatar },
      select: teacherSelectFields,
    });

    return NextResponse.json({ success: true, teacher });
  } catch (error) {
    console.error("Öğretmen POST Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
