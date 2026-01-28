import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export function isGeminiImageConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

interface ImageGenerationInput {
  serviceName: string;
  description: string;
  whatYouDo: string;
  ownerName: string | null;
  reviewText: string;
  templateStyle: string;
  width: number;
  height: number;
}

/**
 * Generate a review poster image using Gemini 2.5 Flash Lite
 */
export async function generateImageWithGemini(input: ImageGenerationInput): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite-preview-09-2025' });

  const orientation = input.width > input.height ? '横長' : '縦長';
  const aspectRatio = `${input.width}:${input.height}`;

  const prompt = `以下の情報をもとに、プロフェッショナルな口コミ・利用者の声のポスター画像を生成してください。

【サービス名】${input.serviceName}
【サービス概要】${input.description}
【提供内容】${input.whatYouDo}
${input.ownerName ? `【運営者名】${input.ownerName}` : ''}

【口コミ文】
「${input.reviewText}」

【デザイン指示】
- スタイル: ${input.templateStyle}
- 向き: ${orientation}（アスペクト比 ${aspectRatio}）
- サービス名を目立つ位置に配置
- 口コミ文を読みやすく中央付近に配置
- 「利用者の声」「お客様の声」などのヘッダーテキストを含める
- 日本語テキストをすべて正しく表示
- 清潔感があり信頼感のあるデザイン
- 背景は落ち着いた色合い
- 飾り枠や装飾は控えめに
- 写真やリアルな人物は含めない（グラフィックデザインのみ）`;

  const result = await model.generateContent([
    { text: prompt },
  ]);

  const response = result.response;
  const candidates = response.candidates;

  if (!candidates || candidates.length === 0) {
    throw new Error('画像生成に失敗しました: レスポンスが空です');
  }

  // Check for inline data (image)
  for (const candidate of candidates) {
    if (candidate.content && candidate.content.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
  }

  throw new Error('画像生成に失敗しました: 画像データが見つかりません');
}
