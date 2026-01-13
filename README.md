# Akagami Research

PDF資料をGoogleドライブのリンクで管理できる、シンプルで美しいデザインの資料管理システムです。

**🎉 新機能: Google Analytics アクセス解析統合済み！**

## 🎯 プロジェクト概要

- **サイト名**: Akagami Research
- **目的**: SNSマーケティング・生成AI関連のPDF資料を整理して管理
- **デザイン**: 白と赤（#e75556）の2色デザイン
- **技術スタック**: Hono + TypeScript + Cloudflare D1 + TailwindCSS + Google Analytics

## 📊 Google Analytics 統合

### 測定ID
- **測定ID**: G-JPMZ82RMGG
- **ストリーム名**: Akagami Research Web
- **ストリーム URL**: https://akagami.net/

### トラッキング機能
以下のユーザーアクションが自動的にGoogle Analyticsで追跡されます：

1. **ページビュー**: 全ページの閲覧が自動追跡
2. **PDFダウンロード**: PDF閲覧時に `pdf_download` イベントを送信
3. **カテゴリフィルター**: カテゴリ選択時に `filter_category` イベントを送信
4. **タグフィルター**: タグ追加/削除時に `filter_tag_add`/`filter_tag_remove` イベントを送信
5. **検索**: 検索実行時に `search` イベントを送信
6. **お気に入り**: お気に入り追加/削除時に `favorite_add`/`favorite_remove` イベントを送信
7. **シェア**: PDFシェア時に `share` イベントを送信

### アクセス解析ダッシュボード
管理画面に新しく「アクセス解析」ボタンを追加しました：
- **総PDF数、総ダウンロード数、カテゴリ数、タグ数**の概要統計
- **人気PDF トップ10**のランキング
- **カテゴリ別統計**とダウンロード数の可視化
- **Google Analyticsダッシュボード**への直接リンク

