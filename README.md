# Akagami Research

PDF資料をGoogleドライブのリンクで管理できる、シンプルで美しいデザインの資料管理システムです。

## 🎯 プロジェクト概要

- **サイト名**: Akagami Research
- **目的**: SNSマーケティング・生成AI関連のPDF資料を整理して管理
- **デザイン**: 白と赤（#e75556）の2色デザイン
- **技術スタック**: Hono + TypeScript + Cloudflare D1 + TailwindCSS

## 🎨 カラーパレット

- **Primary**: #e75556 - メインの赤色
- **White**: #ffffff - 背景色
- **Beige**: #f4eee0 - アクセント用ベージュ

## 🌐 公開URL

- **本番環境**: https://7829e958.akagami-research.pages.dev
- **開発環境**: https://3000-iwpfj0eebl4qd7e2klphb-5c13a017.sandbox.novita.ai
- **公開ページ**: `/` - PDF一覧・検索・閲覧
- **管理画面**: `/admin` - PDF登録・編集・削除（パスワード: `admin123`)

## ✨ 完成済み機能

### 公開ページ（`/`）
- ✅ シンプルで美しい2色デザイン
- ✅ カテゴリでフィルタリング（11カテゴリ、PDF数の多い順に自動ソート）
- ✅ タグでフィルタリング（複数選択可）
- ✅ キーワード検索（モバイル：ページ上部、デスクトップ：サイドバー）
- ✅ ソート機能（新着順・古い順・人気順）
- ✅ お気に入り機能（ハートボタン）
- ✅ 7日以内にアップロードされたPDFにNEWバッジ（薄い黄色）
- ✅ カード全体クリックでGoogleドライブへ遷移
- ✅ カテゴリ一括ダウンロードボタン（URLカスタマイズ可能）
- ✅ タイトル完全表示（複数行対応）
- ✅ レスポンシブデザイン（PC: 3列、スマホ: 2列）
- ✅ ハンバーガーメニュー（モバイル）
- ✅ サイト名クリックでトップページへ戻る
- ✅ 初回訪問時のウェルカムメッセージ（SNSロゴの降下演出）
- ✅ ダウンロードマイルストーン（1回目・5回目で特別なお祝い）
- ✅ シェア機能（Web Share API対応）

### 管理画面（`/admin`）
- ✅ エレガントなログイン画面
- ✅ PDF登録・編集・削除
- ✅ 一括アップロード機能（コピペ対応）
  - ExcelやGoogleスプレッドシートから直接貼り付け
  - タブ区切りで一度に大量登録
  - プレビュー機能付き
- ✅ カテゴリ管理（追加・編集・削除）
  - カテゴリごとのダウンロードURL設定
- ✅ タグ管理（追加・削除）
- ✅ 複数タグの一括選択

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

## 🚀 本番デプロイ（Cloudflare Pages）

### ステップ1: Cloudflare APIキーの設定

1. 左サイドバーの「Deploy」タブを開く
2. Cloudflare APIトークンを作成してコピー
3. APIキーを入力して保存

### ステップ2: データベースとバケットの作成

```bash
# D1データベース作成
npx wrangler d1 create akagami-research-production

# 出力されたdatabase_idをメモしてwrangler.jsonに設定
```

### ステップ3: wrangler.jsonc更新

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "akagami-research",
  "compatibility_date": "2026-01-11",
  "pages_build_output_dir": "./dist",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "akagami-research-production",
      "database_id": "YOUR_DATABASE_ID_HERE"
    }
  ]
}
```

### ステップ4: マイグレーション適用

```bash
# 本番データベースにマイグレーション適用
npx wrangler d1 migrations apply akagami-research-production
```

### ステップ5: デプロイ

```bash
# ビルド
npm run build

# プロジェクト作成（初回のみ）
npx wrangler pages project create akagami-research --production-branch main

# デプロイ
npx wrangler pages deploy dist --project-name akagami-research
```

### デプロイ後のURL

デプロイ成功後、以下のようなURLが表示されます：
- `https://akagami-research.pages.dev`

## 📝 使い方

### 一括アップロード（推奨）

1. `/admin`にアクセス（パスワード: `admin123`）
2. 「一括アップロード」ボタンをクリック
3. カテゴリを選択
4. ExcelやGoogleスプレッドシートで以下の2列を準備：
   - A列：タイトル（例：`Instagram運用ガイド.pdf`）
   - B列：GoogleドライブURL
5. 2列を選択してコピー（Ctrl+C / Cmd+C）
6. テキストエリアに貼り付け（Ctrl+V / Cmd+V）
7. 「プレビュー」で確認（オプション）
8. 「一括登録」ボタンで保存

### カテゴリ一括ダウンロードURLの設定

1. 管理画面の「カテゴリ管理」をクリック
2. 各カテゴリの「編集」ボタンをクリック
3. 「一括ダウンロードURL」に GoogleドライブフォルダのURLを入力
4. 保存すると、そのカテゴリページで「カテゴリ内のファイルを全ダウンロード」ボタンが表示される

### Googleドライブの共有設定

PDFを公開ページで開けるようにするには：

1. GoogleドライブでPDFファイルを右クリック
2. 「共有」→「リンクを知っている全員」に変更
3. URLをコピーして管理画面に貼り付け

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
│   ├── 0001_initial_schema.sql      # データベーススキーマ
│   └── 0002_add_category_download_url.sql  # ダウンロードURL追加
├── seed.sql               # 初期データ（11カテゴリ）
├── ecosystem.config.cjs   # PM2設定（開発用）
├── wrangler.jsonc         # Cloudflare設定
└── package.json           # 依存関係とスクリプト
```

## 🔧 ローカル開発

```bash
# セットアップ
npm install

# データベースマイグレーション（ローカル）
npm run db:migrate:local

# シードデータ投入
npm run db:seed

# ビルド
npm run build

# PM2で起動
pm2 start ecosystem.config.cjs

# テスト
curl http://localhost:3000
```

## 📄 ライセンス

MIT License

## 🙏 最後に

Akagami Researchへようこそ！

このシステムで、SNSマーケティングや生成AI関連のPDF資料を効率的に管理できます。

- 11種類のカテゴリで整理
- タグで詳細な分類
- 美しいUIで快適な閲覧体験
- 一括アップロードで簡単登録

何か質問や改善提案があれば、お気軽にお知らせください！
