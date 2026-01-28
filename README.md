# 利用者の声 - 口コミ収集＆画像生成アプリ

事業者がお客様の声を収集し、AIで口コミ文を生成して、SNS投稿用の画像を自動作成できるアプリケーションです。

## 機能

- 事業者登録（運営者情報、顔写真、ロゴ画像のアップロード対応）
- カスタマイズ可能なアンケート設定
- AI による口コミ文の自動生成
- テンプレートを使った口コミ画像の生成
- 生成した画像のギャラリー表示

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成し、必要な情報を入力してください。

```bash
cp .env.local.example .env.local
```

`.env.local` の内容:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Review Generation
OPENAI_API_KEY=your-openai-key

# Nano Banana Pro
NANO_BANANA_PRO_API_KEY=your-nano-banana-pro-key
NANO_BANANA_PRO_API_URL=https://api.nanobananapro.com
```

### 3. Supabase のセットアップ

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. SQL Editor で `supabase-schema.sql` を実行してテーブルを作成
3. Storage > Buckets で `uploads` バケットを作成（public設定）

```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);
```

4. 既存のテーブルに `owner_name` カラムを追加する場合:

```sql
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS owner_name TEXT;
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## プロジェクト構成

```
src/
├── app/
│   ├── api/              # API エンドポイント
│   │   ├── businesses/   # 事業者API
│   │   ├── upload/       # 画像アップロードAPI
│   │   └── ...
│   ├── business/         # 事業者登録・管理画面
│   ├── review/           # 口コミ投稿フロー
│   ├── gallery/          # ギャラリー表示
│   └── templates/        # テンプレート管理
├── components/           # 共通コンポーネント
├── lib/                  # ユーティリティ・設定
├── types/                # TypeScript 型定義
└── data/                 # テンプレートデータ
```

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: Supabase (PostgreSQL)
- **ストレージ**: Supabase Storage
- **AI**: OpenAI API / Nano Banana Pro

## ライセンス

MIT

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
