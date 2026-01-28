'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface BusinessData {
  id: string;
  service_name: string;
  description: string;
  what_you_do: string;
  category: string;
  logo_url: string | null;
  face_url: string | null;
  is_public_gallery: boolean;
  admin_token: string;
}

interface SurveyData {
  id: string;
  questions: Array<{
    id: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
  }>;
}

export default function BusinessManagePage() {
  const params = useParams();
  const token = params.token as string;

  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [survey, setSurvey] = useState<SurveyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Editable fields
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [whatYouDo, setWhatYouDo] = useState('');
  const [category, setCategory] = useState('');
  const [isPublicGallery, setIsPublicGallery] = useState(false);

  const categories = [
    'その他', '美容', '健康・医療', '飲食', '教育', 'フィットネス',
    '不動産', 'IT・テック', 'サービス業', '小売', '士業',
  ];

  useEffect(() => {
    async function fetchBusiness() {
      try {
        const res = await fetch(`/api/businesses/${token}?admin=true`);
        if (!res.ok) {
          setError('管理画面にアクセスできません。URLが正しいか確認してください。');
          return;
        }
        const data = await res.json();
        setBusiness(data.business);
        setSurvey(data.survey);

        setServiceName(data.business.service_name);
        setDescription(data.business.description);
        setWhatYouDo(data.business.what_you_do);
        setCategory(data.business.category);
        setIsPublicGallery(data.business.is_public_gallery);
      } catch {
        setError('データの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    }

    fetchBusiness();
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch(`/api/businesses/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_name: serviceName,
          description,
          what_you_do: whatYouDo,
          category,
          is_public_gallery: isPublicGallery,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBusiness(data.business);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert('保存に失敗しました');
      }
    } catch {
      alert('ネットワークエラーが発生しました');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-4">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">アクセスエラー</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!business) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">管理画面</h1>
            <p className="text-gray-500 mt-1">{business.service_name}</p>
          </div>
          <div className="badge-green">管理者</div>
        </div>
      </div>

      {/* Share link */}
      <div className="card p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2 text-sm">口コミ回答用URL</h3>
        <p className="text-xs text-gray-500 mb-3">このURLをお客様に共有して、口コミを書いてもらいましょう</p>
        <div className="flex items-center gap-2">
          <code className="text-sm text-blue-600 font-mono bg-gray-50 px-3 py-2 rounded-lg flex-1 break-all">
            {typeof window !== 'undefined' ? window.location.origin : ''}/review/{business.id}
          </code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/review/${business.id}`
              );
            }}
            className="btn-secondary text-xs px-3 py-2 flex-shrink-0"
          >
            コピー
          </button>
        </div>
      </div>

      {/* Business Info Edit */}
      <div className="card p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-6">サービス情報の編集</h3>

        <div className="space-y-5">
          <div>
            <label className="label-text">サービス名</label>
            <input
              type="text"
              className="input-field"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
          </div>

          <div>
            <label className="label-text">カテゴリ</label>
            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-text">サービス概要</label>
            <textarea
              className="textarea-field"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="label-text">何をしているか</label>
            <input
              type="text"
              className="input-field"
              value={whatYouDo}
              onChange={(e) => setWhatYouDo(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <label className="label-text mb-0">ギャラリー公開</label>
              <p className="text-xs text-gray-500">ONにすると、生成された画像がギャラリーに表示されます</p>
            </div>
            <button
              onClick={() => setIsPublicGallery(!isPublicGallery)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isPublicGallery ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                isPublicGallery ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? '保存中...' : '変更を保存'}
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium animate-fade-in">
              保存しました
            </span>
          )}
        </div>
      </div>

      {/* Survey preview */}
      {survey && (
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">登録済みアンケート</h3>
          <div className="space-y-3">
            {survey.questions.map((q, i) => (
              <div key={q.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-800">{q.label}</span>
                  {q.required && <span className="text-red-500 text-xs">必須</span>}
                </div>
                <div className="ml-7 text-xs text-gray-500">
                  {q.type === 'rating' && '評価（1〜5）'}
                  {q.type === 'multi_select' && `複数選択: ${q.options?.join(', ')}`}
                  {q.type === 'free_text' && '自由記述'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
