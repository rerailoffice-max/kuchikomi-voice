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

// tpl-000: 黄緑ポップ推薦型（Facebookスタイル）
export const Template000 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height } = props;
  const photoSize = Math.min(width, height) * 0.38;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#C8E844',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景装飾 */}
      <div
        style={{
          position: 'absolute',
          top: -height * 0.1,
          right: -width * 0.1,
          width: width * 0.4,
          height: width * 0.4,
          borderRadius: 9999,
          backgroundColor: '#B8D834',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -height * 0.08,
          left: -width * 0.08,
          width: width * 0.3,
          height: width * 0.3,
          borderRadius: 9999,
          backgroundColor: '#D8F854',
          display: 'flex',
        }}
      />

      {/* メインコンテンツ */}
      <div style={{ display: 'flex', flex: 1, padding: width * 0.045, zIndex: 1 }}>
        {/* 左側：顔写真と名前 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '42%' }}>
          {/* 推薦ヘッダー */}
          <div
            style={{
              backgroundColor: '#FF6B35',
              color: '#FFFFFF',
              padding: '10px 24px',
              borderRadius: 30,
              fontSize: width * 0.024,
              fontWeight: 800,
              marginBottom: height * 0.025,
              display: 'flex',
            }}
          >
            ★ 大推薦します ★
          </div>

          {/* 顔写真 */}
          <div style={{ position: 'relative', display: 'flex' }}>
            <FacePhoto
              faceUrl={faceUrl}
              ownerName={ownerName}
              size={photoSize}
              borderColor="#FFFFFF"
              borderWidth={8}
            />
          </div>

          {/* 推薦者情報 */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: '12px 20px',
              marginTop: height * 0.025,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {ownerName && (
              <div style={{ color: '#1A1A1A', fontSize: width * 0.032, fontWeight: 800, display: 'flex' }}>
                {ownerName} さん
              </div>
            )}
            <div style={{ marginTop: 6, display: 'flex' }}>
              <Stars color="#FF6B35" size={width * 0.028} />
            </div>
          </div>
        </div>

        {/* 右側：推薦文 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: width * 0.03 }}>
          {/* サービス名 */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: height * 0.015 }}>
            {logoUrl && (
              <img src={logoUrl} alt="logo" style={{ height: height * 0.045, marginRight: 10 }} />
            )}
            <div style={{ color: '#1A1A1A', fontSize: width * 0.026, fontWeight: 700, display: 'flex' }}>
              {serviceName}
            </div>
          </div>

          {/* 吹き出し風の推薦文 */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: width * 0.035,
              flex: 1,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* 吹き出しの三角 */}
            <div
              style={{
                position: 'absolute',
                left: -15,
                top: height * 0.12,
                width: 0,
                height: 0,
                borderTop: '15px solid transparent',
                borderBottom: '15px solid transparent',
                borderRight: '20px solid #FFFFFF',
                display: 'flex',
              }}
            />

            {/* 推薦文テキスト */}
            <div
              style={{
                color: '#1A1A1A',
                fontSize: width * 0.028,
                lineHeight: 1.8,
                fontWeight: 500,
                flex: 1,
                display: 'flex',
              }}
            >
              {reviewText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// tpl-001: オレンジ推薦カード（2カラム型）
export const Template001 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height } = props;
  const photoSize = Math.min(width, height) * 0.4;
  const { highlight, rest } = extractHighlight(reviewText);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#FF8C42',
        display: 'flex',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 幾何学模様の背景 */}
      <div
        style={{
          position: 'absolute',
          top: height * 0.1,
          left: -width * 0.05,
          width: width * 0.25,
          height: width * 0.25,
          backgroundColor: '#FFa862',
          transform: 'rotate(45deg)',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: height * 0.15,
          right: -width * 0.08,
          width: width * 0.3,
          height: width * 0.3,
          backgroundColor: '#FF7C32',
          borderRadius: 9999,
          display: 'flex',
        }}
      />

      <div style={{ display: 'flex', flex: 1, padding: width * 0.04, zIndex: 1 }}>
        {/* 左側：推薦文 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* ヘッダー */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              color: '#FF6B35',
              padding: '8px 20px',
              borderRadius: 25,
              fontSize: width * 0.02,
              fontWeight: 800,
              alignSelf: 'flex-start',
              marginBottom: height * 0.02,
              display: 'flex',
            }}
          >
            ★ {serviceName}を大推薦いたします！
          </div>

          {/* 吹き出し風ハイライト */}
          <div
            style={{
              backgroundColor: '#FFF3E0',
              borderRadius: 20,
              padding: width * 0.03,
              marginBottom: height * 0.015,
              display: 'flex',
            }}
          >
            <div style={{ color: '#E65100', fontSize: width * 0.032, fontWeight: 700, lineHeight: 1.5, display: 'flex' }}>
              「{highlight}」
            </div>
          </div>

          {/* 推薦文本文 */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: width * 0.03,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                color: '#333333',
                fontSize: width * 0.024,
                lineHeight: 1.75,
                flex: 1,
                display: 'flex',
              }}
            >
              {rest || reviewText}
            </div>

            {/* こんな方におすすめ */}
            <div
              style={{
                backgroundColor: '#FF8C42',
                borderRadius: 12,
                padding: '12px 16px',
                marginTop: height * 0.015,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ color: '#FFFFFF', fontSize: width * 0.018, fontWeight: 700, marginBottom: 6, display: 'flex' }}>
                こんな方におすすめ
              </div>
              <div style={{ color: '#FFFFFF', fontSize: width * 0.016, display: 'flex' }}>
                ✓ 丁寧な対応を求める方 ✓ 安心を重視する方
              </div>
            </div>
          </div>
        </div>

        {/* 右側：顔写真 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%', paddingLeft: width * 0.03 }}>
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#FFFFFF"
            borderWidth={8}
          />

          {/* 名前と肩書き */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: '14px 20px',
              marginTop: height * 0.02,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {ownerName && (
              <div style={{ color: '#1A1A1A', fontSize: width * 0.03, fontWeight: 800, display: 'flex' }}>
                {ownerName} さん
              </div>
            )}
            <div style={{ color: '#FF6B35', fontSize: width * 0.018, fontWeight: 600, marginTop: 4, display: 'flex' }}>
              推薦者
            </div>
            <div style={{ marginTop: 8, display: 'flex' }}>
              <Stars color="#FF8C42" size={width * 0.026} />
            </div>
          </div>

          {/* ロゴ */}
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.05, marginTop: height * 0.02 }} />
          )}
        </div>
      </div>
    </div>
  );
};

