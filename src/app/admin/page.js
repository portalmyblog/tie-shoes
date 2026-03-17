import { getSettings } from '../../lib/settings';
import { saveSettings, loginAdmin, logoutAdmin, appendArticles } from './actions';
import { cookies } from 'next/headers';

export default async function AdminPage({ searchParams }) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('admin_session')?.value === 'true';
  const params = await searchParams;
  const error = params?.error;

  // Jika belum login, tampilkan form login
  if (!isAuthenticated) {
    return (
      <main className="max-w-md mx-auto p-8 mt-20 bg-white rounded-xl shadow-sm border border-gray-200 font-sans">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login Admin</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm text-center rounded-lg border border-red-200">
            Username atau password salah!
          </div>
        )}
        
        <form action={loginAdmin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input type="text" id="username" name="username" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input type="password" id="password" name="password" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
            Masuk
          </button>
        </form>
      </main>
    );
  }

  const settings = getSettings();

  return (
    <main className="max-w-2xl mx-auto p-8 mt-10 bg-white rounded-xl shadow-sm border border-gray-200 font-sans">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Pengaturan Website</h1>
        <form action={logoutAdmin}>
          <button type="submit" className="text-sm px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors">
            Logout
          </button>
        </form>
      </div>
      
      <form action={saveSettings} className="space-y-6">
        <div>
          <label htmlFor="logoText" className="block text-sm font-semibold text-gray-700 mb-2">
            Teks Logo (Navbar)
          </label>
          <input type="text" id="logoText" name="logoText" defaultValue={settings.logoText} required
                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" />
        </div>
        
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Judul Halaman Depan
          </label>
          <input type="text" id="title" name="title" defaultValue={settings.title} required
                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            Deskripsi Singkat Halaman Depan
          </label>
          <textarea id="description" name="description" rows="3" defaultValue={settings.description} required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"></textarea>
        </div>
        
        {/* BAGIAN SCRIPT DAN IKLAN */}
        <div className="pt-8 border-t mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Integrasi Script & Iklan</h2>
          
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">Header Script (Google AdSense Auto Ads / Analytics)</label>
            <textarea name="headerScript" rows="3" defaultValue={settings.headerScript} placeholder="<script>...</script>"
                      className="w-full p-3 font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            
            <label className="block text-sm font-semibold text-gray-700 mt-4">Sidebar Script (Banner Adsense Samping)</label>
            <textarea name="sidebarScript" rows="3" defaultValue={settings.sidebarScript} placeholder="<script>...</script>"
                      className="w-full p-3 font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            
            <label className="block text-sm font-semibold text-gray-700 mt-4">Article Script (Iklan Bawah Artikel / Single Page)</label>
            <textarea name="articleScript" rows="3" defaultValue={settings.articleScript} placeholder="<script>...</script>"
                      className="w-full p-3 font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            
            <label className="block text-sm font-semibold text-gray-700 mt-4">Footer Script (Hit Counter Pengunjung / Live Chat)</label>
            <textarea name="footerScript" rows="3" defaultValue={settings.footerScript} placeholder="<script>...</script>"
                      className="w-full p-3 font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
          Simpan Perubahan
        </button>
      </form>

      <hr className="my-10 border-gray-200" />

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tambah Artikel Baru (Upload JSONL)</h2>
      <form action={appendArticles} className="space-y-6">
        <div>
          <label htmlFor="jsonlFile" className="block text-sm font-semibold text-gray-700 mb-2">
            Pilih File Data (.jsonl)
          </label>
          <input type="file" id="jsonlFile" name="jsonlFile" accept=".jsonl,.txt" required
                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-shadow bg-gray-50" />
          <p className="text-xs text-gray-500 mt-2">Data dari file ini akan otomatis ditambahkan ke daftar artikel Anda yang sudah ada.</p>
        </div>
        
        <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg">
          Upload & Tambahkan Artikel
        </button>
      </form>

      <hr className="my-10 border-gray-200" />

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Export Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 flex flex-col">
          <h3 className="text-lg font-semibold text-indigo-900 mb-2">Export ke WordPress (WXR)</h3>
          <p className="text-sm text-indigo-700 mb-4 flex-1">Download seluruh artikel Anda dalam format file XML yang siap dan bisa langsung di-import (Tools &rarr; Import) ke dashboard WordPress.</p>
          <a href="/api/export-wordpress" download="wordpress-export.xml" className="inline-block text-center w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
            Download WordPress XML
          </a>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg border border-orange-100 flex flex-col">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">Export ke Blogspot (Blogger)</h3>
          <p className="text-sm text-orange-700 mb-4 flex-1">Download artikel dalam format Atom XML yang siap di-import (Setelan &rarr; Kelola Blog &rarr; Impor konten) ke dashboard Blogspot Anda.</p>
          <a href="/api/export-blogspot" download="blogspot-export.xml" className="inline-block text-center w-full bg-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors shadow-sm">
            Download Blogspot XML
          </a>
        </div>
      </div>
    </main>
  );
}
