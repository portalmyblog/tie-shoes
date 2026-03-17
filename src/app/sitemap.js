import { getArticles } from '../lib/data';

export default function sitemap() {
  // Ganti URL ini dengan domain asli Anda saat sudah di-hosting
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const articles = getArticles();

  // Buat sitemap untuk semua artikel
  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/article/${article.keyword.replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...articleUrls,
  ];
}