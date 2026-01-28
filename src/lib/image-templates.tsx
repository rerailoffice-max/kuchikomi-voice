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

// 口コミ文から印象的なフレーズを抽出
function extractHighlight(text: string): { highlight: string; rest: string } {
  // 最初の句点または読点で区切る
  const match = text.match(/^(.{8,30}?[。！!、])/);
  if (match) {
    return { highlight: match[1], rest: text.slice(match[1].length).trim() };
  }
  // 見つからない場合は最初の20文字をハイライト
  if (text.length > 20) {
    return { highlight: text.slice(0, 20), rest: text.slice(20) };
  }
  return { highlight: text, rest: '' };
}

// 共通の星評価コンポーネント
const Stars = ({ color = '#FFD700', size = 20 }: { color?: string; size?: number }) => (
  <div style={{ display: 'flex', gap: 2 }}>
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
  const borderRadius = rounded ? 9999 : 12;

  if (faceUrl) {
    return (
      <img
        src={faceUrl}
        alt="利用者"
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
        fontSize: size * 0.45,
        fontWeight: 700,
        color: '#6B7280',
      }}
    >
      {initial}
    </div>
  );
};

// tpl-000: プレミアムマガジン風（黒×ゴールド）
export const Template000 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.4;
  const { highlight, rest } = extractHighlight(reviewText);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 左側の装飾ライン */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 8,
          height: '100%',
          background: 'linear-gradient(180deg, #D4A853 0%, #8B6914 100%)',
          display: 'flex',
        }}
      />

      {/* コンテンツエリア */}
      <div style={{ display: 'flex', flex: 1, padding: width * 0.05, paddingLeft: width * 0.06 }}>
        {/* 左側：顔写真とキャッチ */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
          {/* RECOMMENDバッジ */}
          <div
            style={{
              backgroundColor: '#D4A853',
              color: '#0A0A0A',
              padding: '8px 20px',
              fontSize: width * 0.018,
              fontWeight: 800,
              letterSpacing: '0.15em',
              marginBottom: height * 0.025,
              alignSelf: 'flex-start',
              display: 'flex',
            }}
          >
            ★ RECOMMEND
          </div>

          {/* 顔写真 */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: height * 0.02 }}>
            <FacePhoto
              faceUrl={faceUrl}
              ownerName={ownerName}
              size={photoSize}
              borderColor="#D4A853"
              borderWidth={6}
            />
          </div>

          {/* 名前と星 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {ownerName && (
              <div style={{ color: '#D4A853', fontSize: width * 0.032, fontWeight: 700, display: 'flex' }}>
                {ownerName} 様
              </div>
            )}
            <div style={{ marginTop: 8, display: 'flex' }}>
              <Stars color="#D4A853" size={width * 0.032} />
            </div>
          </div>
        </div>

        {/* 右側：口コミテキスト */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingLeft: width * 0.04 }}>
          {/* 大きな引用符 */}
          <div style={{ color: '#D4A853', fontSize: width * 0.15, lineHeight: 0.6, marginBottom: 10, display: 'flex' }}>
            &ldquo;
          </div>

          {/* キャッチコピー（大きく） */}
          <div
            style={{
              color: '#FFFFFF',
              fontSize: width * 0.055,
              fontWeight: 900,
              lineHeight: 1.3,
              marginBottom: height * 0.025,
              display: 'flex',
            }}
          >
            {catchCopy}
          </div>

          {/* ハイライト部分（強調） */}
          <div
            style={{
              color: '#D4A853',
              fontSize: width * 0.032,
              fontWeight: 700,
              lineHeight: 1.6,
              marginBottom: 12,
              display: 'flex',
            }}
          >
            {highlight}
          </div>

          {/* 残りの口コミ文 */}
          {rest && (
            <div
              style={{
                color: '#CCCCCC',
                fontSize: width * 0.026,
                lineHeight: 1.7,
                flex: 1,
                display: 'flex',
              }}
            >
              {rest}
            </div>
          )}

          {/* 閉じ引用符 */}
          <div style={{ color: '#D4A853', fontSize: width * 0.08, lineHeight: 0.5, alignSelf: 'flex-end', display: 'flex' }}>
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
          padding: `${height * 0.025}px ${width * 0.05}px`,
          borderTop: '2px solid #333',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.05, marginRight: 12 }} />
          )}
          <div style={{ color: '#D4A853', fontSize: width * 0.032, fontWeight: 700, display: 'flex' }}>
            {serviceName}
          </div>
        </div>
        <div style={{ color: '#666', fontSize: width * 0.018, display: 'flex' }}>
          お客様の声より
        </div>
      </div>
    </div>
  );
};

