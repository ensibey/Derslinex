# 📌 Derslinex - Veritabanı & API Rehberi ve Yapılacaklar Listesi

Bu dosya, **Derslinex** projesinin tüm veritabanı (Prisma ORM) modellerini, mevcut API rotalarını ve gelecekteki veritabanı/API geliştirme adımlarını derli ve düzenli tutmak amacıyla oluşturulmuştur.

---

## 🗄️ 1. Veritabanı (Database Schema - Prisma) Haritası

Proje PostgreSQL veritabanı ile Prisma ORM kullanmaktadır (`prisma/schema.prisma`).

### 📋 Tablo (Model) Tanımları

| Model Adı | Açıklama | Anahtar Alanlar |
| :--- | :--- | :--- |
| **Student** | Öğrenci hesap bilgileri | `id`, `name`, `email`, `password`, `phone`, `avatar`, `status`, `isBanned` |
| **Teacher** | Öğretmen hesap bilgileri & özgeçmiş | `id`, `name`, `email`, `password`, `branch`, `egitim`, `ozgecmis`, `status`, `linkedin`, `youtube` |
| **Feedback** | Öğrencilerin öğretmenlere ilettiği randevu ve genel değerlendirmeler | `id`, `studentName`, `studentEmail`, `teacherId`, `teacherName`, `content`, `rating` |
| **LessonOffer** | Öğretmenin özel ders ilanları ve saatlik ücretleri | `id`, `teacherId`, `title`, `price`, `format` (online/yüz-yüze), `description` |
| **BlogPost** | Eğitmenlerin veya adminlerin yayınladığı blog yazıları | `id`, `title`, `slug`, `content`, `category`, `authorId`, `authorName` |
| **ChatRoom** | Öğrenci ve Öğretmen arasındaki 1-e-1 sohbet odaları | `id`, `studentId`, `studentName`, `teacherId`, `teacherName` |
| **ChatMessage** | Sohbet odasında gönderilen mesajlar | `id`, `roomId`, `senderId`, `senderRole` (student/teacher), `content` |
| **TeacherFAQ** | Öğretmenin profilinde yayınladığı Sıkça Sorulan Sorular | `id`, `teacherId`, `question`, `answer` |
| **LiveSession** | Oluşturulan canlı ders seansları (Daily.co / Jitsi) | `id`, `title`, `startTime`, `durationMinutes`, `roomUrl`, `status` (SCHEDULED, LIVE, ENDED, CANCELLED), `teacherId` |
| **SessionParticipant** | Derse kayıtlı / katılan öğrenciler (Yoklama takibi) | `id`, `sessionId`, `studentId`, `joinedAt`, `leftAt`, `isAttended` |
| **SessionResource** | Derse eklenen materyaller / PDF dokümanları | `id`, `sessionId`, `title`, `fileUrl` |
| **SessionFeedback** | Ders bitiminde öğretmenin öğrenciye verdiği not/ödev | `id`, `sessionId`, `teacherId`, `studentId`, `rating`, `comment`, `homeworkGiven` |

---

## 🌐 2. API Endpoints (Rotalar) Kataloğu

Tüm backend API endpoint'leri `src/app/api` klasörü altındadır.

### 🔑 Kimlik Doğrulama (Auth)
- `POST /api/auth/login/ogrenci` ➔ Öğrenci girişi yapar.
- `POST /api/auth/register/ogrenci` ➔ Yeni öğrenci hesabı oluşturur.
- `POST /api/auth/login/ogretmen` ➔ Öğretmen girişi yapar.
- `POST /api/auth/register/ogretmen` ➔ Yeni öğretmen başvurusu/kaydı oluşturur.

### 👤 Profil & Kullanıcı İşlemleri
- `POST /api/profil/ogrenci` ➔ Öğrenci bilgilerini günceller (Ad, telefon, avatar).
- `GET /api/profil/ogretmen` ➔ Tüm aktif öğretmenleri listeler veya `id` ile spesifik öğretmen getirir.
- `POST /api/profil/ogretmen` ➔ Öğretmen profil bilgilerini günceller.
- `GET /api/profil/ogretmen/dersler` ➔ Öğretmenin özel ders ilanlarını getirir.
- `POST /api/profil/ogretmen/dersler` ➔ Yeni özel ders ilanı açar.
- `DELETE /api/profil/ogretmen/dersler?id=...` ➔ Özel ders ilanını kaldırır.
- `GET /api/profil/ogretmen/faq` ➔ Öğretmenin SSS listesini getirir.
- `POST /api/profil/ogretmen/faq` ➔ Yeni SSS ekler.
- `DELETE /api/profil/ogretmen/faq?id=...` ➔ SSS siler.
- `GET /api/user/my-sessions` ➔ Kullanıcının yaklaşan/geçmiş canlı derslerini listeler.

### 💬 Mesajlaşma (Chat)
- `GET /api/chat/rooms` ➔ Kullanıcıya ait aktif sohbet odalarını getirir.
- `POST /api/chat/rooms` ➔ Öğrenci ile öğretmen arasında yeni sohbet odası başlatır.
- `GET /api/chat/messages?roomId=...` ➔ Sohbet odasının mesaj geçmişini getirir.
- `POST /api/chat/messages` ➔ Sohbet odasına yeni mesaj gönderir.

