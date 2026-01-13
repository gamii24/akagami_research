# SEO & メタデータ チェックリスト

## ✅ 実装済み

### 基本的なSEO
- [x] **robots.txt** - 検索エンジンのクローリング制御
- [x] **sitemap.xml** - サイト構造の通知（動的生成）
- [x] **meta description** - ページごとの説明文（カテゴリ別に個別化）
- [x] **meta keywords** - 関連キーワード（カテゴリ別に最適化）
- [x] **canonical URL** - 重複コンテンツの防止
- [x] **言語指定** - `lang="ja"`, `hreflang`

### 構造化データ（JSON-LD）
- [x] **WebSite スキーマ** - サイト全体の情報
- [x] **BreadcrumbList** - パンくずリスト（カテゴリページ）
- [x] **CollectionPage** - コレクションページ（カテゴリページ）
- [x] **SearchAction** - サイト内検索機能の定義

### OGP（Open Graph Protocol）
- [x] **og:title** - ページタイトル（カテゴリ別）
- [x] **og:description** - ページ説明（カテゴリ別）
- [x] **og:image** - OG画像（WebP形式、軽量化済み）
- [x] **og:image:secure_url** - HTTPS画像URL
- [x] **og:locale** - 言語とロケール
- [x] **og:locale:alternate** - 代替ロケール
- [x] **og:type** - コンテンツタイプ
- [x] **og:url** - ページURL
- [x] **og:site_name** - サイト名

### Twitter Card
- [x] **twitter:card** - summary_large_image
- [x] **twitter:site** - Twitterアカウント
- [x] **twitter:creator** - 作成者アカウント
- [x] **twitter:title** - ツイートタイトル
- [x] **twitter:description** - ツイート説明
- [x] **twitter:image** - ツイート画像
- [x] **twitter:domain** - ドメイン情報

### PWA（Progressive Web App）
- [x] **manifest.json** - アプリマニフェスト（強化版）
- [x] **theme-color** - ライト/ダークモード対応
- [x] **apple-touch-icon** - iOS用アイコン
- [x] **favicon** - 複数サイズ対応
- [x] **color-scheme** - カラースキーム設定

### パフォーマンス最適化
- [x] **preconnect** - 外部CDNへの事前接続
- [x] **dns-prefetch** - DNS事前解決
- [x] **preload** - FontAwesomeの事前読み込み
- [x] **WebP画像** - 画像の軽量化（93%削減）
- [x] **defer属性** - JavaScriptの遅延読み込み
- [x] **システムフォント** - 外部フォント不要

### セキュリティ
- [x] **CSP** - Content Security Policy
- [x] **HSTS** - Strict-Transport-Security
- [x] **X-Frame-Options** - クリックジャッキング防止
- [x] **X-Content-Type-Options** - MIME sniffing防止
- [x] **Referrer-Policy** - リファラーポリシー
- [x] **Permissions-Policy** - 機能ポリシー

### アクセシビリティ
- [x] **aria-label** - 全ボタン・要素に説明ラベル
- [x] **aria-pressed** - トグルボタンの状態
- [x] **aria-hidden** - 装飾要素の非表示
- [x] **role属性** - セマンティックな役割
- [x] **WCAG 2.1準拠** - Level AA対応

### 開発者向け隠しファイル
- [x] **humans.txt** - 開発者情報・謝辞
- [x] **security.txt** - セキュリティ連絡先（RFC 9116準拠）

### Google Analytics
- [x] **GA4統合** - 測定ID: G-JPMZ82RMGG
- [x] **カスタムイベント** - ダウンロード、検索、フィルター等
- [x] **管理画面ダッシュボード** - アクセス解析表示

### ダークモード
- [x] **prefers-color-scheme** - OS設定の自動検知
- [x] **LocalStorage永続化** - ユーザー設定保存
- [x] **ダーク用OG画像** - SNS用画像（ダークモード対応）
- [x] **コントラスト最適化** - 視認性向上

## 📋 推奨される次のステップ

### Google Search Console
- [ ] サイトを登録
- [ ] sitemap.xml を送信
- [ ] URL検査ツールで構造化データを確認
- [ ] Core Web Vitalsをモニタリング
- [ ] 検索パフォーマンスレポートを確認

### リッチスニペットのテスト
- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) でテスト
- [ ] [Schema.org Validator](https://validator.schema.org/) で検証
- [ ] [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) でOGPテスト
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator) でTwitterカードテスト

### パフォーマンステスト
- [ ] [Google PageSpeed Insights](https://pagespeed.web.dev/) でスコア確認
- [ ] [Lighthouse](https://developers.google.com/web/tools/lighthouse) で監査
- [ ] [WebPageTest](https://www.webpagetest.org/) でパフォーマンス測定

### セキュリティテスト
- [ ] [Mozilla Observatory](https://observatory.mozilla.org/) でセキュリティスコア確認
- [ ] [Security Headers](https://securityheaders.com/) でヘッダー検証
- [ ] [SSL Labs](https://www.ssllabs.com/ssltest/) でSSL設定確認

### アクセシビリティテスト
- [ ] [WAVE](https://wave.webaim.org/) でアクセシビリティ検証
- [ ] [axe DevTools](https://www.deque.com/axe/devtools/) でテスト
- [ ] スクリーンリーダー（NVDA、JAWS）で実際にテスト

## 🎯 オプション機能（将来的に検討可能）

### 構造化データの追加
- [ ] **Article** - 個別PDF詳細ページ用
- [ ] **ItemList** - PDF一覧ページ用
- [ ] **FAQPage** - よくある質問ページ用
- [ ] **HowTo** - 使い方ガイドページ用
- [ ] **VideoObject** - 動画コンテンツ用（将来的）

### PWAの強化
- [ ] **Service Worker** - オフライン対応
- [ ] **Push Notifications** - プッシュ通知
- [ ] **Background Sync** - バックグラウンド同期
- [ ] **Install Prompt** - インストール促進

### パフォーマンスのさらなる改善
- [ ] **Critical CSS** - インライン化
- [ ] **Code Splitting** - JavaScriptの分割読み込み
- [ ] **Image Lazy Loading** - 画像の遅延読み込み
- [ ] **HTTP/3** - 最新プロトコル対応

### SNS最適化
- [ ] **Pinterest Rich Pins** - Pinterest用メタタグ
- [ ] **LinkedIn Post Inspector** - LinkedIn用最適化
- [ ] **LINE Share** - LINE用OGP最適化

## 📊 測定可能な成果指標

### SEO指標
- オーガニック検索流入数
- 検索順位（ターゲットキーワード）
- インデックスページ数
- クローラーエラー数

### ユーザー体験指標
- Core Web Vitals（LCP、FID、CLS）
- ページ読み込み速度
- 直帰率
- 平均セッション時間

### SNSシェア指標
- SNS経由のトラフィック
- シェア回数
- リーチ数

### アクセシビリティ指標
- Lighthouse Accessibilityスコア
- キーボードナビゲーション対応率
- スクリーンリーダー対応率

## 🔗 参考リンク

### 公式ドキュメント
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [RFC 9116 (security.txt)](https://www.rfc-editor.org/rfc/rfc9116.html)
- [Web App Manifest](https://www.w3.org/TR/appmanifest/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### テストツール
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [Security Headers](https://securityheaders.com/)
