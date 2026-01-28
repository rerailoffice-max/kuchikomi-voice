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
  <div style={{ display: 'flex', gap: 2 }}>
    {[...Array(5)].map((_, i) => (
      <span key={i} style={{ color, fontSize: size }}>★</span>
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
  const borderRadius = rounded ? '50%' : 8;

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

// tpl-000: モノクロ・コラージュ型（推薦ポスター）
export const Template000 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.22;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#111111',
        display: 'flex',
        flexDirection: 'column',
        padding: width * 0.05,
        fontFamily: '"Noto Sans JP", sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景のRECOMMEND */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-15deg)',
          fontSize: width * 0.15,
          fontWeight: 900,
          color: 'rgba(255,255,255,0.08)',
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
        }}
      >
        RECOMMEND
      </div>

      {/* キャッチコピー */}
      <div
        style={{
          color: '#FFFFFF',
          fontSize: width * 0.06,
          fontWeight: 900,
          marginBottom: height * 0.03,
          lineHeight: 1.3,
        }}
      >
        {catchCopy}
      </div>

      {/* 中央エリア */}
      <div style={{ display: 'flex', flex: 1, gap: width * 0.04 }}>
        {/* 顔写真 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#FFFFFF"
            borderWidth={2}
            rounded={false}
          />
          {ownerName && (
            <div style={{ color: '#CCCCCC', fontSize: width * 0.025, marginTop: 8 }}>
              {ownerName}
            </div>
          )}
        </div>

        {/* 口コミ文 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', marginBottom: 8 }}>
            <span style={{ color: '#E8D44D', fontSize: width * 0.06, fontWeight: 700, lineHeight: 1 }}>「</span>
          </div>
          <div
            style={{
              color: '#FFFFFF',
              fontSize: width * 0.028,
              lineHeight: 1.8,
              flex: 1,
            }}
          >
            {reviewText}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ color: '#E8D44D', fontSize: width * 0.06, fontWeight: 700, lineHeight: 1 }}>」</span>
          </div>
        </div>
      </div>

      {/* フッター */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: height * 0.02,
          borderTop: '1px solid rgba(255,255,255,0.2)',
          paddingTop: height * 0.02,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ color: '#E8D44D', fontSize: width * 0.035, fontWeight: 700 }}>
            {serviceName}
          </div>
          <Stars color="#E8D44D" size={width * 0.025} />
        </div>
        {logoUrl && (
          <img src={logoUrl} alt="logo" style={{ height: height * 0.06, objectFit: 'contain' }} />
        )}
      </div>
    </div>
  );
};

