const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');

const BASE_URL = 'https://makeprofiles.com';

 const distDir = fs.readdirSync(path.join(__dirname, 'dist'))[0];  
const sitemapPath = path.join(__dirname, 'dist', distDir, 'sitemap.xml');

const urls = [
  { url: '/', changefreq: 'weekly', priority: 1.0 }
];

const sitemapStream = new SitemapStream({ hostname: BASE_URL });
urls.forEach(route => sitemapStream.write(route));
sitemapStream.end();

streamToPromise(sitemapStream)
  .then(data => {
    fs.writeFileSync(sitemapPath, data.toString());
   })
  .catch(err => {
    console.error('Error generating sitemap', err);
  });