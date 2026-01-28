'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface QuestionDraft {
  id: string;
  type: 'rating' | 'multi_select' | 'free_text';
  label: string;
  required: boolean;
  options: string[];
  min?: number;
  max?: number;
}

export default function BusinessRegisterPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminUrl, setAdminUrl] = useState<string | null>(null);

  // Business info
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [whatYouDo, setWhatYouDo] = useState('');
  const [category, setCategory] = useState('その他');
  const [ownerName, setOwnerName] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [faceUrl, setFaceUrl] = useState<string | null>(null);
  const [, setLogoFile] = useState<File | null>(null);
  const [, setFaceFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFace, setUploadingFace] = useState(false);

  // Survey questions
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    {
      id: uuidv4(),
      type: 'rating',
      label: '満足度はいかがでしたか？',
      required: true,
      options: [],
      min: 1,
      max: 5,
    },
    {
      id: uuidv4(),
      type: 'multi_select',
      label: '良かった点を教えてください',
      required: true,
      options: ['説明が丁寧', '技術が高い', '接客が良い', '通いやすい', '価格が適正', '清潔感がある'],
    },
    {
      id: uuidv4(),
      type: 'free_text',
      label: 'その他、感想やメッセージがあればお聞かせください',
      required: false,
      options: [],
    },
  ]);

  const categories = [
    'その他', '美容', '健康・医療', '飲食', '教育', 'フィットネス',
    '不動産', 'IT・テック', 'サービス業', '小売', '士業',
  ];

  const addQuestion = () => {
    setQuestions([...questions, {
      id: uuidv4(),
      type: 'multi_select',
      label: '',
      required: false,
      options: [],
    }]);
  };

  const updateQuestion = (index: number, updates: Partial<QuestionDraft>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push('');
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    setQuestions(newQuestions);
  };

  const handleFileSelect = async (file: File, type: 'logo' | 'face') => {
    if (type === 'logo') {
      setLogoFile(file);
      setUploadingLogo(true);
    } else {
      setFaceFile(file);
      setUploadingFace(true);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        if (type === 'logo') {
          setLogoUrl(data.url);
        } else {
          setFaceUrl(data.url);
        }
      } else {
        alert(data.error || 'アップロードに失敗しました');
        if (type === 'logo') {
          setLogoFile(null);
        } else {
          setFaceFile(null);
        }
      }
    } catch {
      alert('ネットワークエラーが発生しました');
      if (type === 'logo') {
        setLogoFile(null);
      } else {
        setFaceFile(null);
      }
    } finally {
      if (type === 'logo') {
        setUploadingLogo(false);
      } else {
        setUploadingFace(false);
      }
    }
  };

  const removeImage = (type: 'logo' | 'face') => {
    if (type === 'logo') {
      setLogoFile(null);
      setLogoUrl(null);
    } else {
      setFaceFile(null);
      setFaceUrl(null);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_name: serviceName,
          description,
          what_you_do: whatYouDo,
          category,
          owner_name: ownerName || null,
          logo_url: logoUrl,
          face_url: faceUrl,
          questions: questions.map(q => ({
            id: q.id,
            type: q.type,
            label: q.label,
            required: q.required,
            ...(q.type === 'rating' ? { min: q.min || 1, max: q.max || 5 } : {}),
            ...(q.type === 'multi_select' ? { options: q.options.filter(o => o.trim()) } : {}),
          })),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setAdminUrl(data.admin_url);
        setStep(3);
      } else {
        alert(data.error || '登録に失敗しました');
      }
    } catch {
      alert('ネットワークエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success page
  if (step === 3 && adminUrl) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">登録が完了しました！</h1>
          <p className="text-gray-500 mb-8">以下のURLを保存してください。管理画面へのアクセスに使用します。</p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-amber-700 text-sm font-semibold mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              重要：このURLは再表示できません
            </div>
            <p className="text-amber-600 text-xs">紛失した場合、管理画面にアクセスできなくなります。必ずブックマークまたはメモしてください。</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">管理画面URL</p>
            <div className="flex items-center gap-2">
              <code className="text-sm text-blue-600 font-mono break-all flex-1">
                {typeof window !== 'undefined' ? window.location.origin : ''}{adminUrl}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}${adminUrl}`
                  );
                }}
                className="btn-secondary text-xs px-3 py-1.5 flex-shrink-0"
              >
                コピー
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <a href={adminUrl} className="btn-primary flex-1">
              管理画面へ
            </a>
            <a href="/" className="btn-secondary flex-1">
              ホームへ戻る
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">事業者登録</h1>
        <p className="text-gray-500 mt-2">サービス情報とアンケートを登録して、お客様の声を集めましょう</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex items-center gap-2">
          <div className={step >= 1 ? 'step-active' : 'step-pending'}>1</div>
          <span className="text-sm font-medium text-gray-700">サービス情報</span>
        </div>
        <div className="flex-1 h-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className={step >= 2 ? 'step-active' : 'step-pending'}>2</div>
          <span className="text-sm font-medium text-gray-700">アンケート設定</span>
        </div>
      </div>

      {/* Step 1: Business Info */}
      {step === 1 && (
        <div className="card p-8 animate-fade-in-up">
          <h2 className="text-xl font-bold text-gray-900 mb-6">サービス情報</h2>

          <div className="space-y-6">
            <div>
              <label className="label-text">
                サービス名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="例：〇〇整体"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              />
            </div>

            <div>
              <label className="label-text">
                運営者のお名前
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="例：山田太郎"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">口コミ画像に表示されます（任意）</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* 顔写真アップロード */}
              <div>
                <label className="label-text">
                  運営者の顔写真
                </label>
                <div className="mt-2">
                  {faceUrl ? (
                    <div className="relative inline-block">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                        <img
                          src={faceUrl}
                          alt="顔写真プレビュー"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removeImage('face')}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                        type="button"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-blue-400 transition-colors">
                      {uploadingFace ? (
                        <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <>
                          <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-xs text-gray-500 text-center px-2">顔写真を選択</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file, 'face');
                        }}
                        disabled={uploadingFace}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">JPG、PNG、WebP（5MB以下）</p>
              </div>

              {/* ロゴ画像アップロード */}
              <div>
                <label className="label-text">
                  サービス・会社のロゴ
                </label>
                <div className="mt-2">
                  {logoUrl ? (
                    <div className="relative inline-block">
                      <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
                        <img
                          src={logoUrl}
                          alt="ロゴプレビュー"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <button
                        onClick={() => removeImage('logo')}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                        type="button"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors">
                      {uploadingLogo ? (
                        <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <>
                          <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-xs text-gray-500 text-center px-2">ロゴを選択</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file, 'logo');
                        }}
                        disabled={uploadingLogo}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">JPG、PNG、WebP（5MB以下）</p>
              </div>
            </div>

            <div>
              <label className="label-text">
                カテゴリ
              </label>
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
              <label className="label-text">
                サービス概要 <span className="text-red-500">*</span>
              </label>
              <textarea
                className="textarea-field"
                rows={3}
                placeholder="例：肩こり・腰痛に特化した整体院です。初回は姿勢分析＋施術＋セルフケア提案を行います。"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="label-text">
                何をしているか <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="例：姿勢分析、施術、セルフケア指導"
                value={whatYouDo}
                onChange={(e) => setWhatYouDo(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!serviceName || !description || !whatYouDo}
              className="btn-primary"
            >
              次へ：アンケート設定
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Survey Settings */}
      {step === 2 && (
        <div className="card p-8 animate-fade-in-up">
          <h2 className="text-xl font-bold text-gray-900 mb-2">アンケート設定</h2>
          <p className="text-sm text-gray-500 mb-6">利用者に回答してもらう質問を設定します（2〜3問推奨）</p>

          <div className="space-y-6">
            {questions.map((q, qi) => (
              <div key={q.id} className="bg-gray-50 rounded-xl p-5 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center text-xs font-bold">
                      {qi + 1}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">質問 {qi + 1}</span>
                  </div>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(qi)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-text text-xs">質問タイプ</label>
                      <select
                        className="input-field text-xs"
                        value={q.type}
                        onChange={(e) => updateQuestion(qi, {
                          type: e.target.value as QuestionDraft['type'],
                          options: e.target.value === 'multi_select' && q.options.length === 0
                            ? ['選択肢1']
                            : q.options,
                        })}
                      >
                        <option value="rating">評価（1〜5）</option>
                        <option value="multi_select">複数選択</option>
                        <option value="free_text">自由記述</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={q.required}
                          onChange={(e) => updateQuestion(qi, { required: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        必須
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="label-text text-xs">質問文</label>
                    <input
                      type="text"
                      className="input-field text-xs"
                      placeholder="質問を入力"
                      value={q.label}
                      onChange={(e) => updateQuestion(qi, { label: e.target.value })}
                    />
                  </div>

                  {q.type === 'multi_select' && (
                    <div>
                      <label className="label-text text-xs">選択肢</label>
                      <div className="space-y-2">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2">
                            <input
                              type="text"
                              className="input-field text-xs flex-1"
                              placeholder={`選択肢 ${oi + 1}`}
                              value={opt}
                              onChange={(e) => updateOption(qi, oi, e.target.value)}
                            />
                            <button
                              onClick={() => removeOption(qi, oi)}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addOption(qi)}
                          className="text-blue-600 text-xs font-medium hover:text-blue-700 flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          選択肢を追加
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {questions.length < 5 && (
              <button
                onClick={addQuestion}
                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 font-medium hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                質問を追加
              </button>
            )}
          </div>

          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(1)} className="btn-secondary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              戻る
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || questions.some(q => !q.label)}
              className="btn-primary"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  登録中...
                </>
              ) : (
                '登録する'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
