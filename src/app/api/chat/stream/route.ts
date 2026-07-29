import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/chat/stream?roomId=123
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomIdStr = searchParams.get("roomId");
  const roomId = parseInt(roomIdStr || "0");

  if (!roomId) {
    return NextResponse.json({ success: false, error: "roomId zorunludur." }, { status: 400 });
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
