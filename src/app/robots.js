// app/robots.ts
import { MetadataRoute } from 'next';
// Contoh fungsi untuk mengambil data dari database Anda
import { getSiteSettings } from '@/lib/db'; 

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Ambil pengaturan URL dari database
  const settings = await getSiteSettings(); 
  
  // Gunakan fallback URL jika admin belum mensettingnya
  const baseUrl = settings?.site_url || 'https://domain-sementara.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Sembunyikan halaman admin dari mesin pencari
    },
    // Masukkan baseUrl yang didapat dari database
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
