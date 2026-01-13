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

## ♿ アクセシビリティ対応

### ARIA属性の実装
スクリーンリーダーや支援技術をサポートするため、以下のアクセシビリティ機能を実装：

1. **aria-label属性**: すべてのボタンと対話要素に説明的なラベルを追加
2. **aria-pressed属性**: トグルボタン（ソート、フィルター、お気に入り）の状態を明示
3. **aria-hidden="true"**: 装飾用アイコンを支援技術から隠す
4. **role属性**: セマンティックな役割を明示（searchbox、button）
5. **aria-expanded属性**: メニューの展開状態を明示

### 実装箇所
- **フロントエンド (app.js)**:
  - カテゴリボタン、タグボタン
  - ソートボタン（新着順、古い順、人気順）
  - お気に入りフィルター、表示モード切り替え
  - PDFカードの共有・お気に入りボタン
  - 検索入力とボタン
  
- **管理画面 (admin.js)**:
  - 全てのアクションボタン（PDF追加、一括アップロード、カテゴリ管理等）
  - PDF編集・削除ボタン
  - モーダルの閉じるボタン
  - ログアウトボタン

- **404ページ**:
  - ホームボタン、戻るボタン
  - カテゴリへのクイックリンク

### アクセシビリティ向上の効果
- スクリーンリーダーユーザーが各ボタンの機能を理解できる
- キーボードナビゲーションが改善
- WCAG 2.1 ガイドラインに準拠
- より広い範囲のユーザーがサイトを利用可能

## 🌙 ダークモード対応

### ダークモード機能
- ✅ **ライト/ダークモード切り替え**: ボタンでワンクリック切り替え
- ✅ **LocalStorage 永続化**: ユーザーの設定を保存
- ✅ **prefers-color-scheme 対応**: OSのダークモード設定を自動検知
- ✅ **カラースキーム最適化**: ダークモード専用のカラーパレット

### OGP画像のダークモード対応
SNSシェア時にダークモード用の画像を自動選択：
- **ライトモード**: og-image.webp（明るい背景）
- **ダークモード**: og-image-dark.webp（暗い背景）
- **正方形版**: og-image-square.webp / og-image-square-dark.webp
- **自動切り替え**: `prefers-color-scheme` メディアクエリで対応

### theme-color メタタグ
- **ライトモード**: `#e75556`（プライマリカラー）
- **ダークモード**: `#1a1a1a`（ダーク背景色）
- **効果**: モバイルブラウザのアドレスバーの色が自動変更

### ダークモードのコントラスト改善
- 背景色: `#1a1a1a` → `#2d2d2d`（カード）
- テキスト色: `#e0e0e0`（高コントラスト）
- ボーダー色: `#404040`（視認性向上）
- ボタン hover: `#353535`（微妙な変化）
- スクロールバー: ダーク対応

## 🔍 SEO対策

### カテゴリ別メタタグの個別化（NEW!）
各カテゴリページごとに最適化されたメタタグを自動生成：
- **動的なtitle**: カテゴリ名に応じたページタイトル
- **カスタムdescription**: 各カテゴリ専用の説明文
- **最適化されたkeywords**: カテゴリに関連するキーワード
- **OGP対応**: SNSシェア時もカテゴリ別の情報を表示

**対応カテゴリ（14種類）**:
1. YouTube - YouTubeマーケティング・運用・戦略
2. Threads - Threadsマーケティング・運用戦略
3. Podcast - ポッドキャストマーケティング・配信戦略
4. LINE公式 - LINE公式アカウント運用
5. Instagram - Instagramマーケティング・リール・ストーリーズ
6. TikTok - TikTokマーケティング・バズる動画作成
7. X (旧Twitter) - X/Twitterマーケティング
8. マーケティング - デジタル/SNSマーケティング全般
9. その他 - SNSマーケティング全般
10. 生成AI - ChatGPT・AI活用
11. 画像&動画生成 - AI画像/動画生成ツール
12. note - noteマーケティング・記事作成
13. ブログ - ブログマーケティング・SEO
14. AEO対策 - AI検索エンジン最適化

**使用例**:
- ホームページ: `https://akagami.net/` → 全体的な説明
- Instagramカテゴリ: `https://akagami.net/?category=5` → Instagram専用の説明
- TikTokカテゴリ: `https://akagami.net/?category=6` → TikTok専用の説明

### robots.txt
検索エンジンのクローリングを適切に制御：
- **全ページ許可**: 公開ページは全て検索対象
- **管理画面をブロック**: `/admin` は検索エンジンからブロック
- **Sitemap参照**: `sitemap.xml` の場所を明示
- **URL**: https://akagami.net/robots.txt

### sitemap.xml (動的生成)
検索エンジンに全コンテンツを通知：
- **ホームページ**: 最高優先度 (1.0)、毎日更新
- **カテゴリページ**: 優先度 0.8、週次更新
- **PDFページ**: 優先度 0.6、月次更新、最終更新日付付き
- **自動更新**: データベースから動的に生成、常に最新
- **URL**: https://akagami.net/sitemap.xml

