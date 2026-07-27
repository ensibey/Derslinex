import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Helper function to generate safe slug
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

// GET: Fetch blog posts written by a specific teacher
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const authorIdStr = searchParams.get("authorId");

    if (!authorIdStr) {
      return NextResponse.json({ success: false, error: "authorId gereklidir" }, { status: 400 });
    }

    const authorId = parseInt(authorIdStr);
    const posts = await prisma.blogPost.findMany({
      where: { authorId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Yazar blog GET Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST: Publish a new blog post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authorId, authorName, title, content, category } = body;

    if (!authorId || !authorName || !title || !content || !category) {
      return NextResponse.json({ success: false, error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    // Verify teacher is approved
    const teacher = await prisma.teacher.findUnique({
      where: { id: parseInt(authorId) },
    });

    if (!teacher) {
      return NextResponse.json({ success: false, error: "Öğretmen bulunamadı" }, { status: 404 });
    }

    if (teacher.status !== "İletişime Geçildi") {
      return NextResponse.json({ success: false, error: "Hesabınız onaylanmadan blog yazısı paylaşamazsınız." }, { status: 403 });
    }

    let slug = slugify(title);
    
    // Check if slug is unique, if not append random string
    const existing = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existing) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        category,
        authorId: parseInt(authorId),
        authorName,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Blog POST Hatası:", error);
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

    const id = parseInt(idStr);

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Blog yazısı silindi" });
  } catch (error) {
    console.error("Blog DELETE Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