// tpl-002: 水彩風エレガント（フローラル）
export const Template002 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height } = props;
  const photoSize = Math.min(width, height) * 0.35;

  return (
    <div
      style={{
        width,
        height,
        background: 'linear-gradient(135deg, #FFE4C9 0%, #FFD4A8 50%, #FFCBA4 100%)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 水彩風の装飾円 */}
      <div
        style={{
          position: 'absolute',
          top: -height * 0.15,
          right: -width * 0.1,
          width: width * 0.5,
          height: width * 0.5,
          borderRadius: 9999,
          background: 'radial-gradient(circle, rgba(255,182,140,0.6) 0%, transparent 70%)',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -height * 0.2,
          left: -width * 0.15,
          width: width * 0.6,
          height: width * 0.6,
          borderRadius: 9999,
          background: 'radial-gradient(circle, rgba(255,200,160,0.5) 0%, transparent 70%)',
          display: 'flex',
        }}
      />

      {/* メインコンテンツ */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: width * 0.045, zIndex: 1 }}>
        {/* 上部：顔写真と推薦ヘッダー */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: height * 0.02 }}>
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#FFFFFF"
            borderWidth={8}
          />

          {/* 推薦ヘッダー */}
          <div
            style={{
              backgroundColor: '#E57A44',
              color: '#FFFFFF',
              padding: '12px 30px',
              borderRadius: 30,
              fontSize: width * 0.028,
              fontWeight: 800,
              marginTop: height * 0.02,
              display: 'flex',
            }}
          >
            {serviceName}を大推薦します
          </div>

          {/* 推薦者名 */}
          {ownerName && (
            <div style={{ color: '#8B4513', fontSize: width * 0.022, fontWeight: 600, marginTop: 10, display: 'flex' }}>
              推薦者：{ownerName} さん
            </div>
          )}
        </div>

        {/* 推薦文カード */}
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: 20,
            padding: width * 0.04,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 装飾引用符 */}
          <div style={{ color: '#E57A44', fontSize: width * 0.08, lineHeight: 0.5, marginBottom: 10, display: 'flex' }}>
            &ldquo;
          </div>

          {/* 推薦文 */}
          <div
            style={{
              color: '#4A3728',
              fontSize: width * 0.026,
              lineHeight: 1.8,
              flex: 1,
              display: 'flex',
            }}
          >
            {reviewText}
          </div>

          {/* 閉じ引用符 */}
          <div style={{ color: '#E57A44', fontSize: width * 0.08, lineHeight: 0.5, alignSelf: 'flex-end', display: 'flex' }}>
            &rdquo;
          </div>
        </div>

        {/* フッター */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: height * 0.02 }}>
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.04, marginRight: 12 }} />
          )}
          <div style={{ marginTop: 4, display: 'flex' }}>
            <Stars color="#E57A44" size={width * 0.024} />
          </div>
        </div>
      </div>
    </div>
  );
};

