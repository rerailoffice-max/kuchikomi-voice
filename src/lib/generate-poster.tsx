import { ImageResponse } from '@vercel/og';
import React from 'react';
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

// フォントをfetchする関数
async function loadFont(): Promise<ArrayBuffer> {
  // Google Fonts から Noto Sans JP を取得
  const fontUrl = 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFJEk757Y0rw_qMHVdbR2L8Y9QTJ1LwkRmR5GprQAe-T30Q.ttf';

  const response = await fetch(fontUrl);
  if (!response.ok) {
    throw new Error('Failed to load font');
  }
  return response.arrayBuffer();
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
