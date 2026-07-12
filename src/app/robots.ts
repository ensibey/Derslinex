export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cgi-bin/", "/tmp/"],
    },
    sitemap: "https://derslinex.com/sitemap.xml",
  };
}
