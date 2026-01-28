'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { defaultTemplates } from '@/data/templates';
import { generateImageHTML, ImageGenerationParams } from '@/lib/image-generator';
import { Business } from '@/types';
import { toPng } from 'html-to-image';

interface BusinessData {
  id: string;
  service_name: string;
  description: string;
  what_you_do: string;
  category: string;
  logo_url: string | null;
  face_url: string | null;
  owner_name?: string | null;
}

interface SurveyData {
  id: string;
  questions: Array<{
    id: string;
    type: 'rating' | 'multi_select' | 'free_text';
    label: string;
    required: boolean;
    options?: string[];
    min?: number;
    max?: number;
  }>;
}

type Step = 'survey' | 'review' | 'template' | 'generate' | 'download';

export default function ReviewFlowPage() {
  const params = useParams();
  const businessId = params.businessId as string;

  const [step, setStep] = useState<Step>('survey');
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [survey, setSurvey] = useState<SurveyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Survey answers
  const [answers, setAnswers] = useState<Record<string, number | string | string[]>>({});
  const [freeComment, setFreeComment] = useState('');
  const [agreed, setAgreed] = useState(false);

  // Generated review
  const [reviewText, setReviewText] = useState('');
  const [generatedCopyId, setGeneratedCopyId] = useState<string | null>(null);
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);

  // Template selection
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(defaultTemplates[0].id);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  // Image generation
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Fetch business data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/businesses/${businessId}`);
        if (!res.ok) {
          setError('事業者が見つかりません');
          return;
        }
        const data = await res.json();
        setBusiness(data.business);
        setSurvey(data.survey);
      } catch {
        setError('データの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [businessId]);

  const handleSurveySubmit = async () => {
    if (!survey || !business) return;

    // Validate required answers
    for (const q of survey.questions) {
      if (q.required && !answers[q.id]) {
        alert(`「${q.label}」は必須です`);
        return;
      }
    }

    if (!agreed) {
      alert('利用規約に同意してください');
      return;
    }

    setIsGeneratingReview(true);

    try {
      // Submit survey response
      const responseRes = await fetch('/api/survey-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: businessId,
          survey_definition_id: survey.id,
          answers: Object.entries(answers).map(([question_id, value]) => ({
            question_id,
            value,
          })),
          free_comment: freeComment || null,
        }),
      });

      if (!responseRes.ok) throw new Error('回答の送信に失敗しました');
      const responseData = await responseRes.json();

      // Generate review
      const reviewRes = await fetch('/api/generate-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          survey_response_id: responseData.id,
          business_id: businessId,
        }),
      });

      if (!reviewRes.ok) throw new Error('口コミ文の生成に失敗しました');
      const reviewData = await reviewRes.json();

      setReviewText(reviewData.copy.review_text);
      setGeneratedCopyId(reviewData.copy.id);
      setStep('review');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsGeneratingReview(false);
    }
  };

  const handleGenerateImage = useCallback(async () => {
    if (!business || !generatedCopyId) return;

    const selectedTemplate = defaultTemplates.find(t => t.id === selectedTemplateId)!;
    const selectedSize = selectedTemplate.size_presets[selectedSizeIndex];

    setIsGeneratingImage(true);
    setStep('generate');

    try {
      // クライアントサイドでhtml-to-imageを使って画像生成
      const imgParams: ImageGenerationParams = {
        template: selectedTemplate,
        business: business as Business,
        reviewText,
        orientation: selectedTemplate.orientation,
        width: selectedSize.width / 4, // プレビュー用にスケールダウン
        height: selectedSize.height / 4,
      };

      const html = generateImageHTML(imgParams);

      // 一時的なコンテナを作成
      const container = document.createElement('div');
      container.innerHTML = html;
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      document.body.appendChild(container);

      const element = container.firstElementChild as HTMLElement;

      // 画像内の外部リソースを読み込む時間を待つ
      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        const dataUrl = await toPng(element, {
          width: imgParams.width,
          height: imgParams.height,
          quality: 1.0,
          pixelRatio: 2,
          skipAutoScale: true,
          cacheBust: true,
        });

        setGeneratedImageUrl(dataUrl);
        setStep('download');

        // サーバーに保存（オプション）
        try {
          await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              template_id: selectedTemplateId,
              generated_copy_id: generatedCopyId,
              business_id: business.id,
              size_preset: selectedSize.label,
              image_url: dataUrl,
            }),
          });
        } catch {
          // サーバー保存は失敗しても続行
          console.log('Server save skipped');
        }
      } finally {
        document.body.removeChild(container);
      }
    } catch (err) {
      console.error('Image generation error:', err);
      alert('画像の生成に失敗しました。もう一度お試しください。');
      setStep('template');
    } finally {
      setIsGeneratingImage(false);
    }
  }, [business, generatedCopyId, selectedTemplateId, selectedSizeIndex, reviewText]);

  const handleDownload = () => {
    if (!generatedImageUrl || !business) return;

    const link = document.createElement('a');
    link.download = `${business.service_name}_口コミ.png`;
    link.href = generatedImageUrl;
    link.click();
  };

  const steps: { key: Step; label: string }[] = [
    { key: 'survey', label: 'アンケート' },
    { key: 'review', label: '口コミ確認' },
    { key: 'template', label: 'テンプレ選択' },
    { key: 'generate', label: '画像生成' },
    { key: 'download', label: 'ダウンロード' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 mt-4">読み込み中...</p>
      </div>
    );
  }

  if (error || !business || !survey) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="card p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">エラー</h2>
          <p className="text-gray-500">{error || '事業者情報の読み込みに失敗しました'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Business header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
          {business.logo_url ? (
            <img src={business.logo_url} alt="" className="w-10 h-10 object-contain rounded-lg" />
          ) : (
            <span className="text-xl font-bold text-blue-600">{business.service_name.charAt(0)}</span>
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{business.service_name}</h1>
          <p className="text-sm text-gray-500">{business.description}</p>
        </div>
      </div>

      {/* Step progress */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className={
                i < currentStepIndex ? 'step-completed' :
                i === currentStepIndex ? 'step-active' :
                'step-pending'
              }>
                {i < currentStepIndex ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-xs">{i + 1}</span>
                )}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${
                i <= currentStepIndex ? 'text-gray-700' : 'text-gray-400'
              }`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-6 sm:w-10 h-px mx-1 flex-shrink-0 ${
                i < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step: Survey */}
      {step === 'survey' && (
        <div className="card p-6 sm:p-8 animate-fade-in-up">
          <h2 className="text-xl font-bold text-gray-900 mb-2">アンケートに回答</h2>
          <p className="text-sm text-gray-500 mb-8">以下の質問にお答えください。回答内容をもとにAIが口コミ文を生成します。</p>

          <div className="space-y-8">
            {survey.questions.map((q, qi) => (
              <div key={q.id}>
                <label className="label-text flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {qi + 1}
                  </span>
                  {q.label}
                  {q.required && <span className="text-red-500 text-xs">必須</span>}
                </label>

                {q.type === 'rating' && (
                  <div className="flex gap-2 mt-3">
                    {Array.from({ length: (q.max || 5) - (q.min || 1) + 1 }).map((_, i) => {
                      const value = (q.min || 1) + i;
                      const selected = answers[q.id] === value;
                      return (
                        <button
                          key={value}
                          onClick={() => setAnswers({ ...answers, [q.id]: value })}
                          className={`w-12 h-12 rounded-xl font-bold text-lg transition-all ${
                            selected
                              ? 'bg-blue-600 text-white shadow-md scale-110'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                    <div className="flex items-center ml-2 text-xs text-gray-400">
                      <span>{q.min || 1}=低い</span>
                      <span className="mx-2">〜</span>
                      <span>{q.max || 5}=高い</span>
                    </div>
                  </div>
                )}

                {q.type === 'multi_select' && q.options && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {q.options.map((option) => {
                      const currentValue = (answers[q.id] as string[]) || [];
                      const selected = currentValue.includes(option);
                      return (
                        <button
                          key={option}
                          onClick={() => {
                            const newValue = selected
                              ? currentValue.filter(v => v !== option)
                              : [...currentValue, option];
                            setAnswers({ ...answers, [q.id]: newValue });
                          }}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            selected
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {selected && (
                            <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          {option}
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.type === 'free_text' && (
                  <textarea
                    className="textarea-field mt-3"
                    rows={3}
                    placeholder="ご自由にお書きください"
                    value={freeComment}
                    onChange={(e) => {
                      setFreeComment(e.target.value);
                      setAnswers({ ...answers, [q.id]: e.target.value });
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Agreement */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">
                回答内容がAIによる口コミ文生成および販促画像の作成に使用されることに同意します。
              </span>
            </label>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSurveySubmit}
              disabled={isGeneratingReview || !agreed}
              className="btn-primary"
            >
              {isGeneratingReview ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  AIが口コミ文を生成中...
                </>
              ) : (
                <>
                  口コミ文を生成
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step: Review Text */}
      {step === 'review' && (
        <div className="card p-6 sm:p-8 animate-fade-in-up">
          <h2 className="text-xl font-bold text-gray-900 mb-2">生成された口コミ文</h2>
          <p className="text-sm text-gray-500 mb-6">AIが生成した口コミ文をご確認ください。必要に応じて編集できます。</p>

          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-sm font-semibold text-blue-700">AI生成テキスト</span>
            </div>
            <textarea
              className="w-full bg-white rounded-lg p-4 text-gray-800 text-sm leading-relaxed border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-blue-600">{reviewText.length}文字</span>
              <span className="text-xs text-gray-400">テキストを直接編集できます</span>
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep('survey')} className="btn-secondary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              戻る
            </button>
            <button
              onClick={() => setStep('template')}
              disabled={!reviewText.trim()}
              className="btn-primary"
            >
              テンプレート選択へ
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Step: Template Selection */}
      {step === 'template' && (
        <div className="card p-6 sm:p-8 animate-fade-in-up">
          <h2 className="text-xl font-bold text-gray-900 mb-2">テンプレートを選択</h2>
          <p className="text-sm text-gray-500 mb-6">口コミ画像のデザインテンプレートを選んでください</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {defaultTemplates.map((template) => {
              const isSelected = selectedTemplateId === template.id;
              return (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplateId(template.id);
                    setSelectedSizeIndex(0);
                  }}
                  className={`rounded-xl overflow-hidden border-2 transition-all text-left ${
                    isSelected
                      ? 'border-blue-600 shadow-lg ring-2 ring-blue-200'
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="aspect-[3/4] p-4 flex items-center justify-center"
                    style={{ background: template.style.backgroundColor }}
                  >
                    <div className="text-center w-full">
                      <div className="text-[10px] font-bold opacity-40 mb-2" style={{ color: template.style.primaryColor }}>
                        {template.style.layout.toUpperCase()}
                      </div>
                      <div className="max-w-[80px] mx-auto space-y-1.5">
                        <div className="h-1.5 rounded-full" style={{ background: template.style.primaryColor, opacity: 0.25 }} />
                        <div className="h-5 rounded-md" style={{ background: template.style.secondaryColor }} />
                        <div className="h-1.5 rounded-full w-3/4 mx-auto" style={{ background: template.style.primaryColor, opacity: 0.15 }} />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <div className="font-semibold text-xs text-gray-900">{template.name}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{template.tags.join(' / ')}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Size selection */}
          {(() => {
            const selectedTemplate = defaultTemplates.find(t => t.id === selectedTemplateId);
            if (!selectedTemplate) return null;

            return (
              <div className="mb-8">
                <label className="label-text">サイズ</label>
                <div className="flex gap-2 flex-wrap">
                  {selectedTemplate.size_presets.map((preset, i) => (
                    <button
                      key={preset.label}
                      onClick={() => setSelectedSizeIndex(i)}
                      className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                        selectedSizeIndex === i
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Preview section */}
          <div className="bg-gray-50 rounded-xl p-4 mb-8">
            <div className="text-xs font-semibold text-gray-500 mb-2">口コミ文プレビュー</div>
            <p className="text-sm text-gray-700 leading-relaxed">&ldquo;{reviewText}&rdquo;</p>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep('review')} className="btn-secondary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              戻る
            </button>
            <button onClick={handleGenerateImage} disabled={isGeneratingImage} className="btn-primary">
              {isGeneratingImage ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  AIが画像を生成中...
                </>
              ) : (
                <>
                  画像を生成
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step: Generating */}
      {step === 'generate' && (
        <div className="card p-8 text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">AIが画像を生成しています...</h2>
          <p className="text-sm text-gray-500">Geminiが口コミポスター画像を作成中です。しばらくお待ちください。</p>
        </div>
      )}

      {/* Step: Download */}
      {step === 'download' && generatedImageUrl && (
        <div className="card p-6 sm:p-8 animate-fade-in-up">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">画像が完成しました！</h2>
            <p className="text-sm text-gray-500">下のボタンからダウンロードできます</p>
          </div>

          {/* Preview */}
          <div ref={imageContainerRef} className="flex justify-center mb-8">
            <div className="max-w-md w-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <img
                src={generatedImageUrl}
                alt="生成された口コミ画像"
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleDownload} className="btn-primary flex-1">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PNGをダウンロード
            </button>
            <button
              onClick={() => {
                setGeneratedImageUrl(null);
                setStep('template');
              }}
              className="btn-secondary flex-1"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              別のテンプレートで再生成
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
