import { ImageResponse } from '@vercel/og';
import React from 'react';
import { readFile } from 'fs/promises';
import { join } from 'path';
import {
  templateComponents,
  TemplateProps,
  Template000,
} from './image-templates';

// 口コミ文からキャッチコピーを生成
export function generateCatchCopy(reviewText: string): string {
  // キーワードに基づいてキャッチコピーを生成
  const text = reviewText.toLowerCase();

  // 変化・改善系
  if (/嘘のよう|信じられ|驚|びっくり/.test(text)) {
    const match = reviewText.match(/(.{2,8})(が|は)(嘘のよう|信じられ)/);
    if (match) return `${match[1]}が、嘘みたい。`;
  }

  if (/楽にな|軽くな|消え|なくな|取れ/.test(text)) {
    const match = reviewText.match(/(.{2,8})(が|は)(楽にな|軽くな|消え|なくな|取れ)/);
    if (match) return `${match[1]}が、消えた。`;
  }

  // 安心・信頼系
  if (/丁寧|親切|優しい|寄り添/.test(text)) {
    return '任せて、安心。';
  }

  if (/説明|わかりやすい|納得/.test(text)) {
    return '納得できる、説明。';
  }

  // リピート系
  if (/また|リピート|通い|次も/.test(text)) {
    return 'また、来たくなる。';
  }

  // 推薦系
  if (/おすすめ|紹介|勧め/.test(text)) {
    return '人に勧めたい。';
  }

  // 満足系
  if (/最高|素晴らし|満足|感動/.test(text)) {
    return '期待を、超えた。';
  }

  // 感謝系
  if (/ありがと|感謝/.test(text)) {
    return '出会えて、よかった。';
  }

  // デフォルト：口コミの最初の部分を使用
  const firstSentence = reviewText.split(/[。！!]/)[0];
  if (firstSentence.length <= 15) {
    return firstSentence + '。';
  }
  return firstSentence.slice(0, 12) + '...';
}

export interface PosterGenerationInput {
  serviceName: string;
  description: string;
  ownerName: string | null;
  reviewText: string;
  templateId: string;
  width: number;
  height: number;
  faceUrl: string | null;
  logoUrl: string | null;
}

// フォントキャッシュ
let fontCache: ArrayBuffer | null = null;

// フォントを読み込む関数
async function loadFont(): Promise<ArrayBuffer> {
  // キャッシュがあれば返す
  if (fontCache) {
    return fontCache;
  }

  // 方法1: ローカルファイルから読み込み（開発/Vercel両方で動作）
  try {
    const fontPath = join(process.cwd(), 'public', 'fonts', 'NotoSansJP-Regular.ttf');
    const fontData = await readFile(fontPath);
    fontCache = fontData.buffer.slice(fontData.byteOffset, fontData.byteOffset + fontData.byteLength);
    console.log('Font loaded from local file');
    return fontCache;
  } catch (localError) {
    console.warn('Failed to load local font:', localError);
  }

  // 方法2: fetch経由でCDNから取得（Vercel Edgeでローカルファイルが使えない場合）
  const fontUrls = [
    // 信頼性の高いCDNソース
    'https://cdn.jsdelivr.net/gh/nicolo-ribaudo/nicolo-ribaudo.github.io@master/files/noto-sans-jp.otf',
    'https://raw.githubusercontent.com/nicolo-ribaudo/nicolo-ribaudo.github.io/master/files/noto-sans-jp.otf',
  ];

  for (const fontUrl of fontUrls) {
    try {
      const response = await fetch(fontUrl);
      if (response.ok) {
        fontCache = await response.arrayBuffer();
        console.log(`Font loaded from CDN: ${fontUrl}`);
        return fontCache;
      }
    } catch (e) {
      console.warn(`Failed to load font from ${fontUrl}:`, e);
    }
  }

  throw new Error('Failed to load font from all sources');
}

// 画像を生成する関数
export async function generatePosterImage(input: PosterGenerationInput): Promise<ArrayBuffer> {
  const catchCopy = generateCatchCopy(input.reviewText);

  const props: TemplateProps = {
    serviceName: input.serviceName,
    description: input.description,
    ownerName: input.ownerName,
    reviewText: input.reviewText,
    faceUrl: input.faceUrl,
    logoUrl: input.logoUrl,
    width: input.width,
    height: input.height,
    catchCopy,
  };

  // テンプレートコンポーネントを取得
  const TemplateComponent = templateComponents[input.templateId] || Template000;

  // フォントを読み込み
  const fontData = await loadFont();

  // ImageResponseを生成
  const imageResponse = new ImageResponse(
    React.createElement(TemplateComponent, props),
    {
      width: input.width,
      height: input.height,
      fonts: [
        {
          name: 'Noto Sans JP',
          data: fontData,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );

  // ArrayBufferとして返す
  return imageResponse.arrayBuffer();
}

// Base64 Data URLとして画像を生成
export async function generatePosterImageAsDataUrl(input: PosterGenerationInput): Promise<string> {
  const arrayBuffer = await generatePosterImage(input);
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  return `data:image/png;base64,${base64}`;
}