### ✍️ Blog Sistemi
- `GET /api/blog/public` ➔ Yayındaki blog yazılarını ve detaylarını getirir.
- `GET /api/blog/yazar?authorId=...` ➔ Öğretmenin kendi yazdığı blogları getirir.
- `POST /api/blog/yazar` ➔ Yeni blog yazısı yayınlar.
- `DELETE /api/blog/yazar?id=...` ➔ Blog yazısını siler.

### 📹 Canlı Dersler (Sessions)
- `POST /api/sessions/[sessionId]/join` ➔ Canlı derse katılma bağlantısını / token'ını üretir.
- `POST /api/sessions/[sessionId]/end` ➔ Dersi sonlandırır (Öğretmen yetkisi).
- `POST /api/sessions/[sessionId]/feedback` ➔ Ders bitimi öğrenciye değerlendirme/ödev girer.
- `GET /api/sessions/[sessionId]/calendar` ➔ Dersi takvime eklemek için `.ics` dosyası indirir.

### ⭐ Görüş & İletişim
- `GET /api/gorus` ➔ Tüm öğrenci görüşlerini listeler.
- `POST /api/gorus` ➔ Öğrencinin öğretmene randevu / değerlendirme mesajı göndermesi.
- `POST /api/iletisim` ➔ İletişim formu mesajını e-posta olarak iletir (Resend API).

### 🛡️ Yönetici (Admin) API'leri
- `GET /api/admin/users` ➔ Tüm öğrenci ve öğretmenleri getirir.
- `DELETE /api/admin/users` ➔ Kullanıcı hesabını veya görüşünü siler.
- `GET /api/admin/sessions` ➔ Tüm canlı ders seanslarını listeler.
- `POST /api/admin/sessions` ➔ Yeni canlı ders seansı tanımlar.
- `DELETE /api/admin/sessions` ➔ Ders seansını iptal eder.
- `GET /api/admin/blogs` ➔ Blog paylaşımlarını denetler.
- `GET /api/admin/lessons` ➔ Özel ders ilanlarını denetler.
- `GET /api/admin/status` ➔ Sistem özet sayısal istatistiklerini döner.

### ⏰ Cron & Webhooks
- `GET /api/cron/remind-sessions` ➔ Başlamasına 15 dk kalan dersler için otomatik e-posta gönderir.
- `POST /api/webhooks/daily` ➔ Daily.co video odası durum güncellemelerini yakalar.

---

## 📝 3. Veritabanı & API Bağlantıları Yapılacaklar Listesi (Action Plan)

### 🔴 Aşama 1: Güvenlik & Yetkilendirme (Kritik)
- [ ] **JWT / Server Session Entegrasyonu**: API isteklerinde istemciden gelen `x-user-id` header güvenliği yerine HTTP-Only Cookie + JWT token doğrulamasına geçilecek.
- [ ] **`ADMIN_SECRET` Middleware**: `/api/admin/*` altındaki tüm rotalar için admin token/secret doğrulaması zorunlu hale getirilecek.
- [ ] **Password Hashing (Bcrypt/Argon2)**: `src/lib/auth.ts` dosyasındaki düz SHA-256 şifreleme `bcryptjs` kütüphanesi ile güncellenecek.
- [ ] **API Key Güvenliği**: `src/lib/daily.ts` içinde yer alan hardcoded Daily.co API key'i kaldırılıp sadece `.env.local` üzerinden okunacak.

### 🟡 Aşama 2: Veritabanı İlişkileri & Bütünlük (Orta)
- [ ] **Prisma Foreign Key İlişkileri**: `Feedback` ve `LessonOffer` modelleri için `Teacher` ve `Student` ilişkileri `@relation` ile şemada sıkılaştırılacak.
- [ ] **E-posta & Bildirim Logları**: `NotificationLog` tablosu eklenerek gönderilen hatırlatma ve iletişim mailleri veritabanında arşivlenecek.
- [ ] **Pagination (Sayfalama)**: Büyük veri üreten `blogs`, `teachers` ve `messages` API'lerine `page` ve `limit` parametreleri eklenecek.

### 🟢 Aşama 3: Yeni Veritabanı Modelleri & Özellikler (İsteğe Bağlı)
- [ ] **Password Reset (Şifre Sıfırlama)**: `PasswordResetToken` tablosu eklenip "Şifremi Unuttum" e-posta akışı kurulacak.
- [ ] **Ödev & Dosya Yükleme**: `SessionResource` tablosu için Supabase Storage / S3 entegrasyonu tamamlanacak.
- [ ] **Canlı Ders Yoklama İstatistikleri**: `SessionParticipant` üzerindeki `joinedAt` ve `leftAt` süre farkı hesaplanıp katılım durumu (`isAttended`) otomatik işaretlenecek.

---
*Son Güncelleme: 29 Temmuz 2026*
