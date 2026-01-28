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

  switch (style.layout) {
    case 'card':
      return generateCardLayout(params);
    case 'headline':
      return generateHeadlineLayout(params);
    case 'multi':
      return generateMultiLayout(params);
    case 'minimal':
      return generateMinimalLayout(params);
    default:
      return generateCardLayout(params);
  }
}

function generateCardLayout({ business, reviewText, width, height, template }: ImageGenerationParams): string {
  const { style } = template;
  return `
    <div style="
      width: ${width}px; height: ${height}px;
      background: linear-gradient(135deg, ${style.secondaryColor} 0%, ${style.backgroundColor} 50%, ${style.secondaryColor} 100%);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: ${Math.round(width * 0.08)}px;
      font-family: ${style.fontFamily};
      position: relative;
    ">
      <div style="
        background: white; border-radius: ${Math.round(width * 0.02)}px;
        box-shadow: 0 ${Math.round(width * 0.005)}px ${Math.round(width * 0.03)}px rgba(0,0,0,0.1);
        padding: ${Math.round(width * 0.06)}px;
        width: 85%; max-height: 80%;
        display: flex; flex-direction: column; align-items: center; gap: ${Math.round(height * 0.03)}px;
      ">
        <div style="
          font-size: ${Math.round(width * 0.02)}px; color: ${style.primaryColor};
          font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
        ">お客様の声</div>

        ${business.logo_url ? `<img src="${business.logo_url}" style="height: ${Math.round(height * 0.08)}px; object-fit: contain;" />` : ''}

        <div style="
          font-size: ${Math.round(width * 0.025)}px; font-weight: 700;
          color: #1E293B; text-align: center;
        ">${business.service_name}</div>

        <div style="
          width: ${Math.round(width * 0.1)}px; height: 3px;
          background: ${style.primaryColor}; border-radius: 2px;
        "></div>

        <div style="
          display: flex; gap: ${Math.round(width * 0.005)}px;
          font-size: ${Math.round(width * 0.03)}px;
        ">${'★'.repeat(5)}</div>

        <div style="
          font-size: ${Math.round(width * 0.022)}px; line-height: 1.8;
          color: #334155; text-align: center;
          padding: 0 ${Math.round(width * 0.02)}px;
        ">"${reviewText}"</div>

        ${business.face_url ? `
        <div style="display: flex; align-items: center; gap: ${Math.round(width * 0.02)}px; margin-top: ${Math.round(height * 0.01)}px;">
          <img src="${business.face_url}" style="
            width: ${Math.round(width * 0.06)}px; height: ${Math.round(width * 0.06)}px;
            border-radius: 50%; object-fit: cover;
          " />
          <div style="font-size: ${Math.round(width * 0.016)}px; color: #64748B;">
            ご利用者様
          </div>
        </div>
        ` : ''}
      </div>

      <div style="
        position: absolute; bottom: ${Math.round(height * 0.03)}px;
        font-size: ${Math.round(width * 0.014)}px; color: #94A3B8;
      ">${business.service_name}</div>
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
