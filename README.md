# PDF資料管理システム

GoogleドライブのリンクでPDF資料を管理できるシステムです。カテゴリとタグで整理し、簡単に検索・閲覧できます。

## 🎯 プロジェクト概要

- **目的**: 個人のPDF資料をカテゴリ・タグで整理して管理
- **特徴**: Googleドライブのリンク方式でシンプルに運用
- **技術スタック**: Hono + TypeScript + Cloudflare D1 + TailwindCSS

## 🌐 公開URL

- **開発環境**: https://3000-iwpfj0eebl4qd7e2klphb-5c13a017.sandbox.novita.ai
- **公開ページ**: `/` - PDF一覧・検索・閲覧
- **管理画面**: `/admin` - PDF登録・編集・削除（パスワード: `admin123`）

## ✨ 完成済み機能

### 公開ページ（`/`）
- ✅ PDF一覧表示
- ✅ カテゴリでフィルタリング
- ✅ タグでフィルタリング（複数選択可）
- ✅ キーワード検索
- ✅ GoogleドライブへのリンクでPDFを開く
- ✅ レスポンシブデザイン

### 管理画面（`/admin`）
- ✅ シンプルなパスワード認証（セッションストレージ）
- ✅ PDF登録・編集・削除
- ✅ カテゴリ管理（追加・削除）
- ✅ タグ管理（追加・削除）
- ✅ 複数タグの一括選択
- ✅ メタデータ入力（ファイルサイズ、ページ数など）

## 📊 データ構造

### データベース（Cloudflare D1）

**categoriesテーブル**
- カテゴリ情報（名前、説明）
- デフォルト: 技術資料、ビジネス、学術論文、マニュアル、その他

**tagsテーブル**
- タグ情報（名前）
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

# データベースマイグレーション（ローカル）
npm run db:migrate:local

# 初期データ投入
npm run db:seed

# ビルド
npm run build

# 開発サーバー起動
npm run dev:sandbox

# PM2で起動（推奨）
pm2 start ecosystem.config.cjs
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
   - カテゴリ
   - タグ（複数選択可）
   - ページ数
   - ファイルサイズ
4. 「追加」ボタンで保存

### Googleドライブの共有設定

PDFを公開ページで開けるようにするには：

1. GoogleドライブでPDFファイルを右クリック
2. 「共有」→「リンクを知っている全員」に変更
3. URLをコピーして管理画面に貼り付け

### PDFを閲覧する

1. `/`（公開ページ）にアクセス
2. カテゴリやタグでフィルタリング
3. 検索ボックスでキーワード検索
4. 「Google Driveで開く」ボタンでPDFを閲覧

## 🔧 カスタマイズ

### 管理画面のパスワード変更

`public/static/admin.js`の以下の部分を編集：

```javascript
// 55行目あたり
if (password === 'admin123') {  // ← ここを変更
  sessionStorage.setItem('admin_authenticated', 'true')
  ...
}
```

### カテゴリ・タグの追加

管理画面から簡単に追加できます：

- カテゴリ管理ボタン → 新しいカテゴリ名を入力 → 追加
- タグ管理ボタン → 新しいタグ名を入力 → 追加

## 📁 プロジェクト構造

```
webapp/
├── src/
│   ├── index.tsx          # メインアプリケーション（Hono）
│   └── renderer.tsx       # HTMLレンダラー
├── public/
│   └── static/
│       ├── app.js         # 公開ページのJavaScript
│       ├── admin.js       # 管理画面のJavaScript
│       └── style.css      # カスタムCSS
├── migrations/
│   └── 0001_initial_schema.sql  # データベーススキーマ
├── seed.sql               # 初期データ
├── ecosystem.config.cjs   # PM2設定
├── wrangler.jsonc         # Cloudflare設定
└── package.json           # 依存関係とスクリプト
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

## 🔒 セキュリティについて

**現在の認証方式**:
- 管理画面は簡易パスワード認証（セッションストレージ）
- **本番環境では適切な認証システムの導入を推奨**

**推奨改善策**:
- Cloudflare Access による認証
- JWT トークンベース認証
- OAuth 2.0 認証（Google, GitHub等）

## 🎨 デザイン

- **フレームワーク**: TailwindCSS（CDN）
- **アイコン**: Font Awesome 6.4.0
- **レスポンシブ対応**: モバイル・タブレット・デスクトップ

## 📄 ライセンス

MIT License

## 🙏 最後に

このシステムで、PDF資料を効率的に管理できます！

- カテゴリとタグで整理
- 素早く検索して見つける
- GoogleドライブでPDFを開く

何か質問や改善提案があれば、お気軽にお知らせください！
