import { Template, Business } from '@/types';

export interface ImageGenerationParams {
  template: Template;
  business: Business;
  reviewText: string;
  orientation: 'portrait' | 'landscape';
  width: number;
  height: number;
}

/**
 * Generate HTML template for the review image
 * This will be rendered and converted to an image on the client side
 */
export function generateImageHTML(params: ImageGenerationParams): string {
  const { template } = params;
  const { style } = template;
  const layoutType = style.layout as string;

  switch (layoutType) {
    case 'card':
      return generateCardLayout(params);
    case 'headline':
      return generateHeadlineLayout(params);
    case 'multi':
      return generateMultiLayout(params);
    case 'minimal':
      return generateMinimalLayout(params);
    case 'recommendation':
      return generateRecommendationLayout(params);
    default:
      return generateRecommendationLayout(params);
  }
}

/**
 * 推薦型レイアウト - 顔写真とロゴを大きく使い「この人のサービスをおすすめします！」という訴求
 */
function generateRecommendationLayout({ business, reviewText, width, height, template }: ImageGenerationParams): string {
  const { style } = template;
  const scale = width / 1080;
  
  return `
    <div style="
      width: ${width}px; height: ${height}px;
      background: linear-gradient(145deg, ${style.primaryColor} 0%, #1a1a2e 100%);
      display: flex; flex-direction: column;
      font-family: 'Noto Sans JP', 'Hiragino Sans', sans-serif;
      position: relative;
      overflow: hidden;
    ">
      <!-- 背景装飾 -->
      <div style="
        position: absolute; top: -${100 * scale}px; right: -${100 * scale}px;
        width: ${400 * scale}px; height: ${400 * scale}px;
        background: rgba(255,255,255,0.05); border-radius: 50%;
      "></div>
      <div style="
        position: absolute; bottom: -${150 * scale}px; left: -${150 * scale}px;
        width: ${500 * scale}px; height: ${500 * scale}px;
        background: rgba(255,255,255,0.03); border-radius: 50%;
      "></div>

      <!-- ヘッダー部分 -->
      <div style="
        padding: ${40 * scale}px ${50 * scale}px ${20 * scale}px;
        display: flex; align-items: center; gap: ${20 * scale}px;
      ">
        ${business.logo_url ? `
          <img src="${business.logo_url}" style="
            width: ${80 * scale}px; height: ${80 * scale}px;
            object-fit: contain; border-radius: ${12 * scale}px;
            background: white; padding: ${8 * scale}px;
          " crossorigin="anonymous" />
        ` : ''}
        <div>
          <div style="
            font-size: ${32 * scale}px; font-weight: 800;
            color: white; line-height: 1.2;
          ">${business.service_name}</div>
          <div style="
            font-size: ${16 * scale}px; color: rgba(255,255,255,0.7);
            margin-top: ${4 * scale}px;
          ">${business.what_you_do || business.description.slice(0, 30)}</div>
        </div>
      </div>

      <!-- メインコンテンツ -->
      <div style="
        flex: 1; display: flex; flex-direction: column;
        padding: ${30 * scale}px ${50 * scale}px;
        gap: ${25 * scale}px;
      ">
        <!-- 推薦バッジ -->
        <div style="
          display: flex; align-items: center; gap: ${12 * scale}px;
        ">
          <div style="
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            color: #1a1a2e; font-size: ${18 * scale}px; font-weight: 800;
            padding: ${10 * scale}px ${24 * scale}px; border-radius: ${30 * scale}px;
            display: flex; align-items: center; gap: ${8 * scale}px;
            box-shadow: 0 ${4 * scale}px ${15 * scale}px rgba(255,215,0,0.3);
          ">
            <span style="font-size: ${22 * scale}px;">⭐</span>
            このサービスをおすすめします！
          </div>
        </div>

        <!-- 口コミカード -->
        <div style="
          background: rgba(255,255,255,0.95);
          border-radius: ${24 * scale}px;
          padding: ${35 * scale}px;
          box-shadow: 0 ${20 * scale}px ${60 * scale}px rgba(0,0,0,0.3);
          position: relative;
        ">
          <!-- 引用マーク -->
          <div style="
            position: absolute; top: ${15 * scale}px; left: ${25 * scale}px;
            font-size: ${80 * scale}px; color: ${style.primaryColor}; opacity: 0.15;
            font-family: Georgia, serif; line-height: 1;
          ">"</div>

          <div style="
            font-size: ${24 * scale}px; line-height: 1.8;
            color: #1E293B; position: relative; z-index: 1;
            font-weight: 500;
          ">${reviewText}</div>

          <!-- 星評価 -->
          <div style="
            display: flex; gap: ${6 * scale}px; margin-top: ${20 * scale}px;
            font-size: ${28 * scale}px;
          ">
            ${'<span style="color: #FFD700;">★</span>'.repeat(5)}
          </div>
        </div>

        <!-- 利用者情報 -->
        <div style="
          display: flex; align-items: center; gap: ${20 * scale}px;
          margin-top: auto;
        ">
          ${business.face_url ? `
            <div style="
              width: ${100 * scale}px; height: ${100 * scale}px;
              border-radius: 50%; overflow: hidden;
              border: ${4 * scale}px solid rgba(255,255,255,0.3);
              box-shadow: 0 ${8 * scale}px ${25 * scale}px rgba(0,0,0,0.3);
            ">
              <img src="${business.face_url}" style="
                width: 100%; height: 100%; object-fit: cover;
              " crossorigin="anonymous" />
            </div>
          ` : `
            <div style="
              width: ${100 * scale}px; height: ${100 * scale}px;
              border-radius: 50%; background: rgba(255,255,255,0.2);
              display: flex; align-items: center; justify-content: center;
              font-size: ${40 * scale}px; color: white;
            ">👤</div>
          `}
          <div>
            <div style="
              font-size: ${20 * scale}px; color: rgba(255,255,255,0.7);
            ">ご利用者様より</div>
            ${business.owner_name ? `
              <div style="
                font-size: ${16 * scale}px; color: rgba(255,255,255,0.5);
                margin-top: ${4 * scale}px;
              ">担当: ${business.owner_name}</div>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- フッター -->
      <div style="
        padding: ${25 * scale}px ${50 * scale}px;
        background: rgba(0,0,0,0.2);
        display: flex; align-items: center; justify-content: space-between;
      ">
        <div style="
          font-size: ${14 * scale}px; color: rgba(255,255,255,0.5);
        ">※ 実際のお客様の声をもとに作成しています</div>
        <div style="
          font-size: ${16 * scale}px; color: white; font-weight: 600;
        ">${business.service_name}</div>
      </div>
    </div>
  `;
}

function generateCardLayout({ business, reviewText, width, height, template }: ImageGenerationParams): string {
  const { style } = template;
  const scale = width / 1080;
  
  return `
    <div style="
      width: ${width}px; height: ${height}px;
      background: linear-gradient(145deg, ${style.secondaryColor} 0%, ${style.backgroundColor} 100%);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: ${60 * scale}px;
      font-family: 'Noto Sans JP', 'Hiragino Sans', sans-serif;
      position: relative;
    ">
      <!-- 装飾 -->
      <div style="
        position: absolute; top: ${30 * scale}px; right: ${30 * scale}px;
        width: ${200 * scale}px; height: ${200 * scale}px;
        background: ${style.primaryColor}; opacity: 0.08; border-radius: 50%;
      "></div>

      <!-- メインカード -->
      <div style="
        background: white; border-radius: ${24 * scale}px;
        box-shadow: 0 ${20 * scale}px ${60 * scale}px rgba(0,0,0,0.12);
        padding: ${50 * scale}px;
        width: 88%; max-height: 85%;
        display: flex; flex-direction: column; align-items: center; gap: ${25 * scale}px;
      ">
        <!-- ヘッダー：ロゴと店名 -->
        <div style="display: flex; align-items: center; gap: ${20 * scale}px;">
          ${business.logo_url ? `
            <img src="${business.logo_url}" style="
              width: ${70 * scale}px; height: ${70 * scale}px;
              object-fit: contain; border-radius: ${12 * scale}px;
            " crossorigin="anonymous" />
          ` : ''}
          <div style="
            font-size: ${28 * scale}px; font-weight: 800;
            color: #1E293B;
          ">${business.service_name}</div>
        </div>

        <!-- ラベル -->
        <div style="
          background: ${style.primaryColor}; color: white;
          font-size: ${14 * scale}px; font-weight: 700;
          padding: ${8 * scale}px ${24 * scale}px; border-radius: ${20 * scale}px;
          letter-spacing: 0.1em;
        ">✨ お客様の声 ✨</div>

        <!-- 星評価 -->
        <div style="
          display: flex; gap: ${8 * scale}px;
          font-size: ${32 * scale}px;
        ">${'<span style="color: #FFD700; text-shadow: 0 2px 4px rgba(255,215,0,0.3);">★</span>'.repeat(5)}</div>

        <!-- 口コミ文 -->
        <div style="
          font-size: ${22 * scale}px; line-height: 1.9;
          color: #334155; text-align: center;
          padding: 0 ${20 * scale}px;
          position: relative;
        ">
          <span style="color: ${style.primaryColor}; font-size: ${40 * scale}px; opacity: 0.3; position: absolute; top: -${20 * scale}px; left: 0;">"</span>
          ${reviewText}
          <span style="color: ${style.primaryColor}; font-size: ${40 * scale}px; opacity: 0.3; position: absolute; bottom: -${30 * scale}px; right: 0;">"</span>
        </div>

        <!-- 区切り線 -->
        <div style="
          width: ${80 * scale}px; height: ${4 * scale}px;
          background: linear-gradient(90deg, transparent, ${style.primaryColor}, transparent);
          border-radius: ${2 * scale}px;
        "></div>

        <!-- 利用者情報 -->
        <div style="display: flex; align-items: center; gap: ${16 * scale}px;">
          ${business.face_url ? `
            <img src="${business.face_url}" style="
              width: ${60 * scale}px; height: ${60 * scale}px;
              border-radius: 50%; object-fit: cover;
              border: ${3 * scale}px solid ${style.secondaryColor};
              box-shadow: 0 ${4 * scale}px ${12 * scale}px rgba(0,0,0,0.1);
            " crossorigin="anonymous" />
          ` : `
            <div style="
              width: ${60 * scale}px; height: ${60 * scale}px;
              border-radius: 50%; background: ${style.secondaryColor};
              display: flex; align-items: center; justify-content: center;
              font-size: ${24 * scale}px;
            ">👤</div>
          `}
          <div>
            <div style="font-size: ${16 * scale}px; color: #64748B; font-weight: 500;">ご利用者様より</div>
            ${business.owner_name ? `
              <div style="font-size: ${14 * scale}px; color: #94A3B8; margin-top: ${4 * scale}px;">
                担当: ${business.owner_name}
              </div>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- フッター -->
      <div style="
        position: absolute; bottom: ${25 * scale}px;
        font-size: ${14 * scale}px; color: #94A3B8;
        display: flex; align-items: center; gap: ${8 * scale}px;
      ">
        <span>📍</span> ${business.service_name}
      </div>
    </div>
  `;
}

function generateHeadlineLayout({ business, reviewText, width, height, template }: ImageGenerationParams): string {
  const { style } = template;
  return `
    <div style="
      width: ${width}px; height: ${height}px;
      background: ${style.backgroundColor};
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: ${Math.round(width * 0.08)}px;
      font-family: ${style.fontFamily};
      position: relative;
      overflow: hidden;
    ">
      <div style="
        position: absolute; top: -${Math.round(height * 0.1)}px; right: -${Math.round(width * 0.1)}px;
        width: ${Math.round(width * 0.5)}px; height: ${Math.round(width * 0.5)}px;
        background: ${style.primaryColor}; opacity: 0.1; border-radius: 50%;
      "></div>

      <div style="
        font-size: ${Math.round(width * 0.06)}px; font-weight: 900;
        color: ${style.primaryColor}; text-align: center;
        margin-bottom: ${Math.round(height * 0.04)}px;
        line-height: 1.3;
      ">お客様の声</div>

      <div style="
        background: ${style.secondaryColor}; border-radius: ${Math.round(width * 0.02)}px;
        padding: ${Math.round(width * 0.05)}px;
        width: 85%;
      ">
        <div style="
          font-size: ${Math.round(width * 0.028)}px; line-height: 1.8;
          color: #1E293B; text-align: center; font-weight: 500;
        ">"${reviewText}"</div>
      </div>

      <div style="
        display: flex; align-items: center; gap: ${Math.round(width * 0.03)}px;
        margin-top: ${Math.round(height * 0.05)}px;
      ">
        ${business.logo_url ? `<img src="${business.logo_url}" style="height: ${Math.round(height * 0.06)}px; object-fit: contain;" />` : ''}
        <div style="
          font-size: ${Math.round(width * 0.025)}px; font-weight: 700;
          color: white;
        ">${business.service_name}</div>
      </div>
    </div>
  `;
}

function generateMultiLayout({ business, reviewText, width, height, template }: ImageGenerationParams): string {
  const { style } = template;
  // Split review into 3 parts for multi-review display
  const reviews = [reviewText, reviewText, reviewText];

  return `
    <div style="
      width: ${width}px; height: ${height}px;
      background: ${style.backgroundColor};
      display: flex; flex-direction: column; align-items: center;
      padding: ${Math.round(width * 0.06)}px;
      font-family: ${style.fontFamily};
      gap: ${Math.round(height * 0.02)}px;
    ">
      <div style="
        font-size: ${Math.round(width * 0.035)}px; font-weight: 800;
        color: ${style.primaryColor}; text-align: center;
        margin-bottom: ${Math.round(height * 0.01)}px;
      ">${business.service_name}</div>

      <div style="
        font-size: ${Math.round(width * 0.02)}px; color: #64748B;
        letter-spacing: 0.15em; margin-bottom: ${Math.round(height * 0.02)}px;
      ">お客様の声をご紹介</div>

      ${reviews.map((review, i) => `
        <div style="
          background: white; border-radius: ${Math.round(width * 0.015)}px;
          padding: ${Math.round(width * 0.03)}px;
          width: 90%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          border-left: 4px solid ${style.primaryColor};
        ">
          <div style="
            display: flex; gap: ${Math.round(width * 0.005)}px;
            font-size: ${Math.round(width * 0.018)}px;
            margin-bottom: ${Math.round(height * 0.008)}px;
            color: ${style.primaryColor};
          ">${'★'.repeat(5 - i % 2)}</div>
          <div style="
            font-size: ${Math.round(width * 0.018)}px; line-height: 1.7;
            color: #334155;
          ">"${review}"</div>
          <div style="
            font-size: ${Math.round(width * 0.014)}px; color: #94A3B8;
            margin-top: ${Math.round(height * 0.005)}px; text-align: right;
          ">ご利用者様${i + 1}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function generateMinimalLayout({ business, reviewText, width, height, template }: ImageGenerationParams): string {
  const { style } = template;
  return `
    <div style="
      width: ${width}px; height: ${height}px;
      background: ${style.backgroundColor};
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: ${Math.round(width * 0.1)}px;
      font-family: ${style.fontFamily};
    ">
      <div style="
        font-size: ${Math.round(width * 0.015)}px; color: ${style.primaryColor};
        letter-spacing: 0.2em; margin-bottom: ${Math.round(height * 0.04)}px;
        text-transform: uppercase; font-weight: 600;
      ">VOICE</div>

      <div style="
        font-size: ${Math.round(width * 0.03)}px; line-height: 2;
        color: #1E293B; text-align: center; font-weight: 400;
        max-width: 80%;
      ">"${reviewText}"</div>

      <div style="
        width: ${Math.round(width * 0.06)}px; height: 1px;
        background: ${style.primaryColor};
        margin: ${Math.round(height * 0.04)}px 0;
      "></div>

      <div style="
        font-size: ${Math.round(width * 0.018)}px; color: #64748B;
        font-weight: 500;
      ">${business.service_name}</div>
    </div>
  `;
}
