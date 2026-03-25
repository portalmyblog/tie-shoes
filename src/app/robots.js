// app/robots.ts
import { getSettings } from '../lib/settings';

export default async function robots() {
  // Ambil pengaturan URL dari database
  const settings = getSettings(); 
  
  // Gunakan fallback URL jika admin belum mensettingnya
  const baseUrl = settings?.site_url || 'https://domain-sementara.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/*?search='], // Sembunyikan halaman admin dan hasil pencarian dari mesin pencari
    },
    // Masukkan baseUrl yang didapat dari database
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
