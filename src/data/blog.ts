import type { BlogYazisi } from "@/types";

export const blogYazilari: BlogYazisi[] = [
  {
    id: "1",
    slug: "yks-matematik-hazirlik-rehberi",
    baslik: "YKS Matematik Hazırlık Rehberi: TYT'den AYT'ye Tam Plan",
    ozet: "TYT ve AYT Sayısal matematik konularını en verimli şekilde çalışmak için adım adım rehber. Hangi konudan başlamalı, ne kadar süre ayırmalı?",
    icerik: `YKS matematiği iki temel aşamadan oluşur: TYT (Temel Yeterlilik Testi) ve AYT (Alan Yeterlilik Testi). Bu iki sınav, yapısı ve ölçtüğü beceriler açısından birbirinden oldukça farklıdır. TYT Matematik daha çok mantıksal akıl yürütme, problem çözme hızı ve temel matematiksel kavramları günlük hayat senaryolarına uygulama becerisini ölçerken; AYT Matematik ise derinlemesine formül bilgisi, teorik analiz ve akademik matematik yeteneğini sorgular.

Verimli bir hazırlık süreci için şu adımları izlemelisiniz:

1. Temel İşlem Yeteneğini Kazanmak: Matematikte en büyük hatalar genellikle işlem hatası kaynaklıdır. Hazırlık sürecinin en başında rasyonel sayılar, üslü sayılar, köklü sayılar ve çarpanlara ayırma gibi temel konuları eksiksiz tamamlamalısınız. Bu konular sadece TYT'nin değil, aynı zamanda AYT'nin de temel yapı taşlarıdır.

2. Problemler Kampı Yapmak: TYT Matematik sınavının yaklaşık %30-35'ini problemler oluşturur. Problemlerde başarılı olmanın tek yolu düzenli olarak her gün soru çözmektir. Konu anlatımını bir kez tamamladıktan sonra her gün 20-30 problem sorusunu rutin haline getirmelisiniz. Denklem kurma, oran-orantı, yaş, karışım, işçi ve özellikle grafik problemleri üzerinde yoğunlaşmalısınız.

3. AYT Fonksiyon Temelini Sağlam Tutmak: AYT Matematik sınavının en önemli konusu hiç şüphesiz Fonksiyonlar'dır. Logaritma, Diziler, Limit, Türev ve İntegral konularının tamamı fonksiyon altyapısı üzerine inşa edilir. Fonksiyonların grafiklerini okumayı, tanım ve değer kümelerini analiz etmeyi öğrenmeden AYT çalışmalarına başlamak vakit kaybı olacaktır.

4. Geometriyi İhmal Etmemek: Hem TYT hem de AYT Matematik testlerinin içerisinde 10'ar adet Geometri sorusu yer almaktadır. Geometri, formülden ziyade görme becerisine dayalıdır. Üçgenler konusunu (açılar, benzerlik, alan) tam anlamıyla kavramadan çokgenler, çember veya analitik geometri konularına geçmemelisiniz. Geometride başarılı olmak için her gün en az 10 soru çözmeye özen göstermelisiniz.

5. Deneme Çözme Rutini Oluşturmak: Son 3 aya girildiğinde haftada en az bir genel TYT, iki haftada bir genel AYT denemesi çözülmelidir. Deneme sonrasında yapılan detaylı analizler, konu eksikliklerinizi saptamak için en güvenilir pusuladır. Yanlış yapılan soruların çözümleri mutlaka öğrenilmeli ve özel bir defterde saklanmalıdır.

6. Kaynak Çeşitliliği ve Soru Tipleri: Tek bir kaynağa bağlı kalmak gelişiminizi kısıtlar. Kolay, orta ve zor olmak üzere en az 3 farklı yayından soru tiplerini görmelisiniz. Özellikle son dönemlerde ÖSYM'nin sorduğu yeni nesil, görsel yorumlama ve akıl yürütme sorularına yönelik özel soru bankaları çözülmelidir.`,
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
Hazırlık sürecinin ilk yarısında (genellikle eylül-aralık ayları arasında) çalışmaların ağırlığı TYT konularına verilmelidir. Ancak bu dönemde dahi AYT'nin temeli olan fonksiyonlar, çarpanlara ayırma gibi konular paralel götürülmelidir. Ocak ayından itibaren ise çalışma süresinin en az %70-80'i AYT konularına ayrılmalıdır. Unutulmamalıdır ki yerleştirme puanının hesaplanmasında AYT'nin etkisi %60, TYT'nin etkisi ise %40'tır. Dolayısıyla AYT'yi ihmal eden bir öğrencinin hedeflediği yüksek puanlı bölümlere yerleşmesi çok zordur.

Puan Türlerinin Dağılımı ve Etkileri:
Adaylar TYT puanı ile sadece ön lisans (2 yıllık) programlarını ve özel yetenek bölümlerini tercih edebilirler. Mühendislik, Tıp, Hukuk, Mimarlık, Öğretmenlik gibi 4 yıllık lisans programlarına yerleşebilmek için ilgili AYT puan türünde (Sayısal, Eşit Ağırlık, Sözel veya Dil) barajı aşarak yüksek puan almak şarttır. Bu doğrultuda çalışma planınızı kendi alanınızın katsayı ağırlıklarına göre dizayn etmelisiniz.`,
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

4. Ders Dağılımını Dengeli Yapın: Aynı gün içinde sadece tek bir derse saatlerce yoğunlaşmak yerine, zihinsel yorgunluğu önlemek için sayısal ve sözel dersleri dengeli bir şekilde dağıtın. Örneğin sabah saatlerinde zihniniz en açıkken Matematik çalıştıysanız, öğleden sonra Coğrafya veya Türkçe Paragraf çalışmalarıyla programı çeşitlendirin.

5. Uyku ve Dinlenme Düzeni: Beynin gün boyu öğrenilen bilgileri uzun süreli hafızaya kaydedebilmesi için günde ortalama 7-8 saat kaliteli uyku uyumak şarttır. Gece geç saatlere kadar ders çalışıp uyku düzenini bozmak, ertesi günkü odaklanma becerinizi %30 oranında düşürecektir. Hafta sonlarında kendinize yarım gün tamamen serbest zaman ayırarak zihinsel deşarj sağlayın.`,
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
3. Bölüm Denemelerine Ağırlık Vermek: Genel denemelerin yanı sıra eksik olduğunuz alanlarda (örneğin sadece TYT Sosyal veya sadece AYT Matematik) her gün bölüm denemeleri çözmelisiniz. Analizlerin ardından yanlış yaptığınız konuları hemen o gün tekrar etmelisiniz.
4. Yanlış Analizi ve Nokta Atışı Tekrarlar: Çözdüğünüz her denemenin ardından yanlış yaptığınız 3 konuyu tespit edip, ertesi gün bu konuların kısa özetlerini okuyup 20'şer adet pekiştirme sorusu çözün. Bu taktikle netleriniz son 90 günde haftalık 3-4 net oranında düzenli artış gösterecektir.`,
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
3. Denklem Kurma Altyapısını Geliştirin: Problemi çözebilmek için metindeki sözel ifadeleri cebirsel ifadelere dönüştürmeyi öğrenmelisiniz. 'Hangi sayının 3 katının 5 fazlası' gibi temel kalıpları çok iyi kavramış olmalısınız.
4. Şıklardan Gitme ve Eleme Yöntemi: Yeni nesil sorularda işlemler çok karmaşıklaştığında veya çıkmaza girdiğinizde seçenekleri analiz edin. Bazı sorularda şıkları denklemde yerine koymak veya mantıksal sınırlar dahilinde eleme yapmak cevaba 30 saniyede ulaşmanızı sağlar.
5. Her Gün En Az 15 Yeni Nesil Soru Rutini: Yeni nesil soru çözme becerisi bir gecede kazanılmaz. Her gün düzenli olarak çözemediğiniz soruların video çözümlerini izleyip mantığını kavrayarak pratik yapmalısınız.`,
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
3. Zorluk Seviyesini Değiştirin: Sürekli kolay veya orta seviye kaynaklardan soru çözmek gelişiminizi durdurur. Haftada en az bir adet zor seviye branş denemesi çözerek sınırlarınızı zorlayın.
4. Odaklanma Hatalarını Ayıklamak: Sınav esnasında yaptığınız basit işlem ve dikkat hataları genellikle yorgunluk ve odaklanma eksikliğindendir. Sınavın ilk 30 dakikası ile son 30 dakikası arasındaki yanlış oranınızı kıyaslayın. Eğer son dakikalarda yanlışlarınız artıyorsa kondisyon denemeleri çözmelisiniz.`,
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
- Haftalık Plan: Haftada en az 3 gün AYT Matematik, 2 gün Edebiyat ve Tarih-Coğrafya çalışması yapmalısınız. Son 2 ay kala ise her gün 1 adet Eşit Ağırlık denemesi çözülmelidir.
- Coğrafya-1 ve Tarih-1 Katsayı Avantajı: Sosyal bilimler testinde çıkacak 10 Tarih ve 6 Coğrafya sorusu yüksek standart sapmaya sahiptir. Bu soruları kaçırmamak adına harita okuma ve kronoloji alıştırmaları yapmayı ihmal etmeyin.`,
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
3. İngilizce Kelime Defteri: LGS İngilizce soruları tamamen kelime bilgisine dayalıdır. Her ünitedeki önemli kelimeleri küçük kartlara yazıp oda duvarınıza asarak her gün tekrar edebilirsiniz.
4. Okuma Alışkanlığı ve Dikkat Kontrolü: LGS sözel soruları oldukça uzun metinlerden oluşur. Sınav esnasında dikkatin dağılmasını önlemek amacıyla her gün en az 30 sayfa kitap okumayı alışkanlık haline getirmeli ve uzun paragrafları tek okumada anlamaya çalışmalısınız.`,
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
3. Saat Kontrolü: Her 5 soruda bir optik forma işaretleme yaparken saate göz atın. Sürenin gerisinde kaldıysanız hızınızı ayarlayın.
4. Optik İşaretleme Stratejisi: Soruları tek tek kodlamak yerine sayfa sayfa kodlamayı tercih edin. Bu yöntem hem dikkat dağılmasını engeller hem de zamandan tasarruf sağlar. Asla tüm kodlamaları sınavın son 5 dakikasına bırakmayın.`,
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
3. Sosyal Medya ve Çevre Detoksu: Mezun yılında arkadaşlarınızın üniversiteye gitmiş olması üzerinizde psikolojik baskı yaratabilir. Bu süreçte sosyal medyadan uzak durmak ve odağınızı sadece hedefinize kilitlemek ruh sağlığınız için en iyisidir.
4. Haftalık Deneme Takvimi Kurmak: Mezun öğrenciler için en büyük avantaj tüm günün onlara ait olmasıdır. Eylül ayından itibaren haftada 1, ocak ayından itibaren haftada 2, nisan ayından itibaren ise her gün deneme çözerek pratik eksikliğinizi tamamen kapatmalısınız.`,
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
3. Düzenli Paragraf Rutini: LGS Türkçe testinin neredeyse tamamı okuduğunu anlamadır. Programınızda her gün istisnasız 15-20 paragraf sorusu yer almalıdır.
4. Yazılı Sınav Dönemlerinde Esneklik: Okul yazılılarının olduğu haftalarda LGS soru hedeflerinizi yarıya indirerek okul derslerinize odaklanın. Okul not ortalamasının da LGS yerleştirmelerinde kritik durumlarda belirleyici olduğunu unutmayın.`,
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
3. Destekleyici Olun: Çocuğunuza sınav sonucu ne olursa olsun onu sevmeye devam edeceğinizi ve onun çabasının sizin için en değerli şey olduğunu hissettirin. Güven duygusu, sınav kaygısını en çok azaltan faktördür.
4. Profesyonel Yardım Almaktan Çekinmeyin: Eğer sınav kaygısı çocuğunuzun uykusunu, beslenmesini ve günlük yaşam aktivitelerini bozacak düzeye geldiyse bir rehber öğretmen veya psikologdan yardım almayı ihmal etmeyin.`,
    yazar: "Derslinex Editörü",
    tarih: "2026-03-01",
    kategori: "LGS Rehberliği",
    okumaSuresi: 7,
    resim: "/blog/online-yuzyuze.jpg",
  }
];

export function getBlogBySlug(slug: string): BlogYazisi | undefined {
  return blogYazilari.find((b) => b.slug === slug);
}
