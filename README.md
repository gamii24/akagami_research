# Akagami Research

PDF資料をGoogleドライブのリンクで管理できる、大人っぽくおしゃれなデザインの資料管理システムです。

## 🎯 プロジェクト概要

- **サイト名**: Akagami Research
- **目的**: SNSマーケティング・生成AI関連のPDF資料を整理して管理
- **デザイン**: 落ち着いたカラーパレットで大人の雰囲気
- **技術スタック**: Hono + TypeScript + Cloudflare D1 + TailwindCSS

## 🎨 カラーパレット

- **Primary**: #BB666A - メインカラー
- **Secondary**: #e75556 - アクセントカラー
- **Accent**: #916769 - サブカラー
- **Dark**: #665a5a - テキスト用ダーク
- **Darker**: #3c2d2e - ヘッダー背景
- **Light**: #f4eee0 - 背景色

## 🌐 公開URL

- **開発環境**: https://3000-iwpfj0eebl4qd7e2klphb-5c13a017.sandbox.novita.ai
- **公開ページ**: `/` - PDF一覧・検索・閲覧
- **管理画面**: `/admin` - PDF登録・編集・削除（パスワード: `admin123`）

## ✨ 完成済み機能

### 公開ページ（`/`）
- ✅ おしゃれなグラデーションデザイン
- ✅ カテゴリでフィルタリング（11カテゴリ）
- ✅ タグでフィルタリング（複数選択可）
- ✅ キーワード検索
- ✅ GoogleドライブへのリンクでPDFを開く
- ✅ レスポンシブデザイン
- ✅ ホバーアニメーション

### 管理画面（`/admin`）
- ✅ エレガントなログイン画面
- ✅ PDF登録・編集・削除
- ✅ カテゴリ管理（追加・削除）
- ✅ タグ管理（追加・削除）
- ✅ 複数タグの一括選択
- ✅ メタデータ入力

## 📂 カテゴリ一覧

### SNS関連
- YouTube - YouTube関連の資料
- Threads - Threads関連の資料
- Podcast - Podcast関連の資料
- LINE公式 - LINE公式アカウント関連の資料
- Instagram - Instagram関連の資料
- TikTok - TikTok関連の資料
- X - X (旧Twitter)関連の資料

### その他
- マーケティング - マーケティング全般の資料
- 生成AI - 生成AI関連の資料
- 画像&動画生成 - 画像・動画生成関連の資料
- その他 - その他の資料

## 📊 データ構造

### データベース（Cloudflare D1）

**categoriesテーブル**
- 11種類のカテゴリ（SNS、マーケティング、AI関連）

**tagsテーブル**
- デフォルト: 重要、参照頻度高、最新、アーカイブ、要確認

**pdfsテーブル**
- PDF情報（タイトル、説明、GoogleドライブURL、カテゴリID、サムネイル、ファイルサイズ、ページ数）

**pdf_tagsテーブル**
- PDF-タグの多対多リレーション

## 🚀 ローカル開発

### セットアップ

```bash
# 依存関係のインストール
npm install

# データベースリセット（マイグレーション + シード）
npm run db:reset

# ビルド
npm run build

# PM2で起動
pm2 start ecosystem.config.cjs

# テスト
curl http://localhost:3000
```

### API エンドポイント

**カテゴリ**
- `GET /api/categories` - 全カテゴリ取得
- `POST /api/categories` - カテゴリ追加
- `DELETE /api/categories/:id` - カテゴリ削除

**タグ**
- `GET /api/tags` - 全タグ取得
- `POST /api/tags` - タグ追加
- `DELETE /api/tags/:id` - タグ削除

**PDF**
- `GET /api/pdfs` - PDF一覧取得（フィルタ対応）
  - クエリパラメータ: `category`, `tag`, `search`
- `GET /api/pdfs/:id` - 単一PDF取得
- `POST /api/pdfs` - PDF追加
- `PUT /api/pdfs/:id` - PDF更新
- `DELETE /api/pdfs/:id` - PDF削除

## 📝 使い方

### PDFを登録する

1. `/admin`にアクセス（パスワード: `admin123`）
2. 「PDF追加」ボタンをクリック
3. 必要な情報を入力：
   - タイトル（必須）
   - 説明
   - GoogleドライブURL（必須）
   - カテゴリ選択（YouTube、Instagram、マーケティング等）
   - タグ選択（複数可）
   - ページ数、ファイルサイズ
4. 「追加」ボタンで保存

### Googleドライブの共有設定

PDFを公開ページで開けるようにするには：

1. GoogleドライブでPDFファイルを右クリック
2. 「共有」→「リンクを知っている全員」に変更
3. URLをコピーして管理画面に貼り付け

### PDFを閲覧する

1. `/`（公開ページ）にアクセス
2. サイドバーのカテゴリでフィルタリング
3. タグボタンで絞り込み（複数選択可）
4. 検索ボックスでキーワード検索
5. 「Google Driveで開く」ボタンでPDFを閲覧

## 🎨 デザインの特徴

### カラースキーム
- 落ち着いた赤系（#BB666A、#e75556）をメインに
- ダーク系（#3c2d2e、#665a5a）で高級感
- ベージュ（#f4eee0）で温かみのある背景

### UIエレメント
- グラデーションボタンで高級感
- ホバー時のアニメーション
- シャドウとボーダーで立体感
- カスタムスクロールバー
- レスポンシブデザイン

## 📁 プロジェクト構造

```
webapp/
├── src/
│   ├── index.tsx          # メインアプリケーション（Hono）
│   └── renderer.tsx       # HTMLレンダラー（カスタムカラー設定）
├── public/
│   └── static/
│       ├── app.js         # 公開ページのJavaScript
│       ├── admin.js       # 管理画面のJavaScript
│       └── style.css      # カスタムCSS（Akagami Researchスタイル）
├── migrations/
│   └── 0001_initial_schema.sql  # データベーススキーマ
├── seed.sql               # 初期データ（11カテゴリ）
├── ecosystem.config.cjs   # PM2設定
├── wrangler.jsonc         # Cloudflare設定
└── package.json           # 依存関係とスクリプト
```

## 🔧 カスタマイズ

### カラーの変更

`src/renderer.tsx`のTailwind設定を編集：

```tsx
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#BB666A',    // メインカラー
        secondary: '#e75556',  // アクセント
        accent: '#916769',     // サブカラー
        dark: '#665a5a',       // ダーク
        darker: '#3c2d2e',     // 最ダーク
        light: '#f4eee0',      // 背景
      }
    }
  }
}
```

### 管理画面のパスワード変更

`public/static/admin.js`の55行目あたり：

```javascript
if (password === 'admin123') {  // ← ここを変更
  sessionStorage.setItem('admin_authenticated', 'true')
  ...
}
```

## 🚀 本番デプロイ（Cloudflare Pages）

### 前提条件
- Cloudflare APIキーの設定が必要
- 「ホステッドデプロイ」からCloudflare APIキーを設定

### デプロイ手順

```bash
# 1. プロジェクト作成
npx wrangler pages project create webapp --production-branch main

# 2. ビルド
npm run build

# 3. デプロイ
npx wrangler pages deploy dist --project-name webapp
```

## 📄 ライセンス

MIT License

## 🙏 最後に

Akagami Researchへようこそ！

このシステムで、SNSマーケティングや生成AI関連のPDF資料を効率的に管理できます。

- 11種類のカテゴリで整理
- タグで詳細な分類
- 美しいUIで快適な閲覧体験

何か質問や改善提案があれば、お気軽にお知らせください！
