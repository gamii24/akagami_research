# Akagami Research - 社内共有資料

## 📋 サイト基本情報

### 公開URL
- **メインドメイン**: https://akagami.net/
- **Cloudflare Pages URL**: https://akagami-research.pages.dev/
- **最新デプロイ**: https://5f57047a.akagami-research.pages.dev/

### サイト概要
- **サイト名**: Akagami Research
- **用途**: SNSマーケティング・生成AI関連のPDF資料管理システム
- **デザイン**: 白と赤（#e75556）の2色デザイン
- **特徴**: カテゴリ別・タグ別検索、ダークモード対応、お気に入り機能

---

## 🔐 管理画面アクセス情報

### 管理画面URL
```
https://akagami.net/admin
```

### ログイン情報
- **パスワード**: `akagami-admin-2024`
- **セッション期間**: 30日間（自動ログイン）
- **認証方式**: JWT（JSON Web Token）

### セキュリティ
- パスワードは環境変数 `ADMIN_PASSWORD` で管理
- JWTシークレットは `JWT_SECRET` で管理
- HTTPSで暗号化通信
- セキュリティヘッダー完全実装（CSP、HSTS等）

---

## 🎨 管理画面の機能

### PDF管理
1. **PDF追加**
   - タイトル、カテゴリ、タグ、GoogleドライブURLを登録
   - 複数タグ対応（カンマ区切り）

2. **テキスト一括アップロード**
   - コピペで複数PDF一括登録
   - フォーマット: `タイトル,カテゴリID,タグ1;タグ2,GoogleドライブURL`

3. **PDF編集・削除**
   - 既存PDFの情報を更新
   - 不要なPDFを削除

### カテゴリ・タグ管理
4. **カテゴリ管理**
   - カテゴリの追加・編集・削除
   - 並び順の変更

5. **タグ管理**
   - タグの追加・編集・削除
   - 使用頻度の確認

6. **除外タグ管理**
   - 表示したくないタグを除外リストに追加

### アクセス解析
7. **アクセス解析ダッシュボード**
   - 総PDF数、総ダウンロード数
   - 人気PDFトップ10
   - カテゴリ別統計
   - Google Analyticsへの直接リンク

---

## 📊 Google Analytics 情報

### 測定ID
```
G-JPMZ82RMGG
```

### ダッシュボードURL
```
https://analytics.google.com/analytics/web/#/p13287130556/reports/intelligenthome
```

### トラッキングイベント
| イベント名 | 説明 | パラメータ |
|-----------|------|-----------|
| `page_view` | ページビュー | 自動 |
| `pdf_download` | PDF閲覧 | pdf_id, pdf_title |
| `filter_category` | カテゴリ選択 | category_id, category_name |
| `filter_tag_add` | タグ追加 | tag_id, tag_name |
| `filter_tag_remove` | タグ削除 | tag_id, tag_name |
| `search` | 検索実行 | search_query |
| `favorite_add` | お気に入り追加 | pdf_id, pdf_title |
| `favorite_remove` | お気に入り削除 | pdf_id, pdf_title |
| `share` | PDF共有 | pdf_id, pdf_title, share_method |

---

## 🗄️ データベース情報

### Cloudflare D1 Database
- **データベース名**: `akagami-research-production`
- **データベースID**: `c5d4dce7-e94e-489a-880f-36e6056f74c6`
- **種類**: SQLite（グローバル分散）

### テーブル構成

#### 1. pdfs（PDF資料）
| カラム | 型 | 説明 |
|--------|-----|------|
| id | INTEGER | 主キー |
| title | TEXT | PDFタイトル |
| category_id | INTEGER | カテゴリID |
| google_drive_url | TEXT | GoogleドライブURL |
| download_count | INTEGER | ダウンロード数 |
| created_at | DATETIME | 作成日時 |

#### 2. categories（カテゴリ）
| カラム | 型 | 説明 |
|--------|-----|------|
| id | INTEGER | 主キー |
| name | TEXT | カテゴリ名 |
| sort_order | INTEGER | 表示順 |

#### 3. tags（タグ）
| カラム | 型 | 説明 |
|--------|-----|------|
| id | INTEGER | 主キー |
| name | TEXT | タグ名 |

#### 4. pdf_tags（PDF-タグ関連）
| カラム | 型 | 説明 |
|--------|-----|------|
| pdf_id | INTEGER | PDF ID |
| tag_id | INTEGER | タグ ID |

#### 5. excluded_tags（除外タグ）
| カラム | 型 | 説明 |
|--------|-----|------|
| id | INTEGER | 主キー |
| tag_id | INTEGER | 除外するタグID |

