import { getArticles } from '../lib/data';
import Link from 'next/link';
import { getSettings } from '../lib/settings';

export default async function Home({ searchParams }) {
  const articles = getArticles();
  const settings = getSettings();
  
  // --- LOGIKA PAGINATION ---
  // Menunggu searchParams (standar Next.js terbaru)
  const params = await searchParams;
  // Mengambil nomor halaman dari URL (?page=2), default ke 1
  const currentPage = parseInt(params?.page) || 1;
  const searchQuery = params?.search?.toLowerCase() || '';
  const selectedCategory = params?.category || '';
  const itemsPerPage = 5; // Jumlah artikel per halaman (Bisa Anda ganti)
  
  // Kumpulkan semua kategori unik dari data
  const categories = ['Semua', ...new Set(articles.map(a => a.category))];

  // Filter artikel berdasarkan pencarian & kategori
  let filteredArticles = articles;
  if (searchQuery) {
    filteredArticles = filteredArticles.filter(article => article.keyword.toLowerCase().includes(searchQuery));
  }
  if (selectedCategory && selectedCategory !== 'Semua') {
    filteredArticles = filteredArticles.filter(article => article.category === selectedCategory);
  }

  // Menghitung total halaman
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
  
  // Memotong array artikel sesuai halaman yang sedang aktif
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  return (
    <main className="max-w-5xl mx-auto p-8 font-sans">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{settings.title}</h1>
        <p className="text-lg text-gray-600">{settings.description}</p>
      </div>

      {searchQuery && (
        <div className="mb-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-center border border-blue-100">
          Menampilkan hasil pencarian untuk: <strong className="font-bold">"{params.search}"</strong>
          <br/>
          <Link href="/" className="text-sm underline mt-2 inline-block hover:text-blue-600">Hapus Pencarian</Link>
        </div>
      )}
      
      {/* --- MENU KATEGORI --- */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map(cat => (
          <Link
            key={cat}
            href={cat === 'Semua' ? '/' : `/?category=${cat}`}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              (selectedCategory === cat || (cat === 'Semua' && !selectedCategory))
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      <div className="grid gap-8">
        {currentArticles.length === 0 && (
          <div className="text-center text-gray-500 py-10 bg-white border border-gray-200 rounded-xl shadow-sm">
            Tidak ada artikel yang cocok dengan pencarian "{params.search}".
          </div>
        )}
        {currentArticles.map((article, index) => {
          const slug = article.keyword.replace(/\s+/g, '-');
          
          // --- LOGIKA CUPLIKAN (EXCERPT) ---
          // Membersihkan tag HTML (seperti <h2>, <p>) dari ai_article untuk dijadikan teks biasa
          let rawContent = article.ai_article || '';
          if (!rawContent && article.web_results && article.web_results.length > 0) {
            rawContent = article.web_results[0].snippet || ''; // Fallback jika ai_article tidak ada
          }
          const plainText = rawContent.replace(/<[^>]+>/g, ' ');
          const excerpt = plainText.length > 160 ? plainText.substring(0, 160) + '...' : plainText;

          return (
            <article key={index} className="border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {article.category}
                </span>
              </div>
              <h2 className="text-2xl font-semibold capitalize mb-4">
                <Link href={`/article/${slug}`} className="hover:text-blue-600">
                  {article.keyword}
                </Link>
              </h2>
            
              {article.image_urls && article.image_urls.length > 0 && (
                <img 
                  src={article.image_urls[0]} 
                  alt={article.keyword} 
                  className="w-full h-64 object-cover rounded-lg mb-4" 
                />
              )}
              
              {/* Menampilkan cuplikan teks */}
              <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
              
              <Link href={`/article/${slug}`} className="inline-block text-blue-600 font-medium hover:underline">
                Baca Artikel &rarr;
              </Link>
            </article>
          );
        })}
      </div>

      {/* --- TOMBOL PAGINATION --- */}
      <div className="flex justify-center items-center gap-4 mt-12 mb-8">
        {currentPage > 1 ? (
          <Link href={`/?page=${currentPage - 1}${searchQuery ? `&search=${searchQuery}` : ''}${selectedCategory ? `&category=${selectedCategory}` : ''}`} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700 transition-colors">
            &larr; Sebelumnya
          </Link>
        ) : (
          <span className="px-4 py-2 border border-gray-200 rounded text-gray-400 cursor-not-allowed bg-gray-50">
            &larr; Sebelumnya
          </span>
        )}
        
        <span className="text-gray-600 font-medium">
          Halaman {currentPage} dari {totalPages}
        </span>

        {currentPage < totalPages ? (
          <Link href={`/?page=${currentPage + 1}${searchQuery ? `&search=${searchQuery}` : ''}${selectedCategory ? `&category=${selectedCategory}` : ''}`} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700 transition-colors">
            Selanjutnya &rarr;
          </Link>
        ) : (
          <span className="px-4 py-2 border border-gray-200 rounded text-gray-400 cursor-not-allowed bg-gray-50">
            Selanjutnya &rarr;
          </span>
        )}
      </div>
    </main>
  );
}