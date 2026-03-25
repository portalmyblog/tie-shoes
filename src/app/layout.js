import './globals.css';
import { getSettings } from '../lib/settings';
import Navbar from '../components/Navbar';
import { Inter } from 'next/font/google';
import ScrollToTop from '../components/ScrollToTop';

// Inisialisasi font dari Google Fonts (Anda bisa menggantinya dengan Roboto, Poppins, dll)
const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata() {
  const settings = getSettings();
  
  // Otomatis mendeteksi kode verifikasi Google dari kolom Header Script
  let googleVerification;
  if (settings.headerScript) {
    const match = settings.headerScript.match(/google-site-verification["']\s*content=["']([^"']+)["']/i);
    if (match && match[1]) {
      googleVerification = match[1];
    }
  }

  const baseUrl = settings.site_url || 'https://domain-sementara.com';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: settings.title,
      template: `%s | ${settings.title}`
    },
    description: settings.description,
    verification: {
      google: googleVerification,
    },
    openGraph: {
      title: settings.title,
      description: settings.description,
      url: baseUrl,
      siteName: settings.title,
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.title,
      description: settings.description,
    }
  };
}

export default function RootLayout({ children }) {
  const settings = getSettings();

  return (
    <html lang="id">
      {/* Menerapkan font Inter dan mengubah background menjadi slate-100 */}
      <body className={`${inter.className} bg-slate-100 text-slate-900`}>
        {settings.headerScript && (
          <div dangerouslySetInnerHTML={{ __html: settings.headerScript }} />
        )}
        <Navbar settings={settings} />
        <ScrollToTop />
        {children}
        {settings.footerScript && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-center" dangerouslySetInnerHTML={{ __html: settings.footerScript }} />
        )}
      </body>
    </html>
  );
}