リアルタイムのアクセス解析は [Google Analyticsダッシュボード](https://analytics.google.com/analytics/web/#/p13287130556/reports/intelligenthome) で確認できます。

## 🎨 カラーパレット

- **Primary**: #e75556 - メインの赤色
- **White**: #ffffff - 背景色
- **Beige**: #f4eee0 - アクセント用ベージュ

## 🌐 公開URL

- **本番環境（公開URL）**: https://akagami-research.pages.dev
- **最新デプロイ**: https://6d8f7820.akagami-research.pages.dev
- **開発環境（Sandbox）**: https://3000-iwpfj0eebl4qd7e2klphb-5c13a017.sandbox.novita.ai
- **公開ページ**: `/` - PDF一覧・検索・閲覧
- **管理画面**: `/admin` - PDF登録・編集・削除（**完全ダークモード・コンパクトデザイン**）
  - **パスワード**: `TaylorAlisonSwift`
  - **セッション**: JWTトークンでログイン状態を30日間保持
  - **自動ログイン**: 一度ログインすると、再度パスワード入力不要
  - **PC版**: 右下に目立たない管理画面リンクあり

## 🎨 デザイン改善（最新）

### 公開ページ
- ✅ **ヘッダー高さを半分に調整** - より多くのコンテンツが表示可能
- ✅ **フォントをスマートに調整** - PC版で洗練された印象（font-weight最適化）
- ✅ **管理画面リンク** - PC版右下に目立たないリンクを配置

### 管理画面
- ✅ **コンパクトなUI** - スクロールなしで8件以上のPDFカードを表示
- ✅ **HTMLコメント修正** - タグ表示の問題を解決
- ✅ **文字サイズ最適化** - ヘッダー、ボタン、カードすべてをコンパクト化

## ✨ 完成済み機能

### Google Analytics アクセス解析（NEW！）
- ✅ **Google Analytics GA4 統合**（測定ID: G-JPMZ82RMGG）
- ✅ **カスタムイベントトラッキング**
  - PDFダウンロード、カテゴリ/タグフィルター、検索、お気に入り、シェア
- ✅ **管理画面アクセス解析ダッシュボード**
  - 総PDF数、総ダウンロード数、カテゴリ数、タグ数の統計
  - 人気PDF トップ10ランキング
  - カテゴリ別ダウンロード統計の可視化
  - Google Analyticsダッシュボードへの直接リンク

### 公開ページ（`/`）
- ✅ シンプルで美しい2色デザイン
- ✅ **ダークモード対応**（フッター上・ハンバーガーメニューから切り替え可能）
- ✅ カテゴリでフィルタリング（11カテゴリ、PDF数の多い順に自動ソート）
- ✅ タグでフィルタリング（複数選択可）
- ✅ キーワード検索（モバイル：ページ上部、デスクトップ：サイドバー）
- ✅ ソート機能（新着順・古い順・人気順）
- ✅ **表示切り替え機能（PC版のみ）**
  - グリッド表示：カード型レイアウト（3列）
  - リスト表示：横長カードレイアウト（1列）
  - LocalStorageで設定を永続化
- ✅ お気に入り機能（ハートボタン）
  - PC版：「❤️ お気に入り」と表示
  - スマホ版：「❤️」のみ表示
- ✅ **ダウンロード履歴機能**
  - ハンバーガーメニューの薄いピンク色のボタン
  - 過去にダウンロードしたPDFのみを一覧表示
  - ダウンロード件数を表示
- ✅ **スマホ版の最適化**
  - トップページで最初に15個のカードのみ表示
  - 「もっと見る」ボタンで全件表示
  - カード下にダウンロード履歴ボタンを配置（トップページのみ）
  - **カード下にタグ一覧を表示（全ページ）**
  - カテゴリページ・ダウンロード履歴ページでもタグフィルタリング可能
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
- ✅ **ダークモード完全対応**
  - 視認性の高いダークテーマ
  - 明るいテキスト（#f3f4f6）で完璧な可読性
  - すべてのUI要素が最適化
- ✅ **アクセス解析ダッシュボード（NEW！）**
  - 総PDF数、総ダウンロード数などの概要統計
  - 人気PDF トップ10ランキング表示
  - カテゴリ別統計とダウンロード数の可視化
  - Google Analyticsへの直接リンク
- ✅ JWTベースの認証システム
  - ✅ ログイン機能（パスワード認証）
  - ✅ 30日間のセッション永続化（自動ログイン）
  - ✅ クッキーベースのトークン保存
  - ✅ ログアウト機能
- ✅ エレガントなログイン画面
- ✅ PDF登録・編集・削除（認証必須）
- ✅ 一括アップロード機能（コピペ対応）
  - ExcelやGoogleスプレッドシートから直接貼り付け
  - タブ区切りで一度に大量登録
  - プレビュー機能付き
- ✅ カテゴリ管理（追加・編集・削除）
  - カテゴリごとのダウンロードURL設定
- ✅ タグ管理（追加・削除）
- ✅ **除外タグ管理**
  - 指定した単語の自動生成を防止
  - タグ削除時に自動的に除外リストに追加
  - デフォルト除外: ツール、戦略、活用、運用、ガイド、入門、初心者
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

### ステップ5: 環境変数の設定

**本番環境では、セキュリティのため環境変数を設定してください:**

```bash
# JWT Secret（ランダムな強固な文字列に変更）
npx wrangler pages secret put JWT_SECRET --project-name akagami-research
# 入力例: your-super-secret-jwt-key-CHANGE-THIS-TO-RANDOM-STRING

# 管理画面パスワード（デフォルトから変更）
npx wrangler pages secret put ADMIN_PASSWORD --project-name akagami-research
# 入力例: your-secure-admin-password
```

### ステップ6: デプロイ

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

### ダウンロード履歴の確認

1. サイドバー（ハンバーガーメニュー）の一番下にある「ダウンロード履歴」ボタンをクリック
2. 過去にダウンロードしたPDFのみが一覧で表示されます
3. ダウンロード件数も確認できます
4. 他のフィルターを使うと、ダウンロード履歴モードは自動的に解除されます

### 除外タグの管理

1. 管理画面の「除外タグ管理」ボタンをクリック
2. 自動生成したくない単語を入力して「除外リストに追加」
3. 除外したタグは、今後PDFタイトルから自動生成されなくなります
4. タグ管理で削除したタグは、自動的に除外リストに追加されます

**デフォルトで除外される単語:**
- ツール
- 戦略
- 活用
- 運用
- ガイド
- 入門
- 初心者

### 一括アップロード（推奨）

1. `/admin`にアクセス
2. 初回アクセス時はログインが必要：
   - **パスワード**: `admin123`（本番環境では変更してください）
   - 一度ログインすると30日間自動ログイン
3. 「一括アップロード」ボタンをクリック
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
│   ├── auth.ts            # JWT認証ヘルパー関数
│   └── renderer.tsx       # HTMLレンダラー
├── public/
│   └── static/
│       ├── app.js         # 公開ページのJavaScript
│       ├── admin.js       # 管理画面のJavaScript
│       └── style.css      # カスタムCSS
├── migrations/
│   ├── 0001_initial_schema.sql                # データベーススキーマ
│   ├── 0002_add_category_download_url.sql     # ダウンロードURL追加
│   └── 0003_add_excluded_tags.sql             # 除外タグテーブル追加
├── seed.sql               # 初期データ（11カテゴリ）
├── .dev.vars              # ローカル環境変数（JWT_SECRET, ADMIN_PASSWORD）
├── ecosystem.config.cjs   # PM2設定（開発用）
├── wrangler.jsonc         # Cloudflare設定
└── package.json           # 依存関係とスクリプト
```

## 🔧 ローカル開発

```bash
# セットアップ
npm install

# 環境変数ファイルの確認
# .dev.vars ファイルにJWT_SECRETとADMIN_PASSWORDが設定されています
# デフォルト: JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
#            ADMIN_PASSWORD=admin123

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

# 管理画面にアクセス
# http://localhost:3000/admin
# パスワード: admin123（.dev.varsで変更可能）
```

## 🔐 セキュリティ設定

### 本番環境での環境変数設定

`.dev.vars`ファイルは開発環境専用です。本番環境では以下のコマンドで設定してください：

```bash
# JWT Secret（ランダムな強固な文字列）
npx wrangler pages secret put JWT_SECRET --project-name akagami-research

# 管理画面パスワード（デフォルトから必ず変更）
npx wrangler pages secret put ADMIN_PASSWORD --project-name akagami-research
```

### セッション情報
- **トークン有効期限**: 30日間
- **保存場所**: HTTPクッキー（HttpOnly、SameSite=Lax）
- **ログアウト**: 管理画面右上のログアウトボタン

## 📄 ライセンス

MIT License

## 🙏 最後に

Akagami Researchへようこそ！

このシステムで、SNSマーケティングや生成AI関連のPDF資料を効率的に管理できます。

- 11種類のカテゴリで整理
- タグで詳細な分類
- 美しいUIで快適な閲覧体験
- 一括アップロードで簡単登録
- JWTベースのセキュアな認証システム
- 30日間の自動ログイン

何か質問や改善提案があれば、お気軽にお知らせください！