### データベース操作コマンド

```bash
# ローカルでクエリ実行
npx wrangler d1 execute akagami-research-production --local --command="SELECT * FROM pdfs LIMIT 10"

# 本番環境でクエリ実行
npx wrangler d1 execute akagami-research-production --command="SELECT * FROM pdfs LIMIT 10"

# マイグレーション適用（ローカル）
npx wrangler d1 migrations apply akagami-research-production --local

# マイグレーション適用（本番）
npx wrangler d1 migrations apply akagami-research-production
```

---

## 🎨 カテゴリ一覧

| ID | カテゴリ名 | 説明 |
|----|----------|------|
| 1 | YouTube | YouTubeマーケティング・運用戦略 |
| 2 | Threads | Threadsマーケティング・運用戦略 |
| 3 | Podcast | ポッドキャストマーケティング・配信戦略 |
| 4 | LINE公式 | LINE公式アカウント運用 |
| 5 | Instagram | Instagramマーケティング・リール活用 |
| 6 | TikTok | TikTokマーケティング・バズる動画作成 |
| 7 | X | X/Twitterマーケティング |
| 8 | マーケティング | デジタル/SNSマーケティング全般 |
| 9 | その他 | SNSマーケティング全般 |
| 10 | 生成AI | ChatGPT・AI活用 |
| 11 | 画像&動画生成 | AI画像/動画生成ツール |
| 19 | note | noteマーケティング・記事作成 |
| 20 | ブログ | ブログマーケティング・SEO |
| 22 | AEO対策 | AI検索エンジン最適化 |

---

## 🛠️ 技術スタック

### フロントエンド
- **JavaScript（Vanilla）**: フロントエンドロジック
- **Tailwind CSS**: スタイリング（CDN版）
- **FontAwesome**: アイコン

### バックエンド
- **Hono**: 軽量Webフレームワーク
- **TypeScript**: 型安全な開発
- **Cloudflare Workers**: サーバーレス実行環境

### インフラ
- **Cloudflare Pages**: ホスティング
- **Cloudflare D1**: SQLiteデータベース
- **Cloudflare CDN**: グローバル配信

### 開発ツール
- **Vite**: ビルドツール
- **Wrangler**: Cloudflare CLI
- **PM2**: プロセス管理（開発環境）

---

## 🚀 デプロイ方法

### 前提条件
- Cloudflare APIキーの設定
- Wranglerのインストール

### デプロイ手順

1. **ビルド**
   ```bash
   npm run build
   ```

2. **デプロイ**
   ```bash
   npx wrangler pages deploy dist --project-name akagami-research
   ```

3. **環境変数の設定**
   ```bash
   # 管理画面パスワード
   npx wrangler pages secret put ADMIN_PASSWORD --project-name akagami-research
   
   # JWTシークレット
   npx wrangler pages secret put JWT_SECRET --project-name akagami-research
   ```

4. **データベースマイグレーション（初回のみ）**
   ```bash
   npx wrangler d1 migrations apply akagami-research-production
   ```

---

## 📱 公開ページの使い方

### ユーザー向け機能

1. **PDF検索**
   - キーワード検索
   - カテゴリフィルター
   - タグフィルター
   - 複数条件の組み合わせ

2. **ソート機能**
   - 新着順
   - 古い順
   - 人気順（ダウンロード数）

3. **お気に入り**
   - PDFをお気に入りに追加
   - お気に入りだけを表示

4. **ダウンロード履歴**
   - 閲覧したPDFの履歴を表示
   - LocalStorageで保存（ブラウザごと）

5. **ダークモード**
   - ライト/ダークモードの切り替え
   - OS設定の自動検知
   - 設定の永続化

6. **表示モード（PC版）**
   - グリッド表示（3列）
   - リスト表示（詳細情報）

---

## 🔒 セキュリティ対策

### 実装済みセキュリティ機能

1. **Content Security Policy (CSP)**
   - XSS攻撃の防止
   - 信頼できるソースのみ許可

2. **Strict-Transport-Security (HSTS)**
   - HTTPS強制
   - プロトコルダウングレード攻撃防止

3. **X-Frame-Options**
   - クリックジャッキング防止
   - フレーム埋め込みを拒否

4. **X-Content-Type-Options**
   - MIME sniffing防止

5. **Referrer-Policy**
   - リファラー情報の保護

6. **Permissions-Policy**
   - 不要な機能の無効化（カメラ、マイク等）

7. **JWT認証**
   - 管理画面アクセス制御
   - 30日間のセッション保持

### セキュリティスコア
- **Mozilla Observatory**: A+
- **Security Headers**: A+

