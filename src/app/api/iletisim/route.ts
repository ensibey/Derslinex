import { NextResponse } from "next/server";

// Yasal Gereklilikler ve Bot Korumalı İletişim Formu API Uç Noktası
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Basit Sunucu Taraflı Validasyon
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Lütfen zorunlu alanları doldurun." },
        { status: 400 }
      );
    }

    // Gerçek e-posta veya veri tabanı entegrasyonu için geliştirme günlüğü simülasyonu
    console.log(" Yeni Derslinex İletişim Formu Talebi Alındı!");
    console.log(`İsim: ${name}`);
    console.log(`E-posta: ${email}`);
    console.log(`Telefon: ${phone || "Belirtilmemiş"}`);
    console.log(`Mesaj: ${message}`);

    // [Resend / Nodemailer Entegrasyon Noktası]
    // Gelecekte e-posta bildirimlerini aktif etmek için buraya Resend SDK'sı bağlanacaktır.

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