// tpl-003: ベネフィット型（チェックリスト付き）
export const Template003 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height } = props;
  const photoSize = Math.min(width, height) * 0.25;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#FFF8E7',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ヘッダー帯 */}
      <div
        style={{
          backgroundColor: '#FF6B35',
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
          <div style={{ color: '#FFFFFF', fontSize: width * 0.028, fontWeight: 800, display: 'flex' }}>
            {serviceName}
          </div>
        </div>
        <div
          style={{
            backgroundColor: '#FFD700',
            color: '#1A1A1A',
            padding: '6px 16px',
            borderRadius: 20,
            fontSize: width * 0.016,
            fontWeight: 700,
            display: 'flex',
          }}
        >
          ★ Recommend
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ display: 'flex', flex: 1, padding: width * 0.035 }}>
        {/* 左側：Benefitボックス */}
        <div style={{ width: '55%', display: 'flex', flexDirection: 'column' }}>
          {/* Benefitヘッダー */}
          <div
            style={{
              backgroundColor: '#FF6B35',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: '16px 16px 0 0',
              fontSize: width * 0.022,
              fontWeight: 800,
              display: 'flex',
            }}
          >
            ✓ Benefit（おすすめポイント）
          </div>

          {/* Benefitリスト */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '0 0 16px 16px',
              padding: width * 0.025,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#FF6B35', fontSize: width * 0.024, marginRight: 10, display: 'flex' }}>✓</span>
              <span style={{ color: '#333', fontSize: width * 0.022, display: 'flex' }}>丁寧で安心できる対応</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#FF6B35', fontSize: width * 0.024, marginRight: 10, display: 'flex' }}>✓</span>
              <span style={{ color: '#333', fontSize: width * 0.022, display: 'flex' }}>高い技術力と実績</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#FF6B35', fontSize: width * 0.024, marginRight: 10, display: 'flex' }}>✓</span>
              <span style={{ color: '#333', fontSize: width * 0.022, display: 'flex' }}>わかりやすい説明</span>
            </div>
          </div>

          {/* お客様の声 */}
          <div
            style={{
              backgroundColor: '#FFF3E0',
              borderRadius: 16,
              padding: width * 0.025,
              marginTop: height * 0.015,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ color: '#FF6B35', fontSize: width * 0.018, fontWeight: 700, marginBottom: 8, display: 'flex' }}>
              💬 お客様の声
            </div>
            <div style={{ color: '#4A3728', fontSize: width * 0.022, lineHeight: 1.6, display: 'flex' }}>
              {reviewText.length > 80 ? reviewText.slice(0, 80) + '...' : reviewText}
            </div>
          </div>
        </div>

        {/* 右側：推薦者情報 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: width * 0.03 }}>
          {/* 推薦者写真 */}
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#FF6B35"
            borderWidth={5}
          />

          {/* 推薦者情報カード */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: '14px 20px',
              marginTop: height * 0.015,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {ownerName && (
              <div style={{ color: '#1A1A1A', fontSize: width * 0.026, fontWeight: 800, display: 'flex' }}>
                {ownerName} さん
              </div>
            )}
            <div style={{ color: '#FF6B35', fontSize: width * 0.016, fontWeight: 600, marginTop: 4, display: 'flex' }}>
              推薦者
            </div>
            <div style={{ marginTop: 6, display: 'flex' }}>
              <Stars color="#FFD700" size={width * 0.022} />
            </div>
          </div>

          {/* 推薦スターバッジ */}
          <div
            style={{
              backgroundColor: '#FFD700',
              borderRadius: 9999,
              width: width * 0.15,
              height: width * 0.15,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: height * 0.02,
            }}
          >
            <div style={{ color: '#1A1A1A', fontSize: width * 0.04, fontWeight: 900, display: 'flex' }}>★</div>
            <div style={{ color: '#1A1A1A', fontSize: width * 0.014, fontWeight: 700, display: 'flex' }}>RECOMMEND</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// tpl-004: シンプル推薦型（白背景×カラーアクセント）
export const Template004 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.35;

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
      {/* 上部のカラー帯 */}
      <div
        style={{
          height: 8,
          background: 'linear-gradient(90deg, #FF6B35 0%, #FFD700 50%, #4CAF50 100%)',
          display: 'flex',
        }}
      />

      {/* コンテンツ */}
      <div style={{ display: 'flex', flex: 1, padding: width * 0.045 }}>
        {/* 左側：顔写真エリア */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%' }}>
          {/* 大推薦バッジ */}
          <div
            style={{
              backgroundColor: '#FF6B35',
              color: '#FFFFFF',
              padding: '10px 24px',
              borderRadius: 30,
              fontSize: width * 0.022,
              fontWeight: 800,
              marginBottom: height * 0.02,
              display: 'flex',
            }}
          >
            ★ 大推薦します
          </div>

          {/* 顔写真 */}
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#FF6B35"
            borderWidth={6}
          />

          {/* 推薦者情報 */}
          {ownerName && (
            <div style={{ color: '#1A1A1A', fontSize: width * 0.03, fontWeight: 800, marginTop: 14, display: 'flex' }}>
              {ownerName} さん
            </div>
          )}
          <div style={{ marginTop: 8, display: 'flex' }}>
            <Stars color="#FFD700" size={width * 0.028} />
          </div>

          {/* サービス情報 */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: height * 0.025 }}>
            {logoUrl && (
              <img src={logoUrl} alt="logo" style={{ height: height * 0.04, marginRight: 10 }} />
            )}
            <div style={{ color: '#666', fontSize: width * 0.02, display: 'flex' }}>
              {serviceName}
            </div>
          </div>
        </div>

        {/* 右側：推薦文 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: width * 0.04 }}>
          {/* キャッチコピー */}
          <div
            style={{
              color: '#FF6B35',
              fontSize: width * 0.048,
              fontWeight: 900,
              lineHeight: 1.3,
              marginBottom: height * 0.02,
              display: 'flex',
            }}
          >
            {catchCopy}
          </div>

          {/* 装飾ライン */}
          <div style={{ width: 60, height: 4, backgroundColor: '#FFD700', marginBottom: height * 0.02, display: 'flex' }} />

          {/* 推薦文 */}
          <div
            style={{
              backgroundColor: '#F9F9F9',
              borderRadius: 16,
              padding: width * 0.035,
              flex: 1,
              display: 'flex',
            }}
          >
            <div
              style={{
                color: '#333333',
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

      {/* 下部のカラー帯 */}
      <div
        style={{
          height: 8,
          background: 'linear-gradient(90deg, #4CAF50 0%, #FFD700 50%, #FF6B35 100%)',
          display: 'flex',
        }}
      />
    </div>
  );
};

// tpl-005: プレミアムダーク（高級感）
export const Template005 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height } = props;
  const photoSize = Math.min(width, height) * 0.36;
  const { highlight } = extractHighlight(reviewText);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#1A1A2E',
        display: 'flex',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 装飾ライン */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 6,
          height: '100%',
          background: 'linear-gradient(180deg, #D4A853 0%, #8B6914 100%)',
          display: 'flex',
        }}
      />

      {/* コンテンツ */}
      <div style={{ display: 'flex', flex: 1, padding: width * 0.045, paddingLeft: width * 0.055 }}>
        {/* 左側：顔写真 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '42%' }}>
          {/* RECOMMENDバッジ */}
          <div
            style={{
              border: '2px solid #D4A853',
              color: '#D4A853',
              padding: '8px 20px',
              borderRadius: 30,
              fontSize: width * 0.018,
              fontWeight: 700,
              letterSpacing: '0.1em',
              marginBottom: height * 0.025,
              display: 'flex',
            }}
          >
            ★ RECOMMEND ★
          </div>

          {/* 顔写真 */}
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#D4A853"
            borderWidth={6}
          />

          {/* 推薦者情報 */}
          {ownerName && (
            <div style={{ color: '#D4A853', fontSize: width * 0.03, fontWeight: 700, marginTop: 14, display: 'flex' }}>
              {ownerName} 様
            </div>
          )}
          <div style={{ marginTop: 8, display: 'flex' }}>
            <Stars color="#D4A853" size={width * 0.028} />
          </div>
        </div>

        {/* 右側：推薦文 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: width * 0.04 }}>
          {/* サービス名 */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: height * 0.015 }}>
            {logoUrl && (
              <img src={logoUrl} alt="logo" style={{ height: height * 0.04, marginRight: 10 }} />
            )}
            <div style={{ color: '#D4A853', fontSize: width * 0.024, fontWeight: 700, display: 'flex' }}>
              {serviceName}
            </div>
          </div>

          {/* 大きな引用符 */}
          <div style={{ color: '#D4A853', fontSize: width * 0.12, lineHeight: 0.5, marginBottom: 10, display: 'flex' }}>
            &ldquo;
          </div>

          {/* ハイライト */}
          <div
            style={{
              color: '#FFFFFF',
              fontSize: width * 0.04,
              fontWeight: 800,
              lineHeight: 1.4,
              marginBottom: height * 0.02,
              display: 'flex',
            }}
          >
            {highlight}
          </div>

          {/* 推薦文 */}
          <div
            style={{
              color: '#CCCCCC',
              fontSize: width * 0.024,
              lineHeight: 1.8,
              flex: 1,
              display: 'flex',
            }}
          >
            {reviewText}
          </div>

          {/* 閉じ引用符 */}
          <div style={{ color: '#D4A853', fontSize: width * 0.08, lineHeight: 0.5, alignSelf: 'flex-end', display: 'flex' }}>
            &rdquo;
          </div>
        </div>
      </div>
    </div>
  );
};