// tpl-001: アイソメトリック・イエロー型（口コミカード）
export const Template001 = (props: TemplateProps) => {
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
        fontFamily: '"Noto Sans JP", sans-serif',
      }}
    >
      {/* 上部ライン */}
      <div style={{ height: 8, backgroundColor: '#FFD700' }} />

      {/* ヘッダー */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${height * 0.03}px ${width * 0.05}px`,
        }}
      >
        <div style={{ color: '#1A1A1A', fontSize: width * 0.04, fontWeight: 900 }}>
          {serviceName}
        </div>
        {logoUrl && (
          <img src={logoUrl} alt="logo" style={{ height: height * 0.06, objectFit: 'contain' }} />
        )}
      </div>

      {/* メインコンテンツ */}
      <div style={{ display: 'flex', flex: 1, padding: `0 ${width * 0.05}px`, gap: width * 0.04 }}>
        {/* 顔写真 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#FFD700"
            borderWidth={4}
          />
          {ownerName && (
            <div style={{ color: '#1A1A1A', fontSize: width * 0.022, marginTop: 8, fontWeight: 600 }}>
              {ownerName}
            </div>
          )}
        </div>

        {/* 口コミカード */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#F5F5F5',
            borderRadius: 16,
            padding: width * 0.04,
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '6px solid #FFD700',
          }}
        >
          <Stars color="#FFD700" size={width * 0.03} />
          <div style={{ color: '#1A1A1A', fontSize: width * 0.03, fontWeight: 700, margin: '12px 0' }}>
            {catchCopy}
          </div>
          <div
            style={{
              color: '#1A1A1A',
              fontSize: width * 0.025,
              lineHeight: 1.7,
              flex: 1,
            }}
          >
            {reviewText}
          </div>
        </div>
      </div>

      {/* フッター */}
      <div
        style={{
          padding: `${height * 0.03}px ${width * 0.05}px`,
          borderTop: '1px solid #E0E0E0',
        }}
      >
        <div style={{ color: '#666666', fontSize: width * 0.02 }}>{description}</div>
      </div>

      {/* 下部ライン */}
      <div style={{ height: 4, backgroundColor: '#FFD700' }} />
    </div>
  );
};

// tpl-002: コラージュ・タイポグラフィ型
export const Template002 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.18;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#FAFAFA',
        display: 'flex',
        fontFamily: '"Noto Sans JP", sans-serif',
        position: 'relative',
      }}
    >
      {/* 左の赤帯 */}
      <div
        style={{
          width: width * 0.08,
          backgroundColor: '#E53935',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          writingMode: 'vertical-rl',
        }}
      >
        <span style={{ color: '#FFFFFF', fontSize: width * 0.03, fontWeight: 700, letterSpacing: '0.2em' }}>
          VOICE
        </span>
      </div>

      {/* メインエリア */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 上の青帯 */}
        <div
          style={{
            height: height * 0.05,
            backgroundColor: '#1565C0',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: width * 0.03,
          }}
        >
          <span style={{ color: '#FFFFFF', fontSize: width * 0.025, fontWeight: 700 }}>
            {serviceName}
          </span>
        </div>

        {/* コンテンツ */}
        <div style={{ flex: 1, padding: width * 0.04, display: 'flex', flexDirection: 'column' }}>
          {/* キャッチコピー */}
          <div
            style={{
              fontSize: width * 0.055,
              fontWeight: 900,
              color: '#111111',
              marginBottom: height * 0.03,
              lineHeight: 1.2,
            }}
          >
            {catchCopy.split('').map((char, i) => (
              <span key={i} style={{ color: i % 5 === 0 ? '#E53935' : '#111111' }}>
                {char}
              </span>
            ))}
          </div>

          {/* 中段 */}
          <div style={{ display: 'flex', gap: width * 0.04, flex: 1 }}>
            {/* 顔写真 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <FacePhoto
                faceUrl={faceUrl}
                ownerName={ownerName}
                size={photoSize}
                borderColor="#111111"
                borderWidth={2}
                rounded={false}
              />
              {ownerName && (
                <div style={{ color: '#111111', fontSize: width * 0.02, marginTop: 8 }}>
                  {ownerName}
                </div>
              )}
            </div>

            {/* 口コミボックス */}
            <div
              style={{
                flex: 1,
                backgroundColor: '#FFD600',
                borderRadius: 12,
                padding: width * 0.03,
              }}
            >
              <div style={{ color: '#111111', fontSize: width * 0.024, lineHeight: 1.6 }}>
                {reviewText}
              </div>
            </div>
          </div>

          {/* フッター */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: height * 0.02,
            }}
          >
            <Stars color="#FFD600" size={width * 0.03} />
            {logoUrl && (
              <img src={logoUrl} alt="logo" style={{ height: height * 0.05, objectFit: 'contain' }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// tpl-003: 手書き水彩風型
export const Template003 = (props: TemplateProps) => {
  const { serviceName, description, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.18;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#FFF8F0',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Noto Sans JP", sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 水彩風の装飾（簡易版） */}
      <div
        style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          backgroundColor: 'rgba(232,146,124,0.15)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          backgroundColor: 'rgba(167,196,160,0.15)',
        }}
      />

      {/* ヘッダー */}
      <div style={{ padding: width * 0.05, display: 'flex', alignItems: 'center', gap: 16 }}>
        {logoUrl && (
          <img src={logoUrl} alt="logo" style={{ height: height * 0.05, objectFit: 'contain' }} />
        )}
        <div style={{ color: '#4A3728', fontSize: width * 0.035, fontWeight: 600 }}>
          {serviceName}
        </div>
      </div>

      {/* 顔写真 */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: height * 0.02 }}>
        <FacePhoto
          faceUrl={faceUrl}
          ownerName={ownerName}
          size={photoSize}
          borderColor="#E8927C"
          borderWidth={3}
        />
      </div>

      {/* 口コミカード */}
      <div
        style={{
          margin: `0 ${width * 0.05}px`,
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: width * 0.04,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transform: 'rotate(-1deg)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Stars color="#E8927C" size={width * 0.025} />
          <span style={{ color: '#E8927C', fontSize: width * 0.03, fontWeight: 700 }}>
            {catchCopy}
          </span>
        </div>
        <div
          style={{
            color: '#4A3728',
            fontSize: width * 0.025,
            lineHeight: 1.8,
            flex: 1,
          }}
        >
          {reviewText}
        </div>
        {ownerName && (
          <div style={{ color: '#A7C4A0', fontSize: width * 0.02, textAlign: 'right', marginTop: 12 }}>
            — {ownerName} 様
          </div>
        )}
      </div>

      {/* フッター */}
      <div
        style={{
          backgroundColor: '#A7C4A0',
          padding: `${height * 0.02}px ${width * 0.05}px`,
          marginTop: height * 0.03,
        }}
      >
        <div style={{ color: '#4A3728', fontSize: width * 0.02 }}>{description}</div>
      </div>
    </div>
  );
};

// tpl-004: 手書きモノクロ型（ミニマル和風）
export const Template004 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height } = props;
  const photoSize = Math.min(width, height) * 0.12;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#F7F3EE',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: '"Noto Sans JP", sans-serif',
        padding: width * 0.08,
      }}
    >
      {/* 上部余白 */}
      <div style={{ height: height * 0.05 }} />

      {/* 見出し */}
      <div style={{ color: '#C4956A', fontSize: width * 0.03, letterSpacing: '0.3em', marginBottom: 16 }}>
        VOICE
      </div>
      <div style={{ width: '60%', height: 1, backgroundColor: '#2C2C2C', marginBottom: height * 0.04 }} />

      {/* 顔写真 */}
      <FacePhoto
        faceUrl={faceUrl}
        ownerName={ownerName}
        size={photoSize}
        borderColor="#C4956A"
        borderWidth={2}
      />
      {ownerName && (
        <div style={{ color: '#2C2C2C', fontSize: width * 0.02, marginTop: 12, fontWeight: 300 }}>
          {ownerName}
        </div>
      )}

      {/* 口コミ文 */}
      <div style={{ width: '80%', height: 1, backgroundColor: '#2C2C2C', margin: `${height * 0.03}px 0` }} />
      <div
        style={{
          color: '#2C2C2C',
          fontSize: width * 0.026,
          lineHeight: 2.0,
          textAlign: 'center',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {reviewText}
      </div>
      <div style={{ width: '80%', height: 1, backgroundColor: '#2C2C2C', margin: `${height * 0.03}px 0` }} />

      {/* 星評価 */}
      <Stars color="#C4956A" size={width * 0.02} />

      {/* サービス情報 */}
      <div style={{ marginTop: height * 0.03, display: 'flex', alignItems: 'center', gap: 16 }}>
        {logoUrl && (
          <img src={logoUrl} alt="logo" style={{ height: height * 0.04, objectFit: 'contain' }} />
        )}
        <div style={{ color: '#8C8C8C', fontSize: width * 0.02 }}>{serviceName}</div>
      </div>
    </div>
  );
};

// tpl-005: ビジネス・スタンダード型（ビフォーアフター）
export const Template005 = (props: TemplateProps) => {
  const { serviceName, description, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.18;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Noto Sans JP", sans-serif',
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          backgroundColor: '#2563EB',
          padding: `${height * 0.02}px ${width * 0.05}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ color: '#FFFFFF', fontSize: width * 0.03, fontWeight: 700 }}>お客様の声</span>
        <Stars color="#FFFFFF" size={width * 0.025} />
      </div>

      {/* メインコンテンツ */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Before */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#F1F5F9',
            padding: width * 0.04,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ color: '#94A3B8', fontSize: width * 0.025, fontWeight: 700, marginBottom: 16 }}>
            Before
          </div>
          <div style={{ color: '#64748B', fontSize: width * 0.022, lineHeight: 1.6 }}>
            こんなお悩みありませんか？
          </div>
        </div>

        {/* 中央の顔写真 */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#2563EB"
            borderWidth={4}
          />
        </div>

        {/* 中央線 */}
        <div style={{ width: 2, backgroundColor: '#2563EB' }} />

        {/* After */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#F8FAFC',
            padding: width * 0.04,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ color: '#2563EB', fontSize: width * 0.025, fontWeight: 700, marginBottom: 16 }}>
            After
          </div>
          <div style={{ color: '#2563EB', fontSize: width * 0.028, fontWeight: 700, marginBottom: 12 }}>
            {catchCopy}
          </div>
          <div style={{ color: '#1E293B', fontSize: width * 0.022, lineHeight: 1.7, flex: 1 }}>
            {reviewText}
          </div>
        </div>
      </div>

      {/* フッター */}
      <div
        style={{
          padding: `${height * 0.02}px ${width * 0.05}px`,
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.04, objectFit: 'contain' }} />
          )}
          <div>
            <div style={{ color: '#1E293B', fontSize: width * 0.025, fontWeight: 700 }}>{serviceName}</div>
            <div style={{ color: '#64748B', fontSize: width * 0.018 }}>{description}</div>
          </div>
        </div>
        {ownerName && (
          <div style={{ color: '#64748B', fontSize: width * 0.018 }}>{ownerName}</div>
        )}
      </div>
    </div>
  );
};

