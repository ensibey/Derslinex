import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const packages = await prisma.lessonPackage.findMany({
      where: { isActive: true },
      orderBy: [{ orderNo: "asc" }, { createdAt: "desc" }]
    });

    // If database is empty, seed 3 standard packages
    if (packages.length === 0) {
      const defaultPackages = [
        {
          title: "TYT & AYT Sayısal Derece Paketi",
          subtitle: "Matematik, Fizik, Kimya ve Biyoloji için hedefe yönelik yoğun hazırlık",
          targetExam: "YKS",
          hours: 30,
          price: 15000,
          discountedPrice: 12500,
          badge: "En Çok Tercih Edilen",
          isPopular: true,
          isActive: true,
          orderNo: 1,
          features: "Haftalık 3 saat birebir canlı ders,Kişiye özel YKS başarı çalışma planı,Ücretsiz Türkiye geneli online deneme sınavları,7/24 WhatsApp eğitmen soru çözüm hattı,Düzenli veli gelişim ve net takip raporları",
        },
        {
          title: "LGS 8. Sınıf Yeni Nesil Şampiyon Paketi",
          subtitle: "Yeni nesil beceri temelli sorular ve lise hazırlığında fark yaratan sistem",
          targetExam: "LGS",
          hours: 20,
          price: 10000,
          discountedPrice: 8500,
          badge: "LGS Özel",
          isPopular: false,
          isActive: true,
          orderNo: 2,
          features: "Haftalık 2 saat LGS Matematik & Fen canlı dersi,Yeni nesil paragraf ve mantık muhakeme analizleri,Optik okumalı online mini denemeler,Rehberlik ve sınav kaygısı yönetimi,Aylık veli bilgilendirme seansı",
        },
        {
          title: "Birebir Soru Çözüm & Koçluk Paketi",
          subtitle: "Eksik olduğunuz konularda nokta atışı takviye ve hızlandırma",
          targetExam: "TÜMÜ",
          hours: 10,
          price: 5500,
          discountedPrice: 4750,
          badge: "Hızlı Başlangıç",
          isPopular: false,
          isActive: true,
          orderNo: 3,
          features: "İstediğiniz branşta 10 saat canlı özel ders,Çıkmış ÖSYM ve MEB soru kalıpları analizi,Ders video kayıtlarını sınırsız tekrar izleme,Konu tarama testleri ve çözümleri,Esnek gün ve saat seçimi",
        }
      ];

      for (const p of defaultPackages) {
        await prisma.lessonPackage.create({ data: p });
      }

      const created = await prisma.lessonPackage.findMany({
        where: { isActive: true },
        orderBy: [{ orderNo: "asc" }, { createdAt: "desc" }]
      });
      return NextResponse.json({ success: true, packages: created });
    }

    return NextResponse.json({ success: true, packages });
  } catch (error: any) {
    console.error("Packages GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
