export const SITE_NAME = "Derslinex";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://derslinex.com";
export const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905543831828";

export function waLink(mesaj?: string): string {
  const text = mesaj ? encodeURIComponent(mesaj) : encodeURIComponent("Merhaba, YKS hazırlık dersleri hakkında bilgi almak istiyorum.");
  return `https://wa.me/${WA_NUMBER}?text=${text}`;
}

export function waLinkHoca(hocaIsim: string, ders: string): string {
  const text = encodeURIComponent(`Merhaba, ${hocaIsim} hocadan ${ders} dersi almak istiyorum. Bilgi alabilir miyim?`);
  return `https://wa.me/${WA_NUMBER}?text=${text}`;
}

export function buildMetadata(params: {
  title: string;
  description: string;
  path: string;
  image?: string;
}) {
  const { title, description, path, image } = params;
  const url = `${SITE_URL}${path}`;
  const ogImage = image || `${SITE_URL}/og-image.png`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: "tr_TR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
  };
}
