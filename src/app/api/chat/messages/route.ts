import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getAuthUser } from "@/lib/auth-middleware";

// GET: Fetch messages in a chat room
export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const roomIdStr = searchParams.get("roomId");
    const requesterIdStr = searchParams.get("userId") || request.headers.get("x-user-id");

    if (!roomIdStr) {
      return NextResponse.json({ success: false, error: "roomId gereklidir" }, { status: 400 });
    }

    const roomId = parseInt(roomIdStr);
    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json({ success: false, error: "Sohbet odası bulunamadı" }, { status: 404 });
    }

    // Verify membership: caller must be room student, teacher, or admin
    const currentUserId = authUser ? authUser.id : (requesterIdStr ? parseInt(requesterIdStr) : null);
    if (!currentUserId) {
      return NextResponse.json({ success: false, error: "Sohbet mesajlarını görmek için oturum açmalısınız." }, { status: 401 });
    }

    if (room.studentId !== currentUserId && room.teacherId !== currentUserId) {
      return NextResponse.json({ success: false, error: "Bu sohbet odasına erişim yetkiniz yok" }, { status: 403 });
    }

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
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`chat-msg-${ip}`, 20, 60_000);
    if (!rateLimit.success) {
      return NextResponse.json({ success: false, error: "Çok hızlı mesaj gönderiyorsunuz. Lütfen bekleyin." }, { status: 429 });
    }

    const body = await request.json();
    const { roomId, senderId, senderRole, content } = body;

    if (!roomId || !senderId || !senderRole || !content) {
      return NextResponse.json({ success: false, error: "Eksik parametre" }, { status: 400 });
    }

    const parsedRoomId = parseInt(roomId);
    const parsedSenderId = parseInt(senderId);

    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ success: false, error: "Mesaj içeriği boş olamaz" }, { status: 400 });
    }

    if (content.length > 2000) {
      return NextResponse.json({ success: false, error: "Mesaj en fazla 2000 karakter olabilir" }, { status: 400 });
    }

    const room = await prisma.chatRoom.findUnique({
      where: { id: parsedRoomId },
    });

    if (!room) {
      return NextResponse.json({ success: false, error: "Sohbet odası bulunamadı" }, { status: 404 });
    }

    // Verify sender belongs to room
    const isStudentSender = senderRole === "student" && room.studentId === parsedSenderId;
    const isTeacherSender = senderRole === "teacher" && room.teacherId === parsedSenderId;

    if (!isStudentSender && !isTeacherSender) {
      return NextResponse.json({ success: false, error: "Bu odaya mesaj gönderme yetkiniz yok" }, { status: 403 });
    }

    const message = await prisma.chatMessage.create({
      data: {
        roomId: parsedRoomId,
        senderId: parsedSenderId,
        senderRole,
        content: content.trim(),
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Messages POST Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
