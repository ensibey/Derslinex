# 🔐 Derslinex — Güvenlik & Eksiklik Raporu
_Analiz tarihi: 29 Temmuz 2026_

---

## YAPILACAKLAR LİSTESİ

### 🔴 KRİTİK — Hemen Yapılmalı

- [ ] **Admin API Koruma** → `/api/admin/*` tüm endpoint'lere `ADMIN_SECRET` header kontrolü ekle  
  `src/app/api/admin/sessions/route.ts` | `src/app/api/admin/users/route.ts` | `src/app/api/admin/lessons/route.ts`
  ```ts
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  ```

- [ ] **Şifre Hashleme → bcrypt** → `src/lib/auth.ts` içindeki sabit salt'lı SHA-256'yı kaldır, `bcryptjs` kullan
  - Sabit salt `"derslinex_salt_key_12345"` güvensiz (rainbow table saldırısı riski)
  - Mevcut kullanıcıların şifrelerini migration ile güncelle
  ```ts
  import bcrypt from "bcryptjs";
  export const hashPassword = (p: string) => bcrypt.hashSync(p, 12);
  export const verifyPassword = (p: string, h: string) => bcrypt.compareSync(p, h);
  ```

- [ ] **Session Join/End Spoofing** → `userId` ve `role` body'den değil, sunucu taraflı token/session'dan alınmalı  
  `src/app/api/sessions/[sessionId]/join/route.ts` L18  
  `src/app/api/sessions/[sessionId]/end/route.ts` L18

- [ ] **Hardcoded API Key Kaldır** → `src/lib/daily.ts` L8'deki fallback API key sil, sadece `process.env.DAILY_API_KEY` kullan  
  `.gitignore`'da `.env` dosyasının bulunduğunu doğrula

- [ ] **Chat API Yetki Kontrolü** → `src/app/api/chat/messages/route.ts` — Herhangi biri herhangi bir room'u okuyabilir/yazabilir  
  - GET: Room üyeliği doğrula  
  - POST: `senderId` sahteciliğini engelle, içerik uzunluk sınırı ekle (max 2000 karakter)

- [ ] **Öğrenci Silme Mantık Hatası** → `src/app/api/admin/users/route.ts` L53-55  
  ```ts
  // YANLIŞ — tüm feedback'leri siliyor:
  await prisma.feedback.deleteMany({ where: { studentEmail: { not: null } } });
  // DOĞRU — sadece bu öğrenciye ait olanları sil:
  await prisma.feedback.deleteMany({ where: { studentId: userId } });
  ```

---

### 🟠 ORTA — Kısa Vadede Yapılmalı

- [ ] **Zod ile Input Validasyonu** → Tüm auth register/login route'larına şema doğrulaması ekle  
  - E-posta format kontrolü (`z.string().email()`)  
  - Şifre minimum 8 karakter (`z.string().min(8)`)  
  - Telefon format kontrolü  
  Etkilenen: `src/app/api/auth/register/ogrenci/route.ts`, `src/app/api/auth/register/ogretmen/route.ts`

- [ ] **Rate Limiting** → Login endpoint'lerine brute-force koruması ekle  
  Öneri: `@upstash/ratelimit` + `@upstash/redis` veya Vercel Edge Middleware  
  Etkilenen: `/api/auth/login/*`

- [ ] **CORS Yapılandırması** → `next.config.ts`'e izin verilen origin listesi ekle

- [ ] **Server-Side Session / JWT** → `localStorage`/`sessionStorage` yerine `iron-session` veya `next-auth` ile HTTP-only cookie tabanlı oturum yönetimi  
  - Mevcut: Kullanıcı bilgisi localStorage'da → XSS ile çalınabilir  
  - Hedef: `HttpOnly; Secure; SameSite=Strict` cookie

---

### 🟡 EKSİK ÖZELLİKLER — Orta Vadede

- [ ] **Şifre Sıfırlama** → "Şifremi Unuttum" akışı  
  - Kullanıcı e-posta girer → Resend ile sıfırlama linki gönder → Token ile şifre güncelle  
  - Yeni sayfalar: `/sifremi-unuttum` ve `/sifre-sifirla?token=...`

- [ ] **E-posta Doğrulama** → Kayıt sonrası e-posta onay linki gönder, onaylanmadan giriş yapılamaz

- [ ] **Profil Resmi Yükleme** → Öğretmen ve öğrenci profillerine avatar yükleme (Vercel Blob veya Cloudinary)

- [ ] **Admin Paneli Eksikleri**  
  - [ ] Öğrenci ders katılım geçmişi görüntüleme  
  - [ ] Öğretmen performans raporlama (toplam ders, ortalama rating)  
  - [ ] Sistem istatistikleri (toplam kayıt, günlük aktif kullanıcı, toplam ders)  
  - [ ] Blog yazılarını admin panelinden yönetme (onaylama, silme)

- [ ] **Bildirim Sistemi** → Yeni ders atandığında uygulama içi bildirim (e-posta var ama anlık bildirim yok)

- [ ] **Ödeme Entegrasyonu** → İyzico veya Stripe ile ücretli ders / abonelik sistemi

---

### 🔵 KOD KALİTESİ — Refactoring

- [ ] **`any` TypeScript Kullanımı** → `error: any` yerine `error: unknown` + `instanceof Error` kontrolü  
  Etkilenen: `src/app/api/admin/sessions/route.ts` L104, `src/app/api/sessions/[sessionId]/end/route.ts` L86

- [ ] **Ortak API Yardımcısı** → Tekrar eden try-catch ve hata dönüş bloklarını tek bir `apiHandler()` wrapper'a taşı

---

## 📋 ÖZET TABLOSU

| # | Sorun | Seviye | Durum |
|---|-------|--------|-------|
| 1 | Admin API auth yok | 🔴 Kritik | [ ] Bekliyor |
| 2 | Session join/end spoofing | 🔴 Kritik | [ ] Bekliyor |
| 3 | Sabit salt + SHA-256 | 🔴 Kritik | [ ] Bekliyor |
| 4 | API key hardcoded | 🔴 Kritik | [ ] Bekliyor |
| 5 | Chat API korumasız | 🔴 Kritik | [ ] Bekliyor |
| 6 | Feedback silme hatası | 🔴 Kritik | [ ] Bekliyor |
| 7 | Input validasyon yok | 🟠 Orta | [ ] Bekliyor |
| 8 | Rate limiting yok | 🟠 Orta | [ ] Bekliyor |
| 9 | CORS eksik | 🟠 Orta | [ ] Bekliyor |
| 10 | localStorage session | 🟠 Orta | [ ] Bekliyor |
| 11 | Şifre sıfırlama yok | 🟡 Eksik | [ ] Bekliyor |
| 12 | E-posta doğrulama yok | 🟡 Eksik | [ ] Bekliyor |
| 13 | Profil resmi yok | 🟡 Eksik | [ ] Bekliyor |
| 14 | Admin modül eksikleri | 🟡 Eksik | [ ] Bekliyor |
| 15 | Bildirim sistemi yok | 🟡 Eksik | [ ] Bekliyor |
| 16 | Ödeme sistemi yok | 🟡 Eksik | [ ] Bekliyor |
| 17 | `any` TypeScript | 🔵 Kod | [ ] Bekliyor |
| 18 | Ortak API wrapper yok | 🔵 Kod | [ ] Bekliyor |
