import { SurveyAnswer, SurveyQuestion } from '@/types';

/**
 * Mock AI review generation
 * Will be replaced with actual OpenAI/Claude API call
 */
export function generateMockReview(
  serviceName: string,
  description: string,
  whatYouDo: string,
  questions: SurveyQuestion[],
  answers: SurveyAnswer[],
  freeComment: string | null
): string {
  // Find rating answer
  const ratingQ = questions.find(q => q.type === 'rating');
  const ratingAnswer = ratingQ
    ? answers.find(a => a.question_id === ratingQ.id)
    : null;
  const rating = ratingAnswer ? Number(ratingAnswer.value) : 4;

  // Find selected good points
  const multiQ = questions.find(q => q.type === 'multi_select');
  const multiAnswer = multiQ
    ? answers.find(a => a.question_id === multiQ.id)
    : null;
  const goodPoints = Array.isArray(multiAnswer?.value)
    ? (multiAnswer.value as string[])
    : [];

  // Build review based on data
  const satisfactionText = getSatisfactionText(rating);
  const goodPointsText = goodPoints.length > 0
    ? `特に${goodPoints.join('と')}が素晴らしかったです。`
    : '';
  const commentText = freeComment
    ? `${freeComment}という点も印象的でした。`
    : '';

  const templates = [
    `${serviceName}を利用しました。${satisfactionText}${goodPointsText}${commentText}${whatYouDo}に興味がある方にぜひおすすめです。`,
    `初めて${serviceName}にお世話になりました。${satisfactionText}${goodPointsText}${commentText}また利用したいと思います。`,
    `${serviceName}の${whatYouDo}を体験しました。${satisfactionText}${goodPointsText}${commentText}友人にも紹介したいと思えるサービスでした。`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

function getSatisfactionText(rating: number): string {
  if (rating >= 5) return '非常に満足しています。期待以上の体験でした。';
  if (rating >= 4) return 'とても満足しています。丁寧な対応が好印象でした。';
  if (rating >= 3) return '全体的に良い体験でした。';
  return 'サービスを受けることができました。';
}

/**
 * Validate review text for NG patterns
 */
export function validateReviewText(text: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check for phone numbers
  if (/\d{2,4}[-\s]?\d{2,4}[-\s]?\d{3,4}/.test(text)) {
    issues.push('電話番号が含まれている可能性があります');
  }

  // Check for email addresses
  if (/[\w.-]+@[\w.-]+\.\w+/.test(text)) {
    issues.push('メールアドレスが含まれている可能性があります');
  }

  // Check for addresses
  if (/[都道府県市区町村]\d/.test(text)) {
    issues.push('住所が含まれている可能性があります');
  }

  return { valid: issues.length === 0, issues };
}
