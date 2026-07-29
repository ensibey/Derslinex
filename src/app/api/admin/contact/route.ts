import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminAuth } from "@/lib/adminAuth";

// GET: List all contact messages
export async function GET(request: Request) {
  const authErr = verifyAdminAuth(request);
  if (authErr) return authErr;

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Admin Contact GET Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// PATCH: Mark message as read/replied
export async function PATCH(request: Request) {
  const authErr = verifyAdminAuth(request);
  if (authErr) return authErr;

  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Eksik parametre" }, { status: 400 });
    }

    const message = await prisma.contactMessage.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Admin Contact PATCH Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// DELETE: Delete contact message
export async function DELETE(request: Request) {
  const authErr = verifyAdminAuth(request);
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");
    if (!idStr) {
      return NextResponse.json({ success: false, error: "ID gereklidir" }, { status: 400 });
    }

    await prisma.contactMessage.delete({
      where: { id: parseInt(idStr) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Contact DELETE Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
