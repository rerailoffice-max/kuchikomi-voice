'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Sparkles, MessageSquareQuote, Image, Zap, CheckCircle2, ArrowRight, Star } from 'lucide-react';

// Fade-in animation hook using IntersectionObserver
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Animated section component
function FadeInSection({ 
  children, 
  className = '',
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useFadeIn();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#050505]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            利用者の声
          </div>
          <div className="flex items-center gap-6">
            <Link href="/business/register" className="text-sm font-medium text-black/60 hover:text-black transition-colors">
              事業者登録
            </Link>
            <Link 
              href="/review" 
              className="text-sm font-medium bg-[#050505] text-white px-5 py-2.5 rounded-full hover:bg-black/80 transition-colors"
            >
              はじめる
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - 80% viewport height */}
      <section className="min-h-[85vh] flex flex-col justify-center px-6 pt-24">
        <div className="max-w-7xl mx-auto w-full">
          <FadeInSection>
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-black/40 mb-6">
              AI-Powered Review Generator
            </p>
          </FadeInSection>
          
          <FadeInSection delay={100}>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-[0.9]">
              書かなくていい。
              <br />
              <span className="text-[#3B82F6]">聞くだけでいい。</span>
            </h1>
          </FadeInSection>
          
          <FadeInSection delay={200}>
            <p className="mt-10 text-xl sm:text-2xl text-black/50 max-w-2xl leading-relaxed font-light">
              アンケートに答えてもらうだけで、AIが口コミを作成。
              <br />
              プロ品質の画像まで、自動で完成。
            </p>
          </FadeInSection>
          
          <FadeInSection delay={300}>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link 
                href="/review" 
                className="inline-flex items-center gap-2 bg-[#050505] text-white text-lg font-medium px-8 py-4 rounded-full hover:bg-black/80 transition-all hover:gap-4"
              >
                無料ではじめる
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/gallery" 
                className="inline-flex items-center gap-2 text-lg font-medium px-8 py-4 rounded-full border-2 border-black/10 hover:border-black/30 transition-colors"
              >
                事例を見る
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Bento Grid - Features */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-black/40 mb-4">
              Features
            </p>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-20">
              もう、悩まない。
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Large card */}
            <FadeInSection className="md:col-span-2 lg:col-span-2" delay={100}>
              <div className="bg-white rounded-3xl p-10 h-full border border-black/5 hover:border-black/10 transition-colors">
                <div className="w-14 h-14 bg-[#3B82F6]/10 rounded-2xl flex items-center justify-center mb-8">
                  <Sparkles className="w-7 h-7 text-[#3B82F6]" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                  AIが、あなたの代わりに書く
                </h3>
                <p className="text-lg text-black/50 leading-relaxed">
                  「口コミをお願いします」と言われても、何を書けばいいかわからない。
                  そんなお客様の負担を、AIが解消。アンケートに答えるだけで、
                  自然な口コミ文が自動生成されます。
                </p>
              </div>
            </FadeInSection>

            {/* Small card */}
            <FadeInSection delay={200}>
              <div className="bg-white rounded-3xl p-8 h-full border border-black/5 hover:border-black/10 transition-colors">
                <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center mb-6">
                  <MessageSquareQuote className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">
                  2〜3問で完了
                </h3>
                <p className="text-black/50 leading-relaxed">
                  質問はたった2〜3問。
                  30秒で回答できるから、
                  お客様も気軽に協力してくれる。
                </p>
              </div>
            </FadeInSection>

            {/* Small card */}
            <FadeInSection delay={250}>
              <div className="bg-white rounded-3xl p-8 h-full border border-black/5 hover:border-black/10 transition-colors">
                <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center mb-6">
                  <Image className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">
                  10種のテンプレート
                </h3>
                <p className="text-black/50 leading-relaxed">
                  ポップ、エレガント、ビジネス。
                  あなたのブランドに合う
                  デザインがきっと見つかる。
                </p>
              </div>
            </FadeInSection>

            {/* Large card */}
            <FadeInSection className="md:col-span-2" delay={300}>
              <div className="bg-[#050505] text-white rounded-3xl p-10 h-full">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                  <Zap className="w-7 h-7 text-[#3B82F6]" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                  SNS投稿、そのまま。
                </h3>
                <p className="text-lg text-white/60 leading-relaxed">
                  Instagram、Twitter、チラシ、ポスター。
                  用途に合わせたサイズで画像を生成。
                  ダウンロードしたら、そのまま投稿できます。
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* How it works - Steps */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-black/40 mb-4">
              How it works
            </p>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-20">
              シンプルに、3ステップ。
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              {
                num: '01',
                title: '質問に答える',
                desc: '満足度や良かった点を選ぶだけ。文章を考える必要なし。',
              },
              {
                num: '02',
                title: 'AIが口コミを生成',
                desc: '回答をもとに、自然で説得力のある口コミ文を自動作成。',
              },
              {
                num: '03',
                title: '画像をダウンロード',
                desc: 'テンプレートを選んで、完成。あとは投稿するだけ。',
              },
            ].map((step, i) => (
              <FadeInSection key={step.num} delay={i * 100}>
                <div className="relative">
                  <span className="text-8xl sm:text-9xl font-bold text-black/5 absolute -top-8 -left-2">
                    {step.num}
                  </span>
                  <div className="relative pt-16">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-lg text-black/50 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Statement Section */}
      <section className="py-40 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <FadeInSection>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
              口コミは、
              <br />
              <span className="text-[#3B82F6]">お客様に書いてもらうもの</span>
              <br />
              という常識を、変える。
            </h2>
          </FadeInSection>
          
          <FadeInSection delay={150}>
            <p className="mt-12 text-xl text-black/50 max-w-2xl mx-auto leading-relaxed">
              お客様の本音を、負担なく集める。
              それを、価値ある資産に変える。
              私たちが目指すのは、そんな世界です。
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-black/40 mb-4">
              Benefits
            </p>
            <h2 className="text-5xl sm:text-6xl font-bold tracking-tight mb-16">
              事業者のあなたへ
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              '顔写真・ロゴ入りの画像で信頼感アップ',
              'アンケートは自由にカスタマイズ可能',
              'お客様の負担を最小限に',
              '何度でも無料で画像生成',
              'ダウンロード後すぐにSNS投稿',
              'ギャラリーで実績をアピール',
            ].map((benefit, i) => (
              <FadeInSection key={i} delay={i * 50}>
                <div className="flex items-start gap-4 p-6 rounded-2xl hover:bg-black/[0.02] transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                  <span className="text-lg font-medium">{benefit}</span>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="bg-[#050505] text-white rounded-3xl p-12 sm:p-16 text-center">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-[#3B82F6] text-[#3B82F6]" />
                ))}
              </div>
              <p className="text-2xl sm:text-3xl font-medium leading-relaxed max-w-3xl mx-auto">
                「お客様に口コミをお願いするのが苦手でした。
                でも今は、アンケートのURLを送るだけ。
                しかも画像まで作れるなんて、最高です。」
              </p>
              <p className="mt-8 text-white/50">
                — 整体院経営・田中様
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInSection>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              今すぐ、はじめよう。
            </h2>
            <p className="text-xl text-black/50 mb-12">
              登録は無料。クレジットカード不要。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/business/register" 
                className="inline-flex items-center justify-center gap-2 bg-[#050505] text-white text-lg font-medium px-10 py-5 rounded-full hover:bg-black/80 transition-all hover:gap-4"
              >
                事業者登録（無料）
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/review" 
                className="inline-flex items-center justify-center gap-2 text-lg font-medium px-10 py-5 rounded-full border-2 border-black/10 hover:border-black/30 transition-colors"
              >
                口コミを書く
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="text-2xl font-bold tracking-tight mb-2">
                利用者の声
              </div>
              <p className="text-black/40 text-sm">
                AI口コミ画像生成サービス
              </p>
            </div>
            
            <nav className="flex flex-wrap gap-8">
              <Link href="/review" className="text-sm font-semibold hover:text-[#3B82F6] transition-colors">
                口コミを書く
              </Link>
              <Link href="/business/register" className="text-sm font-semibold hover:text-[#3B82F6] transition-colors">
                事業者登録
              </Link>
              <Link href="/gallery" className="text-sm font-semibold hover:text-[#3B82F6] transition-colors">
                ギャラリー
              </Link>
              <Link href="/templates" className="text-sm font-semibold hover:text-[#3B82F6] transition-colors">
                テンプレート
              </Link>
            </nav>
          </div>
          
          <div className="mt-16 pt-8 border-t border-black/5 text-center">
            <p className="text-sm text-black/30">
              © 2026 利用者の声. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