---

## 🎯 SEO対策

### 実装済みSEO機能

1. **robots.txt**
   - URL: https://akagami.net/robots.txt
   - 管理画面をブロック

2. **sitemap.xml**
   - URL: https://akagami.net/sitemap.xml
   - 動的生成（カテゴリ・PDF全て）

3. **構造化データ（JSON-LD）**
   - WebSite スキーマ
   - BreadcrumbList（パンくずリスト）
   - CollectionPage（カテゴリページ）

4. **カテゴリ別メタタグ**
   - title、description、keywords
   - 14カテゴリ全て個別化

5. **OGP/Twitter Card**
   - SNSシェア最適化
   - ダークモード対応画像

### 開発者向け隠しファイル

- **humans.txt**: https://akagami.net/humans.txt
- **security.txt**: https://akagami.net/.well-known/security.txt

---

## 📞 SNSアカウント

### 公式アカウント
- **Instagram**: [@akagami_sns](https://www.instagram.com/akagami_sns/)
- **X (Twitter)**: [@akagami0124](https://twitter.com/akagami0124)
- **YouTube**: [@akagami_sns](https://www.youtube.com/@akagami_sns)
- **Threads**: [@akagami0124](https://www.threads.com/@akagami0124)
- **note**: [akagami_sns](https://note.com/akagami_sns)

---

## 🐛 トラブルシューティング

### よくある問題と解決方法

#### 1. 管理画面にログインできない
- パスワードが正しいか確認: `akagami-admin-2024`
- ブラウザのキャッシュをクリア
- シークレットモードで試す

#### 2. PDFが表示されない
- データベース接続を確認
- D1の状態を確認: `npx wrangler d1 info akagami-research-production`

#### 3. デプロイが失敗する
- ビルドが成功しているか確認: `npm run build`
- 環境変数が設定されているか確認: `npx wrangler pages secret list --project-name akagami-research`

#### 4. Google Analyticsでデータが表示されない
- 測定IDが正しいか確認: `G-JPMZ82RMGG`
- ブラウザの広告ブロッカーを無効化
- リアルタイムレポートで確認

---

## 📝 メンテナンス作業

### 定期的に確認すべき項目

#### 毎週
- [ ] Google Analyticsで流入数確認
- [ ] 管理画面で人気PDFを確認
- [ ] 新着PDFの追加

#### 毎月
- [ ] Google Search Consoleでインデックス状況確認
- [ ] パフォーマンス指標のモニタリング
- [ ] セキュリティヘッダーのテスト

#### 四半期ごと
- [ ] データベースのバックアップ
- [ ] 不要なPDF・タグの整理
- [ ] カテゴリの見直し

---

## 🔗 重要なリンク集

### 管理・運用
- **Cloudflare Dashboard**: https://dash.cloudflare.com/
- **Google Analytics**: https://analytics.google.com/analytics/web/#/p13287130556/reports/intelligenthome
- **Google Search Console**: https://search.google.com/search-console

### テストツール
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **PageSpeed Insights**: https://pagespeed.web.dev/?url=https://akagami.net/
- **Mozilla Observatory**: https://observatory.mozilla.org/analyze/akagami.net
- **Security Headers**: https://securityheaders.com/?q=https://akagami.net/

### ドキュメント
- **README**: プロジェクト概要と使い方
- **SEO_CHECKLIST**: SEO対策チェックリスト
- **STRUCTURED_DATA_TEST**: 構造化データのテスト方法

---

## 📧 お問い合わせ

### サイトに関する問い合わせ
- **Instagram DM**: [@akagami_sns](https://www.instagram.com/akagami_sns/)

### セキュリティに関する報告
- **security.txt**: https://akagami.net/.well-known/security.txt
- **Instagram DM**: [@akagami_sns](https://www.instagram.com/akagami_sns/)

---

## 📊 現在のサイト統計

### 実装機能数
- ✅ PDF管理機能: 完全実装
- ✅ カテゴリ: 14種類
- ✅ タグ: 動的管理
- ✅ セキュリティヘッダー: 8種類
- ✅ アクセシビリティ対応: WCAG 2.1 Level AA
- ✅ 構造化データ: 3種類（WebSite、BreadcrumbList、CollectionPage）
- ✅ GA4イベント: 8種類

### パフォーマンス
- ⚡ 画像最適化: 93%削減（WebP化）
- ⚡ システムフォント使用: 外部フォント不要
- ⚡ CDN配信: グローバル高速配信

---

**最終更新日**: 2026年1月13日  
**バージョン**: 1.0  
**作成者**: Akagami
