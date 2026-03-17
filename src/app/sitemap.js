// app/sitemap.ts
import { getSettings } from '../lib/settings';
import { getArticles } from '../lib/data';

export default async function sitemap() {
  // 1. Ambil Base URL dari setting Admin (Database)
  const settings = getSettings();
  const baseUrl = settings?.site_url || 'https://domain-sementara.com';

  // 2. Ambil data dinamis artikel
  const articles = getArticles();

  // 3. Mapping data menjadi format sitemap
  const articleUrls = articles.map((article) => {
    const slug = article.keyword.replace(/\s+/g, '-');
    return {
      url: `${baseUrl}/article/${slug}`,
      lastModified: new Date(),
    };
  });

  // 4. Gabungkan URL statis (homepage) dengan URL dinamis
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/tentang-kami`,
      lastModified: new Date(),
    },
    ...articleUrls,
  ];
}
