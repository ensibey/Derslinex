import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

// GET /api/chat/stream?roomId=123
export async function GET(request: Request) {
  const authUser = await getAuthUser(request);
  if (!authUser) {
    return NextResponse.json(
      { success: false, error: "Sohbet yayınını izlemek için oturum açmalısınız." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const roomIdStr = searchParams.get("roomId");
  const roomId = parseInt(roomIdStr || "0");

  if (!roomId || isNaN(roomId)) {
    return NextResponse.json({ success: false, error: "Geçersiz roomId zorunludur." }, { status: 400 });
  }

  // Verify membership: caller must be room student or teacher
  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    return NextResponse.json({ success: false, error: "Sohbet odası bulunamadı." }, { status: 404 });
  }

  const isStudentMember = authUser.role === "student" && room.studentId === authUser.id;
  const isTeacherMember = authUser.role === "teacher" && room.teacherId === authUser.id;

  if (!isStudentMember && !isTeacherMember) {
    return NextResponse.json(
      { success: false, error: "Bu sohbet odasına erişim yetkiniz yok." },
      { status: 403 }
    );
  }

  let lastMessageId = 0;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Initial check
      try {
        const messages = await prisma.chatMessage.findMany({
          where: { roomId },
          orderBy: { createdAt: "asc" },
          take: 50,
        });

        if (messages.length > 0) {
          lastMessageId = messages[messages.length - 1].id;
          sendEvent({ type: "INIT", messages });
        }
      } catch (err) {
        console.error("SSE stream init error:", err);
      }

      // Interval polling loop pushing new messages
      const interval = setInterval(async () => {
        try {
          const newMessages = await prisma.chatMessage.findMany({
            where: {
              roomId,
              id: { gt: lastMessageId },
            },
            orderBy: { createdAt: "asc" },
          });

          if (newMessages.length > 0) {
            lastMessageId = newMessages[newMessages.length - 1].id;
            sendEvent({ type: "NEW_MESSAGES", messages: newMessages });
          }
        } catch (e) {
          // ignore loop errors
        }
      }, 1000); // 1 second real-time push

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
