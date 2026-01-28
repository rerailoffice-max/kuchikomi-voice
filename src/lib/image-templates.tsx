/* eslint-disable @next/next/no-img-element */
import React from 'react';

export interface TemplateProps {
  serviceName: string;
  description: string;
  ownerName: string | null;
  reviewText: string;
  faceUrl: string | null;
  logoUrl: string | null;
  width: number;
  height: number;
  catchCopy: string;
}

// 共通の星評価コンポーネント
const Stars = ({ color = '#FFD700', size = 20 }: { color?: string; size?: number }) => (
  <div style={{ display: 'flex', gap: 4 }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <span key={i} style={{ color, fontSize: size, display: 'flex' }}>★</span>
    ))}
  </div>
);

// 顔写真またはイニシャルアイコン
const FacePhoto = ({
  faceUrl,
  ownerName,
  size,
  borderColor = '#FFD700',
  borderWidth = 4,
  rounded = true,
}: {
  faceUrl: string | null;
  ownerName: string | null;
  size: number;
  borderColor?: string;
  borderWidth?: number;
  rounded?: boolean;
}) => {
  const initial = ownerName ? ownerName.charAt(0) : '?';
  const borderRadius = rounded ? 9999 : 8;

  if (faceUrl) {
    return (
      <img
        src={faceUrl}
        alt="事業者"
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          borderRadius,
          border: `${borderWidth}px solid ${borderColor}`,
          objectFit: 'cover',
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius,
        border: `${borderWidth}px solid ${borderColor}`,
        backgroundColor: '#E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 700,
        color: '#6B7280',
      }}
    >
      {initial}
    </div>
  );
};

// tpl-000: プロフェッショナル推薦ポスター（黒×ゴールド）
export const Template000 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.25;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Noto Sans JP, sans-serif',
        padding: width * 0.06,
      }}
    >
      {/* 上部：推薦ラベル */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: height * 0.03,
        }}
      >
        <div
          style={{
            backgroundColor: '#D4A853',
            color: '#0A0A0A',
            padding: '8px 20px',
            fontSize: width * 0.022,
            fontWeight: 700,
            letterSpacing: '0.15em',
            display: 'flex',
          }}
        >
          RECOMMEND
        </div>
        <div style={{ flex: 1, height: 2, backgroundColor: '#D4A853', marginLeft: 16, display: 'flex' }} />
      </div>

      {/* キャッチコピー */}
      <div
        style={{
          color: '#FFFFFF',
          fontSize: width * 0.065,
          fontWeight: 900,
          lineHeight: 1.3,
          marginBottom: height * 0.04,
          display: 'flex',
        }}
      >
        {catchCopy}
      </div>

      {/* 中央エリア：顔写真と口コミ */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* 左：顔写真エリア */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: width * 0.05,
          }}
        >
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#D4A853"
            borderWidth={4}
          />
          {ownerName && (
            <div style={{ color: '#D4A853', fontSize: width * 0.025, marginTop: 12, fontWeight: 600, display: 'flex' }}>
              {ownerName}
            </div>
          )}
          <Stars color="#D4A853" size={width * 0.028} />
        </div>

        {/* 右：口コミ文 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ color: '#D4A853', fontSize: width * 0.1, lineHeight: 0.8, marginBottom: 8, display: 'flex' }}>
            &ldquo;
          </div>
          <div
            style={{
              color: '#FFFFFF',
              fontSize: width * 0.028,
              lineHeight: 1.9,
              flex: 1,
              display: 'flex',
            }}
          >
            {reviewText}
          </div>
          <div style={{ color: '#D4A853', fontSize: width * 0.1, lineHeight: 0.8, textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
            &rdquo;
          </div>
        </div>
      </div>

      {/* フッター */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '2px solid #333',
          paddingTop: height * 0.025,
          marginTop: height * 0.03,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.06, marginRight: 16 }} />
          )}
          <div style={{ color: '#D4A853', fontSize: width * 0.035, fontWeight: 700, display: 'flex' }}>
            {serviceName}
          </div>
        </div>
      </div>
    </div>
  );
};

