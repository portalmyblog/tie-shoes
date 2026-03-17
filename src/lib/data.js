import fs from 'fs';
import path from 'path';

// Fungsi untuk membaca file JSONL dan mengubahnya menjadi Array of Objects
export function getArticles() {
  const filePath = path.join(process.cwd(), 'duckduckgo_results.jsonl');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Memecah teks berdasarkan baris baru, dan mem-parsing setiap baris menjadi JSON
  return fileContent.trim().split('\n').map((line) => {
    const article = JSON.parse(line);
    
    // --- LOGIKA KATEGORI OTOMATIS ---
    const kw = article.keyword.toLowerCase();
    if (kw.includes('kids') || kw.includes('child') || kw.includes('toddler') || kw.includes('boy') || kw.includes('girl')) {
      article.category = 'Anak-anak';
    } else if (kw.includes('dress') || kw.includes('formal') || kw.includes('oxford') || kw.includes('tuxedo') || kw.includes('black tie')) {
      article.category = 'Formal';
    } else if (kw.includes('running') || kw.includes('sneaker') || kw.includes('sport') || kw.includes('athletic')) {
      article.category = 'Olahraga';
    } else if (kw.includes('boot') || kw.includes('hiking') || kw.includes('trail') || kw.includes('walk')) {
      article.category = 'Outdoor';
    } else {
      article.category = 'Umum';
    }
    
    return article;
  });
}

// Fungsi untuk mengambil satu artikel berdasarkan slug (keyword yang diubah menjadi format URL)
export function getArticleBySlug(slug) {
  const articles = getArticles();
  return articles.find(
    article => article.keyword.replace(/\s+/g, '-') === slug
  );
}