// tpl-006: 明るいグリーン推薦型
export const Template006 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height } = props;
  const photoSize = Math.min(width, height) * 0.38;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#4CAF50',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景の葉っぱ風装飾 */}
      <div
        style={{
          position: 'absolute',
          top: -height * 0.1,
          right: -width * 0.05,
          width: width * 0.35,
          height: width * 0.35,
          borderRadius: '50% 0 50% 50%',
          backgroundColor: '#66BB6A',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -height * 0.08,
          left: -width * 0.1,
          width: width * 0.4,
          height: width * 0.4,
          borderRadius: '50% 50% 0 50%',
          backgroundColor: '#388E3C',
          display: 'flex',
        }}
      />

      {/* コンテンツ */}
      <div style={{ display: 'flex', flex: 1, padding: width * 0.045, zIndex: 1 }}>
        {/* 左側：顔写真 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '42%' }}>
          {/* ヘッダー */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              color: '#2E7D32',
              padding: '10px 24px',
              borderRadius: 30,
              fontSize: width * 0.024,
              fontWeight: 800,
              marginBottom: height * 0.02,
              display: 'flex',
            }}
          >
            ★ 大推薦 ★
          </div>

          {/* 顔写真 */}
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#FFFFFF"
            borderWidth={8}
          />

          {/* 推薦者情報 */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: '12px 20px',
              marginTop: height * 0.02,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {ownerName && (
              <div style={{ color: '#1A1A1A', fontSize: width * 0.028, fontWeight: 800, display: 'flex' }}>
                {ownerName} さん
              </div>
            )}
            <div style={{ marginTop: 6, display: 'flex' }}>
              <Stars color="#4CAF50" size={width * 0.024} />
            </div>
          </div>
        </div>

        {/* 右側：推薦文 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: width * 0.035 }}>
          {/* サービス名 */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: height * 0.015 }}>
            {logoUrl && (
              <img src={logoUrl} alt="logo" style={{ height: height * 0.04, marginRight: 10 }} />
            )}
            <div style={{ color: '#FFFFFF', fontSize: width * 0.024, fontWeight: 700, display: 'flex' }}>
              {serviceName}
            </div>
          </div>

          {/* 推薦文カード */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: width * 0.035,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* 引用符 */}
            <div style={{ color: '#4CAF50', fontSize: width * 0.08, lineHeight: 0.5, marginBottom: 10, display: 'flex' }}>
              &ldquo;
            </div>

            {/* 推薦文 */}
            <div
              style={{
                color: '#333333',
                fontSize: width * 0.026,
                lineHeight: 1.8,
                flex: 1,
                display: 'flex',
              }}
            >
              {reviewText}
            </div>

            {/* 閉じ引用符 */}
            <div style={{ color: '#4CAF50', fontSize: width * 0.06, lineHeight: 0.5, alignSelf: 'flex-end', display: 'flex' }}>
              &rdquo;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// tpl-007: ブルー信頼型（ビジネス向け）
