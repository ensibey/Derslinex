export interface UniversiteProgram {
  uni: string;
  sehir: string;
  program: string;
  tur: "Devlet" | "Vakıf" | "Burslu" | "Ücretli";
  tytNet: number;
  aytNet: number;
  puan: number;
  siralama: number;
}

export interface LiseProgram {
  ad: string;
  sehir: string;
  dilim: number;
  puan: number;
}

// Türkiye'deki tüm üniversiteler ve en popüler liselerin veri seti
export const universiteProgramlari: UniversiteProgram[] = [
  // Tıp
  { uni: "Hacettepe Üniversitesi", sehir: "Ankara", program: "Tıp Fakültesi (Türkçe)", tur: "Devlet", tytNet: 108, aytNet: 75.5, puan: 535.4, siralama: 1200 },
  { uni: "İstanbul Üniversitesi-Cerrahpaşa", sehir: "İstanbul", program: "Tıp Fakültesi (Türkçe)", tur: "Devlet", tytNet: 106, aytNet: 74, puan: 530.8, siralama: 1800 },
  { uni: "Ankara Üniversitesi", sehir: "Ankara", program: "Tıp Fakültesi", tur: "Devlet", tytNet: 104, aytNet: 73, puan: 526.2, siralama: 2500 },
  { uni: "Ege Üniversitesi", sehir: "İzmir", program: "Tıp Fakültesi", tur: "Devlet", tytNet: 102, aytNet: 72, puan: 522.1, siralama: 3400 },
  { uni: "Akdeniz Üniversitesi", sehir: "Antalya", program: "Tıp Fakültesi", tur: "Devlet", tytNet: 100, aytNet: 71, puan: 518.5, siralama: 4500 },
  { uni: "Pamukkale Üniversitesi", sehir: "Denizli", program: "Tıp Fakültesi", tur: "Devlet", tytNet: 98, aytNet: 69.5, puan: 512.3, siralama: 7200 },
  { uni: "Koç Üniversitesi", sehir: "İstanbul", program: "Tıp Fakültesi (İngilizce) (Burslu)", tur: "Burslu", tytNet: 114, aytNet: 79, puan: 552.1, siralama: 40 },
  
  // Bilgisayar / Yazılım Mühendisliği
  { uni: "Orta Doğu Teknik Üniversitesi (ODTÜ)", sehir: "Ankara", program: "Bilgisayar Mühendisliği", tur: "Devlet", tytNet: 110, aytNet: 77.5, puan: 541.2, siralama: 550 },
  { uni: "Boğaziçi Üniversitesi", sehir: "İstanbul", program: "Bilgisayar Mühendisliği", tur: "Devlet", tytNet: 112, aytNet: 78, puan: 546.8, siralama: 280 },
  { uni: "İhsan Doğramacı Bilkent Üniversitesi", sehir: "Ankara", program: "Bilgisayar Mühendisliği (Burslu)", tur: "Burslu", tytNet: 111, aytNet: 78, puan: 544.5, siralama: 350 },
  { uni: "İstanbul Teknik Üniversitesi (İTÜ)", sehir: "İstanbul", program: "Bilgisayar Mühendisliği", tur: "Devlet", tytNet: 107, aytNet: 76, puan: 533.1, siralama: 1500 },
  { uni: "Yıldız Teknik Üniversitesi", sehir: "İstanbul", program: "Bilgisayar Mühendisliği", tur: "Devlet", tytNet: 102, aytNet: 71.5, puan: 519.8, siralama: 4800 },
  { uni: "Dokuz Eylül Üniversitesi", sehir: "İzmir", program: "Bilgisayar Mühendisliği", tur: "Devlet", tytNet: 96, aytNet: 68, puan: 504.6, siralama: 10500 },
  { uni: "Marmara Üniversitesi", sehir: "İstanbul", program: "Yazılım Mühendisliği (İngilizce)", tur: "Devlet", tytNet: 97, aytNet: 69, puan: 508.2, siralama: 9200 },
  
  // Hukuk
  { uni: "Galatasaray Üniversitesi", sehir: "İstanbul", program: "Hukuk Fakültesi", tur: "Devlet", tytNet: 103, aytNet: 72, puan: 512.4, siralama: 180 },
  { uni: "Boğaziçi Üniversitesi", sehir: "İstanbul", program: "Hukuk Fakültesi", tur: "Devlet", tytNet: 101, aytNet: 70, puan: 504.2, siralama: 450 },
  { uni: "Ankara Üniversitesi", sehir: "Ankara", program: "Hukuk Fakültesi", tur: "Devlet", tytNet: 95, aytNet: 64, puan: 478.1, siralama: 2500 },
  { uni: "İstanbul Üniversitesi", sehir: "İstanbul", program: "Hukuk Fakültesi", tur: "Devlet", tytNet: 93, aytNet: 62.5, puan: 471.5, siralama: 3800 },
  { uni: "Dokuz Eylül Üniversitesi", sehir: "İzmir", program: "Hukuk Fakültesi", tur: "Devlet", tytNet: 90, aytNet: 60, puan: 460.2, siralama: 6500 },
  
  // Diğer Popüler Bölümler (Psikoloji, Mimarlık, İletişim, Diş Hekimliği)
  { uni: "Hacettepe Üniversitesi", sehir: "Ankara", program: "Diş Hekimliği Fakültesi", tur: "Devlet", tytNet: 95, aytNet: 66, puan: 498.4, siralama: 13500 },
  { uni: "İstanbul Üniversitesi", sehir: "İstanbul", program: "Eczacılık Fakültesi", tur: "Devlet", tytNet: 91, aytNet: 62.5, puan: 485.6, siralama: 21000 },
  { uni: "Boğaziçi Üniversitesi", sehir: "İstanbul", program: "Psikoloji (İngilizce)", tur: "Devlet", tytNet: 98, aytNet: 67, puan: 492.3, siralama: 1200 },
  { uni: "Orta Doğu Teknik Üniversitesi (ODTÜ)", sehir: "Ankara", program: "Mimarlık", tur: "Devlet", tytNet: 88, aytNet: 58, puan: 468.9, siralama: 31000 },
  { uni: "İstanbul Bilgi Üniversitesi", sehir: "İstanbul", program: "Yeni Medya ve İletişim (Burslu)", tur: "Burslu", tytNet: 82, aytNet: 52, puan: 432.5, siralama: 18000 }
];

