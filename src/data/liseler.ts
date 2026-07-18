export interface LiseVeri {
  ad: string;
  sehir: string;
  puan: number;
  dilim: number;
}

export const tumTurkiyeLiseleri: LiseVeri[] = [
  // İstanbul
  { ad: "Galatasaray Lisesi", sehir: "İstanbul", puan: 497.5, dilim: 0.01 },
  { ad: "İstanbul Erkek Lisesi", sehir: "İstanbul", puan: 496.2, dilim: 0.02 },
  { ad: "Kabataş Erkek Lisesi", sehir: "İstanbul", puan: 493.5, dilim: 0.06 },
  { ad: "Atatürk Fen Lisesi", sehir: "İstanbul", puan: 490.5, dilim: 0.09 },
  { ad: "Cağaloğlu Anadolu Lisesi", sehir: "İstanbul", puan: 485.5, dilim: 0.16 },
  { ad: "Kadıköy Anadolu Lisesi", sehir: "İstanbul", puan: 483.2, dilim: 0.22 },
  { ad: "Hüseyin Avni Sözen Anadolu Lisesi", sehir: "İstanbul", puan: 481.5, dilim: 0.26 },
  { ad: "Sakıp Sabancı Anadolu Lisesi", sehir: "İstanbul", puan: 480.0, dilim: 0.30 },
  { ad: "Beşiktaş Anadolu Lisesi", sehir: "İstanbul", puan: 476.5, dilim: 0.45 },
  { ad: "Vefa Lisesi", sehir: "İstanbul", puan: 475.0, dilim: 0.50 },
  // Ankara
  { ad: "Ankara Fen Lisesi", sehir: "Ankara", puan: 493.8, dilim: 0.05 },
  { ad: "Gazi Anadolu Lisesi", sehir: "Ankara", puan: 479.5, dilim: 0.35 },
  { ad: "Atatürk Anadolu Lisesi", sehir: "Ankara", puan: 476.0, dilim: 0.48 },
  { ad: "Ankara Atatürk Lisesi", sehir: "Ankara", puan: 472.5, dilim: 0.65 },
  { ad: "Cumhuriyet Fen Lisesi", sehir: "Ankara", puan: 478.0, dilim: 0.40 },
  { ad: "Keçiören Fen Lisesi", sehir: "Ankara", puan: 474.0, dilim: 0.58 },
  { ad: "Pursaklar Fen Lisesi", sehir: "Ankara", puan: 471.5, dilim: 0.72 },
  // İzmir
  { ad: "İzmir Fen Lisesi", sehir: "İzmir", puan: 491.0, dilim: 0.08 },
  { ad: "Bornova Anadolu Lisesi", sehir: "İzmir", puan: 482.0, dilim: 0.25 },
  { ad: "İzmir Atatürk Lisesi", sehir: "İzmir", puan: 478.5, dilim: 0.38 },
  { ad: "Buca Fen Lisesi", sehir: "İzmir", puan: 477.2, dilim: 0.43 },
  { ad: "İzmir Kız Lisesi", sehir: "İzmir", puan: 473.0, dilim: 0.62 },
  // Bursa
  { ad: "Tofaş Fen Lisesi", sehir: "Bursa", puan: 488.2, dilim: 0.12 },
  { ad: "Bursa Anadolu Lisesi", sehir: "Bursa", puan: 475.5, dilim: 0.48 },
  { ad: "Nilüfer Borsa İstanbul Fen Lisesi", sehir: "Bursa", puan: 482.5, dilim: 0.23 },
  // Adana
  { ad: "Adana Fen Lisesi", sehir: "Adana", puan: 486.0, dilim: 0.15 },
  { ad: "Adana Anadolu Lisesi", sehir: "Adana", puan: 471.0, dilim: 0.75 },
  // Antalya
  { ad: "Antalya Erünal Sosyal Bilimler Lisesi", sehir: "Antalya", puan: 455.0, dilim: 1.80 },
  { ad: "Antalya Yusuf Ziya Öner Fen Lisesi", sehir: "Antalya", puan: 484.5, dilim: 0.18 },
  { ad: "Adem-Tolunay Anadolu Lisesi", sehir: "Antalya", puan: 472.0, dilim: 0.68 },
  // Kocaeli
  { ad: "Kocaeli Fen Lisesi", sehir: "Kocaeli", puan: 477.0, dilim: 0.42 },
  { ad: "Muammer Dereli Fen Lisesi", sehir: "Kocaeli", puan: 471.8, dilim: 0.70 },
  // Kayseri
  { ad: "Kayseri Fen Lisesi", sehir: "Kayseri", puan: 478.2, dilim: 0.39 },
  // Eskişehir
  { ad: "Eskişehir Fatih Fen Lisesi", sehir: "Eskişehir", puan: 472.2, dilim: 0.68 },
  // Trabzon
  { ad: "Trabzon Fen Lisesi", sehir: "Trabzon", puan: 471.0, dilim: 0.75 },
  // Denizli
  { ad: "Denizli Erbakır Fen Lisesi", sehir: "Denizli", puan: 470.5, dilim: 0.78 },
  // Samsun
  { ad: "Samsun Garip Yıldırım Fen Lisesi", sehir: "Samsun", puan: 473.0, dilim: 0.62 },
  // Malatya
  { ad: "Malatya Erman Ilıcak Fen Lisesi", sehir: "Malatya", puan: 469.8, dilim: 0.85 },
  // Balıkesir
  { ad: "Balıkesir T.C. Ziraat Bankası Fen Lisesi", sehir: "Balıkesir", puan: 478.8, dilim: 0.37 },
  // Konya
  { ad: "Meram Fen Lisesi", sehir: "Konya", puan: 485.0, dilim: 0.17 },
  { ad: "Konya Türk Telekom Sosyal Bilimler Lisesi", sehir: "Konya", puan: 442.0, dilim: 2.80 },
  // Diyarbakır
  { ad: "Diyarbakır Rekabet Kurumu Cumhuriyet Fen Lisesi", sehir: "Diyarbakır", puan: 473.5, dilim: 0.60 },
  // Erzurum
  { ad: "Erzurum İbrahim Hakkı Fen Lisesi", sehir: "Erzurum", puan: 470.2, dilim: 0.80 },
  // Gaziantep
  { ad: "Vehbi Dinçerler Fen Lisesi", sehir: "Gaziantep", puan: 477.5, dilim: 0.40 },
  // Mersin
  { ad: "Mersin Fen Lisesi", sehir: "Mersin", puan: 480.2, dilim: 0.30 },
  // Sakarya
  { ad: "Sakarya Cevat Ayhan Fen Lisesi", sehir: "Sakarya", puan: 471.2, dilim: 0.73 },
  // Tekirdağ
  { ad: "Tekirdağ Ebru Nayim Fen Lisesi", sehir: "Tekirdağ", puan: 474.2, dilim: 0.57 },
  // Manisa
  { ad: "Manisa Fen Lisesi", sehir: "Manisa", puan: 476.8, dilim: 0.44 },
  // Kahramanmaraş
  { ad: "Kahramanmaraş TOBB Fen Lisesi", sehir: "Kahramanmaraş", puan: 468.0, dilim: 0.95 },
  // Van
  { ad: "Van Türk Telekom Fen Lisesi", sehir: "Van", puan: 462.5, dilim: 1.25 }
];
