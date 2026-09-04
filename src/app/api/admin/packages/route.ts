import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminAuth } from "@/lib/adminAuth";

export async function GET(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const packages = await prisma.lessonPackage.findMany({
      orderBy: [{ orderNo: "asc" }, { createdAt: "desc" }]
    });
    return NextResponse.json({ success: true, packages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { title, subtitle, targetExam, hours, price, discountedPrice, badge, features, isPopular, isActive, orderNo } = body;

    if (!title || !price) {
      return NextResponse.json({ success: false, error: "Paket başlığı ve fiyatı zorunludur." }, { status: 400 });
    }

    const newPackage = await prisma.lessonPackage.create({
      data: {
        title,
        subtitle: subtitle || null,
        targetExam: targetExam || "YKS",
        hours: parseInt(String(hours)) || 20,
        price: parseFloat(String(price)),
        discountedPrice: discountedPrice ? parseFloat(String(discountedPrice)) : null,
        badge: badge || null,
        features: typeof features === "string" ? features : (features || []).join(","),
        isPopular: Boolean(isPopular),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        orderNo: parseInt(String(orderNo)) || 0,
      }
    });

    return NextResponse.json({ success: true, package: newPackage });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, title, subtitle, targetExam, hours, price, discountedPrice, badge, features, isPopular, isActive, orderNo } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Paket ID zorunludur." }, { status: 400 });
    }

    const updated = await prisma.lessonPackage.update({
      where: { id: parseInt(String(id)) },
      data: {
        title,
        subtitle,
        targetExam,
        hours: parseInt(String(hours)) || 20,
        price: parseFloat(String(price)),
        discountedPrice: discountedPrice ? parseFloat(String(discountedPrice)) : null,
        badge,
        features: typeof features === "string" ? features : (features || []).join(","),
        isPopular: Boolean(isPopular),
        isActive: Boolean(isActive),
        orderNo: parseInt(String(orderNo)) || 0,
      }
    });

    return NextResponse.json({ success: true, package: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Paket ID zorunludur." }, { status: 400 });
    }

    await prisma.lessonPackage.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true, message: "Paket silindi." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