// tpl-001: モダンカード（白×イエロー）
export const Template001 = (props: TemplateProps) => {
  const { serviceName, description, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.22;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Noto Sans JP, sans-serif',
      }}
    >
      {/* 上部アクセントバー */}
      <div style={{ height: 10, backgroundColor: '#FFD700', display: 'flex' }} />

      {/* ヘッダー */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${height * 0.04}px ${width * 0.06}px`,
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.05, marginRight: 16 }} />
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: '#1A1A1A', fontSize: width * 0.04, fontWeight: 900, display: 'flex' }}>
              {serviceName}
            </div>
            <div style={{ color: '#666', fontSize: width * 0.018, display: 'flex' }}>{description}</div>
          </div>
        </div>
        <Stars color="#FFD700" size={width * 0.03} />
      </div>

      {/* メインコンテンツ */}
      <div style={{ display: 'flex', flex: 1, padding: width * 0.06 }}>
        {/* 左：顔写真 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: width * 0.05,
          }}
        >
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#FFD700"
            borderWidth={5}
          />
          {ownerName && (
            <div style={{ color: '#1A1A1A', fontSize: width * 0.024, marginTop: 12, fontWeight: 700, display: 'flex' }}>
              {ownerName} 様
            </div>
          )}
        </div>

        {/* 右：口コミカード */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#FFFBEB',
            borderRadius: 16,
            padding: width * 0.04,
            borderLeft: '6px solid #FFD700',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ color: '#B45309', fontSize: width * 0.032, fontWeight: 800, marginBottom: 16, display: 'flex' }}>
            {catchCopy}
          </div>
          <div
            style={{
              color: '#1A1A1A',
              fontSize: width * 0.026,
              lineHeight: 1.8,
              flex: 1,
              display: 'flex',
            }}
          >
            {reviewText}
          </div>
        </div>
      </div>

      {/* 下部アクセントバー */}
      <div style={{ height: 6, backgroundColor: '#FFD700', display: 'flex' }} />
    </div>
  );
};

// tpl-002: インパクト見出し（赤×黄）
export const Template002 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.2;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#FAFAFA',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Noto Sans JP, sans-serif',
      }}
    >
      {/* ヘッダー帯 */}
      <div
        style={{
          backgroundColor: '#DC2626',
          padding: `${height * 0.025}px ${width * 0.05}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ color: '#FFFFFF', fontSize: width * 0.02, letterSpacing: '0.2em', fontWeight: 600, display: 'flex' }}>
          CUSTOMER VOICE
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.04, marginRight: 12 }} />
          )}
          <div style={{ color: '#FFFFFF', fontSize: width * 0.025, fontWeight: 700, display: 'flex' }}>
            {serviceName}
          </div>
        </div>
      </div>

      {/* キャッチコピー */}
      <div
        style={{
          padding: `${height * 0.04}px ${width * 0.05}px`,
          backgroundColor: '#111',
          display: 'flex',
        }}
      >
        <div
          style={{
            color: '#FFFFFF',
            fontSize: width * 0.06,
            fontWeight: 900,
            lineHeight: 1.3,
            display: 'flex',
          }}
        >
          {catchCopy}
        </div>
      </div>

      {/* メインエリア */}
      <div style={{ display: 'flex', flex: 1, padding: width * 0.05 }}>
        {/* 顔写真 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: width * 0.04,
          }}
        >
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#DC2626"
            borderWidth={4}
          />
          {ownerName && (
            <div style={{ color: '#1A1A1A', fontSize: width * 0.022, marginTop: 10, fontWeight: 600, display: 'flex' }}>
              {ownerName}
            </div>
          )}
          <Stars color="#FFD600" size={width * 0.025} />
        </div>

        {/* 口コミボックス */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#FEF9C3',
            borderRadius: 12,
            padding: width * 0.04,
            display: 'flex',
          }}
        >
          <div
            style={{
              color: '#1A1A1A',
              fontSize: width * 0.026,
              lineHeight: 1.8,
              display: 'flex',
            }}
          >
            {reviewText}
          </div>
        </div>
      </div>
    </div>
  );
};

