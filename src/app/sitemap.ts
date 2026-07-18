import { blogYazilari } from "@/data/blog";
import { dersAlanlari } from "@/data/dersler";
import { hocalar } from "@/data/hocalar";

export default function sitemap() {
  const baseUrl = "https://derslinex.com";

  // Statik Sayfalar
  const statikSayfalar = [
    "",
    "/hocalar",
    "/dersler",
    "/yks-hazirlik",
    "/blog",
    "/blog/bilgi-kartlari",
    "/blog/gunun-sorusu",
    "/blog/pomodoro-sayaci",
    "/blog/ders-sihirbazi",
    "/blog/obp-siralamaya-etkisi",
    "/hakkimizda",
    "/iletisim",
    "/gizlilik",
    "/kullanim-kosullari",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dinamik Hocalar
  const hocaSayfalari = hocalar
    .filter((h) => h.aktif)
    .map((h) => ({
      url: `${baseUrl}/hocalar/${h.slug}`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  // Dinamik Dersler
  const dersSayfalari = dersAlanlari.map((d) => ({
    url: `${baseUrl}/dersler/${d.slug}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Dinamik Blog Yazıları
  const blogSayfalari = blogYazilari.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...statikSayfalar, ...hocaSayfalari, ...dersSayfalari, ...blogSayfalari];
}
