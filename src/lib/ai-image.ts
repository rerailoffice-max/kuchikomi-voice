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
  templateId: string;
  width: number;
  height: number;
  faceUrl?: string | null;
  logoUrl?: string | null;
}

// テンプレートごとのプロンプトを生成
function buildPromptForTemplate(input: ImageGenerationInput): string {
  const orientation = input.width > input.height ? '横長（landscape）' : '縦長（portrait）';
  const aspectRatio = `${input.width}:${input.height}`;

  const hasFace = !!input.faceUrl;
  const hasLogo = !!input.logoUrl;

  // テンプレートIDに基づくデザイン指示
  const templateDesigns: Record<string, string> = {
    'tpl-000': `
【デザインスタイル：推薦ポスター型】
- 全体を深い紺色やダークブルーのグラデーション背景にする
- 上部にゴールドの★マークと「このサービスをおすすめします！」のキャッチコピー
- 中央に白い角丸カードを配置し、その中に口コミ文を大きく表示
- 口コミ文の先頭に大きな引用符「」を装飾的に配置
- カードの下に★★★★★の五つ星評価
- ${hasFace ? '左下に運営者の顔写真を丸く切り抜いて表示、その横に「ご利用者様より」テキスト' : '左下に「ご利用者様より」テキスト'}
- ${hasLogo ? '右上にロゴを小さく配置' : ''}
- フッターに「※実際のお客様の声をもとに作成」の注釈
- 信頼感・プロフェッショナル感を強調`,

    'tpl-001': `
【デザインスタイル：口コミカード型】
- 白を基調とした清潔感あるデザイン
- 薄いブルーのグラデーション背景
- 中央に大きな白いカードを配置
- カード上部に${hasLogo ? 'ロゴと' : ''}サービス名を目立つように配置
- 「✨ お客様の声 ✨」のラベルをアクセントカラーで表示
- ★★★★★の五つ星を大きめに配置
- 口コミ文を中央揃えで読みやすく
- ${hasFace ? '下部に顔写真（丸型）と「ご利用者様より」' : '下部に「ご利用者様より」'}
- 上品で誠実な印象`,

    'tpl-002': `
【デザインスタイル：大見出しポスター型】
- ダークな背景（紺色〜黒）でインパクト重視
- 超大きな文字で「お客様の声」のヘッダー（アンバー/ゴールド系）
- 中央にクリーム色の口コミボックス
- 口コミ文を力強いフォントで表示
- ${hasLogo ? '下部にロゴと' : '下部に'}サービス名
- ${hasFace ? '右側に運営者の顔写真を配置' : ''}
- 背景に大きな円形のアクセント装飾
- 力強く簡潔なデザイン`,

    'tpl-003': `
【デザインスタイル：口コミまとめ型】
- 薄いグリーンの背景で安心感のあるデザイン
- 上部にサービス名を大きく表示
- 「お客様の声をご紹介」のサブヘッダー
- 3つの口コミカードを縦に並べて表示
- 各カードの左にグリーンのアクセントライン
- 各カードに★評価と口コミ文
- ${hasLogo ? '上部にロゴを配置' : ''}
- ${hasFace ? '各カードに小さな利用者アイコンを配置' : ''}
- 信頼感と実績を強調するレイアウト`,

    'tpl-004': `
【デザインスタイル：シンプルモダン型】
- オフホワイトのミニマルな背景
- 「VOICE」の英字レタリングを上品に配置
- 口コミ文を繊細なフォントで中央表示
- 細い線でセクション区切り
- ${hasLogo ? '下部にロゴを控えめに配置' : ''}サービス名をスタイリッシュに
- ${hasFace ? '顔写真を小さめに洗練された形で配置' : ''}
- 余白を活かしたエレガントなデザイン
- 美容・サロン向けの高級感`,

    'tpl-005': `
【デザインスタイル：ビフォーアフター型】
- 左右2分割のレイアウト
- 左側「Before（お悩み）」：グレー系の落ち着いたトーン
- 右側「After（解決）」：明るく希望に満ちたトーン
- 中央に口コミ文をオーバーレイ表示
- ${hasFace ? '右側に笑顔の顔写真を配置して「変化」を演出' : ''}
- ${hasLogo ? '右下にロゴ' : ''}サービス名を配置
- ★★★★★評価を目立つ位置に
- 変化・成長を視覚的に表現`,

    'tpl-006': `
【デザインスタイル：信頼のバッジ型】
- 濃い青〜ネイビーの高級感ある背景
- 上部に大きなゴールドのバッジ/エンブレムデザイン
- バッジ内に「TRUSTED」「信頼の声」などの文言
- ${hasLogo ? 'バッジの中心にロゴを配置' : 'バッジの中心にサービス名'}
- 口コミ文を白文字で格調高く表示
- ${hasFace ? '下部に顔写真と共にお客様情報を表示' : ''}
- 金色のアクセントラインで区切り
- 権威性・信頼性を最大限演出`,

    'tpl-007': `
【デザインスタイル：雑誌風インタビュー型】
- 白ベースにアクセントカラーの洗練されたレイアウト
- 左列：${hasFace ? '大きな顔写真（正方形）' : '大きなイニシャルアイコン'}
- 右列：口コミ文を対話形式風に配置
- 上部に「Customer Interview」の英字ヘッダー
- ${hasLogo ? '右上にロゴを小さく配置' : ''}
- サービス名を洗練されたタイポグラフィで
- 雑誌のインタビューページ風のレイアウト
- 知的で洗練された印象`,

    'tpl-008': `
【デザインスタイル：SNS風カジュアル型】
- パステルカラーのポップな背景（ピンク〜パープルのグラデーション）
- 吹き出し型の口コミボックス
- 絵文字や装飾をモダンに使用
- ${hasFace ? '上部に顔写真を大きく丸く表示' : '上部にアイコン'}
- ${hasLogo ? '下部にロゴ' : ''}とサービス名をカジュアルに
- 「#おすすめ」「#よかった」風のハッシュタグデザイン
- 若い世代向けの親しみやすいデザイン
- Instagram投稿風のレイアウト`,

    'tpl-009': `
【デザインスタイル：実績数字アピール型】
- 紺色〜ダークグリーンの信頼感ある背景
- 上部に大きな数字「満足度98%」「★4.9」のようなインパクト
- 中央に口コミ文を白いカードで表示
- ${hasLogo ? '左上にロゴ' : ''}、サービス名をしっかり表示
- ${hasFace ? '下部に顔写真と「お客様の声」ラベル' : '下部に「お客様の声」ラベル'}
- 数字で信頼を可視化するデザイン
- ★★★★★の大きな星評価
- データドリブンな訴求力`,
  };

  const designInstruction = templateDesigns[input.templateId] || templateDesigns['tpl-000'];

  return `あなたはプロフェッショナルなグラフィックデザイナーです。
以下の情報をもとに、「利用者の声・推薦の声」のポスター画像を生成してください。
この画像を見た人が「このサービスを受けたい！」と思うような、魅力的で訴求力の高いデザインにしてください。

【サービス情報】
サービス名：${input.serviceName}
サービス概要：${input.description}
提供内容：${input.whatYouDo}
${input.ownerName ? `運営者名：${input.ownerName}` : ''}

【口コミ文（必ず画像に含めること）】
「${input.reviewText}」

${designInstruction}

【共通デザイン要件】
- 向き: ${orientation}（アスペクト比 ${aspectRatio}）
- 日本語テキストをすべて正しく、美しく表示する
- 口コミ文は必ず画像内に読みやすく配置する
- サービス名を必ず含める
- 清潔感・信頼感・プロフェッショナル感のあるデザイン
- 写真やリアルな人物イラストは含めず、グラフィックデザインのみで構成
- 文字は読みやすいサイズとコントラストを確保
- SNSでシェアされたときに目を引くデザイン
- 「この人のサービスを受けたい」と思わせる訴求力

画像を生成してください。`;
}

/**
 * Generate a review poster image using Gemini 2.5 Flash Lite (with image generation)
 */
export async function generateImageWithGemini(input: ImageGenerationInput): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-image',
    generationConfig: {
      // @ts-expect-error - responseModalities is supported but not in types yet
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  const prompt = buildPromptForTemplate(input);

  try {
    const result = await model.generateContent([{ text: prompt }]);
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
  } catch (error) {
    console.error('Gemini image generation error:', error);
    throw error;
  }
}