// tpl-003: ナチュラル温かみ（コーラル×セージ）
export const Template003 = (props: TemplateProps) => {
  const { serviceName, description, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.2;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#FFF8F0',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Noto Sans JP, sans-serif',
        padding: width * 0.06,
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: height * 0.03,
        }}
      >
        {logoUrl && (
          <img src={logoUrl} alt="logo" style={{ height: height * 0.05, marginRight: 16 }} />
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#4A3728', fontSize: width * 0.035, fontWeight: 700, display: 'flex' }}>
            {serviceName}
          </div>
          <div style={{ color: '#A7C4A0', fontSize: width * 0.018, display: 'flex' }}>{description}</div>
        </div>
      </div>

      {/* 顔写真エリア */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: height * 0.03,
        }}
      >
        <FacePhoto
          faceUrl={faceUrl}
          ownerName={ownerName}
          size={photoSize}
          borderColor="#E8927C"
          borderWidth={4}
        />
      </div>

      {/* 口コミカード */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          padding: width * 0.05,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 24px rgba(232, 146, 124, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Stars color="#E8927C" size={width * 0.028} />
        </div>
        <div style={{ color: '#E8927C', fontSize: width * 0.032, fontWeight: 700, marginBottom: 16, display: 'flex' }}>
          {catchCopy}
        </div>
        <div
          style={{
            color: '#4A3728',
            fontSize: width * 0.026,
            lineHeight: 1.9,
            flex: 1,
            display: 'flex',
          }}
        >
          {reviewText}
        </div>
        {ownerName && (
          <div style={{ color: '#A7C4A0', fontSize: width * 0.022, textAlign: 'right', marginTop: 16, fontWeight: 600, display: 'flex', justifyContent: 'flex-end' }}>
            — {ownerName} 様
          </div>
        )}
      </div>
    </div>
  );
};

// tpl-004: ミニマル和モダン（墨×金茶）
export const Template004 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.15;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#F7F3EE',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Noto Sans JP, sans-serif',
        padding: width * 0.08,
      }}
    >
      {/* 見出し */}
      <div style={{ color: '#C4956A', fontSize: width * 0.025, letterSpacing: '0.3em', marginBottom: 20, display: 'flex' }}>
        VOICE
      </div>
      <div style={{ width: width * 0.5, height: 1, backgroundColor: '#2C2C2C', marginBottom: height * 0.04, display: 'flex' }} />

      {/* 顔写真 */}
      <FacePhoto
        faceUrl={faceUrl}
        ownerName={ownerName}
        size={photoSize}
        borderColor="#C4956A"
        borderWidth={2}
      />
      {ownerName && (
        <div style={{ color: '#2C2C2C', fontSize: width * 0.022, marginTop: 12, display: 'flex' }}>
          {ownerName}
        </div>
      )}

      {/* 区切り線 */}
      <div style={{ width: width * 0.7, height: 1, backgroundColor: '#2C2C2C', margin: `${height * 0.04}px 0`, display: 'flex' }} />

      {/* キャッチコピー */}
      <div style={{ color: '#C4956A', fontSize: width * 0.035, fontWeight: 700, marginBottom: 20, textAlign: 'center', display: 'flex' }}>
        {catchCopy}
      </div>

      {/* 口コミ文 */}
      <div
        style={{
          color: '#2C2C2C',
          fontSize: width * 0.026,
          lineHeight: 2.2,
          textAlign: 'center',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {reviewText}
      </div>

      {/* 区切り線 */}
      <div style={{ width: width * 0.7, height: 1, backgroundColor: '#2C2C2C', margin: `${height * 0.03}px 0`, display: 'flex' }} />

      {/* 星評価 */}
      <Stars color="#C4956A" size={width * 0.025} />

      {/* サービス情報 */}
      <div style={{ marginTop: height * 0.03, display: 'flex', alignItems: 'center' }}>
        {logoUrl && (
          <img src={logoUrl} alt="logo" style={{ height: height * 0.04, marginRight: 12 }} />
        )}
        <div style={{ color: '#8C8C8C', fontSize: width * 0.022, display: 'flex' }}>{serviceName}</div>
      </div>
    </div>
  );
};

