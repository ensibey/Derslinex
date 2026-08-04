import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getAuthUser } from "@/lib/auth-middleware";

// GET: Fetch messages in a chat room
export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Sohbet mesajlarını görmek için oturum açmalısınız." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const roomIdStr = searchParams.get("roomId");

    if (!roomIdStr) {
      return NextResponse.json({ success: false, error: "roomId gereklidir" }, { status: 400 });
    }

    const roomId = parseInt(roomIdStr);
    if (isNaN(roomId)) {
      return NextResponse.json({ success: false, error: "Geçersiz oda ID" }, { status: 400 });
    }

    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json({ success: false, error: "Sohbet odası bulunamadı" }, { status: 404 });
    }

    // Verify membership: caller must be room student or teacher
    const currentUserId = authUser.id;
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
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Mesaj göndermek için oturum açmalısınız." }, { status: 401 });
    }

    if (authUser.role === "student") {
      const student = await prisma.student.findUnique({ where: { id: authUser.id } });
      if (student?.isBanned) {
        return NextResponse.json({ success: false, error: "Hesabınız engellenmiştir. Mesaj gönderemezsiniz." }, { status: 403 });
      }
    } else if (authUser.role === "teacher") {
      const teacher = await prisma.teacher.findUnique({ where: { id: authUser.id } });
      if (teacher?.isBanned) {
        return NextResponse.json({ success: false, error: "Hesabınız engellenmiştir. Mesaj gönderemezsiniz." }, { status: 403 });
      }
    }

    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`chat-msg-${ip}`, 20, 60_000);
    if (!rateLimit.success) {
      return NextResponse.json({ success: false, error: "Çok hızlı mesaj gönderiyorsunuz. Lütfen bekleyin." }, { status: 429 });
    }

    const body = await request.json();
    const { roomId, content } = body;

    if (!roomId || !content) {
      return NextResponse.json({ success: false, error: "Eksik parametre" }, { status: 400 });
    }

    const parsedRoomId = parseInt(roomId);
    if (isNaN(parsedRoomId)) {
      return NextResponse.json({ success: false, error: "Geçersiz oda ID" }, { status: 400 });
    }

    const senderId = authUser.id;
    const senderRole = authUser.role;

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
    const isStudentSender = senderRole === "student" && room.studentId === senderId;
    const isTeacherSender = senderRole === "teacher" && room.teacherId === senderId;

    if (!isStudentSender && !isTeacherSender) {
      return NextResponse.json({ success: false, error: "Bu odaya mesaj gönderme yetkiniz yok" }, { status: 403 });
    }

    const message = await prisma.chatMessage.create({
      data: {
        roomId: parsedRoomId,
        senderId,
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
