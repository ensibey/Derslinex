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
    ders: "Kimya (YKS)",
    kategori: "YKS",
    konular: ["Kimya Bilimi & Atomun Yapısı", "Periyodik Sistem & Kimyasal Türler", "Maddenin Halleri & Karışımlar", "Kimyasal Hesaplamalar & Yasalar", "Modern Atom Teorisi", "Gazlar & Sıvı Çözeltiler", "Kimyasal Tepkimelerde Enerji & Hız", "Kimyasal Denge (Asit-Baz, Çözünürlük)", "Kimya ve Elektrik", "Karbon Kimyasına Giriş & Organik Kimya"],
    hocaSlug: "mehmet-celik-fizik",
    hocaAd: "Mehmet Çelik"
  },
  {
    id: "4",
    ders: "Biyoloji (YKS)",
    kategori: "YKS",
    konular: ["Yaşam Bilimi Biyoloji & Hücre", "Canlıların Çeşitliliği & Sınıflandırma", "Hücre Bölünmeleri & Üreme", "Kalıtım & Ekosistem Biyolojisi", "Nükleik Asitler & Protein Sentezi", "Genetik Şifre & Biyoteknoloji", "Sistemler (Sinir, Endokrin, Destek, Sindirim, Dolaşım, Solunum, Boşaltım)", "Bitki Biyolojisi & Canlılar ve Çevre"],
    hocaSlug: "ahmet-yilmaz-matematik",
    hocaAd: "Ahmet Yılmaz"
  },
  {
    id: "5",
    ders: "Edebiyat & Türkçe (YKS)",
    kategori: "YKS",
    konular: ["Sözcük, Cümle ve Paragraf Bilgisi", "Dil Bilgisi (Ses, Yazım, Noktalama)", "Sözcük Türleri & Cümle Ögeleri", "Şiir Bilgisi & Edebi Sanatlar", "İslamiyet Öncesi & Geçiş Dönemi", "Halk & Divan Edebiyatı", "Tanzimat, Servet-i Fünun & Fecr-i Ati", "Milli Edebiyat & Cumhuriyet Edebiyatı"],
    hocaSlug: "elif-demir-turkce-edebiyat",
    hocaAd: "Elif Demir"
  },
  {
    id: "6",
    ders: "Matematik (LGS)",
    kategori: "LGS",
    konular: ["Çarpanlar ve Katlar", "Üslü İfadeler", "Kareköklü İfadeler", "Veri Analizi", "Basit Olayların Olma Olasılığı", "Cebirsel İfadeler ve Özdeşlikler", "Doğrusal Denklemler", "Eşitsizlikler", "Üçgenler & Eşlik Benzerlik", "Dönüşüm Geometrisi & Geometrik Cisimler"],
    hocaSlug: "ahmet-yilmaz-matematik",
    hocaAd: "Ahmet Yılmaz"
  },
  {
    id: "7",
    ders: "Fen Bilimleri (LGS)",
    kategori: "LGS",
    konular: ["Mevsimler ve İklim", "DNA ve Genetik Kod", "Basınç (Katı, Sıvı, Gaz)", "Madde ve Endüstri (Periyodik Sistem, Kimyasal Tepkimeler)", "Basit Makineler", "Enerji Dönüşümleri ve Çevre Bilimi", "Elektrik Yükleri ve Elektrik Enerjisi"],
    hocaSlug: "mehmet-celik-fizik",
    hocaAd: "Mehmet Çelik"
  },
  {
    id: "8",
    ders: "Türkçe (LGS)",
    kategori: "LGS",
    konular: ["Fiilimsiler (Sıfat, Zarf, İsim)", "Sözcükte, Cümlede ve Paragrafta Anlam", "Cümlenin Ögeleri & Fiilde Çatı", "Cümle Türleri & Anlatım Bozuklukları", "Yazım Kuralları & Noktalama İşaretleri", "Sözel Mantık & Görsel Okuma"],
    hocaSlug: "elif-demir-turkce-edebiyat",
    hocaAd: "Elif Demir"
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
  { id: "5", ad: "İzmir Fen Lisesi", sehir: "İzmir", puan: 491.0, dilim: 0.08, matNet: 19, fenNet: 19, turNet: 20 },
  { id: "6", ad: "Atatürk Fen Lisesi", sehir: "İstanbul", puan: 490.5, dilim: 0.09, matNet: 19, fenNet: 19, turNet: 19 },
  { id: "7", ad: "Tofaş Fen Lisesi", sehir: "Bursa", puan: 488.2, dilim: 0.12, matNet: 19, fenNet: 19, turNet: 19 },
  { id: "8", ad: "Adana Fen Lisesi", sehir: "Adana", puan: 486.0, dilim: 0.15, matNet: 18, fenNet: 19, turNet: 20 },
  { id: "9", ad: "Cağaloğlu Anadolu Lisesi", sehir: "İstanbul", puan: 485.5, dilim: 0.16, matNet: 18, fenNet: 18, turNet: 20 },
  { id: "10", ad: "Kadıköy Anadolu Lisesi", sehir: "İstanbul", puan: 483.2, dilim: 0.22, matNet: 18, fenNet: 18, turNet: 19 },
  { id: "11", ad: "Bornova Anadolu Lisesi", sehir: "İzmir", puan: 482.0, dilim: 0.25, matNet: 18, fenNet: 18, turNet: 18 },
  { id: "12", ad: "Gazi Anadolu Lisesi", sehir: "Ankara", puan: 479.5, dilim: 0.35, matNet: 17, fenNet: 18, turNet: 19 },
  { id: "13", ad: "Kayseri Fen Lisesi", sehir: "Kayseri", puan: 478.2, dilim: 0.39, matNet: 17, fenNet: 18, turNet: 18 },
  { id: "14", ad: "Kocaeli Fen Lisesi", sehir: "Kocaeli", puan: 477.0, dilim: 0.42, matNet: 17, fenNet: 17, turNet: 19 },
  { id: "15", ad: "Antakya Fen Lisesi", sehir: "Hatay", puan: 474.5, dilim: 0.55, matNet: 16, fenNet: 18, turNet: 18 },
  { id: "16", ad: "Samsun Garip Yıldırım Fen Lisesi", sehir: "Samsun", puan: 473.0, dilim: 0.62, matNet: 16, fenNet: 17, turNet: 18 },
  { id: "17", ad: "Eskişehir Fatih Fen Lisesi", sehir: "Eskişehir", puan: 472.2, dilim: 0.68, matNet: 16, fenNet: 16, turNet: 19 },
  { id: "18", ad: "Trabzon Fen Lisesi", sehir: "Trabzon", puan: 471.0, dilim: 0.75, matNet: 16, fenNet: 16, turNet: 18 },
  { id: "19", ad: "Denizli Erbakır Fen Lisesi", sehir: "Denizli", puan: 470.5, dilim: 0.78, matNet: 15, fenNet: 17, turNet: 18 },
  { id: "20", ad: "Malatya Erman Ilıcak Fen Lisesi", sehir: "Malatya", puan: 469.8, dilim: 0.85, matNet: 15, fenNet: 16, turNet: 18 }
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
