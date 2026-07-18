export interface WikiKonu {
  id: string;
  slug: string;
  baslik: string;
  ders: string;
  kategori: "YKS" | "LGS";
  ozet: string;
  icerik: string;
  hocaSlug: string;
  hocaAd: string;
}

export const wikiKonulari: WikiKonu[] = [
  {
    id: "1",
    slug: "logaritma-ozellikleri-ve-kurallari",
    baslik: "Logaritma Özellikleri ve Kuralları: ÖSYM Taktikleri",
    ders: "Matematik",
    kategori: "YKS",
    ozet: "YKS AYT Matematik testinde her yıl kesinlikle soru getiren logaritma konusunun tüm özellikleri, taban değiştirme kuralları ve ÖSYM tipi pratik çözümleri.",
    icerik: `Logaritma, üstel fonksiyonların tersi olan ve özellikle AYT Matematik sınavında her yıl 2-3 soru ile karşımıza çıkan son derece önemli bir konudur. Logaritma sorularını kaçırmamak için temel özellikleri ve taban değiştirme kurallarını adınız gibi bilmelisiniz.

📌 Temel Tanım:
y = a^x ifadesinde x'i yalnız bırakmak için logaritma kullanılır: x = log_a(y). Burada a taban, y ise logaritması alınan sayıdır. (a > 0, a ≠ 1 ve y > 0 olmalıdır).

📐 Logaritmanın Altın Özellikleri:
1. log_a(1) = 0 (Hangi tabanda olursa olsun, 1'in logaritması daima sıfırdır).
2. log_a(a) = 1 (Taban ile logaritması alınan sayı eşitse sonuç birdir).
3. log_a(x * y) = log_a(x) + log_a(y) (Çarpım durumundaki ifade, toplam olarak ayrılır).
4. log_a(x / y) = log_a(x) - log_a(y) (Bölüm durumundaki ifade, fark olarak yazılır).
5. log_a(x^n) = n * log_a(x) (Üstteki derece, logaritmanın başına katsayı olarak düşer).

🔄 Taban Değiştirme Kuralı (AYT'nin En Çok Sorduğu Kural):
Bir logaritma ifadesini istediğiniz herhangi bir c tabanında yazabilirsiniz:
log_a(b) = log_c(b) / log_c(a).
Ayrıca log_a(b) = 1 / log_b(a) kuralı da sıklıkla sadeleştirme sorularında hayat kurtarır.

💡 ÖSYM Tipi Sorularda Zaman Kazanma Taktikleri:
Logaritmik denklemleri çözerken bulduğunuz x değerlerinin logaritmanın tanım kümesine (taban > 0, taban ≠ 1 ve logaritması alınan sayı > 0) uyup uymadığını mutlaka kontrol edin. ÖSYM, şıklara bilerek tanım kümesini ihlal eden sahte kökleri yerleştirir.`,
    hocaSlug: "ahmet-yilmaz-matematik",
    hocaAd: "Ahmet Yılmaz"
  },
  {
    id: "2",
    slug: "mitoz-bolunme-evreleri-ve-ozellikleri",
    baslik: "Mitoz Bölünme Evreleri, Özellikleri ve Şematik Özeti",
    ders: "Biyoloji",
    kategori: "YKS",
    ozet: "TYT Biyoloji sınavının garanti konularından hücre bölünmeleri kapsamında mitoz bölünmenin tüm evreleri (profaz, metafaz, anafaz, telofaz) ve önemli özellikleri.",
    icerik: `Mitoz bölünme, tek hücrelilerde üremeyi, çok hücrelilerde ise büyüme, gelişme ve yaraların onarılmasını sağlayan temel biyolojik süreçtir. TYT Biyoloji testinde hücre bölünmesi konusundan her yıl kesinlikle 1 soru gelmektedir.

🧬 Mitoz Bölünmenin Temel Özellikleri:
- 2n veya n kromozomlu hücrelerde gerçekleşebilir.
- Bölünme sonucunda kalıtsal yapısı ana hücreyle tamamen aynı olan 2 yeni hücre oluşur.
- Kromozom sayısı ve DNA yapısı değişmez (mutasyonlar hariç).
- Çeşitlilik sağlamaz (Kalıtsal çeşitlilik mitozda yoktur, bu bilgi sorularda sıkça elenir).

🔬 Mitoz Bölünmenin Evreleri (IPMAT):
1. İnterfaz (Hazırlık Evresi): DNA kendini eşler (replikasyon), organel sayısı artar ve ATP sentezi hızlanır. Bölünme evresi değildir ancak hazırlıktır.
2. Profaz: Kromatin iplikler kısalıp kalınlaşarak kromozomlara dönüşür. Çekirdek zarı erir ve iğ iplikleri oluşmaya başlar.
3. Metafaz (Kromozomların En Net Göründüğü Evre): Kromozomlar hücrenin ekvatoral düzlemine tek sıra halinde dizilir. Kromozom analizi (karyotip) bu evrede yapılır.
4. Anafaz (Kardeş Kromatid Ayrılması): İğ ipliklerinin kısalmasıyla kardeş kromatidler zıt kutuplara çekilir. Bu evrede geçici olarak kromozom sayısı iki katına çıkar.
5. Telofaz: Kutup bölgelerindeki kromozomlar tekrar kromatin ipliklere dönüşür. Çekirdek zarı yeniden oluşur.

Karyokinezi (çekirdek bölünmesi) tamamlandıktan sonra sitokinez (sitoplazma bölünmesi) gerçekleşir. Sitokinez hayvan hücrelerinde boğumlanarak, bitki hücrelerinde ise ara lamel (hücre plağı) oluşumuyla gerçekleşir. Bu fark ÖSYM'nin en sevdiği çeldiricilerdendir.`,
    hocaSlug: "elif-demir-turkce-edebiyat",
    hocaAd: "Elif Demir"
  },
  {
    id: "3",
    slug: "cumhuriyet-donemi-turk-edebiyati-yazarlari",
    baslik: "Cumhuriyet Dönemi Türk Edebiyatı Yazarları ve Eserleri",
    ders: "Türkçe/Edebiyat",
    kategori: "YKS",
    ozet: "AYT Edebiyat sınavında en çok soru getiren Cumhuriyet Dönemi Türk Edebiyatı akımları, önemli romancıları ve mutlaka bilinmesi gereken başyapıt eserler.",
    icerik: `Cumhuriyet Dönemi Türk Edebiyatı, YKS AYT Edebiyat testinde ortalama 3-4 soru ile sınavın en belirleyici ve en hacimli kısmını oluşturur. Yazarların edebi yönelimlerini ve eser özetlerini gruplandırarak çalışmak akılda kalıcılığı artırır.

📚 Cumhuriyet Dönemi Roman Grupları ve Önemli Temsilcileri:

1. Milli Edebiyat Zevk ve Anlayışını Sürdürenler:
- Toplumsal meseleleri, Anadolu insanını ve Kurtuluş Savaşı'nı işlerler.
- Temsilcileri: Yakup Kadri Karaosmanoğlu (Yaban, Sodom ve Gomore), Reşat Nuri Güntekin (Çalıkuşu, Yaprak Dökümü), Halide Edip Adıvar (Ateşten Gömlek, Sinekli Bakkal).

2. Toplumcu Gerçekçiler:
- Köy ve kasaba hayatını, işçi-işveren ilişkilerini, toprak kavgalarını realizm akımıyla anlatırlar.
- Temsilcileri: Yaşar Kemal (İnce Memed), Kemal Tahir (Devlet Ana, Yorgun Savaşçı), Orhan Kemal (Murtaza, Bereketli Topraklar Üzerinde).

3. Bireyin İç Dünyasını Esas Alanlar:
- Psikolojik analizlere, yalnızlık, yabancılaşma ve içsel sorgulamalara odaklanırlar.
- Temsilcileri: Peyami Safa (Dokuzuncu Hariciye Koğuşu), Ahmet Hamdi Tanpınar (Huzur, Saatleri Ayarlama Enstitüsü), Tarık Buğra (Küçük Ağa).

4. Modernist ve Postmodernistler:
- Geleneksel anlatım tekniklerini kırıp bilinç akışı, iç konuşma ve üstkurmaca tekniklerini kullanırlar.
- Temsilcileri: Oğuz Atay (Tutunamayanlar), Yusuf Atılgan (Anayurt Oteli), Orhan Pamuk (Kara Kitap).

💡 Derece Yaptıran Ezber Taktikleri:
Cumhuriyet Edebiyatı çalışırken sadece yazar-eser ezberlemeyin; romanların başkahramanlarını (Örn: Yaban romanındaki Ahmet Celal, Huzur romanındaki Mümtaz ve Nuran) mutlaka bir kenara not edin. ÖSYM son yıllarda doğrudan roman kahramanları üzerinden soru sormaktadır.`,
    hocaSlug: "elif-demir-turkce-edebiyat",
    hocaAd: "Elif Demir"
  }
];

export function getWikiBySlug(slug: string): WikiKonu | undefined {
  return wikiKonulari.find((w) => w.slug === slug);
}
