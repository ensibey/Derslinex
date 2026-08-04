import { NextResponse } from "next/server";

// Memory cache for active live session whiteboards
interface WhiteboardState {
  imageData: string | null;
  isOpen: boolean;
  updatedAt: number;
  lastDrawer: string;
}

const whiteboardStore = new Map<string, WhiteboardState>();

// GET /api/sessions/[sessionId]/whiteboard
export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  if (!sessionId) {
    return NextResponse.json({ success: false, error: "sessionId zorunludur." }, { status: 400 });
  }

  const state = whiteboardStore.get(sessionId) || {
    imageData: null,
    isOpen: false,
    updatedAt: Date.now(),
    lastDrawer: "Sistem",
  };

  return NextResponse.json({
    success: true,
    imageData: state.imageData,
    isOpen: state.isOpen,
    updatedAt: state.updatedAt,
    lastDrawer: state.lastDrawer,
  });
}

// POST /api/sessions/[sessionId]/whiteboard
export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  if (!sessionId) {
    return NextResponse.json({ success: false, error: "sessionId zorunludur." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { imageData, isOpen, drawerName } = body;

    const currentState = whiteboardStore.get(sessionId) || {
      imageData: null,
      isOpen: false,
      updatedAt: Date.now(),
      lastDrawer: "Sistem",
    };

    const newState: WhiteboardState = {
      imageData: imageData !== undefined ? imageData : currentState.imageData,
      isOpen: isOpen !== undefined ? isOpen : currentState.isOpen,
      updatedAt: Date.now(),
      lastDrawer: drawerName || currentState.lastDrawer || "Kullanıcı",
    };

    whiteboardStore.set(sessionId, newState);

    return NextResponse.json({
      success: true,
      updatedAt: newState.updatedAt,
    });
  } catch {
    return NextResponse.json({ success: false, error: "İşlem sırasında hata oluştu." }, { status: 500 });
  }
}
