# 構造化データ（JSON-LD）実装完了

## 実装内容

### 1. WebSite スキーマ（全ページ）
- サイト名、説明、URL
- 著者情報（Akagami）
- SearchAction（検索機能）
- 言語: ja-JP

### 2. BreadcrumbList（カテゴリページ）
- ホーム → カテゴリ名のパンくずリスト
- 各カテゴリページで自動生成

### 3. CollectionPage（カテゴリページ）
- カテゴリページの説明
- カテゴリに関する情報
- WebSiteとの関連

## 確認URL

### 本番環境
- **Instagram資料**: https://47f74f34.akagami-research.pages.dev/?category=5
- **TikTok資料**: https://47f74f34.akagami-research.pages.dev/?category=6
- **生成AI資料**: https://47f74f34.akagami-research.pages.dev/?category=10
- **YouTube資料**: https://47f74f34.akagami-research.pages.dev/?category=1

## 検証方法

### 1. Google Rich Results Test
https://search.google.com/test/rich-results

以下のURLでテストしてください：
```
https://47f74f34.akagami-research.pages.dev/?category=5
https://47f74f34.akagami-research.pages.dev/?category=10
```

### 2. Schema.org Validator
https://validator.schema.org/

### 3. Google Search Console
- サイトを登録
- URL検査ツールで構造化データを確認
- エンハンスメントレポートで確認

## 期待される効果

### リッチスニペット表示
1. **パンくずリスト**
   ```
   ホーム > Instagram資料
   ```

2. **サイトリンク検索ボックス**
   - Google検索結果に検索ボックスが表示される可能性

3. **コレクションページ情報**
   - カテゴリの説明が検索結果に表示される可能性

## 構造化データの例

### Instagram資料ページ（?category=5）

#### BreadcrumbList
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "ホーム",
      "item": "https://akagami.net/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Instagram資料",
      "item": "https://akagami.net/?category=5"
    }
  ]
}
```

#### CollectionPage
```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Instagram資料 - Akagami Research",
  "description": "Instagramマーケティング・運用戦略に関する資料を無料で公開。投稿戦略、リール活用、フォロワー増加、ストーリーズ運用など実践的なノウハウが満載。",
  "url": "https://akagami.net/?category=5",
  "about": {
    "@type": "Thing",
    "name": "Instagram資料"
  },
  "isPartOf": {
    "@type": "WebSite",
    "name": "Akagami Research",
    "url": "https://akagami.net/"
  },
  "inLanguage": "ja-JP"
}
```

## 次のステップ

1. **Google Search Consoleで確認**
   - URL検査ツールで構造化データが認識されているか確認
   - エラーがないか確認

2. **リッチスニペットの表示を待つ**
   - Googleがクロールしてインデックスするまで数日～数週間かかる可能性があります

3. **追加の構造化データ（オプション）**
   - Article（PDF詳細ページ用）
   - ItemList（PDF一覧用）
   - FAQPage（よくある質問用）

