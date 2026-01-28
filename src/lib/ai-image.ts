import { GoogleGenerativeAI, Part } from '@google/generative-ai';

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

/**
 * 画像URLからBase64データを取得する
 * Data URLの場合はそのまま抽出、HTTP URLの場合はfetchして変換
 */
async function fetchImageAsBase64(url: string): Promise<{ data: string; mimeType: string } | null> {
  try {
    if (url.startsWith('data:')) {
      // Data URL: data:image/jpeg;base64,/9j/4AAQ...
      const match = url.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        return { mimeType: match[1], data: match[2] };
      }
      return null;
    }

    // HTTP(S) URL: Supabase Storage等からfetch
    const response = await fetch(url);
    if (!response.ok) return null;

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return { mimeType: contentType, data: base64 };
  } catch (error) {
    console.error('Failed to fetch image:', error);
    return null;
  }
}

export interface PromptDebugOutput {
  textPrompt: string;
  hasUserFaceImage: boolean;
  hasUserLogoImage: boolean;
  templateId: string;
  templateName: string;
  orientation: string;
  width: number;
  height: number;
}

function buildPromptForTemplate(input: ImageGenerationInput): string {
  const orientation = input.width > input.height ? '横長（landscape）' : '縦長（portrait）';

  // 口コミ文の感情分析に基づくビジュアル方向性を自動導出
  const reviewEmotionGuide = analyzeReviewEmotion(input.reviewText, input.serviceName, input.whatYouDo);

  const templateDesigns: Record<string, string> = {
    'tpl-000': `
■テンプレートスタイル：モノクロ・コラージュ型（推薦ポスター）

【色彩設計】
背景: #111111 / 文字: #FFFFFF / アクセント: #E8D44D（イエロー）/ サブ: #CCCCCC
Swiss Style非対称グリッドで4〜6ブロックに分割。各ブロック境界は白の細罫線。

【レイアウト骨格】
- 上部40%：キャッチコピー（後述）を極太ゴシックで。ジャンプ率20倍。白文字。
- 左中25%：顔写真エリア（正方形、白の枠線）
- 右中25%：口コミ全文を白文字で。引用符「」を#E8D44D で大きく装飾。行間1.8em。
- 下部10%：サービス名を#E8D44D 太字。★★★★★。ロゴエリア右端。
- 背景に薄く（opacity 8%）大きな「RECOMMEND」を斜め配置。`,

    'tpl-001': `
■テンプレートスタイル：アイソメトリック・イエロー型（口コミカード）

【色彩設計】
背景: #FFFFFF / 文字: #1A1A1A / アクセント: #FFD700 / サブ: #F5F5F5
Bauhaus式幾何学グリッド。整然とした左揃え。

【レイアウト骨格】
- 最上部：#FFD700 太い水平ライン（8px）
- ヘッダー15%：左にサービス名（極太ゴシック）、右にロゴ
- 顔写真エリア25%：中央左に丸型（幅28%）、#FFD700 太い枠線（4px）
- 口コミカード40%：#F5F5F5 角丸カード。左端に#FFD700 アクセントライン（6px）。内部に口コミ全文。上部に★★★★★。
- フッター15%：サービス概要を#666666 で。`,

    'tpl-002': `
■テンプレートスタイル：コラージュ・タイポグラフィ型（大見出しインパクト）

【色彩設計】
背景: #FAFAFA / 文字: #111111 / 赤: #E53935 / 青: #1565C0 / 黄: #FFD600
Swiss Style非対称。画像左端に赤の縦帯（幅8%）、上端に青の横帯（高さ5%）。

【レイアウト骨格】
- 赤帯内：縦書き「VOICE」白文字
- 青帯内：サービス名を白で太く
- メイン上部35%：キャッチコピーを超極太文字で。ジャンプ率25倍。一部文字を赤に。
- 中部左25%：顔写真エリア（正方形）
- 中部右25%：口コミ全文を#FFD600 角丸ボックス内に
- 下部15%：★★★★★を#FFD600。概要とロゴ。`,

    'tpl-003': `
■テンプレートスタイル：手書き水彩風型（温かみ）

【色彩設計】
背景: #FFF8F0 / 文字: #4A3728 / アクセント: #E8927C（コーラル）/ サブ: #A7C4A0（セージ）
背景に薄い水彩にじみ（ピンク＋グリーン）。有機的な曲線レイアウト。

【レイアウト骨格】
- ヘッダー15%：サービス名（手書き風フォント）、ロゴ左上
- 顔写真エリア20%：丸型、水彩風にじみ枠
- 口コミエリア50%：白カード（影付き）を少し傾けて配置。#E8927C の花・葉装飾。カード内に★評価と口コミ全文。丸ゴシック体。
- フッター15%：#A7C4A0 の柔らかい帯にサービス概要。`,

    'tpl-004': `
■テンプレートスタイル：手書きモノクロ型（ミニマル和風）

【色彩設計】
背景: #F7F3EE（和紙）/ 文字: #2C2C2C（墨色）/ アクセント: #C4956A（金茶）/ サブ: #8C8C8C
和紙テクスチャ。書道的な余白の美。中央揃え。

【レイアウト骨格】
- 上部余白10%：空白
- 見出し10%：「VOICE」を#C4956A 細字で中央。墨色の水平線。
- 顔写真15%：小さめ丸型（幅15%）。細い明朝体で事業者名。
- 口コミ文35%：中央揃え。明朝体。上下に墨色の水平線。行間2.0em。
- ★評価5%：★★★★★を#C4956A で控えめに。
- サービス情報10%：控えめに中央配置。
- 下部余白15%：空白。`,

    'tpl-005': `
■テンプレートスタイル：ビジネス・スタンダード型（ビフォーアフター）

【色彩設計】
背景: #FFFFFF / 文字: #1E293B / アクセント: #2563EB / サブ: #64748B
Before: #94A3B8 / After: #2563EB。2カラム対称グリッド。

【レイアウト骨格】
- ヘッダー10%：#2563EB 帯に白文字「お客様の声」＋★★★★★
- 左カラム45%：「Before」ラベル。悩みの提示（後述のキャッチから導出）。#F1F5F9 背景。
- 右カラム45%：「After」ラベル（#2563EB 太字）。口コミ全文を#1E293B 太ゴシックで。#F8FAFC 背景。
- 中央分割線に顔写真を丸型（幅25%）で配置。
- フッター10%：サービス名、ロゴ、概要。`,

    'tpl-006': `
■テンプレートスタイル：アイソメトリック・カラー型（信頼バッジ）

【色彩設計】
背景: #0C1220 / 文字: #FFFFFF / ゴールド: #D4A853 / 青: #3B82F6
中央集中型対称レイアウト。四隅に幾何学模様。

【レイアウト骨格】
- バッジエリア30%：大きなゴールド円形エンブレム（「TRUSTED」）、ロゴ、放射線装飾。
- 顔写真20%：バッジ直下に丸型（幅22%）。#D4A853 枠。
- 口コミ文35%：白文字中央揃え。上下に#D4A853 装飾ライン。
- ★評価5%：★★★★★を#D4A853 で中央。
- フッター10%：サービス名を#D4A853、概要を#CCCCCC。`,

    'tpl-007': `
■テンプレートスタイル：雑誌風コラージュ型（インタビュー）

【色彩設計】
背景: #FFFFFF / 文字: #1A1A1A / アクセント: #DC2626（赤）/ サブ: #6B7280
雑誌エディトリアル3カラムグリッド。

【レイアウト骨格】
- ヘッダー帯6%：#DC2626 帯に「CUSTOMER INTERVIEW」白キャピタル。
- 左カラム40%：顔写真を大きな正方形（幅38%）。事業者名、サービス名（#DC2626）、ロゴ。
- 右カラム55%：装飾引用符（#DC2626）→ 口コミ全文（セリフ体、行間2.0em）。「Q.サービスを受けていかがでしたか？」を小さく。★★★★★。概要。
- カラム間に#E5E7EB 縦罫線。`,

    'tpl-008': `
■テンプレートスタイル：シティポップ・コラージュ型（SNSカジュアル）

【色彩設計】
背景: #FDF2F8→#EDE9FE グラデーション / 文字: #1F2937 / ピンク: #EC4899 / 紫: #8B5CF6 / シアン: #06B6D4
自由で遊び心あるレイアウト。要素を少し傾ける。

【レイアウト骨格】
- 背景に小さな幾何学模様（★○△）を散りばめ。
- 顔写真25%：大きな丸型（幅30%）、白枠（6px）、3度傾斜。事業者名を#EC4899 で。
- 吹き出しカード45%：白の吹き出し型（角丸24px、影）。尖りが顔写真を指す。内部に★★★★★と口コミ全文。丸ゴシック。
- ハッシュタグ10%：#8B5CF6 でハッシュタグ風テキスト。
- ロゴ・サービス情報15%。
- 背景に「LOVE IT!」等を薄く散りばめ。`,

    'tpl-009': `
■テンプレートスタイル：ミニチュア・フォトリアル型（実績数字）

【色彩設計】
背景: #0F172A / 文字: #FFFFFF / シアン: #06B6D4→#22D3EE / ダークティール: #164E63
上下分割。微細ドットパターン背景。

【レイアウト骨格】
- 数字エリア35%：「★ 4.9」をシアングラデーション超極太で。ジャンプ率30倍。グロウ効果。下に「お客様満足度」白文字。
- 中央左40%：顔写真丸型（幅22%）。#06B6D4 枠。事業者名。ロゴ。
- 中央右55%：白の角丸カード。内部に口コミ全文。★★★★★を#06B6D4。
- フッター15%：サービス名（#06B6D4）、概要。
- 背景に巨大数字をゴースト（opacity 8%）で。`,
  };

  const designInstruction = templateDesigns[input.templateId] || templateDesigns['tpl-000'];

  return `あなたはプロフェッショナルなグラフィックデザイナーであり、コピーライターです。
以下の情報をもとに、「推薦の声」ポスター画像を1枚生成してください。

━━━━━━━━━━━━━━━━━━━━
■ 最重要：この画像の核心
━━━━━━━━━━━━━━━━━━━━

この画像の主役は「利用者の口コミ」です。
口コミの内容から、サービスの魅力が見る人に伝わり、
「自分もこのサービスを受けたい！」と思わせることが目的です。

以下の口コミを読み、その感情・体験・変化をビジュアルに反映してください：

┌──────────────────────────────┐
│ 口コミ文（※全文を画像に含めること。省略不可）
│
│「${input.reviewText}」
└──────────────────────────────┘

${reviewEmotionGuide}

━━━━━━━━━━━━━━━━━━━━
■ キャッチコピー生成指示
━━━━━━━━━━━━━━━━━━━━

上記の口コミ文の内容から、以下のルールでキャッチコピーを自動生成し、
画像内の見出しとして最も目立つ位置に配置してください：

【キャッチコピーの生成ルール】
1. 口コミ文の中で最も印象的な一言や感動を表す部分を抽出する
2. それを短く（15文字以内）パンチのある表現に言い換える
3. 見る人が「何のサービス？知りたい！」と思うような好奇心を刺激する
4. 抽象的でなく、口コミの具体的な体験に基づくこと

【キャッチコピーの例（参考）】
- 口コミが「肩こりが嘘のように消えた」なら → 「嘘みたいに、軽い。」
- 口コミが「丁寧に話を聞いてくれた」なら → 「話すだけで、楽になれた。」
- 口コミが「子どもも安心して通えた」なら → 「子どもが自分から行きたがる場所。」

※キャッチコピーは口コミの本質を凝縮したもの。口コミと無関係な美辞麗句は禁止。

━━━━━━━━━━━━━━━━━━━━
■ サービス情報
━━━━━━━━━━━━━━━━━━━━

サービス名：${input.serviceName}
サービス概要：${input.description}
提供内容：${input.whatYouDo}
${input.ownerName ? `事業者名：${input.ownerName}` : ''}

━━━━━━━━━━━━━━━━━━━━
■ 添付画像の使用指示
━━━━━━━━━━━━━━━━━━━━

【事業者の顔写真】
${input.faceUrl ? '添付の顔写真をそのまま画像内の顔写真エリアに配置してください。丸型または正方形にクロップし、レイアウトの指定位置に配置。加工・変形せずそのまま使用すること。この実物の顔写真が信頼感の源です。' : '顔写真なし。事業者名のイニシャルを丸型アイコンで表示してください。'}

【サービスロゴ】
${input.logoUrl ? '添付のロゴをそのままロゴエリアに配置。アスペクト比を維持し適切なサイズで。' : 'ロゴなし。サービス名テキストで代替。'}

━━━━━━━━━━━━━━━━━━━━
■ デザイン仕様
━━━━━━━━━━━━━━━━━━━━
${designInstruction}

━━━━━━━━━━━━━━━━━━━━
■ 共通ルール
━━━━━━━━━━━━━━━━━━━━

【テキストのルール】
- 口コミ文は一字一句省略せず全文を含める
- キャッチコピーは口コミ内容に基づいて生成すること
- サービス名を必ず含める
- ★★★★★の五つ星評価を必ず含める
- 日本語テキストは正確に美しく表示。文字化けNG
- Markdown記号（# * ** など）は使わない

【レイアウトのルール】
- 向き: ${orientation}
- 余白：画像端から5%以上のマージン
- 視線の流れ：キャッチコピー → 顔写真 → 口コミ文 → サービス名
- 情報を詰め込みすぎない。空白は味方

【顔写真のルール】
${input.faceUrl ? '- 添付の実際の顔写真をそのまま使用する。AIで顔を描き直してはいけない。' : '- 人物の顔や体をAIで描かない。イニシャルアイコンで代替する。'}
- 顔写真エリアは必ず配置すること（信頼感の源）

画像を生成してください。`;
}

