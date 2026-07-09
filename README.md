# Sadee Eğitim — Next.js 15 Projesi

## 🚀 Kurulum

```bash
npm install
cp .env.example .env.local   # Değişkenleri doldur
npm run dev                   # http://localhost:3000
```

## 📁 Proje Yapısı

```
src/
├── app/               # Next.js App Router sayfaları
│   ├── page.tsx       # Ana Sayfa
│   ├── hocalar/       # Hoca listesi + profil sayfaları
│   ├── dersler/       # Ders alanları
│   ├── blog/          # Blog yazıları
│   ├── yks-hazirlik/  # YKS bilgi merkezi
│   ├── iletisim/      # İletişim formu
│   ├── hakkimizda/    # Hakkımızda
│   ├── gizlilik/      # KVKK
│   └── kullanim-kosullari/
├── components/        # Paylaşılan bileşenler
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── WhatsAppButton.tsx
│   ├── TeacherCard.tsx
│   ├── SubjectCard.tsx
│   ├── FAQ.tsx
│   └── StarRating.tsx
├── data/              # ⚡ Mock veri — gerçek veriyle değiştir
│   ├── hocalar.ts     # Hoca profilleri
│   ├── dersler.ts     # Ders alanları
│   └── blog.ts        # Blog yazıları
├── lib/
│   └── utils.ts       # WhatsApp linkleri + SEO yardımcıları
└── types/
    └── index.ts       # TypeScript tipleri
```

## ✏️ Verileri Güncelleme

### Hoca ekle/değiştir → `src/data/hocalar.ts`
Her hocanın bir `slug` alanı var (URL için). Fotoğraf URL'si için:
- Ücretsiz placeholder: `https://ui-avatars.com/api/?name=İsim+Soyisim&background=1A56DB&color=fff`
- Gerçek fotoğraf: `/public/hocalar/isim-soyisim.jpg` olarak kaydet, src'yi güncelle

### WhatsApp numarasını güncelle → `.env.local`
```
NEXT_PUBLIC_WHATSAPP_NUMBER=905XXXXXXXXX
```

### Site URL → `.env.local`
```
NEXT_PUBLIC_SITE_URL=https://www.sadee.com.tr
```

## 🔒 Güvenlik Başlıkları
`next.config.ts` içinde yapılandırılmıştır:
- Content-Security-Policy
- X-Frame-Options: DENY
- HSTS
- Referrer-Policy

## 📈 SEO
- Her sayfa kendi `metadata` değerlerine sahip
- `src/lib/utils.ts` → `buildMetadata()` ile tutarlı SEO
- `next-sitemap` ile otomatik sitemap

## 🚀 Deploy (Vercel)
1. GitHub'a push et
2. Vercel'de repoyu bağla
3. Environment variables'ları ekle
4. Deploy!

## ⚠️ Yayın Öncesi Kontrol Listesi
- [ ] Tüm hoca verilerini gerçek bilgilerle güncelle
- [ ] WhatsApp numarasını ayarla
- [ ] .env.local dosyasını doldur
- [ ] Gizlilik politikasını avukata onayla
- [ ] Google Search Console'a ekle
- [ ] Google Analytics ID'yi ekle
