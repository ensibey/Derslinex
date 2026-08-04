import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { getAuthUser } from "@/lib/auth-middleware";

// GET: get student profile by email (or all if admin)
export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      // Require admin auth to list all students
      const adminErr = verifyAdminAuth(request);
      if (adminErr) {
        return NextResponse.json({ success: false, error: "Tüm kullanıcıları listelemek için admin yetkisi gereklidir." }, { status: 401 });
      }

      const students = await prisma.student.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          avatar: true,
          targetTag: true,
          status: true,
          isBanned: true,
          createdAt: true,
        },
      });
      return NextResponse.json({ success: true, students });
    }

    if (!authUser) {
      return NextResponse.json({ success: false, error: "Profil bilgilerini görmek için oturum açmalısınız." }, { status: 401 });
    }

    if (authUser.role === "student" && authUser.email !== email) {
      return NextResponse.json({ success: false, error: "Başka bir öğrencinin profil bilgilerine erişim yetkiniz yok." }, { status: 403 });
    }

    const student = await prisma.student.findFirst({
      where: { email },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        avatar: true,
        targetTag: true,
        status: true,
        isBanned: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error("Öğrenci GET Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST: update student profile
export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim. Oturum açmanız gerekmektedir." }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, email, avatar, targetTag } = body;

    if (!name || !phone || !email) {
      return NextResponse.json({ success: false, error: "Tüm alanlar zorunludur" }, { status: 400 });
    }

    // Only allow user to update their own profile
    if (authUser.role === "student" && authUser.email !== email) {
      return NextResponse.json({ success: false, error: "Başka bir kullanıcının profilini değiştirme yetkiniz yok." }, { status: 403 });
    }

    const existing = await prisma.student.findFirst({
      where: { email },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Öğrenci bulunamadı" }, { status: 404 });
    }

    const student = await prisma.student.update({
      where: { id: existing.id },
      data: { name, phone, avatar, targetTag },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        avatar: true,
        targetTag: true,
        status: true,
        isBanned: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error("Öğrenci POST Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