// tpl-001: スタイリッシュカード（白×イエロー）
export const Template001 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.35;
  const { highlight, rest } = extractHighlight(reviewText);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 左側の写真エリア */}
      <div
        style={{
          width: '42%',
          backgroundColor: '#1A1A1A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: width * 0.04,
          position: 'relative',
        }}
      >
        {/* 装飾ライン */}
        <div
          style={{
            position: 'absolute',
            top: height * 0.08,
            left: width * 0.02,
            width: 60,
            height: 4,
            backgroundColor: '#FFD700',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: height * 0.08,
            right: width * 0.02,
            width: 60,
            height: 4,
            backgroundColor: '#FFD700',
            display: 'flex',
          }}
        />

        {/* 顔写真 */}
        <FacePhoto
          faceUrl={faceUrl}
          ownerName={ownerName}
          size={photoSize}
          borderColor="#FFD700"
          borderWidth={6}
        />
        {ownerName && (
          <div style={{ color: '#FFD700', fontSize: width * 0.03, fontWeight: 700, marginTop: 14, display: 'flex' }}>
            {ownerName} 様
          </div>
        )}
        <div style={{ marginTop: 10, display: 'flex' }}>
          <Stars color="#FFD700" size={width * 0.028} />
        </div>
      </div>

      {/* 右側のテキストエリア */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: width * 0.045 }}>
        {/* ヘッダー */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: height * 0.02 }}>
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.045, marginRight: 10 }} />
          )}
          <div style={{ color: '#1A1A1A', fontSize: width * 0.028, fontWeight: 800, display: 'flex' }}>
            {serviceName}
          </div>
        </div>

        {/* アクセントライン */}
        <div style={{ width: 50, height: 5, backgroundColor: '#FFD700', marginBottom: height * 0.025, display: 'flex' }} />

        {/* キャッチコピー */}
        <div
          style={{
            color: '#1A1A1A',
            fontSize: width * 0.048,
            fontWeight: 900,
            lineHeight: 1.25,
            marginBottom: height * 0.02,
            display: 'flex',
          }}
        >
          {catchCopy}
        </div>

        {/* ハイライトボックス */}
        <div
          style={{
            backgroundColor: '#FFFBEB',
            borderLeft: '5px solid #FFD700',
            padding: width * 0.03,
            marginBottom: height * 0.02,
            display: 'flex',
          }}
        >
          <div style={{ color: '#B45309', fontSize: width * 0.028, fontWeight: 700, lineHeight: 1.6, display: 'flex' }}>
            {highlight}
          </div>
        </div>

        {/* 残りの文章 */}
        {rest && (
          <div
            style={{
              color: '#4A4A4A',
              fontSize: width * 0.024,
              lineHeight: 1.7,
              flex: 1,
              display: 'flex',
            }}
          >
            {rest}
          </div>
        )}

        {/* VOICEラベル */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
          <div
            style={{
              backgroundColor: '#1A1A1A',
              color: '#FFD700',
              padding: '6px 16px',
              fontSize: width * 0.016,
              fontWeight: 700,
              letterSpacing: '0.1em',
              display: 'flex',
            }}
          >
            VOICE
          </div>
        </div>
      </div>
    </div>
  );
};

