import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hocalar } from "@/data/hocalar";
import { hashPassword } from "@/lib/auth";
import { verifyAdminAuth } from "@/lib/adminAuth";

// POST /api/admin/seed
export async function POST(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    let seededCount = 0;
    const defaultPassword = hashPassword("derslinex123");

    for (const h of hocalar) {
      const existing = await prisma.teacher.findFirst({
        where: { name: h.isim },
      });

      if (!existing) {
        const branchStr = h.dersler[0] || "Matematik";
        const emailStr = `${h.slug}@derslinex.com`;
        const phoneStr = h.whatsapp || "05555555555";

        await prisma.teacher.create({
          data: {
            name: h.isim,
            email: emailStr,
            phone: phoneStr,
            password: defaultPassword,
            branch: branchStr,
            egitim: h.egitim,
            ozgecmis: h.ozgecmis,
            points: 100 + (h.ogrenciSayisi || 0),
            status: "İletişime Geçildi",
            avatar: h.fotograf,
          },
        });
        seededCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `${seededCount} adet öğretmen veritabanına aktarıldı.`,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