### 強化されたメタタグ
- **Robotsタグ**: `index, follow` で検索エンジンに完全インデックス許可
- **言語タグ**: 日本語サイトとして明示
- **Canonical URL**: 重複コンテンツを防止

### 構造化データ (JSON-LD) - リッチスニペット対応（NEW!）
Schema.org形式の構造化データで検索エンジンに詳細情報を提供：

#### 1. WebSite スキーマ（全ページ）
- **サイト名**: Akagami Research
- **説明**: SNSマーケティング・生成AI資料保管庫
- **URL**: https://akagami.net/
- **著者情報**: Akagami（Instagram: @akagami_sns）
- **SearchAction**: サイト内検索機能の定義
- **言語**: ja-JP

#### 2. BreadcrumbList（カテゴリページ）
カテゴリページごとにパンくずリストを自動生成：
```
ホーム > Instagram資料
ホーム > TikTok資料
ホーム > 生成AI資料
```

#### 3. CollectionPage（カテゴリページ）
各カテゴリページに対して：
- **カテゴリ名と説明**: カテゴリ専用の詳細情報
- **URLとサイトの関連性**: WebSiteとの構造を明示
- **about属性**: カテゴリのトピックを定義

**期待される効果**:
- ✅ Google検索結果にパンくずリストが表示される可能性
- ✅ サイトリンク検索ボックスが表示される可能性
- ✅ カテゴリページの説明が検索結果に表示される可能性
- ✅ SEOランキングの向上
- ✅ クリック率（CTR）の改善

