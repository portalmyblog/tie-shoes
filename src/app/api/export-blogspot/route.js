import fs from 'fs';
import path from 'path';
import { getSettings } from '../../../lib/settings';

// Fungsi untuk mengubah tag HTML menjadi entitas karakter (karena Blogger menggunakan format escape HTML di dalam <content>)
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const isScheduled = searchParams.get('schedule') === 'true';
  const dataPath = path.join(process.cwd(), 'duckduckgo_results.jsonl');
  const settings = getSettings();
  
  let articles = [];
  if (fs.existsSync(dataPath)) {
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    articles = fileContent.trim().split('\n').filter(Boolean).map(line => JSON.parse(line));
  }

  const blogId = '1234567890123456789'; // ID Blog Dummy
  const siteTitle = settings.title || 'Blog Modern Saya';

  // Header Atom XML standar Blogger
  let xml = `<?xml version='1.0' encoding='UTF-8'?>
<feed xmlns='http://www.w3.org/2005/Atom' xmlns:blogger='http://schemas.google.com/blogger/2018'>
  <id>tag:blogger.com,1999:blog-${blogId}</id>
  <title>${escapeXml(siteTitle)}</title>
`;

  articles.forEach((article, index) => {
    const title = article.keyword || 'Untitled';
    
    let contentHtml = article.ai_article || '';
    if (!contentHtml && article.web_results && article.web_results.length > 0) {
      contentHtml = article.web_results.map(r => `<p>${r.snippet}</p>`).join('');
    }

    // Tambahkan Galeri Gambar ke dalam konten artikel (Gaya Inline CSS agar aman di Blogspot)
    if (article.image_urls && article.image_urls.length > 0) {
      const imagesHtml = article.image_urls.map((url, imgIndex) => {
        const webData = article.web_results && article.web_results[imgIndex] ? article.web_results[imgIndex] : null;
        const imgTitle = webData ? webData.title : title;
        const imgSnippet = webData ? webData.snippet : 'Tidak ada deskripsi tersedia.';
        const imgLink = webData && webData.link ? `<a href="${webData.link}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: auto; color: #2563eb; text-decoration: none; font-weight: 500; font-size: 0.875rem;">Kunjungi Sumber &rarr;</a>` : '';
        
        return `
        <div style="display: flex; flex-direction: column; border: 1px solid #e5e7eb; border-radius: 0.75rem; overflow: hidden; background-color: #ffffff; flex: 1 1 calc(50% - 1.5rem); box-sizing: border-box; margin-bottom: 1.5rem;">
          <img src="${url}" alt="${escapeXml(imgTitle)}" style="width: 100%; height: 12rem; object-fit: cover; margin: 0;" />
          <div style="padding: 1.25rem; display: flex; flex-direction: column; flex: 1;">
            <h3 style="font-size: 1.125rem; font-weight: 700; color: #111827; margin-top: 0; margin-bottom: 0.75rem; line-height: 1.375;">${escapeXml(imgTitle)}</h3>
            <p style="font-size: 0.875rem; color: #4b5563; margin-top: 0; margin-bottom: 1rem;">${escapeXml(imgSnippet)}</p>
            ${imgLink}
          </div>
        </div>`;
      }).join('');
      
      contentHtml += `<hr style="margin: 3rem 0; border: 0; border-top: 1px solid #e5e7eb;" /><h2 style="font-size: 1.875rem; font-weight: 700; margin-bottom: 2rem; color: #1f2937;">Galeri &amp; Referensi Terkait</h2><div style="display: flex; flex-wrap: wrap; gap: 1.5rem;">${imagesHtml}</div>`;
    }

    // Tentukan Kategori Otomatis (Label Blogspot)
    let category = 'Umum';
    const kw = title.toLowerCase();
    if (kw.includes('kids') || kw.includes('child') || kw.includes('toddler') || kw.includes('boy') || kw.includes('girl')) {
      category = 'Anak-anak';
    } else if (kw.includes('dress') || kw.includes('formal') || kw.includes('oxford') || kw.includes('tuxedo') || kw.includes('black tie')) {
      category = 'Formal';
    } else if (kw.includes('running') || kw.includes('sneaker') || kw.includes('sport') || kw.includes('athletic')) {
      category = 'Olahraga';
    } else if (kw.includes('boot') || kw.includes('hiking') || kw.includes('trail') || kw.includes('walk')) {
      category = 'Outdoor';
    }

    // Jika schedule=true, tanggal maju (+1 hari/artikel). Jika tidak, mundur (-1 hari/artikel).
    const postDateObj = isScheduled 
      ? new Date(Date.now() + index * 86400000) 
      : new Date(Date.now() - index * 86400000); 
    const pubDate = postDateObj.toISOString();
    // Gunakan String untuk mencegah Javascript Number Limit (Pembulatan)
    const postId = "10000000000000" + index;
    const postStatus = isScheduled ? 'SCHEDULED' : 'LIVE';

    xml += `  <entry>
    <id>tag:blogger.com,1999:blog-${blogId}.post-${postId}</id>
    <blogger:type>POST</blogger:type>
    <blogger:status>${postStatus}</blogger:status>
    <author>
      <name>Admin</name>
      <blogger:type>BLOGGER</blogger:type>
    </author>
    <title>${escapeXml(title)}</title>
    <content type='html'>${escapeXml(contentHtml)}</content>
    <category scheme="http://www.blogger.com/atom/ns#" term="${escapeXml(category)}"/>
    <published>${pubDate}</published>
    <updated>${pubDate}</updated>
  </entry>\n`;
  });

  xml += `</feed>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/atom+xml',
      'Content-Disposition': 'attachment; filename="blogspot-export.xml"',
    },
  });
}