// tpl-002: インパクトヘッドライン（赤×黄）
export const Template002 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.32;
  const { highlight, rest } = extractHighlight(reviewText);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#FAFAFA',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 上部の赤帯 */}
      <div
        style={{
          backgroundColor: '#DC2626',
          padding: `${height * 0.03}px ${width * 0.04}px`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ color: '#FEF08A', fontSize: width * 0.016, letterSpacing: '0.2em', fontWeight: 700, marginBottom: 8, display: 'flex' }}>
          ★★★★★ CUSTOMER VOICE
        </div>
        <div
          style={{
            color: '#FFFFFF',
            fontSize: width * 0.058,
            fontWeight: 900,
            lineHeight: 1.2,
            display: 'flex',
          }}
        >
          {catchCopy}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ display: 'flex', flex: 1, padding: width * 0.04 }}>
        {/* 左側：顔写真 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: width * 0.04 }}>
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#DC2626"
            borderWidth={5}
          />
          {ownerName && (
            <div style={{ color: '#1A1A1A', fontSize: width * 0.026, fontWeight: 700, marginTop: 10, display: 'flex' }}>
              {ownerName} 様
            </div>
          )}
          <div style={{ marginTop: 6, display: 'flex' }}>
            <Stars color="#DC2626" size={width * 0.024} />
          </div>
        </div>

        {/* 右側：口コミ */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* ハイライトカード */}
          <div
            style={{
              backgroundColor: '#FEF08A',
              borderRadius: 12,
              padding: width * 0.03,
              marginBottom: height * 0.02,
              display: 'flex',
            }}
          >
            <div style={{ color: '#1A1A1A', fontSize: width * 0.03, fontWeight: 700, lineHeight: 1.5, display: 'flex' }}>
              「{highlight}」
            </div>
          </div>

          {/* 残りの文章 */}
          {rest && (
            <div
              style={{
                color: '#4A4A4A',
                fontSize: width * 0.026,
                lineHeight: 1.7,
                flex: 1,
                display: 'flex',
              }}
            >
              {rest}
            </div>
          )}
        </div>
      </div>

      {/* フッター */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${height * 0.02}px ${width * 0.04}px`,
          borderTop: '3px solid #DC2626',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.04, marginRight: 10 }} />
          )}
          <div style={{ color: '#DC2626', fontSize: width * 0.028, fontWeight: 800, display: 'flex' }}>
            {serviceName}
          </div>
        </div>
      </div>
    </div>
  );
};

// tpl-003: ナチュラル温かみ（コーラル×クリーム）
export const Template003 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.32;
  const { highlight, rest } = extractHighlight(reviewText);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#FFF8F0',
        display: 'flex',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 右上の装飾円 */}
      <div
        style={{
          position: 'absolute',
          top: -height * 0.15,
          right: -width * 0.1,
          width: width * 0.4,
          height: width * 0.4,
          borderRadius: 9999,
          backgroundColor: '#E8927C',
          opacity: 0.1,
          display: 'flex',
        }}
      />

      <div style={{ display: 'flex', flex: 1, padding: width * 0.045 }}>
        {/* 左側：写真と情報 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '38%' }}>
          {/* サービス名 */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: height * 0.025 }}>
            {logoUrl && (
              <img src={logoUrl} alt="logo" style={{ height: height * 0.04, marginRight: 8 }} />
            )}
            <div style={{ color: '#E8927C', fontSize: width * 0.024, fontWeight: 700, display: 'flex' }}>
              {serviceName}
            </div>
          </div>

          {/* 顔写真 */}
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#E8927C"
            borderWidth={5}
          />

          {/* 名前 */}
          {ownerName && (
            <div style={{ color: '#4A3728', fontSize: width * 0.028, fontWeight: 700, marginTop: 12, display: 'flex' }}>
              {ownerName} 様
            </div>
          )}
          <div style={{ marginTop: 6, display: 'flex' }}>
            <Stars color="#E8927C" size={width * 0.026} />
          </div>

          {/* 「おすすめ」バッジ */}
          <div
            style={{
              backgroundColor: '#E8927C',
              color: '#FFFFFF',
              padding: '8px 20px',
              borderRadius: 20,
              fontSize: width * 0.02,
              fontWeight: 700,
              marginTop: height * 0.025,
              display: 'flex',
            }}
          >
            ♥ おすすめします
          </div>
        </div>

        {/* 右側：口コミカード */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: width * 0.035 }}>
          {/* 引用符 */}
          <div style={{ color: '#E8927C', fontSize: width * 0.12, lineHeight: 0.5, marginBottom: 8, display: 'flex' }}>
            &ldquo;
          </div>

          {/* キャッチコピー */}
          <div
            style={{
              color: '#4A3728',
              fontSize: width * 0.046,
              fontWeight: 900,
              lineHeight: 1.3,
              marginBottom: height * 0.02,
              display: 'flex',
            }}
          >
            {catchCopy}
          </div>

          {/* ハイライト */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              padding: width * 0.03,
              marginBottom: height * 0.015,
              boxShadow: '0 4px 15px rgba(232, 146, 124, 0.15)',
              display: 'flex',
            }}
          >
            <div style={{ color: '#E8927C', fontSize: width * 0.028, fontWeight: 600, lineHeight: 1.6, display: 'flex' }}>
              {highlight}
            </div>
          </div>

          {/* 残りの文章 */}
          {rest && (
            <div
              style={{
                color: '#6B5B4F',
                fontSize: width * 0.024,
                lineHeight: 1.7,
                flex: 1,
                display: 'flex',
              }}
            >
              {rest}
            </div>
          )}

          {/* 閉じ引用符 */}
          <div style={{ color: '#E8927C', fontSize: width * 0.08, lineHeight: 0.5, alignSelf: 'flex-end', display: 'flex' }}>
            &rdquo;
          </div>
        </div>
      </div>
    </div>
  );
};

// tpl-004: ミニマル和モダン（墨×金茶）
export const Template004 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.28;
  const { highlight, rest } = extractHighlight(reviewText);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#F7F3EE',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 上部の装飾ライン */}
      <div
        style={{
          height: 3,
          background: 'linear-gradient(90deg, transparent 0%, #C4956A 50%, transparent 100%)',
          display: 'flex',
        }}
      />

      {/* メインコンテンツ */}
      <div style={{ display: 'flex', flex: 1, padding: width * 0.05 }}>
        {/* 左側：縦書き風の装飾と写真 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '35%' }}>
          {/* VOICEラベル */}
          <div
            style={{
              color: '#C4956A',
              fontSize: width * 0.018,
              letterSpacing: '0.3em',
              fontWeight: 600,
              marginBottom: height * 0.02,
              display: 'flex',
            }}
          >
            ─ VOICE ─
          </div>

          {/* 顔写真 */}
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#C4956A"
            borderWidth={3}
          />

          {/* 名前 */}
          {ownerName && (
            <div style={{ color: '#2C2C2C', fontSize: width * 0.026, fontWeight: 600, marginTop: 12, display: 'flex' }}>
              {ownerName} 様
            </div>
          )}

          {/* 星評価 */}
          <div style={{ marginTop: 8, display: 'flex' }}>
            <Stars color="#C4956A" size={width * 0.024} />
          </div>
        </div>

        {/* 右側：口コミ */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: width * 0.04 }}>
          {/* キャッチコピー */}
          <div
            style={{
              color: '#C4956A',
              fontSize: width * 0.048,
              fontWeight: 800,
              lineHeight: 1.3,
              marginBottom: height * 0.025,
              display: 'flex',
            }}
          >
            {catchCopy}
          </div>

          {/* 装飾ライン */}
          <div
            style={{
              width: width * 0.15,
              height: 2,
              backgroundColor: '#2C2C2C',
              marginBottom: height * 0.02,
              display: 'flex',
            }}
          />

          {/* ハイライト */}
          <div
            style={{
              color: '#2C2C2C',
              fontSize: width * 0.032,
              fontWeight: 700,
              lineHeight: 1.7,
              marginBottom: height * 0.015,
              borderLeft: '3px solid #C4956A',
              paddingLeft: width * 0.025,
              display: 'flex',
            }}
          >
            {highlight}
          </div>

          {/* 残りの文章 */}
          {rest && (
            <div
              style={{
                color: '#5A5A5A',
                fontSize: width * 0.026,
                lineHeight: 1.8,
                flex: 1,
                display: 'flex',
              }}
            >
              {rest}
            </div>
          )}
        </div>
      </div>

      {/* フッター */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${height * 0.025}px ${width * 0.05}px`,
          borderTop: '1px solid #D4C4B0',
        }}
      >
        {logoUrl && (
          <img src={logoUrl} alt="logo" style={{ height: height * 0.04, marginRight: 12 }} />
        )}
        <div style={{ color: '#8C8C8C', fontSize: width * 0.024, display: 'flex' }}>{serviceName}</div>
      </div>

      {/* 下部の装飾ライン */}
      <div
        style={{
          height: 3,
          background: 'linear-gradient(90deg, transparent 0%, #C4956A 50%, transparent 100%)',
          display: 'flex',
        }}
      />
    </div>
  );
};

