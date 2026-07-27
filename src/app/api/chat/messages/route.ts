import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Fetch messages in a chat room
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomIdStr = searchParams.get("roomId");

    if (!roomIdStr) {
      return NextResponse.json({ success: false, error: "roomId gereklidir" }, { status: 400 });
    }

    const roomId = parseInt(roomIdStr);
    const messages = await prisma.chatMessage.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Messages GET Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST: Send a message in a chat room
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomId, senderId, senderRole, content } = body;

    if (!roomId || !senderId || !senderRole || !content) {
      return NextResponse.json({ success: false, error: "Eksik parametre" }, { status: 400 });
    }

    const message = await prisma.chatMessage.create({
      data: {
        roomId: parseInt(roomId),
        senderId: parseInt(senderId),
        senderRole,
        content,
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Messages POST Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
