'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';

export async function saveSettings(formData) {
  const settings = {
    logoText: formData.get('logoText'),
    title: formData.get('title'),
    description: formData.get('description'),
    site_url: formData.get('site_url') || '',
    headerScript: formData.get('headerScript') || '',
    footerScript: formData.get('footerScript') || '',
    sidebarScript: formData.get('sidebarScript') || '',
    articleScript: formData.get('articleScript') || '',
  };

  const settingsPath = path.join(process.cwd(), 'settings.json');
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  
  // Minta Next.js untuk memperbarui tampilan di semua halaman seketika
  revalidatePath('/', 'layout');
  revalidatePath('/sitemap.xml');
  revalidatePath('/robots.txt');
}

export async function loginAdmin(formData) {
  const username = formData.get('username');
  const password = formData.get('password');

  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  // Mengambil username dan password hash dari file .env.local
  const validUsername = process.env.ADMIN_USERNAME;
  const validPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (username === validUsername && hashedPassword === validPasswordHash) {
    (await cookies()).set('admin_session', 'true', { httpOnly: true, path: '/' });
    redirect('/admin');
  } else {
    redirect('/admin?error=1');
  }
}

export async function logoutAdmin() {
  (await cookies()).delete('admin_session');
  redirect('/admin');
}

export async function appendArticles(formData) {
  const file = formData.get('jsonlFile');
  
  // Pastikan ada file yang diunggah dan tidak kosong
  if (file && file.size > 0) {
    const fileContent = await file.text();
    const dataPath = path.join(process.cwd(), 'duckduckgo_results.jsonl');
    fs.appendFileSync(dataPath, '\n' + fileContent.trim());
    revalidatePath('/', 'layout');
  }
  redirect('/admin');
}
