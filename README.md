# Akagami.net - SNSマーケティング・生成AI資料保管庫

PDF資料をGoogleドライブのリンクで管理できる、シンプルで美しいデザインの資料管理システムです。
**合同会社ジースリー**が運営する公式企業サイトとしても機能しています。

**🎉 新機能: 会員制度実装！ログイン・履歴同期・メール通知機能を追加**

## 🏢 会社情報

- **会社名**: 合同会社ジースリー
- **代表者**: 橋元幸菜
- **資本金**: 100万円
- **所在地**: 〒150-0013 東京都渋谷区恵比寿１－８－１４ 大黒ビル５１５
- **メールアドレス**: mail@akagami.oops.jp
- **事業内容**:
  - SNSマーケティング支援
  - 生成AI活用コンサルティング
  - SNS運用代行サービス
  - マーケティング教育・研修事業

## 🌐 公開URL

- **本番環境**: https://akagami.net
- **お知らせ**: https://akagami.net/announcements（NEW！2026-02-05）
- **事業紹介**: https://akagami.net/services
- **会社概要**: https://akagami.net/company
- **お問い合わせ**: https://akagami.net/contact
- **プライバシーポリシー**: https://akagami.net/privacy
- **管理画面**: https://akagami.net/admin
  - **お知らせ管理**: https://akagami.net/admin/announcements（NEW！2026-02-05）
