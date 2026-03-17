export default function robots() {
  // Ganti URL ini dengan domain asli Anda saat sudah di-hosting (contoh: https://blogmodern.com)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Cegah Google mengindeks halaman admin
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}