// tpl-006: アイソメトリック・カラー型（信頼バッジ）
export const Template006 = (props: TemplateProps) => {
  const { serviceName, description, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.16;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#0C1220',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: '"Noto Sans JP", sans-serif',
        padding: width * 0.05,
        position: 'relative',
      }}
    >
      {/* 四隅の装飾 */}
      {[
        { top: 20, left: 20 },
        { top: 20, right: 20 },
        { bottom: 20, left: 20 },
        { bottom: 20, right: 20 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            ...pos,
            width: 40,
            height: 40,
            border: '2px solid rgba(59,130,246,0.3)',
            transform: 'rotate(45deg)',
          }}
        />
      ))}

      {/* バッジ */}
      <div
        style={{
          width: width * 0.25,
          height: width * 0.25,
          borderRadius: '50%',
          border: '4px solid #D4A853',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: height * 0.02,
        }}
      >
        <div style={{ color: '#D4A853', fontSize: width * 0.025, fontWeight: 700, letterSpacing: '0.1em' }}>
          TRUSTED
        </div>
        {logoUrl && (
          <img src={logoUrl} alt="logo" style={{ height: height * 0.04, objectFit: 'contain', marginTop: 8 }} />
        )}
      </div>

      {/* 顔写真 */}
      <FacePhoto
        faceUrl={faceUrl}
        ownerName={ownerName}
        size={photoSize}
        borderColor="#D4A853"
        borderWidth={3}
      />
      {ownerName && (
        <div style={{ color: '#FFFFFF', fontSize: width * 0.022, marginTop: 8 }}>{ownerName}</div>
      )}

      {/* 装飾ライン */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: `${height * 0.02}px 0` }}>
        <div style={{ width: 40, height: 2, backgroundColor: '#D4A853' }} />
        <div style={{ width: 8, height: 8, backgroundColor: '#D4A853', transform: 'rotate(45deg)' }} />
        <div style={{ width: 40, height: 2, backgroundColor: '#D4A853' }} />
      </div>

      {/* キャッチコピー */}
      <div style={{ color: '#D4A853', fontSize: width * 0.03, fontWeight: 700, marginBottom: 12 }}>
        {catchCopy}
      </div>

      {/* 口コミ文 */}
      <div
        style={{
          color: '#FFFFFF',
          fontSize: width * 0.024,
          lineHeight: 1.7,
          textAlign: 'center',
          flex: 1,
        }}
      >
        {reviewText}
      </div>

      {/* 装飾ライン */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: `${height * 0.02}px 0` }}>
        <div style={{ width: 40, height: 2, backgroundColor: '#D4A853' }} />
        <div style={{ width: 8, height: 8, backgroundColor: '#D4A853', transform: 'rotate(45deg)' }} />
        <div style={{ width: 40, height: 2, backgroundColor: '#D4A853' }} />
      </div>

      {/* 星評価 */}
      <Stars color="#D4A853" size={width * 0.03} />

      {/* フッター */}
      <div style={{ marginTop: height * 0.02, textAlign: 'center' }}>
        <div style={{ color: '#D4A853', fontSize: width * 0.028, fontWeight: 700 }}>{serviceName}</div>
        <div style={{ color: '#CCCCCC', fontSize: width * 0.018 }}>{description}</div>
      </div>
    </div>
  );
};

