import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Fetch all blog posts in database
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Admin Blogs GET Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// DELETE: Delete a blog post
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");

    if (!idStr) {
      return NextResponse.json({ success: false, error: "Blog ID gereklidir" }, { status: 400 });
    }

    await prisma.blogPost.delete({
      where: { id: parseInt(idStr) },
    });

    return NextResponse.json({ success: true, message: "Blog yazısı başarıyla silindi." });
  } catch (error) {
    console.error("Admin Blogs DELETE Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