**検証方法**:
1. [Google Rich Results Test](https://search.google.com/test/rich-results) でテスト
2. [Schema.org Validator](https://validator.schema.org/) で検証
3. Google Search Console の「エンハンスメント」レポートで確認

詳細は `STRUCTURED_DATA_TEST.md` を参照してください。

### Google Search Consoleへの登録推奨
SEO効果を最大化するため、以下の手順を推奨：
1. [Google Search Console](https://search.google.com/search-console) にサイトを登録
2. サイトマップ (`https://akagami.net/sitemap.xml`) を送信
3. インデックス状況を定期的に確認
4. 検索パフォーマンスをモニタリング

### 開発者向け隠しファイル（NEW!）

#### humans.txt
サイト制作者情報を記載したファイル（開発者向けイースターエッグ）：
- **URL**: https://akagami.net/humans.txt
- **内容**: 開発者情報、使用技術、謝辞、サイト情報
- **対象**: 開発者、技術者、ソースコードを見る人

#### security.txt（RFC 9116準拠）
セキュリティ研究者向けの連絡先情報：
- **URL**: https://akagami.net/.well-known/security.txt
- **内容**: セキュリティ問題の報告先、有効期限、推奨言語
- **対象**: セキュリティ研究者、倫理的ハッカー
- **標準**: RFC 9116（セキュリティ情報の標準化）

#### PWA manifest.json（強化版）
Progressive Web App対応を強化：
- **categories**: business, education, productivity
- **screenshots**: OG画像を使用（wide/narrow対応）
- **orientation**: any（すべての向きに対応）
- **scope**: サイト全体をPWA範囲に
- **効果**: ホーム画面に追加、オフライン対応、アプリライク体験

#### 強化されたOGPメタタグ
SNSシェアの最適化：
- **og:image:secure_url**: HTTPS画像URL明示
- **og:locale:alternate**: 英語版の代替ロケール
- **twitter:site**: Twitterアカウント情報
- **twitter:domain**: ドメイン情報
- **効果**: SNSでのシェアがより魅力的に表示

## ⚡ パフォーマンス最適化

### 画像最適化
- **WebP形式への変換**
  - OG画像を最適化（PNG → WebP）
  - og-image.png: 426KB → 28KB（93%削減）
  - og-image-square.png: 665KB → 57KB（91%削減）
  - 合計約1MBのファイルサイズ削減

### フォント最適化
- **システムフォントスタック使用**
  - 外部フォントのダウンロード不要
  - ネイティブOS フォント使用（-apple-system, BlinkMacSystemFont, Segoe UI など）
  - 高速なフォントレンダリング
- **FontAwesome の preload 設定**
  - アイコンフォントの遅延読み込み
- **外部CDNへの preconnect 設定**
  - cdn.tailwindcss.com
  - cdn.jsdelivr.net
  - www.googletagmanager.com

### スクリプト最適化
- **JavaScript の defer 属性**
  - app.js（公開ページ）
  - admin.js（管理画面）
  - axios ライブラリ
  - ページレンダリングをブロックしない非同期読み込み

### パフォーマンス指標の改善
- ✅ **ページ読み込み速度向上**：画像圧縮により約1MB削減
- ✅ **First Contentful Paint (FCP) 改善**：システムフォント使用
- ✅ **Time to Interactive (TTI) 改善**：スクリプトの defer 読み込み
- ✅ **Cumulative Layout Shift (CLS) 最適化**：preconnect によるリソース取得の高速化
- ✅ **Lighthouse スコア向上**：総合的なパフォーマンス最適化

## 🎨 カスタム404エラーページ

### デザイン特徴
- **美しいグラデーション背景**：白→ピンク→赤のグラデーション
- **大きなアニメーション404テキスト**：浮遊アニメーション付き
- **わかりやすいエラーメッセージ**：日本語で明確な説明
- **2つのアクションボタン**
  - 「ホームに戻る」（プライマリーボタン）
  - 「前のページへ」（セカンダリーボタン）
- **お役立ちリンク**：人気カテゴリへのクイックアクセス
  - YouTube資料
  - Instagram資料
  - TikTok資料
  - 生成AI資料

### アニメーション効果
- **浮遊アニメーション**：404テキストが上下に浮遊
- **フェードイン効果**：ページ読み込み時のスムーズな表示
- **ホバーエフェクト**：ボタンとリンクに動的な視覚フィードバック

### ユーザーエクスペリエンス
- ✅ 明確でフレンドリーなエラーメッセージ
- ✅ エラーから回復するための複数のナビゲーションオプション
- ✅ 人気コンテンツカテゴリへのクイックアクセス
- ✅ メインサイトと一貫したビジュアルデザイン
- ✅ モバイルとデスクトップ完全対応のレスポンシブデザイン

## 🔒 セキュリティヘッダー

### 実装済みセキュリティヘッダー

#### 1. Content-Security-Policy (CSP)
厳格なコンテンツセキュリティポリシーで不正なスクリプト実行を防止：
- **default-src**: `'self'` - デフォルトは自サイトのみ許可
- **script-src**: 信頼されたCDNのみ許可（Tailwind, jsDelivr, Google Analytics）
- **style-src**: 自サイト + 信頼されたCDN
- **img-src**: 自サイト + data URIs + HTTPS/HTTP
- **font-src**: 自サイト + jsDelivr
- **connect-src**: 自サイト + Google Analytics
- **frame-src**: `'none'` - iframeの埋め込みを禁止
- **object-src**: `'none'` - プラグインをブロック
- **frame-ancestors**: `'none'` - クリックジャッキング防止
- **upgrade-insecure-requests** - 自動的にHTTPSにアップグレード

#### 2. HTTP Strict Transport Security (HSTS)
強制的にHTTPS接続を要求：
- **max-age**: 31536000秒（1年間）
- **includeSubDomains**: サブドメインも含む
- **preload**: HSTSプリロードリストに登録可能

#### 3. X-Frame-Options
- **DENY** - iframeでの埋め込みを完全に禁止
- クリックジャッキング攻撃を防止

#### 4. X-Content-Type-Options
- **nosniff** - MIMEタイプスニッフィングを防止
- コンテンツタイプの改ざん攻撃をブロック

#### 5. Referrer-Policy
- **strict-origin-when-cross-origin**
- ユーザープライバシーを保護しつつ、アナリティクスを維持

#### 6. X-XSS-Protection
- **1; mode=block**
- 古いブラウザでXSSフィルタリングを有効化

#### 7. Permissions-Policy
不要なブラウザ機能を無効化：
- **camera**: 無効
- **microphone**: 無効
- **geolocation**: 無効
- **payment**: 無効

### セキュリティ効果

| 攻撃タイプ | 対策ヘッダー | 保護レベル |
|-----------|-------------|----------|
| XSS（クロスサイトスクリプティング） | CSP, X-XSS-Protection | ✅ 高 |
| クリックジャッキング | X-Frame-Options, CSP frame-ancestors | ✅ 高 |
| MIMEスニッフィング | X-Content-Type-Options | ✅ 高 |
| 中間者攻撃（MITM） | HSTS | ✅ 高 |
| プライバシー侵害 | Referrer-Policy | ✅ 中 |
| 不正な機能アクセス | Permissions-Policy | ✅ 中 |

### セキュリティスコア

サイトのセキュリティヘッダーを確認：
- [Security Headers](https://securityheaders.com/) でスキャン
- [Mozilla Observatory](https://observatory.mozilla.org/) で評価
- 期待スコア: **A+**

## 🎨 カラーパレット

- **Primary**: #e75556 - メインの赤色
- **White**: #ffffff - 背景色
- **Beige**: #f4eee0 - アクセント用ベージュ

## 🌐 公開URL

- **本番環境（公開URL）**: https://akagami-research.pages.dev
- **最新デプロイ**: https://5f57047a.akagami-research.pages.dev
- **開発環境（Sandbox）**: https://3000-iwpfj0eebl4qd7e2klphb-5c13a017.sandbox.novita.ai
- **robots.txt**: https://akagami.net/robots.txt
- **sitemap.xml**: https://akagami.net/sitemap.xml
- **404エラーページ**: https://5f57047a.akagami-research.pages.dev/test-404
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