// tpl-007: 雑誌風コラージュ型（インタビュー）
export const Template007 = (props: TemplateProps) => {
  const { serviceName, description, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.28;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Noto Sans JP", sans-serif',
      }}
    >
      {/* ヘッダー帯 */}
      <div
        style={{
          backgroundColor: '#DC2626',
          padding: `${height * 0.015}px ${width * 0.05}px`,
        }}
      >
        <span style={{ color: '#FFFFFF', fontSize: width * 0.018, letterSpacing: '0.15em', fontWeight: 600 }}>
          CUSTOMER INTERVIEW
        </span>
      </div>

      {/* メインコンテンツ */}
      <div style={{ display: 'flex', flex: 1, padding: width * 0.04 }}>
        {/* 左カラム */}
        <div style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingRight: width * 0.03 }}>
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#1A1A1A"
            borderWidth={2}
            rounded={false}
          />
          {ownerName && (
            <div style={{ color: '#1A1A1A', fontSize: width * 0.025, fontWeight: 700, marginTop: 16 }}>
              {ownerName}
            </div>
          )}
          <div style={{ color: '#DC2626', fontSize: width * 0.022, marginTop: 8 }}>{serviceName}</div>
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.05, objectFit: 'contain', marginTop: 16 }} />
          )}
        </div>

        {/* 縦罫線 */}
        <div style={{ width: 1, backgroundColor: '#E5E7EB', marginRight: width * 0.03 }} />

        {/* 右カラム */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 装飾引用符 */}
          <div style={{ color: '#DC2626', fontSize: width * 0.08, fontWeight: 700, lineHeight: 0.8 }}>&ldquo;</div>

          {/* 質問 */}
          <div style={{ color: '#6B7280', fontSize: width * 0.018, marginBottom: 12 }}>
            Q. サービスを受けていかがでしたか？
          </div>

          {/* キャッチコピー */}
          <div style={{ color: '#1A1A1A', fontSize: width * 0.028, fontWeight: 700, marginBottom: 16 }}>
            {catchCopy}
          </div>

          {/* 口コミ文 */}
          <div
            style={{
              color: '#1A1A1A',
              fontSize: width * 0.022,
              lineHeight: 2.0,
              flex: 1,
            }}
          >
            {reviewText}
          </div>

          {/* 星評価 */}
          <Stars color="#DC2626" size={width * 0.025} />

          {/* 概要 */}
          <div style={{ color: '#6B7280', fontSize: width * 0.016, marginTop: 16 }}>{description}</div>
        </div>
      </div>
    </div>
  );
};