/**
 * 口コミ文の内容を分析し、ビジュアル方向性のガイドを返す
 */
function analyzeReviewEmotion(reviewText: string, serviceName: string, whatYouDo: string): string {
  const review = reviewText.toLowerCase();

  // 口コミに含まれるキーワードから感情・テーマを分析
  const themes: string[] = [];

  // 変化・改善系
  if (/変わ|改善|良くな|治|楽にな|軽くな|解決|なくな|消え|取れ/.test(review)) {
    themes.push('【変化・改善】口コミに「変化」が語られています。Before→Afterの対比感をビジュアルに表現してください。暗い色調→明るい色調への変化や、矢印・グラデーションで改善を暗示。');
  }

  // 感動・驚き系
  if (/感動|驚|すごい|びっくり|信じられ|想像以上|期待以上|嘘みたい/.test(review)) {
    themes.push('【感動・驚き】口コミに驚きや感動が表現されています。感嘆符的な装飾や、光のエフェクト、特別感のある演出をビジュアルに取り入れてください。');
  }

  // 安心・信頼系
  if (/安心|信頼|丁寧|親切|優しい|寄り添|聞いて|相談|説明/.test(review)) {
    themes.push('【安心・信頼】口コミに信頼感や安心感が語られています。温かみのある色調、落ち着いたトーン、顔写真を大きく配置して「この人なら任せられる」感を強調してください。');
  }

  // 継続・リピート系
  if (/また|リピート|通い|続け|定期|毎回|ずっと|次も/.test(review)) {
    themes.push('【継続・リピート】利用者がリピート意欲を示しています。「継続される信頼」を感じさせる安定感のあるデザインに。');
  }

  // 推薦・紹介系
  if (/おすすめ|紹介|教え|勧め|周り|友人|家族|知人/.test(review)) {
    themes.push('【推薦・紹介】利用者が他者に薦めています。「人に勧めたくなるほど良い」という強い推薦感をビジュアルに。推薦バッジや強調マークなどの活用。');
  }

  // プロ・専門性系
  if (/プロ|専門|知識|技術|スキル|経験|実力|さすが/.test(review)) {
    themes.push('【専門性】利用者がプロとしての実力を認めています。格式や専門性を感じさせる洗練されたデザイン。');
  }

  // 喜び・満足系
  if (/嬉し|幸せ|楽し|満足|最高|素晴らし|素敵|ありがと|感謝/.test(review)) {
    themes.push('【喜び・感謝】口コミに喜びや感謝が溢れています。明るく前向きな色使い、温かみのある表現でポジティブな感情を増幅。');
  }

  if (themes.length === 0) {
    themes.push(`【口コミの反映】この口コミ文の内容を読み取り、利用者が「${serviceName}」の「${whatYouDo}」を通じて感じた価値をビジュアルに反映してください。口コミの言葉が持つ温度感（熱量が高いか穏やかか）をデザインのトーンに反映すること。`);
  }

  return `━━━━━━━━━━━━━━━━━━━━
■ 口コミ分析に基づくビジュアル方向性
━━━━━━━━━━━━━━━━━━━━

この口コミから読み取れる感情・テーマに基づき、以下の方向性でビジュアルを構成してください：

${themes.join('\n\n')}

【重要】
- 口コミの具体的な体験や感情が、見る人にも伝わるような画像にすること
- 口コミ文を「ただ配置する」のではなく、口コミの内容がビジュアル全体と調和し、
  読んだ人が「このサービスは本物だ」と感じるデザインにすること
- サービスの内容（${whatYouDo}）と口コミの内容が視覚的に繋がるようにすること`;
}

