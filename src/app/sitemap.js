// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getSiteSettings, getProducts } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Ambil Base URL dari setting Admin (Database)
  const settings = await getSiteSettings();
  const baseUrl = settings?.site_url || 'https://domain-sementara.com';

  // 2. Ambil data dinamis lainnya (misal: produk/artikel)
  const products = await getProducts();

  // 3. Mapping data menjadi format sitemap
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/produk/${product.slug}`,
    lastModified: product.updatedAt,
  }));

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
    ...productUrls,
  ];
}
