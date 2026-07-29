import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

// GET /api/sessions/[sessionId]/resources
export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId: rawId } = await params;
    const sessionId = parseInt(rawId);
    const resources = await prisma.sessionResource.findMany({
      where: { sessionId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, resources });
  } catch (error) {
    console.error("Session Resource GET Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST /api/sessions/[sessionId]/resources
export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== "teacher") {
      return NextResponse.json({ success: false, error: "Yalnızca öğretmenler materyal ekleyebilir." }, { status: 403 });
    }

    const { sessionId: rawId } = await params;
    const sessionId = parseInt(rawId);
    const { title, fileUrl } = await request.json();

    if (!title || !fileUrl) {
      return NextResponse.json({ success: false, error: "Materyal başlığı ve dosya bağlantısı zorunludur." }, { status: 400 });
    }

    const session = await prisma.liveSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.teacherId !== authUser.id) {
      return NextResponse.json({ success: false, error: "Ders bulunamadı veya yetkiniz yok." }, { status: 403 });
    }

    const resource = await prisma.sessionResource.create({
      data: {
        sessionId,
        title,
        fileUrl,
      },
    });

    return NextResponse.json({ success: true, resource });
  } catch (error) {
    console.error("Session Resource POST Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// DELETE /api/sessions/[sessionId]/resources?resourceId=123
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== "teacher") {
      return NextResponse.json({ success: false, error: "Yalnızca öğretmenler materyal silebilir." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const resourceIdStr = searchParams.get("resourceId");

    if (!resourceIdStr) {
      return NextResponse.json({ success: false, error: "Materyal ID gereklidir." }, { status: 400 });
    }

    await prisma.sessionResource.delete({
      where: { id: parseInt(resourceIdStr) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session Resource DELETE Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