// tpl-005: ビフォーアフター（青系ビジネス）
export const Template005 = (props: TemplateProps) => {
  const { serviceName, description, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.2;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Noto Sans JP, sans-serif',
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          backgroundColor: '#2563EB',
          padding: `${height * 0.025}px ${width * 0.05}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ color: '#FFFFFF', fontSize: width * 0.028, fontWeight: 700, display: 'flex' }}>お客様の声</div>
        <Stars color="#FFFFFF" size={width * 0.028} />
      </div>

      {/* メイン */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* 左：顔写真とBefore */}
        <div
          style={{
            width: '40%',
            backgroundColor: '#F1F5F9',
            padding: width * 0.04,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#2563EB"
            borderWidth={4}
          />
          {ownerName && (
            <div style={{ color: '#1E293B', fontSize: width * 0.024, marginTop: 12, fontWeight: 600, display: 'flex' }}>
              {ownerName} 様
            </div>
          )}
          <div style={{ color: '#64748B', fontSize: width * 0.018, marginTop: 8, display: 'flex' }}>
            ご利用者様
          </div>
        </div>

        {/* 右：After・口コミ */}
        <div
          style={{
            flex: 1,
            padding: width * 0.04,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ color: '#2563EB', fontSize: width * 0.02, fontWeight: 700, marginBottom: 8, display: 'flex' }}>
            ▼ ご利用後の感想
          </div>
          <div style={{ color: '#2563EB', fontSize: width * 0.035, fontWeight: 800, marginBottom: 16, display: 'flex' }}>
            {catchCopy}
          </div>
          <div
            style={{
              color: '#1E293B',
              fontSize: width * 0.025,
              lineHeight: 1.8,
              flex: 1,
              display: 'flex',
            }}
          >
            {reviewText}
          </div>
        </div>
      </div>

      {/* フッター */}
      <div
        style={{
          padding: `${height * 0.025}px ${width * 0.05}px`,
          borderTop: '2px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {logoUrl && (
          <img src={logoUrl} alt="logo" style={{ height: height * 0.05, marginRight: 16 }} />
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#1E293B', fontSize: width * 0.028, fontWeight: 700, display: 'flex' }}>{serviceName}</div>
          <div style={{ color: '#64748B', fontSize: width * 0.018, display: 'flex' }}>{description}</div>
        </div>
      </div>
    </div>
  );
};

// tpl-006: プレミアムバッジ（ダーク×ゴールド）
export const Template006 = (props: TemplateProps) => {
  const { serviceName, description, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.18;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#0C1220',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Noto Sans JP, sans-serif',
        padding: width * 0.06,
      }}
    >
      {/* TRUSTEDバッジ */}
      <div
        style={{
          border: '3px solid #D4A853',
          borderRadius: 9999,
          padding: '12px 32px',
          marginBottom: height * 0.03,
          display: 'flex',
        }}
      >
        <div style={{ color: '#D4A853', fontSize: width * 0.022, fontWeight: 700, letterSpacing: '0.15em', display: 'flex' }}>
          ★ TRUSTED REVIEW ★
        </div>
      </div>

      {/* 顔写真 */}
      <FacePhoto
        faceUrl={faceUrl}
        ownerName={ownerName}
        size={photoSize}
        borderColor="#D4A853"
        borderWidth={4}
      />
      {ownerName && (
        <div style={{ color: '#FFFFFF', fontSize: width * 0.024, marginTop: 12, display: 'flex' }}>{ownerName}</div>
      )}

      {/* 装飾ライン */}
      <div style={{ display: 'flex', alignItems: 'center', margin: `${height * 0.025}px 0` }}>
        <div style={{ width: 50, height: 2, backgroundColor: '#D4A853', display: 'flex' }} />
        <div style={{ width: 10, height: 10, backgroundColor: '#D4A853', marginLeft: 10, marginRight: 10, display: 'flex' }} />
        <div style={{ width: 50, height: 2, backgroundColor: '#D4A853', display: 'flex' }} />
      </div>

      {/* キャッチコピー */}
      <div style={{ color: '#D4A853', fontSize: width * 0.035, fontWeight: 700, marginBottom: 16, textAlign: 'center', display: 'flex' }}>
        {catchCopy}
      </div>

      {/* 口コミ文 */}
      <div
        style={{
          color: '#FFFFFF',
          fontSize: width * 0.025,
          lineHeight: 1.8,
          textAlign: 'center',
          flex: 1,
          display: 'flex',
        }}
      >
        {reviewText}
      </div>

      {/* 装飾ライン */}
      <div style={{ display: 'flex', alignItems: 'center', margin: `${height * 0.025}px 0` }}>
        <div style={{ width: 50, height: 2, backgroundColor: '#D4A853', display: 'flex' }} />
        <div style={{ width: 10, height: 10, backgroundColor: '#D4A853', marginLeft: 10, marginRight: 10, display: 'flex' }} />
        <div style={{ width: 50, height: 2, backgroundColor: '#D4A853', display: 'flex' }} />
      </div>

      {/* 星評価 */}
      <Stars color="#D4A853" size={width * 0.032} />

      {/* フッター */}
      <div style={{ marginTop: height * 0.025, display: 'flex', alignItems: 'center' }}>
        {logoUrl && (
          <img src={logoUrl} alt="logo" style={{ height: height * 0.045, marginRight: 16 }} />
        )}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#D4A853', fontSize: width * 0.028, fontWeight: 700, display: 'flex' }}>{serviceName}</div>
          <div style={{ color: '#9CA3AF', fontSize: width * 0.016, display: 'flex' }}>{description}</div>
        </div>
      </div>
    </div>
  );
};

// tpl-007: マガジンインタビュー（赤アクセント）
export const Template007 = (props: TemplateProps) => {
  const { serviceName, description, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.3;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Noto Sans JP, sans-serif',
      }}
    >
      {/* ヘッダー帯 */}
      <div
        style={{
          backgroundColor: '#DC2626',
          padding: `${height * 0.02}px ${width * 0.05}px`,
          display: 'flex',
        }}
      >
        <div style={{ color: '#FFFFFF', fontSize: width * 0.018, letterSpacing: '0.2em', fontWeight: 600, display: 'flex' }}>
          CUSTOMER INTERVIEW
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ display: 'flex', flex: 1, padding: width * 0.05 }}>
        {/* 左カラム：顔写真 */}
        <div
          style={{
            width: '38%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingRight: width * 0.04,
            borderRight: '1px solid #E5E7EB',
          }}
        >
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#1A1A1A"
            borderWidth={2}
            rounded={false}
          />
          {ownerName && (
            <div style={{ color: '#1A1A1A', fontSize: width * 0.028, fontWeight: 700, marginTop: 16, display: 'flex' }}>
              {ownerName}
            </div>
          )}
          <div style={{ color: '#DC2626', fontSize: width * 0.022, marginTop: 8, fontWeight: 600, display: 'flex' }}>
            {serviceName}
          </div>
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.05, marginTop: 16 }} />
          )}
        </div>

        {/* 右カラム：口コミ */}
        <div
          style={{
            flex: 1,
            paddingLeft: width * 0.04,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 装飾引用符 */}
          <div style={{ color: '#DC2626', fontSize: width * 0.1, lineHeight: 0.7, marginBottom: 8, display: 'flex' }}>
            &ldquo;
          </div>

          {/* 質問 */}
          <div style={{ color: '#6B7280', fontSize: width * 0.018, marginBottom: 12, display: 'flex' }}>
            Q. サービスを受けていかがでしたか？
          </div>

          {/* キャッチコピー */}
          <div style={{ color: '#1A1A1A', fontSize: width * 0.032, fontWeight: 800, marginBottom: 20, display: 'flex' }}>
            {catchCopy}
          </div>

          {/* 口コミ文 */}
          <div
            style={{
              color: '#1A1A1A',
              fontSize: width * 0.024,
              lineHeight: 2.0,
              flex: 1,
              display: 'flex',
            }}
          >
            {reviewText}
          </div>

          {/* 星評価 */}
          <div style={{ marginTop: 16, display: 'flex' }}>
            <Stars color="#DC2626" size={width * 0.028} />
          </div>

          {/* 概要 */}
          <div style={{ color: '#6B7280', fontSize: width * 0.016, marginTop: 16, display: 'flex' }}>{description}</div>
        </div>
      </div>
    </div>
  );
};

// tpl-008: ポップカジュアル（ピンク×パープル）
export const Template008 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.22;

  return (
    <div
      style={{
        width,
        height,
        background: 'linear-gradient(180deg, #FDF2F8 0%, #EDE9FE 100%)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Noto Sans JP, sans-serif',
        padding: width * 0.06,
      }}
    >
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: height * 0.02 }}>
        {logoUrl && (
          <img src={logoUrl} alt="logo" style={{ height: height * 0.045, marginRight: 12 }} />
        )}
        <div style={{ color: '#EC4899', fontSize: width * 0.028, fontWeight: 700, display: 'flex' }}>
          {serviceName}
        </div>
      </div>

      {/* 顔写真 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: height * 0.025,
        }}
      >
        <FacePhoto
          faceUrl={faceUrl}
          ownerName={ownerName}
          size={photoSize}
          borderColor="#FFFFFF"
          borderWidth={6}
        />
      </div>
      {ownerName && (
        <div style={{ color: '#EC4899', fontSize: width * 0.026, fontWeight: 700, textAlign: 'center', marginBottom: height * 0.02, display: 'flex', justifyContent: 'center' }}>
          {ownerName} さん
        </div>
      )}

      {/* 口コミカード */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: width * 0.05,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(236, 72, 153, 0.15)',
        }}
      >
        <Stars color="#EC4899" size={width * 0.028} />
        <div style={{ color: '#EC4899', fontSize: width * 0.034, fontWeight: 800, margin: '16px 0', display: 'flex' }}>
          {catchCopy}
        </div>
        <div
          style={{
            color: '#1F2937',
            fontSize: width * 0.026,
            lineHeight: 1.8,
            flex: 1,
            display: 'flex',
          }}
        >
          {reviewText}
        </div>
      </div>

      {/* ハッシュタグ */}
      <div style={{ display: 'flex', marginTop: height * 0.025 }}>
        <span style={{ color: '#8B5CF6', fontSize: width * 0.022, fontWeight: 600, marginRight: 16, display: 'flex' }}>
          #おすすめ
        </span>
        <span style={{ color: '#8B5CF6', fontSize: width * 0.022, fontWeight: 600, display: 'flex' }}>
          #リピート確定
        </span>
      </div>
    </div>
  );
};

// tpl-009: データドリブン（ダーク×シアン）
export const Template009 = (props: TemplateProps) => {
  const { serviceName, description, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.18;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Noto Sans JP, sans-serif',
        padding: width * 0.06,
      }}
    >
      {/* メイン数字 */}
      <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: height * 0.02 }}>
        <span style={{ color: '#06B6D4', fontSize: width * 0.05, marginRight: 10, display: 'flex' }}>★</span>
        <span
          style={{
            color: '#06B6D4',
            fontSize: width * 0.14,
            fontWeight: 900,
            display: 'flex',
          }}
        >
          4.9
        </span>
      </div>
      <div style={{ color: '#FFFFFF', fontSize: width * 0.028, marginBottom: height * 0.035, display: 'flex' }}>
        お客様満足度
      </div>

      {/* 中央エリア */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* 左側：顔写真 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: width * 0.05,
          }}
        >
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.04, marginBottom: 16 }} />
          )}
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#06B6D4"
            borderWidth={4}
          />
          {ownerName && (
            <div style={{ color: '#FFFFFF', fontSize: width * 0.022, marginTop: 10, display: 'flex' }}>{ownerName}</div>
          )}
        </div>

        {/* 右側：口コミカード */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: width * 0.04,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stars color="#06B6D4" size={width * 0.025} />
          <div style={{ color: '#06B6D4', fontSize: width * 0.03, fontWeight: 700, margin: '12px 0', display: 'flex' }}>
            {catchCopy}
          </div>
          <div
            style={{
              color: '#1A1A1A',
              fontSize: width * 0.024,
              lineHeight: 1.8,
              flex: 1,
              display: 'flex',
            }}
          >
            {reviewText}
          </div>
        </div>
      </div>

      {/* フッター */}
      <div
        style={{
          marginTop: height * 0.03,
          paddingTop: height * 0.025,
          borderTop: '1px solid #164E63',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ color: '#06B6D4', fontSize: width * 0.028, fontWeight: 700, display: 'flex' }}>{serviceName}</div>
        <div style={{ color: '#94A3B8', fontSize: width * 0.018, display: 'flex' }}>{description}</div>
      </div>
    </div>
  );
};

// テンプレートマッピング
export const templateComponents: Record<string, React.FC<TemplateProps>> = {
  'tpl-000': Template000,
  'tpl-001': Template001,
  'tpl-002': Template002,
  'tpl-003': Template003,
  'tpl-004': Template004,
  'tpl-005': Template005,
  'tpl-006': Template006,
  'tpl-007': Template007,
  'tpl-008': Template008,
  'tpl-009': Template009,
};
