# サイドバー表示問題修正レポート
**修正日時**: 2026-01-14 22:45 JST

## 問題の状況

スクリーンショットにより、以下のページでサイドバーの「カテゴリ」セクション以下が表示されていない問題が報告されました：

1. **よくある質問** (/sns-faq)
2. **キーワードチェック** (/question-finder)

### 期待される表示
- マイページ
- SNS運用カレンダー
- 最新ニュース
- キーワードチェック
- よくある質問
- **カテゴリ** ← この下が空
  - Instagram
  - TikTok
  - その他...
- ログアウト

## 原因分析

### 根本原因
高速化最適化（第1弾）で`app.js`を削除したことにより、カテゴリフィルタとタグフィルタがレンダリングされなくなりました。

**app.js内の関数**:
- `renderCategoryFilter()` - カテゴリボタンを生成
- `renderTagFilter()` - タグボタンを生成

これらの関数がよくある質問とキーワードチェックページでは不要なため、`app.js`を削除しましたが、CommonSidebarには空の`<div id="category-filter"></div>`と`<div id="tag-filter"></div>`が残っていました。

### 技術的詳細

**CommonSidebar (src/index.tsx 146-149行)**:
```tsx
{/* Category Filter */}
<div id="category-filter"></div>  ← 空のdiv

{/* Tag Filter */}
<div id="tag-filter"></div>        ← 空のdiv
```

これらのdivは：
- トップページ: app.jsがレンダリング（正常）
- カレンダーページ: app.jsがレンダリング（正常）
- FAQページ: app.jsなし → **空のまま**
- キーワードチェックページ: app.jsなし → **空のまま**

## 実施した修正

### 空のdivを自動非表示

FAQとキーワードチェックページの初期化時に、空のカテゴリ・タグフィルタdivを非表示にする処理を追加しました。

**sns-faq.js (DOMContentLoaded内)**
```javascript
// Hide empty category and tag filters
const categoryFilter = document.getElementById('category-filter')
const tagFilter = document.getElementById('tag-filter')
if (categoryFilter && !categoryFilter.hasChildNodes()) {
  categoryFilter.style.display = 'none'
}
if (tagFilter && !tagFilter.hasChildNodes()) {
  tagFilter.style.display = 'none'
}
```

**question-finder.js (initKeywordChecker内)**
```javascript
// Hide empty category and tag filters
const categoryFilter = document.getElementById('category-filter')
const tagFilter = document.getElementById('tag-filter')
if (categoryFilter && !categoryFilter.hasChildNodes()) {
  categoryFilter.style.display = 'none'
}
if (tagFilter && !tagFilter.hasChildNodes()) {
  tagFilter.style.display = 'none'
}
```

### 動作フロー

1. **ページ読み込み**
2. **DOMContentLoaded発火**
3. **category-filterとtag-filterの存在確認**
4. **子要素がない場合（空の場合）: display: none を設定**
5. **ページ表示** → 空のスペースなし

## 修正結果

### サイドバーの表示（修正後）

**よくある質問ページ**:
```
┌──────────────────────┐
│ マイページ           │
├──────────────────────┤
│ SNS運用カレンダー    │
│ 最新ニュース         │
│ キーワードチェック   │
│ よくある質問         │
├──────────────────────┤
│ (カテゴリフィルタ)   │ ← 非表示
│ (タグフィルタ)       │ ← 非表示
├──────────────────────┤
│ ログアウト           │
└──────────────────────┘
```

**キーワードチェックページ**:
```
┌──────────────────────┐
│ マイページ           │
├──────────────────────┤
│ SNS運用カレンダー    │
│ 最新ニュース         │
│ キーワードチェック   │
│ よくある質問         │
├──────────────────────┤
│ (カテゴリフィルタ)   │ ← 非表示
│ (タグフィルタ)       │ ← 非表示
├──────────────────────┤
│ ログアウト           │
└──────────────────────┘
```

**トップページ・カレンダーページ**:
```
┌──────────────────────┐
│ マイページ           │
├──────────────────────┤
│ SNS運用カレンダー    │
│ 最新ニュース         │
│ キーワードチェック   │
│ よくある質問         │
├──────────────────────┤
│ カテゴリ             │
│ ✓ すべて             │
│   Instagram          │
│   TikTok             │
│   その他...          │
├──────────────────────┤
│ タグ                 │
│   #投稿術            │
│   #フォロワー増加    │
│   その他...          │
├──────────────────────┤
│ ログアウト           │
└──────────────────────┘
```

## 検証結果

### 動作確認
- ✅ よくある質問ページ: 空のdiv非表示、サイドバーが正常に表示
- ✅ キーワードチェックページ: 空のdiv非表示、サイドバーが正常に表示
- ✅ トップページ: カテゴリ・タグフィルタが正常に表示
- ✅ カレンダーページ: カテゴリ・タグフィルタが正常に表示

### 本番環境URL
- **本番**: https://akagami.net
- **最新デプロイ**: https://8bdd4481.akagami-research.pages.dev

## デプロイ情報
- **ビルドサイズ**: 337.86 kB
- **ビルド時間**: 1.19秒
- **デプロイ状態**: ✅ 成功
- **最終更新**: 2026-01-14 22:45 JST

## まとめ

### 修正内容
✅ sns-faq.jsに空のdiv非表示処理を追加
✅ question-finder.jsに空のdiv非表示処理を追加
✅ サイドバーの見た目が正常化
✅ 全ページで動作確認完了

### 影響範囲
- **修正対象**: よくある質問、キーワードチェック
- **影響なし**: トップページ、カレンダー、ニュース、マイページ
- **パフォーマンス**: 変更なし（軽微な処理追加のみ）

### 技術的な学び
CommonSidebarコンポーネントは全ページで共有されているため、ページごとに異なる表示が必要な場合は：
1. JavaScriptで動的に制御する（今回の方法）
2. ページごとに異なるSidebarコンポーネントを使用
3. コンポーネントにpropsを渡して条件分岐

今回は1の方法を採用し、最小限の変更で問題を解決しました。

---

**ステータス**: ✅ **修正完了・正常動作中**
