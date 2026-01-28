'use client';

import { useState } from 'react';

// Sample gallery data for demonstration
const sampleGalleryItems = [
  {
    id: '1',
    businessName: '〇〇整体',
    category: '健康・医療',
    templateName: '口コミカード型',
    reviewText: '初めて〇〇整体にお世話になりました。とても満足しています。丁寧な対応が好印象でした。特に説明が丁寧と技術が高いが素晴らしかったです。',
    createdAt: '2025-01-15',
    colors: { bg: '#DBEAFE', primary: '#2563EB' },
  },
  {
    id: '2',
    businessName: 'ABC美容室',
    category: '美容',
    templateName: '大見出しポスター型',
    reviewText: 'ABC美容室を利用しました。非常に満足しています。期待以上の体験でした。特に接客が良いと技術が高いが素晴らしかったです。',
    createdAt: '2025-01-14',
    colors: { bg: '#FEF3C7', primary: '#F59E0B' },
  },
  {
    id: '3',
    businessName: 'サンプル学習塾',
    category: '教育',
    templateName: 'シンプルモダン型',
    reviewText: 'サンプル学習塾の個別指導を体験しました。とても満足しています。丁寧な対応が好印象でした。',
    createdAt: '2025-01-13',
    colors: { bg: '#D1FAE5', primary: '#10B981' },
  },
  {
    id: '4',
    businessName: 'DEFクリニック',
    category: '健康・医療',
    templateName: '口コミカード型',
    reviewText: 'DEFクリニックを利用しました。清潔感がありスタッフの対応も良く、通いやすいクリニックでした。',
    createdAt: '2025-01-12',
    colors: { bg: '#EDE9FE', primary: '#7C3AED' },
  },
  {
    id: '5',
    businessName: 'カフェ MOCA',
    category: '飲食',
    templateName: '口コミまとめ型',
    reviewText: 'カフェMOCAのコーヒーと雰囲気が最高でした。友人にも紹介したいと思えるお店です。',
    createdAt: '2025-01-11',
    colors: { bg: '#FEE2E2', primary: '#EF4444' },
  },
  {
    id: '6',
    businessName: 'フィットネスGYM',
    category: 'フィットネス',
    templateName: 'シンプルモダン型',
    reviewText: 'トレーナーの指導が的確で、運動初心者でも安心して通えます。設備も充実していました。',
    createdAt: '2025-01-10',
    colors: { bg: '#CFFAFE', primary: '#06B6D4' },
  },
];

export default function GalleryPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedItem = sampleGalleryItems.find(i => i.id === selected);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">ギャラリー</h1>
        <p className="text-gray-500 mt-2">作成された利用者の声画像の一覧です</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleGalleryItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item.id)}
            className="card overflow-hidden text-left group cursor-pointer"
          >
            {/* Preview placeholder */}
            <div
              className="aspect-[4/5] p-6 flex flex-col items-center justify-center relative"
              style={{ background: item.colors.bg }}
            >
              <div className="text-center max-w-[80%]">
                <div
                  className="text-xs font-bold mb-3 tracking-widest opacity-60"
                  style={{ color: item.colors.primary }}
                >
                  お客様の声
                </div>
                <div className="flex justify-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-lg" style={{ color: item.colors.primary }}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-xs leading-relaxed text-gray-600 line-clamp-4">
                  &ldquo;{item.reviewText}&rdquo;
                </p>
                <div className="mt-4 text-xs text-gray-400">ご利用者様</div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-gray-900">{item.businessName}</span>
                <span className="badge-blue text-[10px]">{item.category}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">{item.templateName}</span>
                <span className="text-xs text-gray-400">{item.createdAt}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {selected && selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview */}
            <div
              className="aspect-[4/5] p-8 flex flex-col items-center justify-center"
              style={{ background: selectedItem.colors.bg }}
            >
              <div className="text-center max-w-[80%]">
                <div
                  className="text-sm font-bold mb-4 tracking-widest opacity-60"
                  style={{ color: selectedItem.colors.primary }}
                >
                  お客様の声
                </div>
                <div className="text-2xl font-bold mb-6" style={{ color: selectedItem.colors.primary }}>
                  {selectedItem.businessName}
                </div>
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-2xl" style={{ color: selectedItem.colors.primary }}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-gray-700">
                  &ldquo;{selectedItem.reviewText}&rdquo;
                </p>
                <div className="mt-6 text-sm text-gray-400">ご利用者様</div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">{selectedItem.businessName}</h3>
                  <span className="text-xs text-gray-500">{selectedItem.templateName} / {selectedItem.createdAt}</span>
                </div>
                <span className="badge-blue">{selectedItem.category}</span>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="btn-secondary w-full"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