export const liseVerileri: LiseProgram[] = [
  { ad: "Galatasaray Lisesi", sehir: "İstanbul", dilim: 0.01, puan: 500.0 },
  { ad: "İstanbul Erkek Lisesi", sehir: "İstanbul", dilim: 0.02, puan: 499.5 },
  { ad: "Ankara Fen Lisesi", sehir: "Ankara", dilim: 0.05, puan: 497.2 },
  { ad: "İzmir Fen Lisesi", sehir: "İzmir", dilim: 0.07, puan: 496.1 },
  { ad: "Kabataş Erkek Lisesi (Almanca)", sehir: "İstanbul", dilim: 0.08, puan: 495.6 },
  { ad: "Denizli Erbakır Fen Lisesi", sehir: "Denizli", dilim: 0.28, puan: 488.4 },
  { ad: "Kars Fen Lisesi", sehir: "Kars", dilim: 1.84, puan: 462.1 },
  { ad: "Aydın Fen Lisesi", sehir: "Aydın", dilim: 0.35, puan: 486.2 }
];

// Netleri puana çevirmek için yaklaşık katsayı hesabı (Basitleştirilmiş YÖK Atlas algoritması)
export function hesaplaYksPuan(tytNet: number, aytNet: number): number {
  const tytKatki = Math.min(tytNet, 120) * 1.4;
  const aytKatki = Math.min(aytNet, 80) * 3.0;
  return Math.round((100 + tytKatki + aytKatki + 50) * 10) / 10;
}

// LGS Netlerine göre yaklaşık puan hesabı (Sözel + Sayısal toplam net)
export function hesaplaLgsPuan(sozelNet: number, sayisalNet: number): number {
  const sozelKatki = Math.min(sozelNet, 50) * 2.2;
  const sayisalKatki = Math.min(sayisalNet, 40) * 4.2;
  return Math.round((100 + sozelKatki + sayisalKatki) * 10) / 10;
}

// Arama motorları ve kullanıcı talepleri için en yakın 5 üniversite veya liseyi döndürür
export function tercihRobotuSorgula(tytNet: number, aytNet: number, lgsNet: number = 0, mod: "yks" | "lgs" = "yks") {
  if (mod === "yks") {
    const hesaplananPuan = hesaplaYksPuan(tytNet, aytNet);
    
    return universiteProgramlari
      .map(program => {
        const puanFarki = hesaplananPuan - program.puan;
        let basariSans: number;

        if (puanFarki >= 15) basariSans = 98;
        else if (puanFarki >= 0) basariSans = 75 + Math.round(puanFarki * 1.5);
        else if (puanFarki >= -15) basariSans = 40 + Math.round(puanFarki * 2);
        else basariSans = Math.max(5, 40 + Math.round(puanFarki * 1.5));

        return {
          ...program,
          hedefPuan: program.puan,
          hesaplananPuan,
          sans: basariSans
        };
      })
      .sort((a, b) => b.sans - a.sans)
      .slice(0, 5);
  } else {
    const hesaplananPuan = hesaplaLgsPuan(lgsNet * 0.55, lgsNet * 0.45);
    
    return liseVerileri
      .map(lise => {
        const puanFarki = hesaplananPuan - lise.puan;
        let basariSans: number;

        if (puanFarki >= 10) basariSans = 98;
        else if (puanFarki >= 0) basariSans = 75 + Math.round(puanFarki * 2);
        else if (puanFarki >= -10) basariSans = 45 + Math.round(puanFarki * 3);
        else basariSans = Math.max(5, 45 + Math.round(puanFarki * 2));

        return {
          ...lise,
          hedefPuan: lise.puan,
          hesaplananPuan,
          sans: basariSans
        };
      })
      .sort((a, b) => b.sans - a.sans)
      .slice(0, 5);
  }
}
