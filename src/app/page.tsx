import Link from 'next/link';
import { defaultTemplates } from '@/data/templates';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-amber-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-xs font-medium mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              AI口コミ画像生成サービス
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              アンケートに答えるだけで
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                プロ品質の口コミ画像
              </span>
              <br />
              が完成
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              利用者がアンケートに回答するだけで、AIが口コミ文を自動生成。
              テンプレートを選んで、チラシやポスターとして使える高品質な画像をダウンロードできます。
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/review" className="btn-primary px-8 py-4 text-base">
                口コミを書く
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/business/register" className="btn-secondary px-8 py-4 text-base">
                事業者登録（無料）
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="section-title text-3xl">かんたん3ステップ</h2>
            <p className="section-subtitle mt-2">誰でもすぐに始められます</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'アンケートに回答',
                desc: '事業者を選んで、2〜3問の簡単なアンケートに答えるだけ。',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                ),
                color: 'blue',
              },
              {
                step: '02',
                title: 'AIが口コミ文を生成',
                desc: '回答内容からAIが自然な口コミ文を自動で作成します。',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                color: 'amber',
              },
              {
                step: '03',
                title: '画像をダウンロード',
                desc: 'テンプレートを選んで、チラシ・ポスター画像を生成しダウンロード。',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                color: 'green',
              },
            ].map((item) => (
              <div key={item.step} className="card p-8 text-center group">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center
                  ${item.color === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
                  ${item.color === 'amber' ? 'bg-amber-50 text-amber-600' : ''}
                  ${item.color === 'green' ? 'bg-green-50 text-green-600' : ''}
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-gray-400 mb-2">STEP {item.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title text-3xl">テンプレート</h2>
              <p className="section-subtitle mt-2">用途に合わせて選べるデザイン</p>
            </div>
            <Link href="/templates" className="btn-secondary text-xs hidden sm:flex">
              すべて見る
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {defaultTemplates.map((template) => (
              <div key={template.id} className="card overflow-hidden group">
                {/* Preview */}
                <div className={`aspect-[3/4] p-6 flex items-center justify-center relative overflow-hidden`}
                  style={{ background: template.style.backgroundColor }}>
                  <div className="text-center">
                    <div className="text-xs font-bold mb-2 opacity-60" style={{ color: template.style.primaryColor }}>
                      {template.style.layout === 'recommendation' && '推薦'}
                      {template.style.layout === 'card' && 'カード'}
                      {template.style.layout === 'watercolor' && '水彩'}
                      {template.style.layout === 'benefit' && 'ベネフィット'}
                      {template.style.layout === 'simple' && 'シンプル'}
                      {template.style.layout === 'premium_dark' && 'プレミアム'}
                      {template.style.layout === 'green' && 'グリーン'}
                      {template.style.layout === 'blue_business' && 'ビジネス'}
                      {template.style.layout === 'pink_pop' && 'ポップ'}
                      {template.style.layout === 'purple_elegant' && 'エレガント'}
                    </div>
                    <div className="w-full max-w-[120px] mx-auto space-y-2">
                      <div className="h-2 rounded-full" style={{ background: template.style.primaryColor, opacity: 0.3 }} />
                      <div className="h-2 rounded-full w-3/4 mx-auto" style={{ background: template.style.primaryColor, opacity: 0.2 }} />
                      <div className="h-8 rounded-lg mt-4" style={{ background: template.style.secondaryColor }} />
                      <div className="h-2 rounded-full" style={{ background: template.style.primaryColor, opacity: 0.15 }} />
                      <div className="h-2 rounded-full w-2/3 mx-auto" style={{ background: template.style.primaryColor, opacity: 0.1 }} />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm">{template.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.description}</p>
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {template.tags.map((tag) => (
                      <span key={tag} className="badge-blue text-[10px] px-2 py-0.5">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link href="/templates" className="btn-secondary text-xs">
              すべてのテンプレートを見る
            </Link>
          </div>
        </div>
      </section>

      {/* For Business */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="badge-amber mb-4">事業者の方へ</div>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                お客様の声を
                <br />
                販促ツールに変える
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                サービス情報とアンケートを登録するだけで、お客様が直接口コミ画像を作成できます。
                作成された画像はチラシやSNS投稿に活用できます。
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  'サービス名・概要・アンケートを簡単登録',
                  'お客様が自分でアンケート回答→画像生成',
                  'ギャラリーへの公開設定も管理できる',
                  'ログイン不要、シークレットURLで管理',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/business/register" className="btn-primary mt-8">
                無料で事業者登録する
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-amber-50 rounded-3xl p-8 relative">
              <div className="space-y-4">
                <div className="card p-4 !rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900">〇〇整体</div>
                      <div className="text-xs text-gray-500">肩こり・腰痛に特化</div>
                    </div>
                  </div>
                </div>

                <div className="card p-4 !rounded-xl">
                  <div className="text-xs font-semibold text-gray-500 mb-2">アンケート設問</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <span className="w-5 h-5 bg-blue-50 text-blue-600 rounded flex items-center justify-center text-[10px] font-bold">1</span>
                      満足度は？
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <span className="w-5 h-5 bg-blue-50 text-blue-600 rounded flex items-center justify-center text-[10px] font-bold">2</span>
                      良かった点は？
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <span className="w-5 h-5 bg-blue-50 text-blue-600 rounded flex items-center justify-center text-[10px] font-bold">3</span>
                      ご感想（任意）
                    </div>
                  </div>
                </div>

                <div className="card p-4 !rounded-xl bg-green-50 border-green-100">
                  <div className="flex items-center gap-2 text-green-700 text-xs font-semibold">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    画像が生成されました！
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            今すぐ始めてみませんか？
          </h2>
          <p className="mt-4 text-blue-100 text-lg">
            登録もログインも不要。すぐに口コミ画像を作成できます。
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/review" className="btn-accent px-8 py-4 text-base">
              口コミ画像を作成する
            </Link>
            <Link href="/business/register" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/10 text-white font-semibold text-base hover:bg-white/20 transition-colors border border-white/20">
              事業者登録はこちら
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
