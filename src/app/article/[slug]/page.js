import { getArticleBySlug } from '../../../lib/data';
import Link from 'next/link';
import { getSettings } from '../../../lib/settings';

export default async function ArticlePage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-sans">
        <h1 className="text-3xl font-bold mb-4">Artikel tidak ditemukan</h1>
        <Link href="/" className="text-blue-600 hover:underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  const settings = getSettings();
  // --- LOGIKA KONTEN ARTIKEL & FALLBACK SNIPPET ---
  let contentHtml = article.ai_article;
  
  // Jika ai_article kosong atau tidak ada, kita buatkan artikel dari random snippet
  if (!contentHtml || contentHtml.trim() === "") {
    // Mengacak urutan web_results
    const shuffledResults = [...(article.web_results || [])].sort(() => 0.5 - Math.random());
    // Menggabungkan snippet menjadi paragraf-paragraf HTML
    contentHtml = shuffledResults.map(item => `<p>${item.snippet}</p>`).join('');
  }

  return (
    <main className="max-w-5xl mx-auto p-8 font-sans">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className={`flex-1 ${settings.sidebarScript ? 'lg:w-3/4' : 'w-full'}`}>
          <Link href="/" className="inline-block text-blue-600 font-medium hover:underline mb-8">
            &larr; Kembali ke Beranda
          </Link>
          
          <div className="mb-4">
            <Link href={`/?category=${article.category}`} className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full hover:bg-blue-200 transition-colors">
              {article.category}
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold capitalize mb-8 text-gray-900 leading-tight">
            {article.keyword}
          </h1>
          
          <article 
            className="text-gray-800 leading-relaxed text-lg [&>p]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-8 [&>ul]:mb-6 [&>ol]:list-decimal [&>ol]:pl-8 [&>ol]:mb-6 [&>li]:mb-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100"
            dangerouslySetInnerHTML={{ __html: contentHtml }} 
          />

          {/* --- ARTICLE SCRIPT (AdSense/Iklan di bawah artikel) --- */}
          {settings.articleScript && (
            <div className="my-8 w-full overflow-hidden flex justify-center" dangerouslySetInnerHTML={{ __html: settings.articleScript }} />
          )}

          <hr className="my-12 border-gray-200" />

          <h2 className="text-3xl font-bold mb-8 text-gray-800">Galeri & Referensi Terkait</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {article.image_urls && article.image_urls.map((url, index) => {
              const webData = article.web_results && article.web_results[index] ? article.web_results[index] : null;
              return (
                <div key={index} className="flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                  <img src={url} alt={webData ? webData.title : article.keyword} className="w-full h-48 object-cover" />
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-snug">{webData ? webData.title : article.keyword}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{webData ? webData.snippet : 'Tidak ada deskripsi tersedia.'}</p>
                    {webData && webData.link && (
                      <a href={webData.link} target="_blank" rel="noopener noreferrer" className="mt-auto inline-block text-blue-600 text-sm font-medium hover:underline">
                        Kunjungi Sumber &rarr;
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* --- SIDEBAR SCRIPT (IKLAN) --- */}
        {settings.sidebarScript && (
          <aside className="w-full lg:w-1/4 flex-shrink-0">
            <div className="sticky top-24 overflow-hidden" dangerouslySetInnerHTML={{ __html: settings.sidebarScript }} />
          </aside>
        )}
      </div>
    </main>
  );
}