// tpl-008: シティポップ・コラージュ型（SNSカジュアル）
export const Template008 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.22;

  return (
    <div
      style={{
        width,
        height,
        background: 'linear-gradient(135deg, #FDF2F8 0%, #EDE9FE 100%)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Noto Sans JP", sans-serif',
        padding: width * 0.05,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景装飾 */}
      {['★', '○', '△'].map((shape, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${20 + i * 30}%`,
            right: `${10 + i * 15}%`,
            fontSize: 30,
            color: 'rgba(255,255,255,0.4)',
            transform: `rotate(${i * 15}deg)`,
          }}
        >
          {shape}
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          fontSize: width * 0.06,
          color: 'rgba(255,255,255,0.15)',
          fontWeight: 900,
        }}
      >
        LOVE IT!
      </div>

      {/* 顔写真 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: height * 0.02 }}>
        <div style={{ transform: 'rotate(3deg)' }}>
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#FFFFFF"
            borderWidth={6}
          />
        </div>
        {ownerName && (
          <div style={{ color: '#EC4899', fontSize: width * 0.025, fontWeight: 700, marginTop: 12 }}>
            {ownerName}
          </div>
        )}
      </div>

      {/* 吹き出しカード */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: width * 0.04,
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* 吹き出しの尖り */}
        <div
          style={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderBottom: '12px solid #FFFFFF',
          }}
        />
        <Stars color="#EC4899" size={width * 0.025} />
        <div style={{ color: '#EC4899', fontSize: width * 0.028, fontWeight: 700, margin: '12px 0' }}>
          {catchCopy}
        </div>
        <div
          style={{
            color: '#1F2937',
            fontSize: width * 0.024,
            lineHeight: 1.6,
            flex: 1,
          }}
        >
          {reviewText}
        </div>
      </div>

      {/* ハッシュタグ */}
      <div style={{ display: 'flex', gap: 12, marginTop: height * 0.02, flexWrap: 'wrap' }}>
        {['#おすすめ', '#リピート確定'].map((tag, i) => (
          <span key={i} style={{ color: '#8B5CF6', fontSize: width * 0.02, fontWeight: 600 }}>
            {tag}
          </span>
        ))}
      </div>

      {/* ロゴ・サービス情報 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: height * 0.02 }}>
        {logoUrl && (
          <img src={logoUrl} alt="logo" style={{ height: height * 0.04, objectFit: 'contain' }} />
        )}
        <div style={{ color: '#1F2937', fontSize: width * 0.02, fontWeight: 600 }}>{serviceName}</div>
      </div>
    </div>
  );
};

// tpl-009: ミニチュア・フォトリアル型（実績数字）
export const Template009 = (props: TemplateProps) => {
  const { serviceName, description, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.16;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Noto Sans JP", sans-serif',
        padding: width * 0.05,
        position: 'relative',
      }}
    >
      {/* 背景のゴースト数字 */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '5%',
          fontSize: width * 0.3,
          fontWeight: 900,
          color: 'rgba(22,78,99,0.15)',
        }}
      >
        4.9
      </div>

      {/* メイン数字 */}
      <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: height * 0.02 }}>
        <span style={{ color: '#06B6D4', fontSize: width * 0.04, marginRight: 8 }}>★</span>
        <span
          style={{
            fontSize: width * 0.12,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #06B6D4, #22D3EE)',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitBackgroundClip: 'text',
          }}
        >
          4.9
        </span>
      </div>
      <div style={{ color: '#FFFFFF', fontSize: width * 0.025, marginBottom: height * 0.03 }}>
        お客様満足度
      </div>

      {/* 中央エリア */}
      <div style={{ display: 'flex', gap: width * 0.04, flex: 1 }}>
        {/* 左側：顔写真 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.04, objectFit: 'contain', marginBottom: 12 }} />
          )}
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#06B6D4"
            borderWidth={3}
          />
          {ownerName && (
            <div style={{ color: '#FFFFFF', fontSize: width * 0.02, marginTop: 8 }}>{ownerName}</div>
          )}
        </div>

        {/* 右側：口コミカード */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: width * 0.03,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stars color="#06B6D4" size={width * 0.02} />
          <div style={{ color: '#06B6D4', fontSize: width * 0.025, fontWeight: 700, margin: '8px 0' }}>
            {catchCopy}
          </div>
          <div
            style={{
              color: '#1A1A1A',
              fontSize: width * 0.022,
              lineHeight: 1.7,
              flex: 1,
            }}
          >
            {reviewText}
          </div>
        </div>
      </div>

      {/* フッター */}
      <div
        style={{
          marginTop: height * 0.02,
          paddingTop: height * 0.02,
          borderTop: '1px solid #164E63',
        }}
      >
        <div style={{ color: '#06B6D4', fontSize: width * 0.025, fontWeight: 700 }}>{serviceName}</div>
        <div style={{ color: '#94A3B8', fontSize: width * 0.018 }}>{description}</div>
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
