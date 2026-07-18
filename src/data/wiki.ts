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
    hocaSlug: "zeynep-arslan-kimya-biyoloji",
    hocaAd: "Zeynep Arslan"
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
  },
  // YENİ EKLENEN WİKİ KONULARI
  {
    id: "4",
    slug: "trigonometri-formulleri-ve-birim-cember",
    baslik: "Trigonometri Formülleri, Birim Çember ve ÖSYM Çıkmış Soru Çözüm Taktikleri",
    ders: "Matematik",
    kategori: "YKS",
    ozet: "AYT Matematik sınavının en ağır konularından olan Trigonometri için birim çember özellikleri, toplam-fark ve yarım açı formülleri ile sadeleştirme taktikleri.",
    icerik: `Trigonometri, hem AYT Matematik hem de Geometri kısmında her yıl toplamda 4-5 soru barındıran kritik bir konudur. Trigonometrinin temelini birim çember ve dik üçgendeki oranlar oluşturur.

📐 Birim Çember Özellikleri:
- Merkezi orijin (0,0) ve yarıçapı 1 birim olan çembere birim çember denir.
- Birim çemberin denklemi: x² + y² = 1 formülüyle ifade edilir.
- Yatay eksen (x ekseni) kosinüs eksenini, dikey eksen (y ekseni) ise sinüs eksenini temsil eder. Dolayısıyla cos²θ + sin²θ = 1 kuralı buradan gelir.

🔄 Toplam - Fark Formülleri:
- sin(a + b) = sin(a) * cos(b) + cos(a) * sin(b)
- cos(a + b) = cos(a) * cos(b) - sin(a) * sin(b)
- tan(a + b) = [tan(a) + tan(b)] / [1 - tan(a) * tan(b)]

⚡ Yarım Açı Formülleri (ÖSYM Her Yıl Sorar):
- sin(2a) = 2 * sin(a) * cos(a)
- cos(2a) = cos²(a) - sin²(a) = 2cos²(a) - 1 = 1 - 2sin²(a)
- tan(2a) = 2tan(a) / [1 - tan²(a)]

💡 Derece Yaptıran Çözüm Taktikleri:
Trigonometrik sadeleştirme sorularında ifadeleri olabildiğince sinüs ve kosinüs cinsinden yazmaya çalışın (Örn: tanx yerine sinx/cosx, cotx yerine cosx/sinx yazarak başlayın). Ayrıca payda eşitleme yaptıktan sonra yarım açı formüllerinin gizlenip gizlenmediğini kontrol edin.`,
    hocaSlug: "ahmet-yilmaz-matematik",
    hocaAd: "Ahmet Yılmaz"
  },
  {
    id: "5",
    slug: "newtonin-hareket-yasalari-ve-surtunme-kuvveti",
    baslik: "Newton'ın Hareket Yasaları, Sürtünme Kuvveti ve Eğik Düzlem Analizi",
    ders: "Fizik",
    kategori: "YKS",
    ozet: "Fizik dersinin omurgasını oluşturan Newton'ın 3 temel hareket yasası, serbest cisim diyagramı çizimi ve sürtünmeli eğik düzlem soru tipleri.",
    icerik: `Newton'ın Hareket Yasaları, klasik mekaniğin temelidir ve hem TYT hem de AYT Fizik testlerinde doğrudan veya diğer konuların (enerji, atışlar vb.) içinde dolaylı olarak mutlaka sorgulanır.

🏎️ Newton'ın 3 Altın Yasası:
1. Eylemsizlik Yasası: Bir cismin üzerine etki eden net kuvvet sıfırsa (Fnet = 0), cisim duruyorsa durmaya devam eder, hareket halindeyse sabit hızlı hareketini sürdürür.
2. Dinamiğin Temel Prensibi (F = m * a): Bir cisme net bir kuvvet etki ediyorsa, cisim bu kuvvet yönünde ivmeli hareket yapar. Kuvvet ile ivme doğru orantılıdır.
3. Etki - Tepki Yasası: Her etki kuvvetine karşı eşit büyüklükte ve zıt yönde bir tepki kuvveti oluşur (F_etki = -F_tepki). Tepki kuvveti daima temas yüzeyine diktir.

⛰️ Sürtünme Kuvveti ve Eğik Düzlem Soruları:
Sürtünme kuvveti (Fs), cismin hareket yönüne (veya hareket eğilimine) zıt yönde oluşur ve Fs = k * N formülüyle hesaplanır. Burada k sürtünme katsayısı, N ise yüzeye etki eden dik kuvvettir.
Eğik düzlemde ağırlığın (G = m * g) iki bileşeni vardır:
- Eğik düzleme paralel olan ve cismi aşağı çekmek isteyen kuvvet: G * sinθ
- Eğik düzleme dik olan ve tepki kuvvetini (N) dengeleyen kuvvet: G * cosθ

💡 Sınav Taktikleri:
Newton sorularını çözerken hata yapmamak için ilk yapmanız gereken şey cisimlerin üzerine etki eden tüm kuvvetleri gösteren "Serbest Cisim Diyagramı" çizmek olmalıdır. Kuvvetleri çizmeden denkleme geçmek hata olasılığını %80 artırır.`,
    hocaSlug: "mehmet-celik-fizik",
    hocaAd: "Mehmet Çelik"
  },
  {
    id: "6",
    slug: "kimyasal-tepkime-turleri-ve-hesaplamalar",
    baslik: "Kimyasal Tepkime Türleri, Denkleştirme ve Hesaplama Yöntemleri",
    ders: "Kimya",
    kategori: "YKS",
    ozet: "TYT Kimya konularından kimyasal tepkime türleri (yanma, asit-baz, sentez, analiz, çökelme) ve denkleştirme ile mol hesaplama formülleri.",
    icerik: `Kimyasal tepkimeler ve denklemler, kimya dersinin en temel konusudur. Maddelerin kimyasal değişimlerini ifade eden denklemleri denkleştirebilmek ve miktar geçişleri (mol hesaplamaları) yapabilmek sınavda net kazanmanın anahtarıdır.

🧪 En Çok Sorulan Kimyasal Tepkime Türleri:
1. Yanma Tepkimeleri: Maddelerin oksijen gazı (O₂) ile reaksiyona girmesidir. Organik bileşikler yandığında daima CO₂ ve H₂O açığa çıkar. Azotun yanması hariç tüm yanma olayları ekzotermiktir (ısı verir).
2. Asit - Baz (Nötrleşme) Tepkimeleri: Asit ile bazın tepkimeye girerek tuz ve su oluşturmasıdır. Net iyon denklemi suyun oluşumuna göre yazılır: H⁺ + OH⁻ -> H₂O.
3. Sentez (Birleşme) & Analiz (Ayrışma): İki veya daha fazla maddenin birleşerek tek bir madde oluşturmasına sentez; tek bir bileşiğin ısı veya elektrikle daha küçük maddelere parçalanmasına analiz denir.
4. Çözünme - Çökelme Tepkimeleri: İki sulu çözelti karıştırıldığında suda çözünmeyen bir katının (çökelti) oluşmasıdır.

🧮 Tepkime Hesaplama Adımları:
1. Adım: Verilen tepkime denkleminin denk olup olmadığını kontrol edin, denk değilse en küçük tamsayılarla denkleştirin.
2. Adım: Miktarı verilen maddeleri mutlaka 'Mol' (n = m / MA) birimine çevirin.
3. Adım: Tepkime katsayılarını kullanarak sorulan maddenin mol sayısına geçiş yapın. Katsayılar molekül geçiş oranlarını gösterir.`,
    hocaSlug: "kemal-turk-kimya",
    hocaAd: "Kemal Türk"
  },
  {
    id: "7",
    slug: "lgs-carpanlar-ve-katlar-ebob-ekok",
    baslik: "LGS Çarpanlar ve Katlar: EBOB-EKOK Yeni Nesil Soru Çözümleri",
    ders: "Matematik",
    kategori: "LGS",
    ozet: "LGS Matematik sınavının ilk ünitesi olan çarpanlar ve katlar, asal sayılar, EBOB ve EKOK kavramları ile yeni nesil mantık muhakeme soru taktikleri.",
    icerik: `LGS Matematik testinin ilk ve en kritik konularından biri Çarpanlar ve Katlar ünitesidir. Sınavda her yıl bu üniteden doğrudan 2 veya 3 adet yeni nesil (hikayeleştirilmiş) soru sorulmaktadır.

🔢 Temel Kavramlar:
- Çarpan (Bölen): Her pozitif tam sayı, iki pozitif tam sayının çarpımı olarak yazılabilir. Bu sayılara o sayının çarpanları denir.
- Asal Sayılar: Sadece 1'e ve kendisine bölünebilen, 1'den büyük doğal sayılardır (2, 3, 5, 7, 11, 13...). En küçük ve tek çift asal sayı 2'dir.
- Aralarında Asal Sayılar: 1'den başka ortak böleni olmayan pozitif tam sayılardır (Örn: 8 ile 15). Aralarında asal sayıların EBOB'u daima 1'e, EKOK'u ise bu sayıların çarpımına eşittir.

📐 EBOB ve EKOK Yeni Nesil Soru Ayrımı:
Öğrencilerin en çok zorlandığı nokta hangi soruda EBOB, hangisinde EKOK kullanacağını belirlemektir:
- EBOB (En Büyük Ortak Bölen): Büyük parçalardan küçük parçalar elde ediliyorsa, bölme, paylaştırma, eşit aralıklarla ağaç dikme veya kutulara doldurma varsa EBOB kullanılır.
- EKOK (En Küçük Ortak Kat): Küçük parçalar birleştirilerek daha büyük yapılar oluşturuluyorsa, zillerin birlikte çalması, nöbetleşe işler, cevizlerin veya bilyelerin sayılması varsa EKOK kullanılır.

💡 LGS Yeni Nesil Soru Taktikleri:
Yeni nesil sorularda şekilleri ve uzun paragrafları okurken hemen panik yapmayın. Önce verilen sayıların EBOB'unu mu yoksa EKOK'unu mu bulmanız gerektiğini belirleyip kenara yazın. Sorunun sonundaki 'en az' veya 'en fazla' ifadelerine çok dikkat edin.`,
    hocaSlug: "ahmet-yilmaz-matematik",
    hocaAd: "Ahmet Yılmaz"
  },
  {
    id: "8",
    slug: "lgs-dna-ve-genetik-kod-kalitim",
    baslik: "LGS DNA ve Genetik Kod, Mutasyon-Modifikasyon ve Kalıtım Kuralları",
    ders: "Fen Bilimleri",
    kategori: "LGS",
    ozet: "LGS Fen Bilimleri dersinin en çok soru getiren ünitesi DNA ve Genetik Kod yapısı, nükleotid eşleşmeleri, çaprazlamalar ve Mendel kalıtım kuralları.",
    icerik: `LGS Fen Bilimleri sınavında en yüksek soru ağırlığına sahip ünitelerin başında DNA ve Genetik Kod gelmektedir. Bu üniteyi anlamak kalıtım, adaptasyon ve biyoteknoloji konularının da kapısını açar.

🧬 DNA'nın Yapısı ve Nükleotidler:
- DNA (Deoksiribonükleik Asit), hücrenin yönetici molekülüdür ve çift iplikli sarmal yapıdadır.
- Temel yapı birimleri Nükleotidlerdir. Bir nükleotid; Fosfat + Deoksiriboz Şekeri + Organik Baz birleşimiyle oluşur.
- Organik bazlar 4 çeşittir: Adenin (A), Timin (T), Guanin (G) ve Sitozin (C). Eşleşme kuralına göre Adenin karşısına daima Timin (A=T), Guanin karşısına ise daima Sitozin (G≡C) gelir.
- DNA molekülünde toplam Fosfat sayısı = Şeker sayısı = Toplam Nükleotid sayısı = Toplam Organik Baz sayısıdır.

🧬 Kalıtım ve Çaprazlamalar (Mendel Yasaları):
- Karakterlerin anne ve babadan yavrulara aktarılmasına kalıtım denir.
- Baskın Gen (Dominant): Etkisini daima gösteren gendir, büyük harfle yazılır (A).
- Çekinik Gen (Resesif): Etkisini sadece saf döl durumunda gösterebilen gendir, küçük harfle yazılır (a).
- Saf Döl (Homozigot): Genotipin aynı özellikte olmasıdır (AA veya aa).
- Melez Döl (Heterozigot): Genotipin farklı özelliklerde olmasıdır (Aa).

💡 Sınav Sorusu Yakalama Taktikleri:
LGS'de çaprazlama sorularında sizden fenotip (dış görünüş) ve genotip (gen yapısı) oranları istenir. Heterozigot iki bezelyeyi çaprazladığınızda (Aa x Aa) oluşacak yavruların %75 baskın fenotipte, %25 ise çekinik fenotipte olacağını adınız gibi ezberleyin. Çekinik fenotipte bir yavru oluşuyorsa, anne ve babanın genotipinde kesinlikle en az bir tane çekinik gen (a) bulunmak zorundadır.`,
    hocaSlug: "zeynep-arslan-kimya-biyoloji",
    hocaAd: "Zeynep Arslan"
  }
];

export function getWikiBySlug(slug: string): WikiKonu | undefined {
  return wikiKonulari.find((w) => w.slug === slug);
}
