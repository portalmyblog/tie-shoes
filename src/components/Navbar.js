'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  // Menyelaraskan teks di dalam kotak dengan URL
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/');
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-lg sm:max-w-xs">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
        placeholder="Cari artikel..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit" className="hidden">Cari</button>
    </form>
  );
}

export default function Navbar({ settings }) {
  // Pastikan settings tidak undefined jika file settings.json bermasalah
  const safeSettings = settings || { logoText: 'BlogModern' };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between h-auto sm:h-16 items-center py-4 sm:gap-0 gap-4">
          <div className="flex-shrink-0 flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors tracking-tight">
              {safeSettings.logoText}
            </Link>
            <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 font-medium">Admin</Link>
          </div>
          <div className="flex-1 flex justify-center sm:justify-end w-full sm:w-auto px-2 lg:ml-6">
            <Suspense fallback={<div className="h-9 w-full sm:w-64 bg-gray-100 rounded-full animate-pulse"></div>}>
              <SearchBar />
            </Suspense>
          </div>
        </div>
      </div>
    </nav>
  );
}
