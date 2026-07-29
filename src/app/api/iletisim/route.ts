import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Yasal Gereklilikler ve Bot Korumalı İletişim Formu API Uç Noktası
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`contact-form-${ip}`, 5, 60_000);
    if (!rateLimit.success) {
      return NextResponse.json({ success: false, error: "Çok fazla iletişim mesajı gönderdiniz. Lütfen bekleyin." }, { status: 429 });
    }

    const body = await request.json();
    const { name, email, phone, message, honey } = body;

    // Honeypot Spam Verification
    if (honey) {
      return NextResponse.json({
        success: true,
        message: "Mesajınız başarıyla iletildi. En kısa sürede geri dönüş sağlayacağız."
      });
    }

    // Basit Sunucu Taraflı Validasyon
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Lütfen zorunlu alanları doldurun." },
        { status: 400 }
      );
    }

    // Save message to database
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        status: "UNREAD",
      },
    });

    console.log("✅ İletişim Formu Veritabanına Kaydedildi:", { name, email });

    return NextResponse.json({
      success: true,
      message: "Mesajınız başarıyla iletildi. En kısa sürede geri dönüş sağlayacağız."
    });
  } catch (error) {
    console.error("İletişim API Hatası:", error);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası oluştu, lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
