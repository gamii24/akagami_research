# Akagami.net - 完全サイト構造ドキュメント

## 📋 目次
1. [プロジェクト概要](#プロジェクト概要)
2. [技術スタック](#技術スタック)
3. [ディレクトリ構造](#ディレクトリ構造)
4. [データベース設計](#データベース設計)
5. [ページ構成](#ページ構成)
6. [API エンドポイント](#apiエンドポイント)
7. [認証システム](#認証システム)
8. [メール送信システム](#メール送信システム)
9. [フロントエンド機能](#フロントエンド機能)
10. [管理画面](#管理画面)
11. [デプロイメント](#デプロイメント)

---

## プロジェクト概要

### サイト名
**Akagami.net** - SNSマーケティング・生成AI資料保管庫

### コンセプト
SNSマーケティングに関するPDF資料、ニュース、用語集、FAQ、質問検索ツールを提供するWebアプリケーション。会員登録することで、ダウンロード履歴やお気に入りをデバイス間で同期可能。

### URL
- **本番環境**: https://akagami.net
- **図解記事サイト**: https://akagami-zukai.pages.dev

---

## 技術スタック

### バックエンド
- **フレームワーク**: Hono v4 (軽量Webフレームワーク)
- **ランタイム**: Cloudflare Workers (エッジコンピューティング)
- **言語**: TypeScript
- **データベース**: Cloudflare D1 (SQLite互換)
- **認証**: JWT (hono/jwt)
- **メール送信**: Resend API

### フロントエンド
- **スタイリング**: Tailwind CSS (CDN & ビルド版併用)
- **JavaScript**: Vanilla JS (フレームワークレス)
- **アイコン**: Font Awesome 6.4.0
- **HTTP クライアント**: Axios 1.6.0

### ビルド & デプロイ
- **バンドラー**: Vite 5
- **CSS プロセッサー**: Tailwind CSS CLI
- **デプロイ**: Cloudflare Pages
- **CLI**: Wrangler 3.78.0

---

## ディレクトリ構造

```
webapp/
├── src/                          # バックエンドソースコード
│   ├── index.tsx                # メインアプリケーション (10,789行)
│   ├── auth.ts                  # 管理者認証ヘルパー
│   ├── user-auth.ts             # ユーザー認証ヘルパー
│   ├── email.ts                 # メール送信ヘルパー
│   └── renderer.tsx             # レンダリングヘルパー
│
├── public/                       # 静的ファイル
│   ├── static/                  # JavaScript & CSS
│   │   ├── app.js              # メインアプリロジック
│   │   ├── auth.js             # 認証UI
│   │   ├── mypage.js           # マイページ
│   │   ├── news.js             # ニュース表示
│   │   ├── glossary.js         # 用語集検索
│   │   ├── question-finder.js # 質問検索
│   │   ├── sns-faq.js          # FAQ
│   │   ├── admin.js            # 管理画面メイン
│   │   ├── users-admin.js      # ユーザー管理
│   │   ├── news-admin.js       # ニュース管理
│   │   ├── faq-admin.js        # FAQ管理
│   │   ├── articles-admin.js   # 記事管理
│   │   ├── announcements-admin.js # お知らせ管理
│   │   ├── utils.js            # 共通ユーティリティ
│   │   ├── input.css           # Tailwind入力
│   │   ├── output.css          # Tailwind出力
│   │   └── style.css           # カスタムCSS
│   │
│   └── manifest.json            # PWA マニフェスト
│
├── migrations/                   # D1 データベースマイグレーション
│   ├── 0001_initial_schema.sql
│   ├── 0002_*.sql
│   └── meta/
│
├── dist/                         # ビルド出力 (自動生成)
│   ├── _worker.js               # Cloudflare Worker
│   ├── _routes.json             # ルーティング定義
│   ├── _headers                 # HTTPヘッダー設定
│   └── static/                  # 静的ファイル
│
├── wrangler.jsonc               # Cloudflare設定
├── package.json                 # 依存関係
├── vite.config.ts               # Vite設定
├── tailwind.config.js           # Tailwind設定
├── tsconfig.json                # TypeScript設定
└── README.md                    # プロジェクト説明

```

---

## データベース設計

### テーブル構成

#### 1. users (ユーザー)
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT,
  login_method TEXT DEFAULT 'magic_link',  -- 'password' or 'magic_link'
  location TEXT,
  birthday TEXT,
  youtube_url TEXT,
  instagram_handle TEXT,
  tiktok_handle TEXT,
  twitter_handle TEXT,
  profile_photo_url TEXT,
  email_verified INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);
```

#### 2. categories (カテゴリ)
```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. pdfs (PDF資料)
```sql
CREATE TABLE pdfs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category_id INTEGER,
  download_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

#### 4. tags (タグ)
```sql
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. pdf_tags (PDF-タグ関連)
```sql
CREATE TABLE pdf_tags (
  pdf_id INTEGER,
  tag_id INTEGER,
  PRIMARY KEY (pdf_id, tag_id),
  FOREIGN KEY (pdf_id) REFERENCES pdfs(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);
```

#### 6. user_downloads (ダウンロード履歴)
```sql
CREATE TABLE user_downloads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  pdf_id INTEGER NOT NULL,
  downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (pdf_id) REFERENCES pdfs(id)
);
```

#### 7. user_favorites (お気に入り)
```sql
CREATE TABLE user_favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  pdf_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, pdf_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (pdf_id) REFERENCES pdfs(id)
);
```

#### 8. news (ニュース)
```sql
CREATE TABLE news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT,
  published_at DATETIME,
  summary TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 9. news_likes (ニュースいいね)
```sql
CREATE TABLE news_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  news_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(news_id, user_id),
  FOREIGN KEY (news_id) REFERENCES news(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 10. faqs (FAQ)
```sql
CREATE TABLE faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 11. magic_link_tokens (マジックリンクトークン)
```sql
CREATE TABLE magic_link_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  used INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## ページ構成

### 1. トップページ `/`
**機能**: サイトの概要とPDF資料一覧

**レイアウト**:
- ヘッダー (CommonHeader)
  - ロゴ: Akagami.net
  - 右上: ログイン/会員登録ボタン
  - ハンバーガーメニュー (モバイル)

- メインコンテンツ (3カラムレイアウト)
  - 左側 (lg:col-span-3): 
    - ヒーローセクション
      - タイトル: 「SNSマーケティング・生成AI資料保管庫」
      - 説明文
      - カテゴリフィルター
      - タグフィルター
    - PDF資料一覧
      - グリッド表示 (3カラム)
      - 各カード:
        - サムネイル画像
        - タイトル
        - 説明文
        - カテゴリバッジ
        - タグ一覧
        - ダウンロードボタン
        - いいねボタン (ログイン時)
        - ダウンロード数表示

  - 右側 (lg:col-span-1): サイドバー
    - ユーザーアカウントセクション
      - 未ログイン: ログインボタン
      - ログイン済: ユーザー名、マイページリンク、ログアウト
    - ナビゲーションリンク:
      1. 図解記事 (外部リンク)
      2. 資料一覧
      3. 最新ニュース
      4. キーワードチェック
      5. SNSの疑問
      6. 用語集
      7. SNS運用カレンダー

- フッター (CommonFooter)
  - コピーライト
  - リンク集

**データフロー**:
```
ページ読み込み
  ↓
app.js 初期化
  ↓
/api/categories → カテゴリ一覧取得
  ↓
/api/tags → タグ一覧取得
  ↓
/api/pdfs → PDF一覧取得
  ↓
レンダリング
```

### 2. ニュースページ `/news`
**機能**: SNS・AI・技術ニュースの一覧表示

**レイアウト**:
- CommonHeader
- メインコンテンツ (2カラム)
  - 左側: ニュース一覧
    - 各ニュースカード:
      - カテゴリバッジ
      - 公開日
      - タイトル
      - 概要
      - いいねボタン
      - いいね数
  - 右側: CommonSidebar

**データフロー**:
```
ページ読み込み
  ↓
news.js 初期化
  ↓
/api/user/me → 認証確認
  ↓
/api/news-with-likes → ニュース一覧（いいね状態含む）
  ↓
レンダリング
```

**API**:
- `GET /api/news-with-likes` - ニュース一覧取得（いいね状態付き）
- `POST /api/news/:newsId/like` - いいね切り替え

### 3. 用語集ページ `/glossary`
**機能**: SNSマーケティング用語の検索可能な辞書

**レイアウト**:
- CommonHeader
- メインコンテンツ (2カラム)
  - 左側: 用語集
    - 検索ボックス
      - リアルタイム検索
      - 検索結果数表示
    - あいうえお順セクション
      - あ行、か行、さ行、た行、な行
      - は行、ま行、や行、ら行、わ行
      - アルファベット
    - 各用語:
      - 見出し (太字)
      - 説明文
  - 右側: CommonSidebar

**機能詳細**:
- 検索機能: glossary.js
  - 入力と同時にフィルタリング
  - 用語タイトルと説明文の両方を検索
  - 大文字小文字を区別しない
  - 検索結果数をリアルタイム表示

**データ**: 静的コンテンツ（HTML内に埋め込み）

### 4. キーワードチェック `/question-finder`
**機能**: Instagram質問キーワード検索ツール

**レイアウト**:
- CommonHeader
- メインコンテンツ (2カラム)
  - 左側: 検索フォーム
    - キーワード入力
    - 検索ボタン
    - 検索結果一覧
      - マッチした質問文
      - ハイライト表示
  - 右側: CommonSidebar

**アクセス制限**: 会員限定（ログイン必須）

**データ**: 静的JSONファイル（Instagram質問データ）

### 5. SNSの疑問 `/sns-faq`
**機能**: SNSマーケティングFAQ

**レイアウト**:
- CommonHeader
- メインコンテンツ (2カラム)
  - 左側: FAQ一覧
    - カテゴリフィルター
    - アコーディオン形式
      - 質問 (クリックで展開)
      - 回答
  - 右側: CommonSidebar

**アクセス制限**: 会員限定

**データフロー**:
```
ページ読み込み
  ↓
sns-faq.js 初期化
  ↓
/api/faqs → FAQ一覧取得
  ↓
レンダリング
```

### 6. SNS運用カレンダー `/calendar/:month`
**機能**: 月別SNS運用カレンダー

**URL パラメータ**: `:month` (1-12)

**レイアウト**:
- CommonHeader
- メインコンテンツ (全幅)
  - カレンダーヘッダー
    - 月ナビゲーション (前月・次月)
    - 月表示
  - カレンダーグリッド
    - 7列 (日〜土)
    - 各日付セル:
      - 日付
      - イベント/記念日
      - SNS投稿アイデア
- CommonFooter

**データ**: 静的コンテンツ（index.tsx内に埋め込み）

### 7. マイページ `/mypage`
**機能**: ユーザーの個人ページ

**レイアウト**:
- CommonHeader
- メインコンテンツ (2カラム)
  - 左側: 
    - プロフィールセクション
      - プロフィール写真
      - 名前
      - メールアドレス
      - 居住地
      - 誕生日
      - SNSリンク
      - 編集ボタン
    - ダウンロード履歴
      - 最近ダウンロードしたPDF一覧
    - お気に入り
      - お気に入りPDF一覧
  - 右側: CommonSidebar

**API**:
- `GET /api/user/me` - ユーザー情報取得
- `PUT /api/user/profile` - プロフィール更新
- `GET /api/user/downloads` - ダウンロード履歴
- `GET /api/user/favorites` - お気に入り一覧

### 8. 管理画面 `/admin`
**機能**: サイト管理ダッシュボード

**アクセス制限**: 管理者のみ（パスワード認証）

**レイアウト**:
- ダークモード UI
- サイドバーメニュー:
  1. ダッシュボード
  2. PDF管理
  3. カテゴリ管理
  4. タグ管理
  5. ニュース管理
  6. FAQ管理
  7. 記事管理
  8. お知らせ管理
  9. ユーザー管理
  10. アナリティクス

**メインコンテンツ**: 
- 統計カード
  - 総PDF数
  - 総ダウンロード数
  - 総ユーザー数
  - 今週の新規ユーザー
- 最近のアクティビティ
- グラフ表示

### 9. ユーザー管理 `/admin/users`
**機能**: 登録ユーザーの一覧・検索・フィルタリング

**レイアウト**:
- ダークモード UI
- ヘッダー: 総登録者数
- 検索・ソート
  - 検索ボックス（名前・メール・居住地）
  - ソート: 会員番号/名前/メール/誕生日/居住地/登録日
  - 昇順・降順切り替え
- 誕生日フィルター
  - 月で絞り込み
  - 日で絞り込み
  - 該当者数表示
- ユーザー一覧テーブル
  - 会員番号
  - 名前
  - メールアドレス
  - 誕生日
  - 居住地
  - 登録日
  - 認証状態

**API**:
- `GET /api/admin/users` - ユーザー一覧取得

---

## API エンドポイント

### 認証関連

#### `POST /api/user/register`
**説明**: 新規ユーザー登録

**リクエスト**:
```json
{
  "email": "user@example.com",
  "name": "山田太郎",
  "password": "password123",  // オプション
  "usePasswordless": false    // true: マジックリンク, false: パスワード
}
```

**レスポンス**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "山田太郎",
    "loginMethod": "password"
  }
}
```

**処理フロー**:
1. メールアドレスのバリデーション
2. 既存ユーザーチェック
3. パスワードハッシュ化（パスワード認証の場合）
4. DBにユーザー作成
5. ウェルカムメール送信
6. JWTトークン生成
7. Cookie設定

#### `POST /api/user/login`
**説明**: パスワード認証ログイン

**リクエスト**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "山田太郎",
    "loginMethod": "password"
  }
}
```

#### `POST /api/user/send-magic-link`
**説明**: マジックリンク送信

**リクエスト**:
```json
{
  "email": "user@example.com"
}
```

**レスポンス**:
```json
{
  "success": true,
  "message": "Magic link has been sent to your email."
}
```

**処理フロー**:
1. ユーザー存在確認
2. トークン生成（32バイトランダム）
3. トークンをDB保存（有効期限15分）
4. マジックリンクメール送信
5. URL: `https://akagami.net/auth/magic-link?token=xxx`

#### `GET /api/user/verify-magic-link?token=xxx`
**説明**: マジックリンクトークン検証

**処理フロー**:
1. トークン存在確認
2. 使用済みチェック
3. 有効期限チェック
4. トークンを使用済みにマーク
5. JWTトークン生成
6. Cookie設定
7. トップページにリダイレクト

#### `POST /api/user/logout`
**説明**: ログアウト

**レスポンス**:
```json
{
  "success": true
}
```

#### `GET /api/user/me`
**説明**: 現在のユーザー情報取得

**レスポンス**:
```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "山田太郎",
    "location": "東京都",
    "birthday": "1990-01-01",
    "loginMethod": "password",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "lastLogin": "2026-02-15T00:00:00.000Z",
    "youtubeUrl": "https://youtube.com/@user",
    "instagramHandle": "@user",
    "tiktokHandle": "@user",
    "twitterHandle": "@user",
    "profilePhotoUrl": "https://..."
  }
}
```

### PDF管理

#### `GET /api/pdfs`
**説明**: PDF一覧取得

**クエリパラメータ**:
- `category` (オプション): カテゴリID
- `tag` (オプション): タグID
- `limit` (オプション): 取得件数
- `offset` (オプション): オフセット

**レスポンス**:
```json
{
  "results": [
    {
      "id": 1,
      "title": "Instagram運用ガイド",
      "description": "Instagramの基本的な運用方法",
      "file_url": "https://...",
      "thumbnail_url": "https://...",
      "category_id": 1,
      "category_name": "Instagram",
      "download_count": 150,
      "created_at": "2026-01-01T00:00:00.000Z",
      "tags": ["運用", "基礎"]
    }
  ]
}
```

#### `GET /api/pdfs/:id`
**説明**: 個別PDF情報取得

#### `POST /api/pdfs/:id/download`
**説明**: PDFダウンロード記録

**認証**: 必須

**処理フロー**:
1. ダウンロード数をインクリメント
2. user_downloadsテーブルに記録

#### `POST /api/pdfs/:id/favorite`
**説明**: お気に入り切り替え

**認証**: 必須

**レスポンス**:
```json
{
  "favorited": true  // または false
}
```

### カテゴリ・タグ

#### `GET /api/categories`
**説明**: カテゴリ一覧取得

**レスポンス**:
```json
{
  "results": [
    {
      "id": 1,
      "name": "Instagram",
      "description": "Instagram関連資料",
      "sort_order": 1
    }
  ]
}
```

#### `GET /api/tags`
**説明**: タグ一覧取得

### ニュース

#### `GET /api/news`
**説明**: ニュース一覧取得

**レスポンス**:
```json
{
  "results": [
    {
      "id": 1,
      "title": "Instagram新機能リリース",
      "url": "https://...",
      "category": "Instagram",
      "published_at": "2026-02-15T00:00:00.000Z",
      "summary": "新しいリール機能が追加されました",
      "created_at": "2026-02-15T00:00:00.000Z"
    }
  ]
}
```

#### `GET /api/news-with-likes`
**説明**: ニュース一覧（いいね状態付き）

**認証**: 必須

**レスポンス**:
```json
{
  "results": [
    {
      "id": 1,
      "title": "Instagram新機能リリース",
      "url": "https://...",
      "category": "Instagram",
      "published_at": "2026-02-15T00:00:00.000Z",
      "summary": "新しいリール機能が追加されました",
      "likes_count": 25,
      "user_liked": 1  // 0 or 1
    }
  ]
}
```

#### `POST /api/news/:newsId/like`
**説明**: ニュースいいね切り替え

**認証**: 必須

**レスポンス**:
```json
{
  "liked": true,  // または false
  "likes_count": 26
}
```

### FAQ

#### `GET /api/faqs`
**説明**: FAQ一覧取得

**レスポンス**:
```json
{
  "results": [
    {
      "id": 1,
      "question": "Instagramのリーチを増やすには？",
      "answer": "定期的な投稿とハッシュタグの活用が重要です...",
      "category": "Instagram",
      "sort_order": 1
    }
  ]
}
```

### ユーザーデータ

#### `GET /api/user/downloads`
**説明**: ダウンロード履歴取得

**認証**: 必須

**レスポンス**:
```json
{
  "results": [
    {
      "id": 1,
      "pdf_id": 1,
      "pdf_title": "Instagram運用ガイド",
      "downloaded_at": "2026-02-15T00:00:00.000Z"
    }
  ]
}
```

#### `GET /api/user/favorites`
**説明**: お気に入り一覧取得

**認証**: 必須

#### `PUT /api/user/profile`
**説明**: プロフィール更新

**認証**: 必須

**リクエスト**:
```json
{
  "name": "山田太郎",
  "location": "東京都",
  "birthday": "1990-01-01",
  "youtubeUrl": "https://youtube.com/@user",
  "instagramHandle": "@user",
  "tiktokHandle": "@user",
  "twitterHandle": "@user"
}
```

### 管理画面API

#### `GET /api/analytics/overview`
**説明**: ダッシュボード統計

**認証**: 管理者

**レスポンス**:
```json
{
  "totalPdfs": 100,
  "totalDownloads": 5000,
  "totalCategories": 10,
  "totalTags": 50,
  "recentPdfs": 5,
  "totalUsers": 134,
  "weeklyNewUsers": 12
}
```

#### `GET /api/analytics/pdfs`
**説明**: PDF統計

**認証**: 管理者

#### `GET /api/analytics/categories`
**説明**: カテゴリ統計

**認証**: 管理者

#### `GET /api/admin/users`
**説明**: ユーザー一覧（詳細情報付き）

**認証**: 管理者

**レスポンス**:
```json
{
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "name": "山田太郎",
      "location": "東京都",
      "birthday": "1990-01-01",
      "login_method": "password",
      "created_at": "2026-01-01T00:00:00.000Z",
      "last_login": "2026-02-15T00:00:00.000Z",
      "email_verified": 1
    }
  ]
}
```

---

## 認証システム

### ユーザー認証フロー

#### 1. パスワード認証
```
ユーザー入力
  ↓
フロントエンド (auth.js)
  ↓
POST /api/user/login
  ↓
パスワード検証 (SHA-256ハッシュ)
  ↓
JWT トークン生成 (30日有効)
  ↓
Cookie 設定 (user_token)
  - httpOnly: true
  - secure: true (HTTPS)
  - sameSite: Lax
  - maxAge: 30日
  ↓
ログイン成功
  ↓
checkAuthStatus()
  ↓
ページリロード or リダイレクト
```

#### 2. マジックリンク認証
```
ユーザーがメール入力
  ↓
POST /api/user/send-magic-link
  ↓
トークン生成 (32バイトランダム)
  ↓
DB保存 (有効期限15分)
  ↓
Resend API経由でメール送信
  ↓
ユーザーがメール受信
  ↓
リンククリック
  ↓
GET /api/user/verify-magic-link?token=xxx
  ↓
トークン検証
  - 存在確認
  - 使用済みチェック
  - 有効期限チェック
  ↓
トークンを使用済みにマーク
  ↓
JWT トークン生成
  ↓
Cookie 設定
  ↓
トップページにリダイレクト
```

#### 3. セッション管理
```
各リクエスト
  ↓
Cookie から user_token 取得
  ↓
JWT 検証
  ↓
ペイロードから userId 取得
  ↓
DB からユーザー情報取得
  ↓
コンテキストに userId を設定
  ↓
ルートハンドラー実行
```

### 管理者認証

```
/admin アクセス
  ↓
パスワードプロンプト表示
  ↓
POST /api/admin/login
  ↓
環境変数 ADMIN_PASSWORD と比較
  ↓
JWT トークン生成
  ↓
Cookie 設定 (admin_token)
  ↓
管理画面表示
```

**ミドルウェア**: `requireAuth`
- すべての管理画面APIで使用
- Cookie から admin_token 検証
- 未認証の場合 401 エラー

---

## メール送信システム

### Resend API統合

#### 設定
- **APIキー**: 環境変数 `RESEND_API_KEY`
- **送信元**: `onboarding@resend.dev` (暫定) → `noreply@akagami.net` (ドメイン認証後)

#### メールテンプレート

##### 1. ウェルカムメール
**送信タイミング**: 新規登録時

**件名**: Akagami.net へようこそ！

**内容**:
- ヘッダー: 「Akagami.net へようこそ！」
- 本文:
  - 登録完了メッセージ
  - 利用可能機能の紹介
    - デバイス間同期
    - 新着資料メール通知
    - カスタマイズされた資料管理
  - サイトリンク
- フッター: コピーライト

##### 2. マジックリンクメール
**送信タイミング**: マジックリンク要求時

**件名**: Akagami.net ログインリンク

**内容**:
- ヘッダー: 「🔐 ログインリンク」
- 本文:
  - 挨拶
  - ログインボタン（マジックリンク）
  - セキュリティ注意事項:
    - 15分間有効
    - 1回のみ使用可能
    - 他人と共有しないこと
- フッター: コピーライト

##### 3. 新着資料通知メール
**送信タイミング**: お気に入りカテゴリに新着資料追加時

**件名**: 📚 新しい資料が追加されました

**内容**:
- ヘッダー: 「📚 新しい資料が追加されました」
- 本文:
  - カテゴリバッジ
  - 資料タイトル
  - ダウンロードボタン
  - 通知設定変更リンク
- フッター: コピーライト

##### 4. 管理者向け新規登録通知
**送信タイミング**: 新規ユーザー登録時（日次バッチ）

**件名**: 🎉 新規会員登録通知

**内容**:
- ヘッダー: 「🎉 新規会員登録通知」
- 本文:
  - 会員情報カード:
    - 会員番号
    - 名前
    - メールアドレス
    - 登録日時
  - 管理画面リンク
- フッター: コピーライト

---

## フロントエンド機能

### 共通コンポーネント

#### CommonHeader
**位置**: すべてのページ

**構成**:
- ロゴ: Akagami.net (クリックでトップページ)
- ハンバーガーメニュー (モバイル)
- ログイン/会員登録ボタン (未認証時)
- ユーザーメニュー (認証時)

#### CommonSidebar
**位置**: ほとんどのページの右側

**構成**:
1. ユーザーアカウントセクション
   - 未認証: ログインボタン
   - 認証済: ユーザー名、マイページリンク、ログアウト

2. ナビゲーションリンク:
   - 図解記事 (ピンク、外部リンク)
   - 資料一覧 (インディゴ)
   - 最新ニュース (イエロー)
   - キーワードチェック (ブルー)
   - SNSの疑問 (パープル)
   - 用語集 (アンバー)
   - SNS運用カレンダー (ピンク)

#### CommonFooter
**位置**: すべてのページ

**構成**:
- コピーライト: © 2026 Akagami.net. All rights reserved.

### 認証モーダル (auth.js)

**トリガー**: 
- ログインボタンクリック
- 会員限定ページアクセス

**モード**:
1. **ログイン**
   - パスワード認証
     - メールアドレス入力
     - パスワード入力
     - ログインボタン
   - マジックリンク
     - メールアドレス入力
     - 送信ボタン

2. **会員登録**
   - メールアドレス入力
   - 名前入力（オプション）
   - 認証方法選択:
     - パスワードレス（マジックリンク）
     - パスワード設定

**状態管理**:
```javascript
window.authState = {
  isAuthenticated: false,
  user: null
}
```

**関数**:
- `openAuthModal(mode)` - モーダルを開く
- `closeAuthModal()` - モーダルを閉じる
- `switchAuthMode(mode)` - モード切り替え
- `handleLogin()` - ログイン処理
- `handleRegister()` - 登録処理
- `handleMagicLink()` - マジックリンク送信
- `checkAuthStatus()` - 認証状態確認
- `updateAuthUI()` - UI更新

### PDF資料管理 (app.js)

**状態管理**:
```javascript
const state = {
  categories: [],
  tags: [],
  pdfs: [],
  selectedCategory: null,
  selectedTags: [],
  isAuthenticated: false,
  user: null,
  userDownloads: [],
  userFavorites: []
}
```

**フィルタリング**:
```javascript
function filterPdfs() {
  let filtered = state.pdfs
  
  // カテゴリフィルター
  if (state.selectedCategory) {
    filtered = filtered.filter(pdf => 
      pdf.category_id === state.selectedCategory
    )
  }
  
  // タグフィルター
  if (state.selectedTags.length > 0) {
    filtered = filtered.filter(pdf =>
      state.selectedTags.every(tag =>
        pdf.tags.includes(tag)
      )
    )
  }
  
  return filtered
}
```

**ダウンロード処理**:
```javascript
async function handleDownload(pdfId) {
  // ダウンロード記録
  if (state.isAuthenticated) {
    await fetch(`/api/pdfs/${pdfId}/download`, {
      method: 'POST',
      credentials: 'include'
    })
  }
  
  // ファイルダウンロード
  const pdf = state.pdfs.find(p => p.id === pdfId)
  window.open(pdf.file_url, '_blank')
}
```

**お気に入り処理**:
```javascript
async function toggleFavorite(pdfId) {
  if (!state.isAuthenticated) {
    openAuthModal('login')
    return
  }
  
  const response = await fetch(`/api/pdfs/${pdfId}/favorite`, {
    method: 'POST',
    credentials: 'include'
  })
  
  const data = await response.json()
  
  // 状態更新
  if (data.favorited) {
    state.userFavorites.push(pdfId)
  } else {
    state.userFavorites = state.userFavorites.filter(id => id !== pdfId)
  }
  
  renderPdfs()
}
```

### ニュース機能 (news.js)

**状態管理**:
```javascript
const newsState = {
  news: [],
  filteredNews: [],
  isAuthenticated: false
}
```

**いいね処理**:
```javascript
async function toggleLike(newsId, index) {
  if (!isAuthenticated) {
    showToast('いいねするにはログインが必要です', 'error')
    return
  }
  
  const response = await fetch(`/api/news/${newsId}/like`, {
    method: 'POST',
    credentials: 'include'
  })
  
  const data = await response.json()
  
  // ローカル状態更新
  newsState.news[index].user_liked = data.liked ? 1 : 0
  newsState.news[index].likes_count = data.likes_count
  
  // 再レンダリング
  renderNews()
  
  // トースト表示
  showToast(data.liked ? 'いいねしました！' : 'いいねを取り消しました', 'success')
}
```

### 用語集検索 (glossary.js)

**初期化**:
```javascript
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('glossary-search')
  const totalTermsSpan = document.getElementById('total-terms')
  const allTerms = document.querySelectorAll('.border-l-4.border-primary')
  
  // 総用語数表示
  totalTermsSpan.textContent = '全' + allTerms.length + '語'
  
  // 検索イベントリスナー
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim()
    let visibleCount = 0
    
    allTerms.forEach(function(termDiv) {
      const termTitle = termDiv.querySelector('h4')
      const termContent = termDiv.querySelector('p')
      
      if (termTitle && termContent) {
        const titleText = termTitle.textContent.toLowerCase()
        const contentText = termContent.textContent.toLowerCase()
        
        if (titleText.includes(searchTerm) || contentText.includes(searchTerm)) {
          termDiv.style.display = 'block'
          visibleCount++
        } else {
          termDiv.style.display = 'none'
        }
      }
    })
    
    // 検索結果表示
    if (searchTerm) {
      totalTermsSpan.textContent = visibleCount + '件の検索結果（全' + allTerms.length + '語）'
    } else {
      totalTermsSpan.textContent = '全' + allTerms.length + '語'
    }
  })
})
```

### キーワードチェック (question-finder.js)

**検索処理**:
```javascript
async function searchQuestions(keyword) {
  if (!keyword.trim()) {
    showToast('キーワードを入力してください', 'error')
    return
  }
  
  // ローカルJSONから検索
  const questions = await loadQuestionsData()
  
  const results = questions.filter(q =>
    q.text.toLowerCase().includes(keyword.toLowerCase())
  )
  
  // ハイライト表示
  const highlighted = results.map(q => ({
    ...q,
    highlighted: q.text.replace(
      new RegExp(keyword, 'gi'),
      match => `<mark class="bg-yellow-200">${match}</mark>`
    )
  }))
  
  renderResults(highlighted)
}
```

---

## 管理画面

### ダークモードテーマ

**カラースキーム**:
```css
:root {
  --bg-darker: #1a1a1a;
  --bg-dark: #2d2d2d;
  --bg-card: #333333;
  --border-color: #404040;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --text-muted: #999999;
  --primary: #e75556;
}
```

### PDF管理画面

**機能**:
- PDF一覧表示
- 新規PDF追加
  - タイトル入力
  - 説明文入力
  - ファイルURL入力
  - サムネイルURL入力
  - カテゴリ選択
  - タグ選択（複数）
- PDF編集
- PDF削除
- ダウンロード数表示

**バリデーション**:
- タイトル必須
- ファイルURL必須
- URL形式チェック

### ニュース管理画面

**機能**:
- ニュース一覧表示
- 新規ニュース追加
  - タイトル入力
  - URL入力
  - カテゴリ選択
  - 公開日選択
  - 概要入力
- ニュース編集
- ニュース削除
- いいね数表示

### FAQ管理画面

**機能**:
- FAQ一覧表示（アコーディオン）
- 新規FAQ追加
  - 質問入力
  - 回答入力（リッチテキスト）
  - カテゴリ選択
  - 並び順設定
- FAQ編集
- FAQ削除
- ドラッグ&ドロップ並び替え

### ユーザー管理画面

**機能**:
- ユーザー一覧表示（テーブル）
- 検索
  - 名前
  - メールアドレス
  - 居住地
- ソート
  - 会員番号
  - 名前
  - メール
  - 誕生日
  - 居住地
  - 登録日
- 誕生日フィルター
  - 月で絞り込み（1-12月）
  - 日で絞り込み（1-31日）
  - 該当者数リアルタイム表示
- ユーザー詳細表示
  - 基本情報
  - SNSリンク
  - 登録日時
  - 最終ログイン
  - 認証状態

**テーブルカラム**:
1. 会員番号
2. 名前
3. メールアドレス
4. 誕生日
5. 居住地
6. 登録日
7. 認証状態（認証済み/未認証）

---

## デプロイメント

### ビルドプロセス

```bash
# 1. CSS ビルド
npx tailwindcss -i ./public/static/input.css -o ./public/static/output.css --minify

# 2. TypeScript → JavaScript (Vite)
vite build

# 出力:
# - dist/_worker.js (約460KB)
# - dist/_routes.json
# - dist/_headers
```

### デプロイコマンド

```bash
# 静的ファイルをコピー
cp -r public/static dist/

# Cloudflare Pages へデプロイ
npx wrangler pages deploy dist --project-name akagami-net
```

### 環境変数設定

```bash
# JWT シークレット
npx wrangler pages secret put JWT_SECRET --project-name akagami-net

# 管理者パスワード
npx wrangler pages secret put ADMIN_PASSWORD --project-name akagami-net

# Resend API キー
npx wrangler pages secret put RESEND_API_KEY --project-name akagami-net
```

### D1 データベース設定

```bash
# データベース作成
npx wrangler d1 create akagami-research-production

# マイグレーション適用（本番）
npx wrangler d1 migrations apply akagami-research-production

# マイグレーション適用（ローカル）
npx wrangler d1 migrations apply akagami-research-production --local

# データベースクエリ実行
npx wrangler d1 execute akagami-research-production --remote --command="SELECT COUNT(*) FROM users"
```

### wrangler.jsonc 設定

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "akagami-net",
  "compatibility_date": "2024-01-01",
  "pages_build_output_dir": "./dist",
  "compatibility_flags": ["nodejs_compat"],
  
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "akagami-research-production",
      "database_id": "c5d4dce7-e94e-489a-880f-36e6056f74c6"
    }
  ]
}
```

### package.json スクリプト

```json
{
  "scripts": {
    "dev": "vite",
    "dev:sandbox": "wrangler pages dev dist --ip 0.0.0.0 --port 3000",
    "build": "npm run build:css && vite build",
    "build:css": "npx tailwindcss -i ./public/static/input.css -o ./public/static/output.css --minify",
    "preview": "wrangler pages dev dist",
    "deploy": "npm run build && wrangler pages deploy dist",
    "deploy:prod": "npm run build && wrangler pages deploy dist --project-name akagami-net",
    "db:migrate:local": "wrangler d1 migrations apply akagami-research-production --local",
    "db:migrate:prod": "wrangler d1 migrations apply akagami-research-production",
    "db:console:local": "wrangler d1 execute akagami-research-production --local",
    "db:console:prod": "wrangler d1 execute akagami-research-production",
    "clean-port": "fuser -k 3000/tcp 2>/dev/null || true"
  }
}
```

---

## セキュリティ

### Cookie設定

```typescript
setCookie(c, 'user_token', token, {
  httpOnly: true,        // JavaScriptからアクセス不可
  secure: isProduction,  // HTTPS必須（本番）
  sameSite: 'Lax',       // CSRF対策
  maxAge: 60 * 60 * 24 * 30, // 30日
  path: '/',
})
```

### パスワードハッシュ

```typescript
// SHA-256 ハッシュ化
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
```

### JWT トークン

```typescript
// 生成
const payload = {
  userId,
  exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30日
}
const token = await sign(payload, secret, 'HS256')

// 検証
const payload = await verify(token, secret, 'HS256')
```

### XSS対策

```javascript
// HTML エスケープ
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
```

### CORS設定

```typescript
app.use('/api/*', cors({
  origin: 'https://akagami.net',
  credentials: true
}))
```

---

## パフォーマンス最適化

### 静的ファイルキャッシュ

```
# public/_headers

/static/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: no-cache, no-store, must-revalidate

/api/*
  Cache-Control: no-cache, no-store, must-revalidate
```

### データベースインデックス

```sql
-- pdfs テーブル
CREATE INDEX idx_pdfs_category ON pdfs(category_id);

-- user_downloads テーブル
CREATE INDEX idx_downloads_user ON user_downloads(user_id);
CREATE INDEX idx_downloads_pdf ON user_downloads(pdf_id);

-- user_favorites テーブル
CREATE INDEX idx_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_favorites_pdf ON user_favorites(pdf_id);

-- news_likes テーブル
CREATE INDEX idx_news_likes_news ON news_likes(news_id);
CREATE INDEX idx_news_likes_user ON news_likes(user_id);
```

### レスポンシブ対応

```css
/* Tailwind ブレークポイント */
sm: 640px   /* スマートフォン横向き */
md: 768px   /* タブレット */
lg: 1024px  /* ラップトップ */
xl: 1280px  /* デスクトップ */
2xl: 1536px /* 大画面 */

/* 使用例 */
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- PDF カード -->
</div>
```

---

## 今後の拡張予定

### 1. プッシュ通知
- Service Worker 実装
- Web Push API 統合
- 新着資料通知

### 2. オフライン対応
- Service Worker キャッシング
- IndexedDB データ同期

### 3. SNS連携
- Instagram API 統合
- Twitter API 統合
- 自動投稿機能

### 4. アナリティクス強化
- Google Analytics 4
- カスタムイベント追跡
- ヒートマップ分析

### 5. AI機能
- PDF内容要約
- キーワード自動抽出
- レコメンデーションシステム

---

## まとめ

このドキュメントは、Akagami.netの完全な構造と実装詳細を記述しています。

**主要な特徴**:
- Cloudflare Workers/Pagesによるエッジコンピューティング
- Honoフレームワークによる軽量バックエンド
- Cloudflare D1によるグローバル分散データベース
- Resend APIによるメール送信
- JWT認証とマジックリンク認証
- ダークモード管理画面
- レスポンシブデザイン

このドキュメントを参照することで、同等のサイトを再構築することが可能です。
