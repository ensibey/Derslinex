export interface KonuTakip {
  id: string;
  ders: string;
  kategori: "YKS" | "LGS";
  konular: string[];
  hocaSlug: string;
  hocaAd: string;
}

export const konuTakipVerisi: KonuTakip[] = [
  {
    id: "1",
    ders: "Matematik (YKS)",
    kategori: "YKS",
    konular: ["Temel Kavramlar & Sayılar", "Rasyonel Sayılar", "Üslü & Köklü İfadeler", "Çarpanlara Ayırma", "Denklem Çözme", "Oran - Orantı", "Problemler (Tüm Çeşitler)", "Kümeler & Fonksiyonlar", "Polinomlar & II. Dereceden Denklemler", "Trigonometri", "Logaritma & Diziler", "Limit & Süreklilik", "Türev", "İntegral"],
    hocaSlug: "ahmet-yilmaz-matematik",
    hocaAd: "Ahmet Yılmaz"
  },
  {
    id: "2",
    ders: "Fizik (YKS)",
    kategori: "YKS",
    konular: ["Fizik Bilimine Giriş", "Madde ve Özellikleri", "Hareket ve Kuvvet", "Enerji, Isı ve Sıcaklık", "Elektrostatik & Manyetizma", "Optik & Dalgalar", "Vektörler & Bağıl Hareket", "Newton'ın Hareket Yasaları", "Çembersel Hareket", "Basit Harmonik Hareket", "Dalga Mekaniği", "Modern Fizik"],
    hocaSlug: "mehmet-celik-fizik",
    hocaAd: "Mehmet Çelik"
  },
  {
    id: "3",
    ders: "Türkçe/Edebiyat",
    kategori: "YKS",
    konular: ["Sözcük & Cümle Anlamı", "Paragraf Yorumlama", "Dil Bilgisi (Ses, Yazım, Noktalama)", "Edebi Sanatlar & Şiir Bilgisi", "İslamiyet Öncesi & Geçiş Dönemi", "Halk & Divan Edebiyatı", "Tanzimat & Servet-i Fünun Edebiyatı", "Milli Edebiyat Dönemi", "Cumhuriyet Dönemi Edebiyatı"],
    hocaSlug: "elif-demir-turkce-edebiyat",
    hocaAd: "Elif Demir"
  },
  {
    id: "4",
    ders: "Matematik (LGS)",
    kategori: "LGS",
    konular: ["Çarpanlar ve Katlar", "Üslü İfadeler", "Kareköklü İfadeler", "Veri Analizi", "Basit Olayların Olma Olasılığı", "Cebirsel İfadeler ve Özdeşlikler", "Doğrusal Denklemler", "Eşitsizlikler", "Üçgenler & Eşlik Benzerlik", "Dönüşüm Geometrisi & Geometrik Cisimler"],
    hocaSlug: "ahmet-yilmaz-matematik",
    hocaAd: "Ahmet Yılmaz"
  }
];

export interface LiseTaban {
  id: string;
  ad: string;
  sehir: string;
  puan: number;
  dilim: number;
  matNet: number;
  fenNet: number;
  turNet: number;
}

export const liseTabanVerisi: LiseTaban[] = [
  { id: "1", ad: "Galatasaray Lisesi", sehir: "İstanbul", puan: 497.5, dilim: 0.01, matNet: 20, fenNet: 20, turNet: 20 },
  { id: "2", ad: "İstanbul Erkek Lisesi", sehir: "İstanbul", puan: 496.2, dilim: 0.02, matNet: 20, fenNet: 20, turNet: 19 },
  { id: "3", ad: "Ankara Fen Lisesi", sehir: "Ankara", puan: 493.8, dilim: 0.05, matNet: 20, fenNet: 19, turNet: 20 },
  { id: "4", ad: "Kabataş Erkek Lisesi", sehir: "İstanbul", puan: 493.5, dilim: 0.06, matNet: 19, fenNet: 20, turNet: 20 },
  { id: "5", ad: "İzmir Fen Lisesi", sehir: "İzmir", puan: 491.0, dilim: 0.08, matNet: 19, fenNet: 19, turNet: 20 }
];

export interface MeslekNet {
  id: string;
  ad: string;
  uni: string;
  tytNet: number;
  aytNet: number;
  saySiralama: string;
  hocaSlug: string;
  hocaAd: string;
}

export const meslekNetVerisi: MeslekNet[] = [
  { id: "1", ad: "Tıp Fakültesi", uni: "Hacettepe Üniversitesi (Devlet)", tytNet: 104, aytNet: 76, saySiralama: "1,500", hocaSlug: "ahmet-yilmaz-matematik", hocaAd: "Ahmet Yılmaz" },
  { id: "2", ad: "Bilgisayar Mühendisliği", uni: "ODTÜ (Devlet)", tytNet: 106, aytNet: 75, saySiralama: "2,100", hocaSlug: "mehmet-celik-fizik", hocaAd: "Mehmet Çelik" },
  { id: "3", ad: "Hukuk Fakültesi", uni: "Ankara Üniversitesi (Devlet)", tytNet: 92, aytNet: 64, saySiralama: "3,800 (EA)", hocaSlug: "elif-demir-turkce-edebiyat", hocaAd: "Elif Demir" },
  { id: "4", ad: "Diş Hekimliği", uni: "Ege Üniversitesi (Devlet)", tytNet: 95, aytNet: 68, saySiralama: "16,000", hocaSlug: "ahmet-yilmaz-matematik", hocaAd: "Ahmet Yılmaz" },
  { id: "5", ad: "Mimarlık", uni: "İTÜ (Devlet)", tytNet: 90, aytNet: 62, saySiralama: "38,000", hocaSlug: "mehmet-celik-fizik", hocaAd: "Mehmet Çelik" }
];
