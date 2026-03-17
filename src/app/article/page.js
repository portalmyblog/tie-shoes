import { redirect } from 'next/navigation';

export default function ArticleIndex() {
  // Otomatis mengembalikan pengunjung ke halaman utama jika hanya mengakses /article
  redirect('/');
}