- **マイページ**: https://akagami.net/mypage
- **カテゴリ一覧**: https://akagami.net/categories
- **📅 SNS運用カレンダー（全12ヶ月）**:
  - [1月](https://akagami.net/calendar/1) | [2月](https://akagami.net/calendar/2) | [3月](https://akagami.net/calendar/3) | [4月](https://akagami.net/calendar/4) | [5月](https://akagami.net/calendar/5) | [6月](https://akagami.net/calendar/6)
  - [7月](https://akagami.net/calendar/7) | [8月](https://akagami.net/calendar/8) | [9月](https://akagami.net/calendar/9) | [10月](https://akagami.net/calendar/10) | [11月](https://akagami.net/calendar/11) | [12月](https://akagami.net/calendar/12)
- **GitHub**: https://github.com/gamii24/akagami_research
- **プロジェクト名**: akagami-net
- **プラットフォーム**: Cloudflare Pages
- **デプロイ状態**: ✅ Active
- **最終更新**: 2026-02-05 - 📷 画像アップロード機能追加（R2ストレージ連携）

## 📢 お知らせページ（NEW！2026-02-05）

### 概要
会社からのお知らせや新着情報を管理・公開できる**お知らせページ**を実装しました。管理画面から簡単に追加・編集・削除が可能です。

### 主な機能
- ✅ **お知らせの公開・非公開切り替え**: 下書き保存と公開を管理
- ✅ **日付指定**: お知らせの公開日を設定可能
- ✅ **Twitter/X埋め込み対応**: お知らせ内容にツイートURLを含めると自動的に埋め込み表示
- ✅ **画像表示対応**: 画像URL（.jpg, .png, .gif, .webp, .svg）を含めると自動的に画像表示
- ✅ **画像アップロード機能**: 管理画面から直接画像をアップロード可能（NEW！）
- ✅ **管理画面からの簡単編集**: モーダル形式で追加・編集・削除
- ✅ **カード型デザイン**: 美しいカードレイアウトで表示
- ✅ **レスポンシブデザイン**: PC・スマートフォン完全対応

### Twitter/X埋め込み機能
お知らせの内容欄に以下の形式のURLを入力すると、自動的にツイートが埋め込まれて表示されます：
- `https://twitter.com/username/status/1234567890`
- `https://x.com/username/status/1234567890`

### 画像アップロード機能（NEW！2026-02-05）

#### 直接アップロード
管理画面から画像ファイルを直接アップロードできます：
1. 管理画面で「ファイルを選択」をクリック
2. 画像ファイルを選択（JPG, PNG, GIF, WebP, SVG）
3. 「アップロード」ボタンをクリック
4. 画像URLが自動的に内容欄に追加されます

#### 画像URL入力
お知らせの内容欄に画像URLを入力することも可能：
- 対応形式: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`
- 画像URLの例: `https://example.com/image.jpg`
- 自動的に角丸、シャドウ、レスポンシブ対応で表示されます

#### ストレージ
- **Cloudflare R2**: 画像は高速なCloudflare R2ストレージに保存
- **最大ファイルサイズ**: 5MB
- **配信**: `/api/images/`エンドポイント経由で配信
- **キャッシュ**: 1年間のブラウザキャッシュ設定

**使い方**:
1. 管理画面（https://akagami.net/admin/announcements）にログイン
2. 「新しいお知らせを追加」をクリック
3. タイトル、内容、日付を入力（内容にTwitter URLを貼り付け）
4. 「公開する」にチェックを入れて保存
5. 公開ページ（https://akagami.net/announcements）で確認

### データベース
- **テーブル名**: `company_announcements`
- **カラム**: id, title, content, announcement_date, is_published, created_at, updated_at

### 技術的な実装
- **サーバー側処理**: 
  - Twitter URLを検出して `<blockquote class="twitter-tweet">` に変換
  - 画像URLを検出して `<img>` タグに変換（レスポンシブ、角丸、シャドウスタイル付き）
  - 画像アップロードAPI: `/api/announcements/upload-image`
  - 画像配信API: `/api/images/:path` (R2経由)
- **クライアント側レンダリング**: Twitter Widget APIで実際のツイートカードを表示
- **CSP設定**: グローバルContent Security Policyでtwitter.comドメインを許可
- **ストレージ**: Cloudflare R2 (`akagami-net-images` バケット)
- **対応形式**: Twitter/X埋め込み + 画像表示（JPG, PNG, GIF, WebP, SVG）+ 画像アップロード

## 🎯 プロジェクト概要

- **サイト名**: Akagami.net
- **目的**: SNSマーケティング・生成AI関連のPDF資料を整理して管理
- **デザイン**: 白と赤（#e75556）の2色デザイン
- **技術スタック**: Hono + TypeScript + Cloudflare D1 + TailwindCSS + Google Analytics
- **運営**: 合同会社ジースリー

## 📅 SNS運用カレンダー（NEW！2026-01-14）

### 概要
Instagram投稿を計画的に管理できる**12ヶ月分のインタラクティブなカレンダー**を実装しました。各月の季節イベントやトレンドに合わせた投稿テーマを提案します。

### 主な機能
- 🔥 **毎年○月に流行るもの**: 各月に流行するトレンド・イベント・コンテンツを表示（2026-01-14追加）
- 📆 **月別カレンダービュー**: 全日程が一目でわかるグリッドレイアウト
- 🎯 **日別投稿テーマ**: 各日に最適化された投稿テーマの提案
- 🎉 **イベント連動**: 祝日、季節イベント、記念日をハイライト表示
- 📊 **週別フォーカス**: 週ごとの重点テーマを表示
- 💡 **トレンド情報**: 各月に流行るコンテンツとキーワードの提案
- 📱 **レスポンシブデザイン**: PC・スマートフォン完全対応
- 🔄 **シンプル月選択**: ページ上部でテキストリンクから1月〜12月を簡単に切り替え（現在の月は赤色で強調）

### 各月の特徴
- **1月**: 新年、初詣、お年玉、福袋、成人式
- **2月**: バレンタイン、節分、受験シーズン
- **3月**: ひな祭り、ホワイトデー、卒業シーズン、春の訪れ
- **4月**: お花見、新生活、入学・入社
- **5月**: ゴールデンウィーク、母の日、新緑
- **6月**: 梅雨、父の日、ジューンブライド
- **7月**: 七夕、海、夏休み、花火
- **8月**: お盆、夏祭り、帰省、花火大会
- **9月**: 敬老の日、お月見、秋分の日
- **10月**: ハロウィン、紅葉、スポーツの秋、読書の秋
- **11月**: 文化の日、七五三、勤労感謝の日、紅葉見頃
- **12月**: クリスマス、大晦日、冬至、年末年始準備

### アクセス方法
1. **ハンバーガーメニューから**（推奨）: メニューを開く → 「📅 SNS運用カレンダー」ボタンをクリック → 1月のカレンダーページへ移動 → 上部の横スクロールで他の月を選択
2. **直接アクセス**: `/calendar/1` ～ `/calendar/12`
3. **カレンダー内ナビゲーション**: 上部の月リンクから好きな月へ移動

## 🔐 会員制度（NEW！）

### 🔑 管理者ログイン情報
- **管理画面URL**: https://25613224.akagami-research.pages.dev/admin
- **パスワード**: `TaylorAlisonSwift`
- **機能**: PDF管理、カテゴリ管理、ユーザー管理

### 実装済み機能

#### 1. 認証システム
- ✅ **簡単会員登録**: メールアドレスのみで登録可能（名前・パスワードは任意）
- ✅ **パスワード認証**: メールアドレス + パスワードでログイン
- ✅ **マジックリンク認証**: パスワード未設定でもメールリンクからログイン可能
- ✅ **JWT セッション管理**: 安全なトークンベース認証
- ✅ **自動ログイン**: 一度ログインすると次回から自動ログイン
- ✅ **ハンバーガーメニュー統合**: ログイン/プロフィールUIをサイドバーの一番上に配置（2026/01/13 更新）

#### 2. マイページ（完全実装！）
- ✅ **プロフィール情報編集**: 名前、居住地（都道府県/国）、誕生日を登録・編集
- ✅ **プロフィール表示**: ユーザー情報を表示（居住地・誕生日も含む）
- ✅ **プロフィール写真**: 写真のアップロードと表示（最大5MB、base64形式で保存）
- ✅ **SNS情報登録**: YouTube、Instagram、TikTok、X (Twitter) のアカウント情報を登録
- ✅ **通知設定**: カテゴリ別に新着資料のメール通知を設定
- ✅ **ダウンロード履歴**: 過去にダウンロードしたPDFの一覧表示
- ✅ **お気に入り一覧**: お気に入り登録したPDFの一覧表示

#### 3. レビュー・評価システム（NEW！）
- ✅ **5つ星評価**: PDFに1〜5つ星の評価を投稿
- ✅ **コメント投稿**: 500文字までのレビューコメント
- ✅ **平均評価表示**: PDFカードに星マークと平均評価を表示
- ✅ **レビュー数表示**: 各PDFの評価件数を表示
- ✅ **レビュー編集・削除**: 自分のレビューを編集・削除可能
- ✅ **認証必須**: ログインユーザーのみレビュー投稿可能
- ✅ **ユニーク制約**: 1つのPDFにつき1ユーザー1レビューまで

#### 4. UX改善
- ✅ **ローディング表示**: ボタンクリック時にスピナーアニメーション表示
- ✅ **処理中ボタン無効化**: 二重クリック防止
- ✅ **成功時フィードバック**: チェックマークで成功を視覚的に表示
- ✅ **遅延認証チェック**: ページロード時のAPI呼び出しを削減してパフォーマンス改善
- ✅ **手動認証チェック**: メニューを開いた時のみ認証状態を確認

#### 4. データ同期
- ✅ **ダウンロード履歴の同期**: デバイス間で履歴を共有
- ✅ **お気に入りの同期**: お気に入りPDFをクラウド保存
- ✅ **LocalStorageからの自動移行**: 既存のデータを自動的にサーバーへ同期

#### 5. 通知設定
- ✅ **カテゴリ別通知設定**: 興味のあるカテゴリを選択
- ✅ **週次メール通知**: チェックを入れたカテゴリの新着資料を毎週月曜日に自動メール送信
- ✅ **通知設定UI**: マイページから簡単に設定変更

#### 6. メール送信機能
- ✅ **ウェルカムメール**: 会員登録時に自動送信
- ✅ **管理者通知メール**: 新規登録時に管理者（akagami.syatyo@gmail.com）へ自動通知
- ✅ **マジックリンクメール**: パスワードレスログイン用
- ✅ **新着通知メール**: カテゴリ別の新着資料通知
- ✅ **Cloudflare Email Workers 対応**: 無料メール送信（設定必要）

#### 7. 管理機能（NEW！）
- ✅ **登録者一覧**: 管理画面で全会員の情報を表示
  - 会員番号、名前、メールアドレス、登録日、最終ログイン、認証方法
- ✅ **CSVエクスポート**: 登録者データをCSV形式でダウンロード
- ✅ **新規登録通知**: 会員登録時に管理者へメール通知（実装済み・メールサービス設定必要）
  - 通知先: akagami.syatyo@gmail.com
  - 内容: 会員番号、名前、メールアドレス、登録日時
- ✅ **アクセス解析**: Google Analytics統合、人気PDF分析
- ✅ **カテゴリ別PDF表示**: カテゴリごとにPDFをフィルター表示（2026/01/14 追加）
- ✅ **クイックカテゴリ変更**: PDF一覧でカテゴリボタンをクリックして即座に変更（2026/01/14 追加）

#### 8. API エンドポイント

**ユーザー認証**
- `/api/user/register` - 会員登録（管理者へメール通知）
- `/api/user/login` - ログイン
- `/api/user/send-magic-link` - マジックリンク送信
- `/api/user/verify-magic-link` - マジックリンク検証
- `/api/user/logout` - ログアウト

**ユーザー情報**
- `/api/user/me` - ユーザー情報取得（SNS情報、プロフィール写真含む）
- `/api/user/profile` - ユーザー情報更新（SNS情報含む）
- `/api/user/profile-photo` - プロフィール写真アップロード
- `/api/user/downloads` - ダウンロード履歴管理
- `/api/user/favorites` - お気に入り管理
- `/api/user/notifications` - 通知設定管理

**レビュー**
- `/api/pdfs/:id/reviews` - レビューCRUD（取得・作成・更新・削除）
- `/api/pdfs/:id/my-review` - 自分のレビュー取得
- `/api/reviews/:id/helpful` - レビューを「役に立った」と投票

**管理者専用**
- `/api/analytics/users` - 登録者一覧取得（認証必須）
- `/api/analytics/overview` - 全体統計
- `/api/analytics/pdfs` - PDF統計
- `/api/analytics/categories` - カテゴリ統計

#### 9. データベース設計（Cloudflare D1）
- **users**: ユーザー情報（メール、名前、居住地、誕生日、認証方法、SNS情報、プロフィール写真）
  - 追加フィールド: `location`, `birthday`, `youtube_url`, `instagram_handle`, `tiktok_handle`, `twitter_handle`, `profile_photo_url`
- **pdfs**: PDF情報（タイトル、URL、カテゴリ、**評価情報**）
  - 追加フィールド: `average_rating`, `review_count`
- **pdf_reviews**: PDFレビュー（評価、コメント）
- **review_helpful**: レビューへの「役に立った」投票
- **magic_link_tokens**: マジックリンクトークン（有効期限付き）
- **user_downloads**: ダウンロード履歴
- **user_favorites**: お気に入りリスト
- **user_notification_settings**: 通知設定（カテゴリ別・週次配信）
- **email_notifications**: メール送信履歴

### マイグレーション適用

```bash
# ローカル開発環境
npx wrangler d1 migrations apply akagami-research-production --local

# 本番環境
npx wrangler d1 migrations apply akagami-research-production --remote
```

### セキュリティ
- ✅ **パスワードハッシュ化**: bcryptで安全にハッシュ化
- ✅ **JWT認証**: HttpOnlyクッキーでセキュアなセッション管理
- ✅ **マジックリンク有効期限**: 15分間のみ有効
- ✅ **CSRF対策**: SameSite=Laxクッキー設定
- ✅ **デバッグツール制御**: Erudaデバッグコンソールは本番環境でデフォルト無効化

#### デバッグモードの有効化
本番環境でのデバッグが必要な場合、以下の方法でErudaデバッグコンソールを有効化できます：
- **URLパラメータで有効化**: `?debug=true` をURLに追加
- **URLパラメータで無効化**: `?debug=false` をURLに追加
- **ローカルストレージで管理**: 一度有効化すると、設定が保存されます

例: `https://akagami.net/?debug=true`

### マイページの使い方

1. **プロフィール情報を登録する**
   - お名前（必須）、居住地（都道府県または国）、誕生日を入力
   - 「プロフィール情報を保存」ボタンをクリック

2. **SNS情報を登録する**
   - YouTube チャンネルURL、Instagram、TikTok、X (Twitter) アカウントを入力
   - 「SNS情報を保存」ボタンをクリック
   
2. **メール通知を設定する**
   - 興味のあるSNSカテゴリのチェックボックスをオンにする
   - 「通知設定を保存」ボタンをクリック
   - チェックを入れたカテゴリの新着資料が毎週月曜日にメールで届きます
   
3. **履歴とお気に入りを確認する**
   - ダウンロード履歴とお気に入りが自動的に表示されます
   - 各PDFの「開く」ボタンでGoogleドライブで開けます

### 今後の実装予定
- 📧 メール送信サービスの設定（SendGrid/Resend/Cloudflare Email Workers）
  - 現在: コード実装済み、ログ出力のみ
  - 必要: メールサービスのAPI Key設定
  - 参考: `REGISTRATION_NOTIFICATION_GUIDE.md` を参照

## 📝 登録者管理・通知機能

### 管理画面での登録者一覧
- **アクセス**: `/admin` → 「登録者一覧」ボタン（緑色）
- **表示内容**: 会員番号、名前、メールアドレス、登録日時、最終ログイン、認証方法
- **機能**: CSVエクスポート、総登録者数表示

### 新規登録時のメール通知
- **通知先**: `akagami.syatyo@gmail.com`
- **タイミング**: 会員登録時に自動送信
- **内容**: 会員番号、名前、メールアドレス、登録日時
- **現状**: コード実装済み（メールサービス設定後に送信開始）

詳細な使い方とメールサービスの設定方法は `REGISTRATION_NOTIFICATION_GUIDE.md` を参照してください。

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

- **本番環境（公開URL）**: https://akagami.net
- **最新デプロイ**: https://5910e069.akagami-research.pages.dev
- **開発環境（Sandbox）**: https://3000-iwpfj0eebl4qd7e2klphb-5c13a017.sandbox.novita.ai
- **robots.txt**: https://akagami.net/robots.txt
- **sitemap.xml**: https://akagami.net/sitemap.xml
- **公開ページ**: `/` - PDF一覧・検索・閲覧
- **マイページ**: `/mypage` - SNS情報登録・通知設定・履歴表示・アクティビティグラフ（**ログイン必須**）
- **管理画面**: `/admin` - PDF登録・編集・削除（**完全ダークモード・コンパクトデザイン**）
  - **パスワード**: `TaylorAlisonSwift`
  - **セッション**: JWTトークンでログイン状態を30日間保持
  - **自動ログイン**: 一度ログインすると、再度パスワード入力不要
  - **PC版**: 右下に目立たない管理画面リンクあり

## 🎨 最新UI改善（2026/01/13）

### ヘッダー最適化
- ✅ **フォントサイズ縮小**: text-3xl → text-xl（約33%削減）
- ✅ **パディング削減**: py-3 → py-2
- ✅ **サブタイトル調整**: text-sm → text-xs、mt-1 → mt-0.5
- 📱 スマホでの表示領域が大幅に拡大

### マイページUI改善
- ✅ **ユーザー情報カードをコンパクト化**
  - グラデーション背景 → シンプルな白背景
  - プロフィール写真: 24×24 → 16×16（約33%削減）
  - padding: 8 → 4
- ✅ **メール通知設定の最適化**
  - ボタンサイズ: p-4 → px-2 py-2.5（50%削減）
  - フォントサイズ: text-sm → text-xs
  - グリッドレイアウト: cols-2 → cols-3（スマホで1.5倍多く表示）
  - gap: 3 → 2

### サイドバーメニュー最適化
- ✅ **カテゴリメニュー縮小**
  - 見出し: text-lg → text-base、mb-4 → mb-3
  - ボタン: px-4 py-3 → px-3 py-2
  - space-y-2 → space-y-1
- ✅ **タグセクション縮小**
  - タグボタン: px-3 py-2 → px-2.5 py-1.5
  - フォントサイズ: text-sm → text-xs
  - gap-2 → gap-1.5

### コード軽量化
- ✅ **重複コード削除**: mypage.jsのescapeHtml関数重複を削除
- ✅ **不要ファイル削除**: バックアップファイル、ドキュメントファイルを削除
- ✅ **ビルド最適化**: 126.67 KB（圧縮済み）

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
- ✅ **会社情報ページ**
  - `/company` - 会社概要（会社名、代表者、資本金、所在地、事業内容）
  - `/contact` - お問い合わせ（メール、所在地、営業時間）
  - `/privacy` - プライバシーポリシー（個人情報保護方針）
  - ヘッダーナビゲーション、サイドバー、フッターからアクセス可能
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
- ✅ **カテゴリ一括ダウンロードボタン（URLカスタマイズ可能）**
  - カテゴリ内のすべてのPDFを一括ダウンロード
  - ✅ **ダウンロード時に全カードを自動的にダウンロード済みに変更**
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

## 🚀 デプロイ

### 本番環境（Cloudflare Pages）

このプロジェクトはCloudflare Pagesにデプロイされています：

```bash
# ビルド
npm run build

# デプロイ
npx wrangler pages deploy dist --project-name akagami-research

# データベースマイグレーション（本番）
npx wrangler d1 migrations apply akagami-research-production --remote
```

### 環境変数設定

本番環境では以下のシークレットが設定されています：

```bash
# JWT Secret（セキュアなランダム文字列）
npx wrangler pages secret put JWT_SECRET --project-name akagami-research

# 管理画面パスワード
npx wrangler pages secret put ADMIN_PASSWORD --project-name akagami-research

# Resend API Key（メール送信用）
npx wrangler pages secret put RESEND_API_KEY --project-name akagami-research
```

### デプロイ後の確認

- **本番URL**: https://fd19dcd3.akagami-research.pages.dev
- **カテゴリAPI**: https://fd19dcd3.akagami-research.pages.dev/api/categories
- **PDF一覧API**: https://fd19dcd3.akagami-research.pages.dev/api/pdfs
- **管理画面**: https://fd19dcd3.akagami-research.pages.dev/admin

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