// tpl-005: プロフェッショナルビジネス（青系）
export const Template005 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.35;
  const { highlight, rest } = extractHighlight(reviewText);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          backgroundColor: '#2563EB',
          padding: `${height * 0.025}px ${width * 0.04}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.04, marginRight: 12 }} />
          )}
          <div style={{ color: '#FFFFFF', fontSize: width * 0.028, fontWeight: 700, display: 'flex' }}>
            {serviceName}
          </div>
        </div>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            color: '#2563EB',
            padding: '6px 16px',
            borderRadius: 20,
            fontSize: width * 0.016,
            fontWeight: 700,
            display: 'flex',
          }}
        >
          ★★★★★ お客様の声
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* 左側：顔写真エリア */}
        <div
          style={{
            width: '40%',
            backgroundColor: '#F1F5F9',
            padding: width * 0.035,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#2563EB"
            borderWidth={5}
          />
          {ownerName && (
            <div style={{ color: '#1E293B', fontSize: width * 0.028, fontWeight: 700, marginTop: 14, display: 'flex' }}>
              {ownerName} 様
            </div>
          )}
          <div style={{ marginTop: 8, display: 'flex' }}>
            <Stars color="#2563EB" size={width * 0.028} />
          </div>
        </div>

        {/* 右側：口コミエリア */}
        <div style={{ flex: 1, padding: width * 0.04, display: 'flex', flexDirection: 'column' }}>
          {/* キャッチコピー */}
          <div
            style={{
              color: '#2563EB',
              fontSize: width * 0.048,
              fontWeight: 900,
              lineHeight: 1.25,
              marginBottom: height * 0.02,
              display: 'flex',
            }}
          >
            {catchCopy}
          </div>

          {/* ハイライトボックス */}
          <div
            style={{
              backgroundColor: '#EFF6FF',
              borderLeft: '5px solid #2563EB',
              padding: width * 0.03,
              marginBottom: height * 0.018,
              display: 'flex',
            }}
          >
            <div style={{ color: '#1E40AF', fontSize: width * 0.028, fontWeight: 600, lineHeight: 1.5, display: 'flex' }}>
              {highlight}
            </div>
          </div>

          {/* 残りの文章 */}
          {rest && (
            <div
              style={{
                color: '#475569',
                fontSize: width * 0.024,
                lineHeight: 1.7,
                flex: 1,
                display: 'flex',
              }}
            >
              {rest}
            </div>
          )}

          {/* ポイントサマリー */}
          <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
            <div
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: width * 0.018,
                fontWeight: 600,
                display: 'flex',
              }}
            >
              信頼できる
            </div>
            <div
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: width * 0.018,
                fontWeight: 600,
                display: 'flex',
              }}
            >
              また利用したい
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// tpl-006: プレミアムバッジ（ダーク×ゴールド）
export const Template006 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.3;
  const { highlight, rest } = extractHighlight(reviewText);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#0C1220',
        display: 'flex',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* コーナー装飾 */}
      <div
        style={{
          position: 'absolute',
          top: width * 0.03,
          left: width * 0.03,
          width: 30,
          height: 30,
          borderTop: '3px solid #D4A853',
          borderLeft: '3px solid #D4A853',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: width * 0.03,
          right: width * 0.03,
          width: 30,
          height: 30,
          borderTop: '3px solid #D4A853',
          borderRight: '3px solid #D4A853',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: width * 0.03,
          left: width * 0.03,
          width: 30,
          height: 30,
          borderBottom: '3px solid #D4A853',
          borderLeft: '3px solid #D4A853',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: width * 0.03,
          right: width * 0.03,
          width: 30,
          height: 30,
          borderBottom: '3px solid #D4A853',
          borderRight: '3px solid #D4A853',
          display: 'flex',
        }}
      />

      {/* 左側：写真エリア */}
      <div
        style={{
          width: '38%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: width * 0.04,
        }}
      >
        {/* TRUSTEDバッジ */}
        <div
          style={{
            border: '2px solid #D4A853',
            borderRadius: 9999,
            padding: '6px 18px',
            marginBottom: height * 0.025,
            display: 'flex',
          }}
        >
          <div style={{ color: '#D4A853', fontSize: width * 0.016, fontWeight: 700, letterSpacing: '0.1em', display: 'flex' }}>
            ★ TRUSTED ★
          </div>
        </div>

        {/* 顔写真 */}
        <FacePhoto
          faceUrl={faceUrl}
          ownerName={ownerName}
          size={photoSize}
          borderColor="#D4A853"
          borderWidth={5}
        />
        {ownerName && (
          <div style={{ color: '#FFFFFF', fontSize: width * 0.026, marginTop: 12, display: 'flex' }}>{ownerName} 様</div>
        )}
        <div style={{ marginTop: 8, display: 'flex' }}>
          <Stars color="#D4A853" size={width * 0.026} />
        </div>

        {/* サービス情報 */}
        <div style={{ marginTop: height * 0.03, display: 'flex', alignItems: 'center' }}>
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.035, marginRight: 10 }} />
          )}
          <div style={{ color: '#D4A853', fontSize: width * 0.022, fontWeight: 600, display: 'flex' }}>{serviceName}</div>
        </div>
      </div>

      {/* 右側：口コミエリア */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: width * 0.04, paddingLeft: 0 }}>
        {/* 大きな引用符 */}
        <div style={{ color: '#D4A853', fontSize: width * 0.12, lineHeight: 0.6, marginBottom: 10, display: 'flex' }}>
          &ldquo;
        </div>

        {/* キャッチコピー */}
        <div
          style={{
            color: '#D4A853',
            fontSize: width * 0.048,
            fontWeight: 800,
            lineHeight: 1.25,
            marginBottom: height * 0.02,
            display: 'flex',
          }}
        >
          {catchCopy}
        </div>

        {/* 装飾ライン */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: height * 0.02 }}>
          <div style={{ width: 40, height: 2, backgroundColor: '#D4A853', display: 'flex' }} />
          <div style={{ width: 8, height: 8, backgroundColor: '#D4A853', borderRadius: 4, marginLeft: 8, marginRight: 8, display: 'flex' }} />
          <div style={{ width: 40, height: 2, backgroundColor: '#D4A853', display: 'flex' }} />
        </div>

        {/* ハイライト */}
        <div
          style={{
            color: '#FFFFFF',
            fontSize: width * 0.03,
            fontWeight: 600,
            lineHeight: 1.6,
            marginBottom: height * 0.015,
            display: 'flex',
          }}
        >
          {highlight}
        </div>

        {/* 残りの文章 */}
        {rest && (
          <div
            style={{
              color: '#9CA3AF',
              fontSize: width * 0.024,
              lineHeight: 1.7,
              flex: 1,
              display: 'flex',
            }}
          >
            {rest}
          </div>
        )}

        {/* 閉じ引用符 */}
        <div style={{ color: '#D4A853', fontSize: width * 0.08, lineHeight: 0.5, alignSelf: 'flex-end', display: 'flex' }}>
          &rdquo;
        </div>
      </div>
    </div>
  );
};

// tpl-007: マガジンインタビュー（赤アクセント）
export const Template007 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.42;
  const { highlight, rest } = extractHighlight(reviewText);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 左側：写真エリア */}
      <div
        style={{
          width: '45%',
          backgroundColor: '#F9FAFB',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: width * 0.04,
          borderRight: '1px solid #E5E7EB',
        }}
      >
        {/* ヘッダー帯 */}
        <div
          style={{
            backgroundColor: '#DC2626',
            padding: '8px 20px',
            marginBottom: height * 0.025,
            display: 'flex',
          }}
        >
          <div style={{ color: '#FFFFFF', fontSize: width * 0.016, letterSpacing: '0.15em', fontWeight: 700, display: 'flex' }}>
            INTERVIEW
          </div>
        </div>

        {/* 顔写真 */}
        <FacePhoto
          faceUrl={faceUrl}
          ownerName={ownerName}
          size={photoSize}
          borderColor="#1A1A1A"
          borderWidth={4}
          rounded={false}
        />

        {/* 名前 */}
        {ownerName && (
          <div style={{ color: '#1A1A1A', fontSize: width * 0.03, fontWeight: 800, marginTop: 14, display: 'flex' }}>
            {ownerName} 様
          </div>
        )}

        {/* サービス情報 */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.035, marginRight: 8 }} />
          )}
          <div style={{ color: '#DC2626', fontSize: width * 0.022, fontWeight: 600, display: 'flex' }}>
            {serviceName}
          </div>
        </div>
      </div>

      {/* 右側：口コミエリア */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: width * 0.04 }}>
        {/* 装飾引用符 */}
        <div style={{ color: '#DC2626', fontSize: width * 0.1, lineHeight: 0.6, marginBottom: 10, display: 'flex' }}>
          &ldquo;
        </div>

        {/* キャッチコピー */}
        <div
          style={{
            color: '#1A1A1A',
            fontSize: width * 0.048,
            fontWeight: 900,
            lineHeight: 1.3,
            marginBottom: height * 0.02,
            display: 'flex',
          }}
        >
          {catchCopy}
        </div>

        {/* ハイライトボックス */}
        <div
          style={{
            backgroundColor: '#FEF2F2',
            borderLeft: '5px solid #DC2626',
            padding: width * 0.025,
            marginBottom: height * 0.018,
            display: 'flex',
          }}
        >
          <div style={{ color: '#991B1B', fontSize: width * 0.028, fontWeight: 600, lineHeight: 1.5, display: 'flex' }}>
            {highlight}
          </div>
        </div>

        {/* 残りの文章 */}
        {rest && (
          <div
            style={{
              color: '#4A4A4A',
              fontSize: width * 0.024,
              lineHeight: 1.8,
              flex: 1,
              display: 'flex',
            }}
          >
            {rest}
          </div>
        )}

        {/* 星評価 */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center' }}>
          <Stars color="#DC2626" size={width * 0.028} />
          <div style={{ color: '#DC2626', fontSize: width * 0.018, fontWeight: 600, marginLeft: 12, display: 'flex' }}>
            満足度 ★★★★★
          </div>
        </div>
      </div>
    </div>
  );
};

// tpl-008: ポップカジュアル（ピンク×パープル）
export const Template008 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.35;
  const { highlight, rest } = extractHighlight(reviewText);

  return (
    <div
      style={{
        width,
        height,
        background: 'linear-gradient(135deg, #FDF2F8 0%, #EDE9FE 50%, #DBEAFE 100%)',
        display: 'flex',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 装飾の円 */}
      <div
        style={{
          position: 'absolute',
          top: -height * 0.1,
          right: -width * 0.05,
          width: width * 0.3,
          height: width * 0.3,
          borderRadius: 9999,
          backgroundColor: '#EC4899',
          opacity: 0.1,
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -height * 0.08,
          left: -width * 0.05,
          width: width * 0.25,
          height: width * 0.25,
          borderRadius: 9999,
          backgroundColor: '#8B5CF6',
          opacity: 0.1,
          display: 'flex',
        }}
      />

      {/* コンテンツ */}
      <div style={{ display: 'flex', flex: 1, padding: width * 0.04 }}>
        {/* 左側：写真 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '38%' }}>
          {/* ヘッダー */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: height * 0.02 }}>
            {logoUrl && (
              <img src={logoUrl} alt="logo" style={{ height: height * 0.035, marginRight: 8 }} />
            )}
            <div style={{ color: '#EC4899', fontSize: width * 0.022, fontWeight: 700, display: 'flex' }}>
              {serviceName}
            </div>
          </div>

          {/* 顔写真 */}
          <div style={{ position: 'relative', display: 'flex' }}>
            <FacePhoto
              faceUrl={faceUrl}
              ownerName={ownerName}
              size={photoSize}
              borderColor="#FFFFFF"
              borderWidth={6}
            />
            {/* ハートバッジ */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#EC4899',
                color: '#FFFFFF',
                padding: '6px 12px',
                borderRadius: 20,
                fontSize: width * 0.018,
                fontWeight: 700,
                display: 'flex',
              }}
            >
              ♥ LOVE
            </div>
          </div>

          {/* 名前 */}
          {ownerName && (
            <div style={{ color: '#EC4899', fontSize: width * 0.028, fontWeight: 700, marginTop: 12, display: 'flex' }}>
              {ownerName} さん
            </div>
          )}
          <div style={{ marginTop: 6, display: 'flex' }}>
            <Stars color="#EC4899" size={width * 0.026} />
          </div>
        </div>

        {/* 右側：口コミカード */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: width * 0.04,
            marginLeft: width * 0.03,
            boxShadow: '0 8px 30px rgba(236, 72, 153, 0.15)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* キャッチコピー */}
          <div
            style={{
              color: '#EC4899',
              fontSize: width * 0.044,
              fontWeight: 900,
              lineHeight: 1.3,
              marginBottom: height * 0.02,
              display: 'flex',
            }}
          >
            {catchCopy}
          </div>

          {/* ハイライト吹き出し */}
          <div
            style={{
              backgroundColor: '#FDF2F8',
              borderRadius: 16,
              padding: width * 0.025,
              marginBottom: height * 0.015,
              position: 'relative',
              display: 'flex',
            }}
          >
            <div style={{ color: '#BE185D', fontSize: width * 0.026, fontWeight: 600, lineHeight: 1.5, display: 'flex' }}>
              {highlight}
            </div>
          </div>

          {/* 残りの文章 */}
          {rest && (
            <div
              style={{
                color: '#6B7280',
                fontSize: width * 0.022,
                lineHeight: 1.7,
                flex: 1,
                display: 'flex',
              }}
            >
              {rest}
            </div>
          )}

          {/* ハッシュタグ */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'auto' }}>
            <span
              style={{
                color: '#8B5CF6',
                backgroundColor: '#EDE9FE',
                padding: '4px 12px',
                borderRadius: 12,
                fontSize: width * 0.018,
                fontWeight: 600,
                display: 'flex',
              }}
            >
              #おすすめ
            </span>
            <span
              style={{
                color: '#EC4899',
                backgroundColor: '#FDF2F8',
                padding: '4px 12px',
                borderRadius: 12,
                fontSize: width * 0.018,
                fontWeight: 600,
                display: 'flex',
              }}
            >
              #リピート確定
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// tpl-009: データドリブン（ダーク×シアン）
export const Template009 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.28;
  const { highlight, rest } = extractHighlight(reviewText);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* グリッド装飾（背景） */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: 'linear-gradient(#06B6D4 1px, transparent 1px), linear-gradient(90deg, #06B6D4 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          display: 'flex',
        }}
      />

      {/* ヘッダー */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${height * 0.025}px ${width * 0.04}px`,
          borderBottom: '1px solid #164E63',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.04, marginRight: 12 }} />
          )}
          <div style={{ color: '#06B6D4', fontSize: width * 0.028, fontWeight: 700, display: 'flex' }}>
            {serviceName}
          </div>
        </div>
        {/* 満足度バッジ */}
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ color: '#06B6D4', fontSize: width * 0.035, marginRight: 6, display: 'flex' }}>★</span>
          <span style={{ color: '#06B6D4', fontSize: width * 0.08, fontWeight: 900, display: 'flex' }}>4.9</span>
          <span style={{ color: '#FFFFFF', fontSize: width * 0.018, marginLeft: 8, display: 'flex' }}>満足度</span>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ display: 'flex', flex: 1, padding: width * 0.04 }}>
        {/* 左側：顔写真 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '32%' }}>
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#06B6D4"
            borderWidth={4}
          />
          {ownerName && (
            <div style={{ color: '#FFFFFF', fontSize: width * 0.024, marginTop: 10, display: 'flex' }}>{ownerName} 様</div>
          )}
          <div style={{ marginTop: 6, display: 'flex' }}>
            <Stars color="#06B6D4" size={width * 0.024} />
          </div>

          {/* 評価タグ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: height * 0.02 }}>
            <div
              style={{
                backgroundColor: '#06B6D4',
                color: '#0F172A',
                padding: '4px 12px',
                borderRadius: 4,
                fontSize: width * 0.016,
                fontWeight: 700,
                display: 'flex',
              }}
            >
              ✓ 信頼できる
            </div>
            <div
              style={{
                backgroundColor: '#06B6D4',
                color: '#0F172A',
                padding: '4px 12px',
                borderRadius: 4,
                fontSize: width * 0.016,
                fontWeight: 700,
                display: 'flex',
              }}
            >
              ✓ また利用したい
            </div>
          </div>
        </div>

        {/* 右側：口コミカード */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: width * 0.035,
            marginLeft: width * 0.03,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* キャッチコピー */}
          <div
            style={{
              color: '#0F172A',
              fontSize: width * 0.042,
              fontWeight: 900,
              lineHeight: 1.3,
              marginBottom: height * 0.015,
              display: 'flex',
            }}
          >
            {catchCopy}
          </div>

          {/* ハイライトボックス */}
          <div
            style={{
              backgroundColor: '#ECFEFF',
              borderLeft: '4px solid #06B6D4',
              padding: width * 0.025,
              marginBottom: height * 0.015,
              display: 'flex',
            }}
          >
            <div style={{ color: '#0E7490', fontSize: width * 0.026, fontWeight: 600, lineHeight: 1.5, display: 'flex' }}>
              {highlight}
            </div>
          </div>

          {/* 残りの文章 */}
          {rest && (
            <div
              style={{
                color: '#475569',
                fontSize: width * 0.022,
                lineHeight: 1.7,
                flex: 1,
                display: 'flex',
              }}
            >
              {rest}
            </div>
          )}

          {/* ボトムタグ */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
            <div
              style={{
                backgroundColor: '#0F172A',
                color: '#06B6D4',
                padding: '6px 14px',
                borderRadius: 4,
                fontSize: width * 0.016,
                fontWeight: 700,
                display: 'flex',
              }}
            >
              CUSTOMER VOICE
            </div>
          </div>
        </div>
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
