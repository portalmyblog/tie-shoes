'use server'

import { revalidatePath } from 'next/cache'
// Ganti baris ini dengan fungsi untuk menyimpan ke database Anda
// import { saveSiteSettings } from '@/lib/db' 

export async function updateSiteSettings(formData) {
  const newUrl = formData.get('site_url')

  try {
    // 1. Simpan pengaturan baru ke database Anda.
    // Baris di bawah ini adalah contoh, silakan sesuaikan.
    // await saveSiteSettings({ site_url: newUrl });
    console.log(`(Simulasi) Menyimpan URL baru ke database: ${newUrl}`);

    // 2. Memicu revalidasi untuk sitemap dan robots.
    // Next.js akan men-generate ulang file ini saat ada request baru.
    revalidatePath('/sitemap.xml')
    revalidatePath('/robots.txt')

    return { success: true, message: 'Pengaturan berhasil disimpan dan sitemap akan diperbarui.' }
  } catch (error) {
    console.error('Gagal menyimpan pengaturan:', error);
    return { success: false, message: 'Terjadi kesalahan saat menyimpan pengaturan.' }
  }
}