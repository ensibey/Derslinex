import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { blogYazilari } from "@/data/blog";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      // Find in static posts
      const staticPost = blogYazilari.find((p) => p.slug === slug);
      if (staticPost) {
        return NextResponse.json({ success: true, post: staticPost });
      }

      // Find in database
      const dbPost = await prisma.blogPost.findUnique({
        where: { slug },
      });

      if (dbPost) {
        const mapped = {
          id: `db-${dbPost.id}`,
          slug: dbPost.slug,
          baslik: dbPost.title,
          ozet: dbPost.content.slice(0, 150) + (dbPost.content.length > 150 ? "..." : ""),
          icerik: dbPost.content,
          yazar: dbPost.authorName,
          kategori: dbPost.category,
          okumaSuresi: Math.max(1, Math.ceil(dbPost.content.split(/\s+/).length / 200)),
          tarih: dbPost.createdAt.toISOString()
        };
        return NextResponse.json({ success: true, post: mapped });
      }

      return NextResponse.json({ success: false, error: "Blog yazısı bulunamadı" }, { status: 404 });
    }

    // Get all database posts
    const dbPosts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });

    const mappedDbPosts = dbPosts.map((p) => ({
      id: `db-${p.id}`,
      slug: p.slug,
      baslik: p.title,
      ozet: p.content.slice(0, 150) + (p.content.length > 150 ? "..." : ""),
      yazar: p.authorName,
      kategori: p.category,
      okumaSuresi: Math.max(1, Math.ceil(p.content.split(/\s+/).length / 200)),
    }));

    // Merge static and dynamic posts
    const merged = [...mappedDbPosts, ...blogYazilari];

    return NextResponse.json({ success: true, posts: merged });
  } catch (error) {
    console.error("Public Blog GET Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