export const Template007 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height } = props;
  const photoSize = Math.min(width, height) * 0.35;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#E3F2FD',
        display: 'flex',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景装飾 */}
      <div
        style={{
          position: 'absolute',
          top: -height * 0.1,
          left: -width * 0.1,
          width: width * 0.4,
          height: width * 0.4,
          borderRadius: 9999,
          backgroundColor: '#BBDEFB',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -height * 0.15,
          right: -width * 0.1,
          width: width * 0.5,
          height: width * 0.5,
          borderRadius: 9999,
          backgroundColor: '#90CAF9',
          opacity: 0.5,
          display: 'flex',
        }}
      />

      {/* コンテンツ */}
      <div style={{ display: 'flex', flex: 1, padding: width * 0.045, zIndex: 1 }}>
        {/* 左側：推薦文 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* ヘッダー */}
          <div
            style={{
              backgroundColor: '#1976D2',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: 8,
              fontSize: width * 0.024,
              fontWeight: 800,
              alignSelf: 'flex-start',
              marginBottom: height * 0.02,
              display: 'flex',
            }}
          >
            ★ {serviceName}を推薦します
          </div>

          {/* 推薦文カード */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: width * 0.035,
              flex: 1,
              borderLeft: '6px solid #1976D2',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                color: '#333333',
                fontSize: width * 0.026,
                lineHeight: 1.8,
                flex: 1,
                display: 'flex',
              }}
            >
              {reviewText}
            </div>

            {/* ポイント */}
            <div style={{ display: 'flex', gap: 10, marginTop: height * 0.02, flexWrap: 'wrap' }}>
              <span
                style={{
                  backgroundColor: '#E3F2FD',
                  color: '#1976D2',
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: width * 0.016,
                  fontWeight: 600,
                  display: 'flex',
                }}
              >
                ✓ 信頼できる
              </span>
              <span
                style={{
                  backgroundColor: '#E3F2FD',
                  color: '#1976D2',
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: width * 0.016,
                  fontWeight: 600,
                  display: 'flex',
                }}
              >
                ✓ 丁寧な対応
              </span>
              <span
                style={{
                  backgroundColor: '#E3F2FD',
                  color: '#1976D2',
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: width * 0.016,
                  fontWeight: 600,
                  display: 'flex',
                }}
              >
                ✓ おすすめ
              </span>
            </div>
          </div>
        </div>

        {/* 右側：顔写真 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '38%', paddingLeft: width * 0.03 }}>
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#1976D2"
            borderWidth={6}
          />

          {/* 推薦者情報 */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: '14px 20px',
              marginTop: height * 0.02,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {ownerName && (
              <div style={{ color: '#1A1A1A', fontSize: width * 0.028, fontWeight: 800, display: 'flex' }}>
                {ownerName} さん
              </div>
            )}
            <div style={{ color: '#1976D2', fontSize: width * 0.016, fontWeight: 600, marginTop: 4, display: 'flex' }}>
              推薦者
            </div>
            <div style={{ marginTop: 8, display: 'flex' }}>
              <Stars color="#1976D2" size={width * 0.024} />
            </div>
          </div>

          {/* ロゴ */}
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.05, marginTop: height * 0.02 }} />
          )}
        </div>
      </div>
    </div>
  );
};

