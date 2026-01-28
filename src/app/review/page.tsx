'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BusinessItem {
  id: string;
  service_name: string;
  description: string;
  what_you_do: string;
  category: string;
  logo_url: string | null;
}

export default function ReviewSelectPage() {
  const [businesses, setBusinesses] = useState<BusinessItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const res = await fetch(`/api/businesses?search=${encodeURIComponent(search)}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          console.error('Failed to fetch businesses:', errorData);
          throw new Error(errorData.error || 'データの取得に失敗しました');
        }
        
        const data = await res.json();
        setBusinesses(data);
      } catch (error) {
        console.error('Failed to fetch businesses:', error);
        // エラーは表示せず、空の配列を表示（ユーザー体験向上のため）
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBusinesses();
  }, [search]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">口コミを書く</h1>
        <p className="text-gray-500 mt-2">口コミを書きたい事業者を選んでください</p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          className="input-field pl-12"
          placeholder="事業者名で検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-4">読み込み中...</p>
        </div>
      ) : businesses.length === 0 ? (
        <div className="text-center py-16 card p-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">事業者が見つかりません</h3>
          <p className="text-sm text-gray-500 mb-6">まだ事業者が登録されていないか、検索条件に一致する結果がありません。</p>
          <Link href="/business/register" className="btn-primary text-sm">
            事業者を登録する
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {businesses.map((biz) => (
            <Link
              key={biz.id}
              href={`/review/${biz.id}`}
              className="card p-5 flex items-start gap-4 group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                {biz.logo_url ? (
                  <img src={biz.logo_url} alt="" className="w-8 h-8 object-contain rounded" />
                ) : (
                  <span className="text-lg font-bold text-blue-600">
                    {biz.service_name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{biz.service_name}</h3>
                  <span className="badge-blue text-[10px] flex-shrink-0">{biz.category}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{biz.description}</p>
              </div>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