/**
 * Generate a review poster image using Gemini 3 Pro Image Preview
 * 顔写真・ロゴ画像が提供されている場合、実画像をGemini APIに渡して画像内に合成する
 */
export async function generateImageWithGemini(input: ImageGenerationInput): Promise<{
  imageDataUrl: string;
  promptDebug: PromptDebugOutput;
}> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3-pro-image-preview',
    generationConfig: {
      // @ts-expect-error - responseModalities is supported but not in types yet
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  const prompt = buildPromptForTemplate(input);
  const orientation = input.width > input.height ? '横長（landscape）' : '縦長（portrait）';

  // マルチモーダル入力パーツを構築
  const parts: Part[] = [];

  // 顔写真をBase64で取得してパーツに追加
  let hasFaceImage = false;
  if (input.faceUrl) {
    const faceData = await fetchImageAsBase64(input.faceUrl);
    if (faceData) {
      parts.push({ text: '【添付画像1: 事業者の顔写真】以下の画像を顔写真エリアにそのまま配置してください：' });
      parts.push({
        inlineData: {
          mimeType: faceData.mimeType,
          data: faceData.data,
        },
      });
      hasFaceImage = true;
    }
  }

  // ロゴ画像をBase64で取得してパーツに追加
  let hasLogoImage = false;
  if (input.logoUrl) {
    const logoData = await fetchImageAsBase64(input.logoUrl);
    if (logoData) {
      parts.push({ text: '【添付画像2: サービスロゴ】以下の画像をロゴエリアにそのまま配置してください：' });
      parts.push({
        inlineData: {
          mimeType: logoData.mimeType,
          data: logoData.data,
        },
      });
      hasLogoImage = true;
    }
  }

  // メインプロンプトを追加
  parts.push({ text: prompt });

  // デバッグ用プロンプト情報
  const promptDebug: PromptDebugOutput = {
    textPrompt: prompt,
    hasUserFaceImage: hasFaceImage,
    hasUserLogoImage: hasLogoImage,
    templateId: input.templateId,
    templateName: input.templateStyle,
    orientation,
    width: input.width,
    height: input.height,
  };

  try {
    const result = await model.generateContent(parts);
    const response = result.response;
    const candidates = response.candidates;

    if (!candidates || candidates.length === 0) {
      throw new Error('画像生成に失敗しました: レスポンスが空です');
    }

    for (const candidate of candidates) {
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
            return {
              imageDataUrl: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
              promptDebug,
            };
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