// tpl-008: ピンクポップ（カジュアル）
export const Template008 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height, catchCopy } = props;
  const photoSize = Math.min(width, height) * 0.35;

  return (
    <div
      style={{
        width,
        height,
        background: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 50%, #FF1493 100%)',
        display: 'flex',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ハート装飾 */}
      <div
        style={{
          position: 'absolute',
          top: height * 0.1,
          right: width * 0.05,
          color: 'rgba(255,255,255,0.3)',
          fontSize: width * 0.15,
          display: 'flex',
        }}
      >
        ♥
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: height * 0.15,
          left: width * 0.08,
          color: 'rgba(255,255,255,0.2)',
          fontSize: width * 0.1,
          display: 'flex',
        }}
      >
        ♥
      </div>

      {/* コンテンツ */}
      <div style={{ display: 'flex', flex: 1, padding: width * 0.04, zIndex: 1 }}>
        {/* 左側：顔写真 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%' }}>
          {/* LOVEバッジ */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              color: '#FF1493',
              padding: '8px 20px',
              borderRadius: 30,
              fontSize: width * 0.022,
              fontWeight: 800,
              marginBottom: height * 0.02,
              display: 'flex',
            }}
          >
            ♥ LOVE ♥
          </div>

          {/* 顔写真 */}
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#FFFFFF"
            borderWidth={8}
          />

          {/* 推薦者情報 */}
          {ownerName && (
            <div style={{ color: '#FFFFFF', fontSize: width * 0.028, fontWeight: 800, marginTop: 14, display: 'flex' }}>
              {ownerName} さん
            </div>
          )}
          <div style={{ marginTop: 6, display: 'flex' }}>
            <Stars color="#FFFFFF" size={width * 0.026} />
          </div>

          {/* サービス名 */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: height * 0.02 }}>
            {logoUrl && (
              <img src={logoUrl} alt="logo" style={{ height: height * 0.035, marginRight: 8 }} />
            )}
            <div style={{ color: '#FFFFFF', fontSize: width * 0.02, display: 'flex' }}>
              {serviceName}
            </div>
          </div>
        </div>

        {/* 右側：推薦文カード */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: width * 0.035,
            marginLeft: width * 0.03,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* キャッチコピー */}
          <div
            style={{
              color: '#FF1493',
              fontSize: width * 0.042,
              fontWeight: 900,
              lineHeight: 1.3,
              marginBottom: height * 0.015,
              display: 'flex',
            }}
          >
            {catchCopy}
          </div>

          {/* 装飾ライン */}
          <div
            style={{
              width: 50,
              height: 4,
              backgroundColor: '#FF69B4',
              marginBottom: height * 0.015,
              display: 'flex',
            }}
          />

          {/* 推薦文 */}
          <div
            style={{
              backgroundColor: '#FFF0F5',
              borderRadius: 16,
              padding: width * 0.025,
              flex: 1,
              display: 'flex',
            }}
          >
            <div
              style={{
                color: '#333333',
                fontSize: width * 0.024,
                lineHeight: 1.75,
                display: 'flex',
              }}
            >
              {reviewText}
            </div>
          </div>

          {/* ハッシュタグ */}
          <div style={{ display: 'flex', gap: 8, marginTop: height * 0.015, flexWrap: 'wrap' }}>
            <span
              style={{
                backgroundColor: '#FFB6C1',
                color: '#FFFFFF',
                padding: '4px 12px',
                borderRadius: 15,
                fontSize: width * 0.016,
                fontWeight: 600,
                display: 'flex',
              }}
            >
              #おすすめ
            </span>
            <span
              style={{
                backgroundColor: '#FF69B4',
                color: '#FFFFFF',
                padding: '4px 12px',
                borderRadius: 15,
                fontSize: width * 0.016,
                fontWeight: 600,
                display: 'flex',
              }}
            >
              #大好き
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// tpl-009: パープルエレガント（上品）
export const Template009 = (props: TemplateProps) => {
  const { serviceName, ownerName, reviewText, faceUrl, logoUrl, width, height } = props;
  const photoSize = Math.min(width, height) * 0.36;

  return (
    <div
      style={{
        width,
        height,
        background: 'linear-gradient(180deg, #E1BEE7 0%, #CE93D8 50%, #AB47BC 100%)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Noto Sans JP, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 装飾の円 */}
      <div
        style={{
          position: 'absolute',
          top: -height * 0.15,
          left: -width * 0.1,
          width: width * 0.45,
          height: width * 0.45,
          borderRadius: 9999,
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -height * 0.1,
          right: -width * 0.08,
          width: width * 0.35,
          height: width * 0.35,
          borderRadius: 9999,
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
          display: 'flex',
        }}
      />

      {/* コンテンツ */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: width * 0.045, zIndex: 1 }}>
        {/* 上部：顔写真と推薦ヘッダー */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* 顔写真 */}
          <FacePhoto
            faceUrl={faceUrl}
            ownerName={ownerName}
            size={photoSize}
            borderColor="#FFFFFF"
            borderWidth={8}
          />

          {/* 推薦バッジ */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              color: '#7B1FA2',
              padding: '10px 28px',
              borderRadius: 30,
              fontSize: width * 0.024,
              fontWeight: 800,
              marginTop: height * 0.02,
              display: 'flex',
            }}
          >
            ★ {serviceName}を大推薦します
          </div>

          {/* 推薦者名 */}
          <div
            style={{
              backgroundColor: '#7B1FA2',
              color: '#FFFFFF',
              padding: '8px 20px',
              borderRadius: 20,
              fontSize: width * 0.022,
              fontWeight: 700,
              marginTop: 10,
              display: 'flex',
            }}
          >
            推薦者：{ownerName || '匿名'} さん
          </div>
        </div>

        {/* 推薦文カード */}
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: 20,
            padding: width * 0.035,
            marginTop: height * 0.02,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 引用符 */}
          <div style={{ color: '#AB47BC', fontSize: width * 0.08, lineHeight: 0.5, display: 'flex' }}>
            &ldquo;
          </div>

          {/* 推薦文 */}
          <div
            style={{
              color: '#333333',
              fontSize: width * 0.026,
              lineHeight: 1.8,
              flex: 1,
              padding: `0 ${width * 0.02}px`,
              display: 'flex',
            }}
          >
            {reviewText}
          </div>

          {/* 閉じ引用符 */}
          <div style={{ color: '#AB47BC', fontSize: width * 0.08, lineHeight: 0.5, alignSelf: 'flex-end', display: 'flex' }}>
            &rdquo;
          </div>
        </div>

        {/* フッター */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: height * 0.015 }}>
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: height * 0.04, marginRight: 12 }} />
          )}
          <Stars color="#FFFFFF" size={width * 0.024} />
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
