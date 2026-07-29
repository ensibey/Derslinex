import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

// GET /api/student/trials - fetch trial net results
export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== "student") {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim" }, { status: 401 });
    }

    const trials = await prisma.studentTrialResult.findMany({
      where: { studentId: authUser.id },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ success: true, trials });
  } catch (error) {
    console.error("Student Trials GET Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST /api/student/trials - create or save trial net result
export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== "student") {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const { title, examType, turkceNet, sosyalNet, matematikNet, fenNet } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: "Deneme adı zorunludur" }, { status: 400 });
    }

    const tNet = Number(turkceNet) || 0;
    const sNet = Number(sosyalNet) || 0;
    const mNet = Number(matematikNet) || 0;
    const fNet = Number(fenNet) || 0;
    const toplamNet = tNet + sNet + mNet + fNet;

    const trial = await prisma.studentTrialResult.create({
      data: {
        studentId: authUser.id,
        title,
        examType: examType || "TYT",
        turkceNet: tNet,
        sosyalNet: sNet,
        matematikNet: mNet,
        fenNet: fNet,
        toplamNet,
      },
    });

    return NextResponse.json({ success: true, trial });
  } catch (error) {
    console.error("Student Trials POST Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// DELETE /api/student/trials?id=123
export async function DELETE(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== "student") {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");
    if (!idStr) {
      return NextResponse.json({ success: false, error: "ID gereklidir" }, { status: 400 });
    }

    await prisma.studentTrialResult.delete({
      where: { id: parseInt(idStr) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Student Trials DELETE Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
