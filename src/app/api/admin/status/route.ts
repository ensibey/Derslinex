import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST: update student or teacher status (e.g. "Beklemede", "İletişime Geçildi")
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, role, status } = body;

    if (!id || !role || !status) {
      return NextResponse.json({ success: false, error: "Eksik parametreler" }, { status: 400 });
    }

    let updated;
    if (role === "student") {
      updated = await prisma.student.update({
        where: { id: parseInt(id) },
        data: { status },
      });
    } else if (role === "teacher") {
      updated = await prisma.teacher.update({
        where: { id: parseInt(id) },
        data: { status },
      });
    } else {
      return NextResponse.json({ success: false, error: "Geçersiz rol" }, { status: 400 });
    }

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("Admin Status Update Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
