import type { BlogYazisi } from "@/types";

export const blogYazilari: BlogYazisi[] = [
  {
    id: "1",
    slug: "yks-matematik-hazirlik-rehberi",
    baslik: "YKS Matematik Hazırlık Rehberi: TYT'den AYT'ye Tam Plan",
    ozet: "TYT ve AYT Sayısal matematik konularını en verimli şekilde çalışmak için adım adım rehber. Hangi konudan başlamalı, ne kadar süre ayırmalı?",
    icerik: `YKS matematiği iki temel aşamadan oluşur: TYT (Temel Yeterlilik Testi) ve AYT (Alan Yeterlilik Testi). Bu iki sınav, yapısı ve ölçtüğü beceriler açısından birbirinden oldukça farklıdır. <a href="/hocalar?alan=Matematik" class="text-[#B45309] font-bold hover:underline">TYT Matematik</a> daha çok mantıksal akıl yürütme, problem çözme hızı ve temel matematiksel kavramları günlük hayat senaryolarına uygulama becerisini ölçerken; <a href="/hocalar?alan=Matematik" class="text-[#B45309] font-bold hover:underline">AYT Matematik</a> ise derinlemesine formül bilgisi, teorik analiz ve akademik matematik yeteneğini sorgular.

Verimli bir hazırlık süreci için şu adımları izlemelisiniz:

1. Temel İşlem Yeteneğini Kazanmak: Matematikte en büyük hatalar genellikle işlem hatası kaynaklıdır. Hazırlık sürecinin en başında rasyonel sayılar, üslü sayılar, köklü sayılar ve çarpanlara ayırma gibi temel konuları eksiksiz tamamlamalısınız. Bu konular sadece TYT'nin değil, aynı zamanda AYT'nin de temel yapı taşlarıdır.

2. Problemler Kampı Yapmak: TYT Matematik sınavının yaklaşık %30-35'ini problemler oluşturur. Problemlerde başarılı olmanın tek yolu düzenli olarak her gün soru çözmektir. Konu anlatımını bir kez tamamladıktan sonra her gün 20-30 problem sorusunu rutin haline getirmelisiniz. Denklem kurma, oran-orantı, yaş, karışım, işçi ve özellikle grafik problemleri üzerinde yoğunlaşmalısınız.

3. AYT Fonksiyon Temelini Sağlam Tutmak: AYT Matematik sınavının en önemli konusu hiç şüphesiz Fonksiyonlar'dır. Logaritma, Diziler, Limit, Türev ve İntegral konularının tamamı fonksiyon altyapısı üzerine inşa edilir. Fonksiyonların grafiklerini okumayı, tanım ve değer kümelerini analiz etmeyi öğrenmeden AYT çalışmalarına başlamak vakit kaybı olacaktır.

4. Geometriyi İhmal Etmemek: Hem TYT hem de AYT Matematik testlerinin içerisinde 10'ar adet Geometri sorusu yer almaktadır. Geometri, formülden ziyade görme becerisine dayalıdır. Üçgenler konusunu (açılar, benzerlik, alan) tam anlamıyla kavramadan çokgenler, çember veya analitik geometri konularına geçmemelisiniz. Geometride başarılı olmak için her gün en az 10 soru çözmeye özen göstermelisiniz.

5. Deneme Çözme Rutini Oluşturmak: Son 3 aya girildiğinde haftada en az bir genel TYT, iki haftada bir genel AYT denemesi çözülmelidir. Deneme sonrasında yapılan detaylı analizler, konu eksikliklerinizi saptamak için en güvenilir pusuladır. Yanlış yapılan soruların çözümleri mutlaka öğrenilmeli ve özel bir defterde saklanmalıdır.

6. Kaynak Çeşitliliği ve Soru Tipleri: Tek bir kaynağa bağlı kalmak gelişiminizi kısıtlar. Kolay, orta ve zor olmak üzere en az 3 farklı yayından soru tiplerini görmisini sağlamalısınız.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-05-15",
    kategori: "Çalışma Rehberleri",
    okumaSuresi: 8,
    resim: "/blog/matematik-rehber.jpg",
  },
  {
    id: "2",
    slug: "tyt-ayt-farki-nedir",
    baslik: "TYT ve AYT Farkı Nedir? Hangi Sınava Nasıl Çalışılır?",
    ozet: "YKS sistemini yeni öğrenenler için TYT ve AYT arasındaki temel farklar, puan türleri ve hangi bölüme hangi sınav sonucunun gerektiği.",
    icerik: `YKS (Yükseköğretim Kurumları Sınavı) iki temel oturumdan oluşur ve bu iki sınavın puan ağırlıkları ile çalışma metotları birbirinden tamamen farklıdır.

TYT (Temel Yeterlilik Testi):
YKS'nin birinci oturumudur ve tüm adayların (Sayısal, Sözel, Eşit Ağırlık, Dil) girmesi zorunludur. Toplam 120 sorudan oluşur ve 135 dakika süre verilir. TYT'de Türkçe (40 soru), Sosyal Bilimler (20 soru), Temel Matematik (40 soru) ve Fen Bilimleri (20 soru) yer alır. TYT daha çok bilgiyi kullanma, hızlı düşünme, okuduğunu anlama ve mantık yürütme becerilerini test eder. Zaman yönetimi bu sınavın en kritik başarı anahtarıdır.

AYT (Alan Yeterlilik Testi):
YKS'nin ikinci oturumudur ve adayın yerleşmek istediği lisans programına göre çözmesi gereken testlerden oluşur. Toplam 160 soru yer alır ancak aday sadece kendi alanına uygun olan 80 sorudan sorumludur (Örneğin Sayısal öğrencisi Matematik ve Fen Bilimleri testlerini çözer). Süre 180 dakikadır. AYT'de zaman sıkıntısı neredeyse hiç yaşanmaz çünkü bu sınav tamamen derin akademik bilgiyi, formülleri ve teoriyi ölçer. Bilmiyorsanız soruyu çözmeniz imkansızdır.

Çalışma Stratejisi Nasıl Olmalıdır?
Hazırlık sürecinin ilk yarısında (genellikle eylül-aralık ayları arasında) çalışmaların ağırlığı TYT konularına verilmelidir. Ancak bu dönemde dahi AYT'nin temeli olan fonksiyonlar, çarpanlara ayırma gibi konular paralel götürülmelidir. Ocak ayından itibaren ise çalışma süresinin en az %70-80'i AYT konularına ayrılmalıdır. Unutulmamalıdır ki yerleştirme puanının hesaplanmasında AYT'nin etkisi %60, TYT'nin etkisi ise %40'tır. Dolayısıyla AYT'yi ihmal eden bir öğrencinin hedeflediği yüksek puanlı bölümlere yerleşmesi çok zordur.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-05-10",
    kategori: "YKS Bilgi",
    okumaSuresi: 6,
    resim: "/blog/tyt-ayt.jpg",
  },
  {
    id: "3",
    slug: "yks-calisma-programi-nasil-yapilir",
    baslik: "Günlük YKS Çalışma Programı Nasıl Yapılır?",
    ozet: "Sınava kaç ay kaldığına göre değişen günlük çalışma programı önerileri. Molalar, ders sırası ve verim artırma teknikleri.",
    icerik: `Etkili ve sürdürülebilir bir YKS çalışma programı oluşturmak, hazırlık sürecinin en önemli adımıdır. Rastgele çalışmak, bir gün 8 saat çalışıp sonraki 3 gün hiç çalışmamak öğrencileri yıpratır ve verimi düşürür. Program hazırlarken dikkat edilmesi gereken altın kurallar şunlardır:

1. Gerçekçi Hedefler Belirleyin: Programınıza günde 10 saat çalışma yazmak kulağa hoş gelebilir ancak bunu istikrarlı bir şekilde uygulamak imkansızdır. Başlangıçta günde 4-5 saatlik verimli çalışmalar hedefleyin, kondisyonunuz arttıkça bu süreyi kademeli olarak yükseltin.

2. Pomodoro veya Blok Çalışma Yöntemi: Odaklanma sürenize göre çalışma blokları belirleyin. Örneğin 50 dakika ders çalışıp 10 dakika mola vermek (Blok Yöntemi) veya 25 dakika çalışıp 5 dakika mola vermek (Pomodoro Yöntemi) zihninizin sürekli zinde kalmasını sağlar. Molalarda telefondan ve sosyal medyadan uzak durmaya çalışın, aksi takdirde 5 dakikalık mola yarım saate uzayabilir.

3. Haftalık ve Aylık Değerlendirmeler: Her pazar günü o hafta çözdüğünüz soru sayılarını, bitirdiğiniz konuları ve girdiğiniz deneme sonuçlarını analiz edin. Eksik kaldığınız konuları belirleyip bir sonraki haftanın programına bu eksikleri kapatacak çalışma saatleri ekleyin.

4. Ders Dağılımını Dengeli Yapın: Aynı gün içinde sadece tek bir derse saatlerce yoğunlaşmak yerine, zihinsel yorgunluğu önlemek için sayısal ve sözel dersleri dengeli bir şekilde dağıtın. Örneğin sabah saatlerinde zihniniz en açıkken Matematik çalıştıysanız, öğleden sonra Coğrafya veya Türkçe Paragraf çalışmalarıyla programı çeşitlendirin.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-04-28",
    kategori: "Çalışma Teknikleri",
    okumaSuresi: 10,
    resim: "/blog/program.jpg",
  },
  {
    id: "4",
    slug: "yks-son-3-ay-kala-derece-yapilir-mi",
    baslik: "YKS Son 3 Ay Kala Sıfırdan Derece Yapılır mı? (Yol Haritası)",
    ozet: "Sınava az süre kala panikleyen öğrencilerin en çok arattığı kelime grubudur. Netleri hızla artıracak son aylar stratejisi.",
    icerik: `Sınava son 3 ay kala sıfırdan derece yapmak, tamamen disiplin, strateji ve zamanı en verimli şekilde kullanma becerisine bağlıdır. Bu dönemde klasik çalışma yöntemlerini bir kenara bırakıp tamamen 'hedef odaklı' bir yol haritası çizmelisiniz.

Son 3 ayda netlerinizi patlatacak adımlar:
1. Konu Eleme Stratejisi: Tüm müfredatı baştan sona çalışmaya çalışmak bu aşamada büyük bir hatadır. ÖSYM'nin son 10 yılda her sene kesinlikle sorduğu garanti konuları listelemelisiniz. Örneğin matematikten Problemler, Fonksiyonlar, Trigonometri ve Logaritma gibi her yıl yüksek soru getiren konulara odaklanmalısınız.
2. Çıkmış Sorular Analizi: Son 5 yılın TYT ve AYT çıkmış sorularını mutlaka süre tutarak çözmelisiniz. ÖSYM'nin dilini anlamak, denemelerdeki gereksiz zor sorularda vakit kaybetmenizi önler.
3. Bölüm Denemelerine Ağırlık Vermek: Genel denemelerin yanı sıra eksik olduğunuz alanlarda (örneğin sadece TYT Sosyal veya sadece AYT Matematik) her gün bölüm denemeleri çözmelisiniz. Analizlerin ardından yanlış yaptığınız konuları hemen o gün tekrar etmelisiniz.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-04-25",
    kategori: "Çalışma Rehberleri",
    okumaSuresi: 8,
    resim: "/blog/matematik-rehber.jpg",
  },
  {
    id: "5",
    slug: "lgs-yeni-nesil-matematik-sorulari-nasil-cozulur",
    baslik: "LGS Yeni Nesil Matematik Soruları Nasıl Çözülür? (Taktikler)",
    ozet: "LGS hazırlığındaki öğrencilerin ve velilerin en büyük korkusu olan yeni nesil matematik sorularını çözmenin ipuçları.",
    icerik: `LGS Matematik testindeki yeni nesil sorular, sadece formül bilmeyi değil, aynı zamanda okuduğunu anlama, görsel analiz ve mantıksal çıkarım yapma becerilerini de ölçer.

Yeni nesil sorularda başarıyı getiren teknikler:
1. Soruyu Küçük Parçalara Bölün: Karşınızda upuzun, yarım sayfalık bir soru olduğunda panik yapmayın. Soruyu cümle cümle okuyun ve her cümleden elde ettiğiniz matematiksel bilgiyi yan tarafa küçük notlar halinde yazın.
2. Görselleri ve Grafikleri İyi İnceleyin: Yeni nesil soruların çoğunda şema, tablo veya grafik bulunur. Çoğu zaman sorunun cevabı metinden ziyade bu görsellerin içinde gizlidir.
3. Denklem Kurma Altyapısını Geliştirin: Problemi çözebilmek için metindeki sözel ifadeleri cebirsel ifadelere dönüştürmeyi öğrenmelisiniz. 'Hangi sayının 3 katının 5 fazlası' gibi temel kalıpları çok iyi kavramış olmalısınız.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-04-18",
    kategori: "LGS Rehberliği",
    okumaSuresi: 9,
    resim: "/blog/turkce.jpg",
  },
  {
    id: "6",
    slug: "yks-netlerim-neden-artmiyor",
    baslik: "YKS Netlerim Neden Artmıyor? (Net Platosunu Aşmak)",
    ozet: "Özellikle 60-70 TYT net bandında tıkanan öğrencilerin düştüğü motivasyon kaybı ve çözüm yolları.",
    icerik: `Çalıştığınız halde netlerinizin belli bir seviyede çakılı kalması (Net Platosu) YKS hazırlık sürecinde her öğrencinin başına gelebilecek doğal bir durumdur. Bu eşiği aşmak için çalışma tarzınızda köklü değişiklikler yapmanız gerekir.

Net tıkanıklığını aşmak için şu yöntemleri deneyin:
1. Detaylı Yanlış Defteri Tutun: Son 5 denemenizi masaya yatırın. Yanlış yaptığınız veya boş bıraktığınız soruların hangi konulardan geldiğini tek tek yazın. Eğer sürekli aynı konulardan (örneğin Türkçe Anlatım Bozukluğu veya Matematik Olasılık) yanlış yapıyorsanız, o konuyu henüz öğrenmemişsiniz demektir.
2. Süre Yönetimi Analizi: Netlerinizin artmamasının sebebi bilgi eksikliği değil, süre yetiştirememe sorunu olabilir. Sınavda hangi derse kaç dakika harcadığınızı deneme esnasında kronometre ile ölçün.
3. Zorluk Seviyesini Değiştirin: Sürekli kolay veya orta seviye kaynaklardan soru çözmek gelişiminizi durdurur. Haftada en az bir adet zor seviye branş denemesi çözerek sınırlarınızı zorlayın.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-04-12",
    kategori: "Çalışma Teknikleri",
    okumaSuresi: 7,
    resim: "/blog/program.jpg",
  },
  {
    id: "7",
    slug: "ayt-esit-agirlikta-ilk-10-bin-icin-ders-siralamasi",
    baslik: "AYT Eşit Ağırlıkta İlk 10 Bin İçin Ders Çalışma Sıralaması",
    ozet: "Hukuk, psikoloji ve işletme hedefleyen eşit ağırlık öğrencileri için ders dağılumı ve haftalık deneme sıklığı.",
    icerik: `AYT Eşit Ağırlık alanında ilk 10 bin dereceyi hedefleyen bir öğrencinin başarısı, Matematik ile Edebiyat-Sosyal-1 testleri arasındaki kusursuz dengeye bağlıdır.

Derece getiren ders çalışma hiyerarşisi:
- Matematik Sizi Öne Geçirir: Eşit ağırlıkçılar arasında fark yaratan ders her zaman AYT Matematiktir. Edebiyatı herkes bir şekilde halledebilirken, matematikte 30+ net yapan öğrenciler doğrudan ilk 5 bine girmektedir.
- Edebiyat ve Tarih Çalışma Sırası: Edebiyat ezber gerektirdiği için hazırlık sürecinin başından sonuna kadar düzenli tekrarlarla götürülmelidir. Cumhuriyet Dönemi ve Divan Edebiyatı gibi yüksek soru getiren dönemlere özel kartlar hazırlayarak çalışmalısınız.
- Haftalık Plan: Haftada en az 3 gün AYT Matematik, 2 gün Edebiyat ve Tarih-Coğrafya çalışması yapmalısınız. Son 2 ay kala ise her gün 1 adet Eşit Ağırlık denemesi çözülmelidir.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-04-05",
    kategori: "Çalışma Rehberleri",
    okumaSuresi: 8,
    resim: "/blog/puan-hesap.jpg",
  },
  {
    id: "8",
    slug: "lgs-sozel-bolumde-full-yapmanin-yollari",
    baslik: "LGS Sözel Bölümde Full Yapmanın Yolları: Türkçe ve İnkılap",
    ozet: "LGS sözel testlerinde Türkçe, İnkılap Tarihi, Din Kültürü ve İngilizce derslerinden sıfır hata yapmanın ipuçları.",
    icerik: `LGS'de yüksek puanlı fen liselerini hedefleyen adaylar için sözel bölümü tam (full) netle tamamlamak çok büyük bir avantaj sağlar. Sözel derslerin katsayısı sayısal kadar yüksek görünmese de, standart sapma ve toplam puana etkisi yadsınamaz.

Sözel bölümü sıfır hata ile bitirmenin yolları:
1. Türkçe Sözel Mantık Soruları: Her yıl Türkçe testinde 2-3 adet sözel mantık ve muhakeme sorusu çıkar. Bu soruları çözmek için mutlaka tablo çizme tekniğini öğrenmeli ve verileri tabloya doğru yerleştirmelisiniz.
2. İnkılap Tarihinde Kavram Bilgisi: İnkılap Tarihi soruları sadece bilgi ezberi değil, aynı zamanda paragraf yorumlamadır. 'Milli egemenlik', 'milli bağımsızlık', 'mandacılık' gibi temel kavramları adınız gibi bilmelisiniz.
3. İngilizce Kelime Defteri: LGS İngilizce soruları tamamen kelime bilgisine dayalıdır. Her ünitedeki önemli kelimeleri küçük kartlara yazıp oda duvarınıza asarak her gün tekrar edebilirsiniz.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-03-29",
    kategori: "LGS Rehberliği",
    okumaSuresi: 7,
    resim: "/blog/turkce.jpg",
  },
  {
    id: "9",
    slug: "lgs-sayisal-bolum-suresi-nasil-verimli-kullanilir",
    baslik: "LGS Sayısal Bölüm Süresi Nasıl Verimli Kullanılır? (80 Dakika)",
    ozet: "LGS sayısal oturumundaki 80 dakikada matematik ve fen sorularını yetiştirme ve zamanı yönetme kılavuzu.",
    icerik: `LGS'nin sayısal oturumunda öğrencilere Matematik (20 soru) ve Fen Bilimleri (20 soru) için toplam 80 dakika süre verilir. Soru başına 2 dakika düşse de, yeni nesil matematik sorularının uzunluğu nedeniyle çoğu öğrenci süreyi yetiştiremez.

Zaman yönetimi için altın kurallar:
1. Fen Bilimleri Testinden Başlayın: Fen Bilimleri soruları matematiğe göre genellikle daha hızlı çözülür. İlk 20-25 dakikada Fen Bilimleri testini bitirip cebinize 20 net koyarak sınava başlamak, üzerinizdeki stresi azaltır ve matematiğe daha fazla süre kalmasını sağlar.
2. Turlama Tekniğini Uygulayın: İlk okumada karmaşık gelen, uzun hesaplama gerektiren matematik sorularıyla inatlaşmayın. Soruya yıldız koyup hemen bir sonraki soruya geçin. Kolay soruları bitirdikten sonra kalan sürede zor sorulara geri dönebilirsiniz.
3. Saat Kontrolü: Her 5 soruda bir optik forma işaretleme yaparken saate göz atın. Sürenin gerisinde kaldıysanız hızınızı ayarlayın.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-03-22",
    kategori: "LGS Rehberliği",
    okumaSuresi: 6,
    resim: "/blog/online-yuzyuze.jpg",
  },
  {
    id: "10",
    slug: "mezuna-kalmak-2-yilda-yks-nasil-kazanilir",
    baslik: "Mezuna Kalmak: 2. Yılda YKS Nasıl Kazanılır? (Mezun Rehberi)",
    ozet: "Sınav hedefine ulaşamayıp mezuna kalmaya karar veren adaylar için psikolojik ve teknik destek yazısı.",
    icerik: `Mezuna kalmak dünyanın sonu değil, tam aksine hatalarınızdan ders çıkararak hayalinizdeki üniversite ve bölüme yerleşmek için verilmiş ikinci bir şanstır. Ancak mezun yılında başarılı olmanın yolu, ilk sene yapılan hataları tekrarlamamaktan geçer.

Mezun yılında izlenmesi gereken stratejiler:
1. Dürüst Bir Öz eleştiri Yapın: İlk yıl neden başarısız olduğunuzu analiz edin. Yeterince ders çalışmadınız mı? Süre yönetimini mi yapamadınız? Yoksa bazı dersleri (örneğin Geometri veya Kimya) tamamen elediniz mi? Bu eksikleri netleştirip çalışma planınızı buna göre şekillendirin.
2. Konu Eksiğiniz Olmadığı Yanılgısından Kurtulun: Mezun öğrencilerin en büyük hatası 'ben bu konuyu biliyorum' diyerek konu anlatımlarını atlayıp sadece soru çözmeye çalışmaktır. Unuttuğunuz detaylar olabileceğini unutmayın, özellikle AYT konularını sıfırdan olmasa da hızlı bir konu tekrarıyla gözden geçirmelisiniz.
3. Sosyal Medya ve Çevre Detoksu: Mezun yılında arkadaşlarınızın üniversiteye gitmiş olması üzerinizde psikolojik baskı yaratabilir. Bu süreçte sosyal medyadan uzak durmak ve odağınızı sadece hedefinize kilitlemek ruh sağlığınız için en iyisidir.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-03-15",
    kategori: "Çalışma Teknikleri",
    okumaSuresi: 9,
    resim: "/blog/program.jpg",
  },
  {
    id: "11",
    slug: "lgs-calisma-programi-nasil-hazirlanir-ortaokul",
    baslik: "LGS Çalışma Programı Nasıl Hazırlanır? (8. Sınıf Özel)",
    ozet: "LGS adayları için okul dersleri, ödevler ve sınav hazırlığını dengede tutacak haftalık ders çalışma şablonu.",
    icerik: `LGS hazırlığı yürüten 8. sınıf öğrencilerinin en büyük zorluğu, okul yazılı sınavları, ev ödevleri ve LGS hazırlığını aynı anda yürütmektir. Planlı bir program olmadan bu yoğun tempoyu kaldırmak zordur.

Verimli bir LGS programının temel özellikleri:
1. Okul Sonrası Dinlenme Payı: Okuldan eve geldikten sonra hemen masaya oturmak yerine en az 1-1.5 saat dinlenmeli ve zihninizi boşaltmalısınız.
2. Günlük Soru Hedefleri: Sayısal derslerden (Matematik-Fen) günlük en az 30-40, sözel derslerden ise 40-50 soru çözmeyi hedefleyin. Soru sayısından ziyade, çözemediğiniz soruların doğru cevaplarını öğrenmek daha önemlidir.
3. Düzenli Paragraf Rutini: LGS Türkçe testinin neredeyse tamamı okuduğunu anlamadır. Programınızda her gün istisnasız 15-20 paragraf sorusu yer almalıdır.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-03-08",
    kategori: "LGS Rehberliği",
    okumaSuresi: 8,
    resim: "/blog/turkce.jpg",
  },
  {
    id: "12",
    slug: "lgs-velilerine-tavsiyeler-kaygi-yonetimi",
    baslik: "LGS Velilerine Tavsiyeler: Sınav Kaygısı ve Aile İçi İletişim",
    ozet: "LGS sürecinde anne ve babaların yapması gerekenler. Çocukları strese sokmadan destek olmanın yolları.",
    icerik: `LGS, sadece 8. sınıf öğrencileri için değil, tüm aile için stresli bir süreçtir. Anne ve babaların sınav sürecindeki tutumları, öğrencilerin başarısını ve psikolojisini doğrudan etkiler.

LGS velilerinin dikkat etmesi gereken önemli kurallar:
1. Kıyaslamalardan Uzak Durun: Çocuğunuzun deneme sonuçlarını komşunun, akrabanın veya sınıf arkadaşlarının netleriyle kıyaslamak çocukta değersizlik ve yetersizlik hissi yaratır. Kıyaslamayı sadece kendi geçmiş netleriyle yapmalısınız.
2. Sınavı Hayatın Merkezine Koymayın: Evdeki tüm sohbetlerin, planların ve günlük rutinlerin sadece LGS etrafında dönmesi çocuğun kaygı seviyesini tavan yaptırır. Sınav dışı konulara da evde yer açın.
3. Destekleyici Olun: Çocuğunuza sınav sonucu ne olursa olsun onu sevmeye devam edeceğinizi ve onun çabasının sizin için en değerli şey olduğunu hissettirin. Güven duygusu, sınav kaygısını en çok azaltan faktördür.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-03-01",
    kategori: "LGS Rehberliği",
    okumaSuresi: 7,
    resim: "/blog/online-yuzyuze.jpg",
  },
  // --- YENİ 28 YAZI (YKS VE LGS KONULARI) ---
  {
    id: "13",
    slug: "tyt-turkce-40-net-nasil-yapilir",
    baslik: "TYT Türkçe 40 Net Nasıl Yapılır? Paragraf Sırları",
    ozet: "Türkçe testinde süreyi kısaltarak fulleme başarısına ulaşmanın adımları ve kaynak tavsiyeleri.",
    icerik: `TYT Türkçe sınavında 40 nete ulaşmak, sadece dil bilgisi ezberlemekle değil, okuma kondisyonunu en üst seviyeye taşımakla mümkündür. 

1. Her Gün Düzenli Paragraf Çözümü: Türkçe fullemenin ilk kuralı, her gün istisnasız 20 paragraf sorusu çözmektir. Bu soruları çözerken mutlaka süre tutmalı ve dakikada ortalama 1 soru hızını yakalamalısınız.
2. Dil Bilgisini Hızla Bitirin: Ses bilgisi, yazım kuralları, noktalama işaretleri ve sözcük türleri gibi konular TYT'de garanti 7-8 soru getirir. Bu konuları ilk aylarda tamamlayıp sürekli denemeler üzerinden taze tutmalısınız.
3. Kitap Okuma Kültürü: Sadece soru çözmek yetmez; felsefi, bilimsel veya edebi metinler okumak karmaşık paragrafları tek seferde anlamanızı sağlar.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-02-25",
    kategori: "Çalışma Rehberleri",
    okumaSuresi: 7,
    resim: "/blog/turkce.jpg",
  },
  {
    id: "14",
    slug: "ayt-fizik-en-zor-konular-ve-cozumleri",
    baslik: "AYT Fizik En Zor Konular ve Çözüm Taktikleri",
    ozet: "Modern Fizik, Manyetizma ve Mekanik gibi zor konuların gözünüzü korkutmasını engelleyecek yöntemler.",
    icerik: `AYT Fizik, sayısal öğrencilerin en çok zorlandığı ve genellikle en düşük net ortalamasına sahip olan derstir. Formüllerin karmaşık yapısını mantığa oturtmak başarının anahtarıdır.

1. Mekanik Temeli: Vektörler, tork, denge ve dinamik konularını kavramadan elektrik veya dalga mekaniğine geçmeyiniz.
2. Görselleştirme Tekniği: Özellikle manyetizma ve elektrik alan sorularında sağ el kuralı gibi yöntemleri kağıt üzerinde çizerek hayal etmeye çalışın.
3. Formül Defteri Tutun: Fizikteki formülleri sadece ezberlemeyin, hangi değişkenin ne anlama geldiğini gösteren küçük not kartları oluşturun.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-02-18",
    kategori: "Çalışma Rehberleri",
    okumaSuresi: 8,
    resim: "/blog/matematik-rehber.jpg",
  },
  {
    id: "15",
    slug: "lgs-fen-bilimleri-deney-sorulari-analizi",
    baslik: "LGS Fen Bilimleri Deney ve Hipotez Soruları Nasıl Çözülür?",
    ozet: "LGS Fen testindeki bağımlı, bağımsız ve kontrol edilen değişken sorularının pratik analiz yöntemleri.",
    icerik: `LGS Fen Bilimleri sınavının neredeyse yarısı deneysel düzenekler ve hipotez test etme sorularından oluşur. Bu soruları çözebilmek için bilimsel yöntem basamaklarını iyi kavramak gerekir.

1. Değişkenleri Belirleyin: Soruda neyin değiştirildiğini (bağımsız değişken), buna bağlı olarak neyin etkilendiğini (bağımlı değişken) ve nelerin sabit tutulduğunu (kontrol edilen değişken) hemen kenara not edin.
2. Grafik Yorumlama: Deney sonuçlarının aktarıldığı sütun veya çizgi grafiklerini okurken eksen isimlerine çok dikkat edin.
3. Konu Altyapısı: Mevsimlerin oluşumu, DNA ve genetik kod, basınç gibi konuların deneysel yorumlarını bol bol çözerek hız kazanın.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-02-10",
    kategori: "LGS Rehberliği",
    okumaSuresi: 6,
    resim: "/blog/online-yuzyuze.jpg",
  },
  {
    id: "16",
    slug: "ayt-kimya-organik-kimyaya-nasil-calisilmali",
    baslik: "AYT Kimya: Organik Kimyaya Nasıl Çalışılmalı?",
    ozet: "AYT Kimya testinin en hacimli ve en çok soru getiren konusu Organik Kimya için çalışma önerileri.",
    icerik: `Organik Kimya, AYT Kimya sınavında 3 ila 4 soru getiren, kendi içinde apayrı kuralları olan geniş bir konudur. 

1. Karbon Kimyasına Giriş: Hibritleşme, sigma ve pi bağları, molekül geometrisi gibi temel konuları oturtmadan adlandırmaya geçmeyin.
2. IUPAC Adlandırma Kuralları: Bileşiklerin sistematik adlandırılması konusunu kurallarıyla birlikte bol bol pratik yaparak pekiştirin.
3. Fonksiyonel Gruplar: Alkoller, eterler, aldehitler, ketonlar ve karboksilik asitlerin genel özelliklerini gösteren karşılaştırmalı tablolar hazırlayın.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-02-02",
    kategori: "Çalışma Rehberleri",
    okumaSuresi: 8,
    resim: "/blog/puan-hesap.jpg",
  },
  {
    id: "17",
    slug: "yks-geometri-sifirdan-nasil-ogrenilir",
    baslik: "YKS Geometri Sıfırdan Nasıl Öğrenilir? Görme Sanatı",
    ozet: "Geometri dersinde 'ben göremiyorum' diyen öğrencilerin bu önyargıyı kırıp netlerini artıracak stratejileri.",
    icerik: `Geometri, kuralları ezberlemekten ziyade şekiller üzerindeki gizli bağlantıları görme becerisidir. Sıfırdan başlayan bir öğrencinin izlemesi gereken yol haritası şudur:

1. Doğruda ve Üçgende Açılar: Geometrinin alfabesidir. Bu konuyu bitirmeden sonraki hiçbir konuyu çözemezsiniz.
2. Özel Üçgenler: 30-60-90, 45-45-90 üçgenleri ve dik üçgendeki Öklid/Pisagor teoremleri tüm geometrinin kalbidir.
3. Bol Çizim Alıştırması: Soruda size hazır verilmeyen ek çizgileri (muhteşem üçlü, orta taban, paralel çizme) çizebilmek için bol bol pratik yapmalısınız.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-01-26",
    kategori: "Çalışma Rehberleri",
    okumaSuresi: 9,
    resim: "/blog/matematik-rehber.jpg",
  },
  {
    id: "18",
    slug: "sinav-kaygisiyla-bas-etme-yollari-rehber",
    baslik: "Sınav Kaygısıyla Baş Etme Yolları: Psikolojik Stratejiler",
    ozet: "Denemelerde ve gerçek sınavda kaygıyı kontrol altına alıp gerçek potansiyelinizi ortaya çıkarma yöntemleri.",
    icerik: `Sınav kaygısı, hazırlık sürecinde öğrencilerin en büyük engellerinden biridir. Belirli bir düzeyde kaygı odaklanmayı artırsa da, aşırı kaygı bildiklerinizi unutmanıza yol açar.

1. Nefes Egzersizleri: Sınav anında paniklediğinizde gözlerinizi 10 saniye kapatın ve derin diyafram nefesi alıp verin.
2. Olumsuz Düşünceleri Yönetin: 'Kazanamayacağım', 'her şey mahvolacak' yerine 'elimden gelenin en iyisini yapıyorum' cümlesini odak haline getirin.
3. Düzenli Deneme Provaları: Gerçek sınav ortamını (gürültü, optik form, süre) evde birebir canlandırarak beyninizi bu ortama alıştırın.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-01-18",
    kategori: "Çalışma Teknikleri",
    okumaSuresi: 7,
    resim: "/blog/program.jpg",
  },
  {
    id: "19",
    slug: "lgs-inkilap-tarihi-kodlama-ve-ezber-yontemleri",
    baslik: "LGS İnkılap Tarihi Kodlama ve Kolay Ezber Yöntemleri",
    ozet: "İnkılap Tarihi dersindeki olay sıralamalarını ve antlaşma maddelerini akılda tutmanın yolları.",
    icerik: `LGS İnkılap Tarihi dersi kronolojik düşünme ve neden-sonuç ilişkisi kurma yeteneğini ölçer. Kolay öğrenmek için şu yöntemleri kullanın:

1. Kronolojik Akış Şeması: Savaşları ve antlaşmaları tarih sırasına göre bir zaman çizgisi (timeline) çizerek çalışın.
2. Kısaltmalar ve Kodlamalar: Önemli antlaşmaların maddelerini veya kongre kararlarını akılda kalıcı kelimelerle kodlayın.
3. Kavram Analizleri: Sömürgecilik, milli irade, manda ve himaye gibi kavramların sorularda nasıl karşımıza çıktığını analiz edin.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-01-10",
    kategori: "LGS Rehberliği",
    okumaSuresi: 6,
    resim: "/blog/turkce.jpg",
  },
  {
    id: "20",
    slug: "yks-derece-ogrencilerinin-uyguladigi-5-sir",
    baslik: "YKS Derece Öğrencilerinin Uyguladığı 5 Altın Sır",
    ozet: "Her yıl ilk bine giren şampiyon öğrencilerin ortak çalışma alışkanlıkları ve rutinleri.",
    icerik: `YKS'de derece yapmak sadece zeka ile değil, doğru alışkanlıkları istikrarlı bir şekilde uygulamakla ilgilidir. Derece yapan öğrencilerin 5 ortak sırrı:

1. Hata Analizi: Derece öğrencileri doğru yaptıkları sorulardan çok yanlış yaptıkları soruların üzerine giderler.
2. Erken Başlamak: Müfredatı genellikle sınavdan 3-4 ay önce bitirip tamamen deneme aşamasına geçerler.
3. Düzenli Deneme Çözümü: Sadece son aylarda değil, tüm sene boyunca düzenli aralıklarla deneme çözerler.
4. Sosyal Medya Sınırı: Sınav senesinde dikkat dağıtıcı tüm uygulamaları sınırlandırırlar.
5. Uyku ve Beslenme Disiplini: Zihinsel enerjiyi korumak için biyolojik ritimlerine dikkat ederler.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-01-02",
    kategori: "Çalışma Teknikleri",
    okumaSuresi: 8,
    resim: "/blog/program.jpg",
  },
  {
    id: "21",
    slug: "lgs-matematik-carpanlar-ve-katlar-en-pratik-anlatim",
    baslik: "LGS Matematik: Çarpanlar ve Katlar En Pratik Anlatım",
    ozet: "LGS'nin ilk ve en önemli konusu olan Çarpanlar ve Katlar (EBOB-EKOK) soru tiplerinin çözümleri.",
    icerik: `Çarpanlar ve Katlar, LGS Matematik testinde her yıl en az 2 soru getiren ve diğer tüm konuların temelini oluşturan kritik bir ünitedir.

1. EBOB ve EKOK Ayrımı: Soruda parçadan bütüne gidiliyorsa (örn: fayans döşeme, nöbet tutma) EKOK; bütünden parçaya gidiliyorsa (örn: bidonlardaki yağları paylaştırma) EBOB kullanılır.
2. Aralarında Asallık: İki sayının 1'den başka ortak böleni olmaması durumudur. Aralarında asal sayıların EBOB'u 1, EKOK'u ise bu sayıların çarpımıdır.
3. Yeni Nesil Soru Çözümleri: Konuyu kavradıktan sonra hemen yeni nesil problem aşamasına geçerek pratik yapmalısınız.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-12-25",
    kategori: "LGS Rehberliği",
    okumaSuresi: 7,
    resim: "/blog/online-yuzyuze.jpg",
  },
  {
    id: "22",
    slug: "ayt-biyoloji-sistemler-nasil-calisilir",
    baslik: "AYT Biyoloji: Sistemler Konusuna Nasıl Çalışılmalı?",
    ozet: "İnsan fizyolojisi ve sistemler ünitesini ezberlemek yerine mantığını oturtarak çalışmanın yolları.",
    icerik: `Sistemler, AYT Biyoloji sınavının neredeyse yarısını oluşturan, en çok Latince kavram içeren hacimli ünitedir.

1. Şekil ve Görsel Üzerinden Çalışma: Kalp, böbrek veya nefron şeklini önünüze koyup organların çalışma mekanizmasını şekil üzerinden takip edin.
2. Karşılaştırmalı Tablolar: Hormonlar ve görevleri, sindirim enzimleri gibi karmaşık başlıkları karşılaştırmalı tablolarla sadeleştirin.
3. Günlük Hayat Bağlantısı: Hastalıklar ve sistem bozuklukları üzerinden konuları günlük yaşamla bağdaştırarak akılda kalıcılığı artırın.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-12-18",
    kategori: "Çalışma Rehberleri",
    okumaSuresi: 8,
    resim: "/blog/puan-hesap.jpg",
  },
  {
    id: "23",
    slug: "yks-edebiyat-yazar-eser-ezberleme-taktikleri",
    baslik: "YKS Edebiyat: Yazar-Eser Ezberleme Taktikleri",
    ozet: "AYT Edebiyat sınavında yüksek netler için yüzlerce yazar ve eseri akılda tutmanın hafıza teknikleri.",
    icerik: `AYT Edebiyat sınavının en büyük zorluğu çok sayıda yazar, eser ve dönem bilgisini hafızada tutmaktır. Bu süreci kolaylaştıracak taktikler:

1. Hikayeleştirme Yöntemi: Yazarın en önemli eserlerini komik veya ilginç bir hikayenin içinde birleştirerek ezberleyin.
2. Flashcard (Hafıza Kartları): Kartın ön yüzüne yazarın adını, arka yüzüne ise önemli eserlerini ve dönemini yazıp kendinizi test edin.
3. Dönem Özelliklerine Hakimiyet: Dönemin genel havasını (örn: Tanzimat 1. Dönem toplumcu çizgi) bilirseniz, yazarın eser içeriğini tahmin etmeniz kolaylaşır.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-12-10",
    kategori: "Çalışma Rehberleri",
    okumaSuresi: 8,
    resim: "/blog/turkce.jpg",
  },
  {
    id: "24",
    slug: "deneme-analizi-nasil-yapilir-excel-sablonu",
    baslik: "Detaylı Deneme Analizi Nasıl Yapılır? Netlerinizi İzleyin",
    ozet: "Deneme sınavlarındaki yanlışlarınızı analiz ederek eksik konularınızı tespit etmenin profesyonel yolu.",
    icerik: `Deneme çözmek sadece netinizi görmek için değil, eksiklerinizi ameliyat masasına yatırmak içindir. Doğru deneme analizi aşamaları:

1. Soru Defteri: Yanlış yaptığınız veya çözemediğiniz soruları kesip özel bir deftere yapıştırın ve yanına doğrusunu yazın.
2. Konu Analiz Tablosu: Hangi konulardan hata yaptığınızı listeleyin. 3 deneme üst üste aynı konudan yanlış çıkıyorsa o konuya acil dönüş yapın.
3. Süre Analizi: Sınavda hangi derse ne kadar süre ayırdığınızı ve süre yüzünden kaç soru kaçırdığınızı analiz edin.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-12-02",
    kategori: "Çalışma Teknikleri",
    okumaSuresi: 7,
    resim: "/blog/program.jpg",
  },
  {
    id: "25",
    slug: "lgs-turkce-paragrafta-anlam-sorulari-analizi",
    baslik: "LGS Türkçe: Paragrafta Anlam Soruları Çözüm Analizi",
    ozet: "LGS Türkçe sınavının temelini oluşturan paragraf, görsel okuma ve grafik yorumlama sorularının çözüm yolları.",
    icerik: `LGS Türkçe testinde başarılı olmanın anahtarı paragraf ve okuduğunu anlama sorularını firesiz tamamlamaktır.

1. Soru Kökünü İyi Okuyun: Önce soruyu okuyup ne aradığınızı bilerek paragrafa geçin. 'Değinilmemiştir', 'çıkarılamaz' gibi olumsuz köklere dikkat edin.
2. Kendi Yorumunuzu Katmayın: Paragrafta anlatılanlar sizin kişisel görüşünüze aykırı olsa bile sadece metne sadık kalarak çözün.
3. Görsel ve Tablo Okuma: LGS'de harita yorumlama, grafik okuma veya infografik analiz etme sorularını çözerken tüm lejantları dikkatle inceleyin.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-11-25",
    kategori: "LGS Rehberliği",
    okumaSuresi: 7,
    resim: "/blog/turkce.jpg",
  },
  {
    id: "26",
    slug: "tyt-coğrafya-harita-bilgisi-haritalarla-calisma",
    baslik: "TYT Coğrafya: Harita Bilgisi ve Dilsiz Harita Çalışması",
    ozet: "Coğrafya sorularını kaçırmamak için dilsiz harita çalışmaları ve dünya/Türkiye haritası okuma rehberi.",
    icerik: `TYT Coğrafya testinde her yıl en az 1 veya 2 soru doğrudan harita okuma becerisini ölçer. Harita çalışması yapmanın en verimli yolları:

1. Dilsiz Harita Kullanımı: Boş dünya ve Türkiye haritaları üzerine dağları, iklim tiplerini, önemli boğazları ve nüfus yoğunluğunu kendiniz çizin.
2. Önemli Hatlar: Ekvator çizgisi, dönenceler ve Türkiye'deki fay hatlarının geçtiği illeri zihninizde netleştirin.
3. Kavram-Lokasyon İlişkisi: Çöl ikliminin nerede olduğunu bilmek, o bölgelerdeki toprak ve bitki örtüsü sorularını da çözmenizi sağlar.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-11-18",
    kategori: "Çalışma Rehberleri",
    okumaSuresi: 8,
    resim: "/blog/puan-hesap.jpg",
  },
  {
    id: "27",
    slug: "yks-calisirken-odaklanma-ve-dikkat-daginikligi",
    baslik: "YKS Çalışırken Odaklanma ve Dikkat Dağınıklığı Çözümleri",
    ozet: "Ders masasında dikkati dağılan öğrenciler için dijital detoks, masa düzeni ve odaklanma yöntemleri.",
    icerik: `Ders çalışırken aklınızın sürekli başka yerlere gitmesi veya telefonunuza bakma isteği, verimi sıfıra indiren en büyük sorundur.

1. Dijital Detoks: Ders çalışırken telefonunuzu başka bir odaya bırakın veya tamamen kapatın. Bildirim sesleri odaklanma zincirinizi kırar.
2. Temiz ve Sade Masa: Çalışma masanızda sadece o an çalıştığınız dersin kaynağı ve kalemi olsun. Diğer kitapların yığılı olması zihinsel yorgunluk yaratır.
3. Pomodoro Tekniği: 25 dakika ders, 5 dakika mola şeklinde çalışarak beyninizi kısa süreli odaklanmalara alıştırın.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-11-10",
    kategori: "Çalışma Teknikleri",
    okumaSuresi: 7,
    resim: "/blog/program.jpg",
  },
  {
    id: "28",
    slug: "lgs-din-kulturu-kavramlar-ve-sureler-ezberi",
    baslik: "LGS Din Kültürü: Önemli Kavramlar ve Sureler Rehberi",
    ozet: "Din Kültürü dersinde fullemek için bilinmesi gereken kader, kaza, zekat kavramları ve ayet yorumlamaları.",
    icerik: `LGS Din Kültürü ve Ahlak Bilgisi testi bilgi ağırlıklı paragraf yorumlama sorularından oluşur. 

1. Kader ve Kaza Kavramları: Evrensel yasalar (fiziksel, biyolojik, toplumsal) arasındaki farkları ve bu yasaların ayetlerdeki karşılıklarını iyi öğrenin.
2. İbadetler: Zekat, sadaka, hac gibi ibadetlerin şartlarını ve toplumsal faydalarını analiz edin.
3. Sureler ve Anlamları: LGS müfredatında yer alan surelerin (örn: Maun Suresi, Ayetel Kürsi) genel mesajlarını ve hangi durumlardan bahsettiğini ezberleyin.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-11-02",
    kategori: "LGS Rehberliği",
    okumaSuresi: 6,
    resim: "/blog/online-yuzyuze.jpg",
  },
  {
    id: "29",
    slug: "ayt-matematik-limit-turev-integral-uclusu",
    baslik: "AYT Matematik: Limit, Türev ve İntegral Üçlüsüne Yol Haritası",
    ozet: "AYT sınavının en çok soru getiren ve belirleyici olan LTI (Limit-Türev-İntegral) konularına çalışma rehberi.",
    icerik: `AYT Matematik sınavında LTI (Limit, Türev, İntegral) üçlüsünden her yıl ortalama 8 ila 10 soru çıkmaktadır. Bu konuları halleden bir öğrenci doğrudan derece adayı olur.

1. Trigonometri ve Fonksiyon Altyapısı: Fonksiyon grafiklerini çizemeyen ve trigonometrik dönüşümleri bilmeyen bir öğrencinin türev ve integral yapması imkansızdır. Önce bu temeli tamamlayın.
2. Konu Sıralaması: Sırayı asla bozmayın. Limit ve süreklilik bitmeden türeve, türevin geometrik yorumu bitmeden de integrale geçmeyin.
3. Grafik Yorumlama Gücü: Türev grafiklerini analiz etme ve integralde alan hesaplama sorularında grafik çizim becerilerini geliştirin.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-10-25",
    kategori: "Çalışma Rehberleri",
    okumaSuresi: 10,
    resim: "/blog/matematik-rehber.jpg",
  },
  {
    id: "30",
    slug: "yks-sure-yetistirme-problemi-ve-taktikler",
    baslik: "YKS'de Süre Yetiştirme Problemi ve Hızlanma Taktikleri",
    ozet: "TYT sınavında yetiştiremeyen adaylar için ders ders süre planlama ve turlama tekniği.",
    icerik: `TYT sınavında en büyük rakibiniz soruların zorluğu değil, sürenin yetersizliğidir. 120 soruya 135 dakika verilen bu sınavda hızlanma taktikleri:

1. Turlama Tekniği: İlk okumada çözemediğiniz veya çok işlem gerektiren soruları işaretleyip geçin. Kolay soruları bitirip netlerinizi garantiledikten sonra bu sorulara geri dönün.
2. Ders Sıralaması: Sınava en güçlü olduğunuz dersten başlayın. Bu durum motivasyonunuzu artırır ve süre kontrolünü kolaylaştırır.
3. Kronometre ile Çalışma: Evde soru çözerken mutlaka yanınızda kronometre olsun. Soru başına 1 dakika veya 1.5 dakika sınırları koyarak hızınızı artırın.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-10-18",
    kategori: "Çalışma Teknikleri",
    okumaSuresi: 8,
    resim: "/blog/program.jpg",
  },
  {
    id: "31",
    slug: "lgs-ingilizce-kelime-ezberleme-yontemleri",
    baslik: "LGS İngilizce: Kelime Ezberleme ve Soru Çözüm Yolları",
    ozet: "LGS İngilizce testindeki kelime ağırlıklı yeni nesil soruları çözebilmek için hafıza teknikleri.",
    icerik: `LGS İngilizce soruları dil bilgisi kurallarından ziyade tamamen kelime bilgisi ve okuduğunu anlama üzerine kuruludur.

1. Kelime Kartları (Kutu Yöntemi): Yeni öğrendiğiniz kelimeleri küçük kartlara yazıp bir kutuya atın. Bilmediğiniz kelimeleri her gün tekrar edin.
2. Soru Kökü Analizi: 'According to the text', 'Which of the following is true' gibi sıkça çıkan soru kalıplarının anlamlarını çok iyi bilin.
3. Eş Anlamlı Kelimeler: Sorularda metindeki kelimelerin doğrudan aynısı değil, eş anlamlıları şıklarda yer alır. Kelimeleri eş anlamlılarıyla birlikte ezberleyin.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-10-10",
    kategori: "LGS Rehberliği",
    okumaSuresi: 6,
    resim: "/blog/online-yuzyuze.jpg",
  },
  {
    id: "32",
    slug: "tyt-kimya-kimyasal-turler-arasi-etkilesimler",
    baslik: "TYT Kimya: Kimyasal Türler Arası Etkileşimler Pratik Rehber",
    ozet: "Kimyanın en soyut ve en çok soru getiren konularından olan etkileşimleri şematik olarak öğrenme yolları.",
    icerik: `Kimyasal Türler Arası Etkileşimler, TYT Kimya testinde her yıl kesinlikle 1 soru getiren, aynı zamanda AYT Kimya konularının da temelini oluşturan bir ünitedir.

1. Güçlü ve Zayıf Etkileşimler Ayrımı: İyonik, kovalent ve metalik bağların güçlü; hidrojen bağı ve Van der Waals etkileşimlerinin zayıf bağlar olduğunu şematik olarak çizin.
2. Lewis Elektron Nokta Yapısı: Elementlerin son katman elektronlarına göre nokta yapılarını çizmeyi ve bağ oluşumlarını göstermeyi öğrenin.
3. Çözünme İlkesi: 'Benzer benzeri çözer' (polar maddeler polar çözücülerde, apolar maddeler apolar çözücülerde çözünür) kuralını ve suyun polar yapısını iyi kavrayın.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-10-02",
    kategori: "Çalışma Rehberleri",
    okumaSuresi: 8,
    resim: "/blog/puan-hesap.jpg",
  },
  {
    id: "33",
    slug: "ayt-matematik-trigonometriye-nasil-calisilmali",
    baslik: "AYT Matematik: Trigonometriye Nasıl Çalışılmalı? (Rehber)",
    ozet: "AYT Matematik testinde 4 soru getiren Trigonometri ünitesini sıfırdan öğrenme ve sadeleştirme yöntemleri.",
    icerik: `Trigonometri, AYT Matematik testinde en fazla soru getiren konulardan biridir ve limit-türev-integral ile doğrudan bağlantılıdır.

1. Birim Çember Mantığı: Trigonometrinin temelidir. Sinüs, kosinüs, tanjant ve kotanjant eksenlerinin birim çember üzerindeki yerlerini adınız gibi öğrenin.
2. Dönüşüm Formülleri: Toplam-fark ve yarım açı formüllerini ezberlemek yerine bol bol soru üzerinde uygulayarak pratikleşin.
3. Trigonometrik Denklemler: Çözüm kümelerini bulma kurallarını adım adım uygulayarak işlem hatası yapmamaya dikkat edin.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-09-25",
    kategori: "Çalışma Rehberleri",
    okumaSuresi: 9,
    resim: "/blog/matematik-rehber.jpg",
  },
  {
    id: "34",
    slug: "yks-hazirlik-surecinde-uyku-ve-beslenme-duzeni",
    baslik: "YKS Hazırlık Sürecinde Uyku ve Beslenme Düzeni Nasıl Olmalı?",
    ozet: "Hafızayı güçlendiren gıdalar, ideal uyku saatleri ve sınav senesinde fiziksel sağlığı koruma yolları.",
    icerik: `Ders çalışmak kadar önemli olan diğer bir husus da zihinsel ve fiziksel sağlığınızı korumaktır. Uyku ve beslenme düzeninin sınava etkisi:

1. İdeal Uyku Süresi: Günlük 7-8 saat uyku uyumaya özen gösterin. Uykusuzluk odaklanmayı ve bilgiyi geri çağırma hızını düşürür.
2. Zihin Açıcı Besinler: Omega-3 yönünden zengin balık, ceviz, fındık gibi kuruyemişler ve taze sebze meyve tüketimini artırın. Aşırı şekerli ve karbonhidratlı gıdalar uyku ve rehavet yapar.
3. Su Tüketimi: Yetersiz su tüketimi baş ağrısı ve halsizliğe yol açar. Günde en az 2 litre su içmeyi ihmal etmeyin.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-09-18",
    kategori: "Çalışma Teknikleri",
    okumaSuresi: 7,
    resim: "/blog/program.jpg",
  },
  {
    id: "35",
    slug: "lgs-matematik-koklu-sayilar-en-hizli-cozumler",
    baslik: "LGS Matematik: Köklü Sayılar Hızlı Çözüm Yolları",
    ozet: "LGS Matematik sınavında en çok hata yapılan konulardan köklü sayılarda tahmin etme ve dışarı çıkarma pratikleri.",
    icerik: `Köklü Sayılar, LGS Matematik testinde her yıl 2-3 soru getiren ve yeni nesil soru tiplerinde sıkça kullanılan bir ünitedir.

1. Tam Kare Sayılar: 1'den 20'ye kadar olan sayıların karelerini (1, 4, 9, 16, 25... 400) ezberleyin. Bu bilgi karekök dışına çıkarma işlemlerinde size inanılmaz hız kazandırır.
2. Yaklaşık Değer Bulma: Kareköklü bir sayının hangi iki tam sayı arasında olduğunu bulmayı çok iyi öğrenin. (Örn: √18 sayısı √16 ile √25 arasında yani 4 ile 5 arasındadır ve 4'e daha yakındır).
3. Köklü Sayılarda Toplama ve Çarpma: Çarpma işleminde kök içlerinin çarpıldığını, toplama işleminde ise sadece kök içleri aynı olan sayıların katsayılarının toplandığını unutmayın.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-09-10",
    kategori: "LGS Rehberliği",
    okumaSuresi: 7,
    resim: "/blog/online-yuzyuze.jpg",
  },
  {
    id: "36",
    slug: "tyt-tarih-ilk-turk-devletleri-konu-ozeti",
    baslik: "TYT Tarih: İlk Türk Devletleri Pratik Konu Özeti",
    ozet: "Tarih testinde yorumlama sorularını çözebilmek için bilinmesi gereken Göktürk, Uygur ve Hun devletleri bilgileri.",
    icerik: `TYT Tarih testinde İlk Türk Devletleri (İslamiyet Öncesi Türk Tarihi) ünitesinden her yıl 1 soru gelmektedir. Bu sorular genellikle kültür ve medeniyet özellikleri üzerinden yorumlama şeklindedir.

1. Kut İnancı ve Veraset Sistemi: Hükümdarlığın tanrı tarafından verildiğine inanılmasıdır. Bu inanç taht kavgalarına ve devletlerin kısa sürede yıkılmasına yol açmıştır.
2. Konargöçer Yaşam Tarzı: Türklerin hayvancılıkla uğraşması, taşınabilir sanat eserleri yapması ve hapis cezalarının kısa süreli olması konargöçer yaşamın bir sonucudur.
3. Uygurlar ve Yerleşik Hayat: Uygurlarla birlikte tarım, kalıcı mimari eserler, yazılı hukuk kuralları ve matbaa kullanımı başlamıştır. Bu fark soruların anahtarıdır.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-09-02",
    kategori: "Çalışma Rehberleri",
    okumaSuresi: 7,
    resim: "/blog/turkce.jpg",
  },
  {
    id: "37",
    slug: "yks-hazirliginda-sosyal-medya-ve-telefon-yonetimi",
    baslik: "YKS Hazırlığında Sosyal Medya ve Telefon Yönetimi",
    ozet: "Ders çalışırken dikkatinizi dağıtan sosyal medya uygulamalarını sınırlandırma ve odaklanma programları.",
    icerik: `Telefon bildirimleri ve sosyal medya uygulamaları (Instagram, TikTok, YouTube), YKS hazırlık sürecinde çalışma verimini düşüren en büyük engellerdir.

1. Uygulama Engelleyiciler: Ders çalışma saatlerinizde sosyal medya uygulamalarına erişimi kısıtlayan Forest veya Focus To-Do gibi uygulamaları kullanın.
2. Telefonu Uzaklaştırma: Ders çalışırken telefonunuzu uçak moduna alın veya tamamen sessize alıp gözünüzün görmeyeceği bir çekmeceye bırakın.
3. Planlı Sosyal Medya Süresi: Telefonu hayatınızdan tamamen çıkarmak yerine, günlük ders hedeflerinizi tamamladıktan sonra kendinize 30 dakikalık ödül sosyal medya süresi tanıyın.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-08-25",
    kategori: "Çalışma Teknikleri",
    okumaSuresi: 6,
    resim: "/blog/program.jpg",
  },
  {
    id: "38",
    slug: "lgs-hazirlik-velileri-icin-haftalik-kontrol-listesi",
    baslik: "LGS Hazırlık Velileri İçin Haftalık Kontrol Listesi",
    ozet: "Öğrencinin haftalık çalışma düzenini, deneme analizlerini ve psikolojik durumunu takip etme rehberi.",
    icerik: `LGS hazırlık sürecinde velilerin çocuklarına doğru şekilde rehberlik edebilmeleri için haftalık olarak takip etmeleri gereken kontrol listesi:

1. Deneme Analiz Kontrolü: Çocuğunuzun o hafta çözdüğü deneme sınavlarındaki yanlış soruların çözümlerini öğrenip öğrenmediğini kontrol edin. Sadece net sayısına odaklanmayın.
2. Soru Hedef Takibi: Haftalık çözülmesi hedeflenen soru sayılarına ne kadar ulaşıldığını aşırı baskıcı olmadan, destekleyici bir dille gözden geçirin.
3. Çalışma Ortamı Düzeni: Çocuğunuzun çalışma odasının sessiz, düzenli ve dikkati dağıtacak unsurlardan (tablet, oyun konsolu vb.) arındırılmış olduğundan emin olun.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-08-18",
    kategori: "LGS Rehberliği",
    okumaSuresi: 7,
    resim: "/blog/online-yuzyuze.jpg",
  },
  {
    id: "39",
    slug: "ayt-biyoloji-hucresel-solunum-ve-fotosentez",
    baslik: "AYT Biyoloji: Hücresel Solunum ve Fotosentez Özeti",
    ozet: "Biyolojinin en karmaşık moleküler konularından olan enerji dönüşümleri ünitesinin pratik özet şeması.",
    icerik: `Fotosentez, kemosentez ve hücresel solunum (oksijenli solunum, oksijensiz solunum, fermantasyon) konuları AYT Biyoloji sınavında her yıl en az 2 soru getiren önemli bir ünitedir.

1. ATP Üretim Yöntemleri: Fotofosforilasyon, substrat düzeyinde fosforilasyon ve oksidatif fosforilasyonun nerede ve nasıl gerçekleştiğini gösteren karşılaştırmalı bir şema çizin.
2. Fotosentez Reaksiyonları: Işığa bağımlı reaksiyonlar (grana) ile ışıktan bağımsız reaksiyonların (stroma) girdi ve çıktılarını öğrenin.
3. Solunum Evreleri: Glikoliz, Krebs döngüsü ve ETS (Elektron Taşıma Sistemi) evrelerinde üretilen ve tüketilen molekülleri listeleyin. Glikolizin tüm canlılarda sitoplazmada ortak olarak gerçekleştiğini unutmayın.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-08-10",
    kategori: "Çalışma Rehberleri",
    okumaSuresi: 9,
    resim: "/blog/puan-hesap.jpg",
  },
  {
    id: "40",
    slug: "yks-hazirliginda-motivasyon-kaybi-nasil-onlenir",
    baslik: "YKS Hazırlığında Motivasyon Kaybı Nasıl Önlenir?",
    ozet: "Kış aylarında veya netlerin düştüğü dönemlerde motivasyonunuzu yeniden kazanıp çalışmaya dönme yolları.",
    icerik: `YKS gibi uzun soluklu bir maratonda zaman zaman bıkkınlık hissetmek, masaya oturmak istememek veya motivasyon kaybı yaşamak son derece doğaldır. Önemli olan bu dönemleri hızla atlatabilmektir.

1. Neden Başladığınızı Hatırlayın: Hayalinizdeki üniversiteyi, kampüsü ve mesleği düşleyerek kendinize küçük hatırlatma notları yazıp çalışma masanıza asın.
2. Küçük Adımlarla Başlayın: Motivasyonunuz sıfırken 4 saat çalışmaya çalışmak yerine, kendinize 'sadece 15 dakika çalışacağım' hedefi koyun. Masaya oturduktan sonra gerisi genellikle kendiliğinden gelecektir.
3. Rutin Değişikliği: Hep aynı odada ve aynı masada çalışmaktan sıkıldıysanız, kütüphanelere gidin veya farklı çalışma gruplarına katılarak ortamınızı değiştirin.`,
    yazar: "Derslinex Editörü",
    tarih: "2025-08-02",
    kategori: "Çalışma Teknikleri",
    okumaSuresi: 7,
    resim: "/blog/program.jpg",
  }
];

export function getBlogBySlug(slug: string): BlogYazisi | undefined {
  return blogYazilari.find((b) => b.slug === slug);
}
