import { blogYazilari } from "@/data/blog";
import { dersAlanlari } from "@/data/dersler";
import { hocalar } from "@/data/hocalar";
import { wikiKonulari } from "@/data/wiki";

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
    "/blog/soru-dagilimlari",
    "/blog/yks-net-siralama-karsilastirma",
    "/blog/konu-takip-cetelesi",
    "/blog/lise-taban-puanlari",
    "/blog/meslek-net-atlası",
    "/wiki",
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

  // Dinamik Wiki Konuları
  const wikiSayfalari = wikiKonulari.map((w) => ({
    url: `${baseUrl}/wiki/${w.slug}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // Dinamik Şehir ve İlçe Rotaları (Geo-SEO)
  const konumlarSet = new Set<string>();
  const sehirlerSet = new Set<string>();

  hocalar.forEach((h) => {
    if (!h.aktif || !h.konum.includes(",")) return;
    const parts = h.konum.split(",");
    const rawIlce = parts[0].trim();
    const rawSehir = parts[1].replace(/\/.*$/, "").trim();

    const toSlug = (text: string) =>
      text
        .toLowerCase()
        .replace(/ş/g, "s")
        .replace(/ç/g, "c")
        .replace(/ı/g, "i")
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ö/g, "o")
        .replace(/\s+/g, "-");

    const sehirSlug = toSlug(rawSehir);
    const ilceSlug = toSlug(rawIlce);

    sehirlerSet.add(sehirSlug);
    konumlarSet.add(`${sehirSlug}/${ilceSlug}`);
  });

  const sehirSayfalari = Array.from(sehirlerSet).map((sehirSlug) => ({
    url: `${baseUrl}/ozel-ders/${sehirSlug}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const ilceSayfalari = Array.from(konumlarSet).map((path) => ({
    url: `${baseUrl}/ozel-ders/${path}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    ...statikSayfalar,
    ...hocaSayfalari,
    ...dersSayfalari,
    ...blogSayfalari,
    ...wikiSayfalari,
    ...sehirSayfalari,
    ...ilceSayfalari,
  ];
}
