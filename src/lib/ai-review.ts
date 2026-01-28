import { GoogleGenerativeAI } from '@google/generative-ai';
import { SurveyAnswer, SurveyQuestion } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Check if Gemini API is configured
 */
export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

/**
 * Generate review text using Gemini 3 Flash
 */
export async function generateReviewWithGemini(
  serviceName: string,
  description: string,
  whatYouDo: string,
  questions: SurveyQuestion[],
  answers: SurveyAnswer[],
  freeComment: string | null
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

  // Build survey summary for the prompt
  const surveySummary = questions.map(q => {
    const answer = answers.find(a => a.question_id === q.id);
    if (!answer) return null;

    if (q.type === 'rating') {
      return `- ${q.label}: ${answer.value}点 / ${q.max || 5}点`;
    }
    if (q.type === 'multi_select') {
      const selected = Array.isArray(answer.value) ? answer.value.join('、') : answer.value;
      return `- ${q.label}: ${selected}`;
    }
    if (q.type === 'free_text') {
      return `- ${q.label}: ${answer.value}`;
    }
    return null;
  }).filter(Boolean).join('\n');

  const prompt = `あなたは口コミ文章の作成アシスタントです。以下の情報をもとに、自然で信頼感のある口コミ文章を日本語で1つ生成してください。

【サービス名】${serviceName}
【サービス概要】${description}
【提供内容】${whatYouDo}

【アンケート回答】
${surveySummary}
${freeComment ? `【自由コメント】${freeComment}` : ''}

【生成ルール】
- 100〜200文字程度の自然な口コミ文にしてください
- 実際の利用者が書いたような、リアルで具体的な表現を使ってください
- アンケートの回答内容を自然に組み込んでください
- 電話番号、メールアドレス、住所などの個人情報は絶対に含めないでください
- 過度な宣伝文句や誇張表現は避けてください
- 敬体（です・ます調）で書いてください
- 口コミ文章のみを出力してください（説明や注釈は不要）`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text().trim();

  return text;
}
