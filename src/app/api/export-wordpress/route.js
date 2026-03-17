import fs from 'fs';
import path from 'path';
import { getSettings } from '../../../lib/settings';

export async function GET() {
  const dataPath = path.join(process.cwd(), 'duckduckgo_results.jsonl');
  const settings = getSettings();
  
  let articles = [];
  if (fs.existsSync(dataPath)) {
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    articles = fileContent.trim().split('\n').filter(Boolean).map(line => JSON.parse(line));
  }

  // Header XML standar WXR WordPress
  let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
	xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:wp="http://wordpress.org/export/1.2/"
>
<channel>
	<title><![CDATA[${settings.title || 'Blog Export'}]]></title>
	<link>http://localhost:3000</link>
	<description><![CDATA[${settings.description || ''}]]></description>
	<pubDate>${new Date().toUTCString()}</pubDate>
	<language>en-US</language>
	<wp:wxr_version>1.2</wp:wxr_version>
	<wp:base_site_url>http://localhost:3000</wp:base_site_url>
	<wp:base_blog_url>http://localhost:3000</wp:base_blog_url>
	<generator>Next.js Custom Exporter</generator>
`;

  // Masukkan setiap artikel sebagai <item> (Post WordPress)
  articles.forEach((article, index) => {
    const title = article.keyword || 'Untitled';
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Ambil HTML artikel, atau gunakan snippet jika artikel kosong
    let contentHtml = article.ai_article || '';
    if (!contentHtml && article.web_results && article.web_results.length > 0) {
      contentHtml = article.web_results.map(r => `<p>${r.snippet}</p>`).join('');
    }

    // Tambahkan Galeri Gambar ke dalam konten artikel jika ada
    if (article.image_urls && article.image_urls.length > 0) {
      const imagesHtml = article.image_urls.map((url, imgIndex) => {
        const webData = article.web_results && article.web_results[imgIndex] ? article.web_results[imgIndex] : null;
        const imgTitle = webData ? webData.title : title;
        const imgSnippet = webData ? webData.snippet : 'Tidak ada deskripsi tersedia.';
        const imgLink = webData && webData.link ? `<a href="${webData.link}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: auto; color: #2563eb; text-decoration: none; font-weight: 500; font-size: 0.875rem;">Kunjungi Sumber &rarr;</a>` : '';
        
        return `
        <div style="display: flex; flex-direction: column; border: 1px solid #e5e7eb; border-radius: 0.75rem; overflow: hidden; background-color: #ffffff; flex: 1 1 calc(50% - 1.5rem); box-sizing: border-box; margin-bottom: 1.5rem;">
          <img src="${url}" alt="${imgTitle}" style="width: 100%; height: 12rem; object-fit: cover; margin: 0;" />
          <div style="padding: 1.25rem; display: flex; flex-direction: column; flex: 1;">
            <h3 style="font-size: 1.125rem; font-weight: 700; color: #111827; margin-top: 0; margin-bottom: 0.75rem; line-height: 1.375;">${imgTitle}</h3>
            <p style="font-size: 0.875rem; color: #4b5563; margin-top: 0; margin-bottom: 1rem;">${imgSnippet}</p>
            ${imgLink}
          </div>
        </div>`;
      }).join('');
      
      contentHtml += `
<hr style="margin: 3rem 0; border: 0; border-top: 1px solid #e5e7eb;" />
<h2 style="font-size: 1.875rem; font-weight: 700; margin-bottom: 2rem; color: #1f2937;">Galeri & Referensi Terkait</h2>
<div style="display: flex; flex-wrap: wrap; gap: 1.5rem;">
${imagesHtml}
</div>`;
    }

    // Tentukan Kategori Otomatis
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

    // Buat tanggal mundur agar postingan tidak di tanggal/detik yang sama
    const postDateObj = new Date(Date.now() - index * 86400000); 
    const pubDate = postDateObj.toUTCString();
    const postDate = postDateObj.toISOString().slice(0, 19).replace('T', ' '); // Format: YYYY-MM-DD HH:MM:SS

    const postId = index + 1000;
    const attachmentId = index + 2000;
    const hasFeaturedImage = article.image_urls && article.image_urls.length > 0;
    const featuredImageUrl = hasFeaturedImage ? article.image_urls[0] : '';

    xml += `
	<item>
		<title><![CDATA[${title}]]></title>
		<link>http://localhost:3000/article/${slug}</link>
		<pubDate>${pubDate}</pubDate>
		<dc:creator><![CDATA[admin]]></dc:creator>
		<guid isPermaLink="false">http://localhost:3000/?p=${postId}</guid>
		<description></description>
		<content:encoded><![CDATA[${contentHtml}]]></content:encoded>
		<excerpt:encoded><![CDATA[]]></excerpt:encoded>
		<wp:post_id>${postId}</wp:post_id>
		<wp:post_date><![CDATA[${postDate}]]></wp:post_date>
		<wp:post_date_gmt><![CDATA[${postDate}]]></wp:post_date_gmt>
		<wp:comment_status><![CDATA[open]]></wp:comment_status>
		<wp:ping_status><![CDATA[open]]></wp:ping_status>
		<wp:post_name><![CDATA[${slug}]]></wp:post_name>
		<wp:status><![CDATA[publish]]></wp:status>
		<wp:post_parent>0</wp:post_parent>
		<wp:menu_order>0</wp:menu_order>
		<wp:post_type><![CDATA[post]]></wp:post_type>
		<wp:is_sticky>0</wp:is_sticky>
		<category domain="category" nicename="${category.toLowerCase().replace(/\s+/g, '-')}"><![CDATA[${category}]]></category>`;

    // Hubungkan post dengan Featured Image jika ada
    if (hasFeaturedImage) {
      xml += `
		<wp:postmeta>
			<wp:meta_key><![CDATA[_thumbnail_id]]></wp:meta_key>
			<wp:meta_value><![CDATA[${attachmentId}]]></wp:meta_value>
		</wp:postmeta>`;
    }

    xml += `
	</item>`;

    // Tambahkan data attachment agar WordPress otomatis mengunduh gambar
    if (hasFeaturedImage) {
      xml += `
	<item>
		<title><![CDATA[${title} - Featured Image]]></title>
		<link>${featuredImageUrl}</link>
		<pubDate>${pubDate}</pubDate>
		<dc:creator><![CDATA[admin]]></dc:creator>
		<guid isPermaLink="false">${featuredImageUrl}</guid>
		<description></description>
		<content:encoded><![CDATA[]]></content:encoded>
		<excerpt:encoded><![CDATA[]]></excerpt:encoded>
		<wp:post_id>${attachmentId}</wp:post_id>
		<wp:post_date><![CDATA[${postDate}]]></wp:post_date>
		<wp:post_date_gmt><![CDATA[${postDate}]]></wp:post_date_gmt>
		<wp:comment_status><![CDATA[closed]]></wp:comment_status>
		<wp:ping_status><![CDATA[closed]]></wp:ping_status>
		<wp:post_name><![CDATA[${slug}-image]]></wp:post_name>
		<wp:status><![CDATA[inherit]]></wp:status>
		<wp:post_parent>${postId}</wp:post_parent>
		<wp:menu_order>0</wp:menu_order>
		<wp:post_type><![CDATA[attachment]]></wp:post_type>
		<wp:is_sticky>0</wp:is_sticky>
		<wp:attachment_url><![CDATA[${featuredImageUrl}]]></wp:attachment_url>
	</item>`;
    }
  });

  xml += `\n</channel>\n</rss>`;

  // Mengirim balasan sebagai file download XML
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Content-Disposition': 'attachment; filename="wordpress-export.xml"',
    },
  });
}
