'use client';

import { defaultTemplates } from '@/data/templates';
import Link from 'next/link';
import { useState } from 'react';

export default function TemplatesPage() {
  const [filter, setFilter] = useState<string>('all');

  const allTags = Array.from(new Set(defaultTemplates.flatMap(t => t.tags)));
  const filtered = filter === 'all'
    ? defaultTemplates
    : defaultTemplates.filter(t => t.tags.includes(filter));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">テンプレート一覧</h1>
        <p className="text-gray-500 mt-2">用途に合わせたデザインテンプレートを選べます</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          すべて
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
              filter === tag
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((template) => (
          <div key={template.id} className="card overflow-hidden group">
            {/* Preview */}
            <div
              className="aspect-[4/5] p-8 flex items-center justify-center relative"
              style={{ background: template.style.backgroundColor }}
            >
              <div className="text-center w-full">
                <div className="text-sm font-bold mb-4 opacity-50" style={{ color: template.style.primaryColor }}>
                  {template.style.layout.toUpperCase()}
                </div>

                <div className="max-w-[160px] mx-auto space-y-3">
                  <div className="h-3 rounded-full" style={{ background: template.style.primaryColor, opacity: 0.25 }} />
                  <div className="h-3 rounded-full w-3/4 mx-auto" style={{ background: template.style.primaryColor, opacity: 0.18 }} />

                  <div className="p-4 rounded-xl mt-4" style={{ background: template.style.secondaryColor }}>
                    <div className="space-y-2">
                      <div className="h-2 rounded-full" style={{ background: template.style.primaryColor, opacity: 0.2 }} />
                      <div className="h-2 rounded-full w-5/6" style={{ background: template.style.primaryColor, opacity: 0.15 }} />
                      <div className="h-2 rounded-full w-2/3" style={{ background: template.style.primaryColor, opacity: 0.1 }} />
                    </div>
                  </div>

                  <div className="flex justify-center gap-1 mt-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full"
                        style={{ background: template.style.primaryColor, opacity: 0.3 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-6">
              <h3 className="font-bold text-gray-900 text-lg">{template.name}</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{template.description}</p>

              <div className="flex gap-1.5 mt-4 flex-wrap">
                {template.tags.map(tag => (
                  <span key={tag} className="badge-blue text-xs">{tag}</span>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
                  <div>
                    <span className="font-medium text-gray-700">向き:</span>{' '}
                    {template.orientation === 'portrait' ? '縦' : '横'}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">本文上限:</span>{' '}
                    {template.constraints.max_body_chars}字
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-700">サイズ:</span>{' '}
                    {template.size_presets.map(p => p.label).join(', ')}
                  </div>
                </div>
              </div>

              <Link
                href="/review"
                className="btn-primary w-full mt-4 text-xs py-2.5"
              >
                このテンプレートで作成
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
