export type YKSTuru = "TYT" | "AYT Sayısal" | "AYT Sözel" | "AYT EA" | "AYT Dil";
export type DersFormati = "yuz-yuze" | "online" | "her-ikisi";

export interface Hoca {
  id: string;
  slug: string;
  isim: string;
  unvan: string;
  fotograf: string;
  dersler: string[];
  yksTuru: YKSTuru[];
  format: DersFormati;
  konum: string;
  deneyimYili: number;
  egitim: string;
  ozgecmis: string;
  whatsapp: string;
  puan: number;
  ogrenciSayisi: number;
  aktif: boolean;
}

export interface DersAlani {
  id: string;
  slug: string;
  isim: string;
  aciklama: string;
  yksTuru: YKSTuru[];
  emoji: string;
  renk: string;
}

export interface BlogYazisi {
  id: string;
  slug: string;
  baslik: string;
  ozet: string;
  icerik: string;
  yazar: string;
  tarih: string;
  kategori: string;
  okumaSuresi: number;
  resim: string;
}
