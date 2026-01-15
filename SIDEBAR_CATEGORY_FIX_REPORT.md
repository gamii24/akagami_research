# サイドメニューカテゴリ表示修正レポート

## 📋 問題概要

最新ニュース、キーワードチェック、よくある質問ページで、サイドメニューのカテゴリセクションが表示されていませんでした。

## 🔍 根本原因

1. **ニュースページに`app.js`が読み込まれていない**
   - 他のページ（sns-faq, question-finder）には`app.js`が読み込まれていましたが、ニュースページには欠けていました

2. **CSSクラス`.text-darker`が通常モードで定義されていない**
   - ダークモード用のスタイルしか定義されておらず、通常モードではテキストが透明になっていました

3. **カテゴリ数の計算タイミング**
   - `renderCategoryFilter()`が`loadAllPdfsOnce()`の前に呼ばれると、`state.categoryCounts`が空になる問題

## ✅ 実施した修正

### 1. ニュースページに`app.js`を追加（src/index.tsx）

**変更箇所：** `/news`ルート

```tsx
<script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
<script src="/static/utils.js"></script>
<script src="/static/auth.js"></script>
<script src="/static/app.js"></script>  // ← 追加
<script dangerouslySetInnerHTML={{
  __html: `
    // ... ニュースページのスクリプト
  `
}} />
```

### 2. ニュースページの初期化処理を最適化

**変更内容：**
- カテゴリ、タグ、PDFsを並列ロード（`Promise.all`）
- すべてのデータ読み込み後に`renderCategoryFilter()`を一度だけ呼び出し

```javascript
// Initialize categories in sidebar (from app.js)
if (typeof loadCategories === 'function' && typeof renderCategoryFilter === 'function') {
  // Load categories and tags together
  await Promise.all([
    loadCategories(),
    typeof loadTags === 'function' ? loadTags() : Promise.resolve(),
    typeof loadAllPdfsOnce === 'function' ? loadAllPdfsOnce() : Promise.resolve()
  ]);
  
  // Render categories only once, after all data is loaded
  renderCategoryFilter();
}
```

### 3. `.text-darker`クラスを通常モードでも定義（public/static/style.css）

**追加内容：**

```css
.text-darker {
  color: #333333;
}

body.dark-mode .text-darker {
  color: #e0e0e0 !important;
}
```

## 📊 修正結果

### ✅ 動作確認済みページ

1. **最新ニュース** - https://akagami.net/news
   - カテゴリ一覧表示：✅
   - カテゴリ数表示：✅
   - タグ一覧表示：✅

2. **キーワードチェック** - https://akagami.net/question-finder
   - カテゴリ一覧表示：✅（すでに`app.js`読み込み済み）

3. **よくある質問** - https://akagami.net/sns-faq
   - カテゴリ一覧表示：✅（すでに`app.js`読み込み済み）

4. **トップページ** - https://akagami.net/
   - カテゴリ一覧表示：✅（変更なし）

5. **記事詳細** - https://akagami.net/article/threads-us-case-study-2026
   - カテゴリ一覧表示：✅（変更なし）

### 📈 データ

- **カテゴリ数：** 15カテゴリ
- **PDFs総数：** 41件
- **カテゴリ別PDF数：**
  - Instagram: 11件
  - TikTok: 10件
  - ブログ: 5件
  - 画像&動画生成: 5件
  - Threads: 4件
  - テックの偉人: 3件
  - その他: 2件
  - X: 1件

## 🌐 デプロイ情報

- **最新デプロイURL：** https://42c12fe1.akagami-research.pages.dev
- **本番URL：** https://akagami.net
- **デプロイ日時：** 2026-01-15

## 🔧 技術的な詳細

### ファイル変更

1. `src/index.tsx` - ニュースページに`app.js`追加、初期化処理最適化
2. `public/static/app.js` - デバッグログ削除
3. `public/static/style.css` - `.text-darker`クラス追加

### Gitコミット

```bash
git commit -m "修正完了: 全ページでカテゴリフィルタ表示（text-darkerクラス追加）"
```

## ✨ 今後の改善点

1. **CSS変数の統一**
   - `text-darker`のようなカスタムクラスをTailwind CSSの標準クラスに置き換え

2. **初期化処理の統一**
   - すべてのページで同じ初期化ロジックを共有するヘルパー関数を作成

3. **パフォーマンス最適化**
   - `renderCategoryFilter()`の複数回呼び出しを完全に排除

## 📝 備考

- すべてのページで`CommonSidebar`を使用しており、統一されたデザインになっています
- カテゴリフィルタは`app.js`により動的にレンダリングされます
- タグセクションもカテゴリセクションの下に表示されます

---

**作成日：** 2026-01-15  
**最終更新：** 2026-01-15
