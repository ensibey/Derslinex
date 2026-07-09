/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sadee.com.tr',
  generateRobotsTxt: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/api/*', '/studio/*'],
  additionalPaths: async () => [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/hocalar', changefreq: 'daily', priority: 0.9 },
    { loc: '/dersler', changefreq: 'weekly', priority: 0.8 },
    { loc: '/yks-hazirlik', changefreq: 'weekly', priority: 0.8 },
    { loc: '/blog', changefreq: 'daily', priority: 0.8 },
  ],
};
